import React from "react";

const metadata = {
  title: "Scam Protector - Detect Online Scams",
  description: "Using advanced technology to help you avoid online scams and phishing attacks"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is a simple passthrough layout that doesn't add any UI elements
  // The Header and Auth context will be inherited from the parent layout
  return children;
}
