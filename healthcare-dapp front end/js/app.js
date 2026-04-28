// ============================================
// MedChain DApp — app.js
// Connects to MetaMask + HealthcareDataSharing
// ============================================

let provider, signer, contract, userAddress;

// ─── INIT ───────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  if (window.ethereum) {
    // Auto-detect if already connected
    window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
      if (accounts.length > 0) initWeb3(accounts[0]);
    });
    window.ethereum.on('accountsChanged', accounts => {
      if (accounts.length > 0) initWeb3(accounts[0]);
      else disconnectWallet();
    });
  }
  document.getElementById('connectBtn').addEventListener('click', connectWallet);
});

// ─── WALLET CONNECT ─────────────────────────
async function connectWallet() {
  if (!window.ethereum) {
    showToast('❌ MetaMask not found. Please install it first.');
    return;
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    await initWeb3(accounts[0]);
  } catch (e) {
    showToast('❌ Connection rejected.');
  }
}

async function initWeb3(address) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  userAddress = address;
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  // Update UI
  const short = address.slice(0,6) + '...' + address.slice(-4);
  document.getElementById('walletLabel').textContent = short;
  document.getElementById('walletStatus').classList.replace('disconnected', 'connected');
  document.getElementById('connectBtn').textContent = 'Connected';
  document.getElementById('connectBtn').disabled = true;

  addLog(`Wallet connected: ${address}`, 'success');
  showToast(`✅ Connected: ${short}`);
  loadStats();
}

function disconnectWallet() {
  userAddress = null; contract = null; signer = null;
  document.getElementById('walletLabel').textContent = 'Not Connected';
  document.getElementById('walletStatus').classList.replace('connected', 'disconnected');
  document.getElementById('connectBtn').textContent = 'Connect MetaMask';
  document.getElementById('connectBtn').disabled = false;
  setStats('—', '—', '—', '—');
}

// ─── STATS ──────────────────────────────────
async function loadStats() {
  if (!contract) return;
  try {
    const [patients, doctors, records] = await Promise.all([
      contract.totalPatients(),
      contract.totalDoctors(),
      contract.totalRecords()
    ]);
    const network = await provider.getNetwork();
    setStats(patients.toString(), doctors.toString(), records.toString(), network.name === 'unknown' ? 'Local Ganache' : network.name);
  } catch (e) {
    console.warn('Stats load error:', e.message);
  }
}

function setStats(p, d, r, n) {
  document.getElementById('statPatients').textContent = p;
  document.getElementById('statDoctors').textContent = d;
  document.getElementById('statRecords').textContent = r;
  document.getElementById('statNetwork').textContent = n;
}

// ─── TABS ────────────────────────────────────
function setupTabs() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

// ─── PATIENT FUNCTIONS ───────────────────────
async function registerPatient() {
  if (!requireWallet()) return;
  const name = document.getElementById('patientName').value.trim();
  if (!name) return showStatus('patientRegStatus', 'error', '⚠️ Please enter your name.');
  showStatus('patientRegStatus', 'loading', '⏳ Sending transaction...');
  try {
    const tx = await contract.registerPatient(name);
    addLog(`registerPatient("${name}") → TX: ${tx.hash}`, 'pending');
    showStatus('patientRegStatus', 'loading', `⏳ Waiting for confirmation... TX: ${tx.hash.slice(0,18)}...`);
    await tx.wait();
    showStatus('patientRegStatus', 'success', `✅ Patient "${name}" registered successfully!`);
    addLog(`registerPatient confirmed: ${tx.hash}`, 'success');
    loadStats();
    showToast(`✅ Patient "${name}" registered!`);
  } catch (e) {
    const msg = parseError(e);
    showStatus('patientRegStatus', 'error', `❌ ${msg}`);
    addLog(`registerPatient failed: ${msg}`, 'error');
  }
}

