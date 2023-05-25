# Proof-of-Asset-Eth

Tokenization of Real World Assets (RWA) based on a contract file (i.e. can be a single PDF or zip bundle).


## Development 

### Install & run Ganache CLI

`MNEMONIC_DEV` should be the seed words in the client (i.e. Metamask) NEVER use a MNEMONIC used on mainnet, always have a dedicated Mnemonic in a dedicated Metamask instance for testing.

`$ npm install ganache --global`

`$ ganache --wallet.mnemonic "$MNEMONIC_DEV" --networkId 5777 --port 7545`


### Ganache Documentation

[Ganache Homepage - GUI version](https://trufflesuite.com/ganache/)

[Ganache JSON-RPC Documentation](https://ganache.dev/)

[Ganache on github](https://github.com/trufflesuite/ganache)