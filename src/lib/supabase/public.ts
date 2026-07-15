import { createClient } from '@supabase/supabase-js'

/**
 * Klient pro veřejné, nepersonalizované čtení (bez cookies).
 * Na rozdíl od @/lib/supabase/server nečte cookies() — díky tomu můžou
 * stránky, které ho používají, zůstat staticky/ISR kešované místo
 * vynuceného dynamického renderu na každý request.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
