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

  useEffect(() => installMotion(), []);

  useEffect(() => {
    window.scrollTo(0, 0);
    // clear the card-expansion overlay left by the deck
    document
      .querySelectorAll<HTMLElement>("body > div[style*='z-index: 9000']")
      .forEach((el) => {
        gsap.to(el, { opacity: 0, duration: 0.5, delay: 0.1, onComplete: () => el.remove() });
      });
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline();
    const title = document.querySelector("[data-topic-title]");
    const frame = document.querySelector("[data-topic-frame]");
    const meta = document.querySelector("[data-topic-meta]");
    if (title) tl.from(title, { y: 90, duration: 0.9, ease: "power4.out" }, 0.1);
    if (frame)
      tl.from(frame, { x: 80, rotationY: -24, duration: 1.1, ease: "power3.out" }, 0.15);
    if (meta) tl.from(meta, { y: 30, duration: 0.7, ease: "power3.out" }, 0.35);
    return () => {
      tl.kill();
    };
  }, [chapter.id]);

  return (
    <main className="seif min-h-dvh">
      <Ambience />
      <Cursor />

      {/* header: split panel, cover uncropped in a floating 3D frame */}
      <header className="relative overflow-hidden px-6 pt-16 md:px-14" style={{ minHeight: "88dvh" }}>
        {/* giant stroked chapter number as backdrop */}
        <span
          aria-hidden="true"
          className="seif-watermark pointer-events-none absolute -top-6 right-2 md:right-10"
          style={{ fontSize: "clamp(9rem, 28vw, 24rem)", WebkitTextStroke: "1px rgba(255,0,0,0.22)" }}
        >
          {chapter.num}
        </span>

        <div className="relative z-10 flex h-14 items-center justify-between">
          <Link to="/" aria-label="Seif Studios home" data-cursor="Back">
            <img
              src="/assets/Logo/LogoSSWhite1.2.png"
              alt="Seif Studios"
              style={{ height: 16, width: "auto" }}
            />
          </Link>
          <Link to="/" hash="work" className="seif-nav-link">
            All Work
          </Link>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-1 items-center gap-12 md:mt-12 md:grid-cols-2">
          <div>
            <p className="seif-mono" style={{ color: "var(--seif-red)" }}>
              {chapter.num} / 07
            </p>
            <div style={{ overflow: "hidden" }}>
              <h1
                data-topic-title
                className="seif-display mt-3"
                style={{ fontSize: "clamp(2.6rem, 5.5vw, 5rem)" }}
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
              <p className="seif-mono mt-6" style={{ color: "var(--seif-gray-500)" }}>
                {chapter.pieces.length} pieces
              </p>
            </div>
          </div>

          <div className="seif-cover-frame mx-auto w-full max-w-md">
            <div data-topic-frame style={{ aspectRatio: "4/5" }}>
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
      </header>

      {/* gallery */}
      <section className="px-6 py-20 md:px-14">
        <Gallery pieces={chapter.pieces} />
      </section>

      {/* next topic */}
      <section
        className="px-6 py-24 md:px-14"
        style={{ borderTop: "1px solid var(--seif-gray-700)" }}
      >
        <p className="seif-mono" style={{ color: "var(--seif-gray-500)" }}>
          Next
        </p>
        <button
          type="button"
          className="group mt-3 block text-left"
          data-cursor="Open"
          onClick={() => navigate({ to: "/work/$topic", params: { topic: next.id } })}
        >
          <span
            className="seif-display transition-colors duration-300 group-hover:text-[#ff0000]"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.4rem)" }}
          >
            {next.title}
          </span>
        </button>
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
