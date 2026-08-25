import { aboutParagraphs, timeline } from '../data/content.js'
import Reveal from './Reveal.jsx'

export default function About() {
  return (
    <section id="about">
      <Reveal>
        <span className="section-tag">01 · About</span>
        <div className="section-head">
          <h2>A little about me</h2>
        </div>
        <p className="section-lede">The short version: I like turning ideas into interfaces.</p>
      </Reveal>

      <div className="about-grid">
        <Reveal className="about-text">
          {aboutParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>

        <Reveal className="timeline">
          {timeline.map((item) => (
            <div className="timeline-item" key={item.title}>
              <div className="date">{item.date}</div>
              <div className="title">{item.title}</div>
              <div className="sub">{item.sub}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
