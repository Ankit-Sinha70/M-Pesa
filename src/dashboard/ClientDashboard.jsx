import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogoutButton from "../components/LogoutButton";
import Logo from "../assets/Svg/logo";

const ClientDashboard = () => {
  const [orders, setOrders] = useState([]);
  console.log('orders', orders)
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleConfirmDelivery = async (order) => {
    setProcessingId(order.id);
    try {
      const contractorShare = 0.2 * order.fundedAmount;
      const brokerShare = 0.1 * order.fundedAmount;
      const investorShare = 0.4 * order.fundedAmount;
      const adminShare = 0.3 * order.fundedAmount;

      await updateDoc(doc(db, "orders", order.id), {
        status: "delivered",
        deliveredAt: Timestamp.now(),
        revenueDistributed: true,
      });

      await addDoc(collection(db, "revenues"), {
        orderId: order.id,
        contractorId: order.contractorId,
        brokerId: order.brokerId,
        investorId: order.fundedBy,
        adminId: order.adminId,
        contractorShare,
        brokerShare,
        investorShare,
        adminShare,
        createdAt: Timestamp.now(),
      });

      toast.success("Delivery confirmed and revenue distributed!", {
        position: "top-right",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to confirm delivery", {
        position: "top-right",
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-white ">
      <ToastContainer />
      {/* Header */}
      <header className="bg-white shadow-lg px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Logo/>
          <h1 className="text-xl font-bold text-purple-800">Client Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
         <LogoutButton/>
        </div>
      </header>

      {/* Content */}
      <main className="p-6 max-w-5xl mx-auto">
        <p className="text-gray-600 mb-6">
          Track all orders and status updates in real-time.
        </p>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders to display.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-5 rounded shadow border border-gray-200"
              >
                <p className="text-gray-800 font-semibold mb-1">
                  Order ID: <span className="font-normal">{order.id}</span>
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Description:</strong> {order.description}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Status:</strong>{" "}
                  <span className="capitalize text-blue-600 bg-green-300 p-1.5 rounded-lg text-sm-600 font-medium">
                    {order.status}
                  </span>
                </p>
                {order.fundedAmount && (
                  <p className="text-gray-700 mb-1">
                    <strong>Funded Amount:</strong> ${order.fundedAmount}
                  </p>
                )}
                {order.status === "allocated" && (
                  <button
                    onClick={() => handleConfirmDelivery(order)}
                    disabled={processingId === order.id}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
                  >
                    {processingId === order.id
                      ? "Processing..."
                      : "Confirm Delivery"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>


      
    </div>
  );
};

export default ClientDashboard;
