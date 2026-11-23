// `contents.paragraph` holds either newline-separated text (what the CMS writes)
// or, for older articles, a JSON array / a malformed JSON-array string.
// The public article page and the CMS editor both read it through this function.
export function parseParagraphs(rawData: unknown): string[] {
  if (!rawData) return []
  if (Array.isArray(rawData)) return rawData.map(String)

  if (typeof rawData === "string") {
    const trimmed = rawData.trim()

    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed)
        return (Array.isArray(parsed) ? parsed : [parsed]).map(String)
      } catch {
        return trimmed
          .replace(/^\[|\]$/g, "")
          .split('", "')
          .map((p) => p.replace(/^"|"$/g, "").trim())
          .filter(Boolean)
      }
    }

    return trimmed.split(/\n+/).filter(Boolean)
  }

  return []
}

// Inverse for the editor: one paragraph per blank-line-separated block.
export function serializeParagraphs(text: string): string {
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .join("\n\n")
}
