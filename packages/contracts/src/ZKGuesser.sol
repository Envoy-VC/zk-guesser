// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {UltraVerifier} from "./prover/plonk_vk.sol";

contract ZKGuesser {
    UltraVerifier public _verifier;

    constructor(address verifier_) {
        _verifier = UltraVerifier(verifier_);
    }

    function execute(bytes calldata _proof, bytes32[] calldata _publicInputs) public view returns (bool) {
        bool result = _verifier.verify(_proof, _publicInputs);
        return result;
    }
}
