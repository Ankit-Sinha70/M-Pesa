/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import CreateOrder from "../components/CreateOrder";
import ChatBox from "../components/ChatBox";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import LogoutButton from "../components/LogoutButton";
import Logo from "../assets/Svg/logo";

const BrokerDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "orders"));
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchOrders();
  }, []);


  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse z-0"
        animate={{ x: [0, 50, -30, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-120px] right-[-80px] w-[350px] h-[350px] bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse z-0"
        animate={{ x: [0, -60, 30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 bg-gradient-to-br from-purple-100 via-pink-50 to-white p-6 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-between"
        >
         <div className="flex items-center space-x-3">
          <Logo/>
         <h1 className="text-2xl font-bold text-purple-800">
            Broker Dashboard
          </h1>
          
         </div>
          <div>
          <LogoutButton/>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10"
        >
          <p className="mt-2 text-gray-700 text-lg">
            Create new orders and assign contractors here.
          </p>
          <CreateOrder />
        </motion.div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Orders
          </h2>

          {orders.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-center"
            >
              No orders found.
            </motion.p>
          ) : (
            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  className="bg-white p-5 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <p className="text-md">
                    <strong>Description:</strong> {order.description}
                  </p>
                  <p className="text-md mt-1">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>

                  {order.status === "pending" && (
                    <div className="mt-4">
                      <ChatBox
                        order={order}
                        showSenderName={true}
                        showTimestamp={true}
                        showRoleLabel={true}
                        storeMessages={true}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BrokerDashboard;
