const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let reduceMotion = motionPreference.matches;
// Include anche i telefoni ruotati e i tablet touch più piccoli.
const mobilePreference = window.matchMedia("(max-width: 760px), (max-width: 1024px) and (pointer: coarse)");
// In orizzontale il mobile mantiene la pagina nativa, più leggibile.
const portraitPreference = window.matchMedia("(orientation: portrait)");
const mediaController = createMediaController(motionPreference, mobilePreference);
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
document.addEventListener("pointerdown", e => {
  if (menu.classList.contains("open") && !e.target.closest(".localnav")) setMenu(false);
}, { passive: true });
document.addEventListener("focusin", e => {
  if (menu.classList.contains("open") && !e.target.closest(".localnav")) setMenu(false);
});
mobilePreference.addEventListener("change", () => setMenu(false));
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && menu.classList.contains("open")) {
    setMenu(false);
    btn.focus({ preventScroll: true });
  }
});

/* Testi sempre visibili: nessun observer può riportarli a opacity:0.
   La trasformazione del portfolio nel display rende inaffidabili le vecchie
   soglie di entrata/uscita. Le classi restano per la compatibilità dell'HTML. */
function updateRevealMode() {
  reduceMotion = motionPreference.matches;
  document.documentElement.classList.remove("reveal-ready");
  document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible"));
}
updateRevealMode();
motionPreference.addEventListener("change", updateRevealMode);
mobilePreference.addEventListener("change", updateRevealMode);

