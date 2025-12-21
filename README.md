# Creator Connect 🚀

MNEE Hackathon Project: Programmable Money for Agents, Commerce, and Automated Finance.

Creator Connect is a platform where brands launch campaigns funded by MNEE stablecoin, and AI Agents verify creator submissions (Instagram/YouTube) to automatically release payments via Smart Contracts.

## 🌟 Features

- **Brand Dashboard**: Create campaigns, fund with MNEE.
- **Creator Dashboard**: Enroll, Submit URLs.
- **AI Verification**: Next.js API "Agent" verifies content and triggers on-chain payout.
- **Escrow**: Smart Contract holds funds until logic is satisfied.

## 🛠 Prerequisites

- Node.js & NPM
- MetaMask (or other wallet) connected to **Localhost 8545**

## 🚀 Quick Start

### 1. Start Support Chain (Hardhat)
```bash
cd contracts
npx hardhat node
```

### 2. Deploy Contracts
In a new terminal:
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network localhost
```
*Note the deployed addresses. If they differ from below, update `frontend/app/create/page.tsx` and `frontend/app/page.tsx`.*
- MockMNEE: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Escrow: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

### 3. Start Frontend & Agent
In a new terminal:
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## 🧪 Demo Flow

1. **Brand**: Connect Wallet (Account #0 from Hardhat node).
2. **Brand**: Go to "Create Campaign".
3. **Brand**: "Approve" MNEE (Minted to you on deploy).
4. **Brand**: "Create Campaign".
5. **Creator**: Switch Wallet to Account #2.
6. **Creator**: Go to Dashboard -> Campaign #0.
7. **Creator**: Click "Enroll".
8. **Creator**: Enter a URL (must contain "instagram.com" or "youtube.com").
9. **Creator**: Click "Submit Link".
10. **Creator**: Click "Verify with AI Agent".
11. **Result**: Agent verifies and funds appear in Creator wallet!

## 📦 Project Structure

- `contracts/`: Hardhat (Solidity)
- `frontend/`: Next.js (App Router, Wagmi, Tailwind)
- `frontend/app/api/verify`: The AI Agent logic
