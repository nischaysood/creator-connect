import hre from "hardhat";
const { ethers } = hre;

async function main() {
    const [deployer, creator] = await ethers.getSigners();
    const mneeAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Default Hardhat deployment address

    console.log("\nChecking balances on Localhost...");

    try {
        const mnee = await ethers.getContractAt("MockMNEE", mneeAddress);

        const balanceBrand = await mnee.balanceOf(deployer.address);
        const balanceCreator = await mnee.balanceOf(creator.address);

        console.log("------------------------------------------");
        console.log(`Brand Address:   ${deployer.address}`);
        console.log(`Brand Balance:   ${ethers.formatEther(balanceBrand)} MNEE`);
        console.log("------------------------------------------");
        console.log(`Creator Address: ${creator.address}`);
        console.log(`Creator Balance: ${ethers.formatEther(balanceCreator)} MNEE`);
        console.log("------------------------------------------");

        if (balanceBrand == 0n && balanceCreator == 0n) {
            console.log("\n⚠️  BALANCES ARE 0! Check if 'npx hardhat node' was restarted.");
            console.log("👉 Run: npx hardhat run scripts/setup_full_test.ts --network localhost");
        } else {
            console.log("\n✅ Balances exist on chain. Issue is likely in MetaMask.");
        }

    } catch (error) {
        console.error("Error connecting to MNEE contract:", error);
        console.log("Make sure 'npx hardhat node' is running and contracts are deployed.");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
