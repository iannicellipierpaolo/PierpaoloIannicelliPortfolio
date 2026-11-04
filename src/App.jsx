import { useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import SurfaceSystem from './sections/SurfaceSystem';
import FeaturedProjects from './sections/FeaturedProjects';
import Contact from './sections/Contact';
import ProjectArchive from './pages/ProjectArchive';
import usePortfolioMotion from './animations/usePortfolioMotion';

function Portfolio() {
  const root = useRef(null);
  usePortfolioMotion(root);

  return (
    <div ref={root}>
      <Hero />
      <SurfaceSystem />
      <FeaturedProjects />
      <Contact />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main id="main" tabIndex="-1">
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/archive" element={<ProjectArchive />} />
          <Route
            path="*"
            element={
              <div className="archive-page">
                <h1 className="section-title">
                  404.
                  <br />
                  <em>OFF TRACK.</em>
                </h1>
                <Link to="/">TORNA ALLA HOME ↗</Link>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
