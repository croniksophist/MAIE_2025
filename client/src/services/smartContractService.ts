import { ethers } from "ethers";

// Replace with your actual deployed contract address
const CONTRACT_ADDRESS = "0x611e60c485d80883471537DA71dA3d5DE060Fc1D"; 

const ABI = [
    {
        "inputs": [],
        "name": "datasetCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "_name", "type": "string"},
            {"internalType": "string", "name": "_ipfsHash", "type": "string"},
            {"internalType": "uint256", "name": "_price", "type": "uint256"}
        ],
        "name": "addDataset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_datasetId", "type": "uint256"}],
        "name": "purchaseDataset",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

export const getSmartContract = async () => {
    if (window.ethereum) {
        try {
            // Initialize provider and signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            // Create the contract instance
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

            // Check if contract is working by calling datasetCount
            const count = await contract.datasetCount();
            console.log("Dataset count: ", count.toString());
            
            // Return contract if everything is successful
            return contract;
        } catch (error) {
            // Log error if contract interaction fails
            console.error("Error interacting with the contract:", error);
            alert("Error connecting to the smart contract or calling a method.");
            return null;
        }
    } else {
        alert("Please install MetaMask to interact with smart contracts!");
        return null;
    }
};
