import React, { useState } from 'react';

// ... (Opciones de producto y color sin cambios) ...
const productOptions = [
  { id: 'backpack', name: 'Mochila' },
  { id: 'bag', name: 'Bolso' },
  { id: 'mateBag', name: 'Bolso Matero' },
];
const colorOptions = [
    { id: 'body', name: 'Cuerpo Principal' },
    { id: 'adjustmentStraps', name: 'Correas de ajuste' },
    { id: 'loadStraps', name: 'Correas de carga' },
    { id: 'sidePockets', name: 'Bolsillos Laterales' },
];
const textureCategories = {
  base: [
    { id: 'none', name: 'Liso' },
    { id: 'canvas', name: 'Lona' },
    { id: 'leather', name: 'Cuero' },
    { id: 'geometric', name: 'Geométrico' },
  ],
  leather: [
    { id: 'leather-brown', name: 'Marrón' },
    { id: 'leather-black', name: 'Negro' },
    { id: 'leather-white', name: 'Blanco' },
  ],
};

// --- LISTA DE FUENTES ACTUALIZADA CON TUS ARCHIVOS ---
const fontOptions = [
    { id: 'Ailerons', name: 'Ailerons' },
    { id: 'Aqua', name: 'Aqua' },
    { id: 'CraftyHoliday', name: 'Crafty Holiday' },
    { id: 'Formula1-Black', name: 'Formula1 Black' },
    { id: 'Formula1-Bold_web', name: 'Formula1 Bold Web' },
    { id: 'Formula1-Bold', name: 'Formula1 Bold' },
    { id: 'Formula1-Italic', name: 'Formula1 Italic' },
    { id: 'Formula1-Regular', name: 'Formula1 Regular' },
    { id: 'Formula1-Wide', name: 'Formula1 Wide' },
    { id: 'Hyped', name: 'Hyped' },
    { id: 'Jelle-Roman', name: 'Jelle Roman' },
    { id: 'koliko-Bold', name: 'Koliko Bold' },
    { id: 'koliko-Light', name: 'Koliko Light' },
    { id: 'koliko-Regular', name: 'Koliko Regular' },
    { id: 'Lombok-Regular', name: 'Lombok' },
    { id: 'Lottebytes', name: 'Lottebytes' },
    { id: 'Love', name: 'Love' },
    { id: 'Modeka', name: 'Modeka' },
    { id: 'Neutro-ExtraBold', name: 'Neutro Extra Bold' },
    { id: 'Neutro-Outline', name: 'Neutro Outline' },
    { id: 'Nordic-Alternative-egular', name: 'Nordic Alternative' }, // Corregido 'egular' a 'Regular' en el nombre visible
    { id: 'parley-bold', name: 'Parley Bold' },
    { id: 'parley-regular', name: 'Parley Regular' },
];

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-bold uppercase text-gray-800 border-b pb-2 mb-4">{title}</h3>
    {children}
  </div>
);