async function grantAccess() {
  if (!requireWallet()) return;
  const addr = document.getElementById('grantDoctorAddr').value.trim();
  if (!isAddress(addr)) return showStatus('grantStatus', 'error', '⚠️ Invalid doctor address.');
  showStatus('grantStatus', 'loading', '⏳ Sending transaction...');
  try {
    const tx = await contract.grantAccess(addr);
    addLog(`grantAccess("${addr}") → TX: ${tx.hash}`, 'pending');
    await tx.wait();
    showStatus('grantStatus', 'success', `✅ Access granted to ${addr.slice(0,10)}...`);
    addLog(`grantAccess confirmed: ${tx.hash}`, 'success');
    showToast('✅ Doctor access granted!');
  } catch (e) {
    const msg = parseError(e);
    showStatus('grantStatus', 'error', `❌ ${msg}`);
    addLog(`grantAccess failed: ${msg}`, 'error');
  }
}

async function revokeAccess() {
  if (!requireWallet()) return;
  const addr = document.getElementById('revokeDoctorAddr').value.trim();
  if (!isAddress(addr)) return showStatus('revokeStatus', 'error', '⚠️ Invalid doctor address.');
  showStatus('revokeStatus', 'loading', '⏳ Sending transaction...');
  try {
    const tx = await contract.revokeAccess(addr);
    addLog(`revokeAccess("${addr}") → TX: ${tx.hash}`, 'pending');
    await tx.wait();
    showStatus('revokeStatus', 'success', `✅ Access revoked from ${addr.slice(0,10)}...`);
    addLog(`revokeAccess confirmed: ${tx.hash}`, 'success');
    showToast('🔒 Doctor access revoked!');
  } catch (e) {
    const msg = parseError(e);
    showStatus('revokeStatus', 'error', `❌ ${msg}`);
    addLog(`revokeAccess failed: ${msg}`, 'error');
  }
}

async function checkRecordCount() {
  if (!requireWallet()) return;
  let addr = document.getElementById('checkPatientAddr').value.trim();
  if (!addr) addr = userAddress;
  if (!isAddress(addr)) return showStatus('recordCountResult', 'error', '⚠️ Invalid address.');
  showStatus('recordCountResult', 'loading', '⏳ Querying...');
  try {
    const count = await contract.getPatientRecordCount(addr);
    showStatus('recordCountResult', 'info', `📋 ${addr.slice(0,10)}... has ${count.toString()} record(s) on-chain.`);
    addLog(`getPatientRecordCount("${addr}") = ${count}`, 'success');
  } catch (e) {
    showStatus('recordCountResult', 'error', `❌ ${parseError(e)}`);
  }
}

// ─── DOCTOR FUNCTIONS ────────────────────────
async function registerDoctor() {
  if (!requireWallet()) return;
  const name = document.getElementById('doctorName').value.trim();
  if (!name) return showStatus('doctorRegStatus', 'error', '⚠️ Please enter your name.');
  showStatus('doctorRegStatus', 'loading', '⏳ Sending transaction...');
  try {
    const tx = await contract.registerDoctor(name);
    addLog(`registerDoctor("${name}") → TX: ${tx.hash}`, 'pending');
    showStatus('doctorRegStatus', 'loading', `⏳ Waiting for confirmation...`);
    await tx.wait();
    showStatus('doctorRegStatus', 'success', `✅ Dr. "${name}" registered successfully!`);
    addLog(`registerDoctor confirmed: ${tx.hash}`, 'success');
    loadStats();
    showToast(`✅ Dr. "${name}" registered!`);
  } catch (e) {
    const msg = parseError(e);
    showStatus('doctorRegStatus', 'error', `❌ ${msg}`);
    addLog(`registerDoctor failed: ${msg}`, 'error');
  }
}

