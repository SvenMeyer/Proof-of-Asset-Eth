var ProofOfAssetMint = artifacts.require("./ProofOfAssetMint.sol");

module.exports = function (deployer) {
  deployer.deploy(ProofOfAssetMint);
};