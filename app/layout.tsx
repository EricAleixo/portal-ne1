import type { Metadata } from "next";
import { Toaster } from "react-hot-toast"
import "./globals.css";
import '@uiw/react-md-editor/markdown-editor.css';

export const metadata: Metadata = {
  title: "Portal - NE1",
  description: "Notícias atualizadas e em tempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`antialiased`}
      >
        {children}
        <Toaster position="top-right"/>
      </body>
    </html>
  );
}
