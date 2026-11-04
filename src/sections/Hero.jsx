import { Arrow, OrbitalBackground, TechnicalFrame } from '../components/Graphics';
import { site } from '../config/site';
import { assetUrl } from '../data/project-utils';
import { scrollToSection } from '../hooks/useSectionNavigation';

const skills = ['FRONTEND', 'BACKEND', 'INTEGRATIONS', 'CMS / E-COMMERCE', 'DEPLOY'];

export default function Hero() {
  return (
    <section
      id="home"
      tabIndex="-1"
      data-main-section
      className="hero framed-section"
      aria-labelledby="hero-title"
    >
      <OrbitalBackground variant="hero-orbital" />
      <TechnicalFrame />
      <span className="cross cross-one" aria-hidden="true">
        +
      </span>
      <span className="cross cross-two" aria-hidden="true">
        +
      </span>
      <div className="hero-layout">
        <h1 id="hero-title" className="hero-title">
          <span className="word-mask">
            <span className="hero-word">BEYOND</span>
          </span>
          <span className="word-mask">
            <span className="hero-word">THE</span>
          </span>
          <span className="word-mask interface-mask">
            <em className="hero-word hero-impact">INTERFACE.</em>
          </span>
        </h1>
        <div className="hero-details">
          <p className="eyebrow hero-index hero-reveal">INDEX / 01 — 04</p>
          <div className="hero-description hero-reveal">
            <h2>
              WEB DEVELOPMENT
              <br />
              END-TO-END THINKING
            </h2>
            <p>
              Sviluppo esperienze e soluzioni web,
              <br className="desktop-break" /> dall’interfaccia alla messa online.
            </p>
          </div>
          <ul className="skill-tags hero-reveal">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
          <figure className="portrait hero-reveal">
            <div className="portrait-image">
              <img
                src={assetUrl(site.portrait)}
                alt={site.portraitAlt}
                width="700"
                height="210"
                fetchPriority="high"
              />
              <span className="portrait-scan" aria-hidden="true" />
            </div>
            <figcaption>// PI®</figcaption>
          </figure>
          <div className="dot-field hero-reveal" aria-hidden="true" />
        </div>
      </div>
      <div className="hero-bottom hero-reveal">
        <button
          className="explore-label"
          onClick={() => scrollToSection('process', true)}
        >
          SCROLL TO EXPLORE <span />
        </button>
        <button
          className="circle-arrow"
          aria-label="Esplora Surface e System"
          onClick={() => scrollToSection('process', true)}
        >
          <Arrow />
        </button>
        <span className="hero-bottom-note">DESIGN × CODE</span>
      </div>
    </section>
  );
}
