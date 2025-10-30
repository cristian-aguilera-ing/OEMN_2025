import React, { useRef } from 'react';

// El componente Section no cambia
const Section = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <h3
        className="text-lg font-semibold text-gray-800 p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span className={`text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
          ▼
        </span>
      </h3>
      {isOpen && <div className="p-4 pt-0 space-y-4">{children}</div>}
    </div>
  );
};


export default function EditorUI({
  productType, setProductType,
  colors, setColors,
  texture, setTexture,
  customText, setCustomText,
  onSave, onReset,
  onImageUpload, hasCustomImage,
  imageTransform, setImageTransform // <-- 1. RECIBIMOS LOS PROPS QUE FALTABAN
}) {
  const fileInputRef = useRef(null);

  const productOptions = ['backpack', 'bag', 'mateBag'];
  const textureOptions = [
    { id: 'none', name: 'Liso' }, { id: 'canvas', name: 'Tela' },
    { id: 'leather', name: 'Cuero' }, { id: 'geometric', name: 'Tela Geométrica' },
  ];
  const canvasVariants = [ { id: 'canvas-v1', name: 'V1' }, { id: 'canvas-v2', name: 'V2' }, { id: 'canvas-v3', name: 'V3' }, { id: 'canvas-v4', name: 'V4' } ];
  const leatherVariants = [ { id: 'leather-brown', name: 'Marrón' }, { id: 'leather-black', name: 'Negro' }, { id: 'leather-white', name: 'Blanco' } ];
  const geometricVariants = [ { id: 'geometric-v1', name: 'V1' }, { id: 'geometric-v2', name: 'V2' }, { id: 'geometric-v3', name: 'V3' } ];
  const fontOptions = [ 'Ailerons', 'Aqua', 'CraftyHoliday', 'Formula1-Bold', 'Formula1-Italic', 'Hyped', 'Jelle-Roman', 'koliko-Bold', 'koliko-Light', 'koliko-Regular', 'Lombok-Regular', 'Lottebytes', 'Love', 'Modeka', 'Neutro-ExtraBold', 'Neutro-Outline', 'Nordic-Alternative-egular', 'parley-bold', 'parley-regular'];

  const handleColorChange = (part, value) => setColors(prev => ({ ...prev, [part]: value }));
  const handleTextChange = (field, value) => setCustomText(prev => ({ ...prev, [field]: value }));

  const handleTextureSelection = (id) => {
    if (id === 'leather' && !texture.startsWith('leather-')) setTexture('leather-brown');
    else if (id === 'geometric' && !texture.startsWith('geometric-')) setTexture('geometric-v1');
    else if (id === 'canvas' && !texture.startsWith('canvas-')) setTexture('canvas-v1');
    else setTexture(id);
  };

  // Función para procesar el archivo de imagen seleccionado
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => onImageUpload(event.target.result); // Llama a la función de App.jsx
      reader.readAsDataURL(file);
    }
    
    // <-- 2. FIX BUG RE-UPLOAD: Reseteamos el valor del input
    // Esto permite que el evento 'onChange' se dispare de nuevo si se selecciona el mismo archivo
    if (e.target) {
      e.target.value = null;
    }
  };

  // <-- 3. NUEVA FUNCIÓN: Handler para los sliders de la imagen
  const handleImageTransformChange = (field, value) => {
    // Usamos 'setImageTransform' (que es 'setCustomImage' en App.jsx)
    setImageTransform(prev => ({
      ...prev,
      transform: {
        ...prev.transform,
        [field]: parseFloat(value) // Actualiza 'scale', 'offsetX', o 'offsetY'
      }
    }));
  };

  const handleRemoveImage = () => {
    onImageUpload(null); // Llama a la función de App.jsx para borrar la imagen
    // <-- 2. FIX BUG RE-UPLOAD: Reseteamos el input de archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="w-full max-w-sm h-full bg-white shadow-2xl overflow-y-auto flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Diseñalo Ya</h2>
          <p className="text-sm text-gray-500">Personaliza cada detalle.</p>
        </div>
        <button onClick={onReset} title="Restablecer Diseño" className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" /><path d="M4 9a9 9 0 0 1 14.24-4.56l-1.09 1.09A7 7 0 0 0 8.01 16.5l-2.06-2.06" /><path d="M20 15a9 9 0 0 1-14.24 4.56l1.09-1.09A7 7 0 0 0 15.99 7.5l2.06 2.06" /></svg>
        </button>
      </div>

      <div className="flex-grow">
        <Section title="1. Elige tu Producto" defaultOpen={true}>
          <div className="flex space-x-2">
            {productOptions.map(p => (
              <button key={p} onClick={() => setProductType(p)} className={`px-3 py-2 text-sm rounded-md font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${productType === p ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {p === 'backpack' ? 'Mochila' : p === 'bag' ? 'Bolso' : 'Bolso Matero'}
              </button>
            ))}
          </div>
        </Section>
        
        <Section title="2. Colores" defaultOpen={true}>
          <div className="grid grid-cols-2 items-center gap-y-3 gap-x-4">
            <label className="text-sm font-medium text-gray-700">Cuerpo Principal</label><input type="color" value={colors.body} onChange={(e) => handleColorChange('body', e.target.value)} className="w-full h-8 rounded border-gray-300 cursor-pointer" />
            <label className="text-sm font-medium text-gray-700">Correas de ajuste</label><input type="color" value={colors.adjustmentStraps} onChange={(e) => handleColorChange('adjustmentStraps', e.target.value)} className="w-full h-8 rounded border-gray-300 cursor-pointer" />
            <label className="text-sm font-medium text-gray-700">Correas de carga</label><input type="color" value={colors.loadStraps} onChange={(e) => handleColorChange('loadStraps', e.target.value)} className="w-full h-8 rounded border-gray-300 cursor-pointer" />
            <label className="text-sm font-medium text-gray-700">Bolsillos Laterales</label><input type="color" value={colors.sidePockets} onChange={(e) => handleColorChange('sidePockets', e.target.value)} className="w-full h-8 rounded border-gray-300 cursor-pointer" />
            <label className="text-sm font-medium text-gray-700">Bolsillo delantero</label><input type="color" value={colors.frontPocket} onChange={(e) => handleColorChange('frontPocket', e.target.value)} className="w-full h-8 rounded border-gray-300 cursor-pointer" />
          </div>
        </Section>
        
        <Section title="3. Materiales y Estampados (Cuerpo)">
          <div className="grid grid-cols-2 gap-2">
            {textureOptions.map(opt => ( <button key={opt.id} onClick={() => handleTextureSelection(opt.id)} className={`px-3 py-2 text-sm rounded-md font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${ texture === opt.id || texture.startsWith(opt.id + '-') ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300' }`}> {opt.name} </button> ))}
          </div>
          {texture.startsWith('canvas-') && ( <div className="mt-4 p-3 bg-gray-100 rounded"> <h4 className="text-sm font-semibold mb-2">Variantes de Tela:</h4> <div className="flex space-x-2"> {canvasVariants.map(variant => ( <button key={variant.id} onClick={() => setTexture(variant.id)} className={`px-2 py-1 text-xs rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${texture === variant.id ? 'bg-indigo-500 text-white' : 'bg-white text-gray-600 border'}`}> {variant.name} </button> ))} </div> </div> )}
          {texture.startsWith('leather-') && ( <div className="mt-4 p-3 bg-gray-100 rounded"> <h4 className="text-sm font-semibold mb-2">Variantes de Cuero:</h4> <div className="flex space-x-2"> {leatherVariants.map(variant => ( <button key={variant.id} onClick={() => setTexture(variant.id)} className={`px-2 py-1 text-xs rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${texture === variant.id ? 'bg-indigo-500 text-white' : 'bg-white text-gray-600 border'}`}> {variant.name} </button> ))} </div> </div> )}
          {texture.startsWith('geometric-') && ( <div className="mt-4 p-3 bg-gray-100 rounded"> <h4 className="text-sm font-semibold mb-2">Variantes Geométricas:</h4> <div className="flex space-x-2"> {geometricVariants.map(variant => ( <button key={variant.id} onClick={() => setTexture(variant.id)} className={`px-2 py-1 text-xs rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${texture === variant.id ? 'bg-indigo-500 text-white' : 'bg-white text-gray-600 border'}`}> {variant.name} </button> ))} </div> </div> )}
        </Section>
        
        <Section title="4. Grabado de Texto">
          <div className="space-y-4">
            <div> <label className="text-sm font-medium text-gray-700">Contenido</label> <input type="text" value={customText.content} onChange={(e) => handleTextChange('content', e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" /> </div>
            <div className="grid grid-cols-2 items-center gap-4"> <label className="text-sm font-medium">Color</label> <input type="color" value={customText.color} onChange={(e) => handleTextChange('color', e.target.value)} className="w-full h-8 rounded border-gray-300 cursor-pointer" /> </div>
            <div> <label className="text-sm font-medium text-gray-700">Tipografía</label> <select value={customText.font} onChange={(e) => handleTextChange('font', e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"> {fontOptions.map(font => <option key={font} value={font}>{font.replace(/-/g, ' ')}</option>)} </select> </div>
            <div> <label className="text-sm font-medium text-gray-700">Tamaño: {customText.size}</label> <input type="range" min="-1" max="3" step="0.1" value={customText.size} onChange={(e) => handleTextChange('size', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /> </div>
            <div> <label className="text-sm font-medium text-gray-700">Posición Horizontal (X): {customText.positionX.toFixed(2)}</label> <input type="range" min="-1" max="1" step="0.01" value={customText.positionX} onChange={(e) => handleTextChange('positionX', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /> </div>
            <div> <label className="text-sm font-medium text-gray-700">Posición Vertical (Y): {customText.positionY.toFixed(2)}</label> <input type="range" min="-1.5" max="1.5" step="0.01" value={customText.positionY} onChange={(e) => handleTextChange('positionY', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /> </div>
            <div> <label className="text-sm font-medium text-gray-700">Profundidad (Z): {customText.positionZ.toFixed(2)}</label> <input type="range" min="0.26" max="0.46" step="0.005" value={customText.positionZ} onChange={(e) => handleTextChange('positionZ', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /> </div>
          </div>
        </Section>
        
        {/* Nueva sección para subir imagen */}
        <Section title="5. Sube tu Imagen para el Bolsillo" defaultOpen={true}>
            <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleImageFileChange} className="hidden" />
            <button onClick={() => fileInputRef.current.click()} className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                {hasCustomImage ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
            </button>
            
            {/* Botón para quitar la imagen si existe (actualizado con el fix) */}
            {hasCustomImage && (
                <button onClick={handleRemoveImage} className="w-full mt-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500">
                    Quitar Imagen
                </button>
            )}

            {/* <-- 4. NUEVA SECCIÓN: Sliders condicionales para la imagen */}
            {hasCustomImage && imageTransform && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">Ajustar Imagen</h4>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Zoom (Escala): {imageTransform.scale.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0.01" // Evitar que sea 0
                    max="1.5"  // Rango de 1% a 100%
                    step="0.01"
                    value={imageTransform.scale}
                    onChange={(e) => handleImageTransformChange('scale', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Posición Horizontal (X): {imageTransform.offsetX.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0" // 0 = borde izquierdo
                    max="2" // 1 = borde derecho
                    step="0.01"
                    value={imageTransform.offsetX}
                    onChange={(e) => handleImageTransformChange('offsetX', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Posición Vertical (Y): {imageTransform.offsetY.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0" // 0 = borde inferior
                    max="2.5" // 1 = borde superior
                    step="0.01"
                    value={imageTransform.offsetY}
                    onChange={(e) => handleImageTransformChange('offsetY', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
        </Section>
      </div>

      <div className="p-4 mt-auto border-t bg-gray-50">
        <button onClick={onSave} className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500">
          Guardar Diseño
        </button>
      </div>
    </div>
  );
}
