"use server"

import { redirect } from "next/navigation"
import { createSessionClient } from "@/lib/supabase/server"

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  if (!email || !password) redirect("/admin/login?error=" + encodeURIComponent("Enter your email and password."))

  const supabase = await createSessionClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  // Same message for every failure so the page does not reveal which emails exist.
  if (error) redirect("/admin/login?error=" + encodeURIComponent("Wrong email or password."))

  redirect("/admin")
}

export async function signOut() {
  const supabase = await createSessionClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}
