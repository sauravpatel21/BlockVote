// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    address public owner;
    bool public votingActive;
    uint256 public totalVotes;
    
    mapping(address => bool) public hasVoted;
    
    struct Candidate {
        string ipfsHash;
        uint256 voteCount;
    }
    
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidateCount;
    
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event CandidateAdded(uint256 indexed candidateId, string ipfsHash);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier isVotingActive() {
        require(votingActive, "Voting not active");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        votingActive = true;
    }
    
    function addCandidate(string memory _ipfsHash) external onlyOwner {
        candidateCount++;
        candidates[candidateCount] = Candidate({
            ipfsHash: _ipfsHash,
            voteCount: 0
        });
        emit CandidateAdded(candidateCount, _ipfsHash);
    }
    
    // Gas-optimized voting function
    function vote(uint256 _candidateId) external isVotingActive {
        require(!hasVoted[msg.sender], "Already voted");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");
        
        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        totalVotes++;
        
        emit VoteCast(msg.sender, _candidateId);
    }
    
    function getCandidate(uint256 _candidateId) external view returns (string memory ipfsHash) {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");
        return candidates[_candidateId].ipfsHash;
    }

    function getVotes(uint256 _candidateId) external view returns (uint256) {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");
        return candidates[_candidateId].voteCount;
    }
    
    function checkVoted(address _voter) external view returns (bool) {
        return hasVoted[_voter];
    }

    function setVotingActive(bool _state) external onlyOwner {
        votingActive = _state;
    }
}
