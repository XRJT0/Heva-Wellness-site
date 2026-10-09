/**
 * Heva motion system. Progressive enhancement only:
 * every element is fully visible without JavaScript or with reduced motion.
 *
 *  data-split            headline words rise out of a mask, staggered
 *  data-reveal           fade + lift into view on scroll (data-reveal="clip" = image wipe)
 *  data-stagger          children with data-reveal get increasing delays
 *  data-parallax="0.2"   element drifts with scroll (desktop only)
 *  data-count            number counts up when visible ("12,400+", "4.9", "1,800")
 *  data-header           floating header: glass on scroll, hides on scroll down
 *  data-progress         reading progress bar
 */

const root = document.documentElement;
const motion = root.classList.contains('motion');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ── Header ───────────────────────────────────────────────── */
const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  let lastY = scrollY;
  let ticking = false;
  const update = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    const menuOpen = header.querySelector('details[open]');
    if (!menuOpen) header.classList.toggle('is-hidden', y > 320 && y > lastY + 4);
    if (y < lastY - 4 || y < 320) header.classList.remove('is-hidden');
    lastY = y;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();

  // Mobile sheet: lock page scroll while open, close on link tap or Escape.
  const nav = header.querySelector<HTMLDetailsElement>('[data-mobile-nav]');
  nav?.addEventListener('toggle', () => {
    root.classList.toggle('menu-open', nav.open);
    header.classList.toggle('menu-is-open', nav.open);
  });
  nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => (nav.open = false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav?.open) nav.open = false; });
}

/* ── Split headlines into masked words ────────────────────── */
function splitWords(el: HTMLElement) {
  let i = 0;
  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.append(document.createTextNode(' ')); return; }
          const outer = document.createElement('span');
          outer.className = 'w';
          const inner = document.createElement('span');
          inner.className = 'wi';
          inner.style.setProperty('--wi', String(i++));
          inner.textContent = p;
          outer.append(inner);
          frag.append(outer);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(el);
  el.classList.add('is-split');
}

/* ── Count-up numbers ─────────────────────────────────────── */
function countUp(el: HTMLElement) {
  const raw = el.textContent?.trim() ?? '';
  const m = raw.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  if (!m) return;
  const [, pre, num, post] = m;
  const target = parseFloat(num.replace(/,/g, ''));
  const decimals = (num.split('.')[1] ?? '').length;
  const comma = num.includes(',');
  const dur = 1600;
  const start = performance.now();
  const fmt = (v: number) => {
    let s = v.toFixed(decimals);
    if (comma) s = Number(s).toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return pre + s + post;
  };
  el.style.minWidth = `${raw.length}ch`;
  const step = (t: number) => {
    const p = Math.min(1, (t - start) / dur);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = fmt(target * eased);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = raw;
  };
  requestAnimationFrame(step);
}

if (motion) {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach(splitWords);

  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    group.querySelectorAll<HTMLElement>(':scope > [data-reveal], :scope > * > [data-reveal]').forEach((el, i) => {
      el.style.setProperty('--d', `${i * 0.09}s`);
    });
  });

  // Reveal anything whose top has reached 90% of the viewport, including elements
  // already scrolled past (fast scrolls, anchor jumps, End key), so nothing stays hidden.
  let pending = [...document.querySelectorAll<HTMLElement>('[data-split], [data-reveal], .week, .ticks, [data-count]')];
  const reveal = (el: HTMLElement) => {
    el.classList.add('is-in');
    if (el.hasAttribute('data-count')) countUp(el);
  };
  let checking = 0;
  const check = () => {
    checking = 0;
    const limit = innerHeight * 0.9;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top < limit) { reveal(el); return false; }
      return true;
    });
    if (!pending.length) { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); }
  };
  const onScroll = () => { if (!checking) checking = requestAnimationFrame(check); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  // Everything in the hero animates in on load, wherever it sits on screen.
  const hero0 = document.querySelector('[data-hero]');
  // Wait a frame so the split headlines are laid out, then do the first pass.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (hero0) pending = pending.filter((el) => (hero0.contains(el) ? (reveal(el), false) : true));
    check();
  }));

  /* Parallax (desktop, fine pointer only) */
  const px = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (px.length && finePointer) {
    let raf = 0;
    const run = () => {
      raf = 0;
      const y = scrollY;
      px.forEach((el) => {
        const f = parseFloat(el.dataset.parallax ?? '0');
        el.style.setProperty('--py', `${(y * f).toFixed(1)}px`);
      });
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(run); }, { passive: true });
    run();
  }

  /* Hero light follows the pointer, very gently */
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (hero && finePointer) {
    hero.addEventListener('pointerleave', () => {
      ['--mx', '--my'].forEach((k) => hero.style.setProperty(k, '0px'));
      ['--rx', '--ry'].forEach((k) => hero.style.setProperty(k, '0'));
    });
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) - 0.5) * 40}px`);
      hero.style.setProperty('--my', `${(((e.clientY - r.top) / r.height) - 0.5) * 40}px`);
      hero.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width) - 0.5) * -4}`);
      hero.style.setProperty('--rx', `${(((e.clientY - r.top) / r.height) - 0.5) * 3}`);
    });
  }

  /* Magnetic buttons */
  if (finePointer) {
    document.querySelectorAll<HTMLElement>('.btn').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--bx', `${(e.clientX - r.left - r.width / 2) * 0.18}px`);
        b.style.setProperty('--by', `${(e.clientY - r.top - r.height / 2) * 0.3}px`);
      });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); });
    });
  }
}

/* ── Reading progress ─────────────────────────────────────── */
const bar = document.querySelector<HTMLElement>('[data-progress]');
const article = document.querySelector<HTMLElement>('[data-article]');
if (bar && article) {
  let raf = 0;
  const run = () => {
    raf = 0;
    const r = article.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    bar.style.transform = `scaleX(${p})`;
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(run); }, { passive: true });
  run();
}
