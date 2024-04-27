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

    modifier gameExists(uint256 _gameId) {
        if (_gameId >= _nextGameId) {
            revert GameNotExists(_gameId);
        }
        _;
    }

    function createGame() public returns (uint256) {
        uint256 gameId = _nextGameId;
        _games[gameId] = Game({id: gameId, totalRounds: GameLib.MAX_ROUNDS, totalPlayers: 1, players: new address[](8)});

        _games[_nextGameId].players[0] = msg.sender;
        _nextGameId++;
        return gameId;
    }

    function joinGame(uint256 _gameId) public gameExists(_gameId) {
        Game storage game = _games[_gameId];

        uint8 playerIdx = GameLib.getPlayerIndex(game, msg.sender);

        if (playerIdx < GameLib.MAX_PLAYERS) {
            revert PlayerAlreadyJoined(_gameId, msg.sender);
        }

        if (GameLib.isFull(game)) {
            revert GameFull(_gameId);
        }

        game.players[game.totalPlayers] = msg.sender;
        game.totalPlayers++;
    }

    function makeGuess(uint256 _gameId, bytes32 range_start, bytes32 range_end, bytes calldata _proof)
        public
        gameExists(_gameId)
        returns (uint256)
    {
        Game storage game = _games[_gameId];
        uint8 playerIdx = GameLib.getPlayerIndex(game, msg.sender);
        // Check if Player Exists
        if (playerIdx == GameLib.MAX_PLAYERS) {
            revert InvalidPlayer(_gameId, msg.sender);
        }

        // Check if all rounds are over
        uint8 currentRound = _currentRound[_gameId][playerIdx];
        if (currentRound > game.totalRounds) {
            revert InvalidRound(_gameId, msg.sender, currentRound);
        }

        // Get Score according to Range
        uint256 score = GameLib.getScore(range_start, range_end);

        // Verify Proof of Score
        bytes32 start = range_start;
        bytes32 end = range_end;
        uint256 gameId = _gameId;

        bytes32[32] memory messageHash = GameLib.createHashMessage(msg.sender, game.id, currentRound, start, end);

        bytes32[] memory _publicInputs = new bytes32[](35);
        _publicInputs[0] = start;
        _publicInputs[1] = end;
        _publicInputs[2] = GameLib.padAddress(owner());
        for (uint256 i = 0; i < 32; i++) {
            _publicInputs[i + 3] = messageHash[i];
        }

        bool success = _verifier.verify(_proof, _publicInputs);

        if (!success) {
            revert InvalidProof(gameId, msg.sender, currentRound);
        }

        // Update State Variables
        _currentRound[gameId][playerIdx]++;
        _scores[gameId][playerIdx] += score;
        _totalScores[msg.sender] += score;
        return score;
    }

    function getPlayerIndex(address _player, uint256 _gameId) public view returns (uint8) {
        Game storage game = _games[_gameId];
        return GameLib.getPlayerIndex(game, _player);
    }
}
