import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { installMotion } from "../lib/motion";
import { Cursor } from "../components/Cursor";
import { Ambience } from "../components/Ambience";
import { Gallery } from "../components/Gallery";
import { WORK_CHAPTERS, CONTACT } from "../data/content";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "The Work, Seif Studios" },
      {
        name: "description",
        content:
          "All seven disciplines of Seif Studios in one gallery: AI image, video, custom models, product placement, lookbooks, avatars, and UGC.",
      },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  const navigate = useNavigate();
  useEffect(() => installMotion(), []);

  // arrive at the chapter the visitor clicked (hash), else at the top
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    // clear any card-click overlay
    document
      .querySelectorAll<HTMLElement>("body > div[style*='z-index: 9000']")
      .forEach((el) => el.remove());
    if (hash) {
      const el = document.getElementById(`chapter-${hash}`);
      if (el) {
        el.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="seif min-h-dvh">
      <Ambience />
      <Cursor />

      <header className="flex items-center justify-between px-6 pt-5 md:px-14">
        <Link to="/" aria-label="Seif Studios home">
          <img
            src="/assets/Logo/logo3.2.png"
            alt="Seif Studios"
            style={{ height: 52, width: "auto" }}
          />
        </Link>

      </header>

      {WORK_CHAPTERS.map((ch, i) => (
        <section
          key={ch.id}
          id={`chapter-${ch.id}`}
          className="px-6 pt-20 md:px-14"
          style={i > 0 ? { borderTop: "1px solid var(--seif-gray-700)", marginTop: 40 } : undefined}
        >
          <p className="seif-mono" style={{ color: "var(--seif-red)" }}>
            {ch.num} / 07
          </p>
          <h2 className="seif-display seif-h2 mt-2">
            {ch.title}
          </h2>
          <p
            className="mt-3 max-w-xl text-base leading-relaxed"
            style={{ color: "var(--seif-gray-300)" }}
          >
            {ch.sub}
          </p>
          <div className="mt-10 pb-6">
            <Gallery pieces={ch.pieces} />
          </div>
        </section>
      ))}

      <footer
        className="mx-6 mt-10 flex flex-wrap items-center justify-between gap-6 py-10 md:mx-14"
        style={{ borderTop: "1px solid var(--seif-gray-700)" }}
      >
        <a href={`mailto:${CONTACT.email}`} className="seif-nav-link">
          {CONTACT.email}
        </a>
        <p className="text-xs" style={{ color: "var(--seif-gray-500)" }}>
          © 2026 Seif Studios. All rights reserved.
        </p>
      </footer>

      {/* floating: back to the studio */}
      <button
        type="button"
        className="seif-back-float"
        data-cursor="Home"
        aria-label="Back to the studio"
        onClick={() => navigate({ to: "/" })}
      >
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span>Studio</span>
      </button>
    </main>
  );
}
