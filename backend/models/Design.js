const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DesignSchema = new Schema({
    productType: { type: String, required: true },
    colors: {
        body: String,
        adjustmentStraps: String,
        loadStraps: String,
        sidePockets: String,
        frontPocket: String,
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
    customImage: {
        src: String, // Almacenará la imagen en formato Base64
        // Guardamos los datos de transformación
        transform: {
            scale: Number,
            offsetX: Number,
            offsetY: Number,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Design', DesignSchema);

