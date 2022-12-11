Marketplace = artifacts.require("Marketplace");
//Rock = artifacts.require("Rock");

module.exports = function (deployer) {
  deployer.deploy(Marketplace);
  //deployer.deploy(Rock);
};