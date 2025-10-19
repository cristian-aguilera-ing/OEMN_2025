const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Design = require('./models/Design');

const app = express();

// Middlewares
app.use(cors());
// Usamos el límite por defecto, ya que no manejaremos imágenes grandes
app.use(express.json());

// Conexión a la Base de Datos
const mongoUri = process.env.MONGO_URI || 'mongodb://database:27017/disena_tu_estilo';
mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB conectado exitosamente.'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas de la API
app.get('/', (req, res) => {
    res.send('API para Diseña tu Estilo está corriendo...');
});

// POST para guardar un nuevo diseño (ahora más simple)
app.post('/api/designs', async (req, res) => {
    try {
        // Extraemos solo los datos relevantes (sin la imagen)
        const {
            productType,
            colors,
            texture,
            customText,
            drawingTexture
        } = req.body;

        const newDesign = new Design({
            productType,
            colors,
            texture,
            customText,
            drawingTexture
        });

        const savedDesign = await newDesign.save();
        res.status(201).json(savedDesign);
    } catch (error) {
        console.error('Error al guardar el diseño:', error);
        res.status(500).json({ message: 'Error interno del servidor al guardar el diseño' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

