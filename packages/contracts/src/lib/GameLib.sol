// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "../interfaces/IZKGuesser.sol";

library GameLib {
    uint8 public constant MAX_PLAYERS = 8;
    uint8 public constant MAX_ROUNDS = 8;
    uint8 public constant TIME_PER_ROUND = 3 minutes;
    uint256 public constant BASE_REWARD = 100;
    uint256 public constant TIME_MULTIPLIER = 1;

    uint256 public constant DECIMALS = 6;

    bytes32 public constant ONE = bytes32(0x0000000000000000000000000000000000000000000000000000000000000001);
    bytes32 public constant THOUSAND = bytes32(0x00000000000000000000000000000000000000000000000000000000000003e8);
    bytes32 public constant FIVE_THOUSAND = bytes32(0x0000000000000000000000000000000000000000000000000000000000001388);
    bytes32 public constant TEN_THOUSAND = bytes32(0x0000000000000000000000000000000000000000000000000000000000002710);

    function playerExists(Game memory _game, address _player) internal pure returns (uint8) {
        for (uint8 i = 0; i < _game.totalPlayers; i++) {
            if (_game.players[i] == _player) {
                return i;
            }
        }
        return MAX_PLAYERS;
    }

    function isGameEnded(Game memory _game) internal view returns (bool) {
        return block.timestamp >= _game.startTime + uint256(MAX_ROUNDS) * uint256(TIME_PER_ROUND);
    }

    function isFull(Game memory _game) internal pure returns (bool) {
        return _game.totalPlayers == MAX_PLAYERS;
    }

    function getCurrentRound(Game memory _game) internal view returns (uint8) {
        if (isGameEnded(_game)) {
            revert GameEnded(_game.id);
        }

        uint256 timePassed = block.timestamp - _game.startTime;
        uint8 currentRound = uint8(timePassed / TIME_PER_ROUND);
        return currentRound;
    }

    function getMessageHash(address player, uint256 _gameId, uint8 _currentRound) public pure returns (bytes32) {
        bytes32 message = keccak256(abi.encodePacked(player, _gameId, _currentRound));
        return message;
    }

    function createHashMessage(address player, uint256 _gameId, uint8 _currentRound)
        public
        pure
        returns (bytes32[32] memory)
    {
        bytes32 hashedMessage = MessageHashUtils.toEthSignedMessageHash(getMessageHash(player, _gameId, _currentRound));
        bytes32[32] memory result;

        for (uint256 i = 0; i < 32; i++) {
            result[i] = bytes32((uint256(hashedMessage) >> (8 * (31 - i))) & 0xFF);
        }

        return result;
    }

    function padAddress(address addr) public pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }
}
