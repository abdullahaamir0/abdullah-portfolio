const express = require('express')
const rateLimit = require('express-rate-limit')
const { saveMessage } = require('../utils/storage')
const { sendContactEmail, sendConfirmationEmail, isConfigured } = require('../utils/mailer')

const router = express.Router()

// Limit this endpoint specifically: 5 submissions per 15 minutes per IP.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many messages sent. Please try again later.' },
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, message, company } = req.body || {}

    // Honeypot: real users never fill this hidden field. Pretend success
    // so bots don't learn anything, but don't actually save/send it.
    if (company) {
      return res.json({ success: true })
    }

    const errors = {}
    if (!name || !String(name).trim()) errors.name = 'Name is required.'
    if (!email || !EMAIL_RE.test(String(email).trim())) errors.email = 'A valid email is required.'
    if (!message || String(message).trim().length < 10) {
      errors.message = 'Message must be at least 10 characters.'
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, error: 'Please check the form and try again.', fields: errors })
    }

    const cleanName = String(name).trim().slice(0, 200)
    const cleanEmail = String(email).trim().slice(0, 200)
    const cleanMessage = String(message).trim().slice(0, 5000)

    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      receivedAt: new Date().toISOString(),
      ip: req.ip,
    }

    // Always save first — this is the source of truth even if email fails.
    await saveMessage(entry)

    let emailed = false
    try {
      emailed = await sendContactEmail({ name: cleanName, email: cleanEmail, message: cleanMessage })
      if (emailed) {
        // Best-effort confirmation to the visitor — never blocks the response.
        sendConfirmationEmail({ name: cleanName, email: cleanEmail }).catch((err) =>
          console.error('Confirmation email failed:', err.message)
        )
      }
    } catch (err) {
      console.error('Failed to send contact email:', err.message)
    }

    res.json({
      success: true,
      emailed,
      note: isConfigured()
        ? undefined
        : 'Saved to the server. Configure SMTP in .env to also receive these by email.',
    })
  } catch (err) {
    console.error('Contact route error:', err)
    res.status(500).json({ success: false, error: 'Something went wrong on the server. Please try again shortly.' })
  }
})

module.exports = router
