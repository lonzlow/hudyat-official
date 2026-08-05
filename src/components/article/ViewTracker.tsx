"use client";

import { useEffect } from "react";

export function ViewTracker({ contentId }: { contentId: string | number }) {
  useEffect(() => {
    const tracked = sessionStorage.getItem(`viewed_${contentId}`)
    if (tracked) return

    sessionStorage.setItem(`viewed_${contentId}`, '1')

    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentId }),
    }).catch(() => {
      // silently fail
    })
  }, [contentId])

  return null
}
