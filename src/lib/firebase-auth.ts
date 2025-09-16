import dayjs from "dayjs";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
  sendEmailVerification,
  User
} from "firebase/auth";
export { AuthErrorCodes, linkWithCredential } from "firebase/auth";
import { getStorage } from "firebase/storage";
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const storage = getStorage(app);

export const auth = getAuth(app);
auth.useDeviceLanguage();

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function sendVerification(user: User) {
  return sendEmailVerification(user);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export async function removeUser() {
  if (auth.currentUser) {
    return deleteUser(auth.currentUser);
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    console.log("Starting Google sign-in process...");
    const result = await signInWithPopup(auth, provider);
    console.log("Google sign-in successful:", result.user.email);
    return result;
  } catch (error: any) {
    console.error("Sign-in failed with error:", {
      code: error.code,
      message: error.message,
      email: error.email,
      credential: error.credential
    });
    
    // Handle specific error cases
    if (error.code === 'auth/popup-closed-by-user') {
      console.log("Popup was closed by user");
    } else if (error.code === 'auth/popup-blocked') {
      console.log("Popup was blocked by browser");
    } else if (error.code === 'auth/cancelled-popup-request') {
      console.log("Popup request was cancelled");
    }
    
    throw error;
  }
}

export async function getFirebaseToken() {
  try {
    const tokenDecoded = await auth.currentUser?.getIdTokenResult(false);
    const exp = dayjs.unix(Number(tokenDecoded?.claims?.exp));
    const now = dayjs();

    let token = "";
    if (exp.diff(now, "minute") > 5) {
      token = (await auth.currentUser?.getIdToken(false)) ?? "";
    } else {
      token = (await auth.currentUser?.getIdToken(true)) ?? "";
    }

    return token;
  } catch (error) {
    console.error("Error getting token", error);
    await auth.signOut();
    return "";
  }
}
