import { useEffect, useRef } from "react";

/* Page ambience: cinematic film grain over everything + a red scroll
   progress hairline at the very top. Pure chrome; no layout impact. */
export function Ambience() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className="seif-grain" aria-hidden="true" />
      <div className="seif-progress" aria-hidden="true">
        <div ref={barRef} />
      </div>
    </>
  );
}
