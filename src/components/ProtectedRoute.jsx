import React, { useEffect, useState } from "react";

import { auth } from "../firebase/config.js";
import { onAuthStateChanged } from "firebase/auth";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ProtectedRoute = ({ children }) => {
  const navigate =useNavigate()
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);
    
  },[]);

  return () => unsubscribe();
}, []);
  if (loading) {
    return (
      <>
  
<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
  

  <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 border-r-indigo-600"></div>
  
 
  <p className="mt-4 text-sm font-medium tracking-wide text-slate-500 animate-pulse font-sans">
    Please wait...
  </p>
  
</div>

      </>
    );
  }
  if (user) {
    return children;
  } else {
    navigate("/login")
  }
};
