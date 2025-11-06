import { getDatabase } from "firebase/database";
import { initializeApp, FirebaseOptions } from "firebase/app";
import "firebase/app";
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
} satisfies FirebaseOptions;

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
