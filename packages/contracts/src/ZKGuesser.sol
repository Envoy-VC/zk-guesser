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
    // Game => Player Index => Current Round
    mapping(uint256 => mapping(uint8 => uint256)) public _currentRound;

    constructor(address verifier_, address initialOwner_) Ownable(initialOwner_) {
        _verifier = UltraVerifier(verifier_);
    }

    function createGame() public returns (uint256) {
        uint256 gameId = _nextGameId;
        _games[gameId] = Game({
            id: gameId,
            totalRounds: GameLib.MAX_ROUNDS,
            startTime: block.timestamp,
            totalPlayers: 1,
            players: new address[](8)
        });

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

        if (GameLib.isGameEnded(game)) {
            revert GameEnded(_gameId);
        }

        if (GameLib.isFull(game)) {
            revert GameFull(_gameId);
        }

        game.players[game.totalPlayers] = msg.sender;
        game.totalPlayers++;
    }

    function makeGuess(uint256 _gameId, bytes calldata _proof) public {
        if (_gameId >= _nextGameId) {
            revert GameNotExists(_gameId);
        }

        Game storage game = _games[_gameId];
        uint8 playerIdx = GameLib.playerExists(game, msg.sender);

        if (playerIdx == GameLib.MAX_PLAYERS) {
            revert InvalidPlayer(_gameId, msg.sender);
        }

        uint8 currentRound = GameLib.getCurrentRound(game);
        if (_currentRound[_gameId][playerIdx] > currentRound) {
            revert InvalidRound(_gameId, msg.sender, currentRound);
        }

        _currentRound[_gameId][playerIdx] = currentRound + 1;

        uint256 score = getScore(msg.sender, _gameId, currentRound, _proof);
        _scores[_gameId][playerIdx] += score;
    }

    function getScore(address player, uint256 _gameId, uint8 currentRound, bytes calldata _proof)
        internal
        view
        returns (uint256)
    {
        bytes32[] memory _publicInputs = new bytes32[](35);
        bytes32[32] memory messageHash = GameLib.createHashMessage(player, _gameId, currentRound);

        _publicInputs[2] = GameLib.padAddress(owner());
        for (uint256 i = 0; i < 32; i++) {
            _publicInputs[i + 3] = messageHash[i];
        }

        // TRY with range (0,1000)
        _publicInputs[0] = GameLib.ONE;
        _publicInputs[1] = GameLib.THOUSAND;

        try _verifier.verify(_proof, _publicInputs) returns (bool result) {
            if (result) return 10;
        } catch {}

        // // TRY with range (1000,5000)
        // _publicInputs[0] = GameLib.THOUSAND;
        // _publicInputs[1] = GameLib.FIVE_THOUSAND;
        // try _verifier.verify(_proof, _publicInputs) returns (bool result) {
        //     if (result) return 5;
        // } catch {}

        // // TRY with range (5000,10000)
        // _publicInputs[0] = GameLib.FIVE_THOUSAND;
        // _publicInputs[1] = GameLib.TEN_THOUSAND;
        // try _verifier.verify(_proof, _publicInputs) returns (bool result) {
        //     if (result) return 1;
        // } catch {}

        return 0;
    }
}