/* Voce di menu attiva */
const links = [...menu.querySelectorAll("a:not(.pill)")];
if ("IntersectionObserver" in window) {
  const visibleSections = new Set();
  const spy = new IntersectionObserver(entries => {
    if (laptopExperience.enabled) return;
    entries.forEach(e => {
      if (e.isIntersecting) visibleSections.add(e.target);
      else visibleSections.delete(e.target);
    });
    const current = [...visibleSections].sort((a, b) =>
      Math.abs(a.getBoundingClientRect().top - 80) - Math.abs(b.getBoundingClientRect().top - 80))[0];
    links.forEach(link => {
      const selected = link.hash === `#${current?.id}`;
      link.classList.toggle("active", selected);
      if (selected) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-72px 0px -45% 0px", threshold: 0 });
  document.querySelectorAll("main section[id]").forEach(section => spy.observe(section));
}

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

/* ===== Progetti: pulsanti, tastiera e trascinamento touch/mouse ===== */
function initProjectCarousel() {
  const carousel = document.getElementById("carousel");
  const progress = document.getElementById("progress");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const cards = [...carousel.querySelectorAll(".project")];
  let drag = null;
  let destination = null;
  let suppressClick = false;
  const behavior = () => motionPreference.matches ? "auto" : "smooth";
  const maxScroll = () => Math.max(0, carousel.scrollWidth - carousel.clientWidth);
  const clampScroll = x => Math.max(0, Math.min(maxScroll(), x));

  function visualScale() {
    // Le coordinate del dito sono visive, scrollLeft è in pixel di layout.
    return carousel.offsetWidth ? carousel.getBoundingClientRect().width / carousel.offsetWidth || 1 : 1;
  }
  function targets() {
    const rect = carousel.getBoundingClientRect();
    const scale = visualScale();
    const css = getComputedStyle(carousel);
    const padding = parseFloat(css.scrollPaddingLeft) || parseFloat(css.paddingLeft) || 0;
    return [...new Set(cards.map(card => Math.round(clampScroll(
      carousel.scrollLeft + (card.getBoundingClientRect().left - rect.left) / scale - padding
    ))))];
  }
  function update() {
    const max = maxScroll();
    const left = clampScroll(carousel.scrollLeft);
    const ratio = max > 0 ? left / max : 1;
    const visible = carousel.scrollWidth ? Math.min(1, carousel.clientWidth / carousel.scrollWidth) : 1;
    progress.style.width = `${Math.min(100, (visible + (1 - visible) * ratio) * 100)}%`;
    if (destination !== null && Math.abs(left - destination) < 2) destination = null;
    const intended = destination ?? left;
    prev.disabled = max <= 1 || intended <= 1;
    next.disabled = max <= 1 || intended >= max - 1;
  }
  function scrollTo(left, mode = behavior()) {
    destination = clampScroll(left);
    carousel.scrollTo({ left: destination, behavior: mode });
    update();
  }
  function navigate(direction) {
    const left = destination ?? clampScroll(carousel.scrollLeft);
    const stops = targets();
    const target = direction > 0
      ? stops.find(value => value > left + 2) ?? maxScroll()
      : stops.filter(value => value < left - 2).at(-1) ?? 0;
    scrollTo(target);
  }
  prev.addEventListener("click", () => navigate(-1));
  next.addEventListener("click", () => navigate(1));
  carousel.addEventListener("keydown", event => {
    const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    navigate(direction);
  });

  function startDrag(id, kind, x, y) {
    destination = null;
    suppressClick = false;
    // Ferma anche un eventuale scroll smooth avviato dai pulsanti.
    carousel.scrollTo({ left: carousel.scrollLeft, behavior: "auto" });
    drag = { id, kind, x, y, left: carousel.scrollLeft, axis: "", moved: false, scale: visualScale() };
  }
  function moveDrag(id, x, y) {
    if (!drag || drag.id !== id) return false;
    const dx = x - drag.x;
    const dy = y - drag.y;
    if (!drag.axis) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return false;
      drag.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (drag.axis === "x") {
        drag.moved = true;
        carousel.classList.add("dragging");
        if (drag.kind !== "legacy-touch") {
          // Cattura solo dopo aver riconosciuto un gesto orizzontale.
          try { carousel.setPointerCapture(id); } catch { /* Puntatore già rilasciato. */ }
        }
      }
    }
    if (drag.axis !== "x") return false;
    carousel.scrollLeft = clampScroll(drag.left - dx / drag.scale);
    update();
    return true;
  }
  function endDrag(id, cancelled = false) {
    if (!drag || drag.id !== id) return;
    const completed = drag;
    drag = null;
    suppressClick = completed.moved;
    try { if (carousel.hasPointerCapture(id)) carousel.releasePointerCapture(id); } catch { /* Touch legacy. */ }
    if (completed.moved) {
      const stops = targets();
      const left = clampScroll(carousel.scrollLeft);
      let nearest = stops.reduce((best, value) => Math.abs(value - left) < Math.abs(best - left) ? value : best, 0);
      const origin = stops.reduce((best, value) => Math.abs(value - completed.left) < Math.abs(best - completed.left) ? value : best, 0);
      const distance = left - completed.left;
      // Anche uno swipe breve e deciso avanza alla card successiva.
      const threshold = Math.max(24, carousel.clientWidth * .12);
      if (!cancelled && nearest === origin && Math.abs(distance) > threshold) {
        nearest = distance > 0
          ? stops.find(value => value > origin + 2) ?? maxScroll()
          : stops.filter(value => value < origin - 2).at(-1) ?? 0;
      }
      carousel.classList.remove("dragging");
      scrollTo(nearest, cancelled ? "auto" : behavior());
    } else carousel.classList.remove("dragging");
  }

  if ("PointerEvent" in window) {
    carousel.addEventListener("pointerdown", event => {
      if (event.isPrimary === false) { if (drag) endDrag(drag.id, true); return; }
      if (event.button !== 0) return;
      startDrag(event.pointerId, event.pointerType, event.clientX, event.clientY);
    });
    window.addEventListener("pointermove", event => {
      if (moveDrag(event.pointerId, event.clientX, event.clientY) && event.cancelable) event.preventDefault();
    }, { passive: false });
    window.addEventListener("pointerup", event => endDrag(event.pointerId));
    window.addEventListener("pointercancel", event => endDrag(event.pointerId, true));
    carousel.addEventListener("lostpointercapture", event => endDrag(event.pointerId, true));
  } else {
    // Fallback per browser touch senza Pointer Events.
    carousel.addEventListener("touchstart", event => {
      if (event.touches.length !== 1) { if (drag) endDrag(drag.id, true); return; }
      const touch = event.touches[0];
      startDrag(touch.identifier, "legacy-touch", touch.clientX, touch.clientY);
    }, { passive: true });
    carousel.addEventListener("touchmove", event => {
      if (event.touches.length !== 1) { if (drag) endDrag(drag.id, true); return; }
      const touch = event.touches[0];
      if (moveDrag(touch.identifier, touch.clientX, touch.clientY) && event.cancelable) event.preventDefault();
    }, { passive: false });
    const finishTouch = event => {
      if (!drag) return;
      if ([...event.changedTouches].some(touch => touch.identifier === drag.id)) endDrag(drag.id, event.type === "touchcancel");
    };
    carousel.addEventListener("touchend", finishTouch);
    carousel.addEventListener("touchcancel", finishTouch);
  }
  window.addEventListener("blur", () => { if (drag) endDrag(drag.id, true); });
  // Un trascinamento non deve aprire il link della card al rilascio.
  carousel.addEventListener("click", event => {
    if (suppressClick && event.detail !== 0) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }
  }, true);
  carousel.addEventListener("dragstart", event => event.preventDefault());
  carousel.addEventListener("scroll", update, { passive: true });
  // Una rotella/trackpad è una nuova scelta di navigazione, anche dopo un click.
  carousel.addEventListener("wheel", () => { destination = null; }, { passive: true });
  function refresh() {
    if (drag) endDrag(drag.id, true);
    destination = null;
    update();
  }
  window.addEventListener("resize", refresh, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(refresh).observe(carousel);
  if (document.fonts?.ready) document.fonts.ready.then(refresh);
  // Solo con i gestori pronti il browser delega lo swipe orizzontale al codice.
  carousel.classList.add("carousel-ready");
  update();
}
initProjectCarousel();


/* ===== Dispositivi CSS 3D + scroll nativo =====
   Desktop: MacBook con display spesso 7.5px. Mobile verticale: iPhone.
   Il contenuto è unico; niente WebGL, librerie o intercettazione dei gesti.
   Regola LAPTOP_DEPTH, PHONE_DEPTH_RATIO e le distanze INTRO_SCREENS qui. */
function createLaptopExperience(motionQuery) {
  const INTRO_SCREENS = 1.65;
  const PHONE_INTRO_SCREENS = 1.35;
  const LAPTOP_DEPTH = 7.5;
  const PHONE_DEPTH_RATIO = .078;
  const root = document.documentElement;
  const experience = document.getElementById("laptop-experience");
  const screen = document.getElementById("portfolio-screen");
  const viewport = document.getElementById("screen-viewport");
  const content = document.getElementById("screen-content");
  const controls = document.getElementById("intro-controls");
  const keyboard = document.getElementById("laptop-keyboard");
  const shell = experience.querySelector(".hardware-shell");
  const siteBackground = screen.querySelector(".site-background");
  const sectionLinks = [...screen.querySelectorAll('#menu a:not(.pill)')];
  const sections = [...content.querySelectorAll("main section[id]")];
  const clamp = value => Math.max(0, Math.min(1, value));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = t => t * t * (3 - 2 * t);
  let active = false;
  let phoneMode = false;
  let frame = 0;
  let measureFrame = 0;
  let metrics = null;
  let sectionPositions = [];
  let lastPhase = "";
  let canInteract = true;
  let keyboardBuilt = false;
  let shellMode = "";

  const keyboardRows = [
    [["esc", 1.4], "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", ["◉", 1.1, "touch-id"]],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "−", "=", ["delete", 1.5]],
    [["tab", 1.5], "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    [["caps lock", 1.75], "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", ["return", 1.75]],
    [["shift", 2.25], "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", ["shift", 2.25]],
    ["fn", "control", "option", ["⌘", 1.25], ["", 5, "space-key"], ["⌘", 1.25], "option", ["arrows", 3]]
  ];
  function buildKeyboard() {
    if (keyboardBuilt) return;
    keyboardBuilt = true;
    keyboardRows.forEach((keys, index) => {
      const row = document.createElement("div");
      row.className = `keyboard-row${index === 0 ? " function-row" : ""}`;
      keys.forEach(spec => {
        const [label, width = 1, className = ""] = Array.isArray(spec) ? spec : [spec];
        const key = document.createElement("span");
        key.style.setProperty("--key-unit", width);
        if (label === "arrows") {
          key.className = "arrow-keys";
          ["←", "↑", "↓", "→"].forEach((arrow, position) => {
            const arrowKey = document.createElement("span");
            arrowKey.className = `key arrow-${position}`;
            arrowKey.textContent = arrow;
            key.appendChild(arrowKey);
          });
        } else {
          key.className = `key ${className}${label.length > 2 ? " key-word" : ""}`;
          key.textContent = label;
          if (label === "F" || label === "J") key.classList.add("home-key");
        }
        row.appendChild(key);
      });
      keyboard.appendChild(row);
    });
  }

  // Sezioni solide arrotondate lungo Z: chiudono anche gli angoli della scocca.
  // Non usare opacity/filter/overflow:hidden sui contenitori preserve-3d:
  // appiattirebbero tutti questi strati su un unico piano.
  function buildShell() {
    const mode = phoneMode ? "phone" : "laptop";
    if (shellMode === mode) return;
    shellMode = mode;
    const count = phoneMode ? 22 : 10;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const slice = document.createElement("span");
      slice.className = "shell-slice";
      const position = i / (count - 1);
      slice.style.setProperty("--slice-z", (position - .5).toFixed(4));
      // Una leggera smussatura alle estremità riflette la luce sul bordo.
      slice.style.setProperty("--slice-inset", `${(Math.abs(position - .5) ** 3 * 6).toFixed(3)}px`);
      fragment.appendChild(slice);
    }
    shell.replaceChildren(fragment);
  }

  function updateVideo() {
    const visible = !active || Boolean(metrics && window.scrollY > metrics.intro * .48);
    // Sul telefono riproduci un video alla volta per limitare il carico.
    const outerNeeded = !(active && phoneMode && visible);
    mediaController.setInnerVisible(visible, outerNeeded);
  }
  function offsetInContent(element) {
    let offset = 0;
    for (let node = element; node && node !== content; node = node.offsetParent) offset += node.offsetTop;
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
    const phoneRatio = 9 / 19.5;
    const deviceWidth = phoneMode
      ? Math.max(1, Math.min(width - 28, (height - 40) * phoneRatio))
      : Math.max(240, Math.min(1260, width * .88, (height - 96) / .625));
    const lidHeight = phoneMode ? deviceWidth / phoneRatio : deviceWidth * .625;
    const depth = phoneMode ? Math.min(30, deviceWidth * PHONE_DEPTH_RATIO) : LAPTOP_DEPTH;
    const intro = Math.round(height * (phoneMode ? PHONE_INTRO_SCREENS : INTRO_SCREENS));
    setNumber("--stage-height", height, "px");
    setNumber("--device-width", deviceWidth, "px");
    setNumber("--deck-height", lidHeight, "px");
    setNumber("--lid-height", lidHeight, "px");
    setNumber("--hardware-depth", depth, "px");
    // Legge le dimensioni effettive dopo padding/bordi: niente contenuto tagliato.
    const screenWidth = screen.clientWidth;
    setNumber("--screen-width", screenWidth, "px");
    screen.classList.toggle("compact-screen", screenWidth <= 860);
    screen.classList.toggle("narrow-screen", screenWidth <= 734);
    const navHeight = screen.querySelector(".localnav").offsetHeight;
    const viewHeight = Math.max(120, screen.clientHeight - navHeight);
    setNumber("--content-height", viewHeight, "px");
    const range = Math.max(0, content.scrollHeight - viewHeight);
    metrics = { width, height, phone: phoneMode, deviceWidth, lidHeight, viewHeight, intro, range };
    sectionPositions = sections.map(section => ({ id: section.id, top: offsetInContent(section) }));
    setNumber("--story-height", height + intro + range, "px");
    experience.dataset.introDistance = String(intro);
    experience.dataset.contentRange = String(Math.round(range));
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
    const shift = Math.max(0, Math.min(m.range, y - m.intro));
    root.style.setProperty("--outer-shade", (0.5 * (1 - opening)).toFixed(3));
    setNumber("--intro-opacity", 1 - clamp(progress / .23));
    setNumber("--intro-y", -28 * clamp(progress / .23), "px");
    setNumber("--controls-opacity", 1 - clamp((progress - .72) / .28));
    setNumber("--hint-opacity", 1 - clamp(progress / .18));
    setNumber("--shadow-opacity", mix(.85, .22, zoom));
    setNumber("--site-shift", shift, "px");
    // La luce scorre sul metallo e sul vetro, senza muovere il contenuto.
    setNumber("--metal-angle", mix(115, 158, opening), "deg");
    setNumber("--reflection-x", mix(-45, 145, opening), "%");
    setNumber("--glass-reflection", .48 * (1 - zoom));

    if (m.phone) {
      const spin = ease(clamp(progress / .56));
      const powerOn = ease(clamp((progress - .48) / .17));
      const center = mix(m.height * .62, m.height / 2, zoom);
      setNumber("--hardware-y", center - m.lidHeight / 2, "px");
      setNumber("--device-scale", mix(.56, 1, zoom));
      setNumber("--phone-ry", mix(-208, 0, spin), "deg");
      setNumber("--phone-rx", mix(13, 0, spin), "deg");
      setNumber("--phone-rz", mix(-8, 0, spin), "deg");
      setNumber("--screen-off", 1 - powerOn);
      setNumber("--screen-glare", .32 * (1 - powerOn));
      setNumber("--video-opacity", powerOn);
    } else {
      const initialHinge = m.height * .67;
      const finalTop = (m.height - m.lidHeight - 9) / 2;
      setNumber("--hardware-y", mix(initialHinge - m.lidHeight, finalTop, zoom), "px");
      setNumber("--lid-angle", mix(-102, 0, opening), "deg");
      setNumber("--device-scale", mix(.66, 1, zoom));
      // Inclinazione lieve: rende leggibile il bordo da 7.5px durante l'apertura.
      setNumber("--device-yaw", mix(-12, 0, zoom), "deg");
      setNumber("--device-roll", mix(-1.2, 0, zoom), "deg");
      setNumber("--deck-angle", mix(78, 88, zoom), "deg");
      setNumber("--deck-opacity", 1 - ease(clamp((zoom - .25) / .75)));
      setNumber("--lip-opacity", zoom);
      setNumber("--screen-glare", .5 * (1 - opening));
      setNumber("--video-opacity", zoom);
    }
    updateVideo();
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
    const skip = anchor.classList.contains("skip-link");
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
    const mobile = mobilePreference.matches;
    root.classList.toggle("mobile-layout", mobile);
    const shouldEnable = !motionQuery.matches &&
      window.CSS?.supports("transform-style", "preserve-3d") &&
      window.CSS?.supports("perspective", "1000px") && "ResizeObserver" in window &&
      (!mobile || portraitPreference.matches);
    const phone = Boolean(shouldEnable && mobile);
    const backgroundParent = mobile && !shouldEnable ? document.getElementById("home") : screen;
    if (siteBackground.parentElement !== backgroundParent) backgroundParent.prepend(siteBackground);
    if (!shouldEnable) root.style.setProperty("--outer-shade", "0");
    root.classList.toggle("phone-enabled", phone);
    root.classList.toggle("macbook-enabled", Boolean(shouldEnable && !phone));
    const cue = document.querySelector(".scroll-cue .mono");
    if (cue) cue.textContent = phone ? "Scorri per accendere" : "Scorri per aprire";
    if (shouldEnable === active && phone === phoneMode) { requestMeasure(); updateVideo(); return; }
    // Conserva il contenuto raggiunto anche passando da desktop a mobile.
    const inIntro = active && metrics && window.scrollY < metrics.intro;
    const introProgress = inIntro ? window.scrollY / metrics.intro : 0;
    const oldOffset = active && metrics ? Math.max(0, window.scrollY - metrics.intro) : window.scrollY;
    active = Boolean(shouldEnable);
    phoneMode = phone;
    metrics = null;
    root.classList.toggle("laptop-enabled", active);
    if (active) {
      buildShell();
      if (!phone) buildKeyboard();
      measure();
      if (!initial) {
        const next = inIntro ? introProgress * metrics.intro : metrics.intro + Math.min(oldOffset, metrics.range);
        window.scrollTo({ top: next, behavior: "instant" });
      } else if (location.hash) goToHash(location.hash, true);
      render();
    } else {
      screen.inert = false;
      controls.inert = false;
      canInteract = true;
      experience.removeAttribute("data-phase");
      lastPhase = "";
      window.scrollTo({ top: oldOffset, behavior: "instant" });
    }
    updateVideo();
  }
  motionQuery.addEventListener("change", () => setMode());
  mobilePreference.addEventListener("change", () => setMode());
  portraitPreference.addEventListener("change", () => setMode());
  setMode(true);
  window.addEventListener("load", requestMeasure, { once: true });
  window.addEventListener("pageshow", requestMeasure);
  if (document.fonts?.ready) document.fonts.ready.then(requestMeasure);
  return { get enabled() { return active; } };
}


/* Carica i siti incorporati solo quando l'anteprima si avvicina alla vista.
   Non avvia tre pagine esterne durante il primo caricamento sul telefono. */
function initProjectPreviews() {
  const frames = document.querySelectorAll(".p-preview iframe[data-src]");
  const connection = navigator.connection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || "")) return;
  const load = frame => {
    frame.src = frame.dataset.src;
    frame.removeAttribute("data-src");
  };
  if (!("IntersectionObserver" in window)) { frames.forEach(load); return; }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      load(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "120px 0px", threshold: 0 });
  frames.forEach(frame => observer.observe(frame));
}
initProjectPreviews();

