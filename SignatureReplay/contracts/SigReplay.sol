// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SigReplay is ERC20 {
    address public signer_1;

    constructor() ERC20("SigReplay", "Replay") {
        signer_1 = msg.sender;
    }

    function badMint(address to, uint amount, bytes memory signature) public {
        bytes32 _msgHash = ECDSA.toEthSignedMessageHash(getMessageHash(to, amount));
        require(verify(_msgHash, signature), "Invalid signature");
        _mint(to, amount);
    }

    function getMessageHash(address to, uint256 amount) public pure returns(bytes32){
        return keccak256(abi.encodePacked(to, amount));
    }

    function toEthSignedMessageHash(bytes32 hash) public pure returns (bytes32) {
        // 哈希的长度为32
        return ECDSA.toEthSignedMessageHash(hash);
    }

    function verify(bytes32 _msgHash, bytes memory _signature) public view returns (bool){
        return ECDSA.recover(_msgHash, _signature) == signer_1;
    }

    function verifyAddress(bytes32 _msgHash, bytes memory _signature) public view returns (address){
        return ECDSA.recover(_msgHash, _signature);
    }
}