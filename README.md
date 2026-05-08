# BlockVote - Decentralized Voting Platform

BlockVote is a secure, blockchain-based voting web application designed for transparency, security, and reliable vote counting. This project separates the frontend (React/Vite) from the backend (Node/Express), utilizing Polygon Amoy for smart contracts and IPFS/Pinata for decentralized data storage.

---

## 🌟 What BlockVote Can Do Currently

1. **Voter Registration & Authentication (OTP)**
   - Voters sign up using a strict Indian Voter ID format (`ABC1234567`) and their Email address.
   - The backend uses Nodemailer to send a secure 6-digit OTP to their email.
   - Authentication is secured using JSON Web Tokens (JWT) and Express Sessions.

2. **Admin Dashboard & Candidate Management**
   - An admin can log in to the portal and add new candidates (Name, Party, Image URL).
   - The candidate's metadata is bundled and uploaded to **IPFS via Pinata** for decentralized storage.
   - The returned IPFS CID (Content Identifier) is then stored permanently on the Polygon Amoy blockchain.

3. **Secure On-Chain Voting**
   - Voters connect their MetaMask wallets.
   - The frontend automatically prompts the voter to switch to the **Polygon Amoy Testnet**.
   - Voters cast their vote directly to the smart contract, paying a small gas fee in POL.
   - The smart contract (`Voting.sol`) strictly enforces a "One Voter, One Vote" policy.

4. **Live Results**
   - The frontend queries the smart contract in real-time to display the exact, tamper-proof vote count.
   - Vote counts are *never* stored in the central MongoDB database.

---

## ⚙️ About Ethers v6 Integration
**Ethers.js (v6)** is the Javascript library used in the frontend to communicate with the blockchain. 
* **Wallet Connection:** It handles popping up MetaMask and requesting the user's wallet address.
* **Network Switching:** It contains the logic to automatically detect if the user is on the wrong network and prompts MetaMask to switch to Polygon Amoy (Chain ID: 80002).
* **Smart Contract Interaction:** It translates Javascript functions (like `onVote(candidateId)`) into secure transactions that are sent to your deployed `Voting.sol` contract.

---

## 🚀 Deployment Guide (Vercel, Render, Doppler)

You will need accounts on **Vercel** (Frontend), **Render** (Backend), **MongoDB Atlas**, **Pinata Cloud**, and **Doppler** (Secrets Management).

### Step 1: Set Up Doppler
Doppler will securely hold your environment variables.
1. Create a project in Doppler called `BlockVote`.
2. Create two environments or configs: one for `Backend` and one for `Frontend`.
3. Fill in the variables based on the `.env.template` files provided in the folders.
   - **Backend:** `MONGODB_URI`, `JWT_SECRET`, `SMTP_HOST/USER/PASS`, `PINATA_JWT`, `SESSION_SECRET`.
   - **Frontend:** `VITE_API_URL` (Your Render URL), `VITE_VOTING_CONTRACT_ADDRESS`, `VITE_POLYGON_AMOY_RPC`.

### Step 2: Deploy Smart Contract
You need to deploy the smart contract to Polygon Amoy to get your `VITE_VOTING_CONTRACT_ADDRESS`.
1. Open a terminal in the root `BlockVote` folder.
2. Create a `.env` file and add your MetaMask Private Key: `PRIVATE_KEY=your_metamask_private_key_here`
3. Run the deployment script:
   ```bash
   npx hardhat run scripts/deploy.js --network polygonAmoy
   ```
4. Copy the output address and add it to Doppler as `VITE_VOTING_CONTRACT_ADDRESS`.

### Step 3: Deploy Backend to Render
1. Push your code to GitHub.
2. In Render, create a new **Web Service**.
3. Connect your GitHub repository and select the `backend` folder as the Root Directory.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. In the Environment section, connect it to your Doppler backend config (Render has a native Doppler integration, or you can paste the variables manually).
7. Deploy! Copy the Render URL (e.g., `https://blockvote-backend.onrender.com/api`) and put it in Doppler as the frontend's `VITE_API_URL`.

### Step 4: Deploy Frontend to Vercel
1. In Vercel, click "Add New Project" and select your GitHub repo.
2. Set the **Framework Preset** to `Vite`.
3. Set the **Root Directory** to `frontend`.
4. Connect the Vercel project to your Doppler frontend config (Vercel has an integration for Doppler).
5. Deploy!

You are now live!
