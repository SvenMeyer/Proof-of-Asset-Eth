var FECoin = artifacts.require("./FECoin.sol");

module.exports = function (deployer) {
  deployer.deploy(FECoin);
};