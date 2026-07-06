import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { installMotion, gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { Ambience } from "../components/Ambience";
import { Cursor } from "../components/Cursor";
import { CONTACT } from "../data/content";

export const Route = createFileRoute("/price")({
  head: () => ({
    meta: [
      { title: "Seif Studios | Pricing" },
      {
        name: "description",
        content:
          "Premium AI creative production, model casting, visual campaigns and motion design pricing.",
      },
    ],
  }),
  component: PricePage,
});

/* ── content ─────────────────────────────────────────────── */
const CREATIVE = [
  "2–3 visual concepts",
  "Defined aesthetic direction",
  "References & moodboard",
  "Concept overview",
];
const CASTING = [
  "Curated model selection",
  "Up to 5 options",
  "Aesthetic matching",
  "Final production selection",
];
const PRODUCTION = [
  {
    name: "Basic",
    price: "€1,500–2,200",
    featured: false,
    features: ["15–20 visuals", "Limited variations", "One format", "Campaign"],
  },
  {
    name: "Premium",
    price: "€2,200–4,000",
    featured: true,
    features: ["25–35 visuals", "Multiple formats", "Variations", "1–2 revisions"],
  },
  {
    name: "Priority",
    price: "€5,000+",
    featured: false,
    features: ["40+ visuals", "Full campaign system", "Storytelling"],
  },
];
const MOTION = [
  {
    name: "Video Add-on",
    price: "€450",
    features: [
      "One short-form video",
      "10–15 seconds",
      "Based on campaign visuals",
      "Optimized for social media",
      "Light motion",
      "One refinement round",
    ],
  },
  {
    name: "Campaign Motion Package",
    price: "€1,200–2,200",
    features: [
      "3–6 videos",
      "Multiple scenes",
      "Storytelling",
      "Reels & ads",
      "Cohesive campaign style",
      "1–2 refinement rounds",
    ],
  },
];

/* ── little pieces ───────────────────────────────────────── */
function Features({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((f) => (
        <li key={f} className="seif-price-feat">
          {f}
        </li>
      ))}
    </ul>
  );
}

