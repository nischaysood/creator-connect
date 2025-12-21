import hre from "hardhat";
const { ethers } = hre;

async function main() {
    const [deployer, agent] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Agent address:", agent.address);

    // Deploy Mock MNEE
    const mnee = await ethers.deployContract("MockMNEE");
    await mnee.waitForDeployment();
    const mneeAddress = await mnee.getAddress();
    console.log("MockMNEE deployed to:", mneeAddress);

    // Deploy Verifier Agent (just using the 2nd signer as agent for now)
    const verifierAgentAddress = agent.address;

    // Deploy Escrow
    const escrow = await ethers.deployContract("CreatorConnectEscrow", [
        mneeAddress,
        verifierAgentAddress
    ]);
    await escrow.waitForDeployment();
    console.log("CreatorConnectEscrow deployed to:", await escrow.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
