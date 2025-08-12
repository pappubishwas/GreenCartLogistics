import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import DriversMgmt from "./pages/DriversMgmt";
import RoutesMgmt from "./pages/RoutesMgmt";
import OrdersMgmt from "./pages/OrdersMgmt";
import ProtectedRoute from "./components/ProtectedRoute";
import { setToken } from "./services/api";
import { Menu, X } from "lucide-react"; 

export default function App() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("gc_token");
    if (t) setToken(t);
  }, []);

  function logout() {
    localStorage.removeItem("gc_token");
    setToken(null);
    navigate("/login");
  }

  const navLinks = [
    { path: "/", label: "Dashboard" },
    { path: "/simulation", label: "Simulation" },
    { path: "/drivers", label: "Drivers" },
    { path: "/routes", label: "Routes" },
    { path: "/orders", label: "Orders" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-green-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-14 items-center">
            {/* Logo */}
            <h1 className="text-white font-bold text-lg tracking-wide">
              GreenCart Manager
            </h1>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map(({ path, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? "bg-green-800 text-white"
                        : "text-green-100 hover:bg-green-700 hover:text-white"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white focus:outline-none"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-green-700 px-4 pb-3 space-y-2">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-green-900 text-white"
                      : "text-green-100 hover:bg-green-800 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="w-full text-left bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route
            path="/login"
            element={<LoginForm onLogin={() => navigate("/")} />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulation"
            element={
              <ProtectedRoute>
                <Simulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drivers"
            element={
              <ProtectedRoute>
                <DriversMgmt />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routes"
            element={
              <ProtectedRoute>
                <RoutesMgmt />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersMgmt />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t py-3 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} GreenCart Manager. All rights reserved.
      </footer>
    </div>
  );
}
