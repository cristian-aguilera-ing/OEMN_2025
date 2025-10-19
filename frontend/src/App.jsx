import React, { useState } from 'react';
import EditorUI from './components/EditorUI';
import Canvas3D from './components/Canvas3D';
import DrawingCanvas from './components/DrawingCanvas';

export default function App() {
  const [productType, setProductType] = useState('backpack');
  const [colors, setColors] = useState({
    body: '#ffffff',
    adjustmentStraps: '#969696',
    loadStraps: '#333333',
    sidePockets: '#666666',
  });
  const [texture, setTexture] = useState('none');
  const [customText, setCustomText] = useState({
    content: 'OEMN',
    color: '#000000',
    font: 'Formula1-Bold',
    size: 1,
    positionX: 0,
    positionY: 0.35,
    positionZ: 0.36, 
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTexture, setDrawingTexture] = useState(null);

  const handleSave = async () => {
    const designData = {
      productType,
      colors,
      texture,
      customText,
      drawingDataUrl: texture === 'custom' ? drawingTexture : null,
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
      alert('Hubo un problema al guardar tu diseño.');
    }
  };
  
  const handleApplyDrawing = (dataUrl) => {
    setDrawingTexture(dataUrl);
    setTexture('custom');
    setIsDrawing(false);
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex font-sans">
      <EditorUI
        productType={productType}
        setProductType={setProductType}
        colors={colors}
        setColors={setColors}
        texture={texture}
        setTexture={setTexture}
        customText={customText}
        setCustomText={setCustomText}
        onSave={handleSave}
        onOpenDrawing={() => setIsDrawing(true)}
      />
      <div className="flex-1 h-full relative">
        <Canvas3D 
          productType={productType}
          colors={colors}
          texture={texture}
          customText={customText}
          drawingTexture={drawingTexture}
        />
      </div>
       {isDrawing && (
        <DrawingCanvas 
          onClose={() => setIsDrawing(false)}
          onApply={handleApplyDrawing}
        />
      )}
    </div>
  );
}

