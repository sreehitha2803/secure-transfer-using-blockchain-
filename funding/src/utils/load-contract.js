export const loadContract = async (name, provider) => {
    // Load the ABI JSON file (ensure it's stored locally or fetched from an API)
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();
  
    // Create a new Web3 instance with the provider
    const web3 = new Web3(provider);
  
    // Get the contract address and ABI from the artifact
    const contractAddress = Artifact.networks['5777'].address; // Use the correct network ID
    const contractABI = Artifact.abi;
  
    // Create a contract instance
    const contract = new web3.eth.Contract(contractABI, contractAddress);
  
    return contract;
  };
  