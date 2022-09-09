// deploy/00_deploy_my_contract.js
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const { address: tokenAddress } = await deploy('MyToken', {
        from: deployer,
        args: [],
        log: true,
    });
    console.log(tokenAddress);
    const { address: wrapperAddress } = await deploy('WrapperController', {
        from: deployer,
        args: [tokenAddress],
        log: true,

    });
    const token = await ethers.getContractAt('MyToken', tokenAddress);
    await token.transferOwnership(wrapperAddress);
};
module.exports.tags = ['MyToken'];