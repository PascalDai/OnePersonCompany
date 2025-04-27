---
title: 开发简单的去中心化应用(DApp)：Web3入门实践
description: 本文记录了开发一个简单的DApp的全过程，包括智能合约开发和前端集成
pubDate: 2023-11-20
author: 博主
type: task
projectId: p2
projectTitle: Web3学习笔记
taskId: t5
taskTitle: 开发简单的DApp
status: completed
image: 
  url: https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2352&auto=format&fit=crop
  alt: 区块链应用开发图片
tags: ["Web3", "DApp", "以太坊", "Solidity", "前端", "开发中"]
---

# 开发简单的去中心化应用(DApp)：Web3入门实践

在学习了Solidity基础后，下一步自然是尝试开发一个真正的去中心化应用(DApp)。本文记录了我开发一个简单投票DApp的进程，包括智能合约编写和前端集成，希望能为Web3初学者提供一些参考。

## 项目概述

这个简单的投票DApp具有以下功能：

1. 创建投票提案
2. 用户可以对提案进行投票
3. 实时显示投票结果
4. 基于区块链确保投票的透明性和不可篡改性

## 技术栈选择

在开发这个DApp时，我选择了以下技术栈：

- **智能合约**：Solidity + Hardhat
- **前端框架**：React + ethers.js
- **UI组件**：TailwindCSS + HeadlessUI
- **测试网络**：Sepolia测试网
- **钱包连接**：MetaMask

## 智能合约开发

### 合约设计

首先，我设计了一个简单的投票合约，包含以下核心功能：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleVoting {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 endTime;
        bool executed;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public proposalCount;
    address public owner;
    
    event ProposalCreated(uint256 id, string title, uint256 endTime);
    event Voted(uint256 proposalId, address voter, bool vote);
    event ProposalExecuted(uint256 proposalId, bool result);
    
    constructor() {
        owner = msg.sender;
    }
    
    function createProposal(string memory _title, string memory _description, uint256 _votingPeriod) external {
        proposalCount++;
        uint256 endTime = block.timestamp + _votingPeriod;
        
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            title: _title,
            description: _description,
            yesVotes: 0,
            noVotes: 0,
            endTime: endTime,
            executed: false
        });
        
        emit ProposalCreated(proposalCount, _title, endTime);
    }
    
    function vote(uint256 _proposalId, bool _vote) external {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp < proposal.endTime, "Voting period has ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");
        
        if (_vote) {
            proposal.yesVotes += 1;
        } else {
            proposal.noVotes += 1;
        }
        
        hasVoted[_proposalId][msg.sender] = true;
        
        emit Voted(_proposalId, msg.sender, _vote);
    }
    
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp >= proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        
        proposal.executed = true;
        bool result = proposal.yesVotes > proposal.noVotes;
        
        emit ProposalExecuted(_proposalId, result);
    }
    
    function getProposal(uint256 _proposalId) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 endTime,
        bool executed
    ) {
        Proposal memory proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.title,
            proposal.description,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.endTime,
            proposal.executed
        );
    }
}
```

### 部署与测试

使用Hardhat框架进行合约的编译、测试和部署：

1. **设置Hardhat项目**

```bash
mkdir voting-dapp
cd voting-dapp
npm init -y
npm install --save-dev hardhat
npx hardhat
```

2. **编写测试用例**

```javascript
const { expect } = require("chai");

