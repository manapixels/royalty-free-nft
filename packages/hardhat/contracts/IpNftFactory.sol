pragma solidity >=0.6.0 <0.8.4;
//SPDX-License-Identifier: MIT

/// @title Factory for IpNft
/// @author elocremarc

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IpNft.sol";

import "./interface/IIpNft.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract IpNftFactory is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    
    address payable owner;
    string[] IP;

    constructor() {
        owner = payable(msg.sender);
    }

    struct IpNftItem{
        uint itemId;
        address IpNftContractAddress;
        uint256 tokenId;
        address payable licensee;
        address payable owner;
        uint256 licenseCost;
        string IpBrandName;
        string IpBrandSymbol; 
        string IpURI;
        bool sold;
    }
    
    mapping (uint256 => IpNftItem) private idToIpNftItem;
    
    mapping(address => bool) public IpNftContracts;
    address [] IpNftContractList;
    

    event IpNftItemCreated(
        uint indexed itemId,
        address indexed IpNftContractAddress,
        uint256 indexed tokenId,
        address licensee,
        address owner,
        uint256 licenseCost,
        string IpBrandName,
        string IpBrandSymbol, 
        string IpURI,
        bool sold 
        );
        
    // // Returns the listing price of the contract
    
    // function getListingCommission() public view returns (uint256) {
    //     return listingCommission;
    // }
    
    /**
     * @dev Manufacture IpNft
     * @param IpNftContractAddress is the address of the 
     * @param IpBrandSymbol Symbol of IP
     * @param IpURI URI of licensed data
     * @param IpBrandName Name of branding for licensor
     * @param IpBrandSymbol Symbol of IP
     * @param IpURI URI of licensed data
     **/
    function newIpNftItem(address IpNftContractAddress, uint256 tokenId, uint256 licenseCost, string memory IpBrandName, string memory IpBrandSymbol, string memory IpURI) public payable nonReentrant {
        require(licenseCost > 0, "License Cost must be at least 1 wei");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        
        idToIpNftItem[itemId] = IpNftItem(
            itemId,
            IpNftContractAddress,
            tokenId,
            payable (msg.sender),
            payable (address(0)),
            licenseCost,
            IpBrandName,
            IpBrandSymbol,
            IpURI,
            false
            );
            
        IERC721(IpNftContractAddress).transferFrom(msg.sender, address(this), tokenId);
        
        emit IpNftItemCreated(
            itemId,
            IpNftContractAddress,
            tokenId,
            msg.sender,
            address(0),
            licenseCost,
            IpBrandName,
            IpBrandSymbol, 
            IpURI,
            false 
            );
        
        // IpNft _newIpNft = new IpNft();
        // IIpNft(address(_newIpNft)).initialize(IpBrandName, IpBrandSymbol, IpURI);
        // IpNftContracts[address(_newIpNft)] = true;
            // IpNftContractList.push(address(IpNftItemCreated));
            // IP.push(IpURI);
        // IIpNft(address(_newIpNft)).changeLicensor(msg.sender);
        // emit IpNftCreated( address(_newIpNft),  msg.sender, IpBrandName, IpBrandSymbol, IpURI);
        // return IpNftContractList;
    }
    
    function newIpNftLicense(address IpNftContractAddress, uint256 itemId) public payable nonReentrant {
        uint licenseCost = idToIpNftItem[itemId].licenseCost;
        uint tokenId = idToIpNftItem[itemId].tokenId;
        uint256 listingCommission = licenseCost/10000;
    // require(licenseCost > 0, "License Cost must be at least 1 wei");
        require(msg.value == licenseCost+listingCommission, "Please submit the asking price in order to complete the license transaction");
        
        idToIpNftItem[itemId].licensee.transfer(msg.value);
        IERC721(IpNftContractAddress).transferFrom(address(this), msg.sender, tokenId);
        idToIpNftItem[itemId].owner = payable(msg.sender);
        idToIpNftItem[itemId].sold = true;
        _itemsSold.increment();
        payable(owner).transfer(listingCommission);
    // _itemIds.increment();
    // uint256 itemId = _itemIds.current();
    
    // idToIpNftItem[itemId] = IpNftItem(
    //     itemId,
    //     IpNftContractAddress,
    //     tokenId,
    //     payable (msg.sender),
    //     payable (address(0)),
    //     licenseCost,
    //     IpBrandName,
    //     IpBrandSymbol,
    //     IpURI,
    //     false
    //     );
        
    
    // emit IpNftItemCreated(
    //     itemId,
    //     IpNftContractAddress,
    //     tokenId,
    //     msg.sender,
    //     address(0),
    //     licenseCost,
    //     IpBrandName,
    //     IpBrandSymbol, 
    //     IpURI,
    //     false 
    //     );
}
    
      /* Returns all unsold market items */
  function fetchIpNftItems() public view returns (IpNftItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    IpNftItem[] memory items = new IpNftItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToIpNftItem[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        IpNftItem storage currentItem = idToIpNftItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
    
  /* Returns onlyl items that a user has purchased */
  function fetchMyNFTs() public view returns (IpNftItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToIpNftItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    IpNftItem[] memory items = new IpNftItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToIpNftItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        IpNftItem storage currentItem = idToIpNftItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
    

    /// @dev Get child contracts
    function getChildren()external view returns(address[] memory){
        return IpNftContractList;
    }
    
      /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (IpNftItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToIpNftItem[i + 1].licensee == msg.sender) {
        itemCount += 1;
      }
    }

    IpNftItem[] memory items = new IpNftItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToIpNftItem[i + 1].licensee == msg.sender) {
        uint currentId = i + 1;
        IpNftItem storage currentItem = idToIpNftItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
    
        // @dev push a new IP to the contract
    function _pushIP(string memory IpURI) public {
        IP.push(IpURI);
    }
    
}