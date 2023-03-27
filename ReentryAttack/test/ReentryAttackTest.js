const { expect } = require("chai");


describe("ReentryAttack", function() {
    let attackC;
    let bank;
    let owner;
    let user;

    beforeEach(async () => {
        const [owner, user] = await ethers.getSigners();
        const Bank = await ethers.getContractFactory("Bank");
        bank = await Bank.deploy();
        await bank.deployed();

        const Attack = await ethers.getContractFactory("Attack");
        attackC = await Attack.deploy(bank.address);
        await attackC.deployed();
        console.log(`bankAddress is ${bank.address}`);
        console.log(`attackAddress is ${attackC.address}`);
    });

    it("Should attack", async () => {
        await bank.deposit({value: 20});
        await attackC.attack({value: 1});
        expect(await bank.getBalance()).to.equal(0);
        expect(await attackC.getBalance(owner.address)).to.equal(21);
    });

});