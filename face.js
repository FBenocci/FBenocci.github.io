// Portrait composed by a graph.
// Nodes: face landmarks (MediaPipe Face Mesh) plus sparse points on hair, neck and shirt.
// Edges: symmetric 4-nearest-neighbor graph, as in a layer of a proximity-graph index.
// On load, a breadth-first search from the nose draws the graph and the photo appears around each
// visited node. Afterwards, the cursor acts as a query: its nearest nodes and their edges light up.
// Clicking runs the best-first search used in the bottom layer of HNSW (candidate list of size ef)
// from a fixed entry point towards the clicked point, then highlights the path to the node it returns.
(() => {
  const D = {"s":530,"r":42,"p":[224,289,234,285,255,280,284,277,309,278,322,279,310,289,286,300,257,302,236,296,228,289,270,289,318,280,271,288,198,197,208,192,223,190,240,196,225,199,210,200,293,191,311,181,326,181,337,186,324,191,309,191,177,176,184,167,198,160,218,160,240,161,284,157,307,152,328,149,344,152,355,160,263,185,264,196,264,208,264,219,265,230,265,245,266,255,237,258,301,254,268,263,233,253,303,248,260,112,289,110,314,113,339,120,356,134,367,151,375,169,380,193,382,216,383,239,383,264,378,289,369,309,356,323,339,337,325,346,311,354,295,360,275,362,255,362,240,359,227,353,215,345,199,334,188,322,178,304,171,279,168,255,166,232,165,210,165,186,168,167,175,148,187,133,208,122,231,115,189,243,349,231,202,256,337,246,187,220,350,207,181,267,362,253,218,244,319,236,261,135,262,161,235,137,286,133,214,140,309,132,273,343,273,329,290,328,256,330,218,195,318,186,394,426,200,94,394,139,357,429,174,113,346,400,308,82,359,74,198,506,378,109,272,66,310,404,306,43,396,475,242,469,206,49,240,403,309,481,336,59,286,31,258,438,434,451,198,467,346,478,234,508,292,506,277,465,421,397,292,430,456,416,338,29,249,31,235,59,145,222,407,230,179,78,345,370,217,77,366,354,263,492,314,21,323,452,404,254,145,249,278,89,276,403,159,131,157,490,323,509,384,383,373,455,240,92,335,82,405,198,353,99,157,86,223,33,381,86,372,494,228,442,397,164],"e":[0,1,0,2,0,9,0,10,1,2,1,9,1,10,1,43,1,46,2,8,2,10,2,11,2,13,2,42,2,43,2,45,3,4,3,7,3,11,3,13,3,44,3,45,3,47,4,5,4,6,4,12,4,44,4,47,5,6,5,12,5,44,6,7,6,12,7,11,7,13,7,102,8,9,8,11,8,13,8,101,8,103,9,10,11,13,12,44,14,15,14,16,14,19,14,88,14,104,15,16,15,19,15,104,16,17,16,18,16,19,16,104,17,18,17,36,17,37,17,104,18,19,18,104,19,104,20,21,20,25,20,37,20,105,21,22,21,24,21,25,21,105,22,23,22,24,22,105,23,24,23,89,23,105,24,25,24,89,24,105,25,105,26,27,26,28,26,78,26,79,27,28,27,78,27,79,27,80,28,29,28,80,28,98,29,30,29,96,29,98,30,94,30,95,30,96,31,32,31,94,31,95,31,97,32,33,32,97,32,99,33,34,33,35,33,51,33,99,34,35,34,52,34,53,35,52,35,53,35,54,36,37,36,38,36,95,37,38,37,39,38,39,38,40,39,40,39,41,40,41,40,42,41,42,41,45,42,45,43,46,43,92,44,47,44,93,46,86,46,92,47,87,47,93,48,49,48,83,48,94,48,150,48,157,49,50,49,97,49,99,49,112,49,150,50,51,50,99,50,112,51,52,51,160,52,53,52,115,53,54,53,108,53,166,54,55,54,108,54,166,55,56,55,89,55,159,55,166,56,57,56,140,56,159,57,58,57,91,57,140,57,148,58,59,58,91,58,148,59,60,59,61,59,91,60,61,60,62,60,144,61,62,61,63,61,144,62,63,62,64,62,142,62,144,63,64,63,65,63,142,64,65,64,102,65,66,65,100,65,102,65,117,66,67,66,100,66,101,67,68,67,69,67,100,67,103,67,122,68,69,68,70,68,103,69,70,69,71,70,71,70,72,71,72,71,73,72,73,72,74,73,74,73,90,74,75,74,86,74,90,75,76,75,84,75,90,75,139,75,149,76,77,76,88,76,139,76,149,77,78,77,88,77,139,78,79,79,80,79,152,80,81,80,152,81,82,81,98,81,110,81,152,82,83,82,98,82,107,83,96,83,157,84,86,84,88,84,90,84,92,85,87,85,89,85,91,85,93,86,90,86,92,87,91,87,93,90,149,91,148,94,95,94,96,94,97,96,98,97,99,100,101,100,102,100,103,101,102,101,103,106,109,106,119,106,127,106,133,106,135,106,155,106,156,107,110,107,141,107,143,107,161,108,115,108,166,109,111,109,147,109,156,110,141,110,152,110,161,111,117,111,142,111,155,112,116,112,150,112,158,113,124,113,136,113,158,113,160,113,163,114,120,114,128,114,130,114,153,115,160,115,163,116,125,116,137,116,138,116,150,117,134,117,151,118,124,118,125,118,136,118,146,119,127,119,156,119,164,120,126,120,128,120,130,120,132,120,145,120,165,121,138,121,141,121,143,121,162,122,126,122,151,122,165,123,129,123,131,123,132,123,147,123,154,124,136,124,146,124,158,125,137,125,146,126,132,126,134,126,151,126,165,127,133,127,135,128,130,128,153,128,165,129,147,129,154,129,156,129,164,130,145,130,153,131,132,131,145,131,154,132,145,133,135,133,155,134,147,134,151,135,155,136,146,137,138,137,162,138,143,138,157,138,162,139,149,140,148,140,159,141,143,141,161,142,144,142,155,143,157,143,162,144,155,152,161,153,165,154,164,156,164,158,160,158,163,159,166,160,163]};
  const canvas = document.getElementById('face');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const N = D.p.length / 2, X = i => D.p[2 * i], Y = i => D.p[2 * i + 1];
  const edges = []; for (let j = 0; j < D.e.length; j += 2) edges.push([D.e[j], D.e[j + 1]]);
  const adj = Array.from({ length: N }, () => []);
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
  const depth = new Int32Array(N).fill(-1); depth[D.r] = 0;
  for (let q = [D.r], h = 0; h < q.length; h++) for (const v of adj[q[h]]) if (depth[v] < 0) { depth[v] = depth[q[h]] + 1; q.push(v); }
  const maxDepth = Math.max(...depth);

  // timeline (ms)
  const STEP = 1300 / maxDepth, tNode = i => depth[i] * STEP;
  const EDGE_DUR = 260, BLOOM_DELAY = 150, BLOOM_DUR = 700;
  const FILL_START = 1300 + BLOOM_DELAY + 200, FILL_DUR = 600;
  const GRAPH_OUT = FILL_START + FILL_DUR, GRAPH_OUT_DUR = 600, END = GRAPH_OUT + GRAPH_OUT_DUR;
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => 1 - Math.pow(1 - v, 3);

  const photo = new Image(); photo.src = 'assets/portrait.webp';
  const maskC = document.createElement('canvas'), mctx = maskC.getContext('2d');
  let size = 0, k = 1, start = null, ready = false, raf = 0;
  let q = null;                                  // cursor position (query)
  const glow = new Float32Array(N);              // per-node highlight, animated
  const target = new Float32Array(N);
  let near = [];

  // best-first search on click (HNSW layer-0 search with a candidate list of size EF)
  const entry = (() => { let b = 0; for (let i = 1; i < N; i++) if (Y(i) < Y(b)) b = i; return b; })();
  const EF = 8, STEP_MAX = 240, SEARCH_MAX = 2400, PATH_MS = 600, HOLD = 3500, FADE = 500;
  const stats = document.getElementById('face-stats');
  const HINT = stats ? stats.textContent : '';
  let search = null, hintShown = false;
  function bestFirst(qx, qy) {
    const dist = i => (X(i) * k - qx) ** 2 + (Y(i) * k - qy) ** 2;
    const visited = new Set([entry]), parent = new Map();
    const d0 = dist(entry);
    let cand = [[d0, entry]], res = [[d0, entry]], dc = 1;
    const exp = [];
    while (cand.length) {
      cand.sort((u, v) => u[0] - v[0]);
      const [dcur, c] = cand.shift();
      if (res.length >= EF && dcur > res[res.length - 1][0]) break;
      const evals = [];
      for (const v of adj[c]) {
        if (visited.has(v)) continue;
        visited.add(v); parent.set(v, c); dc++; evals.push(v);
        const dv = dist(v);
        if (res.length < EF || dv < res[res.length - 1][0]) {
          cand.push([dv, v]); res.push([dv, v]); res.sort((u, w) => u[0] - w[0]);
          if (res.length > EF) res.pop();
        }
      }
      exp.push({ node: c, evals });
    }
    const result = res[0][1], path = [result];
    while (path[0] !== entry) path.unshift(parent.get(path[0]));
    return { q: [qx, qy], exp, path, result, hops: path.length - 1, dists: dc, t0: null, shown: false };
  }
  function setStats(text, cls) {
    if (!stats) return;
    stats.textContent = text; stats.className = 'face-stats show' + (cls ? ' ' + cls : '');
  }
  function drawSearch(ts) {
    if (search.t0 === null) search.t0 = ts;
    const el = reduce ? 1e9 : ts - search.t0;
    const n = search.exp.length, STEP_MS = Math.min(STEP_MAX, SEARCH_MAX / n), tExp = n * STEP_MS, dur = tExp + PATH_MS;
    const vis = reduce ? 1 : 1 - clamp((el - dur - HOLD) / FADE);
    if (vis <= 0) { search = null; setStats(HINT); return false; }
    const hot = css('--hot'), fade = clamp(el / 250);
    // dim the photo, show the whole graph faintly
    ctx.globalAlpha = 0.5 * vis * fade; ctx.fillStyle = '#0f1117'; ctx.fillRect(0, 0, size, size);
    ctx.globalAlpha = 0.3 * vis * fade; ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (const [a, b] of edges) { ctx.moveTo(X(a) * k, Y(a) * k); ctx.lineTo(X(b) * k, Y(b) * k); }
    ctx.stroke();
    ctx.fillStyle = '#fff';
    for (let i = 0; i < N; i++) { ctx.beginPath(); ctx.arc(X(i) * k, Y(i) * k, 1.5, 0, 7); ctx.fill(); }
    // expansions: each expanded node probes its unvisited neighbors
    const s = el / STEP_MS, pathDone = clamp((el - tExp) / PATH_MS);
    ctx.lineCap = 'round';
    for (let j = 0; j < n && j < s; j++) {
      const st = search.exp[j], p = clamp(s - j), x0 = X(st.node) * k, y0 = Y(st.node) * k;
      const current = j === Math.floor(s) && s < n, probe = ease(p);
      ctx.strokeStyle = hot; ctx.lineWidth = 1;
      for (const v of st.evals) {
        const vx = X(v) * k, vy = Y(v) * k;
        ctx.globalAlpha = vis * (current ? 0.9 : 0.35) * (1 - 0.5 * pathDone);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (vx - x0) * probe, y0 + (vy - y0) * probe); ctx.stroke();
        if (probe >= 1) { ctx.beginPath(); ctx.arc(vx, vy, 3, 0, 7); ctx.stroke(); }
      }
      ctx.globalAlpha = vis; ctx.fillStyle = hot;
      ctx.beginPath(); ctx.arc(x0, y0, current ? 4 : 2.8, 0, 7); ctx.fill();
    }
    // path from the entry point to the returned node
    if (pathDone > 0) {
      const P = search.path, segs = (P.length - 1) * ease(pathDone);
      ctx.globalAlpha = vis; ctx.strokeStyle = hot; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(X(P[0]) * k, Y(P[0]) * k);
      for (let j = 1; j < P.length && j - 1 < segs; j++) {
        const f = Math.min(1, segs - (j - 1)), ax = X(P[j - 1]) * k, ay = Y(P[j - 1]) * k;
        ctx.lineTo(ax + (X(P[j]) * k - ax) * f, ay + (Y(P[j]) * k - ay) * f);
      }
      ctx.stroke();
      ctx.fillStyle = hot; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.3;
      for (let j = 0; j <= Math.floor(segs); j++) { ctx.beginPath(); ctx.arc(X(P[j]) * k, Y(P[j]) * k, 4, 0, 7); ctx.fill(); ctx.stroke(); }
    }
    // entry point and query
    ctx.globalAlpha = vis; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(X(entry) * k, Y(entry) * k, 7, 0, 7); ctx.stroke();
    const [qx, qy] = search.q;
    ctx.beginPath(); ctx.moveTo(qx - 7, qy); ctx.lineTo(qx + 7, qy); ctx.moveTo(qx, qy - 7); ctx.lineTo(qx, qy + 7); ctx.stroke();
    if (el >= dur) {
      const rx = X(search.result) * k, ry = Y(search.result) * k, pulse = clamp((el - dur) / 600);
      ctx.strokeStyle = hot; ctx.lineWidth = 2;
      ctx.globalAlpha = vis * (1 - pulse); ctx.beginPath(); ctx.arc(rx, ry, 4 + 14 * pulse, 0, 7); ctx.stroke();
      ctx.globalAlpha = vis; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(qx, qy); ctx.stroke(); ctx.setLineDash([]);
      if (!search.shown) {
        search.shown = true;
        setStats(search.hops + (search.hops === 1 ? ' hop' : ' hops') + ' · ' + search.dists + ' distance computations', 'result');
      }
    }
    ctx.globalAlpha = 1;
    return !reduce;
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    size = canvas.clientWidth; k = size / D.s;
    for (const c of [canvas, maskC]) c.width = c.height = Math.round(size * dpr);
    for (const c of [ctx, mctx]) c.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawGraph(alphaOf, edgeProgress, lineAlpha) {
    const accent = css('--accent'), card = css('--card');
    ctx.lineCap = 'round';
    ctx.strokeStyle = accent; ctx.lineWidth = 1.3;
    for (const [a, b] of edges) {
      const e = edgeProgress(a, b), al = Math.min(alphaOf(a), alphaOf(b)) * lineAlpha;
      if (e <= 0 || al <= 0.01) continue;
      const [s, t] = tNode(a) <= tNode(b) ? [a, b] : [b, a];
      ctx.globalAlpha = al;
      ctx.beginPath(); ctx.moveTo(X(s) * k, Y(s) * k);
      ctx.lineTo((X(s) + (X(t) - X(s)) * e) * k, (Y(s) + (Y(t) - Y(s)) * e) * k); ctx.stroke();
    }
    for (let i = 0; i < N; i++) {
      const al = alphaOf(i) * lineAlpha;
      if (al <= 0.01) continue;
      ctx.globalAlpha = al;
      ctx.beginPath(); ctx.arc(X(i) * k, Y(i) * k, 2.6, 0, 7);
      ctx.fillStyle = card; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = accent; ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function render(ts) {
    raf = 0;
    if (start === null) start = ts;
    const t = reduce ? END : ts - start;
    ctx.clearRect(0, 0, size, size);
    let again = false;

    if (t < END) {
      // photo, revealed around the visited nodes
      if (ready) {
        mctx.clearRect(0, 0, size, size);
        const fill = ease(clamp((t - FILL_START) / FILL_DUR));
        if (fill > 0) { mctx.globalAlpha = fill; mctx.fillStyle = '#000'; mctx.fillRect(0, 0, size, size); mctx.globalAlpha = 1; }
        const RB = size * 0.15;
        for (let i = 0; i < N; i++) {
          const b = ease(clamp((t - tNode(i) - BLOOM_DELAY) / BLOOM_DUR));
          if (b <= 0) continue;
          const r = RB * b, x = X(i) * k, y = Y(i) * k;
          const g = mctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
          mctx.fillStyle = g; mctx.fillRect(x - r, y - r, 2 * r, 2 * r);
        }
        mctx.globalCompositeOperation = 'source-in';
        mctx.drawImage(photo, 0, 0, size, size);
        mctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(maskC, 0, 0, size, size);
      }
      const out = 1 - clamp((t - GRAPH_OUT) / GRAPH_OUT_DUR);
      drawGraph(i => clamp((t - tNode(i)) / 200), (a, b) => ease(clamp((t - Math.max(tNode(a), tNode(b)) + EDGE_DUR * 0.4) / EDGE_DUR)), out);
      again = true;
    } else {
      if (ready) ctx.drawImage(photo, 0, 0, size, size);
      if (!hintShown) { hintShown = true; setStats(HINT); }
      if (search) { if (drawSearch(ts)) again = true; if (search) { if (again || !ready) request(); return; } }
      // query: highlight the nearest nodes and their neighbors
      for (let i = 0; i < N; i++) {
        glow[i] += (target[i] - glow[i]) * 0.2;
        if (Math.abs(target[i] - glow[i]) > 0.01) again = true;
      }
      drawGraph(i => glow[i], () => 1, 1);
      if (q) {
        const hot = css('--hot');
        ctx.strokeStyle = hot; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
        for (const i of near) { ctx.globalAlpha = 0.9 * glow[i]; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(X(i) * k, Y(i) * k); ctx.stroke(); }
        ctx.setLineDash([]); ctx.globalAlpha = 1; ctx.fillStyle = hot;
        ctx.beginPath(); ctx.arc(q[0], q[1], 3.5, 0, 7); ctx.fill();
      }
    }
    if (again || !ready) request();
  }
  function request() { if (!raf) raf = requestAnimationFrame(render); }

  function query(x, y) {
    q = [x, y];
    const d = []; for (let i = 0; i < N; i++) d.push([(X(i) * k - x) ** 2 + (Y(i) * k - y) ** 2, i]);
    d.sort((u, v) => u[0] - v[0]);
    near = d.slice(0, 5).map(p => p[1]);
    target.fill(0);
    for (const i of near) { target[i] = 1; for (const v of adj[i]) target[v] = Math.max(target[v], 0.55); }
    request();
  }
  canvas.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); query(e.clientX - r.left, e.clientY - r.top); });
  canvas.addEventListener('pointerleave', () => { q = null; near = []; target.fill(0); request(); });
  canvas.addEventListener('click', e => {
    if (start === null || (!reduce && performance.now() - start < END)) return;
    const r = canvas.getBoundingClientRect();
    search = bestFirst(e.clientX - r.left, e.clientY - r.top);
    if (stats) stats.className = 'face-stats';
    request();
  });
  photo.onload = () => { ready = true; request(); };
  window.addEventListener('resize', () => { resize(); request(); });
  new MutationObserver(request).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  resize();
  request();
})();
