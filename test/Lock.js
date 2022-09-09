const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");

describe("ERC20", function () {
  let WrapperController, ERC20;
  beforeEach(async () => {
    await deployments.fixture(["MyToken", "WrapperController"]);
    const { deployer } = await getNamedAccounts();
    WrapperController = await ethers.getContract(
      "WrapperController",
      deployer
    );
    ERC20 = await ethers.getContract("MyToken", deployer);
  });

  it("should mint tokens", async function () {
    const { deployer } = await getNamedAccounts();

    expect(await WrapperController.mint(deployer, 1000, "BAR123", "WARRANT456")).not.to.be.reverted;
    expect(await ERC20.balanceOf(deployer)).to.equal(1000);
  });
  it("should not allow to mint from deployer account", async function () {
    const { deployer } = await getNamedAccounts();
    await expect(ERC20.mint(deployer, 1000)).to.be.revertedWith("Ownable: caller is not the owner");
  });


});
