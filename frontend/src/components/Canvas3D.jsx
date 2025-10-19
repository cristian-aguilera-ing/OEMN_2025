import React, { Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// --- MAPEO DE FUENTES LOCALES (CON TU LISTA COMPLETA) ---
const fontUrls = {
    'Ailerons': '/fonts/Ailerons.woff',
    'Aqua': '/fonts/Aqua.woff',
    'CraftyHoliday': '/fonts/CraftyHoliday.woff',
    'Formula1-Black': '/fonts/Formula1-Black.woff',
    'Formula1-Bold_web': '/fonts/Formula1-Bold_web.woff',
    'Formula1-Bold': '/fonts/Formula1-Bold.woff',
    'Formula1-Italic': '/fonts/Formula1-Italic.woff',
    'Formula1-Regular': '/fonts/Formula1-Regular.woff',
    'Formula1-Wide': '/fonts/Formula1-Wide.woff',
    'Hyped': '/fonts/Hyped.woff',
    'Jelle-Roman': '/fonts/Jelle-Roman.woff',
    'koliko-Bold': '/fonts/koliko-Bold.woff',
    'koliko-Light': '/fonts/koliko-Light.woff',
    'koliko-Regular': '/fonts/koliko-Regular.woff',
    'Lombok-Regular': '/fonts/Lombok-Regular.woff',
    'Lottebytes': '/fonts/Lottebytes.woff',
    'Love': '/fonts/Love.woff',
    'Modeka': '/fonts/Modeka.woff',
    'Neutro-ExtraBold': '/fonts/Neutro-ExtraBold.woff',
    'Neutro-Outline': '/fonts/Neutro-Outline.woff',
    'Nordic-Alternative-egular': '/fonts/Nordic-Alternative-egular.woff', // Ojo con el nombre de archivo si es 'Regular'
    'parley-bold': '/fonts/parley-bold.woff',
    'parley-regular': '/fonts/parley-regular.woff',
};

const BodyMaterial = ({ textureId, color, drawingTexture }) => {
  const [category, variant] = (textureId || 'none').split('-');
  const isPBR = category === 'leather';
  const isCustom = textureId === 'custom';

  const pbrTexturePaths = useMemo(() => {
    if (!isPBR) return null;
    const basePath = `/textures/${category}/${variant}/`;
    return { map: `${basePath}color.jpg`, normalMap: `${basePath}normal.jpg`, roughnessMap: `${basePath}roughness.jpg` };
  }, [isPBR, category, variant]);

  const pbrTextures = useTexture(pbrTexturePaths ? pbrTexturePaths : {});
  
  useEffect(() => {
    if(pbrTextures && Object.keys(pbrTextures).length > 0) {
      Object.values(pbrTextures).forEach(tex => {
        if(tex) {
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(3, 3);
          tex.needsUpdate = true;
        }
      });
    }
  }, [pbrTextures]);

  if (isCustom && drawingTexture) {
    return <meshStandardMaterial map={drawingTexture} roughness={0.8} />;
  }
  if (isPBR && pbrTextures.map) {
    return <meshStandardMaterial {...pbrTextures} />;
  }
  // Fallback a color liso
  return <meshStandardMaterial color={color} roughness={0.8} />;
};

const Backpack = ({ colors, texture, customText, drawingTexture }) => {
  const { nodes, materials } = useGLTF('/mochila_dior.glb');
  
  const userDrawingTexture = useMemo(() => {
    if (!drawingTexture) return null;
    const loader = new THREE.TextureLoader();
    return loader.load(drawingTexture, (tex) => { tex.flipY = false; tex.needsUpdate = true; });
  }, [drawingTexture]);

  const adjustmentStrapsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.1, color: colors.adjustmentStraps }), [colors.adjustmentStraps]);
  const loadStrapsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.1, color: colors.loadStraps }), [colors.loadStraps]);
  const sidePocketsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.1, color: colors.sidePockets }), [colors.sidePockets]);

  return (
    // --- ESCALA REDUCIDA ---
    <group scale={2} position-y={-1.0}>
      {Object.values(nodes).map((node) => {
        if (!node.isMesh) return null;
        let materialToRender;
        switch (node.name) {
          case 'Pattern':
            return (
              <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow>
                <BodyMaterial textureId={texture} color={colors.body} drawingTexture={userDrawingTexture} />
              </mesh>
            );
          
          case 'Fabic1': materialToRender = adjustmentStrapsMaterial; break;
          case 'Fabic2': materialToRender = loadStrapsMaterial; break;
          case 'Net_Side': materialToRender = sidePocketsMaterial; break;
          
          default: materialToRender = materials[node.material.name]; break;
        }
        return <mesh key={node.uuid} geometry={node.geometry} material={materialToRender} castShadow receiveShadow />;
      })}

      <Suspense fallback={null}>
        <Text
          font={fontUrls[customText.font]}
          position={[customText.positionX, customText.positionY, customText.positionZ]}
          rotation={[-0.2, 0, 0]}
          fontSize={customText.size * 0.08}
          color={customText.color}
          anchorX="center"
          anchorY="middle"
          maxWidth={0.8}
          textAlign="center"
        >
          {customText.content}
        </Text>
      </Suspense>
    </group>
  );
};

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

export default function Canvas3D({ productType, colors, texture, customText, drawingTexture }) {
  const renderProduct = () => {
    const props = { colors, texture, customText, drawingTexture };
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
        <Stage environment="city" intensity={0.6} adjustCamera preset="rembrandt">
          {renderProduct()}
        </Stage>
      </Suspense>
      <OrbitControls makeDefault autoRotate={false} minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} />
    </Canvas>
  );
}

useGLTF.preload('/mochila_dior.glb');

