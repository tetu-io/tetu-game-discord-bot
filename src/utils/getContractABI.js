const { readFileSync } = require('fs');

function getContractABI(file) {
  const rawABI = readFileSync(`./abi/${file}.json`);
  const ABI = JSON.parse(rawABI);
  return ABI;
}

module.exports = {
  getContractABI
}