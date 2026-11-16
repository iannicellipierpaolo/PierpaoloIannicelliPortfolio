import { assetUrl } from "../data/project-utils";

export function Arrow({ diagonal = false, className = "" }) {
  return (
    <svg
      className={`arrow-icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {diagonal ? (
        <path d="M5 19 19 5M5 5h14v14" />
      ) : (
        <path d="M12 3v18M4 13l8 8 8-8" />
      )}
    </svg>
  );
}

export function TechnicalFrame() {
  return (
    <div className="technical-frame" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}

export function OrbitalBackground({ variant = "" }) {
  return (
    <div className={`orbital-scene ${variant}`} aria-hidden="true">
      <div className="orbital-drift">
        <div className="planet">
          <div
            className="planet-noise"
            style={{ backgroundImage: `url(${assetUrl("assets/grain.webp")})` }}
          />
        </div>
        <div className="orbit orbit-one">
          <i />
        </div>
        <div className="orbit orbit-two" />
      </div>
    </div>
  );
}

export function Brand({ small = false }) {
  return (
    <span className={`brand ${small ? "brand-small" : ""}`}>
      BUILT <em>DIFFERENT.</em>
      <sup>®</sup>
    </span>
  );
}
