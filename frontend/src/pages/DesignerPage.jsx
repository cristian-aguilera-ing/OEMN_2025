import React, { useState, useCallback, useEffect } from 'react';
// Rutas de importación corregidas
import Canvas3D from '../components/Canvas3D';
import EditorUI from '../components/EditorUI';

// --- ESTADO INICIAL (Sin cambios) ---
const backpackInitialState = {
  productType: 'backpack',
  materials: {
    body: { type: 'color', value: '#ffffff' },
    adjustmentStraps: { type: 'color', value: '#969696' },
    loadStraps: { type: 'color', value: '#333333' },
    sidePockets: { type: 'color', value: '#cccccc' },
    frontPocket: { type: 'color', value: '#ffffff' },
  },
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
    transform: {
      scale: 0.45,
      offsetX: 1.30,
      offsetY: 1.75,
    }
  }
};

const bagInitialState = {
  productType: 'bag',
  materials: {
    frenteMaterial: { type: 'color', value: '#ffffff' },
    lateralMaterial: { type: 'color', value: '#5A2020' },
    handle: { type: 'color', value: '#5A2020' },
  },
  customText: {
    content: 'OEMN',
    color: '#000000',
    font: 'Formula1-Bold',
    size: 1,
    positionX: 0,
    positionY: 0.46,
    positionZ: 0.24,
   },
  customImage: {src: null, transform: backpackInitialState.customImage.transform }
};

const matebagInitialState = {
  productType: 'matebag',
  materials: {
    relleno: { type: 'color', value: '#ffffff' },
    estructura: { type: 'color', value: '#000000' },
    asas: { type: 'color', value: '#000000' },
  },
  customText: {
    content: 'OEMN',
    color: '#000000',
    font: 'Formula1-Bold',
    size: 1,
    positionX: 0,
    positionY: 0.46,
    positionZ: 0.24,
   },
  customImage: {src: null, transform: backpackInitialState.customImage.transform }
};


function App() {
  const [productType, setProductType] = useState(backpackInitialState.productType);
  const [materials, setMaterials] = useState(backpackInitialState.materials);
  const [customText, setCustomText] = useState(backpackInitialState.customText);
  const [customImage, setCustomImage] = useState(backpackInitialState.customImage);

  // --- HANDLERS (Sin cambios) ---
  const handleProductTypeChange = (newType) => {
    setProductType(newType);
    if (newType === 'backpack') {
      setMaterials(backpackInitialState.materials);
      setCustomText(backpackInitialState.customText);
      setCustomImage(backpackInitialState.customImage);
    } else if (newType === 'bag') {
      setMaterials(bagInitialState.materials);
      setCustomText(bagInitialState.customText);
      setCustomImage(bagInitialState.customImage);
    } else if (newType === 'matebag') {
      setMaterials(matebagInitialState.materials);
      setCustomText(matebagInitialState.customText);
      setCustomImage(matebagInitialState.customImage);
    }
  };

  const handleImageUpload = (dataUrl) => {
    if (!dataUrl) {
      setCustomImage(backpackInitialState.customImage);
    } else {
      setCustomImage(prev => ({
        ...prev,
        src: dataUrl,
        transform: backpackInitialState.customImage.transform
      }));
    }
  };

  const handleReset = useCallback(() => {
    if (productType === 'backpack') {
      setMaterials(backpackInitialState.materials);
      setCustomText(backpackInitialState.customText);
      setCustomImage(backpackInitialState.customImage);
    } else if (productType === 'bag') {
      setMaterials(bagInitialState.materials);
      setCustomText(bagInitialState.customText);
      setCustomImage(bagInitialState.customImage);
    } else if (productType === 'matebag') {
      setMaterials(matebagInitialState.materials);
      setCustomText(matebagInitialState.customText);
      setCustomImage(matebagInitialState.customImage);
    }
  }, [productType]);

  const handleSave = async () => {
    const designData = { productType, materials, customText, customImage };
    try {
      console.log('Guardando diseño:', designData);
      console.log('¡Tu diseño ha sido guardado con éxito!');
    } catch (error) {
      console.error('Error al guardar el diseño:', error);
      console.log('Hubo un problema al guardar tu diseño. Por favor, inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    // --- CAMBIO DE UI (Layout) ---
    // 1. Contenedor principal ahora es 'relative'
    // 2. El fondo gradiente se aplica aquí, detrás de todo
    <div 
      className="w-full relative font-sans bg-gradient-to-br from-slate-100 to-slate-300" 
      style={{ height: 'calc(100vh - 64px)' }}
    >
      {/* 1. El EditorUI ahora está posicionado de forma 'absolute' 
             Toma 100% de la altura y se ancla a la izquierda */}
      <div className="absolute top-0 left-0 h-full z-10">
        <EditorUI
          productType={productType}
          setProductType={handleProductTypeChange}
          materials={materials} 
          setMaterials={setMaterials} 
          customText={customText}
          setCustomText={setCustomText}
          onSave={handleSave}
          onReset={handleReset}
          onImageUpload={handleImageUpload}
          hasCustomImage={!!customImage.src}
          imageTransform={customImage.transform}
          setImageTransform={setCustomImage}
        />
      </div>

      {/* 2. El Canvas ocupa el 100% del espacio del contenedor 'relative' */}
      <div className="absolute top-0 right-0 bottom-0 left-[360px] h-full">
        <Canvas3D
          productType={productType}
          materials={materials} 
          customText={customText}
          customImage={customImage}
        />
      </div>
    </div>
  );
}

export default App;