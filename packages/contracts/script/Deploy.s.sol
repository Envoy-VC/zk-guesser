// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import {UltraVerifier} from "../src/prover/plonk_vk.sol";
import {ZKGuesser} from "../src/ZKGuesser.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying ZKGuesser with deployer address", deployerAddress);

        UltraVerifier verifier = new UltraVerifier();
        ZKGuesser zkGuesser = new ZKGuesser(address(verifier), deployerAddress);

        console.log("Deploying UltraVerifier at address: %s", address(verifier));
        console.log("Deployed ZKGuesser at address: %s", address(zkGuesser));
        vm.stopBroadcast();
    }
}
