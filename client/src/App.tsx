// React Router DOM Imports
import { HashRouter as Router } from "react-router-dom";

// Components Imports
import AppRouter from "./AppRouter.tsx";

// Context Imports
import AuthProvider from "./AuthContext.tsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRouter />
      </Router>
    </AuthProvider>
  );
}

export default App;
