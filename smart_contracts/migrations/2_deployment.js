const TeslaCollection = artifacts.require("TeslaCollection.sol");
const T = artifacts.require("T.sol");

const fs = require('fs');
const { readFile } = require('fs').promises;

const ASSETS_LOCATION = "../pinata/metadata_results.txt";


/**
 * @dev Flow:
  * make sure assets info is correct in "../pinata/metadata_results.txt"
  * deploy & mint: truffle migrate --network ropsten --reset
  * verify: truffle run verify TeslaCollection@0x0000000000000000000000000000000 --network ropsten, use correct name & address
 */

module.exports = async function (deployer, network, accounts) {
  console.log(`\n${network}, ${accounts}\n`);

  const data = await readFile(ASSETS_LOCATION);
  const dataArr = data.toString().replace(/\r\n/g,'\n').split('\n');
  console.log(dataArr);

  console.log('Deploying TeslaCollection...');
  await deployer.deploy(TeslaCollection, { from: accounts[0] });
  const teslaCollectionInstance = await TeslaCollection.deployed();
  console.log(`teslaCollectionInstance deployed: ${teslaCollectionInstance.address}`);
  console.log(`teslaCollectionInstance: ${teslaCollectionInstance}`);

  console.log('Minting...');
  await teslaCollectionInstance.mint(dataArr, { from: accounts[0] });
  console.log('Minting finished.');
};