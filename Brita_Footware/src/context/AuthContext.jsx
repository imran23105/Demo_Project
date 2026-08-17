import React, { createContext, useContext, useState, useEffect } from "react";
import { DEMO_CUSTOMER, DEMO_ADMIN } from "../utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem("brita_customer");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem("brita_admin");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const customerLogin = (email, password) => {
    if (email === DEMO_CUSTOMER.email && password === DEMO_CUSTOMER.password) {
      setCustomer(DEMO_CUSTOMER);
      localStorage.setItem("brita_customer", JSON.stringify(DEMO_CUSTOMER));
      return { success: true };
    }
    return { success: false, error: "Invalid credentials. Use customer@brita-demo.com / demo123" };
  };

  const customerLogout = () => {
    setCustomer(null);
    localStorage.removeItem("brita_customer");
  };

  const adminLogin = (email, password) => {
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      setAdmin(DEMO_ADMIN);
      localStorage.setItem("brita_admin", JSON.stringify(DEMO_ADMIN));
      return { success: true };
    }
    return { success: false, error: "Invalid credentials. Use owner@brita-demo.com / demo123" };
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem("brita_admin");
  };

  return (
    <AuthContext.Provider value={{ customer, admin, customerLogin, customerLogout, adminLogin, adminLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
