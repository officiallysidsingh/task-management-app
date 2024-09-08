// React Router DOM Imports
import { NavLink, useNavigate } from "react-router-dom";

// Icon Imports
import { CalendarIcon } from "@radix-ui/react-icons";

// Context Import
import { useAuth } from "@/AuthContext";

// ShadCN Imports
import { Button } from "./ui/button";

export default function Navbar() {
  const { authToken, clearToken } = useAuth();

  const navigate = useNavigate();

  // For logging out user
  const handleLogout = () => {
    // Clear auth token from cookies
    clearToken();

    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="bg-primary text-secondary">
      <div className="py-2 px-3 flex justify-between">
        <div className="h-6">
          <CalendarIcon className="h-full w-full" />
        </div>
        <div className="flex justify-center items-center gap-4">
          {!authToken ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "bg-secondary text-primary py-1 px-3 rounded-md"
                    : ""
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive
                    ? "bg-secondary text-primary py-1 px-3 rounded-md"
                    : ""
                }
              >
                Signup
              </NavLink>
            </>
          ) : (
            <Button
              className="bg-red-500 hover:bg-red-400"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
