// Pre-compiles src/app/globals.css (Tailwind v4 @import + tokens) into a
// real stylesheet with generated utility classes, since the design-sync
// converter only copies cssEntry verbatim — it doesn't run Tailwind's build.
// Run this (from repo root) before every design-sync package-build.mjs run.
import { createRequire } from 'node:module'
import { readFileSync, writeFileSync } from 'node:fs'

const require = createRequire(import.meta.resolve('@tailwindcss/postcss'))
const postcss = require('postcss')
const tailwind = require('@tailwindcss/postcss')

const OUT = 'node_modules/tjbaniksvermov-web/src/app/globals.css'
const input = readFileSync('src/app/globals.css', 'utf8')
const result = await postcss([tailwind()]).process(input, { from: 'src/app/globals.css', to: OUT })
writeFileSync(OUT, result.css)
console.log('wrote compiled css:', result.css.length, 'bytes')
