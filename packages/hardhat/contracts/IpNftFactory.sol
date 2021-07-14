pragma solidity >=0.6.0 <0.7.0;

/// @title Factory for IpNft
/// @author elocremarc

import "./IpNft.sol";

contract IpNftFactory {
    constructor() public{}

    mapping(address => bool) public IpNftContracts;
    event NewIpNft(address IpAddress , address licensee, string IpName, string IpSymbol );
    
    /**
     * @dev Manufacture IpNft
     * @param IpName Name of IP
     * @param IpSymbol Symbol of IP
     * @param IpURI URI of licensed data
     **/
    function newIpNft(string memory IpName, string memory IpSymbol, string memory IpURI) public {
        IpNft newIpNft = new IpNft(msg.sender, IpName, IpSymbol,IpURI);
        IpNftContracts[address(newIpNft)] = true;
        emit NewIpNft( address(newIpNft),  msg.sender, IpName, IpSymbol);
    }
}