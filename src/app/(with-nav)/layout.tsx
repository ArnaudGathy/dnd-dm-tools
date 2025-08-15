import { NavBar } from "@/components/navbar/NavBar";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function WithNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-y-auto antialiased`}
      >
        <main className="mx-auto max-w-[1450px] p-4 md:p-8">
          <NavBar />
          {children}
        </main>
      </body>
    </>
  );
}
