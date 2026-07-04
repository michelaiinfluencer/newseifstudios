"use client";

/**
 * MarketingStudioLayout — workspace scaffold modeled on Higgsfield's
 * Marketing Studio (higgsfield.ai/marketing-studio/product): a collapsible
 * Sidebar rail (workspace/projects nav), a gallery area, and a DOCKED
 * FLOATING generation form bottom-centered over the gallery.
 *
 * Gallery: an optional `galleryControls` header row (filters, view switches),
 * then an infinite responsive grid of generations (HiggsfieldGenerationCard
 * in a Quanta Grid) with an empty state when the feed is blank.
 *
 * Docked form: a fixed bottom-centered rounded PromptBox surface stacking an
 * attachments/media row, the prompt editor (real placeholder: "Describe the
 * image you want to create..."), a settings-chips row — the real product
 * exposes batch size, quality, aspect ratio, and brand kit as chips — and the
 * generate cluster (optional cost text + counter + the accent submit;
 * PromptBox.Submit is already Quanta's marketingPrimary CTA). On md+ the dock
 * pads left by the expanded marketing-studio rail width so it centers over
 * the gallery, not the viewport; if the rail is collapsed the dock sits
 * slightly off-center — accepted tradeoff to keep the scaffold simple.
 *
 * Purely presentational: every piece of data and every handler arrives via
 * props. Copy into a route and adapt.
 *
 * fnf-react wiring recipe (see app/packages/fnf-react/ai/AGENTS.md):
 * - Generate: const run = useGenerationRun(jobClient, { scopeKey }); pass
 *   onGenerate={(prompt) => run.start({ model, prompt: { instruction: prompt },
 *   settings })} and generating while run.status is "submitting"/"generating".
 * - Gallery data: useInfiniteQuery({ ...jobsFeedQueryOptions(jobClient,
 *   { size: 20 }, { scopeKey }), select: flattenFeedPages }) as `generations`.
 * - Fresh work on top: after run.start resolves, call
 *   prependGenerations(queryClient, feedInput, generations, { scopeKey }).
 * - Single-card refresh: invalidate generationQueryOptions(jobClient,
 *   generation.id, { scopeKey }) from `onRefreshGeneration`.
 * - Attachments row: useAttachments(mediaClient) in the page; render its
 *   chips into `attachments`; costQueryOptions feeds `cost`.
 */

import type { ReactNode } from "react";
import type { Generation } from "@higgsfield/fnf/client";
import { Grid } from "@higgsfield/quanta/grid";
import { PromptBox } from "@higgsfield/quanta/prompt-box";
import { Sidebar } from "@higgsfield/quanta/sidebar";
import { HiggsfieldGenerationCard } from "@/components/higgsfield-generation-card";
import { cn } from "@/lib/utils";

export interface MarketingStudioNavItem {
  label: string;
  icon?: ReactNode;
  selected?: boolean;
  onSelect?: () => void;
}

export interface MarketingStudioLayoutProps {
  /** Product name shown in the sidebar switcher. */
  appName: string;
  /** Brand mark next to the product name (any node, ~20px). */
  appLogo?: ReactNode;
  navItems: MarketingStudioNavItem[];
  /** Gallery header row (title, filters, view switches, credits). */
  galleryControls?: ReactNode;
  /** Feed of generations to render as cards; empty state shows when empty. */
  generations: Generation[];
  onRefreshGeneration?: (generation: Generation) => void;
  /** Replaces the built-in empty state. */
  emptyState?: ReactNode;
  /** Prompt state — controlled by the page. */
  prompt: string;
  onPromptChange: (value: string) => void;
  promptPlaceholder?: string;
  maxLength?: number;
  /** Fires with the prompt text when the accent submit is pressed. */
  onGenerate: (value: string) => void;
  /** Generation in flight: the prompt locks and Submit shows a loader. */
  generating?: boolean;
  /** Cost / credits hint rendered next to the submit button. */
  cost?: ReactNode;
  /** Attachment chips strip above the prompt editor. */
  attachments?: ReactNode;
  /** Settings chips row (batch size, quality, aspect ratio, brand kit). */
  promptChips?: ReactNode;
  className?: string;
}

