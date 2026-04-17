import { PublicKey } from "@solana/web3.js";

// ─── Program IDs ─────────────────────────────────────────────────────────────
// Placeholder until you deploy your Anchor program
export const PROGRAM_ID = new PublicKey(
  "11111111111111111111111111111111"
);

// USDC on devnet (Circle's official devnet USDC)
export const USDC_MINT_DEVNET = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
);

// USDC on mainnet
export const USDC_MINT_MAINNET = new PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);

// Platform treasury wallet — replace with your actual Phantom wallet address
export const PLATFORM_TREASURY = new PublicKey(
  "11111111111111111111111111111111"
);

// ─── Config ───────────────────────────────────────────────────────────────────
export const PLATFORM_FEE_BPS = 500; // 5%
export const USDC_DECIMALS = 6;
export const NETWORK = "devnet";

export const RPC_ENDPOINT =
  NETWORK === "devnet"
    ? "https://api.devnet.solana.com"
    : "https://api.mainnet-beta.solana.com";

export const USDC_MINT =
  NETWORK === "devnet" ? USDC_MINT_DEVNET : USDC_MINT_MAINNET;

// ─── Seeds ───────────────────────────────────────────────────────────────────
export const ESCROW_SEED = "escrow";
export const VAULT_SEED = "vault";

// ─── Job Categories ──────────────────────────────────────────────────────────
export const JOB_CATEGORIES = [
  { id: "video", label: "Video Editing", icon: "🎬" },
  { id: "shilling", label: "Coin Shilling", icon: "📢" },
  { id: "moderation", label: "Moderation Team", icon: "🛡️" },
  { id: "development", label: "Web Development", icon: "💻" },
  { id: "design", label: "Design & Art", icon: "🎨" },
  { id: "community", label: "Community Manager", icon: "👥" },
  { id: "copywriting", label: "Copywriting", icon: "✍️" },
  { id: "marketing", label: "Marketing", icon: "🚀" },
  { id: "smartcontract", label: "Smart Contract Dev", icon: "⛓️" },
  { id: "other", label: "Other", icon: "⚡" },
];

// ─── Status Labels ────────────────────────────────────────────────────────────
export const STATUS_LABELS: Record<string, string> = {
  Open: "Open",
  InProgress: "In Progress",
  Completed: "Completed",
  Cancelled: "Cancelled",
  Disputed: "Disputed",
};

export const STATUS_COLORS: Record<string, string> = {
  Open: "#00ff88",
  InProgress: "#f59e0b",
  Completed: "#6366f1",
  Cancelled: "#ef4444",
  Disputed: "#f97316",
};