import React, { useState, useCallback, useEffect } from 'react';
import EditorUI from '../components/EditorUI';
import Canvas3D from '../components/Canvas3D';

const initialState = {
  productType: 'backpack',
  colors: {
    body: '#ffffff',
    adjustmentStraps: '#969696',
    loadStraps: '#333333',
    sidePockets: '#cccccc',
    frontPocket: '#ffffff',
  },
  texture: 'none',
  customText: {
    content: 'OEMN',
    color: '#000000',
    font: 'Formula1-Bold',
    size: 1,
    positionX: 0,
    positionY: 0.92,
    positionZ: 0.28,
  },
  customImage: {
    src: null,
    // Estado inicial para la transformación de la imagen
    transform: {
      scale: 0.45,      // Zoom inicial (10x zoom)
      // CAMBIO: Estos valores ahora son "Pan" (paneo/movimiento)
      // He calculado el valor para que coincida con tu '0.85' anterior
      // (0.85 - 0.5) * 0.9 = 0.315
      // La nueva fórmula es: (Offset Base) + (Pan)
      offsetX: 1.30,  // Pan X
      offsetY: 1.75,  // Pan Y
    }
  }
};

function App() {
  const [productType, setProductType] = useState(initialState.productType);
  const [colors, setColors] = useState(initialState.colors);
  const [texture, setTexture] = useState(initialState.texture);
  const [customText, setCustomText] = useState(initialState.customText);
  const [customImage, setCustomImage] = useState(initialState.customImage);

  const handleImageUpload = (dataUrl) => {
    // Si se quita la imagen (dataUrl es null)
    if (!dataUrl) {
      setCustomImage(initialState.customImage);
    } else {
      // ¡ESTA ES LA CORRECCIÓN!
      // Cuando subimos una imagen, reseteamos su estado 'transform'
      // al valor inicial para evitar el 'undefined'.
      setCustomImage(prev => ({
        ...prev, // Mantenemos estado previo si lo hubiera
        src: dataUrl,
        transform: initialState.customImage.transform // ¡Restauramos el transform!
      }));
    }
  };

  const handleReset = useCallback(() => {
    setProductType(initialState.productType);
    setColors(initialState.colors);
    setTexture(initialState.texture);
    setCustomText(initialState.customText);
    setCustomImage(initialState.customImage);
  }, []);

  const handleSave = async () => {
    const designData = {
      productType,
      colors,
      texture,
      customText,
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

  // y fuerza el scroll al inicio.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full flex font-sans" style={{ height: 'calc(100vh - 64px)' }}>
    {/* Añadimos sombra y z-index para que "flote" */}
      <div className="shadow-2xl z-10">
        <EditorUI
          productType={productType} setProductType={setProductType}
          colors={colors} setColors={setColors}
          texture={texture} setTexture={setTexture}
          customText={customText} setCustomText={setCustomText}
          onSave={handleSave}
          onReset={handleReset}
          onImageUpload={handleImageUpload}
          hasCustomImage={!!customImage.src}
          imageTransform={customImage.transform}
          setImageTransform={setCustomImage}
        />
      </div> {/* <-- Cierra el div de la sombra aquí */}

      <div className="flex-grow h-full bg-gray-800">
        <Canvas3D
          productType={productType}
          colors={colors}
          texture={texture}
          customText={customText}
          customImage={customImage}
        />
      </div>
    </div>
  );
}

export default App;