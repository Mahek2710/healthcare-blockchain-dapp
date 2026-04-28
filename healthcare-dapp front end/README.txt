# MedChain — Healthcare DApp Frontend

## How to Run

1. Open Ganache → make sure it's running on http://127.0.0.1:7545
2. Make sure MetaMask is connected to Local Ganache network
3. Open `index.html` directly in your browser (double-click it)
   - OR use VS Code Live Server extension for best results
4. Click "Connect MetaMask" → approve the connection
5. Start interacting!

## Features
- Register Patient / Doctor
- Grant & Revoke doctor access
- Upload medical record (IPFS CID) to blockchain
- View medical record (with access check)
- Live transaction logs
- Real-time stats (patients, doctors, records)

## Contract Address
0x1e33FD11f450FE2E638AaCF72CD97fECE3BF5F3B

## Files
- index.html → Main page
- css/style.css → Styling
- js/abi.js → Contract ABI & address
- js/app.js → All Web3 logic

## Note
If you redeploy the contract, update CONTRACT_ADDRESS in js/abi.js
