const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema simplificado sin los campos de la imagen
const DesignSchema = new Schema({
    productType: { type: String, required: true },
    colors: {
        body: String,
        adjustmentStraps: String,
        loadStraps: String,
        sidePockets: String,
    },
    texture: { type: String, default: 'none' },
    customText: {
        content: String,
        color: String,
        font: String,
        size: Number,
        positionX: Number,
        positionY: Number,
        positionZ: Number,
    },
    drawingTexture: { type: String }, // Base64 del lienzo de dibujo
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Design', DesignSchema);

