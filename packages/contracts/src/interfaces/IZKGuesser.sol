// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

struct Game {
    uint256 id;
    uint8 totalRounds;
    uint8 totalPlayers;
    address[] players;
}

error GameNotExists(uint256 _gameId);
error PlayerAlreadyJoined(uint256 _gameId, address player);
error GameEnded(uint256 _gameId);
error GameFull(uint256 _gameId);
error InvalidPlayer(uint256 _gameId, address player);
error InvalidRound(uint256 _gameId, address player, uint8 round);
error InvalidProof(uint256 _gameId, address player, uint8 round);

interface IZKGuesser {
    function createGame() external returns (uint256);
    function joinGame(uint256 _gameId) external;
    function makeGuess(uint256 _gameId, bytes32 range_start, bytes32 range_end, bytes calldata _proof)
        external
        returns (uint256);

    function getPlayerIndex(address _player, uint256 _gameId) external returns (uint8);
}
