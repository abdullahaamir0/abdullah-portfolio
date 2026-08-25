import { heroStats, roles } from '../data/content.js'
import useRoleCycle from '../hooks/useRoleCycle.js'

export default function Hero() {
  const role = useRoleCycle(roles)

  function goTo(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="home">
      <div className="hero-eyebrow">
        <span className="pulse"></span> Available for freelance work
      </div>
      <h1>
        Hey, I'm
        <br />
        <span className="grad">Abdullah Amir.</span>
      </h1>
      <div className="role-line">
        &gt; <span>{role}</span>
        <span className="cursor2"></span>
      </div>
      <p className="lede">
        I design and build clean, fast websites — currently studying Computer Science at UMT Lahore
        while sharpening my front-end craft and picking up full-stack skills along the way.
      </p>
      <div className="btn-row">
        <a className="btn btn-primary" onClick={() => goTo('projects')}>
          View Projects →
        </a>
        <a className="btn btn-ghost" onClick={() => goTo('contact')}>
          Get in Touch
        </a>
      </div>
      <div className="hero-stats">
        {heroStats.map((s) => (
          <div className="stat" key={s.label}>
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
