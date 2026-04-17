import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWallet, useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AnchorProvider } from "@coral-xyz/anchor";
import { getProgram, fetchAllJobs, getUsdcBalance, lamportsToUsdc } from "../utils/escrow";
import { StatusBadge } from "../components/JobCard";
import { JOB_CATEGORIES } from "../utils/constants";

// Mock dashboard data
const MOCK_CLIENT_JOBS = [
  {
    jobId: "job_demo_1",
    title: "Create 3 YouTube Crypto Review Videos",
    category: "video",
    amount: 500_000_000,
    status: { open: {} },
    client: "YOUR_WALLET",
    createdAt: Math.floor(Date.now() / 1000) - 3600,
  },
  {
    jobId: "job_demo_6",
    title: "DeFi Landing Page — Next.js + Tailwind",
    category: "development",
    amount: 2_000_000_000,
    status: { completed: {} },
    client: "YOUR_WALLET",
    createdAt: Math.floor(Date.now() / 1000) - 172800,
  },
];

const MOCK_FREELANCER_JOBS = [
  {
    jobId: "job_demo_2",
    title: "Community Moderator for New DeFi Project",
    category: "moderation",
    amount: 1_200_000_000,
    status: { inProgress: {} },
    client: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    createdAt: Math.floor(Date.now() / 1000) - 86400,
  },
];

const DashboardPage: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  const [tab, setTab] = useState<"posted" | "working" | "completed">("posted");
  const [usdcBalance, setUsdcBalance] = useState<number>(0);
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [workingJobs, setWorkingJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey || !connected) return;
    loadDashboard();
  }, [publicKey, connected, anchorWallet]);

  const loadDashboard = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const balance = await getUsdcBalance(connection, publicKey);
      setUsdcBalance(balance);

      if (anchorWallet) {
        const provider = new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" });
        const program = getProgram(provider);
        const allJobs = await fetchAllJobs(program);
        const walletStr = publicKey.toString();
        setPostedJobs(allJobs.filter((j: any) => j.client?.toString() === walletStr));
        setWorkingJobs(allJobs.filter((j: any) => j.freelancer?.toString() === walletStr));
      } else {
        // Demo data
        setPostedJobs(MOCK_CLIENT_JOBS);
        setWorkingJobs(MOCK_FREELANCER_JOBS);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="container">
        <div className="connect-prompt" style={{ marginTop: "4rem" }}>
          <div className="connect-prompt-icon">📊</div>
          <h2>Connect to View Dashboard</h2>
          <p>Connect your Solana wallet to see your posted jobs, active work, and earnings.</p>
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  const totalEscrowed = postedJobs
    .filter((j) => !("completed" in j.status) && !("cancelled" in j.status))
    .reduce((sum, j) => sum + lamportsToUsdc(j.amount), 0);

  const totalEarned = workingJobs
    .filter((j) => "completed" in j.status)
    .reduce((sum, j) => sum + lamportsToUsdc(j.amount) * 0.95, 0);

  const activeJobs = workingJobs.filter((j) => "inProgress" in j.status);

  const displayJobs = tab === "posted"
    ? postedJobs
    : tab === "working"
    ? workingJobs
    : [...postedJobs, ...workingJobs].filter((j) => "completed" in j.status);

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="wallet-addr" style={{ display: "inline-block" }}>
          {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row" style={{ marginBottom: "2rem" }}>
        <div className="stat-card">
          <div className="stat-value">${usdcBalance.toFixed(2)}</div>
          <div className="stat-label">USDC Balance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${totalEscrowed.toFixed(2)}</div>
          <div className="stat-label">In Escrow</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activeJobs.length}</div>
          <div className="stat-label">Active Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${totalEarned.toFixed(2)}</div>
          <div className="stat-label">Total Earned</div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
        <Link to="/post-job" className="btn btn-primary">
          + Post New Job
        </Link>
        <Link to="/jobs" className="btn btn-secondary">
          Browse Open Jobs
        </Link>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${tab === "posted" ? "active" : ""}`}
          onClick={() => setTab("posted")}
        >
          Posted Jobs ({postedJobs.length})
        </button>
        <button
          className={`tab-btn ${tab === "working" ? "active" : ""}`}
          onClick={() => setTab("working")}
        >
          My Work ({workingJobs.length})
        </button>
        <button
          className={`tab-btn ${tab === "completed" ? "active" : ""}`}
          onClick={() => setTab("completed")}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <span className="spinner"></span>
        </div>
      ) : displayJobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            {tab === "posted" ? "📋" : tab === "working" ? "⚙️" : "✅"}
          </div>
          <h3>
            {tab === "posted"
              ? "No jobs posted yet"
              : tab === "working"
              ? "No active work"
              : "No completed jobs"}
          </h3>
          <p style={{ marginBottom: "1rem" }}>
            {tab === "posted"
              ? "Post your first job and lock funds in escrow"
              : "Browse open jobs to start earning USDC"}
          </p>
          {tab === "posted" ? (
            <Link to="/post-job" className="btn btn-primary">Post a Job</Link>
          ) : (
            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {displayJobs.map((job) => {
            const cat = JOB_CATEGORIES.find((c) => c.id === job.category);
            const usdcAmount = lamportsToUsdc(job.amount);
            return (
              <Link
                key={job.jobId}
                to={`/jobs/${job.jobId}`}
                className="card"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.85rem" }}>{cat?.icon}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>{job.title}</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {new Date(job.createdAt * 1000).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <StatusBadge status={job.status} />
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent-green)" }}>
                    ${usdcAmount.toFixed(2)}{" "}
                    <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}>
                      USDC
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;