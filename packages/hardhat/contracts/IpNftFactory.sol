pragma solidity >=0.6.0 <0.8.4;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable@4.2.0/proxy/utils/Initializable.sol";
import "./IpNft.sol";

import "./IIpNft.sol";

contract IpNftFactory is Initializable {

    IpNft public licenseToken;
    
    function initialize(IpNft _licenseToken) public initializer {
        licenseToken = _licenseToken;
    }

    mapping(address => bool) public IpNftContracts;
    address [] IpNftContractList;
    event NewLicenseToken(address IpNftContractAddress , address licensee, string IpBrandName, string IpBrandSymbol, string IpURI );
    
    /**
     * @dev Manufacture IpNft
     * @param IpBrandName Name of branding for licensor
     * @param IpBrandSymbol Symbol of IP
     * @param IpURI URI of licensed data
     **/
    function newlicenseToken(string memory IpBrandName, string memory IpBrandSymbol, string memory IpURI) public returns (address[] memory){
        IpNft _licenseToken = new IpNft();
        IpNftContracts[address(_licenseToken)] = true;
        IpNftContractList.push(address(_licenseToken));
        IIpNft(address(_licenseToken)).changeLicensor(msg.sender);
        emit NewLicenseToken( address(_licenseToken),  msg.sender, IpBrandName, IpBrandSymbol, IpURI);
        return IpNftContractList;
    }

    /// @dev Get child contracts
    function getChildren()external view returns(address[] memory){
        return IpNftContractList;
    }

    
}