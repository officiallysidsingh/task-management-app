// React Router Imports
import { Outlet } from "react-router-dom";

// Component Imports
import Navbar from "./components/NavBar";

export default function Layout() {
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <div className="w-full">
        <Navbar />
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
