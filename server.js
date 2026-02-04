import express from 'express'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const DATA_FILE = join(__dirname, 'data', 'data.json')

// Middleware
app.use(express.json())
app.use(express.static(join(__dirname, 'dist')))

// Ensure data directory exists
const dataDir = dirname(DATA_FILE)
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

// Initialize data file if not exists
function initializeDataFile() {
  if (!existsSync(DATA_FILE)) {
    const initialData = {
      prompts: [],
      tags: [],
      compositions: []
    }
    writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2))
  }
}

initializeDataFile()

// Helper functions
function readData() {
  try {
    const data = readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading data file:', error)
    return { prompts: [], tags: [], compositions: [] }
  }
}

function writeData(data) {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing data file:', error)
    return false
  }
}

// ============ PROMPTS API ============

// Get all prompts
app.get('/api/prompts', (req, res) => {
  const data = readData()
  res.json(data.prompts || [])
})

// Create prompt
app.post('/api/prompts', (req, res) => {
  const data = readData()
  const newPrompt = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  data.prompts.push(newPrompt)
  
  if (writeData(data)) {
    res.status(201).json(newPrompt)
  } else {
    res.status(500).json({ error: 'Failed to save prompt' })
  }
})

// Update prompt
app.put('/api/prompts/:id', (req, res) => {
  const data = readData()
  const index = data.prompts.findIndex(p => p.id === req.params.id)
  
  if (index === -1) {
    return res.status(404).json({ error: 'Prompt not found' })
  }
  
  data.prompts[index] = {
    ...data.prompts[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  }
  
  if (writeData(data)) {
    res.json(data.prompts[index])
  } else {
    res.status(500).json({ error: 'Failed to update prompt' })
  }
})

// Delete prompt
app.delete('/api/prompts/:id', (req, res) => {
  const data = readData()
  const index = data.prompts.findIndex(p => p.id === req.params.id)
  
  if (index === -1) {
    return res.status(404).json({ error: 'Prompt not found' })
  }
  
  data.prompts.splice(index, 1)
  
  if (writeData(data)) {
    res.status(204).send()
  } else {
    res.status(500).json({ error: 'Failed to delete prompt' })
  }
})

// ============ TAGS API ============

// Get all tags
app.get('/api/tags', (req, res) => {
  const data = readData()
  res.json(data.tags || [])
})

// Create tag
app.post('/api/tags', (req, res) => {
  const data = readData()
  const newTag = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  }
  data.tags.push(newTag)
  
  if (writeData(data)) {
    res.status(201).json(newTag)
  } else {
    res.status(500).json({ error: 'Failed to save tag' })
  }
})

// Delete tag
app.delete('/api/tags/:id', (req, res) => {
  const data = readData()
  const index = data.tags.findIndex(t => t.id === req.params.id)
  
  if (index === -1) {
    return res.status(404).json({ error: 'Tag not found' })
  }
  
  data.tags.splice(index, 1)
  
  if (writeData(data)) {
    res.status(204).send()
  } else {
    res.status(500).json({ error: 'Failed to delete tag' })
  }
})

// ============ COMPOSITIONS API ============

// Get all compositions
app.get('/api/compositions', (req, res) => {
  const data = readData()
  res.json(data.compositions || [])
})

// Create composition
app.post('/api/compositions', (req, res) => {
  const data = readData()
  const newComposition = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  }
  data.compositions.push(newComposition)
  
  if (writeData(data)) {
    res.status(201).json(newComposition)
  } else {
    res.status(500).json({ error: 'Failed to save composition' })
  }
})

// Delete composition
app.delete('/api/compositions/:id', (req, res) => {
  const data = readData()
  const index = data.compositions.findIndex(c => c.id === req.params.id)
  
  if (index === -1) {
    return res.status(404).json({ error: 'Composition not found' })
  }
  
  data.compositions.splice(index, 1)
  
  if (writeData(data)) {
    res.status(204).send()
  } else {
    res.status(500).json({ error: 'Failed to delete composition' })
  }
})

// Serve Vue app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Prompt Store server running at http://localhost:${PORT}`)
  console.log(`📁 Data file: ${DATA_FILE}`)
})
