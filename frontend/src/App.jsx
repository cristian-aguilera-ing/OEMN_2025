import React, { useState, useCallback } from 'react';
import EditorUI from './components/EditorUI';
import Canvas3D from './components/Canvas3D';
import DrawingCanvas from './components/DrawingCanvas';

// Estado inicial centralizado para facilitar el reseteo
const initialState = {
  productType: 'backpack',
  colors: {
    body: '#ffffff',
    adjustmentStraps: '#969696',
    loadStraps: '#333333',
    sidePockets: '#cccccc',
  },
  texture: 'none',
  customText: {
    content: 'OEMN',
    color: '#000000',
    font: 'Ailerons',
    size: 1, // Corregido a 1 por defecto
    positionX: 0,
    positionY: 0.35,
    positionZ: 0.36,
  },
  drawingTexture: null,
  customImage: {
    src: null,
    transform: {
      offsetX: 0.5,
      offsetY: 0.5,
      scale: 1,
      rotation: 0,
    }
  }
};

function App() {
  const [productType, setProductType] = useState(initialState.productType);
  const [colors, setColors] = useState(initialState.colors);
  const [texture, setTexture] = useState(initialState.texture);
  const [customText, setCustomText] = useState(initialState.customText);
  const [drawingTexture, setDrawingTexture] = useState(initialState.drawingTexture);
  const [isDrawing, setIsDrawing] = useState(false);
  const [customImage, setCustomImage] = useState(initialState.customImage);

  const handleApplyDrawing = (dataUrl) => {
    setDrawingTexture(dataUrl);
    setTexture('custom'); // Activa la textura de dibujo
    setIsDrawing(false);
  };

  const handleImageUpload = (dataUrl) => {
    setCustomImage(prev => ({ ...prev, src: dataUrl }));
    setTexture('customImage'); // Activa la textura de imagen subida
  };

  const setImageTransform = (transform) => {
    setCustomImage(prev => ({...prev, transform}));
  };
  
  const handleReset = useCallback(() => {
    setProductType(initialState.productType);
    setColors(initialState.colors);
    setTexture(initialState.texture);
    setCustomText(initialState.customText);
    setDrawingTexture(initialState.drawingTexture);
    setCustomImage(initialState.customImage);
  }, []);

  const handleSave = async () => {
    const designData = {
      productType,
      colors,
      texture,
      customText,
      drawingTexture,
      customImage,
    };
    try {
      const response = await fetch('http://localhost:5001/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const savedDesign = await response.json();
      console.log('Diseño guardado:', savedDesign);
      alert('¡Tu diseño ha sido guardado con éxito!');
    } catch (error) {
      console.error('Error al guardar el diseño:', error);
      alert('Hubo un problema al guardar tu diseño. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex font-sans">
      {isDrawing && <DrawingCanvas onClose={() => setIsDrawing(false)} onApply={handleApplyDrawing} />}
      
      <EditorUI
        productType={productType} setProductType={setProductType}
        colors={colors} setColors={setColors}
        texture={texture} setTexture={setTexture}
        customText={customText} setCustomText={setCustomText}
        onSave={handleSave}
        onOpenDrawing={() => setIsDrawing(true)}
        onReset={handleReset}
        onImageUpload={handleImageUpload}
        imageTransform={customImage.transform}
        setImageTransform={setImageTransform}
        hasCustomImage={!!customImage.src}
      />

      <div className="flex-grow h-full">
        <Canvas3D
          productType={productType}
          colors={colors}
          texture={texture}
          customText={customText}
          drawingTexture={drawingTexture}
          customImage={customImage}
        />
      </div>
    </div>
  );
}

export default App;

