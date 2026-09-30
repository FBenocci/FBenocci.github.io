// Rotating research topics in the hero, theme toggle, reveal on scroll.
(() => {
  const topics = [
    'approximate nearest neighbor search',
    'compressed graph indexes',
    'retrieval for LLM agents',
    'efficient vector search',
  ];
  const el = document.getElementById('rotate');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (el && !reduce) {
    let i = 0;
    setInterval(() => {
      el.classList.add('out');
      setTimeout(() => {
        i = (i + 1) % topics.length;
        el.textContent = topics[i];
        el.classList.remove('out');
      }, 350);
    }, 2800);
  }

  const root = document.documentElement;
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  });

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(s => io.observe(s));
})();
