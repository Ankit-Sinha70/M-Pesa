import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AdminDashboard from "./dashboard/AdminDashboard";
import ContractorDashboard from "./dashboard/ContractorDashboard";
import BrokerDashboard from "./dashboard/BrokerDashboard";
import InvestorDashboard from "./dashboard/InvestorDashboard";
import SourcingAgentDashboard from "./dashboard/SourcingAgentDashboard";
import ClientDashboard from "./dashboard/ClientDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <>
   
      <AuthProvider>
        <Router>
        <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contractor"
              element={
                <ProtectedRoute>
                  <ContractorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/broker"
              element={
                <ProtectedRoute>
                  <BrokerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/investor"
              element={
                <ProtectedRoute>
                  <InvestorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sourcing-agent"
              element={
                <ProtectedRoute>
                  <SourcingAgentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client"
              element={
                <ProtectedRoute>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}
