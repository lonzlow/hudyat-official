// Success / error banner driven by ?ok= and ?error= search params (set by server actions via redirect).
export function Notice({ ok, error }: { ok?: string; error?: string }) {
  if (!ok && !error) return null
  return error ? (
    <p role="alert" className="mb-6 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {error}
    </p>
  ) : (
    <p role="status" className="mb-6 rounded-md bg-primary/10 px-4 py-3 text-sm text-primary">
      {ok}
    </p>
  )
}
