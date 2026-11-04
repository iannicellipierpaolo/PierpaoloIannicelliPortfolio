import { Arrow, OrbitalBackground, TechnicalFrame } from '../components/Graphics';
import { site } from '../config/site';

export default function Contact() {
  const email = site.email.trim();

  return (
    <section
      id="contact"
      data-main-section
      tabIndex="-1"
      className="contact framed-section"
      aria-labelledby="contact-title"
    >
      <div className="contact-fill" aria-hidden="true" />
      <OrbitalBackground variant="contact-orbital" />
      <TechnicalFrame />
      <div className="contact-content">
        <div className="section-meta flex justify-between gap-6">
          <span>04 / THE CONNECTION</span>
          <span>PI® / {new Date().getFullYear()}</span>
        </div>
        <h2 id="contact-title">
          <span className="word-mask">
            <span className="contact-word">GOT AN</span>
          </span>
          <span className="word-mask">
            <span className="contact-word">IDEA?</span>
          </span>
          <span className="word-mask contact-impact">
            <em className="contact-word">
              <span>LET'S</span> <span>BUILD IT.</span>
            </em>
          </span>
        </h2>
        <div className="contact-action">
          {email ? (
            <a href={`mailto:${email}`}>
              WRITE ME AN EMAIL <Arrow diagonal />
            </a>
          ) : (
            <div className="email-pending">
              <span>
                WRITE ME AN EMAIL <small>INDIRIZZO IN ARRIVO</small>
              </span>
              <Arrow diagonal />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
