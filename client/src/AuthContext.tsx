import { createContext, useContext, useState, ReactNode } from "react";

import Cookies from "js-cookie";

// Define the type for the context value
interface AuthContextType {
  authToken: string | null;
  saveToken: (authToken: string) => void;
  clearToken: () => void;
}

// Create the context with an initial value of `null`
const AuthContext = createContext<AuthContextType | null>(null);

// Define the provider props type
interface AuthProviderProps {
  children: ReactNode;
}

// Create a provider component
export default function AuthProvider({ children }: AuthProviderProps) {
  const [authToken, setAuthToken] = useState<string | null>(() => {
    const savedToken = Cookies.get("authToken");
    return savedToken ? savedToken : null;
  });

  // Function to update the auth data
  const saveToken = (token: string) => {
    setAuthToken(token);
    Cookies.set("authToken", token);
  };

  // Function to clear auth data
  const clearToken = () => {
    setAuthToken(null);
    Cookies.remove("authToken");
  };

  return (
    <AuthContext.Provider value={{ authToken, saveToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
