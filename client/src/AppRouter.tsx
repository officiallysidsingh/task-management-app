// React Router Imports
import { Route, Routes } from "react-router-dom";

// Page Imports
// Protected Routes
import ProtectedRoutes from "./pages/protected/ProtectedRoutes.tsx";

// Layout
import Layout from "./Layout.tsx";

// 404 Not Found
import NotFoundPage from "./pages/404/NotFoundPage.tsx";

// Auth
import LoginPage from "./pages/auth/LoginPage.tsx";
import SignupPage from "./pages/auth/SignupPage.tsx";

// Home
import HomePage from "./pages/home/HomePage.tsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<ProtectedRoutes />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
