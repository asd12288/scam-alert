import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is a simple passthrough layout that doesn't add any UI elements
  // The Header and Auth context will be inherited from the parent layout
  return children;
}
