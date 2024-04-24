// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2 as console} from "forge-std/Test.sol";
import {ZKGuesser} from "../src/ZKGuesser.sol";
import {UltraVerifier} from "../src/prover/plonk_vk.sol";

contract ZKGuesserTest is Test {
    UltraVerifier public prover;
    ZKGuesser public zkGuesser;

    function setUp() public {
        prover = new UltraVerifier();
        zkGuesser = new ZKGuesser(address(prover));
    }

    function test_deployment() external view {
        console.log("Deployed ZKGuesser at address: %s", address(zkGuesser));
        console.log("Deployed UltraVerifier at address: %s", address(prover));
        assertEq(address(zkGuesser._verifier()), address(prover));
    }

    function test_execute() external view {
        string memory proof = vm.readLine("./proofs/1.proof");
        bytes memory proofBytes = vm.parseBytes(proof);
        bytes32[] memory publicInputs = new bytes32[](2);
        publicInputs[0] = bytes32(0x0000000000000000000000000000000000000000000000000000000000000001);
        publicInputs[1] = bytes32(0x00000000000000000000000000000000000000000000000000000000000003e8);

        bool result = zkGuesser.execute(proofBytes, publicInputs);
        console.log("Result: %s", result);
    }
}
