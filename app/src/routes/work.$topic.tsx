import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { installMotion, gsap, prefersReducedMotion } from "../lib/motion";
import { Cursor } from "../components/Cursor";
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

  // arrival: clear any leftover expansion overlay from the card click,
  // then reveal the header (transform/clip only, fires on mount)
  useEffect(() => {
    document
      .querySelectorAll<HTMLElement>("body > div[style*='z-index: 9000']")
      .forEach((el) => {
        gsap.to(el, { opacity: 0, duration: 0.5, delay: 0.15, onComplete: () => el.remove() });
      });
    if (prefersReducedMotion()) return;
    const title = document.querySelector<HTMLElement>("[data-topic-title]");
    const cover = document.querySelector<HTMLElement>("[data-topic-cover]");
    const tl = gsap.timeline();
    if (cover) tl.from(cover, { scale: 1.12, duration: 1.1, ease: "power3.out" }, 0);
    if (title) tl.from(title, { y: 80, duration: 0.9, ease: "power4.out" }, 0.1);
    return () => {
      tl.kill();
    };
  }, [chapter.id]);

  // scroll to top on topic change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapter.id]);

  return (
    <main className="seif min-h-dvh">
      <Cursor />

      {/* cover header */}
      <header className="relative overflow-hidden" style={{ height: "72dvh" }}>
        <div data-topic-cover className="absolute inset-0">
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
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.25) 100%)",
          }}
        />
        <div className="absolute left-0 right-0 top-0 z-10 flex h-16 items-center justify-between px-6 md:px-14">
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
        <div className="absolute bottom-10 left-6 right-6 md:left-14 md:right-14">
          <div style={{ overflow: "hidden" }}>
            <h1
              data-topic-title
              className="seif-display"
              style={{ fontSize: "clamp(2.4rem, 7vw, 6rem)" }}
            >
              <span className="seif-mono mr-4" style={{ color: "var(--seif-red)", fontSize: "0.4em", verticalAlign: "super" }}>
                {chapter.num}
              </span>
              {chapter.title}
            </h1>
          </div>
          <p
            className="mt-4 max-w-xl text-base leading-relaxed"
            style={{ color: "var(--seif-gray-300)" }}
          >
            {chapter.sub}
          </p>
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
