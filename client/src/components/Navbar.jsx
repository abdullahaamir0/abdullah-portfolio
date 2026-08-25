import { useState } from 'react'
import { navItems, profile } from '../data/content.js'
import useScrollSpy from '../hooks/useScrollSpy.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(navItems.map((n) => n.id))

  function goTo(id) {
    setOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="navbar">
      <button className="logo" onClick={() => goTo('home')} aria-label="Go to top">
        {profile.initials}
      </button>

      <div className={`nav-links ${open ? 'open' : ''}`}>
        {navItems.map((item) => (
          <a
            key={item.id}
            className={active === item.id ? 'active' : ''}
            onClick={() => goTo(item.id)}
          >
            {item.label}
          </a>
        ))}
      </div>

      <a className="nav-cta" onClick={() => goTo('contact')}>
        Hire Me
      </a>

      <button
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        ☰
      </button>
    </nav>
  )
}
