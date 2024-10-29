// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IDAO {
    struct ProposalInfo {
        address deployedProposalAddress;
        address creator;
        string title;
        uint256 id;
    }
    struct DAOMember {
        address memberAddress;
        uint256 deposit;
    }
    enum ActionType {
        Mint, // 0
        Withdraw, // 1
        AddDaoMembers, // 2
        RemoveDaoMembers, // 3
        DaoSetting // 4
    }
    struct GovernanceSettings {
        uint8 minimumParticipationPercentage;
        uint8 supportThresholdPercentage;
        uint32 minimumDurationForProposal;
        bool earlyExecution;
        bool canVoteChange;
    }
    struct GovernanceTokenParams {
        string name;
        string symbol;
        address councilAddress;
    }
    struct DaoSettings {
        string name;
        bytes data;
    }

     struct ProposalCreationSettings {
        bool isTokenBasedProposal;
        uint256 MinimumRequirement;
    }
    // function getAllProposals() external view returns (ProposalInfo[] memory);
    // function depositToDAOTreasury(uint256 amount) external payable ;
    // function withdrawFromDAOTreasury(uint256 amount) external ;
   
    function depositToDAOTreasury(uint256 _amount) external payable;
    function withdrawFromDAOTreasury(uint256 _amount) external;
    function depositTokens(uint256 _amount) external;
    function withdrawTokens(address _to, uint256 _amount) external;

}
