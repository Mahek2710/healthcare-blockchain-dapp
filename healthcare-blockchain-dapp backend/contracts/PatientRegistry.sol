// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PatientRegistry {
    address public owner;

    struct Patient {
        uint256 patientId;
        string name;
        address walletAddress;
        bool isRegistered;
        uint256 registeredAt;
    }

    struct Doctor {
        uint256 doctorId;
        string name;
        address walletAddress;
        string specialization;
        bool isVerified;
    }

    mapping(address => Patient) private patients;
    mapping(address => Doctor) private doctors;
    address[] public allPatients;
    address[] public allDoctors;

    event PatientRegistered(uint256 indexed patientId, address walletAddress, string name, uint256 timestamp);
    event DoctorRegistered(uint256 indexed doctorId, address walletAddress, string name, bool isVerified);

    modifier onlyOwner() {
        require(msg.sender == owner, 'Not authorized');
        _;
    }

    constructor() { owner = msg.sender; }

    function registerDoctor(address _doctorAddr, uint256 _doctorId, string memory _name, string memory _specialization) public onlyOwner {
        require(!doctors[_doctorAddr].isVerified, 'Already registered');
        doctors[_doctorAddr] = Doctor({doctorId: _doctorId, name: _name, walletAddress: _doctorAddr, specialization: _specialization, isVerified: true});
        allDoctors.push(_doctorAddr);
        emit DoctorRegistered(_doctorId, _doctorAddr, _name, true);
    }

    function registerPatient(uint256 _patientId, string memory _name) public {
        require(!patients[msg.sender].isRegistered, 'Already registered');
        patients[msg.sender] = Patient({patientId: _patientId, name: _name, walletAddress: msg.sender, isRegistered: true, registeredAt: block.timestamp});
        allPatients.push(msg.sender);
        emit PatientRegistered(_patientId, msg.sender, _name, block.timestamp);
    }

    function getPatient(address _addr) public view returns (uint256, string memory, address, uint256) {
        require(patients[_addr].isRegistered, 'Patient not found');
        Patient storage p = patients[_addr];
        return (p.patientId, p.name, p.walletAddress, p.registeredAt);
    }

    function isPatientRegistered(address _addr) public view returns (bool) { return patients[_addr].isRegistered; }
    function isDoctorVerified(address _addr) public view returns (bool) { return doctors[_addr].isVerified; }
    function totalPatients() public view returns (uint256) { return allPatients.length; }
    function totalDoctors() public view returns (uint256) { return allDoctors.length; }
}
