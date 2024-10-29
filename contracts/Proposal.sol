// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {IProposal} from "./IProposal.sol";
import {DAO} from "./Dao.sol";

contract Proposal is IProposal {
    address public daoAddress;
    address public proposerAddress;
    address public governanceTokenAddress;

    string public proposalTitle;
    string public proposalDescription;

    uint256 public yesVotes;
    uint256 public noVotes;
    uint256 public abstainVotes;
    uint32 public startTime;
    uint32 public endTime;

    uint8 public status;
    uint8 public minimumParticipationPercentage;
    uint8 public supportThresholdPercentage;
    uint256 public minimumDurationForProposal;
    bool public executed;
    bool public approved;
    bool public earlyExecution;

    DAO public dao;
    Action[] public actions;

    mapping(address => bool) public hasVoted;

    error InvalidVoteType(string expected, uint256 actual);
    error UnAuthorized();
    error InsufficientPower();
    error ZeroSupply();
    error ProposalNotExist();
    error NotStarted();
    error AlreadyVoted();
    error ProposalAlreadyExecuted();
    error VotingEnded();
    error ProposalNotApproved();
    error ActionExecutionFailed();
    
    modifier canVote() {
        require(dao.canInteract(msg.sender), UnAuthorized());
        require(status > 0, ProposalNotExist());
        require(!executed, ProposalAlreadyExecuted());
        require(!hasVoted[msg.sender], AlreadyVoted());
        require(block.timestamp >= startTime, NotStarted());
        require(block.timestamp <= endTime, VotingEnded());
        _;
    }
    modifier canExecute() {
        require(dao.canInteract(msg.sender), UnAuthorized());
        require(!executed, ProposalAlreadyExecuted());
        require(approved, ProposalNotApproved());
        _;
    }

    constructor(
        address _daoAddress,
        address _proposerAddress,
        string memory _title,
        string memory _description,
        uint32 _startTime,
        uint32 _duration,
        uint8 actionId,
        Action[] memory _actions
    ) {
        daoAddress = _daoAddress;
        dao = DAO(daoAddress);
        governanceTokenAddress = address(dao.governanceToken());
        proposerAddress = _proposerAddress;
        (bool isTokenBased, uint256 miniReqToken) = dao
            ._proposalCreationSettings();
        require(dao.canInteract(_proposerAddress), UnAuthorized());

        if (isTokenBased) {
            require(
                miniReqToken <= _getVotingUnits(_proposerAddress),
                InsufficientPower()
            );
        }
        proposalTitle = _title;
        proposalDescription = _description;
        startTime = _startTime;
        endTime = startTime + _duration;
        dao.configureProposal(
            address(this),
            _proposerAddress,
            _title,
            actionId
        );

        (
            uint8 _minimumParticipationPercentage,
            uint8 _supportThresholdPercentage,
            uint32 _minimumDurationForProposal,
            bool _earlyExecution,
            bool _canVoteChange
        ) = dao.governanceSettings();

        minimumParticipationPercentage = _minimumParticipationPercentage;
        supportThresholdPercentage = _supportThresholdPercentage;
        minimumDurationForProposal = _minimumDurationForProposal;
        earlyExecution = _earlyExecution;

        status = 1;

        for (uint8 i = 0; i < _actions.length; i++) {
            actions.push(_actions[i]);
        }
    }

    function _getVotingUnits(address account) private view returns (uint256) {
        if (dao.isMultiSignDAO()) {
            return 1;
        } else {
            ERC20Votes erc20 = ERC20Votes(governanceTokenAddress);
            return erc20.balanceOf(account);
        }
    }

    function vote(uint8 _voteOption) external canVote {
        uint256 votes = _getVotingUnits(msg.sender);
        require(votes > 0, InsufficientPower());

        if (_voteOption == 1) {
            yesVotes += votes;
        } else if (_voteOption == 2) {
            noVotes += votes;
        } else if (_voteOption == 3) {
            abstainVotes += votes;
        } else {
            revert InvalidVoteType({
                expected: "1 or 2 or 3",
                actual: _voteOption
            });
        }

        hasVoted[msg.sender] = true;

        if (dao.isMultiSignDAO()) {
            uint256 totalMembers = dao.membersCount();
            uint256 yesVotesPercentage = (yesVotes * (100)) / totalMembers;

            if (yesVotesPercentage >= supportThresholdPercentage) {
                approved = yesVotes > noVotes;
                status = 2; // Approved
            } else {
                approved = false;
            }
        } else {
            uint256 totalSupply = ERC20Votes(governanceTokenAddress)
                .totalSupply();
            require(totalSupply > 0, ZeroSupply());

            uint256 totalVotes = yesVotes + noVotes + abstainVotes;
            uint256 tokenParticipation = (totalVotes * (100)) / (totalSupply);

            uint256 yesVotesPercentage = (yesVotes * (100)) / totalVotes;

            if (
                yesVotesPercentage >= supportThresholdPercentage &&
                tokenParticipation >= minimumParticipationPercentage
            ) {
                approved = yesVotes > noVotes;
                status = 2; // Approved
            } else {
                approved = false;
            }
        }
    }

    function executeProposal() external canExecute {
        if (earlyExecution || block.timestamp >= endTime) {
            executed = true;
            status = 3; //executed
            for (uint256 i = 0; i < actions.length; i++) {
                Action memory action = actions[i];
                (bool success, ) = action.to.call{value: action.value}(
                    action.data
                );
                require(success, ActionExecutionFailed());
            }
        }
    }
}
