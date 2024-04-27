// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {UltraVerifier} from "./prover/plonk_vk.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {GameLib} from "./lib/GameLib.sol";

import "./interfaces/IZKGuesser.sol";

contract ZKGuesser is Ownable, IZKGuesser {
    UltraVerifier public _verifier;

    uint256 public _nextGameId;
    mapping(uint256 => Game) public _games;
    // Game => Player Index => Score
    mapping(uint256 => mapping(uint8 => uint256)) public _scores;
    // Player => Total Score
    mapping(address => uint256) public _totalScores;
    // GameID => Player Index => Current Round
    mapping(uint256 => mapping(uint8 => uint8)) public _currentRound;

    constructor(address verifier_, address initialOwner_) Ownable(initialOwner_) {
        _verifier = UltraVerifier(verifier_);
    }

    function createGame() public returns (uint256) {
        uint256 gameId = _nextGameId;
        _games[gameId] = Game({id: gameId, totalRounds: GameLib.MAX_ROUNDS, totalPlayers: 1, players: new address[](8)});

        _games[_nextGameId].players[0] = msg.sender;
        _nextGameId++;
        return gameId;
    }

    function joinGame(uint256 _gameId) public {
        if (_gameId >= _nextGameId) {
            revert GameNotExists(_gameId);
        }
        Game storage game = _games[_gameId];

        if (GameLib.playerExists(game, msg.sender) < GameLib.MAX_PLAYERS) {
            revert PlayerAlreadyJoined(_gameId, msg.sender);
        }

        if (GameLib.isFull(game)) {
            revert GameFull(_gameId);
        }

        game.players[game.totalPlayers] = msg.sender;
        game.totalPlayers++;
    }

    function makeGuess(uint256 _gameId, bytes calldata _proof) public returns (uint256) {
        if (_gameId >= _nextGameId) {
            revert GameNotExists(_gameId);
        }

        Game storage game = _games[_gameId];
        uint8 playerIdx = GameLib.playerExists(game, msg.sender);

        if (playerIdx == GameLib.MAX_PLAYERS) {
            revert InvalidPlayer(_gameId, msg.sender);
        }

        uint8 currentRound = _currentRound[_gameId][playerIdx];
        if (currentRound >= game.totalRounds) {
            revert InvalidRound(_gameId, msg.sender, currentRound);
        }

        _currentRound[_gameId][playerIdx]++;

        uint256 score = getScore(msg.sender, game, currentRound, _proof);
        _scores[_gameId][playerIdx] += score;
        _totalScores[msg.sender] += score;
        return score;
    }

    function getScore(address player, Game memory game, uint8 currentRound, bytes calldata _proof)
        internal
        view
        returns (uint256)
    {
        bytes32[] memory _publicInputs = new bytes32[](35);
        bytes32[32] memory messageHash = GameLib.createHashMessage(player, game.id, currentRound);

        _publicInputs[2] = GameLib.padAddress(owner());
        for (uint256 i = 0; i < 32; i++) {
            _publicInputs[i + 3] = messageHash[i];
        }

        uint256 score = 0;

        _publicInputs[0] = GameLib.ONE;
        _publicInputs[1] = GameLib.THOUSAND;

        try _verifier.verify(_proof, _publicInputs) returns (bool result) {
            if (result) score = 10;
        } catch {}

        _publicInputs[0] = GameLib.THOUSAND;
        _publicInputs[1] = GameLib.FIVE_THOUSAND;
        try _verifier.verify(_proof, _publicInputs) returns (bool result) {
            if (result) score = 6;
        } catch {}

        _publicInputs[0] = GameLib.FIVE_THOUSAND;
        _publicInputs[1] = GameLib.TEN_THOUSAND;
        try _verifier.verify(_proof, _publicInputs) returns (bool result) {
            if (result) score = 3;
        } catch {}

        _publicInputs[0] = GameLib.TEN_THOUSAND;
        _publicInputs[1] = GameLib.TWENTY_THOUSAND;
        try _verifier.verify(_proof, _publicInputs) returns (bool result) {
            if (result) score = 1;
        } catch {}

        return score * (GameLib.BASE_REWARD) * (10 ** GameLib.DECIMALS);
    }

    function getSigningMessage(address _player, uint256 _gameId) public view returns (bytes32) {
        Game storage game = _games[_gameId];
        uint8 playerIdx = GameLib.playerExists(game, msg.sender);
        uint8 currentRound = _currentRound[_gameId][playerIdx];
        bytes32 message = keccak256(abi.encodePacked(_player, _gameId, currentRound));
        return message;
    }

    function getPlayerIndex(address _player, uint256 _gameId) public view returns (uint8) {
        Game storage game = _games[_gameId];
        return GameLib.playerExists(game, _player);
    }
}
