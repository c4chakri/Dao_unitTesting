   // Function to create the action tuple array for `updateDaoSettings`
   async function createDaoSettingsAction(daoAddr, name, data) {
    // Define the contract's ABI fragment for the `updateDaoSettings` function
    const abiFragment = [
        "function updateDaoSettings((string name, bytes data) _daoParams)"
    ];
    // Create the interface for the function
    const iface = new ethers.Interface(abiFragment);

    // Define the parameters to pass to the function
    const daoParams = {
        name: name,  // New DAO name
        data: ethers.hexlify(ethers.toUtf8Bytes(data)) // New DAO data as bytes
    };

    // Encode the function call
    const encodedData = iface.encodeFunctionData('updateDaoSettings', [daoParams]);

    // Create the Action tuple array
    const action = [
        daoAddr, // Address of the contract
        0, // Value in wei to send (usually 0 for function calls)
        encodedData // Encoded function data
    ];
    // console.log("action: ", action);

    // Return the action tuple array
    return ([action]);
}
async function createAddDAOMembersAction(daoAddr, members) {
    // Define the ABI fragment for the `addDAOMembers` function
    const abiFragment = [
        "function addDAOMembers((address memberAddress, uint256 deposit)[] members) external"
    ];

    // Create the interface for the function
    const iface = new ethers.Interface(abiFragment);

    // Encode the function call with the array of structs as a parameter
    const encodedData = iface.encodeFunctionData('addDAOMembers', [members]);

    // Create the Action tuple array
    const action = [
        daoAddr, // Address of the contract
        0, // Value in wei to send (usually 0 for function calls)
        encodedData // Encoded function data
    ];

    // Return the action tuple array
    return ([action]);
}

async function createRemoveDAOMembersAction(daoAddr, members) {
    // Define the ABI fragment for the `removeDAOMembers` function
    const abiFragment = [
        "function removeDAOMembers((address memberAddress, uint256 deposit)[] members) external"
    ];

    // Create the interface for the function
    const iface = new ethers.Interface(abiFragment);

    // Encode the function call with the array of structs as a parameter
    const encodedData = iface.encodeFunctionData('removeDAOMembers', [members]);

    // Create the Action tuple array
    const action = [
        daoAddr, // Address of the DAO contract
        0,       // Value in wei to send (usually 0 for function calls)
        encodedData // Encoded function data
    ];

    // Return the action tuple array
    return [action];
}
async function createUpdateProposalMemberSettingsAction(daoAddr, isTokenBasedProposal, minimumRequirement) {
    // Define the contract's ABI fragment for the `updateProposalMemberSettings` function
    const abiFragment = [
        "function updateProposalMemberSettings((bool isTokenBasedProposal, uint256 MinimumRequirement) _proposalCreationParams) public view"
    ];

    // Define the contract interface using the ABI fragment
    const iface = new ethers.Interface(abiFragment);

    // Define the parameters for the `ProposalCreationSettings` struct
    const proposalCreationParams = {
        isTokenBasedProposal: isTokenBasedProposal,   // Boolean for token-based proposal
        MinimumRequirement: minimumRequirement          // Minimum requirement as uint256
    };

    // Encode the function call with the struct as a parameter
    const encodedData = iface.encodeFunctionData('updateProposalMemberSettings', [proposalCreationParams]);

    // Create the Action tuple array
    const action = [
        daoAddr, // Address of the contract
        0, // Value in wei to send (usually 0 for function calls)
        encodedData // Encoded function data
    ];

    // Return the action tuple array wrapped in another array
    return ([action]); // Ensures the return type is [[action]]
}
async function encodeWithdrawFromDAOTreasury(daoAddr, _from, _to, amount) {
    // ABI of the DAO contract containing the `withdrawFromDAOTreasury` function
    const daoABI = [
        "function withdrawFromDAOTreasury(address _from,address _to,uint256 amount)"
    ];

    // Create an interface from the ABI
    const daoInterface = new ethers.Interface(daoABI);

    // Encode the function data for `withdrawFromDAOTreasury`
    const encodedData = daoInterface.encodeFunctionData("withdrawFromDAOTreasury", [_from, _to, amount]);
    const action = [
        daoAddr, // Address of the contract
        0, // Value in wei to send (usually 0 for function calls)
        encodedData // Encoded function data
    ]
    return ([action]);
}
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
async function encodeFunctionABIData(abi, functionName, functionArgs) {
    try {
        const contractInterface = new ethers.Interface(abi);
        return contractInterface.encodeFunctionData(functionName, functionArgs); // Return the encoded function data
    } catch (error) {
        console.error(`Error encoding function data for ${functionName}:`, error);
        return null;
    }
}

module.exports={
    encodeFunctionABIData
}