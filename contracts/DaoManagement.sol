// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proposal} from "./Proposal.sol";
import {IProposal} from "./IProposal.sol";
import {DAO} from "./Dao.sol";
import {IDAO} from "./IDao.sol";
import {GovernanceToken, ReentrancyGuard, AccessControl} from "./GovernanceToken.sol";


contract DaoManagement {
    event proposalCreated(address proposal);
    function createProposal(
        address _daoAddress,
        string memory _title,
        string memory _description,
        uint32 _startTime,
        uint32 _duration,
        uint8 actionId,
        IProposal.Action[] memory _actions
    ) external returns (address) {
        Proposal newProposal = new Proposal(
            _daoAddress,
            msg.sender,
            2,
            _title,
            _description,
            _startTime,
            _duration,
            actionId,
            _actions
        );
        emit proposalCreated(address(newProposal));
        return address(newProposal);
    }

    function createGovernanceToken(
        IDAO.GovernanceTokenParams memory _GovernanceTokenParams
    ) public returns (address) {
        GovernanceToken gnt = new GovernanceToken(
            _GovernanceTokenParams.name,
            _GovernanceTokenParams.symbol,
            _GovernanceTokenParams.councilAddress,
            18,
            GovernanceToken.smartContractActions({
                canMint: true,
                canBurn: false,
                canPause: true,
                canStake: true,
                canTransfer: true,
                canChangeOwner: false
            })
        );
        return address(gnt);
    }
}
