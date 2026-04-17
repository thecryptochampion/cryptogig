import React from "react";
import { Link } from "react-router-dom";
import { JOB_CATEGORIES } from "../utils/constants";

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

      {/* ─── Stats ─────────────────────────────────────────────────────── */}
      <section className="container">
        <div className="stats-row">
          {[
            { value: "$0", label: "Escrowed Today" },
            { value: "5%", label: "Platform Fee" },
            { value: "< 1s", label: "Settlement Time" },
            { value: "USDC", label: "Payment Currency" },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Categories ────────────────────────────────────────────────── */}
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
              <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
                {cat.icon}
              </div>
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
      <section className="container" style={{ padding: "3rem 2rem 5rem" }}>
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
              desc: "Connect your Phantom, Solflare, or Backpack wallet to get started instantly.",
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
              desc: "Client approves → 95% released to freelancer, 5% platform fee. All on Solana.",
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
                  marginBottom: "0.5rem",
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                }}
              >
                {step.step}
              </div>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
                {step.icon}
              </div>
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
    </div>
  );
};

export default HomePage;