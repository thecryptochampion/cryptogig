import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { getUsdcBalance } from "../utils/escrow";

const Navbar: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey || !connected) { setUsdcBalance(null); return; }
    getUsdcBalance(connection, publicKey).then(setUsdcBalance);
    const interval = setInterval(() => {
      getUsdcBalance(connection, publicKey).then(setUsdcBalance);
    }, 15000);
    return () => clearInterval(interval);
  }, [publicKey, connected, connection]);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="logo-icon">⚡</div>
        <div className="logo-text">
          Crypto<span>Gig</span>
        </div>
      </Link>

      <ul className="navbar-links">
        <li><NavLink to="/jobs">Browse Jobs</NavLink></li>
        <li><NavLink to="/post-job">Post a Job</NavLink></li>
        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
      </ul>

      <div className="navbar-right">
        {connected && usdcBalance !== null && (
          <div className="usdc-balance">
            <span>💰</span>
            <span>{usdcBalance.toFixed(2)} USDC</span>
          </div>
        )}
        <WalletMultiButton />
      </div>
    </nav>
  );
};

export default Navbar;