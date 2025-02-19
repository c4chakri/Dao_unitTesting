require("dotenv").config(); // Load environment variables
const { ethers } = require("ethers");
const fetch = require("node-fetch");

// Load API keys
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

if (!INFURA_API_KEY || !ETHERSCAN_API_KEY) {
    console.error("Missing API keys. Please check your .env file.");
    process.exit(1);
}

// Ethereum provider setup
const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`);

/**
 * Fetches the contract ABI from Etherscan.
 * @param {string} contractAddress - The Ethereum contract address.
 * @returns {Promise<Array>} The ABI of the contract.
 */
async function getContractABI(contractAddress) {
    try {
        const etherscanAPI = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;
        const response = await fetch(etherscanAPI);
        const data = await response.json();
        console.log(data);
        
        if (data.status !== "1") {
            throw new Error(`Failed to fetch ABI: ${data.message}`);
        }

        return JSON.parse(data.result);
    } catch (error) {
        console.error("Error fetching contract ABI:", error);
        return null;
    }
}
// async function getContractABI(contractAddress) {
//     try {
//         const etherscanAPI = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;
//         const response = await fetch(etherscanAPI);
//         const data = await response.json();
        
//         if (data.status !== "1") {
//             throw new Error(`Failed to fetch ABI: ${data.message}`);
//         }

//         const abi = JSON.parse(data.result);

//         // Check if it's a proxy contract (Etherscan labels proxies)
//         const proxyCheckAPI = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;
//         const proxyResponse = await fetch(proxyCheckAPI);
//         const proxyData = await proxyResponse.json();

//         if (proxyData.status === "1" && proxyData.result.length > 0) {
//             const implementationAddress = proxyData.result[0].Implementation;
            
//             if (implementationAddress && implementationAddress !== "0x") {
//                 console.log(`Proxy detected. Fetching ABI of implementation contract: ${implementationAddress}`);
//                 return await getContractABI(implementationAddress);
//             }
//         }

//         return abi;
//     } catch (error) {
//         console.error("Error fetching contract ABI:", error);
//         return null;
//     }
// }

/**
 * Encodes function data for a contract call.
 * @param {Array} abi - The ABI of the contract.
 * @param {string} functionName - The name of the function to encode.
 * @param {Array} functionArgs - The arguments for the function.
 * @returns {Promise<string>} The encoded function data (msg.data).
 */
async function encodeFunctionData(abi, functionName, functionArgs) {
    try {
        const contractInterface = new ethers.Interface(abi);
        return contractInterface.encodeFunctionData(functionName, functionArgs);
    } catch (error) {
        console.error(`Error encoding function data for ${functionName}:`, error);
        return null;
    }
}

/**
 * Main function to execute the encoding process.
 */
async function encodedDataFunction(contractAddress, functionName, functionArgs) {
    try {

        console.log("Fetching contract ABI...");
        const abi = await getContractABI(contractAddress);
        if (!abi) return;

        console.log(`Encoding function: ${functionName} with args:`, functionArgs);
        const encodedData = await encodeFunctionData(abi, functionName, functionArgs);
        if (!encodedData) return;

        const action = [contractAddress, 0, encodedData];
        console.log("Encoded Action:", action);

        return action;
    } catch (error) {
        console.error("Unexpected error:", error);
    }
}
const contractAddress = "0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413";
const functionName = "approve";
const functionArgs = ["0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", "1"];

// encodedDataFunction(contractAddress, functionName, functionArgs);
module.exports = { encodedDataFunction };


getContractABI("0x65702FD8B3C5dd7bC11B1dEAE690f9a6Bb11466f").then((abi) => {
    console.log("ABI:", abi);
  });