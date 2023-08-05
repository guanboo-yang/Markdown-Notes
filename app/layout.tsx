import Provider from "@/components/provider";
import "./globals.css";
import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const firaMono = Fira_Code({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-fira-mono",
});

export const metadata: Metadata = {
  title: "Markdown Library",
  description: "Markdown Library",
  icons: {
    icon: {
      url: "/library.svg",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
