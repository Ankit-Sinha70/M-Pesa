import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ApprovedOrdersList = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [bidding, setBidding] = useState(null);
  const [bidAmounts, setBidAmounts] = useState({}); // To hold bid amounts per order

  useEffect(() => {
    const fetchApprovedOrders = async () => {
      const q = query(collection(db, 'orders'), where('status', '==', 'approved'));
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchApprovedOrders();
  }, []);

  const handleBidAmountChange = (orderId, value) => {
    setBidAmounts(prev => ({ ...prev, [orderId]: value }));
  };

  const placeBid = async (orderId) => {
    const bidAmount = parseFloat(bidAmounts[orderId]);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      toast.error('Please enter a valid bid amount.');
      return;
    }

    try {
      setBidding(orderId);
      await addDoc(collection(db, 'bids'), {
        orderId,
        investorId: currentUser.uid,
        bidAmount,
        status: 'pending',
        createdAt: new Date()
      });
      toast.success('Bid placed successfully');
      setBidAmounts(prev => ({ ...prev, [orderId]: '' })); // Reset input
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBidding(null);
    }
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-gray-500">No approved orders available for bidding.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="p-4 border rounded shadow">
            <p><strong>Description:</strong> {order.description}</p>
            <p><strong>Broker ID:</strong> {order.brokerId}</p>
            <input
              type="number"
              value={bidAmounts[order.id] || ''}
              onChange={(e) => handleBidAmountChange(order.id, e.target.value)}
              placeholder="Enter your bid amount"
              className="mt-2 border rounded p-2 w-full"
            />
            <button
              onClick={() => placeBid(order.id)}
              disabled={bidding === order.id || !bidAmounts[order.id]}
              className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {bidding === order.id ? 'Placing Bid...' : 'Place Bid'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ApprovedOrdersList;
