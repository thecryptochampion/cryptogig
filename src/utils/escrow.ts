import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { AnchorProvider, Program, BN, web3 } from "@coral-xyz/anchor";
import {
  PROGRAM_ID,
  USDC_MINT,
  PLATFORM_TREASURY,
  ESCROW_SEED,
  VAULT_SEED,
  USDC_DECIMALS,
} from "./constants";
import idl from "../idl/escrow.json";

export const getProgram = (provider: AnchorProvider) => {
  return new Program(idl as any, PROGRAM_ID, provider);
};

export const getEscrowPDA = (jobId: string) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(ESCROW_SEED), Buffer.from(jobId)],
    PROGRAM_ID
  );
};

export const getVaultPDA = (jobId: string) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(VAULT_SEED), Buffer.from(jobId)],
    PROGRAM_ID
  );
};

export const usdcToLamports = (usdc: number): BN => {
  return new BN(Math.floor(usdc * 10 ** USDC_DECIMALS));
};

export const lamportsToUsdc = (lamports: BN | number): number => {
  const val = typeof lamports === "number" ? lamports : lamports.toNumber();
  return val / 10 ** USDC_DECIMALS;
};

export const generateJobId = (): string => {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ─── Create Escrow (Client Posts Job) ────────────────────────────────────────
export const createEscrowTx = async (
  program: Program,
  wallet: PublicKey,
  jobId: string,
  amountUsdc: number,
  description: string
) => {
  const [escrowPDA] = getEscrowPDA(jobId);
  const [vaultPDA] = getVaultPDA(jobId);
  const clientUsdcAccount = await getAssociatedTokenAddress(USDC_MINT, wallet);

  const amountBN = usdcToLamports(amountUsdc);

  const tx = await program.methods
    .createEscrow(jobId, amountBN, description)
    .accounts({
      client: wallet,
      escrow: escrowPDA,
      vault: vaultPDA,
      clientUsdcAccount,
      usdcMint: USDC_MINT,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .transaction();

  return tx;
};

// ─── Accept Job (Freelancer) ──────────────────────────────────────────────────
export const acceptJobTx = async (
  program: Program,
  freelancerWallet: PublicKey,
  jobId: string
) => {
  const [escrowPDA] = getEscrowPDA(jobId);

  const tx = await program.methods
    .acceptJob()
    .accounts({
      freelancer: freelancerWallet,
      escrow: escrowPDA,
    })
    .transaction();

  return tx;
};

// ─── Release Funds (Client Approves Work) ────────────────────────────────────
export const releaseFundsTx = async (
  program: Program,
  clientWallet: PublicKey,
  freelancerWallet: PublicKey,
  jobId: string,
  connection: Connection
) => {
  const [escrowPDA] = getEscrowPDA(jobId);
  const [vaultPDA] = getVaultPDA(jobId);

  const freelancerUsdcAccount = await getAssociatedTokenAddress(
    USDC_MINT,
    freelancerWallet
  );

  // Check if freelancer has a USDC token account, create if not
  const freelancerAccountInfo = await connection.getAccountInfo(
    freelancerUsdcAccount
  );

  const tx = await program.methods
    .releaseFunds()
    .accounts({
      client: clientWallet,
      escrow: escrowPDA,
      vault: vaultPDA,
      freelancerUsdcAccount,
      platformTreasury: PLATFORM_TREASURY,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .transaction();

  // Prepend create ATA instruction if needed
  if (!freelancerAccountInfo) {
    const createAtaIx = createAssociatedTokenAccountInstruction(
      clientWallet,
      freelancerUsdcAccount,
      freelancerWallet,
      USDC_MINT
    );
    tx.instructions.unshift(createAtaIx);
  }

  return tx;
};

// ─── Cancel Escrow (Client Cancels Open Job) ─────────────────────────────────
export const cancelEscrowTx = async (
  program: Program,
  clientWallet: PublicKey,
  jobId: string
) => {
  const [escrowPDA] = getEscrowPDA(jobId);
  const [vaultPDA] = getVaultPDA(jobId);
  const clientUsdcAccount = await getAssociatedTokenAddress(
    USDC_MINT,
    clientWallet
  );

  const tx = await program.methods
    .cancelEscrow()
    .accounts({
      client: clientWallet,
      escrow: escrowPDA,
      vault: vaultPDA,
      clientUsdcAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .transaction();

  return tx;
};

// ─── Raise Dispute ────────────────────────────────────────────────────────────
export const raiseDisputeTx = async (
  program: Program,
  callerWallet: PublicKey,
  jobId: string,
  reason: string
) => {
  const [escrowPDA] = getEscrowPDA(jobId);

  const tx = await program.methods
    .raiseDispute(reason)
    .accounts({
      caller: callerWallet,
      escrow: escrowPDA,
    })
    .transaction();

  return tx;
};

// ─── Fetch Escrow Account Data ────────────────────────────────────────────────
export const fetchEscrow = async (program: Program, jobId: string) => {
  const [escrowPDA] = getEscrowPDA(jobId);
  try {
    const escrow = await (program.account as any).escrow.fetch(escrowPDA);
    return escrow;
  } catch {
    return null;
  }
};

// ─── Fetch All Jobs ───────────────────────────────────────────────────────────
export const fetchAllJobs = async (program: Program) => {
  try {
    const accounts = await (program.account as any).escrow.all();
    return accounts.map((a: any) => ({
      publicKey: a.publicKey,
      ...a.account,
    }));
  } catch {
    return [];
  }
};

// ─── Get USDC Balance ─────────────────────────────────────────────────────────
export const getUsdcBalance = async (
  connection: Connection,
  wallet: PublicKey
): Promise<number> => {
  try {
    const ata = await getAssociatedTokenAddress(USDC_MINT, wallet);
    const balance = await connection.getTokenAccountBalance(ata);
    return parseFloat(balance.value.uiAmountString || "0");
  } catch {
    return 0;
  }
};