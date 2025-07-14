import React from "react";
import LandingPage from "../src/components/LandingPage";

export const metadata = {
  title: "GenDo - Task Management App",
  description:
    "GenDo is a modern task management application to help you stay organized and boost productivity. Simple, powerful, and secure.",
  openGraph: {
    title: "GenDo - Task Management App",
    description:
      "GenDo is a modern task management application to help you stay organized and boost productivity. Simple, powerful, and secure.",
    url: "https://gendo-woad.vercel.app/",
    siteName: "GenDo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GenDo - Task Management App",
    description:
      "GenDo is a modern task management application to help you stay organized and boost productivity. Simple, powerful, and secure.",
  },
};

export default function Home() {
  return (
    <div className="App">
      <LandingPage />
    </div>
  );
}
