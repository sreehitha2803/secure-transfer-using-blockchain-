import "./App.css";
import { useState, useEffect } from "react";
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";
import configurations from '../src/contracts/Funder.json'; 

function App() {
  const [web3Api, setweb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [accounts, setAccounts] = useState(null);
  const [balance, setBalance] = useState(null);
  const [reload, shouldReload] = useState(false);
  const [recipientAccountTransfer, setRecipientAccountTransfer] = useState(""); 

  const reloadEffect = () => shouldReload(!reload);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        provider.on("accountsChanged", (accounts) => {
          setAccounts(accounts[0]);
        });
        try {
          const accounts = await provider.request({ method: "eth_requestAccounts" });
          setAccounts(accounts[0]);
          const web3 = new Web3(provider);
          const abi = configurations.abi;
          const contractAddress = configurations.networks["5777"].address; 
          const contract = new web3.eth.Contract(abi, contractAddress);
          setweb3Api({
            web3,
            provider,
            contract,
          });
        } catch (error) {
          console.error("Error requesting accounts:", error.message || JSON.stringify(error));
        }
      } else {
        console.error("MetaMask is not installed. Please install MetaMask!");
      }
    };
    loadProvider();
  },[])

  useEffect(() => {
    const loadBalance = async () => {
      const { web3 } = web3Api;
      if (web3 && accounts) {
        try {
          const balance = await web3.eth.getBalance(accounts);
          const balanceInEther = web3.utils.fromWei(balance, "ether");
          setBalance(parseFloat(balanceInEther).toFixed(5)); 
        } catch (error) {
          console.error("Error fetching account balance:", error);
        }
      }
    };
    if (accounts) {
      loadBalance(); 
    }
  }, [web3Api, accounts, reload]);

  const transferFund = async () => {
    const { web3 } = web3Api;
    if (!web3 || !accounts || !recipientAccountTransfer) {
      console.error("Missing information. Please make sure everything is set.");
      return;
    }
  
    try {
      const senderAccount = accounts;
      const transaction = await web3.eth.sendTransaction({
        from: senderAccount,
        to: recipientAccountTransfer,
        value: web3.utils.toWei("2", "ether"),
      });
      const receipt = await web3.eth.getTransactionReceipt(transaction.transactionHash);
  
      if (receipt && receipt.status) {
        reloadEffect(); 
        alert("Transfer successful!");
      } else {
        console.error("Transfer failed.");
        alert("Transfer failed!");
      }
  
    } catch (error) {
      console.error("Transfer failed:", error.message || error);
      alert("An error occurred during the transfer.");
    }
  };
  
  return (
    <div className="card text-center">
      <h1> Ashwamedha Transactioins</h1>
      <h3> In-built pioneer for Trust and Security</h3>
      <div className="card-header">Funding</div>
      <div className="card-body">
        <h5 className="card-title">Balance: {balance} ETH</h5>
        <p className="card-text">
          Account : {accounts ? accounts : "not connected"}
        </p>
        <div>
          <input
            type="text"
            placeholder="Recipient address for transfer"
            value={recipientAccountTransfer}
            onChange={(e) => setRecipientAccountTransfer(e.target.value)}
          />
          <button type="button" className="btn btn-success" onClick={transferFund}>
            Transfer 2 ETH
          </button>
        </div>
      </div>
      <div className="card-footer text-muted">Gagandeep D</div>
    </div>
  );
}

export default App;
