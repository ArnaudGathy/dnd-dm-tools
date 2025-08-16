import {
  Geist,
  Geist_Mono,
  MedievalSharp,
  Uncial_Antiqua,
} from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const medievalSharp = MedievalSharp({
  variable: "--font-medieval-sharp",
  subsets: ["latin"],
  weight: "400",
});

const uncialAntiqua = Uncial_Antiqua({
  variable: "--font-uncial-antiqua",
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
        className={`${geistSans.variable} ${geistMono.variable} ${medievalSharp.variable} ${uncialAntiqua.variable} bg-blue`}
      >
        <main className="mx-auto h-dvh max-w-[1497px] p-4 md:p-8">
          {children}
        </main>
      </body>
    </>
  );
}
