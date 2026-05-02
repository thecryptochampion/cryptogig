import React from "react";
import { Link } from "react-router-dom";
import { JOB_CATEGORIES } from "../utils/constants";

const FEATURED_JOBS = [
  {
    jobId: "job_demo_1",
    title: "Create 3 YouTube Crypto Review Videos",
    category: "video",
    icon: "🎬",
    budget: 500,
    status: "OPEN",
    client: "7xKX...3AsU",
  },
  {
    jobId: "job_demo_3",
    title: "NFT Collection — 1000 Piece Generative Art",
    category: "design",
    icon: "🎨",
    budget: 3000,
    status: "OPEN",
    client: "4vJ9...LKi",
  },
  {
    jobId: "job_demo_4",
    title: "Smart Contract Audit — Solana SPL Token",
    category: "smartcontract",
    icon: "⛓️",
    budget: 5000,
    status: "OPEN",
    client: "BrEq...BHY",
  },
];

const TESTIMONIALS = [
  {
    text: "Finally got paid after delivering a full mod team setup. Funds released the second the client approved. No more chasing payments.",
    wallet: "7xKX...3AsU",
    role: "Community Moderator",
    rating: 5,
  },
  {
    text: "Posted a video editing job, locked 500 USDC in escrow instantly. The freelancer delivered on time and payment was automatic. Game changer.",
    wallet: "9WzD...AWWM",
    role: "DeFi Project Owner",
    rating: 5,
  },
  {
    text: "As an NFT artist I've been scammed too many times. CryptoGig's escrow means I start work knowing funds are already locked. Never going back.",
    wallet: "4vJ9...LKi",
    role: "NFT Artist",
    rating: 5,
  },
  {
    text: "Hired a smart contract dev through CryptoGig. Milestone delivered, funds released on-chain in under a second. Insane how fast Solana settles.",
    wallet: "BrEq...BHY",
    role: "Web3 Founder",
    rating: 5,
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        style={{
          color: star <= rating ? "#f59e0b" : "var(--border)",
          fontSize: "0.85rem",
        }}
      >
        ★
      </span>
    ))}
  </div>
);



