// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

struct Game {
    uint256 id;
    uint8 totalRounds;
    uint256 startTime;
    uint8 totalPlayers;
    address[] players;
}

struct Player {
    address addr;
    uint256 score;
    uint8 currentRound;
}

error GameNotExists(uint256 _gameId);
error PlayerAlreadyJoined(uint256 _gameId, address player);
error GameEnded(uint256 _gameId);
error GameFull(uint256 _gameId);
error InvalidPlayer(uint256 _gameId, address player);
error InvalidRound(uint256 _gameId, address player, uint8 round);

interface IZKGuesser {
    function createGame() external returns (uint256);
    function joinGame(uint256 _gameId) external;
}
