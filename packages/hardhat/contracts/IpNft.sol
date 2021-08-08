//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.4;

/// @title NFT contract for licensening IP
/// @author elocremarc

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract IpNft is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    // address licensor = owner();

    constructor(address factoryAddress,
        string memory IpBrandName,
        string memory IpBrandSymbol
    ) ERC721(IpBrandName, IpBrandSymbol) {
        contractAddress = factoryAddress;
        _baseURI();
    }

        /**
     * @dev Mint Licensee a License
     * @return token id of license
     **/
    function licenseIP(string memory tokenURI) public returns (uint) {
        // require(msg.value == licenseCost);
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _mint(msg.sender, id);
        _setTokenURI(id, tokenURI);
        setApprovalForAll(contractAddress, true);
        return id;
    }


    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721URIStorage)
    {
        super._burn(tokenId);
    }
  
    /** @dev disable Transfer of NFT to ensure no secondary market can function */ 
    function transferFrom() public pure {
        revert("Transfer Disabled Buy new License");
    }
    /** @dev disable Transfer of NFT to ensure no secondary market can function */ 
    function safeTransferFrom() public pure {
        revert("Transfer Disabled Buy new License");
    }

    // function tokenURI(uint256 tokenId)
    //     public
    //     view
    //     override(ERC721URIStorage)
    //     returns (string memory)
    // {
    //     return super.tokenURI(tokenId);
    // }

    /**
     * @dev Change the licensor and owner of the contract
     * @param newLicensor address of the new licensor
     **/
    // function changeLicensor(address newLicensor) public onlyOwner {
    //     transferOwnership(newLicensor);
    // }

    // /**
    //  * @dev Change cost of License
    //  * @param newLicenseCost New price for license
    //  **/
    // function changeLicenseCost(uint256 newLicenseCost)
    //     public
    //     onlyOwner
    //     returns (uint256)
    // {
    //     licenseCost = newLicenseCost;
    //     return licenseCost;
    // }
}