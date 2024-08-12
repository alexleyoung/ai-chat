"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { loginData, signupData } from "@/lib/types";

export async function login(data: loginData) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(data: signupData) {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/");
}

export async function signInWithGithub() {
  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://3.144.30.106:3000";

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${BASE_URL}/api/auth/callback?next=/dashboard`,
    },
  });

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
  }
}
