import React, { useEffect, Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text, useTexture, Environment, Center, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// --- INICIO: Contenido de Canvas3D.jsx ---

// URLs de las fuentes
const fontUrls = { 'Ailerons': '/fonts/Ailerons.woff', 'Aqua': '/fonts/Aqua.woff', 'CraftyHoliday': '/fonts/CraftyHoliday.woff', 'Formula1-Bold': '/fonts/Formula1-Bold.woff', 'Formula1-Italic': '/fonts/Formula1-Italic.woff', 'Hyped': '/fonts/Hyped.woff', 'Jellee-Roman': '/fonts/Jellee-Roman.woff', 'koliko-Bold': '/fonts/koliko-Bold.woff', 'koliko-Light': '/fonts/koliko-Light.woff', 'koliko-Regular': '/fonts/koliko-Regular.woff', 'Lombok-Regular': '/fonts/Lombok-Regular.woff', 'Lottebytes': '/fonts/Lottebytes.woff', 'Love': '/fonts/Love.woff', 'Modeka': '/fonts/Modeka.woff', 'Neutro-ExtraBold': '/fonts/Neutro-ExtraBold.woff', 'Neutro-Outline': '/fonts/Neutro-Outline.woff', 'Nordic-Alternative-regular': '/fonts/Nordic-Alternative-regular.woff', 'parley-bold': '/fonts/parley-bold.woff', 'parley-regular': '/fonts/parley-regular.woff'};

// Componente para materiales PBR
const PbrMaterial = ({ path }) => {
    const pbrTextures = useTexture({ map: `${path}/color.jpg`, normalMap: `${path}/normal.jpg`, roughnessMap: `${path}/roughness.jpg` });
    useEffect(() => { Object.values(pbrTextures).forEach(tex => { if (tex) { tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(3, 3); tex.flipY = false; tex.needsUpdate = true; } }); }, [pbrTextures]);
    return <meshStandardMaterial {...pbrTextures} roughness={1.0} metalness={0.0} />;
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
        // Si es tipo 'color', usa el valor como color
        return <meshStandardMaterial color={config.value} roughness={0.8} metalness={0.1} />;
    }
    
    if (config?.type === 'texture') {
        // Si es tipo 'textura', usa la lógica anterior
        const [category, variant] = (config.value || 'none').split('-');
        if (category === 'leather') return <PbrMaterial path={`/textures/leather/${variant}`} />;
        if (category === 'canvas') return <PbrMaterial path={`/textures/canvas/${variant || 'v1'}`} />;
        if (category === 'geometric') return <PbrMaterial path={`/textures/geometric/${variant || 'v1'}`} />;
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

// Componente principal Canvas3D
function Canvas3D({ productType, ...props}) {
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
                        <Center key={JSON.stringify(props.materials)} position={[0.3, 0, 0]}>
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
        <Canvas dpr={[1, 2]}>
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
        </Canvas>
    );
}

// Precarga de modelos
useGLTF.preload('/mochila_dior.glb');
useGLTF.preload('/bolso.glb');
useGLTF.preload('/bolso_matero.glb');

// --- FIN: Contenido de Canvas3D.jsx ---

export default Canvas3D;