// ABI for HealthcareDataSharing.sol
const CONTRACT_ADDRESS = "0x1e33FD11f450FE2E638AaCF72CD97fECE3BF5F3B";

const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "patient", "type": "address"},
      {"indexed": true, "name": "doctor", "type": "address"}
    ],
    "name": "AccessGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "patient", "type": "address"},
      {"indexed": true, "name": "doctor", "type": "address"}
    ],
    "name": "AccessRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "doctorAddr", "type": "address"},
      {"indexed": false, "name": "doctorId", "type": "uint256"},
      {"indexed": false, "name": "name", "type": "string"}
    ],
    "name": "DoctorRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "patientAddr", "type": "address"},
      {"indexed": false, "name": "patientId", "type": "uint256"},
      {"indexed": false, "name": "name", "type": "string"}
    ],
    "name": "PatientRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "recordId", "type": "bytes32"},
      {"indexed": true, "name": "patientId", "type": "uint256"},
      {"indexed": false, "name": "ipfsCID", "type": "string"}
    ],
    "name": "RecordUploaded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "recordId", "type": "bytes32"},
      {"indexed": true, "name": "accessor", "type": "address"},
      {"indexed": false, "name": "timestamp", "type": "uint256"}
    ],
    "name": "RecordAccessed",
    "type": "event"
  },
  {
    "inputs": [{"name": "_doctorAddr", "type": "address"}],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_doctorAddr", "type": "address"}],
    "name": "revokeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_name", "type": "string"}],
    "name": "registerPatient",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_name", "type": "string"}],
    "name": "registerDoctor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_patientAddr", "type": "address"},
      {"name": "_ipfsCID", "type": "string"},
      {"name": "_recordType", "type": "string"}
    ],
    "name": "uploadRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_recordId", "type": "bytes32"},
      {"name": "_patientAddr", "type": "address"}
    ],
    "name": "getRecord",
    "outputs": [
      {"name": "", "type": "string"},
      {"name": "", "type": "string"},
      {"name": "", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalRecords",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_patientAddr", "type": "address"}],
    "name": "getPatientRecordCount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalPatients",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDoctors",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRecords",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "", "type": "address"}],
    "name": "patients",
    "outputs": [
      {"name": "patientId", "type": "uint256"},
      {"name": "name", "type": "string"},
      {"name": "isRegistered", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "", "type": "address"}],
    "name": "doctors",
    "outputs": [
      {"name": "doctorId", "type": "uint256"},
      {"name": "name", "type": "string"},
      {"name": "isVerified", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "", "type": "address"},
      {"name": "", "type": "address"}
    ],
    "name": "accessPermissions",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
];
