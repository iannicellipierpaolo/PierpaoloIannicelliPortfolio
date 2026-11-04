import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { Arrow } from '../components/Graphics';
import projects from '../data/projects.json';
import { getProjectGroups } from '../data/project-utils';

export default function FeaturedProjects() {
  const { featured, archive } = getProjectGroups(projects);

  return (
    <section
      id="work"
      data-main-section
      tabIndex="-1"
      className="work-section"
      aria-labelledby="work-title"
    >
      <div className="section-meta flex justify-between gap-6">
        <span>03 / SELECTED WORK</span>
        <span>CURATED INDEX / {String(featured.length).padStart(2, '0')}</span>
      </div>
      <div className="work-heading">
        <h2 className="section-title" id="work-title">
          SELECTED
          <br />
          <em>WORK.</em>
        </h2>
        <p>
          Idee che prendono forma.
          <br />
          Interfacce che diventano esperienze.
        </p>
      </div>
      <div className="project-grid grid">
        {featured.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
      <Link to="/archive" className="archive-link">
        <span>
          EXPLORE ALL PROJECTS{' '}
          <small>[ {String(archive.length).padStart(2, '0')} IN ARCHIVE ]</small>
        </span>
        <Arrow diagonal />
      </Link>
    </section>
  );
}
