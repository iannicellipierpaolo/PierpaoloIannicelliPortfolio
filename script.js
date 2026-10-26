const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let reduceMotion = motionPreference.matches;
const laptopExperience = createLaptopExperience(motionPreference);

document.getElementById("year").textContent = new Date().getFullYear();

/* Barra di navigazione: bordo quando si scorre */
const nav = document.querySelector(".localnav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

/* Menu mobile */
const btn = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
const setMenu = open => {
  menu.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", open);
  btn.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
};
btn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && menu.classList.contains("open")) {
    setMenu(false);
    btn.focus({ preventScroll: true });
  }
});

/* Animazioni cicliche: compaiono in entrata, si spengono in uscita (su e giù).
   Nella hero l'effetto è una pura dissolvenza in trasparenza. */
const SHOW_AT = 0.12;
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.intersectionRatio >= SHOW_AT) {
      e.target.classList.add("visible");
    } else if (e.intersectionRatio === 0) {
      e.target.classList.remove("visible");
    }
  });
}, { threshold: [0, SHOW_AT], rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));
document.documentElement.classList.toggle("reveal-ready", !reduceMotion);
motionPreference.addEventListener("change", e => {
  reduceMotion = e.matches;
  document.documentElement.classList.toggle("reveal-ready", !reduceMotion);
});

/* Voce di menu attiva */
const links = [...menu.querySelectorAll("a:not(.pill)")];
const spy = new IntersectionObserver(entries => {
  if (laptopExperience.enabled) return;
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
    }
  });
}, { threshold: 0.35 });
document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));

/* Anteprime: scala gli iframe alla larghezza della card */
function scalePreviews() {
  document.querySelectorAll(".p-preview").forEach(box => {
    const frame = box.querySelector("iframe");
    frame.style.transform = `scale(${box.clientWidth / 1280})`;
  });
}
scalePreviews();
window.addEventListener("resize", scalePreviews);
if ("ResizeObserver" in window) {
  const previewObserver = new ResizeObserver(scalePreviews);
  document.querySelectorAll(".p-preview").forEach(box => previewObserver.observe(box));
}

/* Carosello */
const carousel = document.getElementById("carousel");
const progress = document.getElementById("progress");
const step = () => carousel.querySelector(".project").offsetWidth + 24;

const carouselBehavior = () => reduceMotion ? "auto" : "smooth";
document.getElementById("prev").addEventListener("click", () => carousel.scrollBy({ left: -step(), behavior: carouselBehavior() }));
document.getElementById("next").addEventListener("click", () => carousel.scrollBy({ left: step(), behavior: carouselBehavior() }));
carousel.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    carousel.scrollBy({ left: e.key === "ArrowRight" ? step() : -step(), behavior: carouselBehavior() });
  }
});

function updateProgress() {
  const max = carousel.scrollWidth - carousel.clientWidth;
  const ratio = max > 0 ? carousel.scrollLeft / max : 1;
  const visible = carousel.clientWidth / carousel.scrollWidth;
  progress.style.width = Math.min(100, (visible + (1 - visible) * ratio) * 100) + "%";
}
carousel.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();
if ("ResizeObserver" in window) new ResizeObserver(updateProgress).observe(carousel);

let down = false, startX = 0, startLeft = 0, moved = false;
carousel.addEventListener("pointerdown", e => {
  if (e.pointerType !== "mouse") return;
  down = true; moved = false; startX = e.clientX; startLeft = carousel.scrollLeft;
});
window.addEventListener("pointermove", e => {
  if (!down) return;
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 5) { moved = true; carousel.classList.add("dragging"); }
  carousel.scrollLeft = startLeft - dx;
});
window.addEventListener("pointerup", () => {
  if (!down) return;
  down = false;
  carousel.classList.remove("dragging");
});
carousel.addEventListener("click", e => { if (moved) { e.preventDefault(); moved = false; } }, true);
carousel.addEventListener("dragstart", e => e.preventDefault());

/* ===== Apertura del MacBook e scroll del portfolio nel display =====
   Non intercetta wheel/touch: la scrollbar è quella nativa della pagina.
   INTRO_SCREENS regola la distanza di apertura in altezze di finestra.
   Dopo l'apertura, 1 px di scroll muove il portfolio di 1 px. */
