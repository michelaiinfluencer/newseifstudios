import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { WORK_CHAPTERS, type WorkChapter } from "../data/content";

/* V3: the disciplines are a ONE-LINE carousel. The section pins (sticky, no
   pin-spacer) and vertical scroll drives the rail: each next card slides in
   from the right and settles in the center, with snap per card. The centered
   card is full strength, neighbors recede slightly. Click travels into the
   card's gallery. Touch devices get a native swipe rail instead. */

const N = WORK_CHAPTERS.length;

function Card({ ch, index }: { ch: WorkChapter; index: number }) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // video covers play automatically while the card is on screen
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "80px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const open = () => {
    const card = cardRef.current;
    const go = () => navigate({ to: "/work", hash: ch.id });
    if (!card || prefersReducedMotion()) return go();
    const r = card.getBoundingClientRect();
    const overlay = document.createElement("div");
    overlay.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:9000;overflow:hidden;background:#fff;border-radius:14px;box-shadow:0 30px 80px rgba(17,17,19,0.25);`;
    const img = document.createElement("img");
    img.src = ch.coverKind === "video" ? (ch.coverPoster ?? ch.cover) : ch.cover;
    img.style.cssText = "width:100%;height:100%;object-fit:cover;";
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    gsap
      .timeline()
      .to(overlay, { scale: 1.07, duration: 0.16, ease: "power2.out" })
      .to(overlay, {
        opacity: 0,
        filter: "blur(14px)",
        scale: 1.16,
        duration: 0.34,
        ease: "power2.in",
        onComplete: () => {
          overlay.remove();
          go();
        },
      });
  };

  return (
    <div className="seif-rail-slide" data-rail-slide>
      <div
        ref={cardRef}
        className="seif-card"
        data-cursor="Open"
        role="link"
        tabIndex={0}
        aria-label={`${ch.title}: open gallery`}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") open();
        }}
      >
        <div className="seif-card-media">
          {ch.coverKind === "video" ? (
            <video
              ref={videoRef}
              src={ch.cover}
              poster={ch.coverPoster}
              muted
              loop
              playsInline
              preload="metadata"
              autoPlay
            />
          ) : (
            <img src={ch.cover} alt={ch.title} loading={index < 3 ? "eager" : "lazy"} />
          )}
          <div className="seif-card-glare" />
        </div>
        <span className="seif-card-num">{ch.num}</span>
        <div className="seif-card-meta">
          <h3 className="seif-display" style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)" }}>
            {ch.title}
          </h3>
          <p className="seif-card-count seif-mono">
            {ch.pieces.length} pieces
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}

export function CardDeck() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches) return; // touch: native swipe
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    let step = 0;
    let focal = 0;
    const measure = () => {
      const slides = track.querySelectorAll<HTMLElement>("[data-rail-slide]");
      if (slides.length < 2) return;
      step = slides[1].offsetLeft - slides[0].offsetLeft;
      // anchor the first card toward the LEFT with a little breathing room
      const first = slides[0];
      const lead = Math.max(28, window.innerWidth * 0.06);
      track.style.paddingLeft = `${lead}px`;
      focal = lead + first.offsetWidth / 2;
    };
    measure();

    const setX = gsap.quickSetter(track, "x", "px");
    const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-rail-slide]"));

    // no snap and a tight scrub: the rail stops exactly when the user stops
    const st = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        const x = -self.progress * (N - 1) * step;
        setX(x);
        // flat rail: distance from the left focal card dims and gently shrinks
        slides.forEach((s) => {
          const r = s.getBoundingClientRect();
          const d = Math.min(1.4, Math.abs(r.left + r.width / 2 - focal) / (step || 1));
          const card = s.firstElementChild as HTMLElement;
          card.style.transform = `scale(${1 - Math.min(0.05, d * 0.04)})`;
          // edge shading: cards darken as they near the screen sides
          card.style.filter = `brightness(${1 - Math.min(0.45, d * 0.32)})`;
          card.classList.toggle("is-center", d < 0.5);
        });
        const idx = Math.round(self.progress * (N - 1)) + 1;
        if (counterRef.current) {
          counterRef.current.textContent = `0${idx} / 0${N}`;
        }
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${self.progress})`;
        }
      },
    });
    const onResize = () => {
      measure();
      st.refresh();
    };
    window.addEventListener("resize", onResize);
    return () => {
      st.kill();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="work">
      <div ref={outerRef} className="seif-rail-outer">
        <div className="seif-rail-sticky">
          <div className="seif-rail-glow" aria-hidden="true" />
          <div className="flex items-end justify-between px-6 pt-24 md:px-14">
            <div>
              <h2 className="seif-display seif-h2">
                Seven Ways We Create
              </h2>
              <p className="mt-3 max-w-md text-base" style={{ color: "var(--seif-gray-300)" }}>
                Scroll through the disciplines. Open one to enter its gallery.
              </p>
            </div>
            <div className="hidden text-right md:block">
              <span ref={counterRef} className="seif-mono" style={{ color: "var(--seif-gray-300)" }}>
                01 / 0{N}
              </span>
              <div
                className="mt-2 h-px w-40 origin-left"
                style={{ background: "var(--seif-gray-700)" }}
              >
                <div
                  ref={barRef}
                  className="h-px origin-left"
                  style={{ background: "var(--seif-red)", transform: "scaleX(0)" }}
                />
              </div>
            </div>
          </div>
          <div ref={trackRef} className="seif-rail-track">
            {WORK_CHAPTERS.map((ch, i) => (
              <Card key={ch.id} ch={ch} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
