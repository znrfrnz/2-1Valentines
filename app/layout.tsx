import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BSIT 2-1's Valentine's Wall",
  description: "Send a sweet note to someone special",
  icons: {
    icon: "/Ka21nanLogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Lilita+One&family=Fredoka:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