function createLaptopExperience(motionQuery) {
  const INTRO_SCREENS = 1.65;
  const root = document.documentElement;
  const experience = document.getElementById("laptop-experience");
  const screen = document.getElementById("portfolio-screen");
  const viewport = document.getElementById("screen-viewport");
  const content = document.getElementById("screen-content");
  const controls = document.getElementById("intro-controls");
  const keyboard = document.getElementById("laptop-keyboard");
  const sectionLinks = [...screen.querySelectorAll('#menu a:not(.pill)')];
  const sections = [...content.querySelectorAll("main section[id]")];
  const clamp = value => Math.max(0, Math.min(1, value));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = t => t * t * (3 - 2 * t);
  let active = false;
  let frame = 0;
  let measureFrame = 0;
  let metrics = null;
  let sectionPositions = [];
  let lastPhase = "";
  let canInteract = true;

  // Tasti puramente decorativi; il contenuto del display è il sito reale.
  for (let i = 0; i < 79; i++) {
    const key = document.createElement("span");
    if (i === 73) key.className = "space-key";
    keyboard.appendChild(key);
  }

  function offsetInContent(element) {
    let offset = 0;
    for (let node = element; node && node !== content; node = node.offsetParent) {
      offset += node.offsetTop;
    }
    return offset;
  }

  function setNumber(name, value, unit = "") {
    experience.style.setProperty(name, `${value.toFixed(3)}${unit}`);
  }

  function measure() {
    measureFrame = 0;
    if (!active) return;
    const old = metrics;
    const oldY = window.scrollY;
    const width = document.documentElement.clientWidth;
    const height = window.innerHeight;
    const mobile = width <= 760;
    const deviceWidth = mobile
      ? Math.max(240, Math.min(width - 24, height < width * .8 ? (height - 80) / .625 : width - 24))
      : Math.max(240, Math.min(1260, width * .88, (height - 96) / .625));
    const initialLidHeight = deviceWidth * .625;
    const finalLidHeight = mobile ? Math.max(initialLidHeight, height - 52) : initialLidHeight;
    const bezelX = mobile ? 18 : 26; // padding + bordi
    const bezelY = mobile ? 22 : 32;
    const screenWidth = deviceWidth - bezelX;
    const navHeight = screen.querySelector(".localnav").offsetHeight || 52;
    const viewHeight = Math.max(120, finalLidHeight - bezelY - navHeight);
    const intro = Math.round(height * (mobile ? 1.35 : INTRO_SCREENS));

    setNumber("--stage-height", height, "px");
    setNumber("--device-width", deviceWidth, "px");
    setNumber("--deck-height", initialLidHeight, "px");
    setNumber("--screen-width", screenWidth, "px");
    setNumber("--content-height", viewHeight, "px");
    screen.classList.toggle("compact-screen", screenWidth <= 860);
    screen.classList.toggle("narrow-screen", screenWidth <= 734);

    // Le misure di layout non includono la trasformazione visiva del portatile.
    const range = Math.max(0, content.scrollHeight - viewHeight);
    metrics = { width, height, mobile, deviceWidth, initialLidHeight, finalLidHeight, viewHeight, intro, range };
    sectionPositions = sections.map(section => ({ id: section.id, top: offsetInContent(section) }));
    setNumber("--story-height", height + intro + range, "px");
    experience.dataset.introDistance = String(intro);
    experience.dataset.contentRange = String(Math.round(range));

    // Conserva la posizione quando cambia l'orientamento o si ridimensiona la finestra.
    if (old && (old.width !== width || Math.abs(old.height - height) > 100)) {
      const nextY = oldY < old.intro
        ? oldY / old.intro * intro
        : intro + Math.min(range, Math.max(0, oldY - old.intro));
      window.scrollTo({ top: nextY, behavior: "instant" });
    }
    render();
  }

  function requestMeasure() {
    if (active && !measureFrame) measureFrame = requestAnimationFrame(measure);
  }

  function render() {
    frame = 0;
    if (!active || !metrics) return;
    const m = metrics;
    const y = Math.max(0, window.scrollY);
    const progress = clamp(y / m.intro);
    const opening = ease(clamp(progress / .64));
    const zoom = ease(clamp((progress - .60) / .40));
    const lidHeight = mix(m.initialLidHeight, m.finalLidHeight, zoom);
    const initialHinge = m.height * (m.mobile ? .65 : .67);
    const finalTop = (m.height - m.finalLidHeight - 9) / 2;
    const shift = Math.max(0, Math.min(m.range, y - m.intro));

    setNumber("--lid-height", lidHeight, "px");
    setNumber("--hardware-y", mix(initialHinge - lidHeight, finalTop, zoom), "px");
    setNumber("--lid-angle", mix(-102, 0, opening), "deg");
    setNumber("--device-scale", mix(m.mobile ? .86 : .66, 1, zoom));
    setNumber("--deck-angle", mix(78, 88, zoom), "deg");
    setNumber("--deck-opacity", 1 - ease(clamp((zoom - .25) / .75)));
    setNumber("--lip-opacity", zoom);
    setNumber("--intro-opacity", 1 - clamp(progress / .23));
    setNumber("--intro-y", -28 * clamp(progress / .23), "px");
    setNumber("--controls-opacity", 1 - clamp((progress - .72) / .28));
    setNumber("--hint-opacity", 1 - clamp(progress / .18));
    setNumber("--shadow-opacity", mix(.85, .2, zoom));
    setNumber("--screen-glare", .6 * (1 - opening));
    setNumber("--site-shift", shift, "px");

    const interactive = progress >= .999;
    if (interactive !== canInteract) {
      screen.inert = !interactive;
      controls.inert = interactive;
      canInteract = interactive;
    }
    const phase = progress < .60 ? "opening" : progress < .999 ? "zoom" : "portfolio";
    if (phase !== lastPhase) { experience.dataset.phase = phase; lastPhase = phase; }
    const currentSection = sectionPositions.filter(section => section.top <= shift + m.viewHeight * .3).at(-1);
    sectionLinks.forEach(link => {
      const selected = link.hash === `#${currentSection?.id}`;
      link.classList.toggle("active", selected);
      if (selected) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  function requestRender() {
    if (active && !frame) frame = requestAnimationFrame(render);
  }

  function goToHash(hash, instant = false) {
    if (!active || !metrics || !hash) return false;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return false; }
    const target = document.getElementById(id);
    if (!target || (id !== "top" && !content.contains(target))) return false;
    const top = id === "top" ? 0 : metrics.intro + Math.min(metrics.range, Math.max(0, offsetInContent(target) - 16));
    window.scrollTo({ top, behavior: instant || motionQuery.matches ? "instant" : "smooth" });
    if (instant) render();
    return true;
  }

  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const skip = anchor.hasAttribute("data-skip-intro") || anchor.classList.contains("skip-link");
    if (goToHash(anchor.hash, skip)) {
      event.preventDefault();
      if (location.hash !== anchor.hash) history.pushState(null, "", anchor.hash);
      if (skip) {
        const target = document.querySelector("#home h1");
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    }
  });

  // Il focus da tastiera deve mostrare i link anche se sono fuori dal display.
  content.addEventListener("focusin", event => {
    if (!active || !metrics) return;
    viewport.scrollTop = 0;
    const top = offsetInContent(event.target);
    const visibleTop = Math.max(0, window.scrollY - metrics.intro);
    const bottom = top + event.target.offsetHeight;
    if (top < visibleTop || bottom > visibleTop + metrics.viewHeight) {
      const next = Math.min(metrics.range, Math.max(0, top - 24));
      window.scrollTo({ top: metrics.intro + next, behavior: "instant" });
      render();
    }
  });
  viewport.addEventListener("scroll", () => {
    if (active && viewport.scrollTop) viewport.scrollTop = 0;
  }, { passive: true });
  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestMeasure, { passive: true });
  window.addEventListener("hashchange", () => goToHash(location.hash, true));
  window.addEventListener("popstate", () => goToHash(location.hash || "#top", true));
  if ("ResizeObserver" in window) new ResizeObserver(requestMeasure).observe(content);

  function setMode(initial = false) {
    const shouldEnable = !motionQuery.matches && CSS.supports("perspective", "1000px") && "ResizeObserver" in window;
    if (shouldEnable === active) return;
    const oldOffset = active && metrics ? Math.max(0, window.scrollY - metrics.intro) : window.scrollY;
    active = shouldEnable;
    root.classList.toggle("laptop-enabled", active);
    if (active) {
      measure();
      if (!initial) window.scrollTo({ top: metrics.intro + oldOffset, behavior: "instant" });
      else if (location.hash) goToHash(location.hash, true);
      render();
    } else {
      screen.inert = false;
      controls.inert = false;
      canInteract = true;
      metrics = null;
      experience.removeAttribute("data-phase");
      window.scrollTo({ top: oldOffset, behavior: "instant" });
    }
  }
  motionQuery.addEventListener("change", () => setMode());
  setMode(true);
  window.addEventListener("load", requestMeasure, { once: true });
  if (document.fonts?.ready) document.fonts.ready.then(requestMeasure);
  return { get enabled() { return active; } };
}
