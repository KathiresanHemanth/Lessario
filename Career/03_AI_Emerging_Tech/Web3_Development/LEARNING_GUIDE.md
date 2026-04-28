# Web3 Development - Learning Guide

## 🎯 Goal
Master blockchain development — smart contracts, DApps, DeFi, DAOs, NFTs. Web3 is the decentralized internet revolution.

## 💰 Salary Range
| Level | India | Global (Remote) |
|-------|-------|-----------------|
| Fresher | ₹8-15 LPA | $80-130K |
| Mid (2-3 yrs) | ₹20-40 LPA | $130-200K |
| Senior (4+ yrs) | ₹40-80+ LPA | $200-400K+ |

*Web3 devs are among the highest-paid in all of tech*

---

## Core Concepts

1. **Blockchain Fundamentals** — Distributed ledger, consensus, hashing, Merkle trees
2. **Ethereum** — EVM, gas, accounts (EOA vs contract), transactions
3. **Solidity** — Smart contract language, types, modifiers, events, inheritance
4. **Development Tools** — Hardhat, Foundry, Remix, Truffle
5. **Testing & Security** — Unit tests, fuzzing, auditing, common vulnerabilities
6. **Frontend Integration** — ethers.js, wagmi, viem, wallet connection (MetaMask)
7. **DeFi Protocols** — AMM, lending, staking, liquidity pools, flash loans
8. **NFTs** — ERC-721, ERC-1155, metadata, IPFS, marketplaces
9. **DAOs** — Governance, voting, treasury management, OpenZeppelin Governor
10. **Layer 2** — Rollups (Optimistic, ZK), sidechains, bridges
11. **Cross-Chain** — Bridges, interoperability, Chainlink CCIP
12. **Solana** — Rust-based, Anchor framework, PDAs, CPIs

---

## Quick Reference

### Solidity — ERC-20 Token
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}
```

### Hardhat Setup
```bash
mkdir my-dapp && cd my-dapp
npx hardhat init
npm install @openzeppelin/contracts
npx hardhat compile
npx hardhat test
npx hardhat node        # Local blockchain
```

### ethers.js — Frontend Integration
```javascript
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const contract = new ethers.Contract(contractAddress, abi, signer);
const tx = await contract.transfer(recipient, ethers.parseEther("1.0"));
await tx.wait();
```

---

## 🛠️ Tools

| Category | Tools |
|----------|-------|
| **Smart Contracts** | Solidity, Vyper, Rust (Solana) |
| **Frameworks** | Hardhat, Foundry, Anchor (Solana) |
| **Frontend** | ethers.js, wagmi, viem, RainbowKit |
| **Testing** | Hardhat tests, Foundry fuzzing, Slither |
| **Storage** | IPFS, Arweave, Filecoin |
| **Indexing** | The Graph, Moralis, Alchemy |
| **Wallets** | MetaMask, WalletConnect, Phantom |
| **Chains** | Ethereum, Solana, Polygon, Arbitrum, Base |
| **Audit** | Slither, Mythril, Certora |

---

## Security — Top Vulnerabilities
⚠️ **Reentrancy** — External call before state update
⚠️ **Integer overflow** — Use SafeMath or Solidity 0.8+
⚠️ **Access control** — Missing onlyOwner modifiers
⚠️ **Front-running** — MEV, sandwich attacks
⚠️ **Flash loan attacks** — Price manipulation
⚠️ **Uninitialized storage** — Proxy pattern bugs

---

## Tips
- **Start with Solidity + Hardhat** — easiest entry
- **Learn Foundry** — faster testing, used by top protocols
- **Security is EVERYTHING** — one bug = millions lost
- **Build on testnets first** — Sepolia, Mumbai
- **Solana pays highest** — Rust + Anchor is lucrative
- **Audit skills** = premium salary ($300K+)

Build the decentralized future! 🌐
