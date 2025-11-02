import React, { useEffect, Suspense, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text, useTexture, Environment, Center, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// URLs de las fuentes
const fontUrls = { 'Ailerons': '/fonts/Ailerons.woff', 'Aqua': '/fonts/Aqua.woff', 'CraftyHoliday': '/fonts/CraftyHoliday.woff', 'Formula1-Bold': '/fonts/Formula1-Bold.woff', 'Formula1-Italic': '/fonts/Formula1-Italic.woff', 'Hyped': '/fonts/Hyped.woff', 'Jellee-Roman': '/fonts/Jellee-Roman.woff', 'koliko-Bold': '/fonts/koliko-Bold.woff', 'koliko-Light': '/fonts/koliko-Light.woff', 'koliko-Regular': '/fonts/koliko-Regular.woff', 'Lombok-Regular': '/fonts/Lombok-Regular.woff', 'Lottebytes': '/fonts/Lottebytes.woff', 'Love': '/fonts/Love.woff', 'Modeka': '/fonts/Modeka.woff', 'Neutro-ExtraBold': '/fonts/Neutro-ExtraBold.woff', 'Neutro-Outline': '/fonts/Neutro-Outline.woff', 'Nordic-Alternative-regular': '/fonts/Nordic-Alternative-regular.woff', 'parley-bold': '/fonts/parley-bold.woff', 'parley-regular': '/fonts/parley-regular.woff'};

// Componente para materiales PBR (¡Actualizado!)
// Componente para materiales PBR (¡Corregido!)
const PbrMaterial = ({ path, metalness = 0.0, roughness = 1.0 }) => {
    
    // 1. Define los mapas base que TODOS tienen
    const mapsToLoad = {
        map: `${path}/color.jpg`,
        normalMap: `${path}/normal.jpg`,
        roughnessMap: `${path}/roughness.jpg`,
    };

    // 2. AÑADE los mapas metálicos SÓLO si metalness es 1.0
    //    (El 'metalness' lo pasamos desde ConfigurableMaterial)
    if (metalness === 1.0) {
        mapsToLoad.metalnessMap = `${path}/metallic.jpg`;
        mapsToLoad.displacementMap = `${path}/height.jpg`;
    }

    // 3. Carga solo los mapas necesarios
    const pbrTextures = useTexture(mapsToLoad);

    useEffect(() => {
        Object.values(pbrTextures).forEach(tex => {
            if (tex) {
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                tex.repeat.set(3, 3);
                tex.flipY = false;
                tex.needsUpdate = true;
            }
        });
    }, [pbrTextures, path]); // Añadido 'path' a las dependencias

    // Aplicamos los valores base y los mapas
    return <meshStandardMaterial 
              {...pbrTextures} 
              roughness={roughness} // Valor base de rugosidad
              metalness={metalness}   // Valor base de metal
              // Aplica la escala de desplazamiento solo si el mapa existe
              displacementScale={pbrTextures.displacementMap ? 0.01 : 0}
           />;
};

// Componente de imagen personalizada
const CustomImageMaterial = ({ src, transform }) => {
    const texture = useTexture(src);
    useEffect(() => {
        if (texture) {
            texture.flipY = false;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.repeat.set(transform.scale, transform.scale);
            const baseOffsetX = (1 - transform.scale) / 2;
            const baseOffsetY = (1 - transform.scale) / 2;
            texture.offset.set(baseOffsetX + transform.offsetX, baseOffsetY + transform.offsetY);
            texture.needsUpdate = true;
        }
    }, [texture, transform]);
    return <meshStandardMaterial map={texture} roughness={0.8} />;
};

// --- NUEVO COMPONENTE DE MATERIAL CONFIGURABLE ---
// Este componente decide si renderizar un color o una textura
// basado en el objeto 'config' que recibe.
const ConfigurableMaterial = ({ config }) => {
    if (config?.type === 'color') {
        return <meshStandardMaterial color={config.value} roughness={0.8} metalness={0.1} />;
    }
    
    if (config?.type === 'texture') {
        // --- ¡ESTA ES LA CORRECCIÓN! ---
        // Divide el string en todas sus partes
        const parts = (config.value || 'none').split('-');
        // La categoría es solo la primera parte
        const category = parts[0];
        // La variante es TODO el resto, unido de nuevo por guiones
        const variant = parts.slice(1).join('-');
        // --- FIN DE LA CORRECCIÓN ---

        // Ahora 'variant' será "azul-cepillado" (correcto)
        // o "brown" (correcto) o "v1" (correcto)
        
        if (category === 'leather') return <PbrMaterial path={`/textures/leather/${variant}`} metalness={0.0} />;
        if (category === 'canvas') return <PbrMaterial path={`/textures/canvas/${variant || 'v1'}`} metalness={0.0} />;
        if (category === 'geometric') return <PbrMaterial path={`/textures/geometric/${variant || 'v1'}`} metalness={0.0} />;
        if (category === 'metal') return <PbrMaterial path={`/textures/metal/${variant}`} metalness={1.0} />; // <-- Ahora usará "azul-cepillado"

        // Fallback si la textura es 'none' o inválida
        return <meshStandardMaterial color="#ffffff" roughness={0.8} metalness={0.1} />;
    }

    // Fallback por defecto si no hay config
    return <meshStandardMaterial color="#ffffff" roughness={0.8} metalness={0.1} />;
};

// --- Mochila (Actualizada) ---
const Backpack = (props) => {
    const { nodes, materials: defaultMaterials } = useGLTF('/mochila_dior.glb');
    
    return (
        <group scale={1.5} position-y={-1.0}>
            {Object.values(nodes).map((node) => {
                if (!node.isMesh) return null;
                
                // Usamos el nuevo ConfigurableMaterial para CADA parte
                switch (node.name) {
                    case 'Pattern': // Clave 'body'
                        return ( <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow> 
                                    <ConfigurableMaterial config={props.materials.body}/> 
                                </mesh> );
                    
                    case 'BolsilloMaterial': // Clave 'frontPocket'
                        return (
                            <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow>
                                {props.customImage.src ? 
                                    <CustomImageMaterial src={props.customImage.src} transform={props.customImage.transform} /> :
                                    <ConfigurableMaterial config={props.materials.frontPocket} /> // Usa config si no hay imagen
                                }
                            </mesh>
                        );

                    case 'Fabic1': // Clave 'adjustmentStraps'
                        return <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow>
                                  <ConfigurableMaterial config={props.materials.adjustmentStraps} />
                               </mesh>;
                    case 'Fabic2': // Clave 'loadStraps'
                        return <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow>
                                  <ConfigurableMaterial config={props.materials.loadStraps} />
                               </mesh>;
                    case 'Net_Side': // Clave 'sidePockets'
                        return <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow>
                                  <ConfigurableMaterial config={props.materials.sidePockets} />
                               </mesh>;
                    
                    default: // Partes no personalizables (hebillas, etc.)
                        return <mesh key={node.uuid} geometry={node.geometry} material={defaultMaterials[node.material.name]} castShadow receiveShadow />;
                }
            })}

            {/* Texto */}
            <Suspense fallback={null}>
                <Text
                    font={fontUrls[props.customText.font]}
                    position={[props.customText.positionX, props.customText.positionY, props.customText.positionZ]}
                    rotation={[0, 0, 0]}
                    fontSize={props.customText.size * 0.08}
                    color={props.customText.color}
                    anchorX="center" anchorY="middle" maxWidth={0.8} textAlign="center"
                >
                    {props.customText.content}
                </Text>
            </Suspense>
        </group>
    );
};

// --- BOLSO (Actualizado) ---
const Bag = (props) => {
    const { nodes, materials: defaultMaterials } = useGLTF('/bolso.glb');
    
    return (
        <group scale={1.5} position-y={-0.4} dispose={null}>
            {Object.values(nodes).map((node) => {
                if (!node.isMesh) return null;
                switch (node.name) {
                    // Aplicamos la misma lógica
                    case 'frenteMaterial':
                        return ( <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow> 
                                    <ConfigurableMaterial config={props.materials.frenteMaterial}/> 
                                </mesh> );
                    case 'lateralMaterial':
                        return <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow>
                                  <ConfigurableMaterial config={props.materials.lateralMaterial} />
                               </mesh>;
                    case 'handle':
                        return <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow>
                                  <ConfigurableMaterial config={props.materials.handle} />
                               </mesh>;
                    default: 
                        return <mesh key={node.uuid} geometry={node.geometry} material={defaultMaterials[node.material.name]} castShadow receiveShadow />;
                }
            })}

            {/* Texto */}
            <Suspense fallback={null}>
                <Text
                    font={fontUrls[props.customText.font]}
                    position={[props.customText.positionX, props.customText.positionY, props.customText.positionZ]}
                    rotation={[0, 0, 0]}
                    fontSize={props.customText.size * 0.08}
                    color={props.customText.color}
                    anchorX="center" anchorY="middle" maxWidth={0.8} textAlign="center"
                >
                    {props.customText.content}
                </Text>
            </Suspense>
        </group>
    );
};

// --- BOLSO MATERO (Actualizado) ---
const Matebag = (props) => {
    const { nodes, materials: defaultMaterials } = useGLTF('/bolso_matero.glb');
    
    return (
        <group scale={1.5} position-y={-0.6} dispose={null}>
            {Object.values(nodes).map((node) => {
                if (!node.isMesh) return null;
                switch (node.name) {
                    // Aplicamos la misma lógica
                    case 'relleno':
                        return ( <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow> 
                                    <ConfigurableMaterial config={props.materials.relleno}/> 
                                </mesh> );
                    case 'estructura':
                        return <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow>
                                  <ConfigurableMaterial config={props.materials.estructura} />
                               </mesh>;
                    case 'asas':
                        return <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow>
                                  <ConfigurableMaterial config={props.materials.asas} />
                               </mesh>;
                    default: 
                        return <mesh key={node.uuid} geometry={node.geometry} material={defaultMaterials[node.material.name]} castShadow receiveShadow />;
                }
            })}

            {/* Texto */}
            <Suspense fallback={null}>
                <Text
                    font={fontUrls[props.customText.font]}
                    position={[props.customText.positionX, props.customText.positionY, props.customText.positionZ]}
                    rotation={[0, 0, 0]}
                    fontSize={props.customText.size * 0.08}
                    color={props.customText.color}
                    anchorX="center" anchorY="middle" maxWidth={0.8} textAlign="center"
                >
                    {props.customText.content}
                </Text>
            </Suspense>
        </group>
    );
};

// --- 3. AÑADIR ESTE COMPONENTE HELPER ---
// Este componente vivirá dentro del Canvas y nos dará acceso al renderer
const Screenshotter = forwardRef((props, ref) => {
  const { gl } = useThree(); // Hook para acceder al renderer (gl)

  // Expone la función 'takeScreenshot' al componente padre (DesignerPage)
  useImperativeHandle(ref, () => ({
    takeScreenshot: () => {
      // gl.domElement es el <canvas>
      // toDataURL() convierte el contenido del canvas a una imagen PNG en base64
      return gl.domElement.toDataURL('image/png');
    }
  }));

  return null; // No renderiza nada visible
});



// Componente principal Canvas3D
function Canvas3D({ productType, screenshotRef, ...props}) {
    const controlsRef = useRef();
    const [isAutoRotate, setIsAutoRotate] = useState(true);
    
    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;
        let timeoutId = null;
        const handleStart = () => {
            setIsAutoRotate(false);
            clearTimeout(timeoutId);
        };
        const handleEnd = () => {
            timeoutId = setTimeout(() => {
                setIsAutoRotate(true);
            }, 5000);
        };
        controls.addEventListener("start", handleStart);
        controls.addEventListener("end", handleEnd);
        return () => {
            controls.removeEventListener("start", handleStart);
            controls.removeEventListener("end", handleEnd);
            clearTimeout(timeoutId);
        };
    }, [controlsRef]);

    const renderProduct = () => {
        const centerKey = JSON.stringify(props.materials);

        switch(productType) {
            case 'backpack':
                return (
                    <>
                        <PerspectiveCamera makeDefault fov={50} position={[0, 0, 3.1]} />
                        <Center key={JSON.stringify(props.materials)} position={[0.4, 0.3, 0]}>
                            <Backpack {...props} />
                        </Center>
                    </>
                );
            case 'bag':
                return (
                    <>
                        <PerspectiveCamera makeDefault fov={50} position={[0, 0, 3.3]} />
                        <Center key={JSON.stringify(props.materials)} position={[0.4, 0.2, 0]}>
                            <Bag {...props} />
                        </Center>
                    </>
                );
            case 'matebag':
                return (
                    <>
                        <PerspectiveCamera makeDefault fov={50} position={[0, 0, 3.4]} />
                        <Center key={JSON.stringify(props.materials)} position={[0.4, 0, 0]}>
                            <Matebag {...props} />
                        </Center>
                    </>
                );
            default:
                return (
                    <>
                        <PerspectiveCamera makeDefault fov={50} position={[0, 0, 3.1]} />
                        <Center key={JSON.stringify(props.materials)} position={[0.4, 0.3, 0]}>
                            <Backpack {...props} />
                        </Center>
                    </>
                );
        }
    }

    return (
        <Canvas dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }} >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <directionalLight position={[-5, -5, -5]} intensity={0.2} />
            <Environment preset="city" />
            <Suspense fallback={null}>
                {renderProduct()}
            </Suspense>
            <OrbitControls
                ref={controlsRef}
                makeDefault
                onStart={() => setIsAutoRotate(false)}
                autoRotate={isAutoRotate}
                autoRotateSpeed={1.0}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 1.5}
            />
            {/* --- 6. AÑADIR EL SCREENSHOTTER DENTRO DEL CANVAS --- */}
            <Screenshotter ref={screenshotRef} />
        </Canvas>
    );
}

// Precarga de modelos
useGLTF.preload('/mochila_dior.glb');
useGLTF.preload('/bolso.glb');
useGLTF.preload('/bolso_matero.glb');

export default Canvas3D;