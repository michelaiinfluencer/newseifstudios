import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { installMotion, gsap, prefersReducedMotion } from "../lib/motion";
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

  // returning from the gallery lands back on the requested section
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (!h) return;
    document.getElementById(h)?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
  }, []);

  // hero headline build: fires ON MOUNT (not viewport-gated), transform-only.
  useEffect(() => {
    if (prefersReducedMotion()) return;
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
      <AIStack />
      <DeliveryWeek />
      <ProcessSection />
      <ContactSection />
    </main>
  );
}
