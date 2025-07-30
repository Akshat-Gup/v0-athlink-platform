"use server";

import { signOut, signInWithGoogle, signInWithCredentials } from "@/auth";
import { redirect } from "next/navigation";

export async function handleSignOut() {
  await signOut();
  redirect('/');
}

export async function handleGoogleSignIn() {
  const { url } = await signInWithGoogle();
  if (url) {
    redirect(url);
  }
}

export async function handleCredentialsSignIn(email: string, password: string) {
  try {
    const result = await signInWithCredentials(email, password);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign in failed'
    };
  }
}
