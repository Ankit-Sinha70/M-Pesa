// components/ChatBox.tsx
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const ChatBox = ({
  order,
  showSenderName = false,
  showTimestamp = false,
  showRoleLabel = false,
  storeMessages = true,
}) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userCache, setUserCache] = useState({});
  const [receiverInfo, setReceiverInfo] = useState(null);
  const bottomRef = useRef(null);
  const bottomRefParent = useRef(null);

  useEffect(() => {
    if (!order?.id || !currentUser?.uid) return;
    const messagesRef = collection(db, "orders", order.id, "chats");
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const results = [];
      const tempCache = { ...userCache };
      let oppositeUserId = null;

      for (const docSnap of snapshot.docs) {
        const msg = docSnap.data();
        results.push({ id: docSnap.id, ...msg });

        const sid = msg.senderId;
        if (sid && !tempCache[sid]) {
          try {
            const userDocSnap = await getDoc(doc(db, "users", sid));
            if (userDocSnap.exists()) {
              const u = userDocSnap.data();
              tempCache[sid] = {
                email: u.email,
                username: u.username || "",
                role: u.role || "",
              };
            }
          } catch (e) {
            console.warn("Failed to fetch user:", sid, e);
          }
        }

        if (!oppositeUserId && sid !== currentUser.uid) {
          oppositeUserId = sid;
        }
      }

      setUserCache(tempCache);
      setMessages(results);
      setReceiverInfo(order?.contractorEmail);
    });

    return () => unsubscribe();
  }, [order?.id, currentUser?.uid]);

  useEffect(() => {
    if (bottomRef?.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      if (storeMessages && currentUser?.uid) {
        await addDoc(collection(db, "orders", order?.id, "chats"), {
          text: newMessage,
          senderId: currentUser?.uid,
          createdAt: Timestamp.now(),
        });
      }
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="mt-6 border rounded-lg shadow-md p-4 bg-white w-full max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-blue-700 mb-2">🗨️ Conversation</h3>

      {receiverInfo && (
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-semibold">Chatting with:</span> {receiverInfo}
        </p>
      )}

<div
  className="max-h-[60vh] overflow-y-auto space-y-3 border p-3 rounded-md bg-gray-50"
  ref={bottomRefParent}
>
<div ref={bottomRef} />
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUser?.uid;
            const senderInfo = userCache[msg.senderId];

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className={`relative max-w-[80%] md:max-w-[60%] break-words px-4 py-2 rounded-lg shadow text-sm ${
                  isCurrentUser
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {showSenderName && senderInfo && (
                  <div className="text-xs font-semibold mb-1">
                    {senderInfo.username || senderInfo.email}
                    {showRoleLabel && senderInfo.role && (
                      <span className="ml-1 text-gray-500">
                        ({senderInfo.role})
                      </span>
                    )}
                  </div>
                )}

<div className="break-words">{msg.text}</div>

                {showTimestamp && msg.createdAt?.toDate && (
                  <div className="text-[10px] text-right mt-1 text-gray-400">
                    {msg.createdAt.toDate().toLocaleString()}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Send
        </motion.button>
      </form>
    </div>
  );
};

export default ChatBox;
