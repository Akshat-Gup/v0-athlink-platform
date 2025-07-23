"use server";

import { signOut, signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function handleSignOut() {
  await signOut();
}

export async function handleSignIn(provider: string) {
  await signIn(provider);
}
