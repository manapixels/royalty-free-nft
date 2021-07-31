// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

import "hardhat/console.sol";


contract IpNft is Initializable, ERC721Upgradeable, ERC721URIStorageUpgradeable, PausableUpgradeable, AccessControlUpgradeable, ERC721BurnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    CountersUpgradeable.Counter private _tokenIdCounter;

    function initialize() initializer public {
        __ERC721_init("IpNft", "BrandSymbol");
        __ERC721URIStorage_init();
        __Pausable_init();
        __AccessControl_init();
        __ERC721Burnable_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function safeMint(address to) public onlyRole(MINTER_ROLE) {
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ifps://";
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}


// pragma solidity >=0.6.0 <0.8.4;

// /// @title NFT contract for licensening IP
// /// @author elocremarc

// //import "hardhat/console.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


// contract IpNft is ERC721,ERC721URIStorage, Ownable {

//   address licensor = owner();
//   uint256 licenseCost = 10000000000000000;
//   string [] IP;

//   using Counters for Counters.Counter;
//   Counters.Counter private _tokenIds;

//   constructor(string memory IpBrandName, string memory IpBrandSymbol, string memory IpURI )
  

    
//     public ERC721(IpBrandName, IpBrandSymbol) {
//       _baseURI();
//     IP.push(IpURI);
//   }
//   s
//   //@dev Override base uri
//  function _baseURI() internal pure override returns (string memory) {
//         return "ifps://";
//     }

//   /**
//   * @dev Override tokenUri
//   * @param _tokenIds TokenId
//   **/
//   function tokenURI(uint256 tokenId)
//         public
//         view
//         override(ERC721, ERC721URIStorage)
//         returns (string memory)
//     {
//         return super.tokenURI(tokenId);
//     }

//   ///@dev Mint Licensee a License
//   function licenseIP()
//       public payable
//       returns (uint256)
//   {
//       require(msg.value == licenseCost);
//       _tokenIds.increment();
//       uint256 id = _tokenIds.current();
//       _mint(msg.sender, id);
//       _setTokenURI(id, 
//       IP[0]);

//       return id;
//   }
//     /**
//      * @dev Change the licensor and owner of the contract
//      * @param newLicensor address of the new licensor 
//      **/
//   function changeLicensor(address newLicensor) public onlyOwner {
//       transferOwnership(newLicensor);
//   }
//   /**  
//     * @dev Change cost of License
//     * @param newLicenseCost New price for license
//   **/
//   function changeLicenseCost(uint256 newLicenseCost) public onlyOwner returns (uint256) {
//       licenseCost = newLicenseCost;
//       return licenseCost;
//   }
// }
