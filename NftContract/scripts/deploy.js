const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const timeLess = await ethers.getContractFactory("TimeLess");

  const deployedTimeLessContract = await timeLess.deploy();

  await deployedTimeLessContract.deployed();

  console.log(
    " Contract Address:",
    deployedTimeLessContract.address
  );

  console.log("Sleeping.....");

  await sleep(40000);

  await hre.run("verify:verify", {
    address: deployedTimeLessContract.address,
    constructorArguments: [],
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
