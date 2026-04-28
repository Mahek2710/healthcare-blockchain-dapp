const PatientRegistry = artifacts.require("PatientRegistry");
const AccessControl = artifacts.require("AccessControl");

module.exports = async function (deployer) {
  // Deploy PatientRegistry first
  await deployer.deploy(PatientRegistry);
  const registry = await PatientRegistry.deployed();

  // Deploy AccessControl with PatientRegistry's address
  await deployer.deploy(AccessControl, registry.address);
};