pragma solidity >=0.6.0 <0.8.4;
//SPDX-License-Identifier: MIT

/// @title NFT contract for licensening IP

import "@openzeppelin/contracts-upgradeable@4.2.0/interfaces/IERC1271Upgradeable.sol";

interface IIpNft is IERC1271Upgradeable {
  function changeLicenseCost ( uint256 newLicenseCost ) external returns ( uint256 );
  function changeLicensor ( address newLicensor ) external;
  function licenseIP (  ) external returns ( uint256 );
}
