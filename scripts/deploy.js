import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  console.log("Deploying ChimeraFactory...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const ChimeraFactory = await ethers.getContractFactory("ChimeraFactory");
  const chimeraFactory = await ChimeraFactory.deploy();
  
  await chimeraFactory.waitForDeployment();
  
  const address = await chimeraFactory.getAddress();
  console.log("ChimeraFactory deployed to:", address);
  
  // Save deployment info for frontend
  const deploymentInfo = {
    address: address,
    network: hardhat.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });