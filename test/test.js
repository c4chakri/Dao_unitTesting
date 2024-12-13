const { ethers, upgrades } = require("hardhat");

async function encodeWithdrawTokens(daoAddr, token, to, amount) {
    // ABI of the DAO contract containing the `withdrawTokens` function
    const daoABI = [
        "function withdrawTokens(address _token, address _to, uint256 _amount)"
    ];

    // Create an interface from the ABI
    const daoInterface = new ethers.Interface(daoABI);

    // Encode the function data for `withdrawTokens`
    const encodedData = daoInterface.encodeFunctionData("withdrawTokens", [token, to, amount]);

    const action = [
        daoAddr, // Address of the contract
        0, // Value in wei to send (usually 0 for function calls)
        encodedData // Encoded function data
    ]

    return ([action]);
}

module.exports = {
    encodeWithdrawTokens
}
const daoAddr = "0xB25547a7A21eaDAC7Fc2Bf7E560Bc1c0335E0Cd7"
const token = "0xa1F57a1A5e1753D92859808E647A6145DA14eb19"
const to    = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"
const amount = 50

console.log( encodeWithdrawTokens(daoAddr, token, to, amount))