const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;
const path = require('path');
const DATA_FILE = path.join(__dirname, 'actividades.json');

app.use(cors());
app.use(express.json());

// Leer todas las actividades
app.get('/actividades', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

// Crear una nueva actividad
app.post('/actividades', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const nuevaActividad = { id: Date.now(), ...req.body };
  data.push(nuevaActividad);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(201).json(nuevaActividad);
});

// Actualizar una actividad
app.put('/actividades/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const id = parseInt(req.params.id);
  const index = data.findIndex(a => a.id === id);
  if (index !== -1) {
    data[index] = { id, ...req.body };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(data[index]);
  } else {
    res.status(404).send('Actividad no encontrada');
  }
});

// Eliminar una actividad
app.delete('/actividades/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE));
  const id = parseInt(req.params.id);
  data = data.filter(a => a.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
