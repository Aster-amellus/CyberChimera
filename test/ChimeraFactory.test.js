import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("ChimeraFactory", function () {
  let chimeraFactory;
  let owner;
  let contributor1;
  let contributor2;
  let nonContributor;

  beforeEach(async function () {
    [owner, contributor1, contributor2, nonContributor] = await ethers.getSigners();
    
    const ChimeraFactory = await ethers.getContractFactory("ChimeraFactory");
    chimeraFactory = await ChimeraFactory.deploy();
    await chimeraFactory.waitForDeployment();
  });

  describe("Contribution", function () {
    it("Should allow contributing genes", async function () {
      await expect(chimeraFactory.connect(contributor1).contribute(0, 1))
        .to.emit(chimeraFactory, "GeneContributed")
        .withArgs(contributor1.address, 0, 1);
      
      expect(await chimeraFactory.getGene(0)).to.equal(1);
      expect(await chimeraFactory.isContributor(contributor1.address)).to.be.true;
    });

    it("Should replace previous gene value for same geneType", async function () {
      await chimeraFactory.connect(contributor1).contribute(0, 1);
      await chimeraFactory.connect(contributor2).contribute(0, 2);
      
      expect(await chimeraFactory.getGene(0)).to.equal(2);
      expect(await chimeraFactory.isContributor(contributor1.address)).to.be.true;
      expect(await chimeraFactory.isContributor(contributor2.address)).to.be.true;
    });

    it("Should reject invalid gene types", async function () {
      await expect(chimeraFactory.connect(contributor1).contribute(6, 0))
        .to.be.revertedWith("Invalid gene type");
    });

    it("Should reject invalid gene values", async function () {
      await expect(chimeraFactory.connect(contributor1).contribute(0, 8))
        .to.be.revertedWith("Invalid gene value");
    });

    it("Should not allow contribution after birth", async function () {
      await chimeraFactory.connect(owner).birth();
      await expect(chimeraFactory.connect(contributor1).contribute(0, 1))
        .to.be.revertedWith("Chimera already born.");
    });
  });

  describe("Birth", function () {
    it("Should allow owner to call birth", async function () {
      await expect(chimeraFactory.connect(owner).birth())
        .to.emit(chimeraFactory, "Born")
        .withArgs(owner.address, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));
      
      expect(await chimeraFactory.isBorn()).to.be.true;
    });

    it("Should not allow non-owner to call birth", async function () {
      await expect(chimeraFactory.connect(contributor1).birth())
        .to.be.revertedWithCustomError(chimeraFactory, "OwnableUnauthorizedAccount");
    });

    it("Should not allow birth to be called twice", async function () {
      await chimeraFactory.connect(owner).birth();
      await expect(chimeraFactory.connect(owner).birth())
        .to.be.revertedWith("Chimera already born.");
    });
  });

  describe("Minting", function () {
    beforeEach(async function () {
      await chimeraFactory.connect(contributor1).contribute(0, 1);
      await chimeraFactory.connect(contributor2).contribute(1, 2);
      await chimeraFactory.connect(owner).birth();
    });

    it("Should allow contributors to mint after birth", async function () {
      await chimeraFactory.connect(contributor1).mint();
      expect(await chimeraFactory.balanceOf(contributor1.address)).to.equal(1);
      expect(await chimeraFactory.ownerOf(0)).to.equal(contributor1.address);
    });

    it("Should not allow non-contributors to mint", async function () {
      await expect(chimeraFactory.connect(nonContributor).mint())
        .to.be.revertedWith("Not a contributor.");
    });

    it("Should not allow minting before birth", async function () {
      const ChimeraFactory = await ethers.getContractFactory("ChimeraFactory");
      const newChimera = await ChimeraFactory.deploy();
      await newChimera.waitForDeployment();
      
      await newChimera.connect(contributor1).contribute(0, 1);
      await expect(newChimera.connect(contributor1).mint())
        .to.be.revertedWith("Chimera not born yet.");
    });

    it("Should not allow double minting", async function () {
      await chimeraFactory.connect(contributor1).mint();
      await expect(chimeraFactory.connect(contributor1).mint())
        .to.be.revertedWith("Already minted.");
    });

    it("Should increment token IDs correctly", async function () {
      await chimeraFactory.connect(contributor1).mint();
      await chimeraFactory.connect(contributor2).mint();
      
      expect(await chimeraFactory.ownerOf(0)).to.equal(contributor1.address);
      expect(await chimeraFactory.ownerOf(1)).to.equal(contributor2.address);
    });
  });

  describe("Base URI", function () {
    it("Should allow owner to set base URI", async function () {
      const newBaseURI = "ipfs://QmTest/";
      await chimeraFactory.connect(owner).setBaseURI(newBaseURI);
      
      await chimeraFactory.connect(contributor1).contribute(0, 1);
      await chimeraFactory.connect(owner).birth();
      await chimeraFactory.connect(contributor1).mint();
      
      expect(await chimeraFactory.tokenURI(0)).to.equal(newBaseURI + "0");
    });

    it("Should not allow non-owner to set base URI", async function () {
      await expect(chimeraFactory.connect(contributor1).setBaseURI("ipfs://test/"))
        .to.be.revertedWithCustomError(chimeraFactory, "OwnableUnauthorizedAccount");
    });
  });

  describe("Gene Reading", function () {
    it("Should return default gene values", async function () {
      expect(await chimeraFactory.getGene(0)).to.equal(0);
      expect(await chimeraFactory.getGene(1)).to.equal(0);
      expect(await chimeraFactory.getGene(2)).to.equal(0);
      expect(await chimeraFactory.getGene(3)).to.equal(0);
    });

    it("Should return updated gene values", async function () {
      await chimeraFactory.connect(contributor1).contribute(0, 2);
      await chimeraFactory.connect(contributor1).contribute(1, 1);
      await chimeraFactory.connect(contributor1).contribute(2, 0);
      await chimeraFactory.connect(contributor1).contribute(3, 2);
      
      expect(await chimeraFactory.getGene(0)).to.equal(2);
      expect(await chimeraFactory.getGene(1)).to.equal(1);
      expect(await chimeraFactory.getGene(2)).to.equal(0);
      expect(await chimeraFactory.getGene(3)).to.equal(2);
    });
  });
});