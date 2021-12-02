/** @format */

const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket_V1");
  let nftMarket;
  nftMarket = await upgrades.deployProxy(NFTMarket, {
    initializer: "initialize",
  });
  // const nftMarket = await NFTMarket.deploy();

  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);
  //

  const NFT = await hre.ethers.getContractFactory("NFT_V1");
  let nft;
  nft = await upgrades.deployProxy(NFT, {
    initializer: "initialize",
  });

  // const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);

  //Calling All initial Functions

  await nft.setMarketPlaceAddress(nftMarket.address.toString());
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//0x2016D0a7ac6A1566E4231A8BF4cDFB81BeDF2f56
//0x727E2A605c3476684D2b4ee1Ee89887067284a30

//logic  0xCd3282BbDdcF841DeeDB63f0385b506C82B8E344
// 0x98A28FC61E68383194c2Ebf7731DE32089e220c5
