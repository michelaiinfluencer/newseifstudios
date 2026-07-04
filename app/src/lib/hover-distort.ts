/* C1 second beat: a single shared WebGL canvas that overlays the hovered
   work image and ripples it under the cursor (liquid displacement).
   One context for the whole page; positioned over the active tile.
   Client-only. Videos are excluded (they already move). */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  vUv.y = 1.0 - vUv.y;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uMouse;
uniform float uTime;
uniform float uAmp;
void main() {
  vec2 uv = vUv;
  float d = distance(uv, uMouse);
  float ripple = sin(d * 28.0 - uTime * 5.0) * 0.014 * uAmp * smoothstep(0.45, 0.0, d);
  vec2 dir = normalize(uv - uMouse + 0.0001);
  uv += dir * ripple;
  vec4 c = texture2D(uTex, uv);
  c.rgb += vec3(0.9, 0.0, 0.0) * ripple * 5.0;
  gl_FragColor = c;
}`;

export class HoverDistort {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null;
  private prog: WebGLProgram | null = null;
  private tex: WebGLTexture | null = null;
  private raf = 0;
  private amp = 0;
  private targetAmp = 0;
  private mouse = { x: 0.5, y: 0.5 };
  private active: HTMLElement | null = null;
  private start = 0;
  private uMouse: WebGLUniformLocation | null = null;
  private uTime: WebGLUniformLocation | null = null;
  private uAmp: WebGLUniformLocation | null = null;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.style.cssText =
      "position:fixed;top:0;left:0;pointer-events:none;z-index:40;display:none;";
    document.body.appendChild(this.canvas);
    this.gl = this.canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
    });
    if (this.gl) this.setup();
  }

  private setup() {
    const gl = this.gl!;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(p);
    gl.useProgram(p);
    this.prog = p;
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(p, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.uMouse = gl.getUniformLocation(p, "uMouse");
    this.uTime = gl.getUniformLocation(p, "uTime");
    this.uAmp = gl.getUniformLocation(p, "uAmp");
  }

  enter(tile: HTMLElement, img: HTMLImageElement) {
    if (!this.gl || !img.complete || img.naturalWidth === 0) return;
    this.active = tile;
    this.targetAmp = 1;
    this.start = performance.now();
    const gl = this.gl;
    if (this.tex) gl.deleteTexture(this.tex);
    this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    } catch {
      this.leave();
      return;
    }
    this.canvas.style.display = "block";
    if (!this.raf) this.loop();
  }

  move(clientX: number, clientY: number) {
    if (!this.active) return;
    const r = this.active.getBoundingClientRect();
    this.mouse.x = (clientX - r.left) / r.width;
    this.mouse.y = (clientY - r.top) / r.height;
  }

  leave() {
    this.targetAmp = 0;
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const gl = this.gl;
    if (!gl || !this.active) return this.stop();
    this.amp += (this.targetAmp - this.amp) * 0.08;
    if (this.targetAmp === 0 && this.amp < 0.01) return this.stop();
    const r = this.active.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.style.transform = `translate(${r.left}px, ${r.top}px)`;
    this.canvas.style.width = `${r.width}px`;
    this.canvas.style.height = `${r.height}px`;
    const w = Math.round(r.width * dpr);
    const h = Math.round(r.height * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(this.uMouse, this.mouse.x, this.mouse.y);
    gl.uniform1f(this.uTime, (performance.now() - this.start) / 1000);
    gl.uniform1f(this.uAmp, this.amp);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  private stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.amp = 0;
    this.active = null;
    this.canvas.style.display = "none";
  }

  destroy() {
    this.stop();
    this.canvas.remove();
  }
}
