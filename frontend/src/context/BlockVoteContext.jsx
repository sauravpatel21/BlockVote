import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { BrowserProvider, Contract } from "ethers";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CONTRACT_ADDRESS = import.meta.env.VITE_VOTING_CONTRACT_ADDRESS;
const AMOY_CHAIN_ID = "0x13882"; // 80002

const BlockVoteContext = createContext(null);

// Minimal ABI for our Voting contract
const VotingABI = [
  "function candidateCount() view returns (uint256)",
  "function getCandidate(uint256 _candidateId) view returns (string)",
  "function getVotes(uint256 _candidateId) view returns (uint256)",
  "function vote(uint256 _candidateId)",
  "function checkVoted(address _voter) view returns (bool)",
  "function addCandidate(string _ipfsHash)",
  "event VoteCast(address indexed voter, uint256 indexed candidateId)"
];

export function BlockVoteProvider({ children }) {
  const [auth, setAuth] = useState({ token: null, user: null });
  const [account, setAccount] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [status, setStatus] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  const api = useMemo(() => axios.create({ baseURL: API_URL }), []);
  api.interceptors.request.use((config) => {
    if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`;
    return config;
  });

  useEffect(() => {
    const token = localStorage.getItem("blockvote_token");
    const user = JSON.parse(localStorage.getItem("blockvote_user"));
    if (token && user) setAuth({ token, user });
  }, []);

  const ensurePolygonAmoyNetwork = async () => {
    if (!window.ethereum) throw new Error("MetaMask is required");
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== AMOY_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: AMOY_CHAIN_ID }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: AMOY_CHAIN_ID,
                chainName: "Polygon Amoy Testnet",
                rpcUrls: [import.meta.env.VITE_POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology/"],
                nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
                blockExplorerUrls: ["https://amoy.polygonscan.com/"],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
    }
  };

  const getVotingContract = async (withSigner = false) => {
    if (!window.ethereum) throw new Error("MetaMask is required");
    const provider = new BrowserProvider(window.ethereum);
    if (withSigner) {
      const signer = await provider.getSigner();
      return new Contract(CONTRACT_ADDRESS, VotingABI, signer);
    }
    return new Contract(CONTRACT_ADDRESS, VotingABI, provider);
  };

  const checkVotedStatus = useCallback(async (walletAddress) => {
    if (!walletAddress || !CONTRACT_ADDRESS) return;
    try {
      const contract = await getVotingContract(false);
      const voted = await contract.checkVoted(walletAddress);
      setHasVoted(voted);
    } catch (e) {
      console.warn("Failed to check voted status", e);
    }
  }, []);

  const connectWallet = async () => {
    try {
      await ensurePolygonAmoyNetwork();
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      checkVotedStatus(accounts[0]);
    } catch (error) {
      setStatus(error.message);
    }
  };

  useEffect(() => {
    if (account) checkVotedStatus(account);
  }, [account, checkVotedStatus]);

  const loadCandidates = useCallback(async () => {
    if (!window.ethereum || !CONTRACT_ADDRESS) return;
    try {
      await ensurePolygonAmoyNetwork();
      const contract = await getVotingContract(false);
      const count = await contract.candidateCount();
      const rows = [];
      for (let i = 1; i <= Number(count); i++) {
        const ipfsHash = await contract.getCandidate(i);
        const votes = await contract.getVotes(i);
        let meta = { name: "Unknown", party: "", image: "" };
        try {
          const res = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
          meta = res.data;
        } catch (e) { console.warn("IPFS load failed", e); }
        rows.push({ id: i, ipfsHash, votes: Number(votes), ...meta });
      }
      setCandidates(rows);
    } catch (error) {
      console.error(error);
      setStatus(error.message);
    }
  }, []);

  const onVote = async (candidateId) => {
    try {
      setStatus("Initiating transaction...");
      await ensurePolygonAmoyNetwork();
      const contract = await getVotingContract(true);
      const tx = await contract.vote(candidateId);
      setStatus(`Transaction sent! Hash: ${tx.hash}`);
      await tx.wait();
      setStatus("Vote cast successfully!");
      setHasVoted(true);
      loadCandidates();
    } catch (error) {
      console.error(error);
      setStatus(error.reason || error.message);
    }
  };

  const requestOtp = async (voterId, email, purpose) => {
    try {
      setStatus("Sending OTP...");
      await api.post("/auth/otp/request", { voterId, email, purpose });
      setStatus("OTP sent to your email!");
      return true;
    } catch (error) {
      setStatus(error.response?.data?.message || error.message);
      return false;
    }
  };

  const verifyOtp = async (voterId, email, otp, purpose) => {
    try {
      setStatus("Verifying...");
      const { data } = await api.post("/auth/verify", { voterId, email, otp, purpose });
      setAuth({ token: data.token, user: data.user });
      localStorage.setItem("blockvote_token", data.token);
      localStorage.setItem("blockvote_user", JSON.stringify(data.user));
      setStatus("Success!");
      return true;
    } catch (error) {
      setStatus(error.response?.data?.message || error.message);
      return false;
    }
  };

  const addCandidate = async (metadata) => {
    try {
      setStatus("Uploading metadata to IPFS...");
      const { data } = await api.post("/ipfs/upload", metadata);
      setStatus("Adding candidate to blockchain...");
      await ensurePolygonAmoyNetwork();
      const contract = await getVotingContract(true);
      const tx = await contract.addCandidate(data.ipfsHash);
      setStatus(`Transaction sent! Hash: ${tx.hash}`);
      await tx.wait();
      setStatus("Candidate added!");
      loadCandidates();
    } catch (error) {
      setStatus(error.response?.data?.message || error.message);
    }
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem("blockvote_token");
    localStorage.removeItem("blockvote_user");
    setAccount("");
  };

  return (
    <BlockVoteContext.Provider value={{
      auth, status, setStatus, account, connectWallet, candidates, loadCandidates, onVote, requestOtp, verifyOtp, addCandidate, logout, hasVoted
    }}>
      {children}
    </BlockVoteContext.Provider>
  );
}

export function useBlockVote() {
  return useContext(BlockVoteContext);
}
