import { NextResponse, type NextRequest } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createSessionClient } from "@/lib/supabase/server"

// Landing point for invite and password-reset emails (see supabase/README.md for the template).
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null

  if (tokenHash && type) {
    const supabase = await createSessionClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) {
      const next = type === "invite" || type === "recovery" ? "/admin/set-password" : "/admin"
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  const url = new URL("/admin/login", request.url)
  url.searchParams.set("error", "That link is invalid or has expired. Ask an editor for a new invite.")
  return NextResponse.redirect(url)
}