export function MarketingStudioLayout({
  appName,
  appLogo,
  navItems,
  galleryControls,
  generations,
  onRefreshGeneration,
  emptyState,
  prompt,
  onPromptChange,
  promptPlaceholder = "Describe the image you want to create...",
  maxLength = 2000,
  onGenerate,
  generating = false,
  cost,
  attachments,
  promptChips,
  className,
}: MarketingStudioLayoutProps) {
  return (
    <div className={cn("flex min-h-dvh bg-q-background-primary text-q-text-primary", className)}>
      <Sidebar.Root product="marketing-studio" flush className="sticky top-0 h-dvh shrink-0">
        <Sidebar.Header>
          <Sidebar.Switcher>
            {appLogo ? <Sidebar.Logo>{appLogo}</Sidebar.Logo> : null}
            <Sidebar.Title>{appName}</Sidebar.Title>
          </Sidebar.Switcher>
        </Sidebar.Header>
        <Sidebar.Body>
          <Sidebar.Section>
            <Sidebar.SectionItems>
              {navItems.map((item) => (
                <Sidebar.Item
                  key={item.label}
                  start={item.icon}
                  title={item.label}
                  selected={item.selected}
                  onClick={item.onSelect}
                />
              ))}
            </Sidebar.SectionItems>
          </Sidebar.Section>
        </Sidebar.Body>
      </Sidebar.Root>

      <div className="flex min-w-0 flex-1 flex-col">
        {galleryControls ? (
          <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
            {galleryControls}
          </header>
        ) : null}

        <main className="flex-1 overflow-y-auto px-6 pb-56 pt-2">
          {generations.length > 0 ? (
            <Grid cols="auto-fit" minColWidth="16rem" gap={4}>
              {generations.map((generation) => (
                <HiggsfieldGenerationCard
                  key={generation.id}
                  generation={generation}
                  onRefresh={
                    onRefreshGeneration ? () => onRefreshGeneration(generation) : undefined
                  }
                />
              ))}
            </Grid>
          ) : (
            (emptyState ?? (
              <div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
                <p className="text-q-title-sm-semi-bold">Nothing generated yet</p>
                <p className="max-w-96 text-q-body-sm-regular text-q-text-tertiary">
                  Describe what you want in the prompt below and press Generate. Finished
                  results appear here.
                </p>
              </div>
            ))
          )}
        </main>
      </div>

      {/* Docked floating form. The md padding matches the expanded
          marketing-studio rail (14.9375rem) so the dock centers over the
          gallery; a collapsed rail leaves it slightly off-center. */}
      <div className="fixed inset-x-0 bottom-4 z-10 px-4 md:pl-[calc(14.9375rem+1rem)] md:pr-4">
        <PromptBox.Root
          value={prompt}
          onValueChange={onPromptChange}
          onSubmit={onGenerate}
          submitting={generating}
          maxLength={maxLength}
          className="mx-auto w-full max-w-3xl rounded-3xl shadow-lg"
        >
          {attachments ? <PromptBox.Attachments>{attachments}</PromptBox.Attachments> : null}
          <PromptBox.Input aria-label="Prompt" placeholder={promptPlaceholder} />
          <PromptBox.Toolbar>
            {promptChips ? (
              <div className="flex min-w-0 flex-wrap items-center gap-2">{promptChips}</div>
            ) : null}
            <PromptBox.Actions>
              {cost}
              <PromptBox.Counter />
              <PromptBox.Submit />
            </PromptBox.Actions>
          </PromptBox.Toolbar>
        </PromptBox.Root>
      </div>
    </div>
  );
}
