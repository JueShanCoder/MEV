const { equal } = require("assert");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const toWei = (value) => ethers.utils.parseEther(value.toString());

const fromWei = (value) =>
    ethers.utils.formatEther(
        typeof value === "string" ? value : value.toString()
    );

describe("SelectorClash", function() {
  let selectorClash;
  let user;
  let owner;

  beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
      const SelectorClash = await ethers.getContractFactory("SelectorClash");
      selectorClash = await SelectorClash.deploy();
      await selectorClash.deployed();

      console.log(`selectorClash is ${selectorClash.address}`);
  });

  it("Should be true", async () => {
    // await selectorClash.connect(user).putCurEpochConPubKeyBytes();
    const bytes = ethers.utils.arrayify("0x6631313231333138303933");
    const bytes1 = new Uint8Array(4);
    bytes1[0] = 0x12;
    await selectorClash.executeCrossChainTx(bytes, bytes1, bytes1, bytes1);
    expect(await selectorClash.solved()).to.equal(true);
  });
});