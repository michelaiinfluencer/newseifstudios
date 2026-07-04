import { scrollToTarget } from "../lib/motion";
import { MARQUEE_ITEMS } from "../data/content";
import { Marquee } from "./Marquee";
import { HeroBlob } from "./HeroBlob";

/* V6 hero: type on the left, the living red blob on the right.
   The blob inflates as the loader hands off, leans toward the cursor,
   and gets turbulent when you scroll fast. */
export function Hero3D() {
  return (
    <div
      id="top"
      style={{ height: "100dvh", position: "relative", display: "flex", flexDirection: "column" }}
    >
      <div className="grid flex-1 grid-cols-1 items-center gap-6 px-6 pt-20 md:grid-cols-12 md:px-14 md:pt-10">
        <div className="md:col-span-6 lg:col-span-5" style={{ zIndex: 2 }}>
          <p className="seif-eyebrow">
            Creative AI Studio for Brands, Products and Visual Storytelling
          </p>
          <h1
            className="seif-display mt-5"
            style={{ fontSize: "clamp(2.6rem, 5.4vw, 5.2rem)" }}
          >
            Create Without Limits
          </h1>
          <p
            className="mt-5 max-w-md text-base leading-relaxed"
            style={{ color: "var(--seif-gray-300)" }}
          >
            High end AI generated images and video for brands that want to
            stand out.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-8">
            <button
              type="button"
              className="seif-cta-pill"
              onClick={() => scrollToTarget("#work")}
            >
              Explore the Work
            </button>
            <button
              type="button"
              className="seif-link-arrow"
              onClick={() => scrollToTarget("#contact")}
            >
              Contact Us
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="md:col-span-6 lg:col-span-7"
          style={{ height: "min(74vh, 100%)", minHeight: 320 }}
        >
          <HeroBlob />
        </div>
      </div>

      <Marquee items={MARQUEE_ITEMS} />
    </div>
  );
}
