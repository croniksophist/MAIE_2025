const { ethers } = require("hardhat");

async function main() {
    const MAIEDataSharing = await ethers.getContractFactory("MAIEDataSharing");
    const contract = await MAIEDataSharing.deploy();

    await contract.deployed();
    console.log(`MAIEDataSharing deployed to: ${contract.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
