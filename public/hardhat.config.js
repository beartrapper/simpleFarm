require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 

*/

const ALCHEMY_URL =
  "https://rinkeby.infura.io/v3/3caa0d925b3d4c488f0d72a8b0763274";
const PRIVATE_KEY =
  "b362cf46c552914a81e83fabe4053d45db690eb9c4bf44883a92c07f5a99f24f";

module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "rinkeby",
  networks: {
    rinkeby: {
      url: ALCHEMY_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    localhost: {
      url: "http://localhost:8545/",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ],
    },
  },
};
