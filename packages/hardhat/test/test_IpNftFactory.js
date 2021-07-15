const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Royalty Free NFT", function () {
  let IpNftFactory;
  let childContractAddress1;
  let childContract1;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Factory to deploy IpNft contracts", function () {
    it("Should deploy IpNftFactory", async function () {
      const parentContract = await ethers.getContractFactory("IpNftFactory");

      IpNftFactory = await parentContract.deploy();
    });
    it("Should have proper owner", async function () {
      expect(await IpNftFactory.owner()).to.equal(owner.address);
    });
    describe("Deploy Child Contract", function () {
      it("Should generate new contract", async function () {
        const newIpNftArgs = ["Test", "Test", "google.com"];
        await IpNftFactory.connect(addr1).newIpNft(...newIpNftArgs);
        childContractAddress1 = await IpNftFactory.getChildren();
        expect(
          await IpNftFactory.IpNftContracts(childContractAddress1[0])
        ).to.equal(true);
      });
      // it("Should have proper owner", async function () {
      //   childContract1 = await ethers.getContractAt(
      //     "IpNft",
      //     childContractAddress1
      //   );
      // });
      //   it("Should have proper name", async function () {
      //
      //   });

      //   describe("Deploy child contract", function () {});
    });
  });
});
