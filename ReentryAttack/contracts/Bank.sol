// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "hardhat/console.sol";

contract Bank {
    mapping (address => uint256) public balanceOf;    // 余额mapping
    uint256 private _status;    // 重入锁
    // 存入ether，并更新余额
    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;
    }

    // 提取msg.sender的全部ether - 容易被攻击的代码
    function withdrawAttack() external {
        uint256 balance = balanceOf[msg.sender]; // 获取余额
        require(balance > 0, "Insufficient balance");
        // 转账 ether !!! 可能激活恶意合约的fallback/receive函数，有重入风险！
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Failed to send Ether");
        // 更新余额
        balanceOf[msg.sender] = 0;
    }

    // 解决方法1：检查-影响-交互模式
    function withdrawRight1() external {
        uint256 balance = balanceOf[msg.sender];
        require(balance > 0, "Insufficient balance");
        // 检查-效果-交互模式（checks-effect-interaction）：先更新余额变化，再发送ETH
        // 重入攻击的时候，balanceOf[msg.sender]已经被更新为0了，不能通过上面的检查。
        balanceOf[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Failed to send Ether");
    }
    // 解决方法2: 重入锁
    // 用重入锁保护有漏洞的函数
    function withdrawRight2() external nonReentrant{
        console.log(" status: %s",_status);
        uint256 balance = balanceOf[msg.sender];
        require(balance > 0, "Insufficient balance");

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Failed to send Ether");

        balanceOf[msg.sender] = 0;
    }

    // 获取银行合约的余额
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    modifier nonReentrant() {
        // 在第一次调用 nonReentrant 时，_status 将是 0
        require(_status == 0, "ReentrancyGuard: reentrant call");
        // 在此之后对 nonReentrant 的任何调用都将失败
        _status = 1;
        _;
        // 调用结束，将 _status 恢复为0
        _status = 0;
    }
}