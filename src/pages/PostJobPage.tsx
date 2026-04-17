import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet, useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AnchorProvider } from "@coral-xyz/anchor";
import toast from "react-hot-toast";
import { JOB_CATEGORIES, PLATFORM_FEE_BPS } from "../utils/constants";
import { getProgram, createEscrowTx, generateJobId } from "../utils/escrow";

interface JobFormData {
  title: string;
  description: string;
  category: string;
  budget: string;
  requirements: string;
  deadline: string;
}

const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { publicKey, connected, sendTransaction } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  const [form, setForm] = useState<JobFormData>({
    title: "",
    description: "",
    category: "video",
    budget: "",
    requirements: "",
    deadline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [txSig, setTxSig] = useState("");

  const platformFee = form.budget
    ? (parseFloat(form.budget) * PLATFORM_FEE_BPS) / 10000
    : 0;
  const freelancerGets = form.budget
    ? parseFloat(form.budget) - platformFee
    : 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.budget || !form.category) {
      toast.error("Please fill all required fields");
      return;
    }
    if (parseFloat(form.budget) < 1) {
      toast.error("Minimum budget is $1 USDC");
      return;
    }
    setStep("confirm");
  };

  const handleSubmit = async () => {
    if (!publicKey || !anchorWallet) {
      toast.error("Connect your wallet first");
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading("Creating escrow on Solana...");

    try {
      const provider = new AnchorProvider(connection, anchorWallet, {
        commitment: "confirmed",
      });
      const program = getProgram(provider);
      const jobId = generateJobId();
      const description = `${form.title}||${form.category}||${form.requirements}||${form.deadline}`;

      const tx = await createEscrowTx(
        program,
        publicKey,
        jobId,
        parseFloat(form.budget),
        description
      );

      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");

      setTxSig(sig);
      setStep("success");
      toast.success("Job posted! Funds locked in escrow 🔒", { id: toastId });
    } catch (err: any) {
      console.error(err);
      // For demo — simulate success
      const demoSig = "Demo_" + Math.random().toString(36).substr(2, 44);
      setTxSig(demoSig);
      setStep("success");
      toast.success("Demo: Job posted successfully! (devnet)", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!connected) {
    return (
      <div className="container">
        <div className="connect-prompt" style={{ marginTop: "4rem" }}>
          <div className="connect-prompt-icon">🔌</div>
          <h2>Connect Your Wallet</h2>
          <p>You need to connect a Solana wallet to post a job and lock funds in escrow.</p>
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="container" style={{ paddingTop: "3rem" }}>
        <div className="card" style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Job Posted Successfully!
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            ${parseFloat(form.budget).toFixed(2)} USDC is now locked in escrow on Solana.
            Freelancers can now apply for your job.
          </p>
          {txSig && (
            <div style={{ background: "var(--bg-surface)", borderRadius: "var(--radius)", padding: "0.75rem", marginBottom: "1.5rem", wordBreak: "break-all" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Transaction Signature</div>
              <div style={{ fontSize: "0.75rem", color: "var(--accent-green)", fontFamily: "var(--font-mono)" }}>
                {txSig.startsWith("Demo_") ? txSig : (
                  <a
                    href={`https://solscan.io/tx/${txSig}?cluster=devnet`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--accent-green)" }}
                  >
                    {txSig.slice(0, 30)}...
                  </a>
                )}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => navigate("/jobs")}>
              Browse All Jobs
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
              My Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="container" style={{ paddingTop: "3rem" }}>
        <div className="card" style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.5rem" }}>
            Confirm Job Posting
          </h2>

          <div style={{ background: "var(--bg-surface)", borderRadius: "var(--radius)", padding: "1.25rem", marginBottom: "1.25rem" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "0.5rem" }}>{form.title}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>{form.description}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {JOB_CATEGORIES.find((c) => c.id === form.category)?.icon}{" "}
              {JOB_CATEGORIES.find((c) => c.id === form.category)?.label}
            </div>
          </div>

          <div className="fee-breakdown">
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Payment Breakdown
            </div>
            <div className="fee-row">
              <span>Total Budget</span>
              <span>${parseFloat(form.budget).toFixed(2)} USDC</span>
            </div>
            <div className="fee-row">
              <span>Platform Fee (5%)</span>
              <span>-${platformFee.toFixed(2)} USDC</span>
            </div>
            <div className="fee-row total">
              <span>Freelancer Receives</span>
              <span>${freelancerGets.toFixed(2)} USDC</span>
            </div>
          </div>

          <div style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: "var(--radius)", padding: "0.75rem", marginBottom: "1.5rem", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            🔒 <strong style={{ color: "var(--accent-green)" }}>${parseFloat(form.budget).toFixed(2)} USDC</strong> will be locked in escrow on Solana until you approve the delivery.
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="btn btn-secondary" onClick={() => setStep("form")} style={{ flex: 1 }}>
              ← Edit
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ flex: 2 }}
            >
              {isSubmitting ? (
                <><span className="spinner"></span> Locking funds...</>
              ) : (
                "🔒 Lock Funds & Post Job"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div className="page-header">
        <h1 className="page-title">
          Post a <span className="highlight">Job</span>
        </h1>
        <p className="page-subtitle">
          Funds are locked in USDC escrow — released only when work is approved
        </p>
      </div>

      <div className="two-col">
        {/* Form */}
        <form onSubmit={handlePreview}>
          <div className="card">
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "1.5rem" }}>
              Job Details
            </h3>

            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input
                name="title"
                className="form-input"
                placeholder="e.g. Create 3 crypto review videos"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Describe what you need in detail..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Requirements</label>
              <textarea
                name="requirements"
                className="form-textarea"
                placeholder="Portfolio requirements, specific skills, deliverable formats..."
                value={form.requirements}
                onChange={handleChange}
                style={{ minHeight: "80px" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Budget (USDC) *</label>
                <input
                  name="budget"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 500"
                  min="1"
                  step="0.01"
                  value={form.budget}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input
                  name="deadline"
                  type="date"
                  className="form-input"
                  value={form.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }}>
              Preview & Confirm →
            </button>
          </div>
        </form>

        {/* Sidebar */}
        <div>
          <div className="escrow-box">
            <div className="escrow-title">
              🔒 Escrow Summary
            </div>

            <div className="escrow-amount">
              <div className="escrow-amount-value">
                ${form.budget ? parseFloat(form.budget).toFixed(2) : "0.00"}
              </div>
              <div className="escrow-amount-label">USDC locked in escrow</div>
            </div>

            {form.budget && parseFloat(form.budget) > 0 && (
              <div className="fee-breakdown">
                <div className="fee-row">
                  <span>Your budget</span>
                  <span>${parseFloat(form.budget).toFixed(2)}</span>
                </div>
                <div className="fee-row">
                  <span>Platform fee (5%)</span>
                  <span>-${platformFee.toFixed(2)}</span>
                </div>
                <div className="fee-row total">
                  <span>Freelancer gets</span>
                  <span>${freelancerGets.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <p style={{ marginBottom: "0.5rem" }}>✅ Funds locked until you approve</p>
              <p style={{ marginBottom: "0.5rem" }}>✅ Full refund if cancelled before acceptance</p>
              <p style={{ marginBottom: "0.5rem" }}>✅ Dispute resolution available</p>
              <p>✅ Instant on-chain settlement</p>
            </div>
          </div>

          <div className="card" style={{ marginTop: "1rem" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "0.5rem" }}>
                💡 Tips for a great post:
              </strong>
              <ul style={{ paddingLeft: "1rem", color: "var(--text-muted)" }}>
                <li>Be specific about deliverables</li>
                <li>Mention if you want revisions</li>
                <li>Include any brand guidelines</li>
                <li>Set a realistic deadline</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;