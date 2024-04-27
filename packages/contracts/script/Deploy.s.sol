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

// source .env && forge script script/Deploy.s.sol:DeployScript --rpc-url $SCROLL_SEPOLIA_RPC --broadcast --verify -vvvv

// 		"verify": "source .env && forge verify-contract 0xe86b1899376c77e1a109eA2124E462EF58E56897 src/BattleshipX.sol:BattleshipX --watch --chain-id 421614 --constructor-args $(cast abi-encode 'constructor(string,uint256,address,uint16)' '' 10000 0xe269688F24e1C7487f649fC3dCD99A4Bf15bDaA1 0) --libraries src/lib/BattleshipURI.sol:BattleshipURI:0x8f966BC6Ad2D241a01C1f7634C47c7419Ce96830"
