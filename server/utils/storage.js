const fs = require('fs/promises')
const path = require('path')

const DATA_FILE = path.join(__dirname, '..', 'data', 'messages.json')

async function ensureFile() {
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, '[]', 'utf-8')
  }
}

async function readMessages() {
  await ensureFile()
  const raw = await fs.readFile(DATA_FILE, 'utf-8')
  try {
    return JSON.parse(raw)
  } catch {
    // If the file ever gets corrupted, don't crash the server — start fresh.
    return []
  }
}

async function saveMessage(entry) {
  const messages = await readMessages()
  messages.push(entry)
  await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), 'utf-8')
  return entry
}

module.exports = { readMessages, saveMessage }
