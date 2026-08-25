const express = require('express')
const { readMessages } = require('../utils/storage')

const router = express.Router()

// GET /api/messages?key=YOUR_ADMIN_KEY
// A lightweight way to read every submitted message even if email isn't
// set up yet. Not meant to replace real auth — just gated by a private key.
router.get('/', async (req, res) => {
  const adminKey = process.env.ADMIN_KEY

  if (!adminKey) {
    return res.status(503).json({
      success: false,
      error: 'ADMIN_KEY is not set on the server. Add one to your .env to enable this endpoint.',
    })
  }

  if (req.query.key !== adminKey) {
    return res.status(401).json({ success: false, error: 'Invalid or missing key.' })
  }

  const messages = await readMessages()
  // Most recent first.
  res.json({ success: true, count: messages.length, messages: [...messages].reverse() })
})

module.exports = router
