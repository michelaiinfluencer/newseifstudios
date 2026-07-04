import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { installMotion } from "../lib/motion";
import { Cursor } from "../components/Cursor";
import { Ambience } from "../components/Ambience";
import { BallPit } from "../components/BallPit";
import { CONTACT } from "../data/content";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "The Playroom, Seif Studios" },
      {
        name: "description",
        content: "A physics playroom built from Seif Studios work. Flick the pieces around.",
      },
    ],
  }),
  component: PlayPage,
});

function PlayPage() {
  useEffect(() => installMotion(), []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="seif flex min-h-dvh flex-col">
      <Ambience />
      <Cursor />

      <header className="flex h-16 items-center justify-between px-6 md:px-14">
        <Link to="/" aria-label="Seif Studios home">
          <img
            src="/assets/Logo/logo3.2.png"
            alt="Seif Studios"
            style={{ height: 52, width: "auto" }}
          />
        </Link>
        <Link to="/" className="seif-nav-link">
          Back to the Studio
        </Link>
      </header>

      <div className="flex-1">
        <BallPit />
      </div>

      <footer
        className="mt-16 flex flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row md:px-14"
        style={{ borderTop: "1px solid var(--seif-gray-700)" }}
      >
        <p className="text-xs" style={{ color: "var(--seif-gray-500)" }}>
          © 2026 Seif Studios. All rights reserved.
        </p>
        <a href={`mailto:${CONTACT.email}`} className="seif-nav-link" style={{ fontSize: "0.75rem" }}>
          {CONTACT.email}
        </a>
      </footer>
    </main>
  );
}
