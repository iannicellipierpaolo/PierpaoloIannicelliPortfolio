import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function scrollToSection(id, focus = false, immediate = false) {
  const element = document.getElementById(id);
  if (!element) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({
    behavior: reduced || immediate ? "instant" : "smooth",
  });
  if (focus) element.focus({ preventScroll: true });
}

export default function useSectionNavigation({ trackActive = true } = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("home");

  useEffect(() => {
    if (!trackActive || location.pathname !== "/") return;

    const destination = location.state?.section;
    const frame = requestAnimationFrame(() => {
      if (destination) scrollToSection(destination, true, true);
    });

    const sections = [...document.querySelectorAll("[data-main-section]")];
    let pending = 0;
    const update = () => {
      pending = 0;
      const threshold = window.innerHeight * 0.38;
      const current = sections.findLast(
        (section) => section.getBoundingClientRect().top <= threshold,
      );
      setActive(current?.id || "home");
    };
    const scheduleUpdate = () => {
      if (!pending) pending = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [location, trackActive]);

  const goTo = useCallback(
    (id) => {
      if (location.pathname !== "/") {
        navigate("/", { state: { section: id } });
      } else {
        scrollToSection(id, true);
      }
    },
    [location.pathname, navigate],
  );

  return { active: location.pathname === "/archive" ? "work" : active, goTo };
}
