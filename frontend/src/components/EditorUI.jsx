import React, { useState } from 'react';

const Section = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <h3
        className="text-lg font-semibold text-gray-800 p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span>{isOpen ? '−' : '+'}</span>
      </h3>
      {isOpen && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
};

export default function EditorUI({
  productType, setProductType,
  colors, setColors,
  texture, setTexture,
  customText, setCustomText,
  onSave, onOpenDrawing
}) {

  const productOptions = ['backpack', 'bag', 'mateBag'];
  const textureOptions = [
    { id: 'none', name: 'Liso' },
    { id: 'canvas', name: 'Tela' },
    { id: 'leather', name: 'Cuero' },
    { id: 'geometric', name: 'Tela Geométrica' },
  ];
  const leatherVariants = [
    { id: 'leather-brown', name: 'Marrón' },
    { id: 'leather-black', name: 'Negro' },
    { id: 'leather-white', name: 'Blanco' },
  ];

  const fontOptions = [
    'Ailerons', 'Aqua', 'CraftyHoliday', 'Formula1-Black', 'Formula1-Bold_web', 
    'Formula1-Bold', 'Formula1-Italic', 'Formula1-Regular', 'Formula1-Wide', 
    'Hyped', 'Jelle-Roman', 'koliko-Bold', 'koliko-Light', 'koliko-Regular', 
    'Lombok-Regular', 'Lottebytes', 'Love', 'Modeka', 'Neutro-ExtraBold', 
    'Neutro-Outline', 'Nordic-Alternative-egular', 'parley-bold', 'parley-regular'
  ];

  const handleColorChange = (part, value) => setColors(prev => ({ ...prev, [part]: value }));
  const handleTextChange = (field, value) => setCustomText(prev => ({ ...prev, [field]: value }));
  const handleTextureSelection = (id) => {
    if (id === 'leather') {
      // If leather is clicked, default to the first variant if not already on a leather variant
      if (!texture.startsWith('leather-')) {
        setTexture('leather-brown');
      }
    } else {
      setTexture(id);
    }
  };

  return (
    <div className="w-full max-w-sm h-full bg-white shadow-2xl overflow-y-auto flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Diseña tu Estilo</h2>
        <p className="text-sm text-gray-500">Personaliza cada detalle a tu gusto.</p>
      </div>

      <div className="flex-grow">
        <Section title="1. Elige tu Producto" defaultOpen={true}>
          <div className="flex space-x-2">
            {productOptions.map(p => (
              <button key={p} onClick={() => setProductType(p)} className={`px-3 py-2 text-sm rounded-md font-semibold transition-colors ${productType === p ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {p === 'backpack' ? 'Mochila' : p === 'bag' ? 'Bolso' : 'Bolso Matero'}
              </button>
            ))}
          </div>
        </Section>

        <Section title="2. Colores" defaultOpen={true}>
            <div className="grid grid-cols-2 items-center gap-4">
                <span>Cuerpo Principal</span><input type="color" value={colors.body} onChange={(e) => handleColorChange('body', e.target.value)} className="w-full h-8 rounded border border-gray-300" />
                <span>Correas de ajuste</span><input type="color" value={colors.adjustmentStraps} onChange={(e) => handleColorChange('adjustmentStraps', e.target.value)} className="w-full h-8 rounded border border-gray-300" />
                <span>Correas de carga</span><input type="color" value={colors.loadStraps} onChange={(e) => handleColorChange('loadStraps', e.target.value)} className="w-full h-8 rounded border border-gray-300" />
                <span>Bolsillos Laterales</span><input type="color" value={colors.sidePockets} onChange={(e) => handleColorChange('sidePockets', e.target.value)} className="w-full h-8 rounded border border-gray-300" />
            </div>
        </Section>
        
        <Section title="3. Materiales y Estampados">
          <div className="grid grid-cols-2 gap-2">
            {textureOptions.map(opt => (
              <button key={opt.id} onClick={() => handleTextureSelection(opt.id)} className={`px-3 py-2 text-sm rounded-md font-semibold transition-colors ${texture === opt.id || (opt.id === 'leather' && texture.startsWith('leather-')) ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {opt.name}
              </button>
            ))}
          </div>
          {texture.startsWith('leather-') && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <h4 className="text-sm font-semibold mb-2">Variantes de Cuero:</h4>
              <div className="flex space-x-2">
                {leatherVariants.map(variant => (
                  <button key={variant.id} onClick={() => setTexture(variant.id)} className={`px-2 py-1 text-xs rounded ${texture === variant.id ? 'bg-indigo-500 text-white' : 'bg-white text-gray-600 border'}`}>
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button onClick={onOpenDrawing} className="w-full mt-4 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 shadow">
            Modo Creativo (Dibujar)
          </button>
        </Section>

        <Section title="4. Grabado de Texto">
          <div className="space-y-4">
            <div>
                <label className="text-sm font-medium text-gray-700">Contenido</label>
                <input type="text" value={customText.content} onChange={(e) => handleTextChange('content', e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
                <label className="text-sm font-medium">Color</label>
                <input type="color" value={customText.color} onChange={(e) => handleTextChange('color', e.target.value)} className="w-full h-8 rounded border border-gray-300" />
            </div>
             <div>
                <label className="text-sm font-medium text-gray-700">Tipografía</label>
                <select value={customText.font} onChange={(e) => handleTextChange('font', e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm">
                    {fontOptions.map(font => <option key={font} value={font}>{font.split('-')[0]}</option>)}
                </select>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Tamaño: {customText.size}</label>
                <input type="range" min="1" max="10" value={customText.size} onChange={(e) => handleTextChange('size', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
             <div>
                <label className="text-sm font-medium text-gray-700">Posición Horizontal (X): {customText.positionX.toFixed(2)}</label>
                <input type="range" min="-1" max="1" step="0.01" value={customText.positionX} onChange={(e) => handleTextChange('positionX', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
             <div>
                <label className="text-sm font-medium text-gray-700">Posición Vertical (Y): {customText.positionY.toFixed(2)}</label>
                <input type="range" min="-1.5" max="1.5" step="0.01" value={customText.positionY} onChange={(e) => handleTextChange('positionY', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
             <div>
                <label className="text-sm font-medium text-gray-700">Profundidad (Z): {customText.positionZ.toFixed(2)}</label>
                <input type="range" min="0.2" max="0.6" step="0.01" value={customText.positionZ} onChange={(e) => handleTextChange('positionZ', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
          </div>
        </Section>
      </div>

      <div className="p-4 mt-auto border-t">
        <button onClick={onSave} className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-lg">
          Guardar Diseño
        </button>
      </div>
    </div>
  );
}

