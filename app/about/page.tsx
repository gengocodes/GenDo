import React from "react";
import About from "../../src/components/About";

export const metadata = {
  title: "About GenDo | GenDo - Task Management App",
  description:
    "Learn more about GenDo, our mission, values, and what sets us apart as a modern task management solution.",
  openGraph: {
    title: "About GenDo | GenDo - Task Management App",
    description:
      "Learn more about GenDo, our mission, values, and what sets us apart as a modern task management solution.",
    url: "https://gendo-woad.vercel.app/about",
    siteName: "GenDo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About GenDo | GenDo - Task Management App",
    description:
      "Learn more about GenDo, our mission, values, and what sets us apart as a modern task management solution.",
  },
};

export default function AboutPage() {
  return (
    <div className="App">
      <About />
    </div>
  );
}
