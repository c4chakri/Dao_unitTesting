// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {GovernanceToken, ReentrancyGuard, AccessControl} from "./GovernanceToken.sol";
import {IDAO} from "./IDao.sol";
import {DaoManagement} from "./DaoManagement.sol";

contract DAO is IDAO, ReentrancyGuard {
    GovernanceToken public immutable governanceToken;

    DaoSettings public _daoSettings;
    ProposalCreationSettings public _proposalCreationSettings;
    GovernanceSettings public governanceSettings;

    address public immutable DaoCreator;

    bool public isMultiSignDAO;

    uint256 public proposalId;
    uint256 public membersCount;

    mapping(uint256 => ProposalInfo) public proposals;
    mapping(address => bool) public blacklisted;
    mapping(address => bool) public isDAOMember;
    mapping(address => bool) public isProposal;
    mapping(address => uint256) public treasuryBalance;
    mapping(address => uint256) public tokenDeposited;

    error DAOBlacklistedAddress();
    error DAONotADaoMember();
    error DAOInsufficientBalance();
    error DAOInvalidAmount();
    error DepositsMisMatch(uint256 expected, uint256 actual);
    error DAOInsufficientAllowanceGovernanceToken();
    error DAOUnAuthorizedInteraction();
    error NotAFreshGovernanceToken();

    modifier notBlacklisted(address account) {
        if (blacklisted[account]) revert DAOBlacklistedAddress();
        _;
    }
    modifier _isProposal(address account) {
        require(isProposal[account], DAOUnAuthorizedInteraction());
        _;
    }
    modifier canInteractWithDAO(address account) {
        require(
            isDAOMember[account] || isProposal[msg.sender],
            DAONotADaoMember()
        );

        if (blacklisted[account]) revert DAOBlacklistedAddress();
        _;
    }

    constructor(
        address daoManagementAddress,
        DaoSettings memory _daoParams,
        address _governanceToken,
        GovernanceTokenParams memory _GovernanceTokenParams,
        GovernanceSettings memory _governanceSettings,
        DAOMember[] memory _daoMembers,
        ProposalCreationSettings memory _proposalCreationParams,
        bool _isMultiSignDAO
    ) {
        DaoManagement daoManagement = DaoManagement(daoManagementAddress);
        isMultiSignDAO = _isMultiSignDAO;
        if (!isMultiSignDAO) {
            governanceToken = _governanceToken != address(0)
                ? GovernanceToken(_governanceToken) // Use existing token
                : GovernanceToken(
                    daoManagement.createGovernanceToken(_GovernanceTokenParams)
                ); // Create new token

            // require(
            //     governanceToken.isFreshGovernanceToken(),
            //     NotAFreshGovernanceToken()
            // );
            governanceToken.setDAOAddress(address(this));
        }
        governanceSettings = _governanceSettings;

        _daoSettings = _daoParams;

        _proposalCreationSettings = _proposalCreationParams;
        DaoCreator = _GovernanceTokenParams.councilAddress;
        isDAOMember[msg.sender] = true;
        addDAOMembers(_daoMembers);
    }

    function depositToDAOTreasury(uint256 _amount)
        external
        payable
        canInteractWithDAO(msg.sender)
    {
        require(msg.value == _amount, "Incorrect amount sent");
        treasuryBalance[msg.sender] += _amount;
    }

    function withdrawFromDAOTreasury(
        address _from,
        address _to,
        uint256 amount
    ) external nonReentrant _isProposal(msg.sender) {
        require(amount > 0, DAOInvalidAmount());
        require(treasuryBalance[_from] >= amount, DAOInsufficientBalance());
        treasuryBalance[_from] -= amount;
        payable(_to).transfer(amount);
    }

    function depositTokens(uint256 _amount) external {
        require(
            governanceToken.balanceOf(msg.sender) >= _amount,
            "Not enough funds"
        );
        uint256 allowance = governanceToken.allowance(
            msg.sender,
            address(this)
        );
        require(
            allowance >= _amount,
            DAOInsufficientAllowanceGovernanceToken()
        );
        bool success = governanceToken.transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        require(success, "Token transfer failed");

        tokenDeposited[msg.sender] += _amount;
    }

    function withdrawTokens(
        address _from,
        address _to,
        uint256 _amount
    ) external nonReentrant _isProposal(msg.sender) {
        uint256 balance = governanceToken.balanceOf(address(this));
        uint256 depBal = tokenDeposited[_from];

        require(depBal >= _amount, "Not enough deposited balance");
        require(balance >= _amount, "Not enough contract balance");

        tokenDeposited[_from] -= _amount;
        bool success = governanceToken.transfer(_to, _amount);
        require(success, "Token transfer failed");
    }

    function addDAOMembers(DAOMember[] memory members) public {
        require(
            isDAOMember[msg.sender] || isProposal[msg.sender],
            DAONotADaoMember()
        );

        for (uint32 i = 0; i < members.length; i++) {
            address memberAddress = members[i].memberAddress;
            uint256 deposit = members[i].deposit;

            if (!isDAOMember[memberAddress]) {
                isDAOMember[memberAddress] = true;
                ++membersCount;
            }
            if (!isMultiSignDAO) {
                governanceToken.mintSupply(memberAddress, deposit);
            }
        }
    }

    function removeDAOMembers(DAOMember[] memory members) public {
        require(isMultiSignDAO,DAOUnAuthorizedInteraction());
        require(isProposal[msg.sender] || isDAOMember[msg.sender], DAOUnAuthorizedInteraction());

        for (uint32 i = 0; i < members.length; i++) {
            address memberAddress = members[i].memberAddress;

            if (isDAOMember[memberAddress]) {
                isDAOMember[memberAddress] = false;
                --membersCount;
            }
        }
    }

    function configureProposal(
        address proposalAddress,
        address _proposerAddress,
        string memory _title,
        uint8 _actionId
    ) external {
        proposals[proposalId] = ProposalInfo({
            deployedProposalAddress: proposalAddress,
            creator: _proposerAddress,
            title: _title,
            id: proposalId
        });

        if (_actionId <= uint8(ActionType.DaoSetting)) {
            ActionType action = ActionType(_actionId);
            if (action == ActionType.Mint) {
                governanceToken.setProposalRole(proposalAddress);
            }
        }
        proposalId++;
        isProposal[proposalAddress] = true;
    }

    function updateGovernanceSettings(GovernanceSettings memory _newSettings)
        external
        _isProposal(msg.sender)
    {
        governanceSettings = _newSettings;
    }

    function updateDaoSettings(DaoSettings memory _daoParams)
        external
        _isProposal(msg.sender)
    {
        _daoSettings = _daoParams;
    }

    //
    function updateProposalMemberSettings(
        ProposalCreationSettings memory _proposalCreationParams
    ) external _isProposal(msg.sender) {
        _proposalCreationSettings = _proposalCreationParams;
    }

    // ***********************************************************************************

    function canInteract(address _account)
        external
        view
        canInteractWithDAO(_account)
        returns (bool)
    {
        return true;
    }
}
