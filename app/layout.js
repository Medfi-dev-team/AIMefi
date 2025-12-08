import "./globals.css";

export const metadata = {
  title: "Joshua Smith AI - Medical Assistant",
  description:
    "Your trusted AI medical information assistant. Get reliable health information with Joshua Smith AI.",
  keywords:
    "medical assistant, AI health, Joshua Smith, healthcare information",
  authors: [{ name: "Joshua Smith AI" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#667eea",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
