import { Brand, Arrow } from './Graphics';
import useSectionNavigation from '../hooks/useSectionNavigation';

export default function Footer() {
  const { goTo } = useSectionNavigation();

  return (
    <footer className="site-footer">
      <button
        className="brand-link"
        aria-label="Torna all’inizio"
        onClick={() => goTo('home')}
      >
        <Brand small />
      </button>
      <p>
        © {new Date().getFullYear()} PIERPAOLO IANNICELLI
        <br />
        <span>PI® / WEB DEVELOPER</span>
      </p>
      <button className="back-to-top" onClick={() => goTo('home')}>
        BACK TO TOP <Arrow />
      </button>
    </footer>
  );
}
