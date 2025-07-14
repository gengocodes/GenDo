import React from "react";
import Auth from "../../src/components/Auth";

export const metadata = {
  title: "Login | GenDo - Task Management App",
  description:
    "Sign in to your GenDo account to manage your tasks and boost your productivity.",
  openGraph: {
    title: "Login | GenDo - Task Management App",
    description:
      "Sign in to your GenDo account to manage your tasks and boost your productivity.",
    url: "https://gendo-woad.vercel.app/login",
    siteName: "GenDo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | GenDo - Task Management App",
    description:
      "Sign in to your GenDo account to manage your tasks and boost your productivity.",
  },
};

export default function LoginPage() {
  return (
    <div>
      <Auth />
    </div>
  );
}
