/**
 * Import rozpisu zápasů z .ics exportu (fotbal.cz / is.fotbal.cz) do tabulky matches.
 * Výsledky (score_home/score_away) se doplňují ručně v adminu (/admin/zapasy) —
 * oficiální export bez výsledků neexistuje.
 *
 * Spustit: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/import-matches-ics.mjs <soubor.ics> <team-slug>
 * Příklad: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/import-matches-ics.mjs ~/Downloads/rozpis.ics a-muzstvo
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const SUPABASE_URL = 'https://apyyhdeqflxxttbjgiya.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const CLUB_NAME_MATCH = /baník švermov/i

const [, , icsPath, teamSlug] = process.argv

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌  Nastav SUPABASE_SERVICE_ROLE_KEY jako env proměnnou')
  process.exit(1)
}
if (!icsPath || !teamSlug) {
  console.error('❌  Použití: node scripts/import-matches-ics.mjs <soubor.ics> <team-slug>')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Poslední neděle v daném měsíci a roce, 01:00 UTC (přechod na letní/zimní čas v EU)
function lastSundayUtc(year, month) {
  const d = new Date(Date.UTC(year, month + 1, 0, 1, 0, 0)) // poslední den měsíce, 01:00 UTC
  d.setUTCDate(d.getUTCDate() - d.getUTCDay())
  return d
}

function pragueLocalToUtc(y, mo, d, h, mi) {
  const dstStart = lastSundayUtc(y, 2) // poslední neděle v březnu
  const dstEnd = lastSundayUtc(y, 9) // poslední neděle v říjnu
  const naiveUtc = new Date(Date.UTC(y, mo - 1, d, h, mi, 0))
  const isDst = naiveUtc >= dstStart && naiveUtc < dstEnd
  const offsetHours = isDst ? 2 : 1
  return new Date(naiveUtc.getTime() - offsetHours * 3600 * 1000)
}

function parseIcsDate(value) {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/)
  if (!m) return null
  const [, y, mo, d, h, mi] = m.map(Number)
  return pragueLocalToUtc(y, mo, d, h, mi)
}

function unfoldIcs(text) {
  return text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '')
}

function parseIcs(text) {
  const lines = unfoldIcs(text).split('\n')
  const events = []
  let current = null
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = {}
    } else if (line === 'END:VEVENT') {
      if (current) events.push(current)
      current = null
    } else if (current) {
      const idx = line.indexOf(':')
      if (idx === -1) continue
      const key = line.slice(0, idx).split(';')[0]
      const value = line.slice(idx + 1)
      current[key] = value
    }
  }
  return events
}

async function run() {
  const icsText = readFileSync(icsPath, 'utf-8')
  const events = parseIcs(icsText)
  console.log(`📄  Nalezeno ${events.length} zápasů v .ics souboru.`)

  const { data: team, error: teamErr } = await supabase.from('teams').select('id, name').eq('slug', teamSlug).single()
  if (teamErr || !team) {
    console.error(`❌  Tým se slugem "${teamSlug}" nenalezen.`, teamErr?.message)
    process.exit(1)
  }
  console.log(`🏷️   Tým: ${team.name} (${team.id})\n`)

  const rows = events.map((e) => {
    const [home, away] = (e.SUMMARY ?? '').split(' : ').map((s) => s.trim())
    const isHome = CLUB_NAME_MATCH.test(home ?? '')
    const opponent = isHome ? away : home
    return {
      team_id: team.id,
      opponent: opponent ?? '?',
      kick_off_at: e.DTSTART ? parseIcsDate(e.DTSTART)?.toISOString() : null,
      is_home: isHome,
      venue: e.LOCATION ?? null,
    }
  })

  let inserted = 0
  let skipped = 0
  for (const row of rows) {
    const { data: existing } = await supabase
      .from('matches')
      .select('id')
      .eq('team_id', row.team_id)
      .eq('kick_off_at', row.kick_off_at)
      .eq('opponent', row.opponent)
      .maybeSingle()

    if (existing) {
      skipped++
      continue
    }

    const { error } = await supabase.from('matches').insert(row)
    if (error) {
      console.error(`   ⚠️  ${row.opponent} (${row.kick_off_at}): ${error.message}`)
    } else {
      inserted++
      console.log(`   ✓ ${row.is_home ? 'doma' : 'venku'} vs ${row.opponent} — ${row.kick_off_at}`)
    }
  }

  console.log(`\n✅  Hotovo — ${inserted} nových, ${skipped} už existovalo (z celkem ${rows.length}).`)
}

run().catch((err) => {
  console.error('💥', err)
  process.exit(1)
})
