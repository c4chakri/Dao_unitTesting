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
                [await member1.getAddress(), ethers.parseEther("500")],
                [await member2.getAddress(), ethers.parseEther("200")],
                [await member3.getAddress(), ethers.parseEther("300")],
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


            const rawAddress = receipt.logs[3].topics[2];
            const tokenAddress = receipt.logs[0].address;
            const decodeOption = ["address"];
            // const decodedData = ethers.defaultAbiCoder.decode(decodeOption, rawAddress);
            const daoAddress = "0x" + rawAddress.slice(-40);
            const governanceAddress = "0x" + tokenAddress.slice(-40);
            const daoCont = await ethers.getContractAt("DAO", daoAddress);
            // const dName = await daoCont.name();
            const dSettins = await daoCont._daoSettings();
            const dProposal = await daoCont._proposalCreationSettings();
            const dgovernanceSettings = await daoCont.governanceSettings();
            const governanceTokenContract = await ethers.getContractAt("GovernanceToken", governanceAddress);

            console.log("Dao Details");
            console.table({
                "Dao Address": daoAddress,
                "Governance Address": governanceAddress,

                // "Dao Name": dName,
                "Dao Settings": dSettins,
                "Proposal Settings": dProposal,
                "Governance Settings": dgovernanceSettings




            })


            const _title = "Dao Settings Proposal(Name , description)";
            const _description = "Proposal Description";
            const _startTime = Math.floor(Date.now() / 1000); // current time as UNIX timestamp
            const _duration = 3600; // 1 hour duration
            const actionId = 1;

            const daoName = "Name changed in Proposal"
            const daoData = "Data changed in Proposal"
            // Define actions as an array of structs; adapt fields as per IProposal.Action structure.
            // const _actions = await createDaoSettingsAction(daoAddress.toString(), daoName, daoData);
            const _actions = await createDaoSettingsAction(daoAddress.toString(), daoName, daoData);




            console.log("Creating Proposal...................Dao name set title is : ", daoName);


            const proposal1 = await daoManagement.createProposal(daoAddress, _title, _description, 2, _startTime, _duration, actionId, _actions);
            // console.log("proposal1: ", proposal1);


            const proposalReceipt = await proposal1.wait();
            const proposalAddress = proposalReceipt.logs[0].args[0];
            console.log("proposalAddress: ", proposalAddress);


            // load proposal contract

            const proposal = await ethers.getContractAt("Proposal", proposalAddress);
            console.log("Proposal Title : ", await proposal.proposalTitle());
            const endTimeInSeconds = Number(await proposal.endTime()); // Convert BigInt to regular number

            // Convert to a JavaScript Date object (Unix timestamp in seconds -> milliseconds)
            const endDate = new Date(endTimeInSeconds * 1000);

            console.log("Proposal End Date:", endDate.toLocaleString()); // Outputs in a readable format


            //voting 

            console.log("voting...............started");


            //delegating
            await governanceTokenContract.connect(member2).delegate(await member3.getAddress());


            // voting units

            let votingUnits1 = await proposal._getVotingUnits(member1.getAddress());
            let votingUnits2 = await proposal._getVotingUnits(member2.getAddress());
            let votingUnits3 = await proposal._getVotingUnits(member3.getAddress());

            console.table({
                "Member 1 Voting Units": ethers.formatEther(votingUnits1),
                "Member 2 Voting Units": ethers.formatEther(votingUnits2),
                "Member 3 Voting Units": ethers.formatEther(votingUnits3),
            })

            await proposal.connect(member1).vote(1);//500
            // await proposal.connect(member2).vote(2);//200
            await proposal.connect(member3).vote(1);//300

            //revoke delegation
            await governanceTokenContract.connect(member2).delegate("0x0000000000000000000000000000000000000000");


            console.table({
                "Yes Votes": ethers.formatEther(await proposal.yesVotes()),
                "No Votes": ethers.formatEther(await proposal.noVotes()),
                "Abstain Votes": await proposal.abstainVotes(),
                "is Approved": await proposal.approved() ? "Approved" : "Not Approved",
                "is Executed": await proposal.executed() ? "Executed" : "Not Executed"
            })
            console.log('====================================');
            console.log("Delelegation Revoked");
            console.log('====================================');
                        votingUnits1 = await proposal._getVotingUnits(member1.getAddress());
                        votingUnits2 = await proposal._getVotingUnits(member2.getAddress());
                        votingUnits3 = await proposal._getVotingUnits(member3.getAddress());
                        console.table({
                            "Member 1 Voting Units": ethers.formatEther(votingUnits1),
                            "Member 2 Voting Units": ethers.formatEther(votingUnits2),
                            "Member 3 Voting Units": ethers.formatEther(votingUnits3),
                        })
            console.log("execution...............started");

            await proposal.connect(member1).executeProposal();
            console.table({ "is Executed": await proposal.executed() ? "Executed" : "Not Executed" });

            console.log("Checking the result...............started");

            const daoContract = await ethers.getContractAt("DAO", daoAddress);
            // const governanceTokenContract = await ethers.getContractAt("GovernanceToken", governanceAddress);
            const _daoName = await daoContract._daoSettings();
            console.log("Dao name..........", _daoName[0]);

            expect(_daoName[0]).to.equal(daoName);

            console.log("Creating Proposal...................Adding memember in dao ", member4.address);
            const pTitle = "Add member proposal";
            const pDescription = "Add member proposal description";
            const pStartTime = Math.floor(Date.now() / 1000); // current time as UNIX timestamp
            const pDuration = 3600; // 1 hour duration
            const pActionId = 2;
            const members = [
                {
                    memberAddress: member4.address,  // Example member address
                    deposit: "100" // Example deposit (1 Ether)
                }
            ];
            let pActions


            pActions = await createAddDAOMembersAction(daoAddress, members);
            // [[daoAddress, 0, "0xb91835150000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000090f79bf6eb2c4f870365e785982e1f101e93b9060000000000000000000000000000000000000000000000000000000000000064"]]

            const proposal2 = await daoManagement.createProposal(daoAddress, pTitle, pDescription, 2, pStartTime, pDuration, pActionId, pActions);

            const proposalReceipt2 = await proposal2.wait();
            const proposalAddress2 = proposalReceipt2.logs[0].args[0];
            console.log("proposalAddress2: ", proposalAddress2);

            // load proposal contract

            const proposalContract2 = await ethers.getContractAt("Proposal", proposalAddress2);
            console.log("Proposal Title : ", await proposalContract2.proposalTitle());
            const endTimeInSeconds_ = Number(await proposalContract2.endTime()); // Convert BigInt to regular number

            // Convert to a JavaScript Date object (Unix timestamp in seconds -> milliseconds)
            const endDate1 = new Date(endTimeInSeconds_ * 1000);

            console.log("Proposal End Date:", endDate.toLocaleString()); // Outputs in a readable format



            //voting

            console.log("voting...............started");

            await proposalContract2.connect(member1).vote(1);
            await proposalContract2.connect(member2).vote(2);
            await proposalContract2.connect(member3).vote(1);

            console.table({
                "Yes Votes": await proposalContract2.yesVotes(),
                "No Votes": await proposalContract2.noVotes(),
                "Abstain Votes": await proposalContract2.abstainVotes(),
                "is Approved": await proposalContract2.approved() ? "Approved" : "Not Approved",
                "is Executed": await proposalContract2.executed() ? "Executed" : "Not Executed"
            })
            console.log("execution...............started");

            await proposalContract2.connect(member1).executeProposal();
            console.table({ "is Executed": await proposalContract2.executed() ? "Executed" : "Not Executed" });


            console.log("Creating Proposal...................Update proposal member settings ", member4.address);
            const isTokenBased = true; // Example: token-based proposal
            const minimumRequirement = 27; // Example minimum requirement

            const pDescription1 = "Update proposal member settings description";
            let pTitle1 = "Update proposal member settings";
            let pStartTime1 = Math.floor(Date.now() / 1000); // current time as UNIX timestamp
            let pDuration1 = 3600; // 1 hour duration
            let pActionId1 = 3;
            const pActions1 = await createUpdateProposalMemberSettingsAction(daoAddress, isTokenBased, minimumRequirement);
            // let pActions1 = [[daoAddress, 0, "0x132da92d0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001b"]]


            const proposal3 = await daoManagement.connect(member4).createProposal(daoAddress, pTitle1, pDescription1, 2, pStartTime1, pDuration1, pActionId1, pActions1);

            const proposalReceipt3 = await proposal3.wait();
            const proposalAddress3 = proposalReceipt3.logs[0].args[0];
            console.log("proposalAddress3: ", proposalAddress3);


            // load proposal contract

            const proposalContract3 = await ethers.getContractAt("Proposal", proposalAddress3);
            console.log("Proposal Title : ", await proposalContract3.proposalTitle());
            const endTimeInSeconds1 = Number(await proposalContract3.endTime()); // Convert BigInt to regular number

            // Convert to a JavaScript Date object (Unix timestamp in seconds -> milliseconds)
            const endDate2 = new Date(endTimeInSeconds1 * 1000);


            //voting

            console.log("voting...............started");

            await proposalContract3.connect(member1).vote(1);
            await proposalContract3.connect(member2).vote(2);
            await proposalContract3.connect(member3).vote(1);
            await proposalContract3.connect(member4).vote(2);
            console.table({
                "Yes Votes": await proposalContract3.yesVotes(),
                "No Votes": await proposalContract3.noVotes(),
                "is Approved": await proposalContract3.approved() ? "Approved" : "Not Approved",
                "is Executed": await proposalContract3.executed() ? "Executed" : "Not Executed"
            })
            await proposalContract3.connect(member4).executeProposal();
            console.log("execution...............started");

            console.table({ "is Executed": await proposalContract3.executed() ? "Executed" : "Not Executed" });



            //Treasury Management 
            console.log('\n', "Treasury Management.....................", '\n');
            const erc20Contract = await ethers.getContractAt("ERC20", governanceAddress);
            await erc20Contract.connect(member1).approve(daoAddress, 5);
            await erc20Contract.connect(member2).approve(daoAddress, 5);
            await erc20Contract.connect(member3).approve(daoAddress, 5);

            // Deposit tokens for member1
            await daoContract.connect(member1).depositTokens(governanceAddress, 5);

            // Fetch and log deposited tokens for member1
            const depositsMember1 = await daoContract.tokenDeposited(await member1.getAddress(),0);
            console.log("Deposited tokens by member1:", depositsMember1);

            // Deposit tokens for member2
            await daoContract.connect(member2).depositTokens(governanceAddress, 5);

            // Fetch and log deposited tokens for member2
            const depositsMember2 = await daoContract.tokenDeposited(await member2.getAddress(),0);
            console.log("Deposited tokens by member2:", depositsMember2);

            // Deposit tokens for member3
            await daoContract.connect(member3).depositTokens(governanceAddress, 5);

            // Fetch and log deposited tokens for member3
            const depositsMember3 = await daoContract.tokenDeposited(await member3.getAddress(),0);
            console.log("Deposited tokens by member3:", depositsMember3);

            console.log("Treasury Balance: ", await daoContract.treasuryBalance(await member1.getAddress()));

            const depositAmount = ethers.parseEther("1");

            // // Calling the function with a value
            const tx = await daoContract.connect(member1).depositToDAOTreasury(depositAmount, {
                value: depositAmount // Sends 1 Ether as specified
            });

            await tx.wait();

            // // Verify the balance in the contract if needed
            const treasuryBalance = await daoContract.treasuryBalance(member1.address);
            console.log('\n', "Deposit funds to Treasury by ", member1.address, ": ", treasuryBalance);

            expect(treasuryBalance).to.equal(depositAmount);


            console.log('\n', "withdraw token proposals...............", '\n');

            const withdrawAction = await encodeWithdrawTokens(daoAddress,await daoContract.governanceToken(), member2.address, 1);

            // create proposal for withdraw tokens
            const pTitle5 = "Withdraw Tokens";
            const pDescription5 = "Withdraw Tokens";
            const pStartTime5 = Math.floor(Date.now() / 1000); // 0 seconds since epoch
            const pDuration5 = 3600; // 1 hour duration
            const pActionId5 = 1;
            const pActions5 = withdrawAction;


            const proposal5 = await daoManagement.createProposal(daoAddress, pTitle5, pDescription5, 2, pStartTime5, pDuration5, pActionId5, pActions5);

            const proposalReceipt5 = await proposal5.wait();
            const proposalAddress5 = proposalReceipt5.logs[0].args[0];
            console.log("proposalAddress5: ", proposalAddress5);

            // load proposal contract
            const proposalContract5 = await ethers.getContractAt("Proposal", proposalAddress5);

            await proposalContract5.connect(member1).vote(1);
            await proposalContract5.connect(member2).vote(2);
            await proposalContract5.connect(member3).vote(1);
            await proposalContract5.connect(member4).vote(2);

            console.table({
                "Yes Votes": await proposalContract5.yesVotes(),
                "No Votes": await proposalContract5.noVotes(),
                "is Approved": await proposalContract5.approved() ? "Approved" : "Not Approved",
                "is Executed": await proposalContract5.executed() ? "Executed" : "Not Executed"
            })
            // check balance before withdraw 

            const _member2Balance = await governanceTokenContract.balanceOf(member2.address);
            console.log('\n', "Member2 Balance: ", _member2Balance);
            await proposalContract5.connect(member4).executeProposal();
            console.table({
                "is Executed": await proposalContract5.executed() ? "Executed" : "Not Executed"
            })
            // check tokens after withdraw

            var memberFundBalance = await daoContract.treasuryBalance(member1.address);
            console.log('\n', "Member1 Balance before withdraw: ", memberFundBalance);

            const _member2BalanceAfterWithdraw = await governanceTokenContract.balanceOf(member2.address);
            console.log('\n', "Member2 Balance after withdraw: ", _member2BalanceAfterWithdraw);
            
            console.log('\n', "withdraw funds proposals...............", '\n');

            const withdrawFundsAction = await encodeWithdrawFromDAOTreasury(daoAddress, member1.address, member2.address, 1);
            // create proposal for withdraw funds
            const pTitle6 = "Withdraw Funds";
            const pDescription6 = "Withdraw Funds";
            const pStartTime6 = Math.floor(Date.now() / 1000); // 0 seconds since epoch
            const pDuration6 = 3600; // 1 hour duration
            const pActionId6 = 1;
            const pActions6 = withdrawFundsAction

            const proposal6 = await daoManagement.createProposal(daoAddress, pTitle6, pDescription6, 2, pStartTime6, pDuration6, pActionId6, pActions6);

            const proposalReceipt6 = await proposal6.wait();
            const proposalAddress6 = proposalReceipt6.logs[0].args[0];
            console.log("proposalAddress6: ", proposalAddress6);

            // load proposal contract
            const proposalContract6 = await ethers.getContractAt("Proposal", proposalAddress6);

            await proposalContract6.connect(member1).vote(1);
            await proposalContract6.connect(member2).vote(2);
            await proposalContract6.connect(member3).vote(1);
            await proposalContract6.connect(member4).vote(2);

            console.table({
                "Yes Votes": await proposalContract6.yesVotes(),
                "No Votes": await proposalContract6.noVotes(),
                "is Approved": await proposalContract6.approved() ? "Approved" : "Not Approved",
                "is Executed": await proposalContract6.executed() ? "Executed" : "Not Executed"
            })

            await proposalContract6.connect(member4).executeProposal();
            console.table({
                "is Executed": await proposalContract6.executed() ? "Executed" : "Not Executed"
            })
            // check the funds balance after withdraw

            memberFundBalance = await daoContract.treasuryBalance(member1.address);
            console.log('\n', "Member1 Balance after withdraw: ", memberFundBalance);

            console.log('====================================');
            console.log(await daoContract.getTotalTreasuryTokens());
            console.log('====================================');
        });

        // it("Should create a multisig new dao flows", async function () {
        //     const { daoFactory } = await loadFixture(deployDaoFactoryFixture);
        //     const [member1, member2, member3, member4] = await ethers.getSigners();
        //     const daoSettings = ["mike", "0x68656c6c6f20776f726c64"];
        //     const govTokenAddress = "0x0000000000000000000000000000000000000000";
        //     const govParams = ["govName1", "govSymbol", await member1.getAddress()];
        //     const govSettings = [45, 75, 86400, true, false];
        //     const daoMembers = [
        //         [await member1.getAddress(), ethers.parseEther("500")],
        //         [await member2.getAddress(), ethers.parseEther("200")],
        //         [await member3.getAddress(), ethers.parseEther("300")],
        //     ];
        //     const proposalParams = [false, 0];
        //     const isMultiSignDAO = true;

        //     const dao = await daoFactory.createDAO(
        //         daoSettings,
        //         govTokenAddress,
        //         govParams,
        //         govSettings,
        //         daoMembers,
        //         proposalParams,
        //         isMultiSignDAO
        //     );


        //     const receipt = await dao.wait();
        //     // console.log("receipt: ", receipt.logs);



        //     const daoManagementAddress = await daoFactory.daoManagement();
        //     const daoManagement = await ethers.getContractAt("DaoManagement", daoManagementAddress);
        //     //Proposal params 


        //     const rawAddress = receipt.logs[0].args[0];
        //     const tokenAddress = receipt.logs[0].address;
        //     const decodeOption = ["address"];
        //     // const decodedData = ethers.defaultAbiCoder.decode(decodeOption, rawAddress);
        //     // const daoAddress = "0x" + rawAddress.slice(-40);
        //     const daoAddress = rawAddress
        //     const governanceAddress = "0x" + tokenAddress.slice(-40);

        //     console.log("daoAddress: ", daoAddress);


        //     // load dao
        //     const daoC = await ethers.getContractAt("DAO", daoAddress)
        //     const _govSettings = await daoC.governanceSettings();
        //     const _DaoSettings = await daoC._daoSettings()
        //     // console.log("Gov",_govSettings,_DaoSettings);

        //     const _title = "Dao Settings Proposal(Name , description)";
        //     const _description = "Proposal Description";
        //     const _startTime = Math.floor(Date.now() / 1000); // current time as UNIX timestamp
        //     const _duration = 3600; // 1 hour duration
        //     const actionId = 1;

        //     const daoName = "Name changed in Proposal"
        //     const daoData = "Data changed in Proposal"
        //     // Define actions as an array of structs; adapt fields as per IProposal.Action structure.
        //     // const _actions = await createDaoSettingsAction(daoAddress.toString(), daoName, daoData);
        //     const _actions = await createDaoSettingsAction(daoAddress, daoName, daoData);
        //     //  [[daoAddress.toString(), 0, "0xaa6c976300000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000184e616d65206368616e67656420696e2050726f706f73616c0000000000000000000000000000000000000000000000000000000000000000000000000000001844617461206368616e67656420696e2050726f706f73616c0000000000000000"]]



        //     console.log("Creating Proposal...................Dao name set title is : ", daoName);


        //     const proposal1 = await daoManagement.createProposal(daoAddress, _title, _description, 2, _startTime, _duration, actionId, _actions);
        //     // console.log("proposal1: ", proposal1);


        //     const proposalReceipt = await proposal1.wait();
        //     const proposalAddress = proposalReceipt.logs[0].args[0];
        //     console.log("proposalAddress: ", proposalAddress);


        //     // load proposal contract

        //     const proposal = await ethers.getContractAt("Proposal", proposalAddress);
        //     console.log("Proposal Title : ", await proposal.proposalTitle());
        //     const endTimeInSeconds = Number(await proposal.endTime()); // Convert BigInt to regular number

        //     // Convert to a JavaScript Date object (Unix timestamp in seconds -> milliseconds)
        //     const endDate = new Date(endTimeInSeconds * 1000);

        //     console.log("Proposal End Date:", endDate.toLocaleString()); // Outputs in a readable format
        //     // console.log("Yes votes", await proposal.yesVotes());
        //     // console.log("No votes", await proposal.noVotes());

        //     //voting 

        //     console.log("voting...............started");

        //     await proposal.connect(member1).vote(1);
        //     await proposal.connect(member2).vote(2);
        //     await proposal.connect(member3).vote(1);

        //     console.table({
        //         "Yes votes": await proposal.yesVotes(),
        //         "No votes": await proposal.noVotes(),
        //         "Approved": await proposal.approved(),
        //         "Executed": await proposal.executed()
        //     })

        //     console.log("execution...............started");

        //     await proposal.connect(member1).executeProposal();
        //     console.table({
        //         "Executed": await proposal.executed()
        //     })
        //     console.log("Checking the result...............started");

        //     const daoContract = await ethers.getContractAt("DAO", daoAddress);
        //     // const governanceTokenContract = await ethers.getContractAt("GovernanceToken", governanceAddress);
        //     const _daoName = await daoContract._daoSettings();
        //     console.log("Dao name..........", _daoName[0]);

        //     expect(_daoName[0]).to.equal(daoName);

        //     console.log("Creating Proposal...................Adding memember in dao ", member4.address);
        //     const pTitle = "Add member proposal";
        //     const pDescription = "Add member proposal description";
        //     const pStartTime = Math.floor(Date.now() / 1000); // current time as UNIX timestamp
        //     const pDuration = 3600; // 1 hour duration
        //     const pActionId = 2;
        //     const members = [
        //         {
        //             memberAddress: member4.address,  // Example member address
        //             deposit: "100" // Example deposit (1 Ether)
        //         }
        //     ];
        //     let pActions



        //     pActions =await createAddDAOMembersAction(daoAddress, members);

        //     const proposal2 = await daoManagement.createProposal(daoAddress, pTitle, pDescription, 2, pStartTime, pDuration, pActionId, pActions);

        //     const proposalReceipt2 = await proposal2.wait();
        //     const proposalAddress2 = proposalReceipt2.logs[0].args[0];
        //     console.log("proposalAddress2: ", proposalAddress2);

        //     // load proposal contract

        //     const proposalContract2 = await ethers.getContractAt("Proposal", proposalAddress2);
        //     console.log("Proposal Title : ", await proposalContract2.proposalTitle());
        //     const endTimeInSeconds_ = Number(await proposalContract2.endTime()); // Convert BigInt to regular number

        //     // Convert to a JavaScript Date object (Unix timestamp in seconds -> milliseconds)
        //     const endDate1 = new Date(endTimeInSeconds_ * 1000);

        //     console.log("Proposal End Date:", endDate1.toLocaleString()); // Outputs in a readable format
        //     // console.log("Yes votes", await proposalContract2.yesVotes());
        //     // console.log("No votes", await proposalContract2.noVotes());

        //     //voting

        //     console.log("voting...............started");

        //     await proposalContract2.connect(member1).vote(1);
        //     await proposalContract2.connect(member2).vote(2);
        //     await proposalContract2.connect(member3).vote(1);

        //     console.table({
        //         "Yes votes": await proposalContract2.yesVotes(),
        //         "No votes": await proposalContract2.noVotes(),
        //         "Approved": await proposalContract2.approved(),
        //         "Executed": await proposalContract2.executed()
        //     })

        //     console.log("execution...............started");
        //     console.log("Early Execution : ", await proposalContract2.earlyExecution());

        //     await proposalContract2.connect(member1).executeProposal();
        //     console.table({
        //         "Executed": await proposalContract2.executed()
        //     })

        //     console.log("is daoMember ", member4.address, await daoC.isDAOMember(member4.address));


        //     // Remove dao members

        //     console.log("Creating Proposal...................Removing memember in dao ", member4.address);
        //     pRemoveTitle = "Remove member proposal";
        //     let pRemoveDescription1 = "Remove member proposal description";
        //     pRemoveStartTime1 = Math.floor(Date.now() / 1000); // current time as UNIX timestamp
        //     pRemoveDuration1 = 3600; // 1 hour duration
        //     pRemoveActionId1 = 2;
        //     pRemoveActions1 = [];
        //     RemoveMembers = [
        //         {
        //             memberAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",  // Example member address
        //             deposit: "0" 
        //         }
        //     ];

        //     await createRemoveDAOMembersAction(daoAddress, RemoveMembers).then((action) => {
        //         pRemoveActions1 = action
        //     });

        //     RemoveProposal3 = await daoManagement.createProposal(daoAddress, pRemoveTitle, pRemoveDescription1, 2, pRemoveStartTime1, pRemoveDuration1, pRemoveActionId1, pRemoveActions1);

        //     let proposalRemoveReceipt3 = await RemoveProposal3.wait();
        //     let proposalRemoveAddress3 = proposalRemoveReceipt3.logs[0].args[0];
        //     console.log("proposalAddress3: ", proposalRemoveAddress3);

        //     // load proposal contract

        //     let proposalRemoveContract3 = await ethers.getContractAt("Proposal", proposalRemoveAddress3);
        //     console.log("Proposal Title : ", await proposalRemoveContract3.proposalTitle());
        //     const endTimeInSeconds_1 = Number(await proposalRemoveContract3.endTime()); // Convert BigInt to regular number

        //     // Convert to a JavaScript Date object (Unix timestamp in seconds -> milliseconds)
        //     endDate2_ = new Date(endTimeInSeconds_1 * 1000);

        //     console.log("Proposal End Date:", endDate2_.toLocaleString()); // Outputs in a readable format


        //     console.log("voting...............started");

        //     await proposalRemoveContract3.connect(member1).vote(1);
        //     await proposalRemoveContract3.connect(member2).vote(1);

        //     console.table({
        //         "Yes votes": await proposalRemoveContract3.yesVotes(),
        //         "No votes": await proposalRemoveContract3.noVotes(),
        //         "Approved": await proposalRemoveContract3.approved(),
        //         "Executed": await proposalRemoveContract3.executed()
        //     })

        //     console.log("execution...............started");
        //     console.log("Early Execution : ", await proposalRemoveContract3.earlyExecution());

        //     await proposalRemoveContract3.connect(member1).executeProposal();
        //     console.table({
        //         "Executed": await proposalRemoveContract3.executed()
        //     })
        //     console.log("is daoMember ", member4.address, await daoC.isDAOMember(member4.address));


        //     console.log("Creating Proposal...................Update proposal member settings ", member4.address);
        //     const isTokenBased = true; // Example: token-based proposal
        //     const minimumRequirement = 27; // Example minimum requirement

        //     const pTitle1 = "Update proposal member settings";
        //     const pDescription1 = "Update proposal member settings description";
        //     const pStartTime1 = Math.floor(Date.now() / 1000); // current time as UNIX timestamp
        //     const pDuration1 = 3600; // 1 hour duration
        //     const pActionId1 = 3;
        //     const pActions1 = await createUpdateProposalMemberSettingsAction(daoAddress, isTokenBased, minimumRequirement);


        //     const proposal3 = await daoManagement.connect(member3).createProposal(daoAddress, pTitle1, pDescription1, 2, pStartTime1, pDuration1, pActionId1, pActions1);

        //     const proposalReceipt3 = await proposal3.wait();
        //     const proposalAddress3 = proposalReceipt3.logs[0].args[0];
        //     console.log("proposalAddress3: ", proposalAddress3);


        //     // load proposal contract

        //     const proposalContract3 = await ethers.getContractAt("Proposal", proposalAddress3);
        //     console.log("Proposal Title : ", await proposalContract3.proposalTitle());
        //     const endTimeInSeconds1 = Number(await proposalContract3.endTime()); // Convert BigInt to regular number

        //     // Convert to a JavaScript Date object (Unix timestamp in seconds -> milliseconds)
        //     const endDate2 = new Date(endTimeInSeconds1 * 1000);

        //     console.log("Proposal End Date:", endDate2.toLocaleString()); // Outputs in a readable format

        //     //voting

        //     console.log("voting...............started");

        //     await proposalContract3.connect(member1).vote(1);
        //     await proposalContract3.connect(member2).vote(2);
        //     await proposalContract3.connect(member3).vote(1);

        //     console.table({
        //         "Yes votes": await proposalContract3.yesVotes(),
        //         "No votes": await proposalContract3.noVotes(),
        //         "Approved": await proposalContract3.approved(),
        //         "Executed": await proposalContract3.executed()
        //     })
        //     console.log("Execution started :");

        //     await proposalContract3.connect(member2).executeProposal();

        //     console.table({
        //         "Executed": await proposalContract3.executed()
        //     })

        //     //Treasury Management 
        //     console.log('\n', "Treasury Management.....................", '\n');



        //     const depositAmount = ethers.parseEther("1");

        //     // Calling the function with a value
        //     const tx = await daoContract.connect(member1).depositToDAOTreasury(depositAmount, {
        //         value: depositAmount // Sends 1 Ether as specified
        //     });

        //     await tx.wait();

        //     // Verify the balance in the contract if needed
        //     const treasuryBalance = await daoContract.treasuryBalance(member1.address);
        //     console.log('\n', "Deposit  Balance by ", member1.address, ": ", treasuryBalance);

        //     expect(treasuryBalance).to.equal(depositAmount);






        //     // console.log('\n', "withdraw funds proposals...............", '\n');

        //     // const withdrawFundsAction = await encodeWithdrawFromDAOTreasury(daoAddress, member1.address, member2.address, 1);
        //     // // console.log("withdrawFundsAction: ", withdrawFundsAction);

        //     // // create proposal for withdraw funds
        //     // const pTitle6 = "Withdraw Funds";
        //     // const pDescription6 = "Withdraw Funds";
        //     // const pStartTime6 = Math.floor(Date.now() / 1000); // 0 seconds since epoch
        //     // const pDuration6 = 3600; // 1 hour duration
        //     // const pActionId6 = 1;
        //     // const pActions6 =  [["0x75537828f2ce51be7289709686a69cbfdbb714f1",0,"0x5e45ad8b000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000000000000000000001"]];

        //     // const proposal6 = await daoManagement.createProposal(daoAddress, pTitle6, pDescription6, pStartTime6, pDuration6, pActionId6, pActions6);

        //     // const proposalReceipt6 = await proposal6.wait();
        //     // const proposalAddress6 = proposalReceipt6.logs[0].args[0];
        //     // console.log("proposalAddress6: ", proposalAddress6);

        //     // // load proposal contract
        //     // const proposalContract6 = await ethers.getContractAt("Proposal", proposalAddress6);

        //     // await proposalContract6.connect(member1).vote(1);
        //     // await proposalContract6.connect(member2).vote(2);
        //     // await proposalContract6.connect(member3).vote(1);
        //     // await proposalContract6.connect(member4).vote(2);

        //     // console.log("Yes votes", await proposalContract6.yesVotes());
        //     // console.log("No votes", await proposalContract6.noVotes());

        //     // console.log("approved", await proposalContract6.approved());

        //     // await proposalContract6.connect(member4).executeProposal();
        //     // console.log("executed", await proposalContract6.executed());

        //     // // check the funds balance after withdraw

        //     // memberFundBalance = await daoContract.treasuryBalance(member1.address);
        //     // console.log('\n', "Member1 Balance after withdraw: ", memberFundBalance);



        // });

    });


})