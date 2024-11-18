// SPDX-License-Identifier: MIT

/**
 * @dev This contract is a decentralized autonomous organization (DAO) allowing
 *      members to create and vote on proposals. It is based on OpenZeppelin's
 *      ERC20Votes contract and includes roles for minting, burning, pausing,
 *      and changing the owner of the governance token.
 */
pragma solidity ^0.8.21;

import {GovernanceToken, ReentrancyGuard, AccessControl,ERC20} from "./GovernanceToken.sol";
import {IDAO} from "./IDao.sol";
import {DaoManagement} from "./DaoManagement.sol";


/**
 * @title DAO
 * @dev A decentralized autonomous organization (DAO) is an
 *      organization that is run by its members, typically in a
 *      decentralized manner.
 */
contract DAO is IDAO, ReentrancyGuard {
    /**
     * @dev The governance token used for voting and staking within the DAO.
     */
    GovernanceToken public immutable governanceToken;

    /**
     * @dev DAO settings including parameters like quorum and voting period.
     */
    DaoSettings public _daoSettings;

    /**
     * @dev Settings related to proposal creation, such as required deposit.
     */
    ProposalCreationSettings public _proposalCreationSettings;

    /**
     * @dev Governance settings including parameters like treasury limits.
     */
    GovernanceSettings public governanceSettings;

    /**
     * @dev Address of the creator of the DAO.
     */
    address public immutable DaoCreator;

    /**
     * @dev Indicates if the DAO is multi-signature enabled.
     */
    bool public isMultiSignDAO;

    /**
     * @dev Counter for tracking proposal IDs.
     */
    uint256 public proposalId;

    /**
     * @dev Counter for tracking the number of DAO members.
     */
    uint256 public membersCount;

    /**
     * @dev Mapping of proposal ID to proposal information.
     */
    mapping(uint256 => ProposalInfo) public proposals;

    /**
     * @dev Mapping to track blacklisted addresses.
     */
    mapping(address => bool) public blacklisted;

    /**
     * @dev Mapping to check if an address is a DAO member.
     */
    mapping(address => bool) public isDAOMember;

    /**
     * @dev Mapping to check if an address is a proposal contract.
     */
    mapping(address => bool) public isProposal;

    /**
     * @dev Mapping of addresses to their treasury balance.
     */
    mapping(address => uint256) public treasuryBalance;

    /**
     * @dev Mapping of addresses to the amount of tokens deposited.
     */
    mapping(address => mapping (address => uint256)) public tokenDeposited;

    mapping (address=> uint256) public  tokensDeposited;

    // Custom error messages for specific conditions in the DAO contract
    error DAOBlacklistedAddress();
    error DAONotADaoMember();
    error DAOInsufficientBalance();
    error DAOInvalidAmount();
    error DepositsMisMatch(uint256 expected, uint256 actual);
    error DAOInsufficientAllowanceGovernanceToken();
    error DAOUnAuthorizedInteraction();
    error NotAFreshGovernanceToken();

    // Modifiers
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

    /**
     * @dev Initializes the DAO with the provided parameters.
     * @param daoManagementAddress The address of the DAO management contract.
     * @param _daoParams Initial settings for the DAO.
     * @param _governanceToken Address of an existing governance token or zero to create a new token.
     * @param _GovernanceTokenParams Parameters for governance token creation.
     * @param _governanceSettings Governance configuration settings.
     * @param _daoMembers Initial members of the DAO.
     * @param _proposalCreationParams Settings for creating proposals in the DAO.
     * @param _isMultiSignDAO Flag indicating if the DAO requires multi-signature for actions.
     */
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
            governanceToken.setDAOAddress(address(this));
        }
        governanceSettings = _governanceSettings;
        _daoSettings = _daoParams;
        _proposalCreationSettings = _proposalCreationParams;
        DaoCreator = _GovernanceTokenParams.councilAddress;
        isDAOMember[msg.sender] = true;
        addDAOMembers(_daoMembers);
    }

    /**
     * @dev Allows members to deposit funds to the DAO's treasury.
     * @param _amount The amount to deposit.
     */
    function depositToDAOTreasury(uint256 _amount)
        external
        payable
        canInteractWithDAO(msg.sender)
    {
        require(msg.value == _amount, "Incorrect amount sent");
        treasuryBalance[msg.sender] += _amount;
    }

    /**
     * @dev Withdraws funds from the DAO treasury.
     * @param _from The address from which funds are deducted.
     * @param _to The recipient address.
     * @param amount The amount to withdraw.
     */
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

    /**
     * @dev Deposits ERC20 tokens into the DAO.
     * @param _token ERC20 Token to deposit
     * @param _amount Amount of tokens to deposit.
     */
    function depositTokens(address _token,uint256 _amount) external {
        ERC20 token = ERC20(_token);
        require(
            token.balanceOf(msg.sender) >= _amount,
            "Not enough funds"
        );
        uint256 allowance = token.allowance(
            msg.sender,
            address(this)
        );
        require(
            allowance >= _amount,
            DAOInsufficientAllowanceGovernanceToken()
        );

        bool success = token.transferFrom(
            msg.sender,
            address(this),
            _amount
        );

        require(success, "Token transfer failed");
        tokenDeposited[_token][msg.sender] += _amount;
    }

    /**
     * @dev Withdraws governance tokens from the DAO.
     * @param _token The address ERC20 Token which are deposited in DAO
     * @param _from The address from which tokens are withdrawn.
     * @param _to The recipient address.
     * @param _amount The amount to withdraw.
     */
    function withdrawTokens(
        address _token,
        address _from,
        address _to,
        uint256 _amount
    ) external nonReentrant _isProposal(msg.sender) {
        ERC20 token = ERC20(_token);
        uint256 balance = token.balanceOf(address(this));
        uint256 depBal = tokenDeposited[_token][_from];
        require(depBal >= _amount, "Not enough deposited balance");
        require(balance >= _amount, "Not enough contract balance");
        tokenDeposited[_token][_from] -= _amount;
        bool success = token.transfer(_to, _amount);
        require(success, "Token transfer failed");
    }

    /**
     * @dev Adds new members to the DAO.
     * @param members Array of members to be added.
     */
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

    /**
     * @dev Removes members from the DAO.
     * @param members Array of members to be removed.
     */
    function removeDAOMembers(DAOMember[] memory members) public {
        require(isMultiSignDAO,DAOUnAuthorizedInteraction());
        require(isProposal[msg.sender], DAOUnAuthorizedInteraction());
        for (uint32 i = 0; i < members.length; i++) {
            address memberAddress = members[i].memberAddress;
            if (isDAOMember[memberAddress]) {
                isDAOMember[memberAddress] = false;
                --membersCount;
            }
        }
    }

    /**
     * @dev Configures a proposal for the DAO.
     * @param proposalAddress Address of the deployed proposal.
     * @param _proposerAddress Address of the proposal creator.
     * @param _title Title of the proposal.
     * @param _actionId ID of the action proposed 1 for mint and 2 for burn.
     */
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
