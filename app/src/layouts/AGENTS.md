# App layout scaffolds

Prop-driven, presentational starting points for the standard shapes of a
`type: "app"` product, each modeled on a live Higgsfield product. None of them
is imported by any route on purpose — the blank template stays blank. When you
build an app, COPY the closest layout into your route (or compose it from a
route file) and adapt it freely; a fully custom layout is fine whenever the
user asks for something these shapes don't cover.

## The five shapes

| File                          | Modeled on                                                        | Anatomy                                                                                                                                                  |
| ----------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `marketing-studio-layout.tsx` | Marketing Studio (higgsfield.ai/marketing-studio/product)         | Sidebar rail, gallery controls row + infinite generation grid, docked floating PromptBox form (attachments row, settings chips, costed accent generate)  |
| `stepper-layout.tsx`          | Shots (higgsfield.ai/apps/shots)                                  | Staged flow, NOT Back/Continue: step indicator (back-jump to visited steps), full-height stage, step-scoped actions row advances, optional history strip |
| `app-form.tsx`                | Face Swap (higgsfield.ai/apps/face-swap)                          | The generation form: input cards slot, optional mode toggle + settings, one full-width marketing-primary submit with credit cost, helper line — compose it into your own page |
| `upscaler-layout.tsx`         | Upscale (higgsfield.ai/upscale)                                   | Media stage (dashed empty-state upload card, overlay + toolbar slots) beside a ~21rem settings panel with reset header and sticky costed submit          |
| `shorts-studio-layout.tsx`    | Shorts Studio (higgsfield.ai/shorts-studio)                       | Tabbed shell (Presets / History / How it works) with per-tab controls slot, plus a separate `ShortsStudioForm` card with a costed tall Generate footer   |

## Rules

- Everything arrives via props: data, handlers, and slot nodes. The layouts
  import only Quanta components (including `@higgsfield/quanta/prompt-box`),
  `HiggsfieldGenerationCard`, and `cn` — never `@higgsfield/fnf-react`.
- Keep the conventions when adapting: Quanta components before custom markup,
  `q-` semantic utilities for color/type, native Tailwind spacing (`p-4`,
  `gap-3`), real copy in every state (empty, busy, error) — no placeholder
  tokens.
- Generation CTAs are Quanta Button `variant="marketingPrimary"` (a Loader
  `size="xs" color="neutral"` while busy); secondary actions `secondary`,
  navigation `primary`/`ghost`.
- Generation feeds render `HiggsfieldGenerationCard` inside a Quanta `Grid`
  with `cols="auto-fit"` — resize `minColWidth` rather than adding breakpoint
  class ladders.

## Wiring the data (fnf-react)

Each layout's header comment carries its exact recipe. In short, from
`app/packages/fnf-react/ai/AGENTS.md`:

- Submit prompts/runs with `useGenerationRun(jobClient, { scopeKey })`; map its
  status to the layout's `busy`/`generating` prop.
- Read feeds with `jobsFeedQueryOptions` + `flattenFeedPages`; poll one job with
  `generationQueryOptions`; read credit prices with `costQueryOptions`.
- After a run resolves, call `prependGenerations` so fresh work appears at the
  top of the grid; upload files with `useAttachments` and pass refs to
  `run.start`.
