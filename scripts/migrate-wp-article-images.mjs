/**
 * Přenese fotky článků ze starého WordPress hostingu (Wedos) do Supabase Storage.
 *
 * Proč: DNS pro www.tjbaniksvermov.cz teď míří na Vercel (nový web), takže staré
 * absolutní URL na wp-content/uploads přestaly fungovat. Starý hosting ještě běží
 * (výpověď je jen "doběhnutí" do zaplaceného data), takže se k souborům dá dostat
 * napřímo přes IP — po zániku hostingu by byly nenávratně pryč.
 *
 * Spustit: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/migrate-wp-article-images.mjs
 */

import { createClient } from '@supabase/supabase-js'
import https from 'node:https'

const SUPABASE_URL = 'https://apyyhdeqflxxttbjgiya.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const OLD_HOST = 'www.tjbaniksvermov.cz'
const OLD_HOST_IP = '89.221.213.67'
const BUCKET = 'product-images'
const CONCURRENCY = 6

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌  Nastav SUPABASE_SERVICE_ROLE_KEY jako env proměnnou')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

function fetchFromOldHost(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const req = https.request(
      {
        host: OLD_HOST_IP,
        servername: OLD_HOST,
        headers: { Host: OLD_HOST },
        path: u.pathname + u.search,
        method: 'GET',
        timeout: 20000,
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume()
          reject(new Error(`HTTP ${res.statusCode}`))
          return
        }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] ?? 'image/jpeg' }))
      }
    )
    req.on('error', reject)
    req.on('timeout', () => req.destroy(new Error('timeout')))
    req.end()
  })
}

function sanitizeSegment(segment) {
  return segment
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // odstranit diakritiku
    .replace(/[^A-Za-z0-9._-]/g, '_')
}

function storagePathFor(url) {
  const u = new URL(url)
  const rel = decodeURIComponent(u.pathname.replace(/^\/wp-content\/uploads\//, ''))
  const safeRel = rel.split('/').map(sanitizeSegment).join('/')
  return `articles/wp-migrated/${safeRel}`
}

async function migrateOne(url) {
  const path = storagePathFor(url)

  const { data: existing } = await supabase.storage.from(BUCKET).list(path.split('/').slice(0, -1).join('/'), {
    search: path.split('/').pop(),
  })
  if (existing && existing.some((f) => f.name === path.split('/').pop())) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  const { buffer, contentType } = await fetchFromOldHost(url)
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, { contentType, upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

async function pooledMap(items, limit, fn) {
  const results = new Array(items.length)
  let i = 0
  async function worker() {
    while (i < items.length) {
      const idx = i++
      try {
        results[idx] = await fn(items[idx], idx)
      } catch (err) {
        results[idx] = { error: err }
      }
    }
  }
  await Promise.all(Array.from({ length: limit }, worker))
  return results
}

async function run() {
  console.log('📥  Načítám články ze Supabase...')
  const { data: articles, error } = await supabase.from('articles').select('id, hero_image_url, content')
  if (error) throw error

  const urlSet = new Set()
  for (const a of articles) {
    if (a.hero_image_url?.includes('tjbaniksvermov.cz')) urlSet.add(a.hero_image_url)
    const text = JSON.stringify(a.content)
    const matches = text.match(/https:\/\/www\.tjbaniksvermov\.cz\/wp-content\/uploads\/[^"'\\<>&\s]+/g)
    if (matches) matches.forEach((m) => urlSet.add(m))
  }
  const urls = [...urlSet]
  console.log(`🔎  Nalezeno ${urls.length} unikátních fotek k přenosu.\n`)

  console.log('⬇️   Stahuji ze starého serveru a nahrávám do Supabase Storage...')
  let done = 0
  const results = await pooledMap(urls, CONCURRENCY, async (url) => {
    const newUrl = await migrateOne(url)
    done++
    if (done % 25 === 0 || done === urls.length) console.log(`   ${done}/${urls.length}`)
    return newUrl
  })

  const urlMap = new Map()
  let failed = 0
  urls.forEach((url, idx) => {
    const r = results[idx]
    if (r?.error) {
      failed++
      console.warn(`   ⚠️  ${url} — ${r.error.message}`)
    } else {
      urlMap.set(url, r)
    }
  })
  console.log(`\n✅  Přeneseno ${urlMap.size}/${urls.length} fotek (${failed} selhalo).\n`)

  console.log('📝  Aktualizuji záznamy článků...')
  let updated = 0
  for (const a of articles) {
    let changed = false
    let newHero = a.hero_image_url
    if (newHero && urlMap.has(newHero)) {
      newHero = urlMap.get(newHero)
      changed = true
    }

    let newContent = a.content
    let contentStr = JSON.stringify(a.content)
    for (const [oldUrl, newUrl] of urlMap) {
      if (contentStr.includes(oldUrl)) {
        contentStr = contentStr.split(oldUrl).join(newUrl)
        changed = true
      }
    }
    if (changed) newContent = JSON.parse(contentStr)

    if (changed) {
      const { error: updErr } = await supabase
        .from('articles')
        .update({ hero_image_url: newHero, content: newContent })
        .eq('id', a.id)
      if (updErr) console.error(`   ❌ článek ${a.id}: ${updErr.message}`)
      else updated++
    }
  }

  console.log(`\n🎉  Hotovo — aktualizováno ${updated} článků.`)
}

run().catch((err) => {
  console.error('💥', err)
  process.exit(1)
})
