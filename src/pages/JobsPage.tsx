import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useWallet, useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { JOB_CATEGORIES } from "../utils/constants";
import { getProgram, fetchAllJobs } from "../utils/escrow";
import JobCard from "../components/JobCard";

// Mock jobs for demo when contract not deployed
const MOCK_JOBS = [
  {
    jobId: "job_demo_1",
    title: "Create 3 YouTube Crypto Review Videos",
    description: "Need an experienced crypto video editor to produce 3 high-quality YouTube videos reviewing altcoins. Must include charts, animations, and voiceover.",
    category: "video",
    amount: 500_000_000, // 500 USDC in micro-units
    status: { open: {} },
    client: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    createdAt: Math.floor(Date.now() / 1000) - 3600,
  },
  {
    jobId: "job_demo_2",
    title: "Community Moderator for New DeFi Project",
    description: "Looking for an experienced mod team to manage our Discord (5k+ members). Must be familiar with DeFi, able to handle FUD and scammers 24/7.",
    category: "moderation",
    amount: 1_200_000_000, // 1200 USDC
    status: { inProgress: {} },
    client: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    createdAt: Math.floor(Date.now() / 1000) - 86400,
  },
  {
    jobId: "job_demo_3",
    title: "NFT Collection — 1000 Piece Generative Art",
    description: "Artist needed to design 10 base traits for a Solana NFT collection. Final delivery: layered PNGs + metadata. Full commercial rights transferred.",
    category: "design",
    amount: 3_000_000_000, // 3000 USDC
    status: { open: {} },
    client: "4vJ9JU1bJJE96FWSJKvHsmmFADCg4gpZQff4P3bkLKi",
    createdAt: Math.floor(Date.now() / 1000) - 7200,
  },
  {
    jobId: "job_demo_4",
    title: "Smart Contract Audit — Solana SPL Token",
    description: "Need a thorough audit of our custom SPL token staking contract before mainnet launch. Full written report required, findings fixed within 48h.",
    category: "smartcontract",
    amount: 5_000_000_000, // 5000 USDC
    status: { open: {} },
    client: "BrEqc6zHVR77jrP6M1SCs9CFGS3PWFMiyZS4NKPV8BHY",
    createdAt: Math.floor(Date.now() / 1000) - 1800,
  },
  {
    jobId: "job_demo_5",
    title: "Shill Campaign — New Memecoin Launch",
    description: "Need 10 Twitter influencers to shill our new Solana memecoin on launch day. Must post 3x per account, engage with community. 100k+ followers preferred.",
    category: "shilling",
    amount: 800_000_000, // 800 USDC
    status: { open: {} },
    client: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmkLn7H7g",
    createdAt: Math.floor(Date.now() / 1000) - 10800,
  },
  {
    jobId: "job_demo_6",
    title: "DeFi Landing Page — Next.js + Tailwind",
    description: "Build a clean, fast landing page for our yield farming protocol. Must include TVL counter, APY display, wallet connect. Figma designs provided.",
    category: "development",
    amount: 2_000_000_000, // 2000 USDC
    status: { completed: {} },
    client: "6M5PCGvB7Gg4H5m2tABLdBqMiGDKBvNLCa6vVdGCq3wX",
    createdAt: Math.floor(Date.now() / 1000) - 172800,
  },
];

const JobsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  const [jobs, setJobs] = useState<any[]>(MOCK_JOBS);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");

  // Try to fetch real on-chain jobs
  useEffect(() => {
    if (!anchorWallet) return;
    const provider = new AnchorProvider(connection, anchorWallet, {
      commitment: "confirmed",
    });
    const program = getProgram(provider);
    setLoading(true);
    fetchAllJobs(program)
      .then((onChainJobs) => {
        if (onChainJobs.length > 0) {
          setJobs([...onChainJobs, ...MOCK_JOBS]);
        }
      })
      .finally(() => setLoading(false));
  }, [anchorWallet, connection]);

  const filtered = jobs.filter((job) => {
    if (activeCategory !== "all" && job.category !== activeCategory) return false;
    if (activeStatus !== "all") {
      const statusKey = Object.keys(job.status)[0];
      if (statusKey !== activeStatus) return false;
    }
    if (search && !job.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          Browse <span className="highlight">Crypto Jobs</span>
        </h1>
        <p className="page-subtitle">
          All payments in USDC · Funds locked in escrow until delivery
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          className="form-input"
          placeholder="🔍  Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "400px" }}
        />
      </div>

      {/* Category filters */}
      <div className="filter-bar">
        <button
          className={`filter-chip ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          All Categories
        </button>
        {JOB_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`filter-chip ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Status filters */}
      <div className="filter-bar" style={{ marginBottom: "2rem" }}>
        {["all", "open", "inProgress", "completed"].map((s) => (
          <button
            key={s}
            className={`filter-chip ${activeStatus === s ? "active" : ""}`}
            onClick={() => setActiveStatus(s)}
          >
            {s === "all" ? "All Status" : s === "inProgress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
        {loading ? (
          <span><span className="spinner" style={{ width: 12, height: 12 }}></span> Loading on-chain jobs...</span>
        ) : (
          <span>{filtered.length} job{filtered.length !== 1 ? "s" : ""} found</span>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No jobs found</h3>
          <p>Try a different category or search term</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {filtered.map((job) => (
            <JobCard
              key={job.jobId}
              jobId={job.jobId}
              title={job.title}
              description={job.description}
              category={job.category}
              amount={job.amount}
              status={job.status}
              client={job.client?.toString?.() || job.client}
              createdAt={job.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPage;