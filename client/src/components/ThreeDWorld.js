import React, { Suspense, useState, useEffect, useRef } from 'react';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { softShadows, OrbitControls, MeshWobbleMaterial, Stars } from 'drei';
import { Canvas, useFrame } from 'react-three-fiber';
import SurfComponent from './SurfComponent';
import { useSpring, animated } from 'react-spring/three';
import * as THREE from 'three/src/Three';

softShadows();

const Lights = () => {
    return (
        <>
            <ambientLight intensity={0.3} />
            {/* Galaxy light */}
            <spotLight intensity={1} position={[200, 200, 0]} castShadow/>
            {/* Showcase light from  front */}
            <pointLight intensity={2} position={[0, 3, 1.5]} distance={4} decay={1}/>
            {/* Showcase light from  behind */}
            <pointLight intensity={2} position={[0, 3, -1.5]} distance={5} decay={1}/>
        </>
    );
};

const Island = () => {
    const island = useRef();
    return (
        <mesh ref={island} rotation={[-Math.PI / 2, 0, 0]} position={[0, -14, 0]}>
            <sphereBufferGeometry attach="geometry" args={[14.5, 32, 32]} />
            <meshStandardMaterial attach="material" color="yellow" />
        </mesh>
    )
}

const SeaPlanet = () => {
    const seaPlanet = useRef();
    return (
        <mesh ref={seaPlanet} rotation={[-Math.PI / 2, 0, 0]} position={[0, -100, 0]}>
            <sphereBufferGeometry attach="geometry" args={[99, 64, 64]} />
            <MeshWobbleMaterial color="#4372a4" speed={0.5} factor={0.5} />
        </mesh>
    )
};

const PalmTree = () => {

    const palmTreeUrl = process.env.PUBLIC_URL + "/scene.gltf";

    const [palmTree, setPalmTree] = useState(() => {
        return null;
    });

    useEffect(() => {
        new GLTFLoader().load(palmTreeUrl, gltf => {
            setPalmTree(gltf.scene);
        });
    }, [palmTreeUrl]);

    return (
        palmTree ? <primitive object={palmTree} position={[-5, -2, -3]} /> : null
    )
};

const LoadingComet = (isLoadingUpdatedSurf) => {
    const mesh = useRef(null);

    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.02))

    let drivingValue = isLoadingUpdatedSurf.isLoadingUpdatedSurf;

    const { rotationComet, scaleComet, positionComet, cometColor } = useSpring({
        scaleComet: drivingValue ? [2, 2, 2] : [0.1, 0.1, 0.1],
        rotationComet: drivingValue ? [0, THREE.Math.degToRad(360), THREE.Math.degToRad(270)] : [0, 0, 0],
        positionComet: drivingValue ? [0, 7, 0] : [0, 10, 0],
        cometColor: drivingValue ? '#f8f403' : '#250333',
        config: { mass: 10, tension: 100, friction: 30 }
    });

    return (
        <animated.mesh ref={mesh} position={positionComet} scale={scaleComet} rotation={rotationComet} >
            <animated.meshStandardMaterial color={cometColor} />
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        </animated.mesh>
    )
};

const ThreeDWorld = (props) => {

    // UseStates (run only on start)

    const [firstSurfPos, setFirstSurfPos] = useState(() => {
        return [props.positions[0]];
    });

    const [secondSurfPos, setSecondPos] = useState(() => {
        return [props.positions[1]];
    });

    const [thirdSurfPos, setThirdPos] = useState(() => {
        return [props.positions[2]];
    });

    // UseStates (run all the time)

    const [firstSurfGltf, setfirstGltf] = useState(props.gltfData[0].data3D);

    const [secondSurfGltf, setSecondGltf] = useState(props.gltfData[1].data3D);

    const [thirdSurfGltf, setThirdGltf] = useState(props.gltfData[2].data3D);

    const [shiftSurfs, setShiftSurfs] = useState(false);

    const [updateSurf, setUpdateSurf] = useState(false);

    // UseSprings

    const { posSurfOne, posSurfTwo, posSurfThree } = useSpring({
        posSurfOne: shiftSurfs ? firstSurfPos[1] : firstSurfPos[0],
        posSurfTwo: shiftSurfs ? secondSurfPos[1] : secondSurfPos[0],
        posSurfThree: shiftSurfs ? thirdSurfPos[1] : thirdSurfPos[0],
        config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 }
    });

    // UseEffects

    useEffect(() => {
        setUpdateSurf(true);
        setfirstGltf(props.gltfData[0].data3D);
        setSecondGltf(props.gltfData[1].data3D);
        setThirdGltf(props.gltfData[2].data3D);
        setUpdateSurf(false);
    }, [props.gltfData]);

    useEffect(() => {
        setShiftSurfs(true);
        setFirstSurfPos((prevPos) => [props.positions[0], prevPos[0]]);
        setSecondPos((prevPos) => [props.positions[1], prevPos[0]]);
        setThirdPos((prevPos) => [props.positions[2], prevPos[0]]);
        setShiftSurfs(false);
    }, [props]);

    useEffect(() => {
        //setRotateComet(!rotateComet);
    }, [props]);

    return (
        <div className="canvas">
            <Canvas concurrent
                colorManagement
                shadowMap
                camera={{ position: [0, 15, 35], fov: 50 }} >
                <OrbitControls
                    enablePan={false}
                    target={[0, 2, 0]}
                    enableDamping={true}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                    minDistance={3}
                    maxDistance={400}

                />
                <Lights />
                <SeaPlanet />
                <Island />
                <Suspense fallback={null}>
                    <PalmTree />
                </Suspense>
                <LoadingComet isLoadingUpdatedSurf={props.isLoadingUpdatedSurf} />
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

export default ThreeDWorld;

