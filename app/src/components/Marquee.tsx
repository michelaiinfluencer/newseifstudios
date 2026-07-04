export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <div
      className="flex items-center gap-10"
      aria-hidden={hidden || undefined}
      style={{ flexShrink: 0 }}
    >
      {items.map((it, i) => (
        <span key={i} className="seif-mono flex items-center gap-10" style={{ color: "var(--seif-gray-500)" }}>
          {it}
          <span style={{ color: "var(--seif-red)" }}>·</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="seif-marquee" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
      <div className="seif-marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
