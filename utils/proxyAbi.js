require("dotenv").config();
const { ethers } = require("ethers");
const fetch = require("node-fetch");

// Load environment variables
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const RPC_URL = `https://sepolia.infura.io/v3/${INFURA_API_KEY}`;

// Initialize provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// EIP-1967 implementation storage slot
const IMPLEMENTATION_SLOT = "0x360894A13BA1A3210667C828492DB98DCA3E2076CC3735A920A3CA505D382BBC";

/**
 * Fetches the implementation address of a given proxy contract.
 * @param {string} proxyAddress - The address of the proxy contract.
 * @returns {Promise<string|null>} The implementation contract address or null if an error occurs.
 */
async function getImplementationAddress(proxyAddress) {
    try {
        const implStorage = await provider.getStorage(proxyAddress, IMPLEMENTATION_SLOT);
        if (!implStorage || implStorage === "0x") throw new Error("No implementation found at the slot.");
        const implAddress = ethers.getAddress("0x" + implStorage.slice(-40));
        console.log(`Implementation Address: ${implAddress}`);
        return implAddress;
    } catch (error) {
        console.error("Error fetching implementation address:", error.message);
        return null;
    }
}

/**
 * Fetches the ABI of the implementation contract from Etherscan.
 * @param {string} proxyAddress - The address of the proxy contract.
 * @returns {Promise<Array|null>} The ABI array or null if an error occurs.
 */
async function fetchImplementationABI(proxyAddress) {
    try {
        const implAddress = await getImplementationAddress(proxyAddress);
        if (!implAddress) throw new Error("Implementation address not found.");

        const etherscanUrl = `https://api-sepolia.etherscan.io/api?module=contract&action=getAbi&address=${implAddress}&apikey=${ETHERSCAN_API_KEY}`;
        const response = await fetch(etherscanUrl);
        const data = await response.json();

        if (data.status !== "1") throw new Error(`Failed to fetch ABI: ${data.message}`);
        
        const abi = JSON.parse(data.result);
        if (!Array.isArray(abi) || abi.length === 0) throw new Error("ABI is empty or invalid.");
        
        console.log("ABI fetched successfully.");
        return abi;
    } catch (error) {
        console.error("Error fetching implementation ABI:", error.message);
        return null;
    }
}

/**
 * Displays the available methods of the implementation contract.
 * @param {string} proxyAddress - The address of the proxy contract.
 */
async function displayContractMethods(proxyAddress) {
    const abi = await fetchImplementationABI(proxyAddress);
    if (!abi) return;

    console.log("\nAvailable Methods:");
    abi.forEach((item) => {
        if (item.type === "function") {
            console.log(`Function: ${item.name}(${item.inputs.map(i => i.type).join(", ")})`);
        }
    });
}

/**
 * Encodes a function call based on the contract's ABI.
 * @param {string} proxyAddress - The address of the proxy contract.
 * @param {string} functionName - The name of the function to encode.
 * @param {Array} functionArgs - The arguments to pass to the function.
 */

async function encodeFunctionCall(proxyAddress, functionName, functionArgs) {
    try {
        const abi = await fetchImplementationABI(proxyAddress);
        if (!abi) throw new Error("Failed to retrieve ABI.");

        const contractInterface = new ethers.Interface(abi);
        if (!abi.some(item => item.type === "function" && item.name === functionName)) {
            throw new Error(`Function '${functionName}' not found in ABI.`);
        }

        const encodedData = contractInterface.encodeFunctionData(functionName, functionArgs);
        console.log("\nEncoded Data:", encodedData);

        return [proxyAddress, 0, encodedData];
    } catch (error) {
        console.error("Error encoding function call:", error.message);
        return null;
    }
}

// Example Usage
(async () => {
    const proxyAddress = "0x61c0A71044A822cB0819BE6721E6E3d9fD0Df8a9";

    await displayContractMethods(proxyAddress); // Display contract methods
    const action = await encodeFunctionCall(proxyAddress, "approve", ["0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", "1"]);
    console.log("Action:", action);
})();

module.exports = { getImplementationAddress, fetchImplementationABI, displayContractMethods, encodeFunctionCall };
