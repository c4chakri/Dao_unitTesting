const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

describe("DaoFactory", function () {


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

    async function deployDaoFactoryFixture() {
        const DaoFactory = await ethers.getContractFactory("DAOFactory");
        const DaoManagement = await ethers.getContractFactory("DaoManagement");
        const daoManagement = await DaoManagement.deploy();
        console.log("daoManagement: ", daoManagement.target);
        const daoFactory = await upgrades.deployProxy(DaoFactory, [daoManagement.target]);
        return { daoFactory };
    }


    describe("Deployment of DAO 1", function () {

        it("Should deploy DaoFactory", async function () {
            const { daoFactory } = await loadFixture(deployDaoFactoryFixture);
            console.log("daoFactory: ", daoFactory.target);
        });

        it("Should create a new dao flows", async function () {
            const { daoFactory } = await loadFixture(deployDaoFactoryFixture);
            const [member1, member2, member3, member4] = await ethers.getSigners();
            const daoSettings = ["mike", "0x68656c6c6f20776f726c64"];
            const govTokenAddress = "0x0000000000000000000000000000000000000000";
            const govParams = ["govName1", "govSymbol", await member1.getAddress()];
            const govSettings = [45, 75, 86400, true, false];
            const daoMembers = [
                [await member1.getAddress(), ethers.parseEther("100")],
                [await member2.getAddress(), ethers.parseEther("100")],
                [await member3.getAddress(), ethers.parseEther("100")],
            ];
            const proposalParams = [true, 10];
            const isMultiSignDAO = false;

            const dao = await daoFactory.createDAO(
                daoSettings,
                govTokenAddress,
                govParams,
                govSettings,
                daoMembers,
                proposalParams,
                isMultiSignDAO
            );
            const receipt = await dao.wait();



            const daoManagementAddress = await daoFactory.daoManagement();
            const daoManagement = await ethers.getContractAt("DaoManagement", daoManagementAddress);
            //Proposal params 


            const rawAddress = receipt.logs.at(-1).args[0];
            const tokenAddress = receipt.logs[0].address;
            console.log('====================================');
            console.log(receipt.logs.at(-1).args[0]);
            console.log('====================================');
            // const decodedData = ethers.defaultAbiCoder.decode(decodeOption, rawAddress);
            const daoAddress = "0x" + rawAddress.slice(-40);
            const governanceAddress = "0x" + tokenAddress.slice(-40);
            const daoCont = await ethers.getContractAt("DAO", daoAddress);
            // const dName = await daoCont.name();
            const dSettins = await daoCont._daoSettings();
            const dProposal = await daoCont._proposalCreationSettings();
            const dgovernanceSettings = await daoCont.governanceSettings();


            console.log("Dao Details");
            console.table({
                "Dao Address": daoAddress,
                "Governance Address": governanceAddress,

                // "Dao Name": dName,
                "Dao Settings": dSettins,
                "Proposal Settings": dProposal,
                "Governance Settings": dgovernanceSettings

            })

            const governanceTokenContract = await ethers.getContractAt("GovernanceToken", governanceAddress);
            const govTokenName = await governanceTokenContract.name();
            const govTokenSymbol = await governanceTokenContract.symbol();
            const govTokenDecimals = await governanceTokenContract.decimals();
            const govTokenTotalSupply = await governanceTokenContract.totalSupply();
            const govTokenOwner = await governanceTokenContract.owner();

            console.table({
                "Governance Token Name": govTokenName,
                "Governance Token Symbol": govTokenSymbol,
                "Governance Token Decimals": govTokenDecimals,
                "Governance Token Total Supply": govTokenTotalSupply,
                "Governance Token Owner": govTokenOwner,
            })
           

            // //minting tokens
            // await governanceTokenContract.mintSupply(await member1.getAddress(), ethers.parseEther("100"));
            // await governanceTokenContract.mintSupply(await member2.getAddress(), ethers.parseEther("100"));

            //balaces
            const balance1 = await governanceTokenContract.balanceOf(await member1.getAddress());
            const balance2 = await governanceTokenContract.balanceOf(await member2.getAddress());
            const balance3 = await governanceTokenContract.balanceOf(await member3.getAddress());
            const balance4 = await governanceTokenContract.balanceOf(await member4.getAddress());
            console.log("Balances");
            console.table({
                "Member1": ethers.formatEther(balance1),
                "Member2": ethers.formatEther(balance2),
                "Member3": ethers.formatEther(balance3),
                "Member4": ethers.formatEther(balance4),
            })
          

            //votes

    
            let votes1 = await governanceTokenContract.getVotes(await member1.getAddress());
            let votes2 = await governanceTokenContract.getVotes(await member2.getAddress());
            let votes3 = await governanceTokenContract.getVotes(await member3.getAddress());
            let votes4 = await governanceTokenContract.getVotes(await member4.getAddress());

            console.log("Votes");
            console.table({
                "Member1": ethers.formatEther(votes1),
                "Member2": ethers.formatEther(votes2),
                "Member3": ethers.formatEther(votes3),
                "Member4": ethers.formatEther(votes4),
            })



            //delegate
            await governanceTokenContract.connect(member1).delegate(await member2.getAddress());

             votes1 = await governanceTokenContract.getVotes(await member1.getAddress());
             votes2 = await governanceTokenContract.getVotes(await member2.getAddress());
             votes3 = await governanceTokenContract.getVotes(await member3.getAddress());
             votes4 = await governanceTokenContract.getVotes(await member4.getAddress());

            console.log("Votes");
            console.table({
                "Member1": ethers.formatEther(votes1),
                "Member2": ethers.formatEther(votes2),
                "Member3": ethers.formatEther(votes3),
                "Member4": ethers.formatEther(votes4),
            })



            let delegate1 = await governanceTokenContract.delegates(await member1.getAddress());
            const delegate2 = await governanceTokenContract.delegates(await member2.getAddress());
            const delegate3 = await governanceTokenContract.delegates(await member3.getAddress());
            const delegate4 = await governanceTokenContract.delegates(await member4.getAddress());
            console.log("Delegates");
            console.table({
                "Member1": delegate1,
                "Member2": delegate2,
                "Member3": delegate3,
                "Member4": delegate4,
            })
            await governanceTokenContract.connect(member1).delegate(await member1.getAddress());
            delegate1 = await governanceTokenContract.connect(member1).delegates(await member1.getAddress());
            votes1 = await governanceTokenContract.getVotes(await member1.getAddress());
            console.log('====================================');
            console.log(votes1);
            console.log('====================================');
            // console.table({
            //     "Member1": delegate1+votes1
            //     "Member2": delegate2,
            //     "Member3": delegate3,
            //     "Member4": delegate4,
            // })
        });

        //delegates
      
        

    });


})