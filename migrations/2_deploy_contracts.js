var ProofOfAsset = artifacts.require("./ProofOfAsset.sol");

module.exports = function (deployer) {
  deployer.deploy(ProofOfAsset);
};