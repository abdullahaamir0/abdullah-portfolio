import { projects } from '../data/content.js'
import Reveal from './Reveal.jsx'

function ProjectCard({ project }) {
  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <div className="project-card card" onMouseMove={handleMouseMove}>
      <div className="project-num">{project.num}</div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="tag-row">
        {project.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className="project-links">
        <a href={project.live} target="_blank" rel="noopener noreferrer">
          Live site →
        </a>
        <a href={project.source} target="_blank" rel="noopener noreferrer">
          Source →
        </a>
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects">
      <Reveal>
        <span className="section-tag">03 · Projects</span>
        <div className="section-head">
          <h2>Things I've built</h2>
        </div>
        <p className="section-lede">A mix of client and personal projects while learning the stack.</p>
      </Reveal>

      <Reveal className="project-grid" as="div">
        {projects.map((p) => (
          <ProjectCard project={p} key={p.num} />
        ))}
      </Reveal>
    </section>
  )
}
