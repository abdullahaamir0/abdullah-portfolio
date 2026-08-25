const nodemailer = require('nodemailer')

function isConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

let transporter = null
function getTransporter() {
  if (!isConfigured()) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) !== 587, // true for 465, false for 587 (STARTTLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  return transporter
}

/**
 * Emails the site owner a new contact-form submission.
 * Returns true if the email was sent, false if SMTP isn't configured
 * (the caller should treat that as "saved, but not emailed" rather than an error).
 */
async function sendContactEmail({ name, email, message }) {
  const t = getTransporter()
  if (!t) return false

  const to = process.env.TO_EMAIL || process.env.SMTP_USER

  await t.sendMail({
    from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
    to,
    replyTo: email,
    subject: `New portfolio message from ${name}`,
    text: `You got a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family:sans-serif; line-height:1.6;">
        <h2>New message from your portfolio</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `,
  })

  return true
}

/**
 * Sends a short "I got your message" confirmation back to the visitor.
 * Best-effort only — failures here should never break the main flow.
 */
async function sendConfirmationEmail({ name, email }) {
  const t = getTransporter()
  if (!t) return false

  await t.sendMail({
    from: `"Muhammad Abdullah Amir" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Got your message — thanks for reaching out!",
    text: `Hi ${name},\n\nThanks for reaching out through my portfolio — I've received your message and will get back to you within a day or two.\n\n— Abdullah`,
    html: `
      <div style="font-family:sans-serif; line-height:1.6;">
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thanks for reaching out through my portfolio — I've received your message and will get back to you within a day or two.</p>
        <p>— Abdullah</p>
      </div>
    `,
  })

  return true
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

module.exports = { isConfigured, sendContactEmail, sendConfirmationEmail }
