/**
 * Migrace článků z WordPress → Supabase
 * Spustit: node scripts/migrate-articles.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://apyyhdeqflxxttbjgiya.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const WP_BASE = 'https://www.tjbaniksvermov.cz/wp-json/wp/v2'

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌  Nastav SUPABASE_SERVICE_ROLE_KEY jako env proměnnou')
  console.error('   Spuštění: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/migrate-articles.mjs')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Mapování WP category ID → náš Supabase slug
const WP_CAT_MAP = {
  123: 'akce',
  149: 'info',
  1:   'media',
  33:  'rozhovory',
  103: 'media',
  34:  'zapasove-vysledky',
}

function wpContentToTiptap(html) {
  // Uložíme HTML obsah jako jednoduchý TipTap dokument
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: '__HTML__' + html }]
      }
    ]
  }
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 200)
}

async function fetchAllPosts() {
  let allPosts = []
  let page = 1
  while (true) {
    const res = await fetch(`${WP_BASE}/posts?per_page=100&page=${page}&_embed&status=publish`)
    if (!res.ok) break
    const posts = await res.json()
    if (!posts.length) break
    allPosts = allPosts.concat(posts)
    console.log(`  Načteno ${allPosts.length} článků...`)
    if (posts.length < 100) break
    page++
  }
  return allPosts
}

function getHeroImage(post) {
  try {
    const media = post._embedded?.['wp:featuredmedia']?.[0]
    if (!media) return null
    return media.media_details?.sizes?.large?.source_url
      || media.media_details?.sizes?.full?.source_url
      || media.source_url
      || null
  } catch {
    return null
  }
}

async function getCategoryIds() {
  const { data } = await supabase.from('article_categories').select('id, slug')
  return Object.fromEntries((data ?? []).map(c => [c.slug, c.id]))
}

async function run() {
  console.log('🚀  Spouštím migraci článků z WordPress → Supabase\n')

  console.log('📂  Načítám kategorie ze Supabase...')
  const catIds = await getCategoryIds()
  console.log('   Kategorie:', Object.keys(catIds).join(', '), '\n')

  console.log('🌐  Stahuji články z WordPress...')
  const posts = await fetchAllPosts()
  console.log(`   Celkem: ${posts.length} článků\n`)

  // Smaž testovací seed články (volitelně)
  console.log('🗑️   Mažu seed/testovací články...')
  await supabase.from('articles').delete().in('slug', [
    'a-muzstvo-remizovalo-1-1-derby-kladno',
    'letni-fotbalovy-kemp-mladez-prihlaseni',
    'nova-umela-trava-pripravena-pronajem',
  ])

  let inserted = 0
  let skipped = 0
  let errors = 0

  for (const post of posts) {
    const title = post.title?.rendered?.replace(/&amp;/g, '&').replace(/&#8211;/g, '–').replace(/&#8230;/g, '…') ?? ''
    const slug = post.slug || slugify(title)
    const excerpt = post.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim() ?? ''
    const htmlContent = post.content?.rendered ?? ''

    // Mapuj WP kategorii → Supabase category_id
    const wpCatId = post.categories?.[0]
    const catSlug = WP_CAT_MAP[wpCatId] ?? 'info'
    const categoryId = catIds[catSlug] ?? catIds['info'] ?? null

    const content = wpContentToTiptap(htmlContent)

    const heroImageUrl = getHeroImage(post)

    const { error } = await supabase.from('articles').upsert({
      title,
      slug,
      excerpt: excerpt.substring(0, 500) || null,
      content,
      hero_image_url: heroImageUrl,
      category_id: categoryId,
      status: 'published',
      published_at: post.date,
      created_at: post.date,
      updated_at: post.date,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ❌ Chyba u "${title}": ${error.message}`)
      errors++
    } else {
      inserted++
      if (inserted % 10 === 0) console.log(`  ✅  Vloženo ${inserted}/${posts.length}`)
    }
  }

  console.log(`\n✅  Migrace dokončena!`)
  console.log(`   Vloženo: ${inserted}`)
  console.log(`   Chyby:   ${errors}`)
}

run().catch(console.error)
