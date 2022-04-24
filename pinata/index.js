const pinataSDK = require('@pinata/sdk');
require('dotenv').config();
const fs = require('fs');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);
const readableStreamForFile = fs.createReadStream('./assets/tesla_0.png');

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

const pineFileToIPFS = async (_options) => {
  const result = await pinata.pinFileToIPFS(readableStreamForFile, _options);
  // const url = `https://ipfs.io/ipfs/${result.IpfsHash}`; //  direct url
  const url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
  return url;
}

const getMetadata = async (_options) => {
  const assetUrl = await pineFileToIPFS(_options);
  console.log(`assetUrl; ${assetUrl}`);

  const body = {
    name: 'Tesla NFT Collection ',
    description: 'Tesla vehicle products',
    image: assetUrl
  };

  const metadata = await pinJSONToIPFS(body, _options);
  console.log(`metadata; ${metadata}`);
}

const pinJSONToIPFS = async (_body) => {
  const pinnedJSONToIPFS = await pinata.pinJSONToIPFS(_body, options);
  const url = `https://gateway.pinata.cloud/ipfs/${pinnedJSONToIPFS.IpfsHash}`;
  
  return url;
}

getMetadata(options);

//  tesla_0 - https://gateway.pinata.cloud/ipfs/QmSErsoctVS6c7T5NxcydrSxKEb9cFHjxXcvQePSU937mV