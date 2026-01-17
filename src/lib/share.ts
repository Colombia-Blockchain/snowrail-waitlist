export interface ShareOptions {
  signupId?: string
}

export function getShareUrl(options?: ShareOptions): string {
  const base = window.location.origin + window.location.pathname
  const ref = options?.signupId || 'waitlist'
  return `${base}?ref=${ref}`
}

export async function shareWaitlist(options?: ShareOptions): Promise<'shared' | 'copied'> {
  const shareUrl = getShareUrl(options)
  const shareData = {
    title: 'SnowRail Pilot Waitlist',
    text: 'Join the SnowRail Pilot waitlist for programmable B2B payouts.',
    url: shareUrl,
  }

  // Try native share (mobile)
  if (navigator.share && navigator.canShare?.(shareData)) {
    try {
      await navigator.share(shareData)
      return 'shared'
    } catch (err) {
      // User cancelled or error - fall through to clipboard
      if ((err as Error).name === 'AbortError') {
        throw err // User cancelled, don't copy
      }
    }
  }

  // Fallback: copy to clipboard
  await navigator.clipboard.writeText(shareUrl)
  return 'copied'
}
