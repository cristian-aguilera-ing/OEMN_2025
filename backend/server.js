const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Design = require('./models/Design');

const app = express();

app.use(cors());
// Aumentamos el límite para poder recibir imágenes en formato Base64
app.use(express.json({ limit: '10mb' }));

const mongoUri = process.env.MONGO_URI || 'mongodb://database:27017/disena_tu_estilo';
mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB conectado exitosamente.'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

app.post('/api/designs', async (req, res) => {
    try {
        const {
            productType,
            colors,
            texture,
            customText,
            customImage // Recibimos el objeto de la imagen
        } = req.body;

        const newDesign = new Design({
            productType,
            colors,
            texture,
            customText,
            customImage // Guardamos la imagen
        });

        const savedDesign = await newDesign.save();
        res.status(201).json(savedDesign);
    } catch (error)
    {
        console.error('Error al guardar el diseño:', error);
        res.status(500).json({ message: 'Error interno del servidor al guardar el diseño' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

