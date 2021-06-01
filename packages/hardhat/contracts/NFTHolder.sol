pragma solidity 0.7.5;

import "./ERC1271DAO.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTHolder is ERC1271DAO, ERC721Holder {
  
  function approve(address to, address tokenContract, uint256 tokenId) public {
    IERC721(tokenContract).approve(to, tokenId);
  }
  
  fallback() external payable {}
  
  function gimme() external {
      msg.sender.call{value: address(this).balance}("");
  }

}