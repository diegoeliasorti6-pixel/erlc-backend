const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// La API Key se lee de la variable de entorno en Render
const ERLC_API_KEY = process.env.ERLC_API_KEY;
const ERLC_BASE_URL = 'https://api.policeroleplay.community/v1';

const erlcClient = axios.create({
  baseURL: ERLC_BASE_URL,
  headers: {
    'Server-Key': ERLC_API_KEY
  }
});

// Llamadas activas del 911 (Para la MDT)
app.get('/api/erlc/calls', async (req, res) => {
  try {
    const response = await erlcClient.get('/server/calls');
    res.json({ success: true, calls: response.data });
  } catch (error) {
    console.error('Error al obtener llamadas:', error.message);
    res.status(500).json({ success: false, error: 'No se pudieron consultar las llamadas' });
  }
});

// Jugadores conectados
app.get('/api/erlc/players', async (req, res) => {
  try {
    const response = await erlcClient.get('/server/players');
    res.json({ success: true, players: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Estado del servidor
app.get('/api/erlc/status', async (req, res) => {
  try {
    const response = await erlcClient.get('/server');
    res.json({ success: true, server: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ERLC corriendo en el puerto ${PORT}`);
});
