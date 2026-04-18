import React, { FC, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { Toaster } from "react-hot-toast";
import { RPC_ENDPOINT } from "./utils/constants";
import App from "./App";
import "./index.css";

require("@solana/wallet-adapter-react-ui/styles.css");

const Root: FC = () => {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <App />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#0d0d1a",
                  color: "#e2e8f0",
                  border: "1px solid #1e293b",
                  fontFamily: "'Space Mono', monospace",
                },
                success: { iconTheme: { primary: "#00ff88", secondary: "#0d0d1a" } },
                error: { iconTheme: { primary: "#ef4444", secondary: "#0d0d1a" } },
              }}
            />
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<Root />);