function ServiceSection({
  num,
  title,
  items,
  price,
  priceNote,
  timeline,
}: {
  num: string;
  title: string;
  items: string[];
  price: string;
  priceNote?: string;
  timeline: string;
}) {
  return (
    <section className="px-6 py-20 md:px-14 md:py-28" style={{ borderTop: "1px solid var(--seif-gray-700)" }}>
      <div className="mx-auto max-w-6xl">
        <p className="seif-eyebrow" data-reveal="0">
          {num}
        </p>
        <h2 className="seif-display seif-h2 mt-4" data-reveal="0.05">
          {title}
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7" data-reveal="0.1">
            <Features items={items} />
          </div>
          <div className="md:col-span-5" data-reveal="0.16">
            <div className="seif-price-card">
              <p className="seif-price-tier">Price</p>
              <p className="seif-price-amount mt-2">
                {price}
                {priceNote ? <span className="seif-price-amount-note"> {priceNote}</span> : null}
              </p>
              <div className="my-6 h-px" style={{ background: "var(--seif-gray-700)" }} />
              <p className="seif-price-tier">Timeline</p>
              <p className="mt-2 text-base font-medium">{timeline}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── page ────────────────────────────────────────────────── */
function PricePage() {
  const navigate = useNavigate();

  useEffect(() => installMotion(), []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // fade + slide-up reveals, staggered where marked. Robust play-on-enter:
  // an onEnter callback plus a force-show fallback for anything already in view.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    const sts: ScrollTrigger[] = [];
    els.forEach((el) => {
      const delay = parseFloat(el.dataset.reveal || "0") || 0;
      gsap.set(el, { opacity: 0, y: 30 });
      let done = false;
      const show = (d: number) => {
        if (done) return;
        done = true;
        gsap.to(el, { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", delay: d });
      };
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => show(delay),
      });
      if (el.getBoundingClientRect().top < window.innerHeight) show(delay * 0.5);
      sts.push(st);
    });
    return () => {
      sts.forEach((s) => s.kill());
      gsap.killTweensOf(els);
    };
  }, []);

  return (
    <main className="seif seif-price min-h-dvh">
      <Ambience />
      <Cursor />

      {/* back to the homepage (direct navigation, never history) */}
      <button
        type="button"
        className="seif-price-back"
        data-cursor="Home"
        aria-label="Back to homepage"
        onClick={() => navigate({ to: "/" })}
      >
        <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span>Home</span>
      </button>

      {/* HERO */}
      <section className="relative flex min-h-[82vh] flex-col justify-center px-6 pt-32 pb-16 md:px-14">
        <div className="seif-price-glow" aria-hidden="true" />
        <p className="seif-eyebrow" data-reveal="0">
          Seif Studios / Pricing
        </p>
        <h1 className="seif-display mt-6" style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }} data-reveal="0.06">
          Pricing &amp; Services
        </h1>
        <p
          className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg"
          style={{ color: "var(--seif-gray-300)" }}
          data-reveal="0.12"
        >
          Transparent pricing for creative direction, AI campaigns, model casting, visuals and motion.
        </p>
      </section>

      {/* 01 — CREATIVE DIRECTION */}
      <ServiceSection
        num="Section 01"
        title="Creative Direction"
        items={CREATIVE}
        price="€200"
        timeline="2–4 working days"
      />

      {/* 02 — MODEL CASTING */}
      <ServiceSection
        num="Section 02"
        title="Model Casting"
        items={CASTING}
        price="€250"
        priceNote="per model"
        timeline="1–2 working days"
      />

      {/* 03 — VISUAL PRODUCTION */}
      <section className="px-6 py-20 md:px-14 md:py-28" style={{ borderTop: "1px solid var(--seif-gray-700)" }}>
        <div className="mx-auto max-w-6xl">
          <p className="seif-eyebrow" data-reveal="0">
            Section 03
          </p>
          <h2 className="seif-display seif-h2 mt-4" data-reveal="0.05">
            Visual Production
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PRODUCTION.map((t, i) => (
              <div
                key={t.name}
                className={`seif-price-card${t.featured ? " seif-price-card--featured" : ""}`}
                data-reveal={String(0.06 + i * 0.08)}
              >
                <h3 className="seif-price-tier">{t.name}</h3>
                <p className="seif-price-amount mt-2">{t.price}</p>
                <div className="my-6 h-px" style={{ background: "var(--seif-gray-700)" }} />
                <Features items={t.features} />
              </div>
            ))}
          </div>
          <p className="mt-8 seif-price-tier">Timeline · 10–30 working days</p>
        </div>
      </section>

      {/* 04 — MOTION & VIDEO */}
      <section className="px-6 py-20 md:px-14 md:py-28" style={{ borderTop: "1px solid var(--seif-gray-700)" }}>
        <div className="mx-auto max-w-6xl">
          <p className="seif-eyebrow" data-reveal="0">
            Section 04
          </p>
          <h2 className="seif-display seif-h2 mt-4" data-reveal="0.05">
            Motion &amp; Video
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {MOTION.map((m, i) => (
              <div key={m.name} className="seif-price-card" data-reveal={String(0.06 + i * 0.08)}>
                <h3 className="seif-price-tier">{m.name}</h3>
                <p className="seif-price-amount mt-2">{m.price}</p>
                <div className="my-6 h-px" style={{ background: "var(--seif-gray-700)" }} />
                <Features items={m.features} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="relative overflow-hidden px-6 py-32 text-center md:px-14 md:py-44"
        style={{ borderTop: "1px solid var(--seif-gray-700)" }}
      >
        <div className="seif-price-glow" aria-hidden="true" />
        <h2
          className="seif-display relative z-10 mx-auto max-w-4xl"
          style={{ fontSize: "clamp(2.4rem, 7vw, 6rem)", lineHeight: 1.02 }}
          data-reveal="0"
        >
          Let&rsquo;s Create Something Extraordinary
          <span aria-hidden="true" style={{ color: "var(--seif-red)", textShadow: "0 0 34px rgba(255,0,0,0.65)" }}>
            .
          </span>
        </h2>
        <div className="relative z-10 mt-12 flex justify-center" data-reveal="0.1">
          <a href={`mailto:${CONTACT.email}`} className="seif-cta-pill" data-cursor="Email">
            Contact Us
          </a>
        </div>
        <p className="relative z-10 mt-8 seif-price-tier" data-reveal="0.16">
          {CONTACT.email}
        </p>
      </section>

      {/* minimal footer, matching the rest of the site */}
      <footer
        className="mx-6 flex flex-wrap items-center justify-between gap-6 py-10 md:mx-14"
        style={{ borderTop: "1px solid var(--seif-gray-700)" }}
      >
        <a href={`mailto:${CONTACT.email}`} className="seif-nav-link">
          {CONTACT.email}
        </a>
        <p className="text-xs" style={{ color: "var(--seif-gray-500)" }}>
          © 2026 Seif Studios. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
