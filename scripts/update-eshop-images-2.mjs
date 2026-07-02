/**
 * Doplní obrázky k produktům z druhé dávky (seed-eshop-products-2.mjs).
 * Zdroj: jakojedenteam.cz — stejný formát URL jako u první dávky (team-jako.cz).
 * Spustit: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/update-eshop-images-2.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://apyyhdeqflxxttbjgiya.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌  Nastav SUPABASE_SERVICE_ROLE_KEY jako env proměnnou')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const IMG_BASE = 'https://www.jakojedenteam.cz/ew/ew_images/image'
const FILTER = '38bb315d-6497-4ad4-9275-7213493a8945'
const img = (uuid) => `${IMG_BASE}?EwImage=${uuid}&Filter=${FILTER}`

// slug → EwImage UUID (dětská/dospělá varianty se stejným SKU sdílí obrázek)
const SLUG_TO_IMAGE = {
  'zimni-bunda-stadium-detska': 'f5c63705-98ef-47b2-bb24-3c781dfef167',
  'zimni-bunda-stadium-dospela': 'f5c63705-98ef-47b2-bb24-3c781dfef167',
  'zimni-bunda-team-s-kapuci-detska': '9ee3d37d-5d88-4334-b5c9-dc14bc92956a',
  'zimni-bunda-team-s-kapuci-dospela': '9ee3d37d-5d88-4334-b5c9-dc14bc92956a',
  'stulpny-bez-ponozky': '1ac98336-ada4-4b8b-af94-d8e6f4668c54',
  'ponozky-grip-comfort': '7ca54ed1-c6b5-48ea-a666-c481393af8ec',
  'comfort-2-0-funkcni-triko-dlouhy-rukav': '75ce3ccf-102e-44d3-adb6-269b5553553a',
  'comfort-2-0-funkcni-rolak': '452311a2-611b-4ef6-a0e0-6161ad87dbba',
  'winter-triko-dlouhy-rukav': '961dfc34-e8bd-41d1-9eea-0fe853b7e18f',
  'compression-2-0-elasticke-sortky-detske': '01ca4744-5c28-4bf2-92cd-1dea504d1d6e',
  'compression-2-0-elasticke-sortky-dospele': '01ca4744-5c28-4bf2-92cd-1dea504d1d6e',
  'comfort-2-0-funkcni-elastaky': '7ededf67-6f00-46d6-bfd5-731573632838',
  'spodni-elasticke-sortky-function-detske': 'cb44b009-2db1-4b99-8d4c-3dcae2c0be27',
  'spodni-elasticke-sortky-function-dospele': 'cb44b009-2db1-4b99-8d4c-3dcae2c0be27',
  'sportovni-taska-iconic': '91b027db-90e4-4077-8278-a093d68a36f3',
  'one-batoh': '8fc59fbe-08d8-4196-b222-3badf9f6509e',
  'taska-na-boty': 'a2118b31-782c-4cfd-86eb-40c6ad58d1be',
  'striker-batoh': '27fd9fe6-f6c8-4e75-8c1b-388faa41cc82',
  'pantofle-s-vlastnim-potiskem': '74e78554-c1d4-483e-9783-fc773a0b7f5e',
  'fleecova-cepice': 'fd6ec40a-ceac-4be1-82ed-7cae8dad72c3',
  'nakrcnik-z-funkcniho-materialu': '344bc490-5717-42f8-8420-4e2c1a63fc2b',
  'nakrcnik': '3cf3abd0-f42b-438d-ad3c-ccee03a07f3b',
  'funkcni-hracske-rukavice-teple': '711ea192-d06f-4e21-b439-27af31362a70',
  'fleecove-hracske-rukavice': 'e5aa7eaa-e305-4752-96dd-6ca38621ff91',
  'ksiltovka-club': '9734b7ad-0256-476a-acdc-4458d176c512',
  'one-brankarsky-dres-detsky': '3092e326-3f21-4c9a-92d9-92c3d9a16a82',
  'one-brankarsky-dres-dospely': '3092e326-3f21-4c9a-92d9-92c3d9a16a82',
  'gk-brankarske-triko-s-vycpavkami': '6f045755-1428-4e92-9c59-9b6ce4e7a235',
  'striker-brankarske-trenyrky-detske': '1d6fef51-076f-496f-8798-66442db03c31',
  'striker-brankarske-trenyrky-dospele': '1d6fef51-076f-496f-8798-66442db03c31',
  'striker-brankarske-3-4-kalhoty-detske': '30c2e8ad-90e3-4aa7-8caf-083ff4235ad6',
  'striker-brankarske-3-4-kalhoty-dospele': '30c2e8ad-90e3-4aa7-8caf-083ff4235ad6',
  'striker-brankarske-kalhoty-detske': 'f86b38ea-dda0-4efa-9222-3d9d0d405955',
  'striker-brankarske-kalhoty-dospele': 'f86b38ea-dda0-4efa-9222-3d9d0d405955',
  'gk-brankarske-sortky-s-vycpavkami': '724ed5cc-b257-46d7-9dd9-01357cd81aec',
  'brankarsky-dres-river-detsky': 'dae82e57-3699-44c8-9206-0d03897bcd4f',
  'brankarsky-dres-river-dospely': '412bfead-a5dc-4180-8ae8-f261a8bd90ea',
}

async function main() {
  const entries = Object.entries(SLUG_TO_IMAGE)
  console.log(`→ Aktualizuji obrázky u ${entries.length} produktů…`)

  let updated = 0
  for (const [slug, uuid] of entries) {
    const { error, count } = await supabase
      .from('products')
      .update({ images: [img(uuid)] }, { count: 'exact' })
      .eq('slug', slug)

    if (error) {
      console.error(`❌ ${slug}: ${error.message}`)
      continue
    }
    updated++
  }

  console.log(`✅ Hotovo — aktualizováno ${updated}/${entries.length} produktů.`)
}

main()