describe("SimpleVoting", function() {
  let SimpleVoting;
  let voting;
  let owner;
  let addr1;
  let addr2;
  
  beforeEach(async function() {
    SimpleVoting = await ethers.getContractFactory("SimpleVoting");
    [owner, addr1, addr2] = await ethers.getSigners();
    voting = await SimpleVoting.deploy();
  });
  
  describe("Proposal Creation", function() {
    it("Should create a new proposal", async function() {
      await voting.createProposal("Test Proposal", "This is a test", 3600);
      const proposal = await voting.getProposal(1);
      expect(proposal.title).to.equal("Test Proposal");
    });
  });
  
  describe("Voting", function() {
    beforeEach(async function() {
      await voting.createProposal("Test Proposal", "This is a test", 3600);
    });
    
    it("Should allow users to vote", async function() {
      await voting.connect(addr1).vote(1, true);
      const proposal = await voting.getProposal(1);
      expect(proposal.yesVotes).to.equal(1);
    });
    
    it("Should prevent double voting", async function() {
      await voting.connect(addr1).vote(1, true);
      await expect(
        voting.connect(addr1).vote(1, false)
      ).to.be.revertedWith("Already voted");
    });
  });
});
```

3. **部署到测试网**

```javascript
// scripts/deploy.js
async function main() {
  const SimpleVoting = await ethers.getContractFactory("SimpleVoting");
  const voting = await SimpleVoting.deploy();
  
  await voting.deployed();
  
  console.log("SimpleVoting deployed to:", voting.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

执行部署：

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## 前端开发

### 创建React应用

首先创建一个React应用：

```bash
npx create-react-app voting-dapp-frontend
cd voting-dapp-frontend
npm install ethers tailwindcss @headlessui/react
```

### 连接MetaMask

实现钱包连接功能：

```jsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  
  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newSigner = newProvider.getSigner();
        
        setAccount(accounts[0]);
        setProvider(newProvider);
        setSigner(newSigner);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">投票DApp</h1>
          <button
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {account ? `${account.substring(0, 6)}...${account.substring(38)}` : "连接钱包"}
          </button>
        </header>
        
        {/* 应用内容 */}
      </div>
    </div>
  );
}

export default App;
```

### 与合约交互

创建合约交互的Hook：

```jsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SimpleVotingABI from './SimpleVotingABI.json';

const contractAddress = "YOUR_CONTRACT_ADDRESS";

export function useContract(signer) {
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (signer) {
      const votingContract = new ethers.Contract(
        contractAddress,
        SimpleVotingABI,
        signer
      );
      setContract(votingContract);
    }
  }, [signer]);
  
  useEffect(() => {
    if (contract) {
      loadProposals();
    }
  }, [contract]);
  
  async function loadProposals() {
    setLoading(true);
    try {
      const count = await contract.proposalCount();
      const proposalList = [];
      
      for (let i = 1; i <= count; i++) {
        const proposal = await contract.getProposal(i);
        proposalList.push({
          id: proposal.id.toNumber(),
          title: proposal.title,
          description: proposal.description,
          yesVotes: proposal.yesVotes.toNumber(),
          noVotes: proposal.noVotes.toNumber(),
          endTime: new Date(proposal.endTime.toNumber() * 1000),
          executed: proposal.executed
        });
      }
      
      setProposals(proposalList);
    } catch (error) {
      console.error("Error loading proposals:", error);
    } finally {
      setLoading(false);
    }
  }
  
  async function createProposal(title, description, votingPeriod) {
    try {
      const tx = await contract.createProposal(
        title,
        description,
        votingPeriod
      );
      await tx.wait();
      loadProposals();
    } catch (error) {
      console.error("Error creating proposal:", error);
      throw error;
    }
  }
  
  async function vote(proposalId, voteValue) {
    try {
      const tx = await contract.vote(proposalId, voteValue);
      await tx.wait();
      loadProposals();
    } catch (error) {
      console.error("Error voting:", error);
      throw error;
    }
  }
  
  return {
    contract,
    proposals,
    loading,
    createProposal,
    vote,
    loadProposals
  };
}
```

### 创建UI组件

实现投票界面：

```jsx
function ProposalCard({ proposal, onVote }) {
  const endTimeFormatted = proposal.endTime.toLocaleString();
  const isActive = proposal.endTime > new Date() && !proposal.executed;
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {proposal.title}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {proposal.description}
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">状态</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {proposal.executed ? "已结束" : isActive ? "进行中" : "等待执行"}
            </dd>
          </div>
          
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">投票结束时间</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {endTimeFormatted}
            </dd>
          </div>
          
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">投票结果</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="flex items-center">
                <span className="mr-4">赞成: {proposal.yesVotes}</span>
                <span>反对: {proposal.noVotes}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ 
                    width: `${proposal.yesVotes + proposal.noVotes > 0 
                      ? (proposal.yesVotes / (proposal.yesVotes + proposal.noVotes) * 100) 
                      : 0}%` 
                  }}
                ></div>
              </div>
            </dd>
          </div>
          
          {isActive && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">你的投票</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex gap-4">
                <button 
                  onClick={() => onVote(proposal.id, true)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                >
                  赞成
                </button>
                <button 
                  onClick={() => onVote(proposal.id, false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                >
                  反对
                </button>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
```

## 目前进度

目前，这个DApp项目已经完成了以下部分：

1. ✅ 智能合约设计和测试
2. ✅ 合约部署到Sepolia测试网
3. ✅ 基本前端界面搭建
4. ✅ 钱包连接功能

正在进行中的工作：

1. 🔄 完善前端UI/UX
2. 🔄 添加事件监听和实时更新
3. 🔄 实现提案创建表单
4. 🔄 移动端适配优化

## 面临的挑战

在开发过程中，我面临了一些挑战：

1. **Gas费用优化**：如何设计合约以减少用户交互的gas费用
2. **前端状态管理**：区块链事件的异步性导致UI状态管理变得复杂
3. **用户体验**：如何降低Web3应用的使用门槛，提供友好的用户体验
4. **测试数据**：在测试网络获取测试代币和创建真实测试数据

## 下一步计划

接下来，我计划：

1. 完成提案创建和投票功能的前端实现
2. 添加提案执行功能
3. 实现事件监听和实时更新
4. 优化移动端适配
5. 部署到IPFS，实现完全去中心化的前端

## 学习心得

通过这个项目，我深入理解了DApp开发的整个流程，特别是智能合约与前端交互的复杂性。我认识到Web3应用开发的独特挑战，例如异步交互、状态管理和用户体验设计。

与传统Web应用相比，DApp开发需要更多考虑安全性、gas优化和去中心化的优势。这个项目让我对Web3的潜力和局限性有了更清晰的认识。

在完成这个项目后，我计划进一步探索更复杂的DApp开发，包括NFT、DeFi等领域的应用。 