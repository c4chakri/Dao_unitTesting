// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {DAO} from "./Dao.sol";
import {IDAOFactory} from "./IDaoFactory.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DAOFactory is Initializable, UUPSUpgradeable, OwnableUpgradeable, IDAOFactory {
    uint32 public daoId;
    mapping(uint32 => DAOInfo) public daos;
    address public daoManagement;

    function initialize(address _daoManagement) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        daoManagement = _daoManagement;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function createDAO(
        DAO.DaoSettings memory daoParams,
        address governanceTokenAddress,
        DAO.GovernanceTokenParams memory governanceTokenParams,
        DAO.GovernanceSettings memory governanceSettings,
        DAO.DAOMember[] memory _daoMembers,
        DAO.ProposalCreationSettings memory proposalCreationParams,
        bool isMultiSignDAO
    ) external {
        DAO newDAO = new DAO(
            daoManagement,
            daoParams,
            governanceTokenAddress,
            governanceTokenParams,
            governanceSettings,
            _daoMembers,
            proposalCreationParams,
            isMultiSignDAO
        );

        DAOInfo storage dao = daos[daoId];
        dao.name = keccak256(bytes(daoParams.name));
        dao.daoAddress = address(newDAO);
        dao.daoCreator = msg.sender;
        dao.governanceAddress = address(newDAO.governanceToken());
        daoId++;
    }

    function version() external pure returns (string memory) {
        return "0.2.1";
    }
}
