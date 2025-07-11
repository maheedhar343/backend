const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const DATA_FILE = 'data.json';

app.use(express.json());
app.use(express.static('.')); // Serve index.html

// Read data
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

// Write data
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// GET all
app.get('/api/data', (req, res) => {
  res.json(readData());
});

// POST new item
app.post('/api/data', (req, res) => {
  const data = readData();
  const newItem = { id: Date.now(), ...req.body };
  data.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// PUT update by ID
app.put('/api/data/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).send('Not found');
  data[index] = { ...data[index], ...req.body };
  writeData(data);
  res.json(data[index]);
});

// DELETE by ID
app.delete('/api/data/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const newData = data.filter(item => item.id !== id);
  if (newData.length === data.length) return res.status(404).send('Not found');
  writeData(newData);
  res.sendStatus(204);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
