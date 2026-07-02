# design-sync notes — tjbaniksvermov-web

This repo is a Next.js **application**, not a component library — there is no `dist/` build, no `main`/`module`/`exports` in `package.json`. The synced "design system" is just `src/components/ui/` (8 small primitives), scoped in via `cfg.srcDir`.

## Required one-time-per-clone setup (before every build)

The converter needs `node_modules/<pkg>/package.json` to exist (it resolves `PKG_DIR` that way when no `--entry` is passed). Since this package never installs itself, recreate a small **real directory** (not a symlink to repo root — see gotcha below) before running `package-build.mjs` / `resync.mjs`:

```sh
mkdir -p node_modules/tjbaniksvermov-web/src/components node_modules/tjbaniksvermov-web/src/app
cp package.json node_modules/tjbaniksvermov-web/package.json
ln -s ../../../../src/components/ui node_modules/tjbaniksvermov-web/src/components/ui
node .design-sync/compile-tailwind.mjs   # writes the compiled CSS into the mirror (see below)
```

Then run the converter as usual (`node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --out ./ds-bundle`, or `resync.mjs` for re-syncs).

## Gotchas (all cost real debugging time — don't rediscover these)

1. **`node_modules/<pkg>` must NOT be a symlink to the repo root.** A symlink there creates `node_modules/tjbaniksvermov-web/node_modules/tjbaniksvermov-web/...` — ts-morph's directory walk recurses into it and dies with `ENAMETOOLONG`. Use a real directory containing only a `package.json` copy + a symlinked `src/components/ui`, as above.
2. **`cfg.cssEntry` is copied verbatim — Tailwind is never run.** `src/app/globals.css` is just `@import "tailwindcss"` + `:root` tokens; without a real Tailwind build, none of our components' utility classes (`bg-primary`, `rounded-lg`, …) exist in the shipped CSS. `.design-sync/compile-tailwind.mjs` runs the project's own `@tailwindcss/postcss` plugin to produce a real stylesheet, written into the `node_modules/tjbaniksvermov-web/src/app/globals.css` mirror (must be a **copy**, not a symlink — the converter's containment check rejects a symlink that resolves outside the mirror dir). **Re-run this script before every build** — it's not automatic.
3. **`next/link` throws `ReferenceError: process is not defined`** when bundled standalone (no Next.js runtime to shim `process.env`). Fixed by `src/components/ui/_polyfill.ts` (sets `globalThis.process = {env:{}}` if absent) imported as the *first* line of `Button.tsx`, before `next/link`. No-op in the real app (Next already defines `process`). If a future component imports another Next-coupled module, check for the same class of error first.
4. **Components MUST use named exports, not `export default`.** Synth-entry mode writes the bundle entry as `export * from "<file>"` for every file in `srcDir` — `export *` silently drops default exports, so the whole bundle came out with 0 usable exports (`[BUNDLE_EXPORT]` fatal) until all 8 components were converted to `export function X(...)`.
5. **Anton font** isn't shipped as a static asset anywhere in the repo — it's fetched by `next/font/google` at build time and cached under `.next/**/static/media/*.woff2`. The 3 subset files were extracted once into `.design-sync/fonts/` (`anton-latin.woff2`, `anton-latin-ext.woff2`, `anton-vietnamese.woff2`) with a hand-written `anton.css` (`cfg.extraFonts`). **Re-sync risk**: if the Anton font ever changes (weight, subset), these files go stale silently — nothing will flag it. Re-extract from a fresh `.next/static/media/` after changing the font.
6. **Unused-so-unstyled tokens**: `--background`, `--primary-foreground`, `--muted`, `--muted-foreground` are defined in `:root` but have no Tailwind utility class generated anywhere in the *current* app (nothing uses `bg-muted` etc. yet), so `compile-tailwind.mjs`'s output doesn't contain those classes. Documented as "don't use" in `.design-sync/conventions.md` rather than claimed as working. If the app starts using them for real, re-run `compile-tailwind.mjs` and this note (and the conventions header) can be updated.

## Scope

Only `src/components/ui/` (8 components: Button, Input, Textarea, Select, Label, Badge, Card, IconBadge) is synced. The rest of the app (pages, Header, Footer, e-shop, admin) is NOT part of the design system — it's excluded entirely via `cfg.srcDir`.
