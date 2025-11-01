import React, { Suspense, useMemo, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Text, useTexture, Environment, Center, PerspectiveCamera } from '@react-three/drei';
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

// Componente de la MOCHILA (sin cambios en la lógica de materiales)
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

// --- BOLSO ---
const Bag = (props) => {
    // 1. Carga el modelo .glb del bolso
    const { nodes, materials } = useGLTF('/bolso.glb');

    // 2. Crea materiales optimizados para las partes del bolso
    const lateralesMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: props.colors.lateralMaterial }), [props.colors.lateralMaterial]);
    const handleMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: props.colors.handle }), [props.colors.handle]);

    return (
        // 3. Usa la misma escala y posición que la mochila para consistencia
        <group scale={1.5} position-y={-0.4} dispose={null}>

            {/* 4. Itera sobre TODAS las mallas del bolso */}
            {Object.values(nodes).map((node) => {
                if (!node.isMesh) return null;

                // 5. Aplica materiales según el nombre
                switch (node.name) {

                    // 6. CASOS ESPECIALES (Mallas personalizables)

                    // CUERPO: usa BodyMaterial. ¡Esto arregla Colores Y Texturas!
                    case 'frenteMaterial':
                        return ( <mesh key={node.uuid} geometry={node.geometry} castShadow receiveShadow> 
                                    <BodyMaterial {...props} color={props.colors.frenteMaterial}/> 
                                </mesh> );

                    // LATERALES: usa el material de color
                    case 'lateralMaterial':
                        return <mesh key={node.uuid} geometry={node.geometry} material={lateralesMaterial} castShadow receiveShadow />;

                    // MANIJA: usa el material de color
                    case 'handle':
                        return <mesh key={node.uuid} geometry={node.geometry} material={handleMaterial} castShadow receiveShadow />;

                    // 7. CASO POR DEFECTO (Partes no personalizables)
                    default: 
                        return <mesh key={node.uuid} geometry={node.geometry} material={materials[node.material.name]} castShadow receiveShadow />;
                }
            })}

            {/* 8. AÑADE EL TEXTO (¡Esto arregla el Texto!) */}
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

// --- FIN DEL CÓDIGO DE REEMPLAZO ---

//--- AQUI CAMBIAR ESTA LINEA PARA EL MODELO DEL MATE
const MateBag = (props) => ( <group position-y={-1} {...props}> <mesh castShadow receiveShadow> <cylinderGeometry args={[0.8, 0.8, 2, 32]} /> <meshStandardMaterial color={props.colors.body || '#ffffff'} /> </mesh> <mesh castShadow receiveShadow position={[0, 1, 0]}> <torusGeometry args={[1.2, 0.04, 16, 100]} /> <meshStandardMaterial color={props.colors.loadStraps || '#000000'} /> </mesh> </group> );

// Componente principal Canvas3D (sin cambios)
export default function Canvas3D({ productType, ...props}) {
    const controlsRef = useRef();
    const [isAutoRotate, setIsAutoRotate] = useState(true);
    
    // Este useEffect ahora SÍ funciona
    useEffect(() => {
        const controls = controlsRef.current;
        // 1. Si los controles no están listos, no hagas nada.
        //    PERO, como 'controlsRef' está en el array de abajo,
        //    este efecto se volverá a ejecutar cuando esté listo.
        if (!controls) return;

        // Usamos una variable simple para guardar el ID del timer
        let timeoutId = null;

        const handleStart = () => {
            // 2. Detiene la rotación (usando el estado)
            setIsAutoRotate(false);
            
            // 3. Limpia cualquier timer anterior
            clearTimeout(timeoutId);
        };

        const handleEnd = () => {
            // 4. Inicia el timer de 5 seg SÓLO cuando el usuario suelta
            timeoutId = setTimeout(() => {
                setIsAutoRotate(true); // 5. Reactiva la rotación (usando el estado)
            }, 5000); // 5000ms = 5 segundos
        };

        // 6. Añadimos los listeners para "empezar a tocar" y "soltar"
        controls.addEventListener("start", handleStart);
        controls.addEventListener("end", handleEnd);

        // 7. Limpieza al desmontar el componente
        return () => {
            controls.removeEventListener("start", handleStart);
            controls.removeEventListener("end", handleEnd);
            clearTimeout(timeoutId);
        };
        
    // 8. ¡EL CAMBIO CLAVE! El efecto se re-ejecuta cuando 'controlsRef' (el objeto) se carga.
    }, [controlsRef]);

    const renderProduct = () => {
        switch(productType) {
            
            // --- CASO MOCHILA ---
            case 'backpack':
                return (
                    <>
                        {/* Configuración específica para la Mochila */}
                        <PerspectiveCamera makeDefault fov={50} position={[0, 0, 3.1]} />
                        <Center position={[0.4, 0.3, 0]}>
                            <Backpack {...props} />
                        </Center>
                    </>
                );

            // --- CASO BOLSO ---
            case 'bag':
                return (
                    <>
                        {/* Configuración para el Bolso: Cámara más lejos, Fov más bajo y centrado en el origen */}
                        <PerspectiveCamera makeDefault fov={35} position={[0, 0, 4]} />
                        <Center position={[0.3, 0, 0]}>
                            <Bag {...props} />
                        </Center>
                    </>
                );

            // --- CASO BOLSO MATERO ---
            case 'mateBag':
                return (
                    <>
                        {/* (Usamos la config de la mochila como base, puedes ajustarla luego) */}
                        <PerspectiveCamera makeDefault fov={50} position={[0, 0, 3.1]} />
                        <Center position={[0, 0, 0]}>
                            <MateBag {...props} />
                        </Center>
                    </>
                );
            
            // --- CASO POR DEFECTO ---
            default:
                return (
                    <>
                        <PerspectiveCamera makeDefault fov={50} position={[0, 0, 3.1]} />
                        <Center position={[0.4, 0.3, 0]}>
                            <Backpack {...props} />
                        </Center>
                    </>
                );
        }
        }

    // frontend/src/components/Canvas3D.jsx

    return (
        <Canvas dpr={[1, 2]}>
            
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

            <Suspense fallback={null}>
                {renderProduct()}
            </Suspense>

            {/* Los controles de órbita quedan igual */}
            <OrbitControls
                ref={controlsRef}
                makeDefault
                onStart={() => setIsAutoRotate(false)}
                autoRotate={isAutoRotate} // <-- Esto ahora obedece al 100% al useEffect
                autoRotateSpeed={1.0}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 1.5}
            />

        </Canvas>
    );
}

useGLTF.preload('/mochila_dior.glb');
useGLTF.preload('/bolso.glb');
