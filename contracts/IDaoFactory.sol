// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {GovernanceToken} from "./GovernanceToken.sol";
import {DAO} from "./Dao.sol";

interface IDAOFactory {
    
    struct DAOInfo {
        bytes32 name;
        address daoAddress;
        address daoCreator;
        address governanceAddress;
    }

    function daoId() external view returns (uint32);

    function daos(uint32 id) external view returns (
        bytes32 name,
        address daoAddress,
        address daoCreator,
        address governanceAddress
    );

    function createDAO(
         DAO.DaoSettings memory daoParams,
        address governanceTokenAddress,
        DAO.GovernanceTokenParams memory governanceTokenParams,
        DAO.GovernanceSettings memory governanceSettings,
        DAO.DAOMember[] memory _daoMembers,
        DAO.ProposalCreationSettings memory proposalCreationParams,
        bool isMultiSignDAO
    ) external;
}
