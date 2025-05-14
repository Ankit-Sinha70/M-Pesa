import React from "react";
import FundedOrdersList from "../components/FundedOrdersList";
import LogoutButton from "../components/LogoutButton";
import Logo from "../assets/Svg/logo";

const SourcingAgentDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-white ">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Logo/>
          <h1 className="text-xl font-bold text-purple-800">
            Sourcing Agent Dashboard
          </h1>
        </div>
        <LogoutButton />
      </header>

      {/* Content */}
      <main className="p-6 max-w-5xl mx-auto">
        <p className="text-gray-600 mb-6">Allocate items for funded orders.</p>
        <div className="bg-white p-4 rounded shadow">
          <FundedOrdersList />
        </div>
      </main>
    </div>
  );
};

export default SourcingAgentDashboard;
