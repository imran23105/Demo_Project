import React, { Outlet } from "react";
import { Outlet as RouterOutlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-800 to-secondary-900 flex items-center justify-center p-4">
      <RouterOutlet />
    </div>
  );
}
