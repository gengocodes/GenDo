import React from "react";
import { Settings } from "../../src/components/Settings";
import ProtectedRoute from "../../src/components/ProtectedRoute";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="App">
        <Settings />
      </div>
    </ProtectedRoute>
  );
}
