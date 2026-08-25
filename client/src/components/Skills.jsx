import { skills, tools } from '../data/content.js'
import Reveal from './Reveal.jsx'

export default function Skills() {
  return (
    <section id="skills">
      <Reveal>
        <span className="section-tag">02 · Skills</span>
        <div className="section-head">
          <h2>What I work with</h2>
        </div>
        <p className="section-lede">Strongest on the front end, and building outward from there.</p>
      </Reveal>

      <Reveal className="skills-grid" as="div">
        {skills.map((s) => (
          <div className="skill-card card" key={s.name}>
            <div className="skill-top">
              <span>{s.name}</span>
              <span className="pct">{s.pct}%</span>
            </div>
            <div className="meter">
              <span style={{ width: `${s.pct}%` }}></span>
            </div>
          </div>
        ))}
      </Reveal>

      <Reveal className="tool-row" as="div">
        {tools.map((t) => (
          <span className="tool-chip" key={t}>
            {t}
          </span>
        ))}
      </Reveal>
    </section>
  )
}
