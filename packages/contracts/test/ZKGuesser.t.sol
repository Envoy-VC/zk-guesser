// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2 as console, Vm} from "forge-std/Test.sol";
import {UltraVerifier} from "../src/prover/plonk_vk.sol";

import {ZKGuesser} from "../src/ZKGuesser.sol";
import {GameLib} from "../src/lib/GameLib.sol";
import "../src/interfaces/IZKGuesser.sol";

contract ZKGuesserTest is Test {
    UltraVerifier public prover;
    ZKGuesser public zkGuesser;
    Vm.Wallet public owner;
    Vm.Wallet public user;

    function setUp() public {
        owner = vm.createWallet(0xf03e0d12c515d029737a1667a0aa032ede7b750f512475c8564aa04e0d7b4797);
        user = vm.createWallet("user");
        prover = new UltraVerifier();
        zkGuesser = new ZKGuesser(address(prover), owner.addr);
    }

    function test_deployment() external view {
        console.log("Deployed ZKGuesser at address: %s", address(zkGuesser));
        console.log("Deployed UltraVerifier at address: %s", address(prover));
        assertEq(address(zkGuesser._verifier()), address(prover));
    }

    function test_createGame() external {
        vm.startPrank(user.addr);
        zkGuesser.createGame();
        vm.stopPrank();
    }

    function test_makeGuess() external {
        vm.startPrank(user.addr);
        uint256 gameId = zkGuesser.createGame();

        string memory proof = vm.readLine("../circuits/proofs/zk_guesser.proof");
        bytes memory proofBytes = vm.parseBytes(proof);

        uint256 score = zkGuesser.makeGuess(gameId, proofBytes);
        assert(score == 190000000000000000);
        // 0 min - 190000000000000000
        // 1 min - 160000000000000000
        // 2 min - 130000000000000000
        // 3 min - 100500000000000000
    }
}
