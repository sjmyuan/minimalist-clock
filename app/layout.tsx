import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minimalist Clock",
  description: "A beautiful minimalist clock with customizable appearance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
