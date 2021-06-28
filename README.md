# 💎 scaffold-eth - Diamond Starter Kit

> Discover how you can get started with [Diamond Standard](https://eips.ethereum.org/EIPS/eip-2535)

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#smart-contracts">Exploring smart contracts</a></li>
    <li><a href="#practice">Practice</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

This branch is entitled to showcase how you can get started integrating/using [Diamond Standard](https://eips.ethereum.org/EIPS/eip-2535) in terms of upgradability and interaction with facets of a diamond. 

## Getting Started


### Installation

Let's start our environment for tinkering and exploring how NFT auction would work.

1. Clone the repo first
```sh
git clone -b payment-channel https://github.com/austintgriffith/scaffold-eth.git payment-channel
cd payment-channel
```

2. Install dependencies
```bash
yarn install
```
3. Start local chain
```bash
yarn chain
```

4. Start your React frontend
```bash
yarn start
```

5. Deploy your smart contracts to a local blockchain
```bash
yarn deploy
```

## Smart contracts

Let's navigate to `packages/hardhat/contracts` folder and check out what contracts we have there.

The [facets folder](https://github.com/austintgriffith/scaffold-eth/tree/diamond-starter-kit/packages/hardhat/contracts/facets) has test the facets of the diamond including the [Diamond Cut Facet](https://github.com/austintgriffith/scaffold-eth/blob/diamond-starter-kit/packages/hardhat/contracts/DiamondCutFacet.sol) and we are mostly interested in this.

#### Diamond Cut Facet
So basically there is just 1 main function:

- ```function diamondCut(FacetCut[] calldata _diamondCut, address _init, bytes calldata _calldata) external ``` responsible for upgrading facets, _init and _calldata can be set as [zeroAddress](https://etherscan.io/address/0x0000000000000000000000000000000000000000) and '0x' , the FacetCut struct basically consists of the updated facet address(zeroAddress when you want to remove a selector), the action you want to perform diamond standard offers 3 basic actions (Add, Replace and Remove) and the array of selectors which are just function signatures that are being added/updated/removed.

- NOTE -> Upgradability only works for facets which were initially deployed with the diamond



## Practice

Firstly, get us some funds using local faucet.

<img width="1572" alt="action" src="https://user-images.githubusercontent.com/26670962/123618760-1d7cb100-d826-11eb-8482-0a75b0ddb39e.png">

Select the type of upgrade action you want to perform

<img width="1581" alt="abi" src="https://user-images.githubusercontent.com/26670962/123619037-659bd380-d826-11eb-9652-767790044141.png">

Upload the updated abi of the facet contract you wish to upgrade, you can get the updated abi by running ```yarn compile``` after updating the contract in artifacts folder

<img width="1578" alt="upload" src="https://user-images.githubusercontent.com/26670962/123619445-cfb47880-d826-11eb-99a9-7c3dd20b1ae2.png">

Deploy the new facet, in case of add or delete action specify the exact selector details as mentioned in the placeholder and clicking on upgrade will essentially upgrade the diamond!


## Contact

Join the [telegram support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!
