import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import ChatBox from "../components/ChatBox";
import LogoutButton from "../components/LogoutButton";
import { toast } from "react-toastify";
import Logo from "../assets/Svg/logo";

const ContractorDashboard = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const parsed = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email || "",
          role: data.role || "",
        };
      });
      setUsers(parsed);
      // Find admin and store their id
      const adminUser = parsed.find((user) => user.role === "admin");
      if (adminUser) {
        setAdminId(adminUser.id);
      }
    };

    if (currentUser) fetchUsers();
  }, [currentUser]);

  const getBrokerEmail = (brokerId) => {
    const broker = users.find((user) => user.id === brokerId);
    return broker?.email || brokerId;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "orders"));
      const parsed = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          brokerId: data.brokerId || "",
          contractorEmail: data.contractorEmail || "",
          description: data.description || "",
          status: data.status || "",
          createdAt: data.createdAt?.toDate() || null,
        };
      });
      setOrders(parsed);
    };

    if (currentUser) fetchOrders();
  }, [currentUser]);

  const handleUpdate = async (id, newStatus) => {
    try {
      const orderRef = doc(db, "orders", id);
      const updateData = {
        status: newStatus,
      };

      if (newStatus === "approved") {
        updateData.contractorId = currentUser.uid;
        updateData.adminId = adminId ?? null;
        updateData.approvedAt = Timestamp.now();
      }

      await updateDoc(orderRef, updateData);
      setOrders((prev) => prev.filter((order) => order.id !== id));
      toast.success(
        `Order ${
          newStatus === "approved" ? "approved" : "rejected"
        } successfully`
      );
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update order.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white p-4 sm:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <Logo/>
          <h1 className="text-2xl sm:text-2xl font-bold text-purple-800">
            Contractor Dashboard
          </h1>
         
        </div>
        <LogoutButton />
      </div>

      {/* Orders */}
      <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Review and respond to new orders from brokers.
          </p>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">
          No orders available.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md p-5 border border-purple-100 hover:shadow-lg transition duration-300"
            >
              <p className="text-md text-gray-700">
                <strong>Description:</strong> {order.description}
              </p>
              <p className="text-md text-gray-700 mt-1">
                <strong>From Broker:</strong> {getBrokerEmail(order.brokerId)}
              </p>
              <p className="text-md mt-1">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </p>

              {order.status === "pending" && (
                <>
                  <div className="mt-4">
                    <ChatBox
                      order={order}
                      showSenderName={true}
                      showTimestamp={true}
                      showRoleLabel={true}
                      storeMessages={true}
                    />
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleUpdate(order.id, "approved")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdate(order.id, "rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                      Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractorDashboard;
