# ⚡ CryptoGig — Decentralized Freelance Marketplace on Solana

> The first crypto-native freelance marketplace. Hire video editors, community managers, developers, and artists — all payments locked in USDC escrow on Solana until the job is done.

![CryptoGig](https://img.shields.io/badge/Built%20on-Solana-9945FF?style=for-the-badge)
![USDC](https://img.shields.io/badge/Payments-USDC-2775CA?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-00ff88?style=for-the-badge)

🌐 **Live App:** [thecryptogig.vercel.app](https://thecryptogig.vercel.app)
📦 **GitHub:** [github.com/thecryptochampion/cryptogig](https://github.com/thecryptochampion/cryptogig)

---

## 🚨 The Problem

Every day in crypto:
- Clients pay freelancers upfront and get ghosted
- Freelancers deliver work and never get paid
- There is zero trustless infrastructure for crypto-native talent

Fiverr doesn't accept USDC. PayPal doesn't work cross-border. And handing crypto to a stranger based on trust alone? We've all seen how that ends.

**The crypto freelance economy is worth billions annually — yet runs entirely on handshakes and hope.**

---

## ⚡ The Solution

CryptoGig eliminates the trust crisis with a trustless USDC escrow protocol on Solana. When a client posts a job, USDC locks atomically into a Solana smart contract. The freelancer accepts, delivers the work, and funds release only upon client approval — instantly, transparently, irrevocably. No middleman. No delays. No scams.

---

## 🔒 How The Escrow Works
Client posts job → USDC locked in vault PDA
↓
Freelancer accepts → Status: In Progress
↓
Work delivered → Client approves
↓
95% → Freelancer wallet (instant, on-chain)
5% → Platform treasury (CryptoGig fee)

All logic lives on-chain. Nobody — not even CryptoGig — can touch the funds until the job is approved.

---

## 🎯 Who Is It For

| Role | Use Case |
|---|---|
| 🎬 Video Editors | Get hired to produce crypto review videos |
| 📢 Coin Shillers | Run paid shill campaigns for new launches |
| 🛡️ Mod Teams | Manage Discord communities for DeFi projects |
| 💻 Developers | Build dApps, landing pages, smart contracts |
| 🎨 NFT Artists | Design collections and generative art |
| ✍️ Copywriters | Write whitepapers, blogs, marketing copy |
| 🚀 Marketers | Run growth campaigns for crypto projects |

---

## 🏗 Architecture
┌─────────────────────────────────────┐
│         React Frontend              │
│  Wallet Connect │ Job Board │ Escrow│
└────────────────┬────────────────────┘
│ Anchor SDK
┌────────────────▼────────────────────┐
│     Anchor Smart Contract (Rust)    │
│                                     │
│  createEscrow()  → Lock USDC        │
│  acceptJob()     → Freelancer in    │
│  releaseFunds()  → Pay 95% + 5%    │
│  cancelEscrow()  → Full refund      │
│  raiseDispute()  → Flag for review  │
└────────────────┬────────────────────┘
│ SPL Token Program
┌────────────────▼────────────────────┐
│         Solana Blockchain           │
│  USDC · Program Derived Accounts    │
└─────────────────────────────────────┘

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript |
| Wallet | Solana Wallet Adapter, Phantom |
| Smart Contract | Rust, Anchor Framework |
| Payments | USDC SPL Token |
| Blockchain | Solana Devnet |
| Deployment | Vercel |
| Dev Tools | VS Code, GitHub, Solana Playground |

---

## 💸 Fee Structure

Client posts $100 USDC job
├── $95 USDC → Freelancer (on approval)
└── $5 USDC  → CryptoGig treasury (5% fee)

Fee is hardcoded in the smart contract at 500 basis points and cannot be changed without redeployment.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Phantom Wallet browser extension
- Devnet SOL from faucet.solana.com

### Run Locally

```bash
git clone https://github.com/thecryptochampion/cryptogig
cd cryptogig
npm install --legacy-peer-deps
npm start
```

Opens at http://localhost:3000

---

## 🔑 Smart Contract Instructions

| Instruction | Caller | Description |
|---|---|---|
| `createEscrow` | Client | Locks USDC in vault PDA |
| `acceptJob` | Freelancer | Commits to the job |
| `releaseFunds` | Client | Pays 95% to freelancer + 5% fee |
| `cancelEscrow` | Client | Full refund if job still open |
| `raiseDispute` | Either party | Flags job for resolution |

---

## 🔒 Security Model

- Funds held in Program Derived Vault Accounts — not controlled by any wallet
- Only the client can release or cancel funds
- Status-gated instructions prevent invalid state transitions
- All transactions visible and verifiable on Solana Explorer

---

## 🏆 Hackathon

Built for the Solana Frontier Hackathon 2026 by Colosseum.

- 🌐 Live: thecryptogig.vercel.app
- 📦 Repo: github.com/thecryptochampion/cryptogig
- 🔍 Network: Solana Devnet

---

## 🛣 Roadmap

- On-chain reputation system
- Multi-milestone escrow payments
- DAO governance for dispute resolution
- Mobile app with Mobile Wallet Adapter
- Mainnet launch with real USDC
- Platform governance token

---

## 📜 License

MIT © 2026 CryptoGig