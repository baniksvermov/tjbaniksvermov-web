// next/link reads `process.env.*` internally. Next's own bundler always
// provides a `process` shim in the browser, but a standalone bundle (e.g.
// the design-sync export) doesn't — guard so it doesn't throw there.
// No-op in the real app since `process` is already defined by Next.
if (typeof (globalThis as unknown as { process?: unknown }).process === 'undefined') {
  ;(globalThis as unknown as { process: { env: Record<string, string> } }).process = { env: {} }
}
