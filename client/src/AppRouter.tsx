// React Router Imports
import { Route, Routes } from "react-router-dom";

// Page Imports
// Layout
import Layout from "./Layout.tsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
    </Routes>
  );
}
