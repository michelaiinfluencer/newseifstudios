import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { installMotion, scrollToTarget, scrollToTop, gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { Loader } from "../components/Loader";
import { Cursor } from "../components/Cursor";
import { Ambience } from "../components/Ambience";
import { Nav } from "../components/Nav";
import { Hero3D } from "../components/Hero3D";
import { CardDeck } from "../components/CardDeck";
import { AIStack } from "../components/AIStack";
import { DeliveryWeek } from "../components/DeliveryWeek";
import { ProcessSection } from "../components/ProcessSection";
import { ContactSection } from "../components/ContactSection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Lenis + GSAP bridge (client-only side effect)
  useEffect(() => installMotion(), []);

  // A fresh load / refresh always starts at the very top; only when a hash is
  // present (the gallery's "Studio" button returns to /#work) do we jump to
  // that section. Jumping THROUGH Lenis keeps it in sync, and the refresh
  // recomputes every scroll-reveal so nothing stays stuck after a nav back.
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    // run twice: once quickly, once after Lenis + layout have settled, so a
    // browser-restored scroll can't leave us parked on a lower section.
    const jump = () => {
      if (h && document.getElementById(h)) scrollToTarget(`#${h}`, true);
      else scrollToTop();
      ScrollTrigger.refresh();
    };
    const t1 = setTimeout(jump, 60);
    const t2 = setTimeout(jump, 350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // hero headline build (desktop only): the mobile hero has its own plain,
  // minimalistic headline.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const h1 = document.querySelector<HTMLElement>("h1.seif-display");
    if (!h1 || h1.dataset.split === "1") return;
    h1.dataset.split = "1";
    const original = h1.textContent ?? "";
    h1.textContent = "";
    const words: HTMLElement[] = [];
    original.split(" ").forEach((word, i, arr) => {
      const wrap = document.createElement("span");
      wrap.style.cssText =
        "display:inline-block;overflow:hidden;vertical-align:top;" +
        (i < arr.length - 1 ? "margin-right:0.24em;" : "");
      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.textContent = word;
      wrap.appendChild(inner);
      h1.appendChild(wrap);
      words.push(inner);
    });
    const tween = gsap.from(words, {
      yPercent: 110,
      duration: 1.0,
      ease: "power4.out",
      stagger: 0.07,
      delay: 2.4,
    });
    return () => {
      tween.kill();
      h1.textContent = original;
      delete h1.dataset.split;
    };
  }, []);

  return (
    <main className="seif min-h-dvh">
      <Loader />
      <Ambience />
      <Cursor />
      <Nav />
      <Hero3D />
      <CardDeck />
      <DeliveryWeek />
      <AIStack />
      {/* "How We Turn Ideas Into Visuals" hidden for now */}
      {false && <ProcessSection />}
      <ContactSection />
    </main>
  );
}
