import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  updateDoc,
  doc,
  onSnapshot,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import BidManagement from "../components/BidManagement";
import RevenueSummary from "../components/RevenueSummary";
import LogoutButton from "../components/LogoutButton";
import { getIdTokenResult } from "firebase/auth";
import { toast } from "react-toastify";
import Logo from "../assets/Svg/logo";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        toast.error("Failed to fetch users: " + error.message);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const checkAdminClaim = async () => {
      const user = auth.currentUser;
      if (user) {
        const tokenResult = await getIdTokenResult(user, true);
        console.log("🔍 User claims:", tokenResult.claims);
      }
    };
    checkAdminClaim();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleApproveClick = (userId) => {
    setSelectedUserId(userId);
    setShowConfirmDialog(true);
  };

  const verifyKYC = async () => {
    if (!selectedUserId) return;
    try {
      await updateDoc(doc(db, "users", selectedUserId), { kycVerified: true });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUserId ? { ...user, kycVerified: true } : user
        )
      );
      toast.success("KYC approved successfully!");
    } catch (error) {
      console.error("Error approving KYC:", error);
      toast.error("Failed to approve KYC.");
    } finally {
      setShowConfirmDialog(false);
      setSelectedUserId(null);
    }
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteDialog(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteDoc(doc(db, "users", userToDelete));
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete)
      );
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    } finally {
      setShowDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md flex justify-center items-center z-50">
          <div
            className="bg-gray-200 p-6 rounded-lg shadow-lg w-96 border border-black"
            style={{ boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px" }}
          >
            <h3 className="text-lg font-semibold mb-4">Confirm KYC Approval</h3>
            <p className="mb-6">
              Are you sure you want to approve this user's KYC?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowConfirmDialog(false);
                  setSelectedUserId(null);
                }}
              >
                No
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={verifyKYC}
              >
                Yes, Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md border border-black flex justify-center items-center z-50">
          <div className="bg-gray-200 p-6 rounded-xl shadow-lg w-96 border border-black">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setUserToDelete(null);
                }}
              >
                No
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={deleteUser}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
            <Logo/>
          <h1 className="text-xl font-bold text-purple-800">Admin Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <LogoutButton />
        </div>
      </header>

      {/* Body */}
      <main className="p-6 space-y-10">
        {/* KYC Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">🔍 KYC Approvals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users?.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow p-5 border border-gray-200"
              >
                <p className="font-medium text-gray-700">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-gray-600">
                  <strong>Role:</strong> {user.role}
                </p>
                <p className="text-gray-600">
                  <strong>KYC Verified:</strong>{" "}
                  <span
                    className={
                      user.kycVerified ? "text-green-600" : "text-red-600"
                    }
                  >
                    {user.kycVerified ? "Yes" : "No"}
                  </span>
                </p>
                <div className="mt-4 space-y-2">
                  {/* Approve KYC (only if not verified) */}
                  {!user.kycVerified && (
                    <button
                      onClick={() => handleApproveClick(user.id)}
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                      Approve KYC
                    </button>
                  )}
                  {/* Delete User (always visible) */}
                  <button
                    onClick={() => handleDeleteClick(user.id)}
                    className="w-full m-auto bg-red-600 text-white py-2 rounded hover:bg-red-700"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bid Management */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">📋 Bid Management</h2>
          <div className="bg-white rounded-lg shadow p-4">
            <BidManagement orders={orders} />
          </div>
        </section>

        {/* Revenue Summary */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">💰 Revenue Summary</h2>
          <div className="bg-white rounded-lg shadow p-4">
            <RevenueSummary orders={orders} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
