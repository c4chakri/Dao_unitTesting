const abi =   [
    {
      constant: true,
      inputs: [ [Object] ],
      name: 'proposals',
      outputs: [
        [Object], [Object],
        [Object], [Object],
        [Object], [Object],
        [Object], [Object],
        [Object], [Object],
        [Object], [Object]
      ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object], [Object] ],
      name: 'approve',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'minTokensToCreate',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'rewardAccount',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'daoCreator',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'divisor',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'extraBalance',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object], [Object] ],
      name: 'executeProposal',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object], [Object], [Object] ],
      name: 'transferFrom',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'unblockMe',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'totalRewardToken',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'actualBalance',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'closingTime',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [ [Object] ],
      name: 'allowedRecipients',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object], [Object] ],
      name: 'transferWithoutReward',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'refund',
      outputs: [],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
      name: 'newProposal',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [ [Object] ],
      name: 'DAOpaidOut',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'minQuorumDivisor',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object] ],
      name: 'newContract',
      outputs: [],
      type: 'function'
    },
    {
      constant: true,
      inputs: [ [Object] ],
      name: 'balanceOf',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object], [Object] ],
      name: 'changeAllowedRecipients',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'halveMinQuorum',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [ [Object] ],
      name: 'paidOut',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object], [Object] ],
      name: 'splitDAO',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'DAOrewardAccount',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'proposalDeposit',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'numberOfProposals',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'lastTimeMinQuorumMet',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object] ],
      name: 'retrieveDAOReward',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'receiveEther',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object], [Object] ],
      name: 'transfer',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'isFueled',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object] ],
      name: 'createTokenProxy',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [ [Object] ],
      name: 'getNewDAOAddress',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object], [Object] ],
      name: 'vote',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'getMyReward',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [ [Object] ],
      name: 'rewardToken',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object], [Object], [Object] ],
      name: 'transferFromWithoutReward',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [ [Object], [Object] ],
      name: 'allowance',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: false,
      inputs: [ [Object] ],
      name: 'changeProposalDeposit',
      outputs: [],
      type: 'function'
    },
    {
      constant: true,
      inputs: [ [Object] ],
      name: 'blocked',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'curator',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [ [Object], [Object], [Object], [Object] ],
      name: 'checkProposalCode',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'privateCreation',
      outputs: [ [Object] ],
      type: 'function'
    },
    {
      inputs: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
      type: 'constructor'
    },
    {
      anonymous: false,
      inputs: [ [Object], [Object], [Object] ],
      name: 'Transfer',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [ [Object], [Object], [Object] ],
      name: 'Approval',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [ [Object] ],
      name: 'FuelingToDate',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [ [Object], [Object] ],
      name: 'CreatedToken',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [ [Object], [Object] ],
      name: 'Refund',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [ [Object], [Object], [Object], [Object], [Object] ],
      name: 'ProposalAdded',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [ [Object], [Object], [Object] ],
      name: 'Voted',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [ [Object], [Object], [Object] ],
      name: 'ProposalTallied',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [ [Object] ],
      name: 'NewCurator',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [ [Object], [Object] ],
      name: 'AllowedRecipientChanged',
      type: 'event'
    }
  ]