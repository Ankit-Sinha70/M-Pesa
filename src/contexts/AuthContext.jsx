import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { createContext, useContext, useEffect, useState } from 'react';
import React  from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); // ✅ wait for Firebase to finish
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children} {/* ✅ only render children when ready */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
