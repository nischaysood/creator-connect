import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
    solidity: "0.8.20",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            chainId: 31337,
            url: "http://127.0.0.1:8545",
        },
        opencampus: {
            url: "https://rpc.open-campus-codex.gelato.digital",
            chainId: 656476,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },
};
