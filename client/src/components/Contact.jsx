import { useState } from 'react'
import { profile } from '../data/content.js'
import Reveal from './Reveal.jsx'

const API_URL = (import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:5000'

const EMPTY_FORM = { name: '', email: '', message: '', company: '' } // `company` is the honeypot

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your name.'
  if (!form.email.trim()) {
    errors.email = 'Please enter your email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!form.message.trim()) {
    errors.message = 'Please write a short message.'
  } else if (form.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters.'
  }
  return errors
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [statusMessage, setStatusMessage] = useState('')

  function handleChange(e) {
    const { id, value } = e.target
    setForm((f) => ({ ...f, [id]: value }))
    if (errors[id]) setErrors((er) => ({ ...er, [id]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Honeypot: if this hidden field got filled in, it's almost certainly a bot.
    // Pretend it worked and quietly drop it.
    if (form.company) {
      setStatus('success')
      setStatusMessage("Thanks! Your message is on its way.")
      setForm(EMPTY_FORM)
      return
    }

    const foundErrors = validate(form)
    setErrors(foundErrors)
    if (Object.keys(foundErrors).length > 0) return

    setStatus('sending')
    setStatusMessage('')

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      setStatusMessage("Thanks! Your message has been sent — I'll get back to you soon.")
      setForm(EMPTY_FORM)
    } catch (err) {
      setStatus('error')
      setStatusMessage(
        err.message === 'Failed to fetch'
          ? "Couldn't reach the server. Please check your connection and try again, or email me directly."
          : err.message
      )
    }
  }

  const sending = status === 'sending'

  return (
    <section id="contact">
      <Reveal>
        <span className="section-tag">04 · Contact</span>
        <div className="section-head">
          <h2>Let's work together</h2>
        </div>
        <p className="section-lede">
          Open to freelance gigs, small websites, and collaboration. I usually reply within a day or two.
        </p>
      </Reveal>

      <Reveal className="contact-grid" as="div">
        <form className="contact-form card" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'err' : ''}
              disabled={sending}
              autoComplete="name"
            />
            {errors.name && <div className="field-err">{errors.name}</div>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'err' : ''}
              disabled={sending}
              autoComplete="email"
            />
            {errors.email && <div className="field-err">{errors.email}</div>}
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="Tell me about your project..."
              value={form.message}
              onChange={handleChange}
              className={errors.message ? 'err' : ''}
              disabled={sending}
            />
            {errors.message && <div className="field-err">{errors.message}</div>}
          </div>

          {/* Honeypot field — hidden from real users, bots often fill it in */}
          <div className="hp-field" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.company}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={sending}>
            {sending && <span className="spinner"></span>}
            {sending ? 'Sending…' : 'Send Message'}
          </button>

          {status === 'success' && <div className="form-status success">✓ {statusMessage}</div>}
          {status === 'error' && <div className="form-status error">⚠ {statusMessage}</div>}

          <p className="form-note">Messages go straight to my inbox — no third-party form service.</p>
        </form>

        <div className="contact-info card">
          <div className="contact-row">
            <span className="label">Email</span>
            <a className="value grad" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>
          <div className="contact-row">
            <span className="label">Phone</span>
            <a className="value" href={`tel:${profile.phone.replace(/\s+/g, '')}`}>
              {profile.phone}
            </a>
          </div>
          <div className="contact-row">
            <span className="label">Location</span>
            <span className="value">{profile.location}</span>
          </div>
          <div className="social-row">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
