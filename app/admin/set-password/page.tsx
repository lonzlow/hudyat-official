import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSessionClient } from "@/lib/supabase/server"

export const metadata = { title: "Set password" }

async function setPassword(formData: FormData) {
  "use server"
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirm") ?? "")
  if (password.length < 10) redirect("/admin/set-password?error=" + encodeURIComponent("Use at least 10 characters."))
  if (password !== confirm) redirect("/admin/set-password?error=" + encodeURIComponent("The passwords do not match."))

  const supabase = await createSessionClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) redirect("/admin/set-password?error=" + encodeURIComponent(error.message))
  redirect("/admin")
}

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <form action={setPassword} className="w-full max-w-sm space-y-5 rounded-lg border bg-background p-8 shadow-sm">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold">Choose a password</h1>
          <p className="text-sm text-muted-foreground">You will use it to sign in from now on.</p>
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={10} required />
        </div>
        <Button type="submit" className="w-full">Save password</Button>
      </form>
    </div>
  )
}
