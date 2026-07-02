## TJ Baník Švermov — design system conventions

Small, focused primitive set (8 components) extracted from the club's Next.js site. No provider/root wrapper is required — none of these components read from React context. Just import and use.

### Styling idiom: Tailwind utility classes + semantic color tokens

This is a Tailwind v4 project. Never use raw hex colors (`bg-[#c8102e]`) — always use the semantic tokens below, which map to the club's brand palette (primary red `#c8102e`):

| Token class | Meaning |
|---|---|
| `bg-primary` / `text-primary` / `border-primary` | Brand red — CTAs, active states, links |
| `hover:bg-primary-hover` | Darker red for hover (never invent a different hex — this is the only sanctioned hover shade) |
| `text-foreground` | Default text color |
| `border-border` | Default 1px border color (light gray) |

A few more semantic colors (`--background`, `--primary-foreground`, `--muted`, `--muted-foreground`) exist as CSS custom properties in `styles.css` but don't have generated Tailwind utility classes yet in this bundle — reach for `var(--muted)` etc. directly, or the standard gray-scale utilities (`bg-white`, `text-gray-500`, `text-gray-700`) as this codebase already does elsewhere.

Every component accepts a `className` prop that merges onto its root element for one-off adjustments — prefer composing with existing components over writing new raw markup.

### Components

- **`Button`** — `variant`: `primary` (solid red, default) | `inverse` (white-on-red, for use ON a red/dark surface) | `outline` (transparent + white border, for use on dark surfaces) | `ghost` (text-only red link style). `size`: `sm` | `md` | `lg`. Pass `href` to render as a link; omit it to render a `<button>` (accepts `type`, `disabled`, `onClick`, etc.).
- **`Input`** / **`Textarea`** / **`Select`** — standard form controls, same border/focus-ring styling. Pass native HTML props (`type`, `placeholder`, `rows`, `disabled`, …).
- **`Label`** — form field label, `text-sm font-medium text-gray-700`. Pair directly above its field.
- **`Badge`** — small pill. Default (`variant="solid"`) is `bg-primary text-white`; `variant="soft"` is a tinted `bg-primary/10 text-primary`. Pass `color="#hex"` to override with a custom category color (falls back to solid red when omitted).
- **`Card`** — bordered white container (`rounded-xl border border-border`). Pass `hoverable` for a hover shadow/border-highlight (list/grid items you can click).
- **`IconBadge`** — icon container. `shape`: `circle` | `square` (default). `tone`: `soft` (tinted red, default) | `solid` (solid red bg, white icon/text — used for the club's logo mark). `size`: `sm` | `md` | `lg`. `bordered` adds a subtle ring.

### Where the truth lives

Read `styles.css` (and its `@import` closure) for the full token list before styling anything outside these components. Each component's `.prompt.md` has its exact prop signature.

### Example: article card, the club's real composition

```tsx
<Card hoverable>
  <img src={heroImage} className="aspect-video w-full object-cover" />
  <div className="p-4">
    <Badge color={category.color} className="mb-2">{category.name}</Badge>
    <h3 className="font-bold text-foreground line-clamp-2">{title}</h3>
    <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{excerpt}</p>
  </div>
</Card>
```
