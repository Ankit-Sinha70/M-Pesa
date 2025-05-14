import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const RevenueSummary = () => {
  const [revenues, setRevenues] = useState([]);

  useEffect(() => {
    const fetchRevenues = async () => {
      const snapshot = await getDocs(collection(db, 'revenues'));
      setRevenues(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchRevenues();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Revenue Distribution Summary</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Order ID</th>
              <th className="p-2">Contractor</th>
              <th className="p-2">Broker</th>
              <th className="p-2">Investor</th>
              <th className="p-2">Admin</th>
            </tr>
          </thead>
          <tbody>
            {revenues.map(rev => (
              <tr key={rev.id} className="text-center border-t">
                <td className="p-2">{rev.orderId}</td>
                <td className="p-2">${rev.contractorShare.toFixed(2)}</td>
                <td className="p-2">${rev.brokerShare.toFixed(2)}</td>
                <td className="p-2">${rev.investorShare.toFixed(2)}</td>
                <td className="p-2">${rev.adminShare.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueSummary;