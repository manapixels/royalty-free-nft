pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IpNft is ERC721, Ownable {

  address licensor = msg.sender;
  uint256 licenseCost = 10000000000000000;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor(address license, string memory IpName, string memory IpSymbol, string memory IpURI )
  
    public ERC721(IpName, IpSymbol) {
    _setBaseURI(IpURI);
  }
 
  ///@dev Mint Licensee a License
  function licenseIP()
      public payable
      returns (uint256)
  {
      require(msg.value == licenseCost);
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      return id;
  }
   /**
     * @dev Change the licensor
     * @param newLicensor address of the new licensor 
     **/
  function changeLicensor(address newLicensor) public {
      require(msg.sender == licensor);
      licensor = newLicensor;

  }
  /**  
    * @dev Change cost of License
    * @param newLicenseCost New price for license
  **/
  function changeLicenseCost(uint256 newLicenseCost) public returns (uint256) {
      licenseCost = newLicenseCost;
      return licenseCost;
  }
}
