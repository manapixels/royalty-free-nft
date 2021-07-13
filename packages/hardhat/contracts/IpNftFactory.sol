pragma solidity >=0.6.0 <0.7.0;

import "./IpNft.sol";

contract Factory {
    constructor() public{}

    event NewIpNft(address IpAddress , address licensee, string IpName, string IpSymbol );
    function newIpNft(string memory IpName, string memory IpSymbol, string memory IpURI) public {
        IpNft newIpNft = new IpNft(msg.sender, IpName, IpSymbol,IpURI);
        emit NewIpNft( address(newIpNft),  msg.sender, IpName, IpSymbol);
    }
}