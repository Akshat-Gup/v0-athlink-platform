"use server";

import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase-client";

export async function handleSignOut() {
  const supabase = await createServerComponentClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function handleSignIn(provider: string) {
  const supabase = await createServerComponentClient();

  if (provider === "google") {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    });

    if (error) {
      console.error("Sign-in error:", error);
      return;
    }

    if (data.url) {
      redirect(data.url);
    }
  }
}
