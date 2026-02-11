  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { Web3Provider } from "./app/providers/Web3Provider.tsx";
  import { AuthProvider } from "./app/contexts/AuthContext.tsx";
  import { handleGoogleOAuthCallback } from "./app/lib/api";
  import "./styles/index.css";

  // If URL has Google OAuth callback params, store tokens and redirect to app root
  if (!handleGoogleOAuthCallback()) {
    createRoot(document.getElementById("root")!).render(
      <Web3Provider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Web3Provider>
    );
  }
  