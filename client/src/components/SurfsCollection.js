import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from 'react-three-fiber';
import { softShadows, OrbitControls, Html } from 'drei';
import SurfComponent from './SurfComponent';
import { useSpring } from 'react-spring/three';

const Lights = () => {
    return (
        <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />
            <directionalLight
                castShadow
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

    return (
        <div className="canvas">
            <Canvas colorManagement shadowMap camera={{ position: [0, 2, 10], fov: 60 }}>
                <Lights />
                <Suspense fallback={null}>
                    <SurfComponent position={posSurfOne} gltfData={firstSurfGltf} />
                    <SurfComponent position={posSurfTwo} gltfData={secondSurfGltf} />
                    <SurfComponent position={posSurfThree} gltfData={thirdSurfGltf} />
                </Suspense>
                <OrbitControls enablePan={false} target={[0, 1, 0]} />
            </Canvas>
        </div>
    )
}

export default SurfsCollection;

