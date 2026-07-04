import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";

/* The living S: the brand's own liquid glyph on a WebGL plane, waving like
   molten glass. It undulates on a noise field, ripples away from the
   cursor, and churns harder while you scroll. No-WebGL and reduced-motion
   fall back to the static red S. */

const TEX = "/assets/generated/s-red.png";

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
uniform sampler2D uTex;
uniform float uTime;
uniform vec2 uMouse;
uniform float uAmp;
uniform float uIntro;
uniform vec2 uFit;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

void main() {
  // contain-fit the glyph inside the plane
  vec2 uv = (vUv - 0.5) * uFit + 0.5;

  float t = uTime * 0.6;
  // flowing liquid wobble
  vec2 flow = vec2(
    noise(uv * 3.0 + vec2(t, 0.0)) - 0.5,
    noise(uv * 3.0 + vec2(0.0, t * 1.2) + 7.3) - 0.5
  ) * 0.05 * uAmp;
  // cursor ripple pushes the surface away
  vec2 toMouse = uv - uMouse;
  float md = length(toMouse);
  flow += normalize(toMouse + 0.0001) * 0.035 * exp(-6.0 * md) *
          sin(md * 40.0 - uTime * 5.0) * uAmp;
  // intro: the glyph gathers from scattered liquid
  flow *= 1.0 + (1.0 - uIntro) * 6.0;

  vec2 suv = uv + flow;
  if (suv.x < 0.0 || suv.x > 1.0 || suv.y < 0.0 || suv.y > 1.0) {
    gl_FragColor = vec4(0.0);
    return;
  }
  vec4 tex = texture2D(uTex, suv);
  float a = tex.a * uIntro;

  // molten shading: brighter along the flow crests, white-hot sparks
  float shade = noise(suv * 5.0 + vec2(t * 0.7, -t * 0.4));
  vec3 col = mix(vec3(0.45, 0.0, 0.0), vec3(1.0, 0.05, 0.05), shade);
  col += vec3(1.0, 0.65, 0.55) * pow(shade, 6.0) * 0.9;
  // rim glow near the cursor
  col += vec3(1.0, 0.1, 0.1) * exp(-8.0 * md) * 0.4;

  gl_FragColor = vec4(col * a, a);
}`;

export function HeroBlob() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion()) return; // static S fallback stays
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true });
    if (!gl) return;

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
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return; // fallback stays
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const uTex = gl.getUniformLocation(prog, "uTex");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uAmp = gl.getUniformLocation(prog, "uAmp");
    const uIntro = gl.getUniformLocation(prog, "uIntro");
    const uFit = gl.getUniformLocation(prog, "uFit");
    gl.uniform1i(uTex, 0);

    let texW = 1;
    let texH = 1;
    let ready = false;
    const img = new Image();
    img.src = TEX;
    img.onload = () => {
      const tex = gl.createTexture()!;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      texW = img.naturalWidth;
      texH = img.naturalHeight;
      ready = true;
      canvas.style.opacity = "1"; // texture live: reveal, hide fallback
    };

    let raf = 0;
    let killed = false;
    const mouse = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };
    let amp = 1;
    let ampTarget = 1;
    let intro = 0;
    let introTarget = 1;
    let lastScroll = 0;

    const onLoaded = () => {
      introTarget = 1;
    };
    if (document.querySelector(".seif-loader")) {
      introTarget = 0;
      window.addEventListener("seif:loaded", onLoaded, { once: true });
      setTimeout(() => {
        introTarget = 1;
      }, 2600);
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = (e.clientY - r.top) / r.height;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const onScroll = () => {
      const v = Math.min(1.6, Math.abs(window.scrollY - lastScroll) / 60);
      lastScroll = window.scrollY;
      ampTarget = 1 + v * 0.9;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const t0 = performance.now();
    const tick = () => {
      if (killed) return;
      raf = requestAnimationFrame(tick);
      if (!ready) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      smooth.x += (mouse.x - smooth.x) * 0.07;
      smooth.y += (mouse.y - smooth.y) * 0.07;
      amp += (ampTarget - amp) * 0.05;
      ampTarget += (1 - ampTarget) * 0.02;
      intro += (introTarget - intro) * 0.04;
      // contain fit with 12% margin
      const canvasAspect = w / h;
      const texAspect = texW / texH;
      let fx = 1.24;
      let fy = 1.24;
      if (canvasAspect > texAspect) fx = (canvasAspect / texAspect) * 1.24;
      else fy = (texAspect / canvasAspect) * 1.24;
      gl.uniform2f(uFit, fx, fy);
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.uniform2f(uMouse, smooth.x, smooth.y);
      gl.uniform1f(uAmp, amp);
      gl.uniform1f(uIntro, intro);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      killed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("seif:loaded", onLoaded);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* static fallback: the red S as-is */}
      <img
        src={TEX}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "10%",
          width: "80%",
          height: "80%",
          objectFit: "contain",
          filter: "drop-shadow(0 0 60px rgba(255,0,0,0.35))",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          opacity: 0, // revealed once the shader and texture are live
        }}
        aria-label="Liquid red S, the Seif Studios mark"
        role="img"
      />
    </div>
  );
}
