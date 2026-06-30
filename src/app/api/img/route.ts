import { NextRequest } from 'next/server'

const ALLOWED_HOST = 'www.team-jako.cz'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) return new Response('Missing url', { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return new Response('Invalid url', { status: 400 })
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    return new Response('Forbidden', { status: 403 })
  }

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0',
      Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
    },
    next: { revalidate: 86400 },
  })

  if (!res.ok) return new Response('Not found', { status: 404 })

  const contentType = res.headers.get('content-type') ?? 'image/jpeg'
  const buffer = await res.arrayBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  })
}
