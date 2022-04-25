/**
 * 1. deploys assets to IPFS.
 * 2. creates JSON for each asset
 * 
 * run: npm index.js
 */

const pinataSDK = require('@pinata/sdk');
require('dotenv').config();
const fs = require('fs');
const fsPromises = fs.promises;
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

const ASSETS_LOCATION = './assets/';

const options = {
  pinataMetadata: {
    name: 'Tesla NFT Collection',
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
  const assets = await getAssets(_assetLocation);
  console.log(`assets: ${assets}`);

  const length = assets.length;
  console.log(`assets length: ${length}\n\n`);

  for (let i = 0; i < length; i++) {
    const asset = assets[i];
    const path = ASSETS_LOCATION + asset;
    await pinFile(path, _options);
  }
}

const getAssets = async (_dir) => {
  try {
    return fsPromises.readdir(_dir);
  } catch (err) {
    throw('Error occured while reading directory!', err);
  }
}

const pinFile = async (_path, _options) => {
  const assetUrl = await pineFileToIPFS(_path, _options);
  console.log(`assetUrl; ${assetUrl}`);

  const body = {
    name: 'Tesla NFT Collection ',
    description: 'Tesla vehicle products',
    image: assetUrl
  };

  const metadata = await pinJSONToIPFS(body, _options);
  console.log(`metadata; ${metadata}\n`);
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
 *
  assets: tesla_0.png,tesla_1.jpg,tesla_2.jpg,tesla_3.jpg,tesla_4.jpg,tesla_5.jpg,tesla_6.jpg,tesla_7.jpg,tesla_8.jpg
  assets length: 9


  ./assets/tesla_0.png
  assetUrl; https://gateway.pinata.cloud/ipfs/QmbfQkmVLNcBUju4Bp9tPHsWVNDHLkEX7ivQwsLPSLH9o4
  metadata; https://gateway.pinata.cloud/ipfs/QmSErsoctVS6c7T5NxcydrSxKEb9cFHjxXcvQePSU937mV

  ./assets/tesla_1.jpg
  assetUrl; https://gateway.pinata.cloud/ipfs/Qmf2x29UpkuaQdsCU6GDKpEsH8HfyXaqcuJNMwm4K87U1A
  metadata; https://gateway.pinata.cloud/ipfs/QmNiS7J98kG1nDHf32CxftRHL9PvbFKEVhx3CEA5iSGd2X

  ./assets/tesla_2.jpg
  assetUrl; https://gateway.pinata.cloud/ipfs/QmPY4SUoBpwF367JE63p3WLvEPHgegQDyVUbYGyAEYA3Cv
  metadata; https://gateway.pinata.cloud/ipfs/QmT1bN2WfoyR2C9x3WcNjPGQFjTbheE5friWA3j6YgKF9Z

  ./assets/tesla_3.jpg
  assetUrl; https://gateway.pinata.cloud/ipfs/QmSLJWfcWeHy4SNMgXMVJdrKtvkHkJNbjDbowpdypcr5Mn
  metadata; https://gateway.pinata.cloud/ipfs/QmYpKfSGreBEpGmKLYEfxAxzQ8iQYT2FmmBhm6tgsNZJMK

  ./assets/tesla_4.jpg
  assetUrl; https://gateway.pinata.cloud/ipfs/QmfThD6E3hYANqQa3FFKwtSKqBhg3x6Y8kNe3X2HGxvKej
  metadata; https://gateway.pinata.cloud/ipfs/QmdAKorG4caqM7WNcYzTRNbMapByHohAUU4hsCfd9ZUv7h

  ./assets/tesla_5.jpg
  assetUrl; https://gateway.pinata.cloud/ipfs/QmdgYGRZAx5nxpPDREJpmqyaXpx1ucWUSMjfTRt5qyFJUM
  metadata; https://gateway.pinata.cloud/ipfs/QmdMXRPZUKbWsfH6GKopTiaLU7BkwZRBurbC2939tPVEbg

  ./assets/tesla_6.jpg
  assetUrl; https://gateway.pinata.cloud/ipfs/QmSnEz7muqGrTyEc6wLeF3yUpzBKw1zYUa94S5X3vcZ8L1
  metadata; https://gateway.pinata.cloud/ipfs/QmXdeMbi6bh5D1BvN1Ah9JkK435S3JATD9XnVoVXhFwPGR

  ./assets/tesla_7.jpg
  assetUrl; https://gateway.pinata.cloud/ipfs/Qmbp38c3LdruPcX4Mux64XFaSkhiiDbpkjFVa9vkHcjN8f
  metadata; https://gateway.pinata.cloud/ipfs/Qmbh6TuQrbT3RhCprWB9f9kdaTjTpmmEPn3veGkT4inkxy

  ./assets/tesla_8.jpg
  assetUrl; https://gateway.pinata.cloud/ipfs/QmSrtHjaXjM291zMvSjaMT9tYDcKEomtZ3Q38sHkd3HhyK
  metadata; https://gateway.pinata.cloud/ipfs/QmecJEzcbXYgrzgv8jc3Vk2fLV6SVaNDh88FTzVcgTzD7j
 * 
 */