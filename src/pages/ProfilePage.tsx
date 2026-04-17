import React from "react";
import { useParams } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";

const ProfilePage: React.FC = () => {
  const { wallet } = useParams<{ wallet: string }>();
  const { publicKey } = useWallet();
  const isOwn = publicKey?.toString() === wallet;

  const shortWallet = wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-6)}` : "";

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "720px" }}>
        {/* Profile header */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-green), var(--accent-purple))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem",
                flexShrink: 0,
              }}
            >
              👤
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  marginBottom: "0.25rem",
                }}
              >
                {isOwn ? "Your Profile" : "Freelancer Profile"}
              </h1>
              <div className="wallet-addr">{wallet}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          {[
            { value: "0", label: "Jobs Completed" },
            { value: "$0", label: "Total Earned" },
            { value: "—", label: "Avg Rating" },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-value" style={{ fontSize: "1.5rem" }}>
                {s.value}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Skills placeholder */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Skills
          </h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {isOwn ? (
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                }}
              >
                No skills added yet. Edit your profile to add skills.
              </div>
            ) : (
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                }}
              >
                This freelancer has not added skills yet.
              </div>
            )}
          </div>
        </div>

        {/* Job history placeholder */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Job History
          </h3>
          <div
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "2rem",
              fontSize: "0.85rem",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📋</div>
            <div>No completed jobs yet.</div>
            <div style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
              All job history is transparent and verifiable on Solana.
            </div>
          </div>
        </div>

        {/* On-chain notice */}
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            <span style={{ fontSize: "1rem", flexShrink: 0 }}>⛓️</span>
            <div>
              <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "0.25rem" }}>
                On-Chain Profile
              </strong>
              This profile is tied to wallet{" "}
              <span className="wallet-addr">{shortWallet}</span>. All completed
              jobs, payments, and reputation are stored transparently on the
              Solana blockchain and cannot be faked or altered.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;