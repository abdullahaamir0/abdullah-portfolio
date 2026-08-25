require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const contactRoute = require('./routes/contact')
const messagesRoute = require('./routes/messages')

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(helmet())
app.use(
  cors({
    origin: CLIENT_URL,
  })
)
app.use(express.json({ limit: '20kb' }))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.use('/api/contact', contactRoute)
app.use('/api/messages', messagesRoute)

// 404 fallback for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'Not found.' })
})

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Portfolio API running on http://localhost:${PORT}`)
    console.log(`Accepting requests from ${CLIENT_URL}`)
  })
}

module.exports = app