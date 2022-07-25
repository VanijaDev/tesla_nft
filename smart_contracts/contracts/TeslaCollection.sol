// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract TeslaCollection is Ownable, ERC721URIStorage, ERC721Enumerable {

  event Mint(uint256 _id, address _to, string _uri);

  constructor() ERC721("Tesla NFT Collection", "TNC") {}

  /**
   * Overriden functions
   */

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override (ERC721Enumerable, ERC721) {
    return ERC721Enumerable._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, ERC721) returns (bool) {
    return ERC721Enumerable.supportsInterface(interfaceId);
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721URIStorage, ERC721) {
    return ERC721URIStorage._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view virtual override(ERC721URIStorage, ERC721) returns (string memory) {
    return ERC721URIStorage.tokenURI(tokenId);
  }

  /**
   * @dev Mints token.
   * @param _uris Token uri list.
   */
  function mint(string[] memory _uris) external onlyOwner {
    uint256 length = _uris.length;
    for (uint256 i = 0; i < length; i++) {
      uint256 id = totalSupply();
      
      _mint(msg.sender, id);
      _setTokenURI(id, _uris[i]);

      emit Mint(id, msg.sender, _uris[i]);
    }
  }
}