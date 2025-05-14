import React from "react";
import ApprovedOrdersList from "../components/ApprovedOrdersList";
import LogoutButton from "../components/LogoutButton";
import Logo from "../assets/Svg/logo";

const InvestorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Logo />
          <h1 className="text-xl font-bold text-purple-800">
            Investor Dashboard
          </h1>
        </div>
        <LogoutButton />
      </header>

      {/* Main content */}
      <main className="p-6 max-w-5xl mx-auto">
        <p className="text-gray-600 mb-6">
          View approved orders and place your bid.
        </p>
        <div className="bg-white rounded shadow p-4">
          <ApprovedOrdersList />
        </div>
      </main>
    </div>
  );
};

export default InvestorDashboard;
