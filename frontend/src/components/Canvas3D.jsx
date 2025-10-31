import React, { Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Text, useTexture, Environment, Center, Html } from '@react-three/drei';
import * as THREE from 'three';

// URLs de las fuentes (sin cambios)
const fontUrls = { 'Ailerons': '/fonts/Ailerons.woff', 'Aqua': '/fonts/Aqua.woff', 'CraftyHoliday': '/fonts/CraftyHoliday.woff', 'Formula1-Bold': '/fonts/Formula1-Bold.woff', 'Formula1-Italic': '/fonts/Formula1-Italic.woff', 'Hyped': '/fonts/Hyped.woff', 'Jellee-Roman': '/fonts/Jellee-Roman.woff', 'koliko-Bold': '/fonts/koliko-Bold.woff', 'koliko-Light': '/fonts/koliko-Light.woff', 'koliko-Regular': '/fonts/koliko-Regular.woff', 'Lombok-Regular': '/fonts/Lombok-Regular.woff', 'Lottebytes': '/fonts/Lottebytes.woff', 'Love': '/fonts/Love.woff', 'Modeka': '/fonts/Modeka.woff', 'Neutro-ExtraBold': '/fonts/Neutro-ExtraBold.woff', 'Neutro-Outline': '/fonts/Neutro-Outline.woff', 'Nordic-Alternative-regular': '/fonts/Nordic-Alternative-regular.woff', 'parley-bold': '/fonts/parley-bold.woff', 'parley-regular': '/fonts/parley-regular.woff'};

// Componente para materiales PBR (sin cambios)
const PbrMaterial = ({ path }) => {
    const pbrTextures = useTexture({ map: `${path}/color.jpg`, normalMap: `${path}/normal.jpg`, roughnessMap: `${path}/roughness.jpg` });
    useEffect(() => { Object.values(pbrTextures).forEach(tex => { if (tex) { tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(3, 3); tex.flipY = false; tex.needsUpdate = true; } }); }, [pbrTextures]);
    return <meshStandardMaterial {...pbrTextures} roughness={1.0} metalness={0.0} />;
};

// Componente para el material de la imagen personalizada con transformación
const CustomImageMaterial = ({ src, transform }) => {
    const texture = useTexture(src);
    
    useEffect(() => {
        if (texture) { // Asegurarnos que la textura esté cargada
            texture.flipY = false;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            
            // 1. Aplicamos el Zoom (escala de repetición)
            texture.repeat.set(transform.scale, transform.scale);
            
            // 2. ¡NUEVA LÓGICA DE OFFSET!
            // Calculamos el offset base para centrar el zoom
            const baseOffsetX = (1 - transform.scale) / 2;
            const baseOffsetY = (1 - transform.scale) / 2;

            // 3. Añadimos el "pan" (movimiento) de los sliders
            // Esto permite que los sliders X/Y funcionen independientemente del zoom
            texture.offset.set(
                baseOffsetX + transform.offsetX,
                baseOffsetY + transform.offsetY
            );
            
            texture.needsUpdate = true;
        }
    }, [texture, transform]); // Se ejecuta solo cuando la textura o la transformación cambian

    return <meshStandardMaterial map={texture} roughness={0.8} />;
};

// Componente para el material del cuerpo que aplica texturas (sin cambios)
const BodyMaterial = ({ texture, color }) => {
    const [category, variant] = (texture || 'none').split('-');
    if (category === 'leather') return <PbrMaterial path={`/textures/leather/${variant}`} />;
    if (category === 'canvas') return <PbrMaterial path={`/textures/canvas/${variant || 'v1'}`} />;
    if (category === 'geometric') return <PbrMaterial path={`/textures/geometric/${variant || 'v1'}`} />;
    return <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />;
};

