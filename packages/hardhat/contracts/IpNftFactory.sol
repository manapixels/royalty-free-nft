pragma solidity >=0.6.0 <0.8.4;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./IpNft.sol";
import "./interface/IIpNft.sol";

contract IpNftFactory is Initializable {

    
    function initialize() public initializer {
    }

    mapping(address => bool) public IpNftContracts;
    address [] IpNftContractList;
    event NewLicenseToken(address IpNftContractAddress , address licensee, string IpBrandName, string IpBrandSymbol, string IpURI );
    
    /**
     * @dev Manufacture IpNft Licensor Contract
     * @param IpBrandName Name of branding for licensor
     * @param IpBrandSymbol Symbol of IP
     * @param IpURI URI of licensed data
     **/
    function newLicensorContract(string memory IpBrandName, string memory IpBrandSymbol, string memory IpURI) public returns (address[] memory){
        IpNft _licenseContract = new IpNft();
        IIpNft(address(_licenseContract)).initialize(IpBrandName, IpBrandSymbol, IpURI);
        IpNftContracts[address(_licenseContract)] = true;
        IpNftContractList.push(address(_licenseContract));
        IIpNft(address(_licenseContract)).changeLicensor(msg.sender);
        emit NewLicenseToken( address(_licenseContract),  msg.sender, IpBrandName, IpBrandSymbol, IpURI);
        return IpNftContractList;
    }

    /// @dev Get child contracts
    function getChildren()external view returns(address[] memory){
        return IpNftContractList;
    }

    
}