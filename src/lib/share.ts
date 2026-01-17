export interface ShareOptions {
  ref?: string
}

const TWEET_TEXT = 'SnowRail Pilot Waitlist is open. Programmable B2B payouts with evidence-based release, policy controls, and verifiable settlement (USDC on-chain → USD via nsegundos).'

/**
 * Get the base URL for sharing.
 * Uses VITE_PUBLIC_SITE_URL if defined, otherwise window.location.origin.
 */
export function getBaseUrl(): string {
  const envUrl = import.meta.env.VITE_PUBLIC_SITE_URL
  return envUrl || window.location.origin
}

/**
 * Build the share URL with ref parameter.
 */
export function buildShareUrl(ref?: string): string {
  const base = getBaseUrl()
  const safeRef = encodeURIComponent(ref || 'waitlist')
  return `${base}/?ref=${safeRef}`
}

/**
 * Open Twitter/X with pre-filled enterprise tweet.
 */
export function shareOnX(options?: ShareOptions): void {
  const url = buildShareUrl(options?.ref)
  const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(TWEET_TEXT)}&url=${encodeURIComponent(url)}`
  window.open(intentUrl, '_blank', 'noopener,noreferrer')
}

/**
 * Copy the share link to clipboard.
 * Returns the URL that was copied.
 */
export async function copyShareLink(options?: ShareOptions): Promise<string> {
  const url = buildShareUrl(options?.ref)
  await navigator.clipboard.writeText(url)
  return url
}
