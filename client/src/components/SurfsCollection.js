import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { softShadows, OrbitControls, Stars, MeshWobbleMaterial } from 'drei';
import { Canvas } from 'react-three-fiber';
import SurfComponent from './SurfComponent';
import { useSpring } from 'react-spring/three';

const Lights = () => {
    return (
        <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />
            <directionalLight
                castShadow
                penumbra={1}
                position={[0, 10, 0]}
                intensity={1.5}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            {/* Spotlight Large overhead light */}
            <spotLight intensity={1} position={[1000, 0, 0]} castShadow />
        </>
    );
};

softShadows();

const SurfsCollection = (props) => {

    const [firstSurfPos, setFirstSurfPos] = useState(() => {
        return [props.positions[0]];
    });

    const [secondSurfPos, setSecondPos] = useState(() => {
        return [props.positions[1]];
    });

    const [thirdSurfPos, setThirdPos] = useState(() => {
        return [props.positions[2]];
    });

    const [firstSurfGltf, setfirstGltf] = useState(props.gltfData[0].data3D);
    const [secondSurfGltf, setSecondGltf] = useState(props.gltfData[1].data3D);
    const [thirdSurfGltf, setThirdGltf] = useState(props.gltfData[2].data3D);

    const [shiftSurfs, setShiftSurfs] = useState(false);
    const [updateSurf, setUpdateSurf] = useState(false);

    const { posSurfOne, posSurfTwo, posSurfThree, color, scale, ...properties } = useSpring({
        posSurfOne: shiftSurfs ? firstSurfPos[1] : firstSurfPos[0],
        posSurfTwo: shiftSurfs ? secondSurfPos[1] : secondSurfPos[0],
        posSurfThree: shiftSurfs ? thirdSurfPos[1] : thirdSurfPos[0],
        config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 }
    });

    useEffect(() => {
        setUpdateSurf(true);
        setfirstGltf(props.gltfData[0].data3D);
        setSecondGltf(props.gltfData[1].data3D);
        setThirdGltf(props.gltfData[2].data3D);
        setUpdateSurf(false);
    }, [props.gltfData])

    useEffect(() => {
        setShiftSurfs(true);
        setFirstSurfPos((prevPos) => [props.positions[0], prevPos[0]]);
        setSecondPos((prevPos) => [props.positions[1], prevPos[0]]);
        setThirdPos((prevPos) => [props.positions[2], prevPos[0]]);
        setShiftSurfs(false);
    }, [props])

    const Island = () => (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -14, 0]} receiveShadow>
                <sphereBufferGeometry attach="geometry" args={[15, 32, 32]} />
                <meshPhysicalMaterial attach="material" color="yellow" />
            </mesh>
        </group>
    )

    const SeaPlanet = () => (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -100, 0]} receiveShadow>
                <sphereBufferGeometry attach="geometry" args={[99, 64, 64]} />
                <MeshWobbleMaterial color="#4372a4" speed={0.5} factor={0.5} />
            </mesh>
        </group>
    )

    const [palmTree, setPalmTree] = useState(() => {
        return null;
    });

    const url = process.env.PUBLIC_URL + "/scene.gltf"

    useEffect(() => {
        new GLTFLoader().load(url, gltf => {
            console.log('UseEffectFired');
            setPalmTree(gltf.scene)
        })
    }, [url])

    const PalmTree = () => {
        return palmTree ? <primitive object={palmTree} position={[-3, 0, 0]}/> : null
    }


    return (
        <div className="canvas">
            <Canvas colorManagement shadowMap camera={{ position: [0, 2, 10], fov: 60 }} >
                <OrbitControls enablePan={false} target={[0, 1, 0]} />
                <Lights />
                <Island />
                <SeaPlanet />
                <PalmTree />               
                <Suspense fallback={null}>
                    <SurfComponent position={posSurfOne} gltfData={firstSurfGltf} />
                    <SurfComponent position={posSurfTwo} gltfData={secondSurfGltf} />
                    <SurfComponent position={posSurfThree} gltfData={thirdSurfGltf} />
                </Suspense>
                <Stars />
            </Canvas>
        </div>
    )
}


//<PalmTree />
export default SurfsCollection;

