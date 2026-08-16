import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#0F172A",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                },
                success: {
                  iconTheme: { primary: "#10B981", secondary: "#fff" },
                },
                error: {
                  iconTheme: { primary: "#EF4444", secondary: "#fff" },
                },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
