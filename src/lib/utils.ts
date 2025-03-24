import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth } from "@/../auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getSessionData() {
  const session = await auth();
  return {
    userName: session?.user?.name,
    userMail: session?.user?.email,
    isLoggedIn: !!session,
    isAdmin:
      !!session?.user?.email && session.user.email === "arno.firefox@gmail.com",
  };
}
