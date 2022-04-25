const TeslaCollection = artifacts.require("TeslaCollection.sol");


module.exports = async function (deployer, network, accounts) {
  console.log(`\n${network}, ${accounts}\n`);

  deployer.then(async () => {
    console.log('Deploying TeslaCollection...');
    const teslaCollection = await deployer.deploy(TeslaCollection, { from: accounts[0] });
    console.log(`TeslaCollection deployed: ${teslaCollection.address}`);

    console.log('Minting...');
    await teslaCollection.mint(["0", "1", "2", "3", "4"], { from: accounts[0] });
    console.log('Minting finished');
  });
    
};