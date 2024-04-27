// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "../interfaces/IZKGuesser.sol";

library GameLib {
    uint8 public constant MAX_PLAYERS = 8;
    uint8 public constant MAX_ROUNDS = 8;
    uint256 public constant BASE_REWARD = 10;

    uint256 public constant DECIMALS = 6;

    bytes32 public constant ONE = bytes32(0x0000000000000000000000000000000000000000000000000000000000000001);
    bytes32 public constant FIVE_HUNDRED = bytes32(0x00000000000000000000000000000000000000000000000000000000000001F4);
    bytes32 public constant THOUSAND = bytes32(0x00000000000000000000000000000000000000000000000000000000000003e8);
    bytes32 public constant THREE_THOUSAND = bytes32(0x0000000000000000000000000000000000000000000000000000000000000BB8);

    bytes32 public constant FIVE_THOUSAND = bytes32(0x0000000000000000000000000000000000000000000000000000000000001388);
    bytes32 public constant TEN_THOUSAND = bytes32(0x0000000000000000000000000000000000000000000000000000000000002710);
    bytes32 public constant TWENTY_THOUSAND =
        bytes32(0x0000000000000000000000000000000000000000000000000000000000004E20);

    function getScore(bytes32 start, bytes32 end) public pure returns (uint256) {
        uint256 score = 0;
        if (start == ONE && end == FIVE_HUNDRED) {
            score = 100;
        } else if (start == FIVE_HUNDRED && end == THOUSAND) {
            score = 80;
        } else if (start == THOUSAND && end == THREE_THOUSAND) {
            score = 50;
        } else if (start == THREE_THOUSAND && end == FIVE_THOUSAND) {
            score = 30;
        } else if (start == FIVE_THOUSAND && end == TEN_THOUSAND) {
            score = 20;
        } else if (start == TEN_THOUSAND && end == TWENTY_THOUSAND) {
            score = 1;
        } else {
            score = 0;
        }

        return score * BASE_REWARD * (10 ** DECIMALS);
    }

    function getPlayerIndex(Game memory _game, address _player) internal pure returns (uint8) {
        for (uint8 i = 0; i < _game.totalPlayers; i++) {
            if (_game.players[i] == _player) {
                return i;
            }
        }
        return MAX_PLAYERS;
    }

    function isFull(Game memory _game) internal pure returns (bool) {
        return _game.totalPlayers == MAX_PLAYERS;
    }

    function createHashMessage(address player, uint256 _gameId, uint8 _currentRound, bytes32 start, bytes32 end)
        public
        pure
        returns (bytes32[32] memory)
    {
        bytes32 message = keccak256(abi.encodePacked(player, _gameId, _currentRound, start, end));
        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(message);
        bytes32[32] memory result;

        for (uint256 i = 0; i < 32; i++) {
            result[i] = bytes32((uint256(digest) >> (8 * (31 - i))) & 0xFF);
        }

        return result;
    }

    function padAddress(address addr) public pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }
}
