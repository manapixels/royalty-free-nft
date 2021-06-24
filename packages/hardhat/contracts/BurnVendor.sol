pragma solidity ^0.5.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
interface TOKEN {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract BurnVendor {

  TOKEN public akitaToken;

  uint256 constant public tokensPerEth = 2056020000;

  uint256 constant public burnMultiplier = 10;

  address payable constant public gitcoinAddress = 0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6;

  address constant public burnAddress = 0xDead000000000000000000000000000000000d06;

  constructor(address akitaAddress) public {
    akitaToken = TOKEN(akitaAddress);
  }

  function() external payable {
    buy();
  }

  event Buy(address who, uint256 value, uint256 amount, uint256 burn);

  function buy() public payable {

    uint256 amountOfTokensToBuy = msg.value * tokensPerEth;

    uint256 amountOfTokensToBurn = amountOfTokensToBuy * burnMultiplier;

    akitaToken.transferFrom(gitcoinAddress, burnAddress, amountOfTokensToBurn);

    akitaToken.transferFrom(gitcoinAddress, msg.sender, amountOfTokensToBuy);

    gitcoinAddress.transfer(msg.value);

    emit Buy(msg.sender, msg.value, amountOfTokensToBuy, amountOfTokensToBurn);

  }

}
