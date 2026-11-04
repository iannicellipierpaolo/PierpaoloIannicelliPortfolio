import { useId } from 'react';

export function Arrow({ diagonal = false, className = '' }) {
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

export function OrbitalBackground({ variant = '' }) {
  const noiseId = useId().replaceAll(':', '');

  return (
    <div className={`orbital-scene ${variant}`} aria-hidden="true">
      <div className="orbital-drift">
        <div className="planet">
          <svg className="planet-noise" width="100%" height="100%">
            <filter id={noiseId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.64"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${noiseId})`} />
          </svg>
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
    <span className={`brand ${small ? 'brand-small' : ''}`}>
      BUILT <em>DIFFERENT.</em>
      <sup>®</sup>
    </span>
  );
}
