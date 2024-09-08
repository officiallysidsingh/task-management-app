// React Router Imports
import { Outlet } from "react-router-dom";

// Component Imports
import Navbar from "./components/NavBar";

// Toast Imports
import { Toaster } from "sonner";

export default function Layout() {
  return (
    <div className="flex flex-col h-dvh">
      <div className="w-full">
        <Toaster position="top-center" richColors />
        <Navbar />
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
