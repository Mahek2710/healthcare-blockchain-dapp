# 🏥 MedChain — Secure Healthcare Data Sharing using Blockchain

> A decentralized application (DApp) for secure, patient-controlled medical data sharing built on Ethereum blockchain.

📊 **Project Presentation:** [View on Canva](https://canva.link/035rf1zwuys4gbl)

---

## 👥 Team

| Name | Roll No | Class |
|------|---------|-------|
| Mahek Hingorani | 18 | D12B |
| Navya Rangwani | 43 | D12B |

**Department of Computer Engineering — VESIT, 2025-26**  
**Course:** Cryptocurrency & Blockchain Development

---

## 📌 Overview

MedChain is a blockchain-based healthcare DApp that enables **secure, transparent, and patient-controlled** sharing of medical records. It combines:

- **Ethereum** — on-chain smart contract logic
- **IPFS** — off-chain decentralized file storage
- **MetaMask** — wallet authentication & transaction signing
- **Truffle** — smart contract development & deployment framework

Only **IPFS content hashes (CIDs)** are stored on-chain. Actual medical files stay off-chain, ensuring privacy and scalability.

---

## 🏗️ System Architecture

```
Client Layer (Frontend)
        │
        ▼
MetaMask Wallet (ECDSA signing)
        │
        ▼
Middleware — Ganache / Infura (JSON-RPC)
        │
   ┌────┴────┐
   ▼         ▼
Ethereum    IPFS
Blockchain  Storage
(On-chain)  (Off-chain)
```

---

## 📄 Smart Contracts

| Contract | Role |
|----------|------|
| `PatientRegistry.sol` | Registers patients, maps wallet → identity |
| `AccessControl.sol` | Manages grant/revoke permissions between patients and doctors |

### Key Functions

```solidity
// Patient Registry
registerPatient(string name)
getPatient(address patientAddr)

// Access Control
grantAccess(address doctorAddr)
revokeAccess(address doctorAddr)
checkAccess(address patientAddr, address doctorAddr)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Blockchain | Ethereum (EVM) |
| Smart Contracts | Solidity 0.8.19 |
| Development Framework | Truffle |
| Local Blockchain | Ganache |
| Wallet | MetaMask |
| Frontend | React / HTML + Ethers.js |
| File Storage | IPFS |
| IDE | VS Code + Remix IDE |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [Ganache](https://trufflesuite.com/ganache/) (Desktop)
- [MetaMask](https://metamask.io/) browser extension
- [Truffle](https://trufflesuite.com/) — install globally:

```bash
npm install -g truffle
```

---

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/healthcare-blockchain-dapp.git
cd healthcare-blockchain-dapp

# 2. Install dependencies
npm install
```

---

### Running the DApp

**Step 1 — Start Ganache**
- Open Ganache Desktop
- Click **Quickstart (Ethereum)**
- Note the RPC URL: `http://127.0.0.1:7545`

**Step 2 — Configure MetaMask**
- Add custom network in MetaMask:
  - Network Name: `Local Ganache`
  - RPC URL: `http://127.0.0.1:7545`
  - Chain ID: `1337`
  - Currency: `ETH`
- Import a Ganache account using its private key

**Step 3 — Deploy Contracts**
```bash
truffle migrate --network development
```

**Step 4 — Open Truffle Console (optional testing)**
```bash
truffle console --network development
```

```javascript
// Test in console
let registry = await PatientRegistry.deployed()
registry.address
await registry.registerPatient("Alice", { from: accounts[0] })
await registry.getPatient(accounts[0])
```

**Step 5 — Launch Frontend**
```bash
# If using React
npm start

# If using plain HTML
# Open index.html directly in browser
```

---

## 🔐 How It Works

```
1. Patient registers  →  wallet address mapped on-chain
2. Doctor registers   →  verified on-chain (RBAC)
3. Doctor uploads record → IPFS CID stored on-chain
4. Patient grants access  →  permission recorded on-chain
5. Doctor views record    →  access checked → IPFS file retrieved
6. Patient revokes access →  permission removed on-chain
7. All actions logged     →  immutable audit trail on-chain
```

---

## 🌟 Key Features

- ✅ **Patient-Centric Control** — patients own and manage access to their data
- ✅ **Immutable Audit Trail** — every access request and permission change is logged on-chain
- ✅ **No Central Authority** — trustless, decentralized system
- ✅ **Data Integrity** — IPFS content hashing ensures files are never tampered with
- ✅ **Role-Based Access** — separate roles for patients, doctors, and admins
- ✅ **Gas Efficient** — only hashes stored on-chain, files stored off-chain

---

## ⚠️ Challenges & Limitations

| Challenge | Description |
|-----------|-------------|
| Scalability | Limited transactions per second on public Ethereum |
| Infrastructure Cost | Enterprise deployment requires significant investment |
| Regulatory Ambiguity | Evolving legal frameworks for healthcare blockchain |
| Key Management | Lost private keys = lost access to medical records |

---

## 📁 Project Structure

```
healthcare-blockchain-dapp/
├── contracts/
│   ├── PatientRegistry.sol      # Patient identity contract
│   └── AccessControl.sol        # Permission management contract
├── migrations/
│   └── 2_deploy_contracts.js    # Deployment script
├── build/
│   └── contracts/               # Compiled contract ABIs
├── test/                        # Contract test files
├── truffle-config.js            # Truffle configuration
└── README.md
```

---

## 📜 License

This project is developed for academic purposes under the Cryptocurrency & Blockchain Development course at VESIT, University of Mumbai.

---

*Built with ❤️ by Mahek Hingorani & Navya Rangwani — VESIT D12B*