async function uploadRecord() {
  if (!requireWallet()) return;
  const patientAddr = document.getElementById('uploadPatientAddr').value.trim();
  const cid = document.getElementById('ipfsCID').value.trim();
  const recType = document.getElementById('recordType').value;
  if (!isAddress(patientAddr)) return showStatus('uploadStatus', 'error', '⚠️ Invalid patient address.');
  if (!cid) return showStatus('uploadStatus', 'error', '⚠️ Please enter an IPFS CID.');
  showStatus('uploadStatus', 'loading', '⏳ Uploading record to blockchain...');
  try {
    const tx = await contract.uploadRecord(patientAddr, cid, recType);
    addLog(`uploadRecord("${patientAddr}", "${cid}", "${recType}") → TX: ${tx.hash}`, 'pending');
    showStatus('uploadStatus', 'loading', `⏳ Waiting for block confirmation...`);
    const receipt = await tx.wait();
    showStatus('uploadStatus', 'success', `✅ Record uploaded! Block: ${receipt.blockNumber} | TX: ${tx.hash.slice(0,18)}...`);
    addLog(`uploadRecord confirmed in block ${receipt.blockNumber}: ${tx.hash}`, 'success');
    loadStats();
    showToast(`✅ Medical record anchored on blockchain!`);
  } catch (e) {
    const msg = parseError(e);
    showStatus('uploadStatus', 'error', `❌ ${msg}`);
    addLog(`uploadRecord failed: ${msg}`, 'error');
  }
}

// ─── VIEW RECORD ─────────────────────────────
async function getRecord() {
  if (!requireWallet()) return;
  const patientAddr = document.getElementById('viewPatientAddr').value.trim();
  const recordId = document.getElementById('viewRecordId').value.trim();
  if (!isAddress(patientAddr)) return showStatus('recordResult', 'error', '⚠️ Invalid patient address.');
  if (!recordId || !recordId.startsWith('0x')) return showStatus('recordResult', 'error', '⚠️ Record ID must start with 0x...');
  showStatus('recordResult', 'loading', '⏳ Retrieving record...');
  document.getElementById('recordCard').classList.add('hidden');
  try {
    const result = await contract.getRecord(recordId, patientAddr);
    const [ipfsCID, recordType, timestamp] = result;
    const date = new Date(timestamp.toNumber() * 1000).toLocaleString();
    showStatus('recordResult', 'success', '✅ Record retrieved successfully!');
    addLog(`getRecord("${recordId}") → CID: ${ipfsCID}`, 'success');
    const card = document.getElementById('recordCard');
    card.classList.remove('hidden');
    card.innerHTML = `
      <h3>📋 Medical Record Details</h3>
      <div class="record-field"><span class="record-field-label">Type</span><span class="record-field-value">${recordType}</span></div>
      <div class="record-field"><span class="record-field-label">IPFS CID</span><span class="record-field-value">${ipfsCID}</span></div>
      <div class="record-field"><span class="record-field-label">Timestamp</span><span class="record-field-value">${date}</span></div>
      <div class="record-field"><span class="record-field-label">Record ID</span><span class="record-field-value">${recordId}</span></div>
    `;
  } catch (e) {
    const msg = parseError(e);
    showStatus('recordResult', 'error', `❌ ${msg}`);
    addLog(`getRecord failed: ${msg}`, 'error');
  }
}

// ─── HELPERS ─────────────────────────────────
function requireWallet() {
  if (!contract) {
    showToast('⚠️ Please connect MetaMask first.');
    return false;
  }
  return true;
}

function isAddress(addr) {
  return ethers.utils.isAddress(addr);
}

function parseError(e) {
  if (e.reason) return e.reason;
  if (e.data?.message) return e.data.message;
  if (e.message) {
    // Clean up common revert messages
    const m = e.message;
    if (m.includes('Already registered')) return 'Already registered on-chain.';
    if (m.includes('Only verified doctors')) return 'Only registered doctors can do this.';
    if (m.includes('Patient not registered')) return 'Patient is not registered.';
    if (m.includes('Access denied')) return 'Access denied — no permission.';
    if (m.includes('user rejected')) return 'Transaction rejected by user.';
    return m.slice(0, 120);
  }
  return 'Unknown error occurred.';
}

function showStatus(id, type, msg) {
  const el = document.getElementById(id);
  el.className = `status-msg show ${type}`;
  el.textContent = msg;
}

function addLog(msg, type) {
  const box = document.getElementById('txLogs');
  const empty = box.querySelector('.tx-empty');
  if (empty) empty.remove();
  const time = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = `tx-entry ${type}`;
  entry.innerHTML = `<span class="tx-time">[${time}]</span> ${msg}`;
  box.appendChild(entry);
  box.scrollTop = box.scrollHeight;
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 3500);
}
