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

    it("Should be ", async () => {
        expect(owner.address).to.eq(await sigReplay.signer_1());
        console.log(`signer_1: ${await sigReplay.signer_1()}`);
        // 交易 hash
        console.log(`user.address: ${user.address}`);
        const messageHash = await sigReplay.getMessageHash(user.address, 1000);
        console.log(`messageHash: ${messageHash}`);
        const ethHash = await sigReplay.toEthSignedMessageHash(messageHash)
        console.log(`ethHash: ${ethHash}`);
        // user 账户签名()
        const signature = await owner.signMessage(ethHash);
        // 验证签名
        const address = await verifyMessage(ethHash, signature);
        console.log(`address: ${address}`);
        
        const verifyAddress = await sigReplay.verifyAddress(ethHash, signature);
        console.log(`verifyAddress: ${verifyAddress}`);

        // 签名重放
        // await sigReplay.badMint(user.address, 1000, signature);
    });
});