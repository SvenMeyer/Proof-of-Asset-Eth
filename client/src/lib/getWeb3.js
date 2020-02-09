import Web3 from "web3";

const getWeb3 = async () => {
  // new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    // window.addEventListener("load", async () => {
      // Modern dapp browsers...
/*
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        console.log({web3})
        try {
          // Request account access if needed
          console.log("await window.ethereum.enable();")
          await window.ethereum.enable();
          console.log({web3})
          // Acccounts now exposed
          Promise.resolve(web3);
        } catch (error) {
          console.log("error getting web3 : error =", error)
          Promise.reject(error);
        }
      }
      // Legacy dapp browsers...
      else
*/
      let provider;
      if (window.web3) {
        // Use Mist/MetaMask's provider.
        provider = window.web3.currentProvider;

      }
      else {
        console.log("No web3 instance injected");
        provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
      }
      console.log("provider =", provider);
      const web3 = new Web3(provider);
      return Promise.resolve(web3);
  //  });
  // });
}

export default getWeb3;
