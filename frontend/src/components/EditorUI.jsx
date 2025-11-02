import React, { useState, useRef, useEffect } from 'react';

// --- Section (Acordeón Principal) - Estilo Dark Glass ---
const Section = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <h3
        className="text-base font-semibold text-slate-100 p-4 cursor-pointer flex justify-between items-center hover:bg-white/5 transition-colors"
        onClick={onClick}
      >
        {title}
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </h3>
      {isOpen && <div className="p-4 pt-0 space-y-4">{children}</div>}
    </div>
  );
};

// --- Acordeón Interno de Materiales - Estilo Dark Glass ---
const MaterialAccordionItem = ({ children, title, partName, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <h4
        className="text-sm font-semibold text-slate-200 p-3.5 cursor-pointer flex justify-between items-center hover:bg-white/10 transition-colors"
        onClick={() => onClick(partName)}
      >
        {title}
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </h4>
      {isOpen && (
        <div className="p-3 pt-2">
          {children}
        </div>
      )}
    </div>
  );
};


// --- Editor de Material - Estilo Dark Glass ---
// --- ↓↓↓ CORRECCIÓN #1 AQUÍ ↓↓↓ ---
const MaterialEditor = ({ partName, label, config, onConfigChange, textureOptions, canvasVariants, leatherVariants, geometricVariants, metalVariants }) => {
  
  // Handlers
  const setType = (type) => {
    const defaultValue = type === 'color' ? (config.value.startsWith('#') ? config.value : '#ffffff') : 'none';
    onConfigChange(partName, { type, value: defaultValue });
  };
  const setValue = (value) => { onConfigChange(partName, { value }); };
  const setTexture = (id) => { onConfigChange(partName, { type: 'texture', value: id }); };

  // --- ↓↓↓ CORRECCIÓN #2 AQUÍ ↓↓↓ ---
  const handleTextureCategory = (id) => {
    if (id === 'none') return setTexture('none');
    
    // Lógica para asignar una variante por defecto al hacer clic en una categoría nueva
    if (id === 'leather' && !config.value?.startsWith('leather-')) return setTexture('leather-brown');
    if (id === 'geometric' && !config.value?.startsWith('geometric-')) return setTexture('geometric-v1');
    if (id === 'canvas' && !config.value?.startsWith('canvas-')) return setTexture('canvas-v1');
    
    // ¡AQUÍ ESTÁ LA LÍNEA QUE FALTABA!
    if (id === 'metal' && !config.value?.startsWith('metal-')) return setTexture('metal-azul-cepillado');

    // Lógica para evitar que 'setTexture(id)' se llame con un ID de categoría
    if (id === 'leather' || id === 'geometric' || id === 'canvas' || id === 'metal') { // <-- Añadido 'metal'
      // No hacer nada si ya estamos en una sub-variante o acabamos de setear la default
    } else {
      setTexture(id); // Esto solo se ejecutará para IDs que no sean categorías (ej: 'none')
    }
  };
  // --- ↑↑↑ FIN DE LA CORRECCIÓN #2 ↑↑↑ ---

  const isTextureSelected = (opt) => {
    if (!config || config.type !== 'texture') return false;
    return config.value === opt.id || config.value?.startsWith(opt.id + '-');
  };

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-slate-300 mb-3">{label}</label>}
      
      {/* Toggle (Dark) */}
      <div className="flex w-full bg-black/20 rounded-lg p-0.5 mb-4">
        <button
          onClick={() => setType('color')}
          className={`w-1/2 px-3 py-1 text-sm font-semibold rounded-md transition-all ${config.type === 'color' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-300 hover:bg-white/10'}`}
        >
          Color
        </button>
        <button
          onClick={() => setType('texture')}
          className={`w-1/2 px-3 py-1 text-sm font-semibold rounded-md transition-all ${config.type === 'texture' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-300 hover:bg-white/10'}`}
        >
          Textura
        </button>
      </div>
      
      {config.type === 'color' && (
        <div className="relative w-full h-10 rounded-lg overflow-hidden border border-white/20 shadow-sm">
          <input
            type="color"
            value={config.value || '#ffffff'}
            onChange={(e) => setValue(e.target.value)}
            className="absolute -top-2 -left-2 w-[calc(100%+8px)] h-[calc(100%+8px)] border-none cursor-pointer p-0"
          />
        </div>
      )}
      
      {config.type === 'texture' && (
        <div className="space-y-3">
          {/* Botones de Categoría (Dark) */}
          <div className="grid grid-cols-2 gap-2">
            {textureOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleTextureCategory(opt.id)}
                className={`px-3 py-2 text-sm rounded-md font-semibold transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-sky-500 ${
                  isTextureSelected(opt)
                    ? 'bg-sky-600 text-white shadow-md' // Activo
                    : 'bg-slate-700/50 text-slate-200 border border-white/10 hover:bg-slate-600/50' // Inactivo
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
          
          {/* Variantes (Dark) */}
          {config.value?.startsWith('canvas-') && (
            <div className="p-3 bg-black/20 rounded-md">
              <h4 className="text-xs font-semibold mb-2 text-slate-400">Variantes de Tela:</h4>
              <div className="flex flex-wrap gap-2">
                {canvasVariants.map(variant => (
                  <button key={variant.id} onClick={() => setTexture(variant.id)} className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${config.value === variant.id ? 'bg-sky-500 text-white' : 'bg-slate-600/50 text-slate-300 border border-white/10 hover:bg-slate-500/50'}`}>
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {config.value?.startsWith('leather-') && (
            <div className="p-3 bg-black/20 rounded-md">
              <h4 className="text-xs font-semibold mb-2 text-slate-400">Variantes de Cuero:</h4>
              <div className="flex flex-wrap gap-2">
                {leatherVariants.map(variant => (
                  <button key={variant.id} onClick={() => setTexture(variant.id)} className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${config.value === variant.id ? 'bg-sky-500 text-white' : 'bg-slate-600/50 text-slate-300 border border-white/10 hover:bg-slate-500/50'}`}>
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {config.value?.startsWith('geometric-') && (
            <div className="p-3 bg-black/20 rounded-md">
              <h4 className="text-xs font-semibold mb-2 text-slate-400">Variantes Geométricas:</h4>
              <div className="flex flex-wrap gap-2">
                {geometricVariants.map(variant => (
                  <button key={variant.id} onClick={() => setTexture(variant.id)} className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${config.value === variant.id ? 'bg-sky-500 text-white' : 'bg-slate-600/50 text-slate-300 border border-white/10 hover:bg-slate-500/50'}`}>
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* --- BLOQUE 'METAL' QUE FALTABA RENDERIZAR --- */}
          {config.value?.startsWith('metal-') && (
            <div className="p-3 bg-black/20 rounded-md">
              <h4 className="text-xs font-semibold mb-2 text-slate-400">Variantes de Metal:</h4>
              <div className="flex flex-wrap gap-2">
                {metalVariants.map(variant => (
                  <button key={variant.id} onClick={() => setTexture(variant.id)} className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${config.value === variant.id ? 'bg-sky-500 text-white' : 'bg-slate-600/5SO text-slate-300 border border-white/10 hover:bg-slate-500/50'}`}>
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


// --- EDITOR UI PRINCIPAL ---
function EditorUI({
  productType, setProductType,
  materials, setMaterials, 
  customText, setCustomText,
  onSave, onReset,
  onImageUpload, hasCustomImage,
  imageTransform, setImageTransform
}) {
  const fileInputRef = useRef(null);
  const [openSection, setOpenSection] = useState('1. Elige tu Producto');
  const [openMaterial, setOpenMaterial] = useState(
    productType === 'backpack' ? 'body' : productType === 'bag' ? 'frenteMaterial' : 'relleno'
  );
  
  useEffect(() => {
    const defaultMaterial = productType === 'backpack' ? 'body' : productType === 'bag' ? 'frenteMaterial' : 'relleno';
    setOpenMaterial(defaultMaterial);
  }, [productType]);

  const handleSectionClick = (sectionTitle) => {
    setOpenSection(prev => (prev === sectionTitle ? null : sectionTitle));
  };
  
  const handleMaterialClick = (partName) => {
    setOpenMaterial(prev => (prev === partName ? null : partName));
  };

  // --- Opciones (con 'metal' añadido) ---
  const productOptions = ['backpack', 'bag', 'matebag'];
  const textureOptions = [
    { id: 'none', name: 'Liso' }, { id: 'canvas', name: 'Tela' },
    { id: 'leather', name: 'Cuero' }, { id: 'geometric', name: 'Tela Geométrica' },
    { id: 'metal', name: 'Metal' }, // <-- OK
  ];
  const canvasVariants = [ 
    { id: 'canvas-v1', name: 'V1' }, 
    { id: 'canvas-v2', name: 'V2' }, 
    { id: 'canvas-v3', name: 'V3' }, 
    { id: 'canvas-v4', name: 'V4' }, 
    { id: 'canvas-v5', name: 'V5' },
    { id: 'canvas-v6', name: 'V6' },
    { id: 'canvas-v7', name: 'V7' },
    { id: 'canvas-v8', name: 'V8' },
    { id: 'canvas-v9', name: 'V9' },
    { id: 'canvas-v10', name: 'V10' },
    { id: 'canvas-v11', name: 'V11' },
    { id: 'canvas-v12', name: 'V12' } ];
  const leatherVariants = [ { id: 'leather-brown', name: 'Marrón' }, { id: 'leather-vino', name: 'Vino' }, { id: 'leather-marron', name: 'Marrón Claro' }, { id: 'leather-black', name: 'Negro' }, { id: 'leather-crema', name: 'Crema' } ];
  const geometricVariants = [ { id: 'geometric-v1', name: 'V1' }, { id: 'geometric-v2', name: 'V2' }, { id: 'geometric-v3', name: 'V3' } ];
  const metalVariants = [ { id: 'metal-azul-cepillado', name: 'Azul Cepillado' } ]; // <-- OK
  const fontOptions = [ 'Ailerons', 'Aqua', 'CraftyHoliday', 'Formula1-Bold', 'Formula1-Italic', 'Hyped', 'Jellee-Roman', 'koliko-Bold', 'koliko-Light', 'koliko-Regular', 'Lombok-Regular', 'Lottebytes', 'Love', 'Modeka', 'Neutro-ExtraBold', 'Neutro-Outline', 'Nordic-Alternative-egular', 'parley-bold', 'parley-regular'];

  // --- Handlers (sin cambios) ---
  const handleTextChange = (field, value) => setCustomText(prev => ({ ...prev, [field]: value }));
  const handleMaterialChange = (partName, newConfig) => {
    setMaterials(prev => {
      const currentPartConfig = prev[partName] || { type: 'color', value: '#ffffff' };
      if (newConfig.type && newConfig.type !== currentPartConfig.type) {
        const defaultValue = newConfig.type === 'color' 
          ? (currentPartConfig.value.startsWith('#') ? currentPartConfig.value : '#ffffff')
          : 'none'; 
        return { ...prev, [partName]: { type: newConfig.type, value: defaultValue } };
      }
      return { ...prev, [partName]: { ...currentPartConfig, ...newConfig } };
    });
  };
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => onImageUpload(event.target.result);
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = null;
  };
  const handleImageTransformChange = (field, value) => {
    setImageTransform(prev => ({
      ...prev,
      transform: { ...prev.transform, [field]: parseFloat(value) }
    }));
  };
  const handleRemoveImage = () => {
    onImageUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return (
    // Ancho fijo de 360px
    <div className="w-[360px] h-full bg-[rgba(20,20,30,0.7)] backdrop-blur-xl shadow-2xl flex flex-col rounded-r-lg border-r border-white/10 text-slate-200">
      
      {/* Cabecera (Dark) */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Diseñalo Ya</h2>
          <p className="text-sm text-slate-400">Personaliza cada detalle.</p>
        </div>
        <button
          onClick={onReset}
          title="Restablecer Diseño"
          className="p-2 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" /><path d="M4 9a9 9 0 0 1 14.24-4.56l-1.09 1.09A7 7 0 0 0 8.01 16.5l-2.06-2.06" /><path d="M20 15a9 9 0 0 1-14.24 4.56l1.09-1.09A7 7 0 0 0 15.99 7.5l2.06 2.06" /></svg>
        </button>
      </div>

      {/* Contenedor principal con scrollbar (Dark) */}
      <div className="flex-grow overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-track]:bg-transparent">
        
        {/* --- 1. Elige tu Producto (Dark) --- */}
        <Section 
          title="1. Elige tu Producto"
          isOpen={openSection === '1. Elige tu Producto'}
          onClick={() => handleSectionClick('1. Elige tu Producto')}
        >
          <div className="flex space-x-2">
            {productOptions.map(p => (
              <button
                key={p}
                onClick={() => setProductType(p)}
                className={`px-3 py-2 text-sm rounded-md font-semibold transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-sky-500 ${
                  productType === p
                    ? 'bg-sky-600 text-white shadow-md' // Activo
                    : 'bg-slate-700/50 text-slate-200 border border-white/10 hover:bg-slate-600/50' // Inactivo
                }`}
              >
                {p === 'backpack' ? 'Mochila' : p === 'bag' ? 'Bolso' : 'Bolso Matero'}
              </button>
            ))}
          </div>
        </Section>
        
        {/* --- 2. Personalizar Partes (Dark) --- */}
        <Section 
          title="2. Personalizar Partes"
          isOpen={openSection === '2. Personalizar Partes'}
          onClick={() => handleSectionClick('2. Personalizar Partes')}
        >
          {/* Contenedor del acordeón interno */}
          <div className="rounded-lg overflow-hidden border border-white/10 bg-black/20">
            {productType === 'backpack' && (
              <>
                <MaterialAccordionItem title="Cuerpo Principal" partName="body" isOpen={openMaterial === 'body'} onClick={handleMaterialClick}>
                  <MaterialEditor partName="body" label="" config={materials.body} onConfigChange={handleMaterialChange} {...{ textureOptions, canvasVariants, leatherVariants, geometricVariants, metalVariants }} />
                </MaterialAccordionItem>
                <MaterialAccordionItem title="Correas de carga" partName="loadStraps" isOpen={openMaterial === 'loadStraps'} onClick={handleMaterialClick}>
                  <MaterialEditor partName="loadStraps" label="" config={materials.loadStraps} onConfigChange={handleMaterialChange} {...{ textureOptions, canvasVariants, leatherVariants, geometricVariants, metalVariants }} />
                </MaterialAccordionItem>
                <MaterialAccordionItem title="Correas de ajuste" partName="adjustmentStraps" isOpen={openMaterial === 'adjustmentStraps'} onClick={handleMaterialClick}>
                  <MaterialEditor partName="adjustmentStraps" label="" config={materials.adjustmentStraps} onConfigChange={handleMaterialChange} {...{ textureOptions, canvasVariants, leatherVariants, geometricVariants, metalVariants }} />
                </MaterialAccordionItem>
                <MaterialAccordionItem title="Bolsillos Laterales" partName="sidePockets" isOpen={openMaterial === 'sidePockets'} onClick={handleMaterialClick}>
                  <MaterialEditor partName="sidePockets" label="" config={materials.sidePockets} onConfigChange={handleMaterialChange} {...{ textureOptions, canvasVariants, leatherVariants, geometricVariants, metalVariants }} />
                </MaterialAccordionItem>
                <MaterialAccordionItem title="Bolsillo delantero" partName="frontPocket" isOpen={openMaterial === 'frontPocket'} onClick={handleMaterialClick}>
                  <MaterialEditor partName="frontPocket" label="" config={materials.frontPocket} onConfigChange={handleMaterialChange} {...{ textureOptions, canvasVariants, leatherVariants, geometricVariants, metalVariants }} />
                </MaterialAccordionItem>
              </>
            )}
            {productType === 'bag' && (
              <>
                <MaterialAccordionItem title="Cuerpo" partName="frenteMaterial" isOpen={openMaterial === 'frenteMaterial'} onClick={handleMaterialClick}>
                  <MaterialEditor partName="frenteMaterial" label="" config={materials.frenteMaterial} onConfigChange={handleMaterialChange} {...{ textureOptions, canvasVariants, leatherVariants, geometricVariants, metalVariants }} />
                </MaterialAccordionItem>
                <MaterialAccordionItem title="Laterales" partName="lateralMaterial" isOpen={openMaterial === 'lateralMaterial'} onClick={handleMaterialClick}>
                  <MaterialEditor partName="lateralMaterial" label="" config={materials.lateralMaterial} onConfigChange={handleMaterialChange} {...{ textureOptions, canvasVariants, leatherVariants, geometricVariants, metalVariants }} />
                </MaterialAccordionItem>
                <MaterialAccordionItem title="Manija y Tiras" partName="handle" isOpen={openMaterial === 'handle'} onClick={handleMaterialClick}>
                  <MaterialEditor partName="handle" label="" config={materials.handle} onConfigChange={handleMaterialChange} {...{ textureOptions, canvasVariants, leatherVariants, geometricVariants, metalVariants }} />
                </MaterialAccordionItem>
              </>
            )}
            {productType === 'matebag' && (
              <>
                <MaterialAccordionItem title="Cuerpo" partName="relleno" isOpen={openMaterial === 'relleno'} onClick={handleMaterialClick}>
                  <MaterialEditor partName="relleno" label="" config={materials.relleno} onConfigChange={handleMaterialChange} {...{ textureOptions, canvasVariants, leatherVariants, geometricVariants, metalVariants }} />
                </MaterialAccordionItem>
                <MaterialAccordionItem title="Estructura" partName="estructura" isOpen={openMaterial === 'estructura'} onClick={handleMaterialClick}>
                  <MaterialEditor partName="estructura" label="" config={materials.estructura} onConfigChange={handleMaterialChange} {...{ textureOptions, canvasVariants, leatherVariants, geometricVariants, metalVariants }} />
                </MaterialAccordionItem>
                <MaterialAccordionItem title="Manija y Tiras" partName="asas" isOpen={openMaterial === 'asas'} onClick={handleMaterialClick}>
                  <MaterialEditor partName="asas" label="" config={materials.asas} onConfigChange={handleMaterialChange} {...{ textureOptions, canvasVariants, leatherVariants, geometricVariants, metalVariants }} />
                </MaterialAccordionItem>
              </>
            )}
          </div>
        </Section>

        {/* --- 3. Grabado de Texto (Dark) --- */}
        <Section 
          title="3. Grabado de Texto"
          isOpen={openSection === '3. Grabado de Texto'}
          onClick={() => handleSectionClick('3. Grabado de Texto')}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Contenido</label>
              <input type="text" value={customText.content} onChange={(e) => handleTextChange('content', e.target.value)} className="mt-1 w-full p-2 border border-white/20 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-slate-800/50 text-white placeholder-slate-400 focus:bg-slate-700/50" />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-sm font-medium text-slate-300">Color</label>
              <div className="relative w-full h-10 rounded-lg overflow-hidden border border-white/20 shadow-sm">
                <input type="color" value={customText.color} onChange={(e) => handleTextChange('color', e.target.value)} className="absolute -top-2 -left-2 w-[calc(100%+8px)] h-[calc(100%+8px)] border-none cursor-pointer p-0" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Tipografía</label>
              <select value={customText.font} onChange={(e) => handleTextChange('font', e.target.value)} className="mt-1 w-full p-2 border border-white/20 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-slate-800/50 text-white">
                {fontOptions.map(font => <option key={font} value={font} className="bg-slate-800 text-white">{font.replace(/-/g, ' ')}</option>)}
              </select>
            </div>
            {/* Sliders (Dark) */}
            {[ {label: 'Tamaño', key: 'size', min: -1, max: 3, step: 0.1, value: customText.size}, {label: 'Posición Horizontal (X)', key: 'positionX', min: -1, max: 1, step: 0.01, value: customText.positionX}, {label: 'Posición Vertical (Y)', key: 'positionY', min: -1.5, max: 1.5, step: 0.01, value: customText.positionY}, {label: 'Profundidad (Z)', key: 'positionZ', min: -0.46, max: 0.46, step: 0.005, value: customText.positionZ} ].map(slider => (
              <div key={slider.key}>
                <label className="text-sm font-medium text-slate-300">{slider.label}: {Number(slider.value).toFixed(2)}</label>
                <input
                  type="range"
                  min={slider.min} max={slider.max} step={slider.step} value={slider.value}
                  onChange={(e) => handleTextChange(slider.key, parseFloat(e.target.value))}
                  className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-sky-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
                />
              </div>
            ))}
          </div>
        </Section>
        
        {/* --- 4. Sube tu Imagen (Dark) --- */}
        {productType === 'backpack' && (
        <Section 
          title="4. Sube tu Imagen (Bolsillo)"
          isOpen={openSection === '4. Sube tu Imagen (Bolsillo)'}
          onClick={() => handleSectionClick('4. Sube tu Imagen (Bolsillo)')}
        >
            <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleImageFileChange} className="hidden" />
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 transition-colors"
            >
              {hasCustomImage ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
            </button>
            
            {hasCustomImage && (
              <button
                onClick={handleRemoveImage}
                className="w-full mt-2 px-4 py-2 text-sm font-semibold text-red-100 bg-red-800/70 rounded-md hover:bg-red-700/70 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 transition-colors"
              >
                Quitar Imagen
              </button>
            )}

            {hasCustomImage && imageTransform && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                <h4 className="text-sm font-semibold text-slate-300">Ajustar Imagen</h4>
                {[ {label: 'Zoom (Escala)', key: 'scale', min: 0.01, max: 1.5, step: 0.01, value: imageTransform.scale}, {label: 'Posición Horizontal (X)', key: 'offsetX', min: 0, max: 2, step: 0.01, value: imageTransform.offsetX}, {label: 'Posición Vertical (Y)', key: 'offsetY', min: 0, max: 2.5, step: 0.01, value: imageTransform.offsetY} ].map(slider => (
                  <div key={slider.key}>
                    <label className="text-sm font-medium text-slate-300">{slider.label}: {Number(slider.value).toFixed(2)}</label>
                    <input
                      type="range"
                      min={slider.min} max={slider.max} step={slider.step} value={slider.value}
                      onChange={(e) => handleImageTransformChange(slider.key, e.target.value)}
                      className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-sky-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
                    />
                  </div>
                ))}
              </div>
            )}
        </Section>
        )}
        
      </div>

      {/* Footer (Dark Glass) */}
      <div className="p-4 mt-auto border-t border-white/10 bg-slate-900/50 backdrop-blur-sm rounded-br-lg">
        <button
          onClick={onSave}
          className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-lg transition-all transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
        >
          Guardar Diseño
        </button>
      </div>
    </div>
  );
}
// --- FIN: Contenido de EditorUI.jsx ---

export default EditorUI;