import React, { useState } from "react";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const DeliveryConfirmation = ({ order }) => {
  const [processing, setProcessing] = useState(false);

  const handleDelivery = async () => {
    if (!order || order.status !== "allocated") return;
    setProcessing(true);
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
        adminId: "admin-role",
        contractorShare,
        brokerShare,
        investorShare,
        adminShare,
        createdAt: Timestamp.now(),
      });

      toast.success("Delivery confirmed and revenue distributed.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button
      onClick={handleDelivery}
      disabled={processing || order.status !== "allocated"}
      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      {processing ? "Processing..." : "Confirm Delivery & Distribute Revenue"}
    </button>
  );
};

export default DeliveryConfirmation;
