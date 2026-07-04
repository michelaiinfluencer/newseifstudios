import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";

/* Interactive 3D hero object: a raymarched liquid blob of red glass,
   original shader work in the brand language. It breathes on its own,
   leans toward the cursor, and its turbulence rises with scroll velocity.
   Inflates from zero as the loader hands off ("seif:loaded" event).
   Touch and reduced-motion get a calm, slowly-breathing version. */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uAmp;
uniform float uIntro;

// simplex-ish 3D noise (hash based, compact)
vec3 hash3(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
           dot(p, vec3(269.5, 183.3, 246.1)),
           dot(p, vec3(113.5, 271.9, 124.6)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(dot(hash3(i), f),
            dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
        mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
            dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
    mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
            dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
        mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
            dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
}

float blobSDF(vec3 p) {
  float t = uTime * 0.35;
  float base = length(p) - 1.0 * uIntro;
  float n = noise(p * 1.9 + vec3(t, t * 0.7, -t * 0.5)) * 0.28
          + noise(p * 4.2 - vec3(t * 1.3, 0.0, t)) * 0.09;
  // cursor pulls the surface toward it
  vec3 m = vec3(uMouse * 1.4, 0.6);
  float pull = 0.22 * exp(-2.5 * length(p - m));
  return base + n * uAmp * uIntro - pull;
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(
    blobSDF(p + e.xyy) - blobSDF(p - e.xyy),
    blobSDF(p + e.yxy) - blobSDF(p - e.yxy),
    blobSDF(p + e.yyx) - blobSDF(p - e.yyx)));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
  vec3 ro = vec3(0.0, 0.0, 3.1);
  vec3 rd = normalize(vec3(uv, -2.0));

  float d = 0.0;
  float dist;
  vec3 p;
  bool hit = false;
  for (int i = 0; i < 80; i++) {
    p = ro + rd * d;
    dist = blobSDF(p);
    if (dist < 0.001) { hit = true; break; }
    d += dist * 0.8;
    if (d > 7.0) break;
  }

  vec3 col = vec3(0.0);
  float alpha = 0.0;
  if (hit) {
    vec3 n = calcNormal(p);
    vec3 l = normalize(vec3(0.6, 0.8, 0.9));
    float diff = max(dot(n, l), 0.0);
    float fres = pow(1.0 - max(dot(n, -rd), 0.0), 2.6);
    vec3 red = vec3(1.0, 0.0, 0.0);
    vec3 deep = vec3(0.28, 0.0, 0.0);
    col = deep * (0.35 + 0.65 * diff);
    col += red * fres * 1.5;
    // white-hot specular core
    vec3 h = normalize(l - rd);
    col += vec3(1.0, 0.85, 0.8) * pow(max(dot(n, h), 0.0), 60.0) * 0.9;
    alpha = 1.0;
  } else {
    // soft red halo behind the blob
    float glow = exp(-2.6 * length(uv - uMouse * 0.12)) * 0.16 * uIntro;
    col = vec3(glow, 0.0, 0.0);
    alpha = glow * 3.0;
  }
  gl_FragColor = vec4(col, alpha);
}`;

export function HeroBlob() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
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
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uAmp = gl.getUniformLocation(prog, "uAmp");
    const uIntro = gl.getUniformLocation(prog, "uIntro");

    const calm = prefersReducedMotion();
    let raf = 0;
    let mouse = { x: 0, y: 0 };
    let smooth = { x: 0, y: 0 };
    let amp = calm ? 0.55 : 0.8;
    let ampTarget = amp;
    let intro = 0; // inflates on loader handoff
    let introTarget = 1;
    let lastScroll = 0;
    let killed = false;

    // wait for the loader; if it already finished (or never ran), start now
    const onLoaded = () => {
      introTarget = 1;
    };
    if (document.querySelector(".seif-loader")) {
      introTarget = 0;
      window.addEventListener("seif:loaded", onLoaded, { once: true });
      // safety: never stay deflated
      setTimeout(() => {
        introTarget = 1;
      }, 2600);
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    if (!calm) window.addEventListener("pointermove", onMove, { passive: true });

    const onScroll = () => {
      const v = Math.min(1.6, Math.abs(window.scrollY - lastScroll) / 60);
      lastScroll = window.scrollY;
      ampTarget = 0.8 + v * 0.5;
    };
    if (!calm) window.addEventListener("scroll", onScroll, { passive: true });

    const t0 = performance.now();
    const tick = () => {
      if (killed) return;
      raf = requestAnimationFrame(tick);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      smooth.x += (mouse.x - smooth.x) * 0.06;
      smooth.y += (mouse.y - smooth.y) * 0.06;
      amp += (ampTarget - amp) * 0.04;
      ampTarget += (0.8 - ampTarget) * 0.02; // settle back after scroll bursts
      intro += (introTarget - intro) * 0.045;
      gl.uniform2f(uRes, w, h);
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
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-label="Interactive red liquid sculpture"
      role="img"
    />
  );
}
