import { Geist, Geist_Mono, Russo_One } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const russoOne = Russo_One({
  variable: "--font-russo-one",
  subsets: ["latin"],
  weight: "400",
});

export default async function PlainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${russoOne.variable} bg-chroma`}
      >
        <main className="mx-auto h-dvh max-w-[1497px]">{children}</main>
      </body>
    </>
  );
}