const HomePage: React.FC = () => {
  return (
    <div>
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <span className="dot-live"></span>
            Built on Solana · Powered by USDC Escrow
          </div>
          <h1 className="hero-title">
            <div>Hire Crypto</div>
            <div className="line-green">Talent. Pay</div>
            <div className="line-dim">On-Chain.</div>
          </h1>
          <p className="hero-desc">
            The first crypto-native freelance marketplace. Connect with video
            editors, community managers, developers and artists — all payments
            locked in USDC escrow until the job's done.
          </p>
          <div className="hero-actions">
            <Link to="/jobs" className="btn btn-primary btn-lg">
              Browse Jobs →
            </Link>
            <Link to="/post-job" className="btn btn-secondary btn-lg">
              Post a Job
            </Link>
          </div>
          <div className="features-row">
            {[
              { icon: "🔒", label: "USDC Escrow Protection" },
              { icon: "⚡", label: "Instant Solana Payments" },
              { icon: "🛡️", label: "Dispute Resolution" },
              { icon: "0%", label: "No Middleman Delays" },
              { icon: "🌐", label: "Crypto-Native Network" },
            ].map((f) => (
              <div className="feature-pill" key={f.label}>
                <span className="icon">{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Live Stats ────────────────────────────────────────────────── */}
      <section className="container">
        <div className="stats-row">
          {[
            { value: "$124,500", label: "USDC Escrowed" },
            { value: "348", label: "Jobs Completed" },
            { value: "< 1s", label: "Settlement Time" },
            { value: "4.9 ★", label: "Platform Rating" },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Jobs ─────────────────────────────────────────────── */}
      <section className="container" style={{ padding: "3rem 2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h2 className="section-heading" style={{ marginBottom: 0 }}>
            Featured <span className="accent">Jobs</span>
          </h2>
          <Link to="/jobs" className="btn btn-secondary btn-sm">
            View All Jobs →
          </Link>
        </div>
        <div className="jobs-grid">
          {FEATURED_JOBS.map((job) => (
            <Link
              key={job.jobId}
              to={`/jobs/${job.jobId}`}
              className="job-card fade-in"
            >
              <div className="job-card-header">
                <div className="job-category">
                  <span>{job.icon}</span>
                  <span>{job.category}</span>
                </div>
                <span className="badge badge-open">{job.status}</span>
              </div>
              <h3 className="job-title">{job.title}</h3>
              <div className="job-footer">
                <div className="job-budget">
                  ${job.budget.toLocaleString()} <span>USDC</span>
                </div>
                <div className="job-meta">
                  <span>👤 {job.client}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Why Solana ────────────────────────────────────────────────── */}
      <section className="container" style={{ padding: "3rem 2rem" }}>
        <h2 className="section-heading">
          Why <span className="accent">Solana</span>
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            {
              icon: "⚡",
              title: "Sub-Second Settlement",
              desc: "Payments release in under 400ms. No waiting days for bank transfers or blockchain confirmations.",
            },
            {
              icon: "💰",
              title: "Near-Zero Fees",
              desc: "Transaction fees under $0.001. Every cent goes to the freelancer, not gas fees.",
            },
            {
              icon: "🔒",
              title: "Trustless Escrow",
              desc: "Funds held by code, not a company. No platform can freeze, reverse or steal your payment.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="card"
              style={{ borderTop: "2px solid var(--accent-green)" }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                {item.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "var(--text-primary)",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Testimonials + Rating ─────────────────────────────────────── */}
      <section
        style={{
          background: "var(--bg-card)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "4rem 0",
          margin: "2rem 0",
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                fontSize: "4rem",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color: "var(--accent-green)",
                lineHeight: 1,
              }}
            >
              4.9
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "4px",
                margin: "0.5rem 0",
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ color: "#f59e0b", fontSize: "1.5rem" }}>
                  ★
                </span>
              ))}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Based on 348 completed jobs
            </div>
            <h2 className="section-heading" style={{ marginTop: "1.5rem", marginBottom: 0 }}>
              What Our <span className="accent">Community Says</span>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="card"
                style={{ background: "var(--bg-elevated)", position: "relative" }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    color: "var(--accent-green)",
                    opacity: 0.3,
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    fontFamily: "serif",
                    lineHeight: 1,
                  }}
                >
                  "
                </div>
                <StarRating rating={t.rating} />
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    margin: "0.75rem 0",
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </p>
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    paddingTop: "0.75rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span className="wallet-addr">{t.wallet}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    {t.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── For Clients vs Freelancers ────────────────────────────────── */}
      <section className="container" style={{ padding: "3rem 2rem" }}>
        <h2 className="section-heading">
          Built for <span className="accent">Everyone</span>
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div className="card" style={{ borderTop: "2px solid var(--accent-green)" }}>
            <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>💼</div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                fontWeight: 800,
                marginBottom: "1rem",
                color: "var(--accent-green)",
              }}
            >
              For Clients
            </h3>
            {[
              "Post a job in under 2 minutes",
              "Funds locked — only released when you approve",
              "Cancel and get full refund before work starts",
              "Raise disputes if delivery doesn't match specs",
              "Access crypto-native talent worldwide",
              "No KYC or bank account required",
            ].map((point) => (
              <div
                key={point}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  marginBottom: "0.6rem",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ color: "var(--accent-green)", flexShrink: 0 }}>✓</span>
                {point}
              </div>
            ))}
            <Link to="/post-job" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
              Post a Job
            </Link>
          </div>

          <div className="card" style={{ borderTop: "2px solid var(--accent-purple)" }}>
            <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>🧑‍💻</div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                fontWeight: 800,
                marginBottom: "1rem",
                color: "#a78bfa",
              }}
            >
              For Freelancers
            </h3>
            {[
              "Browse open jobs across 10 crypto categories",
              "Funds already locked before you start work",
              "Get paid in USDC — no conversion needed",
              "Payment releases in under a second on Solana",
              "Build your on-chain reputation over time",
              "Work pseudonymously — no KYC required",
            ].map((point) => (
              <div
                key={point}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  marginBottom: "0.6rem",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ color: "#a78bfa", flexShrink: 0 }}>✓</span>
                {point}
              </div>
            ))}
            <Link to="/jobs" className="btn btn-purple" style={{ width: "100%", marginTop: "1rem" }}>
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Browse by Category ────────────────────────────────────────── */}
      <section className="container" style={{ padding: "3rem 2rem" }}>
        <h2 className="section-heading">
          Browse by <span className="accent">Category</span>
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {JOB_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/jobs?category=${cat.id}`}
              className="card"
              style={{ textDecoration: "none", textAlign: "center", padding: "1.25rem 1rem" }}
            >
              <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{cat.icon}</div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {cat.label}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────────── */}
      <section className="container" style={{ padding: "3rem 2rem" }}>
        <h2 className="section-heading">
          How <span className="accent">It Works</span>
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            {
              step: "01",
              title: "Connect Wallet",
              desc: "Connect your Phantom wallet to get started instantly. No KYC, no bank account, no borders.",
              icon: "👛",
            },
            {
              step: "02",
              title: "Post or Find a Job",
              desc: "Post what you need with USDC budget locked into on-chain escrow, or browse open gigs.",
              icon: "📋",
            },
            {
              step: "03",
              title: "Work Gets Done",
              desc: "Freelancer accepts, completes the work. Funds are safely locked until delivery.",
              icon: "⚙️",
            },
            {
              step: "04",
              title: "Release & Get Paid",
              desc: "Client approves → 95% released to freelancer, 5% platform fee. All on Solana in under a second.",
              icon: "💸",
            },
          ].map((step) => (
            <div key={step.step} className="card" style={{ position: "relative" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "3rem",
                  fontWeight: 800,
                  color: "var(--border-bright)",
                  lineHeight: 1,
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                }}
              >
                {step.step}
              </div>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{step.icon}</div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(124,58,237,0.05) 100%)",
          border: "1px solid var(--border)",
          borderLeft: "none",
          borderRight: "none",
          padding: "5rem 2rem",
          textAlign: "center",
          margin: "2rem 0 0",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              background: "rgba(0,255,136,0.05)",
              border: "1px solid rgba(0,255,136,0.2)",
              borderRadius: "100px",
              fontSize: "0.75rem",
              color: "var(--accent-green)",
              marginBottom: "1.5rem",
              letterSpacing: "0.05em",
            }}
          >
            <span className="dot-live"></span>
            Live on Solana Devnet
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              fontWeight: 800,
              marginBottom: "1rem",
              lineHeight: 1.1,
            }}
          >
            Ready to hire or get hired?
            <br />
            <span style={{ color: "var(--accent-green)" }}>
              Connect your wallet and start.
            </span>
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              maxWidth: "480px",
              margin: "0 auto 2rem",
            }}
          >
            No sign up. No KYC. No bank account. Just your Phantom wallet and a job to get done.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/jobs" className="btn btn-primary btn-lg">Browse Jobs →</Link>
            <Link to="/post-job" className="btn btn-secondary btn-lg">Post a Job</Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border)",
          padding: "3rem 2rem",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: "linear-gradient(135deg, var(--accent-green), var(--accent-purple))",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  ⚡
                </div>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem" }}>
                  Crypto<span style={{ color: "var(--accent-green)" }}>Gig</span>
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: "220px" }}>
                The first crypto-native freelance marketplace. Trustless USDC escrow on Solana.
              </p>
            </div>

            {/* Product */}
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                  marginBottom: "0.75rem",
                }}
              >
                Product
              </div>
              <Link to="/jobs" style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "0.4rem" }}>Browse Jobs</Link>
              <Link to="/post-job" style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "0.4rem" }}>Post a Job</Link>
              <Link to="/dashboard" style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "0.4rem" }}>Dashboard</Link>
            </div>

            {/* Built With */}
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                  marginBottom: "0.75rem",
                }}
              >
                Built With
              </div>
              <a href="https://solana.com" target="_blank" rel="noreferrer" style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "0.4rem" }}>Solana Blockchain</a>
              <a href="https://anchor-lang.com" target="_blank" rel="noreferrer" style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "0.4rem" }}>Anchor Framework</a>
              <a href="https://circle.com" target="_blank" rel="noreferrer" style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "0.4rem" }}>Circle USDC</a>
              <a href="https://phantom.app" target="_blank" rel="noreferrer" style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "0.4rem" }}>Phantom Wallet</a>
            </div>

            {/* Links */}
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                  marginBottom: "0.75rem",
                }}
              >
                Links
              </div>
              <a href="https://github.com/thecryptochampion/cryptogig" target="_blank" rel="noreferrer" style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "0.4rem" }}>GitHub</a>
              <a href="https://solscan.io/?cluster=devnet" target="_blank" rel="noreferrer" style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "0.4rem" }}>Solscan (Devnet)</a>
              <a href="https://colosseum.org" target="_blank" rel="noreferrer" style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "0.4rem" }}>Solana Hackathon</a>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              © 2026 CryptoGig · Built for Solana Frontier Hackathon
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "0.2rem 0.5rem",
                  background: "rgba(0,255,136,0.05)",
                  border: "1px solid rgba(0,255,136,0.15)",
                  borderRadius: "4px",
                  color: "var(--accent-green)",
                }}
              >
                Solana Devnet
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "0.2rem 0.5rem",
                  background: "rgba(39,117,202,0.05)",
                  border: "1px solid rgba(39,117,202,0.2)",
                  borderRadius: "4px",
                  color: "#60a5fa",
                }}
              >
                USDC Payments
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;