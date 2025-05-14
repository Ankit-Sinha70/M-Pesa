import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";

const FundedOrdersList = () => {
  const [orders, setOrders] = useState([]);
  console.log('orders', orders)
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(
        collection(db, "orders"),
        where("status", "==", "funded")
      );
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchOrders();
  }, []);

  const handleAllocate = async (id) => {
    setLoadingId(id);
    try {
      await updateDoc(doc(db, "orders", id), { status: "allocated" });
      toast.success("Items allocated successfully");
      setOrders(orders.filter((o) => o.id !== id));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Funded Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No funded orders ready for allocation.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="p-4 border rounded shadow">
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Description:</strong> {order.description}
            </p>
            <p>
              <strong>Funded By:</strong> {order.fundedBy}
            </p>
            <p>
              <strong>Amount:</strong> ${order.fundedAmount}
            </p>
            <button
              onClick={() => handleAllocate(order.id)}
              disabled={loadingId === order.id}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loadingId === order.id ? "Allocating..." : "Allocate Items"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default FundedOrdersList;
