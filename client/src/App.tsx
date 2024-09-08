// React Router DOM Imports
import { HashRouter as Router } from "react-router-dom";

// Components Imports
import AppRouter from "./AppRouter.tsx";

// Context Imports
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "./AuthContext.tsx";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <AppRouter />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
