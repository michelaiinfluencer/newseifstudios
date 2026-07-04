import { useEffect, useRef } from "react";
import { ScrollTrigger, prefersReducedMotion } from "../lib/motion";

/* Selected reel: a pinned full-bleed WebGL plane where five signature
   pieces melt into each other as you scroll. The transition displaces both
   images along the brand's red-streak plate, with a red flash at the seam.
   Reduced motion / no WebGL: a static stack of the first image. */

const PIECES = [
  { src: "/assets/Image/Images/PortfolioImageImage4.jpg", title: "Nocturne" },
  { src: "/assets/Image/Models/PortfolioModelImage2.jpg", title: "Cipher" },
  { src: "/assets/Image/Avatars/PortfolioAvatarImage4.jpg", title: "Hologram" },
  { src: "/assets/Image/Lookbooks/PortfolioLookbookImage5.jpg", title: "Capsule" },
  { src: "/assets/Image/Products/PortfolioProductImage4.jpg", title: "Center Stage" },
];
const DISP = "/assets/generated/texture-streaks.jpg";

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform sampler2D uDisp;
uniform float uMix;
uniform vec2 uScaleA;
uniform vec2 uScaleB;

vec2 cover(vec2 uv, vec2 s) { return (uv - 0.5) * s + 0.5; }

void main() {
  float d = texture2D(uDisp, vUv).r;
  float m = uMix;
  vec2 offA = vec2(d * m * 0.35, 0.0);
  vec2 offB = vec2(-d * (1.0 - m) * 0.35, 0.0);
  vec4 a = texture2D(uA, cover(vUv, uScaleA) + offA);
  vec4 b = texture2D(uB, cover(vUv, uScaleB) + offB);
  float edge = smoothstep(0.0, 0.5, m) * smoothstep(1.0, 0.5, m);
  vec4 col = mix(a, b, smoothstep(0.2, 0.8, m + (d - 0.5) * 0.4));
  col.rgb += vec3(1.0, 0.0, 0.0) * edge * d * 0.55;
  gl_FragColor = col;
}`;

export function SelectedReel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    if (prefersReducedMotion()) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    canvas.style.display = "block";

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uA = gl.getUniformLocation(prog, "uA");
    const uB = gl.getUniformLocation(prog, "uB");
    const uDisp = gl.getUniformLocation(prog, "uDisp");
    const uMix = gl.getUniformLocation(prog, "uMix");
    const uScaleA = gl.getUniformLocation(prog, "uScaleA");
    const uScaleB = gl.getUniformLocation(prog, "uScaleB");
    gl.uniform1i(uA, 0);
    gl.uniform1i(uB, 1);
    gl.uniform1i(uDisp, 2);

    type Tex = { tex: WebGLTexture; w: number; h: number };
    const textures: Array<Tex | null> = new Array(PIECES.length + 1).fill(null);
    const makeTex = (img: HTMLImageElement): Tex => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      return { tex, w: img.naturalWidth, h: img.naturalHeight };
    };
    let killed = false;
    let progress = 0;
    let raf = 0;

    const srcs = [...PIECES.map((p) => p.src), DISP];
    srcs.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (killed) return;
        textures[i] = makeTex(img);
        render();
      };
    });

    const coverScale = (t: Tex | null, w: number, h: number): [number, number] => {
      if (!t) return [1, 1];
      const cAspect = w / h;
      const iAspect = t.w / t.h;
      return cAspect > iAspect ? [1, iAspect / cAspect] : [cAspect / iAspect, 1];
    };

    const render = () => {
      if (killed) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      const seg = Math.min(PIECES.length - 2, Math.floor(progress * (PIECES.length - 1)));
      const local = progress * (PIECES.length - 1) - seg;
      const a = textures[seg];
      const b = textures[seg + 1];
      const disp = textures[PIECES.length];
      if (!a || !b || !disp) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, a.tex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, b.tex);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, disp.tex);
      const sa = coverScale(a, w, h);
      const sb = coverScale(b, w, h);
      gl.uniform2f(uScaleA, sa[0], sa[1]);
      gl.uniform2f(uScaleB, sb[0], sb[1]);
      gl.uniform1f(uMix, local);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      const idx = Math.min(PIECES.length - 1, Math.round(progress * (PIECES.length - 1)));
      if (labelRef.current) {
        const want = `${String(idx + 1).padStart(2, "0")}  ${PIECES[idx].title}`;
        if (labelRef.current.textContent !== want) labelRef.current.textContent = want;
      }
    };

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => {
        progress = self.progress;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(render);
      },
    });
    const onResize = () => render();
    window.addEventListener("resize", onResize);

    return () => {
      killed = true;
      st.kill();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={wrapRef} style={{ height: "320vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          overflow: "hidden",
        }}
      >
        {/* static fallback under the canvas */}
        <img
          src={PIECES[0].src}
          alt="Selected work reel"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "none",
          }}
          aria-hidden="true"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 30%), linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 16%)",
          }}
          aria-hidden="true"
        />
        <div className="absolute bottom-10 left-6 right-6 flex items-end justify-between md:left-14 md:right-14">
          <div>
            <p className="seif-mono" style={{ color: "var(--seif-gray-300)" }}>
              Selected
            </p>
            <span
              ref={labelRef}
              className="seif-display mt-2 block"
              style={{ fontSize: "clamp(1.6rem, 4vw, 3.2rem)" }}
            >
              01 Nocturne
            </span>
          </div>
          <span className="seif-mono hidden md:block" style={{ color: "var(--seif-gray-500)" }}>
            Keep scrolling, the work melts forward
          </span>
        </div>
      </div>
    </section>
  );
}
