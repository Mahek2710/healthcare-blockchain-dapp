// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PatientRegistry.sol";

contract AccessControl {

    PatientRegistry public registry;

    enum AccessStatus { NONE, REQUESTED, GRANTED, REVOKED }

    struct AccessRecord {
        address patient;
        address doctor;
        string ipfsCID;
        AccessStatus status;
        uint256 requestedAt;
        uint256 grantedAt;
        uint256 revokedAt;
    }

    struct AuditLog {
        address actor;
        string action;
        uint256 timestamp;
    }

    mapping(address => mapping(address => AccessRecord)) private accessRecords;
    AuditLog[] public auditTrail;

    event AccessRequested(address indexed doctor, address indexed patient, uint256 timestamp);
    event AccessGranted(address indexed patient, address indexed doctor, string ipfsCID, uint256 timestamp);
    event AccessRevoked(address indexed patient, address indexed doctor, uint256 timestamp);
    event RecordViewed(address indexed doctor, address indexed patient, uint256 timestamp);

    constructor(address _registryAddr) {
        registry = PatientRegistry(_registryAddr);
    }

    function requestAccess(address _patient) public {
        require(registry.isDoctorVerified(msg.sender), "Not a verified doctor");
        require(registry.isPatientRegistered(_patient), "Patient not found");

        require(
            accessRecords[_patient][msg.sender].status == AccessStatus.NONE ||
            accessRecords[_patient][msg.sender].status == AccessStatus.REVOKED,
            "Request already exists"
        );

        accessRecords[_patient][msg.sender] = AccessRecord({
            patient: _patient,
            doctor: msg.sender,
            ipfsCID: "",
            status: AccessStatus.REQUESTED,
            requestedAt: block.timestamp,
            grantedAt: 0,
            revokedAt: 0
        });

        auditTrail.push(AuditLog(msg.sender, "REQUESTED", block.timestamp));

        emit AccessRequested(msg.sender, _patient, block.timestamp);
    }

    function grantAccess(address _doctor, string memory _ipfsCID) public {
        require(registry.isPatientRegistered(msg.sender), "Not a registered patient");

        require(
            accessRecords[msg.sender][_doctor].status == AccessStatus.REQUESTED,
            "No pending request"
        );

        accessRecords[msg.sender][_doctor].status = AccessStatus.GRANTED;
        accessRecords[msg.sender][_doctor].ipfsCID = _ipfsCID;
        accessRecords[msg.sender][_doctor].grantedAt = block.timestamp;

        auditTrail.push(AuditLog(msg.sender, "GRANTED", block.timestamp));

        emit AccessGranted(msg.sender, _doctor, _ipfsCID, block.timestamp);
    }

    function revokeAccess(address _doctor) public {
        require(
            accessRecords[msg.sender][_doctor].status == AccessStatus.GRANTED,
            "Access not currently granted"
        );

        accessRecords[msg.sender][_doctor].status = AccessStatus.REVOKED;
        accessRecords[msg.sender][_doctor].revokedAt = block.timestamp;

        auditTrail.push(AuditLog(msg.sender, "REVOKED", block.timestamp));

        emit AccessRevoked(msg.sender, _doctor, block.timestamp);
    }

    function viewRecord(address _patient) public returns (string memory) {
        require(
            accessRecords[_patient][msg.sender].status == AccessStatus.GRANTED,
            "Access not granted"
        );

        auditTrail.push(AuditLog(msg.sender, "VIEWED", block.timestamp));

        emit RecordViewed(msg.sender, _patient, block.timestamp);

        return accessRecords[_patient][msg.sender].ipfsCID;
    }

    function checkAccess(address _patient, address _doctor)
        public view returns (string memory)
    {
        AccessStatus s = accessRecords[_patient][_doctor].status;

        if (s == AccessStatus.NONE) return "NONE";
        if (s == AccessStatus.REQUESTED) return "REQUESTED";
        if (s == AccessStatus.GRANTED) return "GRANTED";
        return "REVOKED";
    }

    function totalAuditLogs() public view returns (uint256) {
        return auditTrail.length;
    }
}