export default function EditorUI({
  productType, setProductType, colors, handleColorChange,
  texture, setTexture, customText, setCustomText,
  onSaveDesign, onOpenDrawing,
}) {
  const [activeTextureCat, setActiveTextureCat] = useState('base');

  // --- LÓGICA DE TEXTURAS CORREGIDA ---
  const handleTextureClick = (id) => {
    // Si es un botón de categoría (ej: 'leather'), cambia la vista
    if (textureCategories[id]) {
      setActiveTextureCat(id);
    } 
    // Si es una selección final (ej: 'none' o 'leather-brown')
    else {
      setTexture(id);
      // Si estamos en una subcategoría y elegimos una opción, no volvemos a la base
      // a menos que la opción sea 'none'
      if (id === 'none') {
        setActiveTextureCat('base');
      }
    }
  };

  const currentTextureList = textureCategories[activeTextureCat] || textureCategories.base;

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Diseña tu Estilo</h2>
      <p className="text-gray-500 mb-8">Personaliza cada detalle a tu gusto.</p>
      
      <Section title="1. Elige tu Producto">
        <div className="flex space-x-2">
          {productOptions.map(opt => (
            <button key={opt.id} onClick={() => setProductType(opt.id)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${productType === opt.id ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {opt.name}
            </button>
          ))}
        </div>
      </Section>

      <Section title="2. Colores">
        <div className="space-y-3">
          {colorOptions.map(opt => (
            <div key={opt.id} className="flex items-center justify-between">
              <label htmlFor={`${opt.id}-color`} className="text-gray-700">{opt.name}</label>
              <input id={`${opt.id}-color`} type="color" value={colors[opt.id]} onChange={(e) => handleColorChange(opt.id, e.target.value)} className="w-8 h-8 rounded border-gray-300 cursor-pointer"/>
            </div>
          ))}
        </div>
      </Section>

      <Section title="3. Materiales y Estampados (Cuerpo Principal)">
        {activeTextureCat !== 'base' && (
          <button onClick={() => setActiveTextureCat('base')} className="text-sm text-indigo-600 font-semibold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Volver
          </button>
        )}
        <div className="grid grid-cols-2 gap-2">
          {currentTextureList.map(opt => {
            const isSelected = texture === opt.id || (activeTextureCat === 'base' && texture.startsWith(opt.id) && opt.id !== 'none');
            return (
              <button key={opt.id} onClick={() => handleTextureClick(opt.id)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${isSelected ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {opt.name}
              </button>
            );
          })}
        </div>
        <button onClick={onOpenDrawing} className="w-full mt-3 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 bg-purple-600 text-white shadow hover:bg-purple-700">
          Modo Creativo (Dibujar)
        </button>
      </Section>
      
      <Section title="4. Grabado de Texto (Cuerpo Principal)">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Contenido</label>
            <input type="text" value={customText.content} onChange={(e) => setCustomText(p => ({...p, content: e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Tipografía</label>
            <select value={customText.font} onChange={(e) => setCustomText(p => ({...p, font: e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white">
              {fontOptions.map(opt => (<option key={opt.id} value={opt.id}>{opt.name}</option>))}
            </select>
          </div>
          <div>
             <label className="text-sm font-medium text-gray-600 block mb-1">Tamaño ({customText.size})</label>
             <input type="range" min="1" max="5" step="0.1" value={customText.size} onChange={(e) => setCustomText(p => ({ ...p, size: parseFloat(e.target.value) }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
          </div>
          <div>
             <label className="text-sm font-medium text-gray-600 block mb-1">Posición Horizontal</label>
             <input type="range" min="-0.5" max="0.5" step="0.01" value={customText.positionX} onChange={(e) => setCustomText(p => ({ ...p, positionX: parseFloat(e.target.value) }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
          </div>
          <div>
             <label className="text-sm font-medium text-gray-600 block mb-1">Posición Vertical</label>
             <input type="range" min="-0.5" max="1" step="0.01" value={customText.positionY} onChange={(e) => setCustomText(p => ({ ...p, positionY: parseFloat(e.target.value) }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
          </div>
          <div>
             {/* --- SLIDER DE PROFUNDIDAD CORREGIDO --- */}
             <label className="text-sm font-medium text-gray-600 block mb-1">Profundidad</label>
             <input type="range" min="0.3" max="0.5" step="0.005" value={customText.positionZ} onChange={(e) => setCustomText(p => ({ ...p, positionZ: parseFloat(e.target.value) }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-600">Color</label>
            <input type="color" value={customText.color} onChange={(e) => setCustomText(p => ({...p, color: e.target.value}))} className="w-8 h-8 rounded border-gray-300 cursor-pointer"/>
          </div>
        </div>
      </Section>
      
      <div className="mt-10">
        <button onClick={onSaveDesign} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg">
          Guardar Diseño
        </button>
      </div>
    </div>
  );
}

