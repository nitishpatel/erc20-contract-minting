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

    expect(await WrapperController.mint(deployer, 1000, 123)).not.to.be.reverted;
    expect(await ERC20.balanceOf(deployer)).to.equal(1000);
  });
  it("should not allow to mint from deployer account", async function () {
    const { deployer } = await getNamedAccounts();
    await expect(ERC20.mint(deployer, 1000)).to.be.revertedWith("Ownable: caller is not the owner");
  });
  it("should mint and then burn the tokens", async () => {
    const { deployer } = await getNamedAccounts();
    await WrapperController.mint(deployer, 1000, 123);
    await WrapperController.mint(deployer, 1000, 124);
    expect(await ERC20.transfer(WrapperController.address, 1000)).not.to.be.reverted;
    expect(await WrapperController.burn([800, 200], [123, 124])).not.to.be.reverted;
    console.log(await WrapperController.getReAssignment(0));
    expect(await WrapperController.getBarBalance(123)).to.equal(1000);
    expect(await WrapperController.getBarBalance(124)).to.equal(0);
  })
  it("should mint and then burn the tokens", async () => {
    const { deployer } = await getNamedAccounts();
    await WrapperController.mint(deployer, 1000, 123);
    await WrapperController.mint(deployer, 1000, 124);
    expect(await ERC20.transfer(WrapperController.address, 1000)).not.to.be.reverted;
    expect(await WrapperController.burn([200, 800], [123, 124])).not.to.be.reverted;
    console.log(await WrapperController.getReAssignment(0));
    expect(await WrapperController.getBarBalance(123)).to.equal(1000);
    expect(await WrapperController.getBarBalance(124)).to.equal(0);
  })

});
