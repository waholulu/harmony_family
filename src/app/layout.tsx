import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harmony — Family Communication Coach",
  description: "Resolve family conflicts through empathy and structured communication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
