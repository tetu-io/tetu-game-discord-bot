const ethers = require('ethers');

function getProvider() {
  return new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
}

module.exports = {
  getProvider,
};