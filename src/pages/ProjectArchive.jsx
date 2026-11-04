import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import projects from '../data/projects.json';
import { getProjectGroups } from '../data/project-utils';

export default function ProjectArchive() {
  const { archive } = getProjectGroups(projects);
  const [category, setCategory] = useState('Tutti');
  const [order, setOrder] = useState('curated');
  const categories = ['Tutti', ...new Set(archive.map((project) => project.category))];
  const filtered = archive.filter(
    (project) => category === 'Tutti' || project.category === category,
  );
  const ordered =
    order === 'name'
      ? filtered.toSorted((a, b) => a.name.localeCompare(b.name))
      : filtered;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Project Archive — BUILT DIFFERENT.';
    document.getElementById('archive-title')?.focus();
    return () => {
      document.title = 'BUILT DIFFERENT. — Pierpaolo Iannicelli';
    };
  }, []);

  return (
    <div className="archive-page">
      <div className="section-meta flex justify-between gap-6">
        <span>03 / EXTENDED INDEX</span>
        <Link to="/" state={{ section: 'work' }}>
          ↖ BACK TO SELECTED WORK
        </Link>
      </div>
      <h1 className="section-title" id="archive-title" tabIndex="-1">
        PROJECT
        <br />
        <em>ARCHIVE.</em>
      </h1>
      <p className="archive-description">
        Altre esplorazioni, altre possibilità.
        <br />
        La raccolta dei progetti oltre i quattro in evidenza.
      </p>
      {archive.length > 0 ? (
        <>
          <div className="archive-filters">
            <label>
              CATEGORIA
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              ORDINE
              <select value={order} onChange={(event) => setOrder(event.target.value)}>
                <option value="curated">Selezione editoriale</option>
                <option value="name">Nome A–Z</option>
              </select>
            </label>
            <span aria-live="polite">{ordered.length} PROGETTI</span>
          </div>
          <div className="project-grid archive-grid grid">
            {ordered.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} compact />
            ))}
          </div>
        </>
      ) : (
        <div className="archive-empty">
          <span className="empty-index">[ 00 ]</span>
          <h2>
            IL PROSSIMO CAPITOLO
            <br />È ANCORA DA SCRIVERE.
          </h2>
          <p>Nessun progetto nell’archivio, per ora.</p>
          <Link to="/" state={{ section: 'work' }}>
            ESPLORA LA SELEZIONE ↗
          </Link>
        </div>
      )}
    </div>
  );
}