/* Video caricati su richiesta. Su mobile se ne riproduce uno alla volta:
   nel telefono 3D oppure, nel fallback, nella hero e nelle altre sezioni. */
function createMediaController(motionQuery, mobileQuery) {
  const inner = document.getElementById("site-background-video");
  const outer = document.getElementById("outer-background-video");
  const hero = document.getElementById("home");
  const connection = navigator.connection;
  const records = [inner, outer].filter(Boolean).map(video => ({ video, wanted: false, blocked: false }));
  let innerVisible = false;
  let outerVisible = true;
  let heroVisible = true;

  function play(record, wanted) {
    const { video } = record;
    if (!wanted) {
      if (record.wanted) video.pause();
      record.wanted = false;
      record.blocked = false;
      return;
    }
    if (record.wanted || record.blocked) return;
    record.wanted = true;
    video.muted = true;
    const source = video.querySelector("source[data-src]");
    if (source) {
      source.src = source.dataset.src;
      source.removeAttribute("data-src");
      video.load();
    }
    const promise = video.play();
    if (promise) promise.then(() => {
      if (!record.wanted) video.pause();
    }).catch(() => {
      record.wanted = false;
      record.blocked = true;
    });
  }

  function update() {
    const saveData = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || "");
    const allowed = !motionQuery.matches && !document.hidden && !saveData;
    records.forEach(record => {
      const flow = mobileQuery.matches && !document.documentElement.classList.contains("phone-enabled");
      const visible = record.video === inner
        ? (flow ? heroVisible : innerVisible)
        : (flow ? !heroVisible : outerVisible);
      play(record, allowed && visible);
    });
  }
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
      update();
    }, { threshold: 0 });
    observer.observe(hero);
  } else {
    window.addEventListener("scroll", () => {
      const rect = hero.getBoundingClientRect();
      heroVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      update();
    }, { passive: true });
  }
  document.addEventListener("visibilitychange", update);
  window.addEventListener("pagehide", () => records.forEach(record => play(record, false)));
  window.addEventListener("pageshow", update);
  motionQuery.addEventListener("change", update);
  mobileQuery.addEventListener("change", update);
  connection?.addEventListener?.("change", update);
  document.addEventListener("pointerdown", () => {
    records.forEach(record => { record.blocked = false; });
    update();
  }, { passive: true });
  return { setInnerVisible(visible, outerNeeded = true) { innerVisible = visible; outerVisible = outerNeeded; update(); } };
}
