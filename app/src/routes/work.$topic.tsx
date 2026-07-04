import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { installMotion, gsap, prefersReducedMotion } from "../lib/motion";
import { Cursor } from "../components/Cursor";
import { Ambience } from "../components/Ambience";
import { Gallery } from "../components/Gallery";
import { WORK_CHAPTERS, CONTACT } from "../data/content";

export const Route = createFileRoute("/work/$topic")({
  loader: ({ params }) => {
    const chapter = WORK_CHAPTERS.find((c) => c.id === params.topic);
    if (!chapter) throw notFound();
    return { chapter };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.chapter.title}, Seif Studios` },
          { name: "description", content: loaderData.chapter.sub },
        ]
      : [],
  }),
  component: TopicPage,
});

function TopicPage() {
  const { chapter } = Route.useLoaderData();
  const navigate = useNavigate();
  const idx = WORK_CHAPTERS.findIndex((c) => c.id === chapter.id);
  const next = WORK_CHAPTERS[(idx + 1) % WORK_CHAPTERS.length];
  const prev = WORK_CHAPTERS[(idx - 1 + WORK_CHAPTERS.length) % WORK_CHAPTERS.length];

  useEffect(() => installMotion(), []);

  useEffect(() => {
    window.scrollTo(0, 0);
    // the card-click overlay has already shrunk into the cover slot: fade it
    document
      .querySelectorAll<HTMLElement>("body > div[style*='z-index: 9000']")
      .forEach((el) => {
        gsap.to(el, { opacity: 0, duration: 0.3, delay: 0.05, onComplete: () => el.remove() });
      });
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline();
    const title = document.querySelector("[data-topic-title]");
    const meta = document.querySelector("[data-topic-meta]");
    if (title) tl.from(title, { y: 90, duration: 0.9, ease: "power4.out" }, 0.05);
    if (meta) tl.from(meta, { y: 30, duration: 0.7, ease: "power3.out" }, 0.25);
    return () => {
      tl.kill();
    };
  }, [chapter.id]);

  const goTo = (id: string) => navigate({ to: "/work/$topic", params: { topic: id } });

  return (
    <main className="seif min-h-dvh">
      <Ambience />
      <Cursor />

      {/* header: title left, cover docked top right (the card lands here) */}
      <header className="relative px-6 pt-5 md:px-14">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="Seif Studios home" data-cursor="Home">
            <img
              src="/assets/Logo/logo3.2.png"
              alt="Seif Studios"
              style={{ height: 52, width: "auto" }}
            />
          </Link>
          <Link to="/" hash="work" className="seif-nav-link">
            All Work
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7 lg:col-span-8">
            <p className="seif-mono" style={{ color: "var(--seif-red)" }}>
              {chapter.num} / 07
            </p>
            <div style={{ overflow: "hidden" }}>
              <h1
                data-topic-title
                className="seif-display mt-3"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.6rem)" }}
              >
                {chapter.title}
              </h1>
            </div>
            <div data-topic-meta>
              <p
                className="mt-5 max-w-md text-base leading-relaxed"
                style={{ color: "var(--seif-gray-300)" }}
              >
                {chapter.sub}
              </p>
              <p className="seif-mono mt-5" style={{ color: "var(--seif-gray-500)" }}>
                {chapter.pieces.length} pieces
              </p>
            </div>
          </div>

          {/* the cover slot the clicked card shrinks into */}
          <div className="hidden justify-end md:col-span-5 md:flex lg:col-span-4">
            <div
              className="seif-cover-frame"
              style={{ width: "min(24vw, 340px)", alignSelf: "flex-start" }}
            >
              <div style={{ aspectRatio: "3/4" }}>
                {chapter.coverKind === "video" ? (
                  <video
                    src={chapter.cover}
                    poster={chapter.coverPoster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src={chapter.cover}
                    alt={chapter.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* gallery */}
      <section className="px-6 py-16 md:px-14">
        <Gallery pieces={chapter.pieces} />
      </section>

      {/* navigation: previous / all / next */}
      <section
        className="px-6 py-16 md:px-14"
        style={{ borderTop: "1px solid var(--seif-gray-700)" }}
      >
        <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-3">
          <button
            type="button"
            className="group text-left"
            data-cursor="Back"
            onClick={() => goTo(prev.id)}
          >
            <span className="seif-mono flex items-center gap-2" style={{ color: "var(--seif-gray-500)" }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Previous
            </span>
            <span
              className="seif-display mt-2 block transition-colors duration-300 group-hover:text-[#ff0000]"
              style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.8rem)" }}
            >
              {prev.title}
            </span>
          </button>

          <div className="text-center">
            <Link to="/" hash="work" className="seif-btn-frame" data-cursor="All">
              All Work
            </Link>
          </div>

          <button
            type="button"
            className="group text-right"
            data-cursor="Next"
            onClick={() => goTo(next.id)}
          >
            <span
              className="seif-mono flex items-center justify-end gap-2"
              style={{ color: "var(--seif-gray-500)" }}
            >
              Next
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <span
              className="seif-display mt-2 block transition-colors duration-300 group-hover:text-[#ff0000]"
              style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.8rem)" }}
            >
              {next.title}
            </span>
          </button>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6">
          <a href={`mailto:${CONTACT.email}`} className="seif-nav-link">
            {CONTACT.email}
          </a>
          <p className="text-xs" style={{ color: "var(--seif-gray-500)" }}>
            © 2026 Seif Studios. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}
