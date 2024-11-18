# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
# Dao_unitTesting

```
DaoFactory
    Deployment of DAO 1
daoManagement:  0x5FbDB2315678afecb367f032d93F642f64180aa3
daoFactory:  0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
      ✔ Should deploy DaoFactory (3041ms)
Dao Details
┌─────────────────────┬────────┬────────────────────────────┬────────┬──────┬───────┬──────────────────────────────────────────────┐
│       (index)       │   0    │             1              │   2    │  3   │   4   │                    Values                    │
├─────────────────────┼────────┼────────────────────────────┼────────┼──────┼───────┼──────────────────────────────────────────────┤
│     Dao Address     │        │                            │        │      │       │ '0x75537828f2ce51be7289709686a69cbfdbb714f1' │
│ Governance Address  │        │                            │        │      │       │ '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be' │
│    Dao Settings     │ 'mike' │ '0x68656c6c6f20776f726c64' │        │      │       │                                              │
│  Proposal Settings  │  true  │            10n             │        │      │       │                                              │
│ Governance Settings │  45n   │            75n             │ 86400n │ true │ false │                                              │
└─────────────────────┴────────┴────────────────────────────┴────────┴──────┴───────┴──────────────────────────────────────────────┘
Creating Proposal...................Dao name set title is :  Name changed in Proposal
proposalAddress:  0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968
Proposal Title :  Dao Settings Proposal(Name , description)
Proposal End Date: 11/18/2024, 12:17:21 PM
voting...............started
┌───────────────┬────────────────────────┐
│    (index)    │         Values         │
├───────────────┼────────────────────────┤
│   Yes Votes   │ 800000000000000000000n │
│   No Votes    │ 200000000000000000000n │
│ Abstain Votes │           0n           │
│  is Approved  │       'Approved'       │
│  is Executed  │     'Not Executed'     │
└───────────────┴────────────────────────┘
execution...............started
┌─────────────┬────────────┐
│   (index)   │   Values   │
├─────────────┼────────────┤
│ is Executed │ 'Executed' │
└─────────────┴────────────┘
Checking the result...............started
Dao name.......... Name changed in Proposal
Creating Proposal...................Adding memember in dao  0x90F79bf6EB2c4f870365E785982E1f101E93b906
proposalAddress2:  0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883
Proposal Title :  Add member proposal
Proposal End Date: 11/18/2024, 12:17:21 PM
voting...............started
┌───────────────┬────────────────────────┐
│    (index)    │         Values         │
├───────────────┼────────────────────────┤
│   Yes Votes   │ 800000000000000000000n │
│   No Votes    │ 200000000000000000000n │
│ Abstain Votes │           0n           │
│  is Approved  │       'Approved'       │
│  is Executed  │     'Not Executed'     │
└───────────────┴────────────────────────┘
execution...............started
┌─────────────┬────────────┐
│   (index)   │   Values   │
├─────────────┼────────────┤
│ is Executed │ 'Executed' │
└─────────────┴────────────┘
Creating Proposal...................Update proposal member settings  0x90F79bf6EB2c4f870365E785982E1f101E93b906
proposalAddress3:  0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26
Proposal Title :  Update proposal member settings
voting...............started
┌─────────────┬────────────────────────┐
│   (index)   │         Values         │
├─────────────┼────────────────────────┤
│  Yes Votes  │ 800000000000000000000n │
│  No Votes   │ 200000000000000000100n │
│ is Approved │       'Approved'       │
│ is Executed │     'Not Executed'     │
└─────────────┴────────────────────────┘
execution...............started
┌─────────────┬────────────┐
│   (index)   │   Values   │
├─────────────┼────────────┤
│ is Executed │ 'Executed' │
└─────────────┴────────────┘

 Treasury Management..................... 

No of token deposited by 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 5n
No of token deposited by 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 5n
No of token deposited by 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC 5n

 Deposit  Balance by  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 :  1000000000000000000n

 withdraw token proposals............... 

proposalAddress5:  0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC
┌─────────────┬────────────────────────┐
│   (index)   │         Values         │
├─────────────┼────────────────────────┤
│  Yes Votes  │ 799999999999999999990n │
│  No Votes   │ 200000000000000000095n │
│ is Approved │       'Approved'       │
│ is Executed │     'Not Executed'     │
└─────────────┴────────────────────────┘

 Member2 Balance:  199999999999999999995n
┌─────────────┬────────────┐
│   (index)   │   Values   │
├─────────────┼────────────┤
│ is Executed │ 'Executed' │
└─────────────┴────────────┘

 Member1 Balance before withdraw:  1000000000000000000n

 withdraw funds proposals............... 

proposalAddress6:  0x86337dDaF2661A069D0DcB5D160585acC2d15E9a
┌─────────────┬────────────────────────┐
│   (index)   │         Values         │
├─────────────┼────────────────────────┤
│  Yes Votes  │ 799999999999999999990n │
│  No Votes   │ 200000000000000000096n │
│ is Approved │       'Approved'       │
│ is Executed │     'Not Executed'     │
└─────────────┴────────────────────────┘
┌─────────────┬────────────┐
│   (index)   │   Values   │
├─────────────┼────────────┤
│ is Executed │ 'Executed' │
└─────────────┴────────────┘

 Member1 Balance after withdraw:  999999999999999999n
      ✔ Should create a new dao flows (513ms)
daoAddress:  0x75537828f2ce51be7289709686A69CbFDbB714F1
Creating Proposal...................Dao name set title is :  Name changed in Proposal
proposalAddress:  0xa16E02E87b7454126E5E10d957A927A7F5B5d2be
Proposal Title :  Dao Settings Proposal(Name , description)
Proposal End Date: 11/18/2024, 12:17:21 PM
Yes votes 0n
No votes 0n
voting...............started
┌───────────┬────────┐
│  (index)  │ Values │
├───────────┼────────┤
│ Yes votes │   2n   │
│ No votes  │   1n   │
│ Approved  │  true  │
│ Executed  │ false  │
└───────────┴────────┘
execution...............started
┌──────────┬────────┐
│ (index)  │ Values │
├──────────┼────────┤
│ Executed │  true  │
└──────────┴────────┘
Checking the result...............started
Dao name.......... Name changed in Proposal
Creating Proposal...................Adding memember in dao  0x90F79bf6EB2c4f870365E785982E1f101E93b906
proposalAddress2:  0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968
Proposal Title :  Add member proposal
Proposal End Date: 11/18/2024, 12:17:21 PM
Yes votes 0n
No votes 0n
voting...............started
┌───────────┬────────┐
│  (index)  │ Values │
├───────────┼────────┤
│ Yes votes │   2n   │
│ No votes  │   1n   │
│ Approved  │  true  │
│ Executed  │ false  │
└───────────┴────────┘
execution...............started
Early Execution :  true
┌──────────┬────────┐
│ (index)  │ Values │
├──────────┼────────┤
│ Executed │  true  │
└──────────┴────────┘
is daoMember  0x90F79bf6EB2c4f870365E785982E1f101E93b906 true
Creating Proposal...................Removing memember in dao  0x90F79bf6EB2c4f870365E785982E1f101E93b906
proposalAddress3:  0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883
Proposal Title :  Remove member proposal
Proposal End Date: 11/18/2024, 12:17:21 PM
voting...............started
┌───────────┬────────┐
│  (index)  │ Values │
├───────────┼────────┤
│ Yes votes │   2n   │
│ No votes  │   0n   │
│ Approved  │  true  │
│ Executed  │ false  │
└───────────┴────────┘
execution...............started
Early Execution :  true
┌──────────┬────────┐
│ (index)  │ Values │
├──────────┼────────┤
│ Executed │  true  │
└──────────┴────────┘
is daoMember  0x90F79bf6EB2c4f870365E785982E1f101E93b906 false
Creating Proposal...................Update proposal member settings  0x90F79bf6EB2c4f870365E785982E1f101E93b906
proposalAddress3:  0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26
Proposal Title :  Update proposal member settings
Proposal End Date: 11/18/2024, 12:17:21 PM
voting...............started
┌───────────┬────────┐
│  (index)  │ Values │
├───────────┼────────┤
│ Yes votes │   2n   │
│ No votes  │   1n   │
│ Approved  │  true  │
│ Executed  │ false  │
└───────────┴────────┘
Execution started :
┌──────────┬────────┐
│ (index)  │ Values │
├──────────┼────────┤
│ Executed │  true  │
└──────────┴────────┘

 Treasury Management..................... 


 Deposit  Balance by  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 :  1000000000000000000n
      ✔ Should create a multisig new dao flows (308ms)


  3 passing (4s)
```