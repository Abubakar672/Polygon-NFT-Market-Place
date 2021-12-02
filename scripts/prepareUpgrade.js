/** @format */

const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const proxyAddressMarket = "0x2016D0a7ac6A1566E4231A8BF4cDFB81BeDF2f56";
  const proxyAddressToken = "0x727E2A605c3476684D2b4ee1Ee89887067284a30";
  const NFTMarket_V2 = await hre.ethers.getContractFactory("NFTMarket_V2");

  const nftMarket = await upgrades.prepareUpgrade(
    proxyAddressMarket,
    NFTMarket_V2
  );
  console.log("NFTMarket_V2 deployed to:", nftMarket);
  //

  const NFT_V2 = await hre.ethers.getContractFactory("NFT_V2");

  const nft = await upgrades.prepareUpgrade(proxyAddressToken, NFT_V2);
  console.log("NFT_V2 deployed to:", nft);
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

//new
//0x79d2649ef7fd7c314dbe32cb793d1e3c17418fd8;
//0xC310E335d83CaF670847F148FA25aEe381f6d613
