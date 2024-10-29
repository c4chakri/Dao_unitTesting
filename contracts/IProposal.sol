// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IProposal {
        struct Action {
        address to;
        uint256 value;
        bytes data;
    }
    function vote(uint8 _voteOption) external;
    function executeProposal() external ;
}