const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const FarmNFT = await hre.ethers.getContractFactory("FarmNFT");
  const farmNFT = await FarmNFT.deploy("some name", "sm");

  await farmNFT.deployed();

  console.log("farmNFT deployed to:", farmNFT.address);

  // const Farm = await hre.ethers.getContractFactory("SimpleFarm");

  // //first arg is the testnet dai on rinkeby
  // //second arg is the time in seconds for keepers
  // //third is the NFT addy
  // const farm = await Farm.deploy(
  //   "0xc3dbf84abb494ce5199d5d4d815b10ec29529ff8",
  //   3600,
  //   // farmNFT.address
  //   "0x342994474786b3c43cba3c0990de17a31c2c826e"
  // );
  // console.log("farm deployed to:", farm.address);

  // await farm.deployed();

  // console.log("farm deployed to:", farm.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
