pragma solidity >=0.6.0 <0.8.4;
//SPDX-License-Identifier: MIT

/// @title NFT contract for licensening IP

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface IIpNft is IERC721Upgradeable {
  function changeLicenseCost ( uint256 newLicenseCost ) external returns ( uint256 );
  function changeLicensor ( address newLicensor ) external;
  function licenseIP (  ) external returns ( uint256 );
  function initialize(string memory IpBrandName, string memory IpBrandSymbol, string memory IpURI) external ;
}