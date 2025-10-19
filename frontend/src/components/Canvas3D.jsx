import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Tu lista de fuentes
const fontUrls = {
    'Ailerons': '/fonts/Ailerons.woff', 'Aqua': '/fonts/Aqua.woff', 'CraftyHoliday': '/fonts/CraftyHoliday.woff', 
    'Formula1-Bold': '/fonts/Formula1-Bold.woff', 'Formula1-Italic': '/fonts/Formula1-Italic.woff',
    'Hyped': '/fonts/Hyped.woff', 'Jelle-Roman': '/fonts/Jelle-Roman.woff', 'koliko-Bold': '/fonts/koliko-Bold.woff',
    'koliko-Light': '/fonts/koliko-Light.woff', 'koliko-Regular': '/fonts/koliko-Regular.woff', 'Lombok-Regular': '/fonts/Lombok-Regular.woff',
    'Lottebytes': '/fonts/Lottebytes.woff', 'Love': '/fonts/Love.woff', 'Modeka': '/fonts/Modeka.woff',
    'Neutro-ExtraBold': '/fonts/Neutro-ExtraBold.woff', 'Neutro-Outline': '/fonts/Neutro-Outline.woff',
    'Nordic-Alternative-egular': '/fonts/Nordic-Alternative-Regular.woff', 'parley-bold': '/fonts/parley-bold.woff',
    'parley-regular': '/fonts/parley-regular.woff',
};

const PbrMaterial = ({ path }) => {
    const pbrTextures = useTexture({ map: `${path}/color.jpg`, normalMap: `${path}/normal.jpg`, roughnessMap: `${path}/roughness.jpg` });
    useEffect(() => { Object.values(pbrTextures).forEach(tex => { if (tex) { tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(3, 3); tex.flipY = false; tex.needsUpdate = true; } }); }, [pbrTextures]);
    return <meshStandardMaterial {...pbrTextures} roughness={1.0} metalness={0.0} />;
};

// Componente de material simplificado
const BodyMaterial = ({ texture, color, drawingTexture }) => {
    const [drawingTex, setDrawingTex] = useState(null);

    useEffect(() => {
        if (drawingTexture) {
            new THREE.TextureLoader().load(drawingTexture, t => { t.flipY = false; t.needsUpdate = true; setDrawingTex(t); });
        } else {
            setDrawingTex(null);
        }
    }, [drawingTexture]);
    
    // Lógica de prioridad simplificada
    if (texture === 'custom' && drawingTex) {
        return <meshStandardMaterial map={drawingTex} roughness={0.8} />;
    } else if (texture.startsWith('leather-')) {
        const [, variant] = texture.split('-');
        return <PbrMaterial path={`/textures/leather/${variant}`} />;
    } else if (texture === 'canvas') {
        return <PbrMaterial path="/textures/canvas" />;
    } else if (texture.startsWith('geometric-')) {
        const [, variant] = texture.split('-');
        return <PbrMaterial path={`/textures/geometric/${variant || 'v1'}`} />;
    } else {
        return <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />;
    }
};

const Backpack = (props) => {
    const { nodes, materials } = useGLTF('/mochila_dior.glb');
    
    const adjustmentStrapsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: props.colors.adjustmentStraps }), [props.colors.adjustmentStraps]);
    const loadStrapsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: props.colors.loadStraps }), [props.colors.loadStraps]);
    const sidePocketsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: props.colors.sidePockets }), [props.colors.sidePockets]);

    return (
        <group scale={1.5} position-y={-1.0}>
            {Object.values(nodes).map((node) => {
                if (!node.isMesh) return null;
                let materialToRender;
                switch (node.name) {
                    case 'Pattern':
                        return ( <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow> <BodyMaterial {...props} color={props.colors.body}/> </mesh> );
                    case 'Fabic1': materialToRender = adjustmentStrapsMaterial; break;
                    case 'Fabic2': materialToRender = loadStrapsMaterial; break;
                    case 'Net_Side': materialToRender = sidePocketsMaterial; break;
                    default: 
                        materialToRender = materials[node.material.name]; break;
                }
                return <mesh key={node.uuid} geometry={node.geometry} material={materialToRender} castShadow receiveShadow />;
            })}

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

// Componentes placeholder restaurados
const Bag = (props) => (
  <group position-y={-0.75} {...props}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[2.5, 1.5, 0.7]} />
      <meshStandardMaterial color={props.colors.body || '#ffffff'} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.8, 0.05, 16, 100, Math.PI]} />
      <meshStandardMaterial color={props.colors.loadStraps || '#000000'} />
    </mesh>
  </group>
);
const MateBag = (props) => (
   <group position-y={-1} {...props}>
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[0.8, 0.8, 2, 32]} />
      <meshStandardMaterial color={props.colors.body || '#ffffff'} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 1, 0]}>
       <torusGeometry args={[1.2, 0.04, 16, 100]} />
       <meshStandardMaterial color={props.colors.loadStraps || '#000000'} />
    </mesh>
  </group>
);


export default function Canvas3D({ productType, ...props}) {
    const renderProduct = () => {
        switch(productType) {
            case 'backpack': return <Backpack {...props} />;
            case 'bag': return <Bag {...props} />;
            case 'mateBag': return <MateBag {...props} />;
            default: return <Backpack {...props} />;
        }
    }
    return (
        <Canvas shadows dpr={[1, 2]} camera={{ fov: 50, position: [0, 0, 5] }}>
            <Suspense fallback={null}>
                <Stage environment="city" intensity={0.4} adjustCamera preset="rembrandt">
                   {renderProduct()}
                </Stage>
            </Suspense>
            <OrbitControls makeDefault autoRotate={false} minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} />
        </Canvas>
    );
}

useGLTF.preload('/mochila_dior.glb');

