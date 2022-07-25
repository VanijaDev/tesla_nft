// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "./ERC721Tradable.sol";

contract TeslaCollection is TradeableERC721Token {
  string private baseURI;
  constructor(address _proxyRegistryAddress, string memory _baseURI) TradeableERC721Token("Tesla NFT Collection", "TNC", _proxyRegistryAddress) public { 
    baseURI = _baseURI;
   }

  function baseTokenURI() public view returns (string memory) {
    return baseURI;
  }
}