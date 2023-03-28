const { expect } = require("chai");
const toWei = (value) => ethers.utils.parseEther(value.toString());

const fromWei = (value) =>
    ethers.utils.formatEther(
        typeof value === "string" ? value : value.toString()
    );

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
        await bank.deposit({value: toWei(10)});
        await attackC.attack({value: toWei(1)});
        expect(await bank.getBalance()).to.equal(0);
        expect(await attackC.getBalance()).to.equal(toWei(11));
    });

    it("Should right", async () => {
        await bank.deposit({value: toWei(10)});
        await attackC.attackRight({value: toWei(1)});
        expect(await bank.getBalance()).to.equal(toWei(10));
        expect(await attackC.getBalance()).to.equal(toWei(11));
    });

});