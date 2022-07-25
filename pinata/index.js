/**
 * Description
 *  1. deploys assets to IPFS.
 *  2. creates JSON for each asset
 * 
 * Setup:
 *  npm i 
 *  update correct location of assets folder - ASSETS_LOCATION (optional)
 *  put assets into ASSETS_LOCATION
 *  update metadata body - options (optional)
 *  update metadata of JSON body - pinFile -> body (optional)
 * 
 * Run:
 *  node index.js
 */

const pinataSDK = require('@pinata/sdk');
require('dotenv').config();
const fs = require('fs');
const fsPromises = fs.promises;
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

const ASSETS_LOCATION = './assets/';

const RESULTS_FILENAME = 'metadata_results.txt';
const RESULTS_FILENAME_LOCALION = './' + RESULTS_FILENAME;

const options = {
  pinataMetadata: {
    // name: 'Tesla NFT Collection',
    name: 'EV NFT Collection',
    keyvalues: {
      customKey: 'TNC',
      customKey2: 'TNC2'
    }
  },
  pinataOptions: {
    cidVersion: 0
  }
};


const getMetadata = async (_assetLocation, _options) => {
  await createResultsFile(RESULTS_FILENAME);

  const assets = await getAssets(_assetLocation);
  console.log(`assets: ${assets}`);

  const length = assets.length;
  console.log(`assets length: ${length}\n\n`);

  for (let i = 0; i < length; i++) {
    const asset = assets[i];
    const path = ASSETS_LOCATION + asset;
    await pinFile(path, _options);

    if (i < length - 1) {
      await appendFile(RESULTS_FILENAME_LOCALION, '\n');
    }
  }
}
const createResultsFile = async (_filename) => {
  try {
    return fsPromises.writeFile(_filename, '');
  } catch (err) {
    throw('createResultsFile error:', err);
  }
}

const getAssets = async (_dir) => {
  try {
    return fsPromises.readdir(_dir);
  } catch (err) {
    throw('Error occured while reading directory!', err);
  }
}


const appendFile = async (_path, _data) => {
  try {
    return fsPromises.appendFile(_path, _data, 'utf8');
  } catch (err) {
    throw('createResultsFile error:', err);
  }
}

const pinFile = async (_path, _options) => {
  const assetUrl = await pineFileToIPFS(_path, _options);
  console.log(`assetUrl; ${assetUrl}`);

  //  name, description, image - these fields are being used for OpenSea deployment.
  const body = {
    // name: 'Tesla NFT Collection',
    // description: 'Tesla vehicle products',
    name: 'EV NFT Collection',
    description: 'EV vehicle products',
    image: assetUrl,
    // external_url: 'https://www.tesla.com/'  //  optional
    external_url: 'https://www.communitygaming.io'  //  optional
  };

  const metadata = await pinJSONToIPFS(body, _options);
  console.log(`metadata; ${metadata}\n`);
  await appendFile(RESULTS_FILENAME_LOCALION, metadata);
}

const pineFileToIPFS = async (_path, _options) => {
  console.log(`${_path}`);
  // console.log(_options);

  const readableStreamForFile = fs.createReadStream(_path);
  const result = await pinata.pinFileToIPFS(readableStreamForFile, _options);
  // const url = `https://ipfs.io/ipfs/${result.IpfsHash}`; //  direct url
  const url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
  return url;
}

const pinJSONToIPFS = async (_body) => {
  const pinnedJSONToIPFS = await pinata.pinJSONToIPFS(_body, options);
  const url = `https://gateway.pinata.cloud/ipfs/${pinnedJSONToIPFS.IpfsHash}`;
  
  return url;
}


getMetadata(ASSETS_LOCATION, options);


/**
  assets: tesla_0.png,tesla_1.jpg,tesla_2.jpg,tesla_3.jpg,tesla_4.jpg,tesla_5.jpg,tesla_6.jpg,tesla_7.jpg,tesla_8.jpg
  assets length: 9


  ./assets/tesla_0.png
  assetUrl; https://gateway.pinata.cloud/ipfs/QmbfQkmVLNcBUju4Bp9tPHsWVNDHLkEX7ivQwsLPSLH9o4
  metadata; https://gateway.pinata.cloud/ipfs/QmceovjDNzFRgRivVxeWN1sXFgR1oBWxg9NK84hFxEe7oP
  
  ...

 */