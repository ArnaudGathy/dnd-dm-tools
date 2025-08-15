import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "D&D - Dungeon Master tools",
  description: "A toolkit for DnD DMs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en">{children}</html>;
}
