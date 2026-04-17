import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWallet, useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AnchorProvider } from "@coral-xyz/anchor";
import toast from "react-hot-toast";
import { JOB_CATEGORIES, PLATFORM_FEE_BPS } from "../utils/constants";
import {
  getProgram,
  fetchEscrow,
  acceptJobTx,
  releaseFundsTx,
  cancelEscrowTx,
  raiseDisputeTx,
  lamportsToUsdc,
} from "../utils/escrow";
import { StatusBadge } from "../components/JobCard";

// Demo jobs data matching JobsPage mock
const DEMO_JOB: any = {
  jobId: "demo",
  title: "Demo Crypto Job",
  description: "This is a demo job showing how the escrow system works on Solana. In production, all job data is stored on-chain.",
  category: "video",
  amount: 500_000_000,
  status: { open: {} },
  client: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  freelancer: "11111111111111111111111111111111",
  createdAt: Math.floor(Date.now() / 1000) - 3600,
  platformFee: 25_000_000,
  requirements: "Portfolio of at least 5 crypto videos required. Must have animation experience.",
  deadline: "2024-12-31",
};

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { publicKey, connected, sendTransaction } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  useEffect(() => {
    loadJob();
  }, [jobId, anchorWallet]);

  const loadJob = async () => {
    setLoading(true);
    try {
      if (anchorWallet && jobId && !jobId.startsWith("job_demo")) {
        const provider = new AnchorProvider(connection, anchorWallet, {
          commitment: "confirmed",
        });
        const program = getProgram(provider);
        const onChainJob = await fetchEscrow(program, jobId!);
        if (onChainJob) {
          setJob({ ...onChainJob, jobId });
          return;
        }
      }
      // Fall back to demo data
      setJob({ ...DEMO_JOB, jobId });
    } catch {
      setJob({ ...DEMO_JOB, jobId });
    } finally {
      setLoading(false);
    }
  };

  const runAction = async (action: string, fn: () => Promise<string>) => {
    setActionLoading(action);
    const toastId = toast.loading(`Processing ${action}...`);
    try {
      const sig = await fn();
      toast.success(`${action} successful!`, { id: toastId });
      await loadJob();
      return sig;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || `${action} failed`, { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const handleAcceptJob = () =>
    runAction("Accept Job", async () => {
      if (!anchorWallet || !publicKey) throw new Error("Connect wallet");
      const provider = new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" });
      const program = getProgram(provider);
      const tx = await acceptJobTx(program, publicKey, jobId!);
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      setJob((prev: any) => ({ ...prev, status: { inProgress: {} }, freelancer: publicKey.toString() }));
      return sig;
    });

  const handleReleaseFunds = () =>
    runAction("Release Funds", async () => {
      if (!anchorWallet || !publicKey || !job) throw new Error("Connect wallet");
      const provider = new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" });
      const program = getProgram(provider);
      const tx = await releaseFundsTx(program, publicKey, job.freelancer, jobId!, connection);
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      setJob((prev: any) => ({ ...prev, status: { completed: {} } }));
      return sig;
    });

  const handleCancelEscrow = () =>
    runAction("Cancel Escrow", async () => {
      if (!anchorWallet || !publicKey) throw new Error("Connect wallet");
      const provider = new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" });
      const program = getProgram(provider);
      const tx = await cancelEscrowTx(program, publicKey, jobId!);
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      setJob((prev: any) => ({ ...prev, status: { cancelled: {} } }));
      return sig;
    });

  const handleRaiseDispute = () =>
    runAction("Raise Dispute", async () => {
      if (!anchorWallet || !publicKey || !disputeReason) throw new Error("Provide a reason");
      const provider = new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" });
      const program = getProgram(provider);
      const tx = await raiseDisputeTx(program, publicKey, jobId!, disputeReason);
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      setJob((prev: any) => ({ ...prev, status: { disputed: {} } }));
      setShowDisputeForm(false);
      return sig;
    });

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "4rem", textAlign: "center" }}>
        <span className="spinner"></span>
        <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>Loading job...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container" style={{ paddingTop: "4rem" }}>
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <h3>Job not found</h3>
        </div>
      </div>
    );
  }

  const cat = JOB_CATEGORIES.find((c) => c.id === job.category);
  const usdcAmount = lamportsToUsdc(job.amount);
  const platformFee = usdcAmount * (PLATFORM_FEE_BPS / 10000);
  const freelancerGets = usdcAmount - platformFee;
  const statusKey = Object.keys(job.status)[0];
  const isClient = publicKey?.toString() === job.client?.toString();
  const isFreelancer = publicKey?.toString() === job.freelancer?.toString() && job.freelancer?.toString() !== "11111111111111111111111111111111";

  const date = new Date(job.createdAt * 1000).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div className="two-col">
        {/* Main Content */}
        <div>
          {/* Header */}
          <div className="card" style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <span>{cat?.icon}</span>
                <span>{cat?.label}</span>
              </div>
              <StatusBadge status={job.status} />
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>
              {job.title}
            </h1>

            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.875rem", marginBottom: "1rem" }}>
              {job.description}
            </p>

            {job.requirements && (
              <div style={{ background: "var(--bg-surface)", borderRadius: "var(--radius)", padding: "1rem", marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  Requirements
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {job.requirements}
                </p>
              </div>
            )}

            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              <span>📅 Posted {date}</span>
              {job.deadline && <span>⏰ Deadline: {job.deadline}</span>}
              <span>🔒 Escrow: Active</span>
            </div>
          </div>

          {/* Parties */}
          <div className="card" style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "1rem" }}>
              Parties
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Client</span>
                <span className="wallet-addr">
                  {job.client?.toString()?.slice(0, 8)}...{job.client?.toString()?.slice(-6)}
                  {isClient && <span style={{ color: "var(--accent-green)", marginLeft: "0.5rem" }}>(you)</span>}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Freelancer</span>
                <span className="wallet-addr">
                  {statusKey === "open" ? "Not yet assigned" : (
                    <>
                      {job.freelancer?.toString()?.slice(0, 8)}...{job.freelancer?.toString()?.slice(-6)}
                      {isFreelancer && <span style={{ color: "var(--accent-green)", marginLeft: "0.5rem" }}>(you)</span>}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Dispute Form */}
          {showDisputeForm && (
            <div className="card" style={{ marginBottom: "1rem", border: "1px solid rgba(249,115,22,0.3)" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "1rem", color: "#fb923c" }}>
                ⚠️ Raise Dispute
              </h3>
              <div className="form-group">
                <label className="form-label">Reason for Dispute</label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe the issue clearly..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button className="btn btn-secondary" onClick={() => setShowDisputeForm(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleRaiseDispute}
                  disabled={!disputeReason || actionLoading === "Raise Dispute"}
                >
                  {actionLoading === "Raise Dispute" ? <span className="spinner"></span> : "Submit Dispute"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Escrow Sidebar */}
        <div>
          <div className="escrow-box">
            <div className="escrow-title">
              🔒 Escrow Details
            </div>

            <div className="escrow-amount">
              <div className="escrow-amount-value">${usdcAmount.toFixed(2)}</div>
              <div className="escrow-amount-label">USDC in escrow</div>
            </div>

            <div className="fee-breakdown">
              <div className="fee-row">
                <span>Total locked</span>
                <span>${usdcAmount.toFixed(2)} USDC</span>
              </div>
              <div className="fee-row">
                <span>Platform fee (5%)</span>
                <span>${platformFee.toFixed(2)} USDC</span>
              </div>
              <div className="fee-row total">
                <span>Freelancer receives</span>
                <span>${freelancerGets.toFixed(2)} USDC</span>
              </div>
            </div>

            {/* Escrow status timeline */}
            <div style={{ marginBottom: "1.25rem" }}>
              {[
                { key: "created", label: "Funds Locked", done: true },
                { key: "accepted", label: "Job Accepted", done: ["inProgress", "completed", "disputed"].includes(statusKey) },
                { key: "delivered", label: "Work Delivered", done: ["completed"].includes(statusKey) },
                { key: "paid", label: "Payment Released", done: statusKey === "completed" },
              ].map((step, i) => (
                <div key={step.key} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.4rem 0" }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: step.done ? "var(--accent-green)" : "var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.6rem", color: step.done ? "#050510" : "var(--text-muted)",
                    flexShrink: 0,
                  }}>
                    {step.done ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: "0.78rem", color: step.done ? "var(--text-primary)" : "var(--text-muted)" }}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            {!connected ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                  Connect wallet to interact
                </p>
                <WalletMultiButton />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {/* Freelancer can accept open jobs */}
                {statusKey === "open" && !isClient && (
                  <button
                    className="btn btn-primary"
                    onClick={handleAcceptJob}
                    disabled={actionLoading !== null}
                    style={{ width: "100%" }}
                  >
                    {actionLoading === "Accept Job" ? <><span className="spinner"></span> Accepting...</> : "✅ Accept This Job"}
                  </button>
                )}

                {/* Client can release funds when in progress */}
                {statusKey === "inProgress" && isClient && (
                  <button
                    className="btn btn-primary"
                    onClick={handleReleaseFunds}
                    disabled={actionLoading !== null}
                    style={{ width: "100%" }}
                  >
                    {actionLoading === "Release Funds" ? <><span className="spinner"></span> Releasing...</> : "💸 Approve & Release Funds"}
                  </button>
                )}

                {/* Client can cancel open jobs */}
                {statusKey === "open" && isClient && (
                  <button
                    className="btn btn-danger"
                    onClick={handleCancelEscrow}
                    disabled={actionLoading !== null}
                    style={{ width: "100%" }}
                  >
                    {actionLoading === "Cancel Escrow" ? <><span className="spinner"></span> Cancelling...</> : "❌ Cancel & Refund"}
                  </button>
                )}

                {/* Dispute button for active jobs */}
                {statusKey === "inProgress" && (isClient || isFreelancer) && !showDisputeForm && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDisputeForm(true)}
                    style={{ width: "100%" }}
                  >
                    ⚠️ Raise Dispute
                  </button>
                )}

                {/* Show context for non-participants */}
                {!isClient && !isFreelancer && statusKey !== "open" && (
                  <div style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    This job has already been accepted
                  </div>
                )}

                {statusKey === "completed" && (
                  <div style={{ textAlign: "center", padding: "0.75rem", background: "rgba(0,255,136,0.05)", borderRadius: "var(--radius)", border: "1px solid rgba(0,255,136,0.15)" }}>
                    <div style={{ color: "var(--accent-green)", fontWeight: 700, marginBottom: "0.25rem" }}>✅ Completed</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Funds released on-chain</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Devnet notice */}
          <div className="card" style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            <div style={{ color: "var(--text-secondary)", fontWeight: 700, marginBottom: "0.25rem" }}>🌐 Network: Devnet</div>
            <div>
              This app runs on Solana devnet. Get free devnet SOL at{" "}
              <a href="https://faucet.solana.com" target="_blank" rel="noreferrer" style={{ color: "var(--accent-green)" }}>
                faucet.solana.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;