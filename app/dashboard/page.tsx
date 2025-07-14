import React from "react";
import Dashboard from "../../src/components/Dashboard";
import ProtectedRoute from "../../src/components/ProtectedRoute";

export const metadata = {
  title: "Dashboard | GenDo - Task Management App",
  description:
    "View and manage your tasks on your GenDo dashboard. Stay organized and productive with real-time updates.",
  openGraph: {
    title: "Dashboard | GenDo - Task Management App",
    description:
      "View and manage your tasks on your GenDo dashboard. Stay organized and productive with real-time updates.",
    url: "https://gendo-woad.vercel.app/dashboard",
    siteName: "GenDo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard | GenDo - Task Management App",
    description:
      "View and manage your tasks on your GenDo dashboard. Stay organized and productive with real-time updates.",
  },
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="App">
        <Dashboard />
      </div>
    </ProtectedRoute>
  );
}
