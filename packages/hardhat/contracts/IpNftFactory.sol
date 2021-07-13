pragma solidity >=0.6.0 <0.7.0;

import "./IpNft.sol";

contract IpNftFactory {
    constructor() public{}

    event NewIpNft(address IpAddress , address licensee, string IpName, string IpSymbol );
    
       /**
     * @dev Manufacture IP NFT 
     * @param IpName Name of IP
     * @param IpSymbol Symbol of IP
     * @param IpURI URI of licensed data
     **/
    function newIpNft(string memory IpName, string memory IpSymbol, string memory IpURI) public {
        IpNft newIpNft = new IpNft(msg.sender, IpName, IpSymbol,IpURI);
        emit NewIpNft( address(newIpNft),  msg.sender, IpName, IpSymbol);
    }
}