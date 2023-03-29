const { expect } = require("chai");
const toWei = (value) => ethers.utils.parseEther(value.toString());

const fromWei = (value) =>
    ethers.utils.formatEther(
        typeof value === "string" ? value : value.toString()
    );

describe("Overflow", function() {
    let overflowAddress ;
    let owner;
    let user;
    beforeEach(async () => {
        [owner, user] = await ethers.getSigners()
        const MyContract = await ethers.getContractFactory("Overflow");
        overflowAddress = await MyContract.deploy(100);
        await overflowAddress.deployed();
        console.log(`overflowAddress is ${overflowAddress.address}`);
        console.log(`owner is ${owner.address}`);
        console.log(`user is ${user.address}`);

    });

    it("Should get a lot of token", async () => {
        console.log(`before balance：${await overflowAddress.balanceOf(owner.address)}`);
        overflowAddress.transfer(user.address, 1000);
        console.log(`after owner balance：${await overflowAddress.balanceOf(owner.address)}`);
        console.log(`after user balance：${await overflowAddress.balanceOf(user.address)}`);
    })
});