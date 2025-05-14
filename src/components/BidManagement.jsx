import React, { useEffect, useState } from 'react';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

const BidManagement = () => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'bids'), (snapshot) => {
      const pendingBids = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((bid) => bid.status === 'pending');
      setBids(pendingBids);
    });
  
    return () => unsubscribe();
  }, []);

  const handleSelect = async (bid) => {
    try {
      // Step 1: Update order with winning bid details
      const orderRef = doc(db, 'orders', bid.orderId);
      await updateDoc(orderRef, {
        fundedBy: bid.investorId,
        fundedAmount: bid.bidAmount,
        status: 'funded'
      });

      // Step 2: Mark this bid as 'won'
      await updateDoc(doc(db, 'bids', bid.id), {
        status: 'won'
      });

      toast.success('Bid selected and order funded!');
    } catch (err) {
      console.error(err);
      toast.error('Error selecting bid');
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Pending Bids</h2>
      {bids.length === 0 ? (
        <p>No pending bids.</p>
      ) : (
        <ul className="space-y-4">
          {bids.map(bid => (
            <li key={bid.id} className="p-4 border rounded shadow">
              <p><strong>Order ID:</strong> {bid.orderId}</p>
              <p><strong>Investor:</strong> {bid.investorId}</p>
              <p><strong>Amount:</strong> ${bid.bidAmount}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => handleSelect(bid)}
              >
                Select as Winning Bid
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BidManagement;
