import { CONTACT } from "../data/content";

/* Contact: the giant statement with the oversized red period (the page's
   second-read moment), a huge mono mailto, and the minimal footer bar. */
export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative flex flex-col overflow-hidden px-6 pt-36 md:px-14"
    >
      <div className="relative z-10 flex flex-1 flex-col items-center py-20 text-center">
        <h2
          className="seif-display"
          style={{ fontSize: "clamp(3rem, 10vw, 9rem)", lineHeight: 1 }}
        >
          Let&rsquo;s Create
          <span
            aria-hidden="true"
            style={{
              color: "var(--seif-red)",
              textShadow: "0 0 34px rgba(255,0,0,0.65)",
            }}
          >
            .
          </span>
        </h2>
        <p className="mt-8 text-base" style={{ color: "var(--seif-gray-300)" }}>
          Email us to discuss your project.
        </p>
        <a
          href={`mailto:${CONTACT.email}`}
          className="seif-mailto mt-6"

        >
          {CONTACT.email}
        </a>
        <p className="mt-10 text-sm" style={{ color: "var(--seif-gray-500)" }}>
          {CONTACT.location}
        </p>
        <a
          href={CONTACT.instagram}
          target="_blank"
          rel="noreferrer"
          className="mt-6 transition-transform duration-300 hover:scale-110"
          aria-label="Seif Studios on Instagram"
        >
          <img
            src="/assets/Logo/instagram.svg"
            alt=""
            style={{ width: 26, height: 26, filter: "invert(1)" }}
          />
        </a>
      </div>

      {/* giant outlined sign-off */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative z-10 -mb-4 flex justify-center overflow-hidden"
      >
        <span className="seif-watermark" style={{ fontSize: "clamp(4rem, 12.5vw, 12rem)" }}>
          SEIF STUDIOS
        </span>
      </div>

      <footer
        className="relative z-10 flex flex-col items-center justify-between gap-4 py-8 sm:flex-row"
        style={{ borderTop: "1px solid var(--seif-gray-700)" }}
      >
        <img
          src="/assets/Logo/LogoSSWhite1.2.png"
          alt="Seif Studios"
          style={{ height: 13, width: "auto" }}
        />
        <p className="text-xs" style={{ color: "var(--seif-gray-500)" }}>
          © 2026 Seif Studios. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${CONTACT.email}`}
            className="seif-nav-link"
            style={{ fontSize: "0.75rem" }}
          >
            {CONTACT.email}
          </a>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noreferrer"
            className="seif-nav-link"
            style={{ fontSize: "0.75rem" }}
          >
            Instagram
          </a>
        </div>
      </footer>
    </section>
  );
}
