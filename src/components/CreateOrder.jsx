/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const CreateOrder = () => {
  const { currentUser } = useAuth();
  const [contractorEmail, setContractorEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = {
        brokerId: currentUser.uid,
        contractorEmail,
        description,
        status: "pending",
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(db, "orders"), order);
      toast.success("🎉 Order created and sent to contractor");
      setContractorEmail("");
      setDescription("");
    } catch (error) {
      toast.error(`❌ ${error.message || "Something went wrong"}`);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 p-4 mt-5"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl border border-blue-100 transition-all"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-700 animate-pulse">
          🚀 Create New Order
        </h2>

        <input
          type="email"
          placeholder="Contractor Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
          value={contractorEmail}
          onChange={(e) => setContractorEmail(e.target.value)}
          required
        />

        <textarea
          placeholder="Order Description"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.03 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 disabled:opacity-70"
        >
          {loading ? "Submitting..." : "✨ Submit Order"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateOrder;
