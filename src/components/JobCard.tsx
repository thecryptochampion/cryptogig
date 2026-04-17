import React from "react";
import { Link } from "react-router-dom";
import { JOB_CATEGORIES } from "../utils/constants";
import { lamportsToUsdc } from "../utils/escrow";
import BN from "bn.js";

interface JobCardProps {
  jobId: string;
  title: string;
  description: string;
  category: string;
  amount: BN | number;
  status: any;
  client: string;
  createdAt: number;
}

const StatusBadge: React.FC<{ status: any }> = ({ status }) => {
  const key = Object.keys(status)[0];
  const labels: Record<string, string> = {
    open: "OPEN",
    inProgress: "IN PROGRESS",
    completed: "COMPLETED",
    cancelled: "CANCELLED",
    disputed: "DISPUTED",
  };
  const classes: Record<string, string> = {
    open: "badge badge-open",
    inProgress: "badge badge-inprogress",
    completed: "badge badge-completed",
    cancelled: "badge badge-cancelled",
    disputed: "badge badge-disputed",
  };
  return <span className={classes[key] || "badge"}>{labels[key] || key}</span>;
};

const JobCard: React.FC<JobCardProps> = ({
  jobId,
  title,
  description,
  category,
  amount,
  status,
  client,
  createdAt,
}) => {
  const cat = JOB_CATEGORIES.find((c) => c.id === category);
  const usdcAmount = lamportsToUsdc(amount);
  const shortClient = `${client.slice(0, 4)}...${client.slice(-4)}`;
  const date = new Date(createdAt * 1000).toLocaleDateString();

  return (
    <Link to={`/jobs/${jobId}`} className="job-card fade-in">
      <div className="job-card-header">
        <div className="job-category">
          <span>{cat?.icon || "⚡"}</span>
          <span>{cat?.label || category}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      <h3 className="job-title">{title}</h3>
      <p className="job-description">{description}</p>

      <div className="job-footer">
        <div className="job-budget">
          ${usdcAmount.toFixed(2)} <span>USDC</span>
        </div>
        <div className="job-meta">
          <span>👤 {shortClient}</span>
          <span>📅 {date}</span>
        </div>
      </div>
    </Link>
  );
};

export { StatusBadge };
export default JobCard;