// Componente de la mochila (sin cambios en la lógica de materiales)
const Backpack = (props) => {
    const { nodes, materials } = useGLTF('/mochila_dior.glb');
    
    const adjustmentStrapsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: props.colors.adjustmentStraps }), [props.colors.adjustmentStraps]);
    const loadStrapsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: props.colors.loadStraps }), [props.colors.loadStraps]);
    const sidePocketsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: props.colors.sidePockets }), [props.colors.sidePockets]);

    return (
        <group scale={1.5} position-y={-1.0}>
            {Object.values(nodes).map((node) => {
                if (!node.isMesh) return null;
                
                switch (node.name) {
                    case 'Pattern':
                        return ( <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow> <BodyMaterial {...props} color={props.colors.body}/> </mesh> );
                    
                    case 'BolsilloMaterial':
                        return (
                            <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow>
                                {props.customImage.src ? 
                                    <CustomImageMaterial src={props.customImage.src} transform={props.customImage.transform} /> :
                                    <meshStandardMaterial color={props.colors.frontPocket} roughness={0.8} metalness={0.1} />
                                }
                            </mesh>
                        );

                    case 'Fabic1': 
                        return <mesh key={node.uuid} geometry={node.geometry} material={adjustmentStrapsMaterial} castShadow receiveShadow />;
                    case 'Fabic2': 
                        return <mesh key={node.uuid} geometry={node.geometry} material={loadStrapsMaterial} castShadow receiveShadow />;
                    case 'Net_Side': 
                        return <mesh key={node.uuid} geometry={node.geometry} material={sidePocketsMaterial} castShadow receiveShadow />;
                    
                    default: 
                        return <mesh key={node.uuid} geometry={node.geometry} material={materials[node.material.name]} castShadow receiveShadow />;
                }
            })}

            <Suspense fallback={null}>
                {/* Componente de texto sin cambios */}
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

// Otros componentes de productos (sin cambios)
const Bag = (props) => ( <group position-y={-0.75} {...props}> <mesh castShadow receiveShadow> <boxGeometry args={[2.5, 1.5, 0.7]} /> <meshStandardMaterial color={props.colors.body || '#ffffff'} /> </mesh> <mesh castShadow receiveShadow position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}> <torusGeometry args={[0.8, 0.05, 16, 100, Math.PI]} /> <meshStandardMaterial color={props.colors.loadStraps || '#000000'} /> </mesh> </group> );
const MateBag = (props) => ( <group position-y={-1} {...props}> <mesh castShadow receiveShadow> <cylinderGeometry args={[0.8, 0.8, 2, 32]} /> <meshStandardMaterial color={props.colors.body || '#ffffff'} /> </mesh> <mesh castShadow receiveShadow position={[0, 1, 0]}> <torusGeometry args={[1.2, 0.04, 16, 100]} /> <meshStandardMaterial color={props.colors.loadStraps || '#000000'} /> </mesh> </group> );

// Componente principal Canvas3D (sin cambios)
export default function Canvas3D({ productType, ...props}) {
    const renderProduct = () => {
        switch(productType) {
            case 'backpack': return <Backpack {...props} />;
            case 'bag': return <Bag {...props} />;
            case 'mateBag': return <MateBag {...props} />;
            default: return <Backpack {...props} />;
        }
    }
    // frontend/src/components/Canvas3D.jsx

    // ... (justo antes del return)
    // Componente simple para mostrar texto de carga
    const Loader = () => {
        return (
            <Html center> {/* 'Html' nos deja poner HTML dentro del Canvas 3D */}
                <div style={{ color: 'white', fontSize: '1.5rem', fontFamily: 'sans-serif' }}>
                    Cargando modelo...
                </div>
            </Html>
        );
    }


    return (
        <Canvas dpr={[1, 2]} camera={{ fov: 50, position: [0, 0, 3.1] }}>
            
            {/* PASO 1: Reemplazamos <Stage> por luces manuales
              Esto nos da control total.
            */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <directionalLight position={[-5, -5, -5]} intensity={0.2} />

            {/* PASO 2: Añadimos el entorno (reflejos) por separado,
              ya que <Stage> lo hacía por nosotros.
            */}
            <Environment preset="city" />

            <Suspense fallback={<Loader />}>
                {/* PASO 3: Envolvemos tu producto en <Center>
                  para asegurarnos de que quede en medio de la escena,
                  algo que <Stage> también hacía automáticamente.
                // position={[X, Y, Z]}
                // X = mueve izquierda/derecha
                // Y = mueve arriba/abajo
                // Z = mueve adelante/atrás
                */}
                
                <Center position={[0.4, 0.3, 0]}>
                   {renderProduct()}
                </Center>
            </Suspense>

            {/* Los controles de órbita quedan igual */}
            <OrbitControls makeDefault autoRotate={true} minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} />
        </Canvas>
    );
}

useGLTF.preload('/mochila_dior.glb');
