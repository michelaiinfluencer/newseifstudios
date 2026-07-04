import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import SplitType from "split-type";
import { installMotion, gsap, prefersReducedMotion } from "../lib/motion";
import { Loader } from "../components/Loader";
import { Cursor } from "../components/Cursor";
import { Nav } from "../components/Nav";
import { HeroScrub } from "../components/HeroScrub";
import { WorkSection } from "../components/WorkSection";
import { ServicesIndex } from "../components/ServicesIndex";
import { ProcessSection } from "../components/ProcessSection";
import { ContactSection } from "../components/ContactSection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Lenis + GSAP bridge (client-only side effect)
  useEffect(() => installMotion(), []);

  // hero headline build: fires ON MOUNT (not viewport-gated), transform-only
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const h1 = document.querySelector<HTMLElement>("h1.seif-display");
    if (!h1) return;
    const split = new SplitType(h1, { types: "words" });
    split.words?.forEach((w) => {
      const wrap = document.createElement("span");
      wrap.style.cssText = "display:inline-block;overflow:hidden;vertical-align:top;";
      w.parentNode?.insertBefore(wrap, w);
      wrap.appendChild(w);
      w.style.display = "inline-block";
    });
    const tween = gsap.from(split.words, {
      yPercent: 110,
      duration: 1.0,
      ease: "power4.out",
      stagger: 0.07,
      delay: 1.5, // lands as the loader wipes away
    });
    return () => {
      tween.kill();
      split.revert();
    };
  }, []);

  return (
    <main className="seif min-h-dvh">
      <Loader />
      <Cursor />
      <Nav />
      <HeroScrub />
      <WorkSection />
      <ServicesIndex />
      <ProcessSection />
      <ContactSection />
    </main>
  );
}
