import * as THREE from 'three';
import React, { Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import { softShadows, OrbitControls } from 'drei';
import SurfComponent from './SurfComponent';

const Lights = () => {
    return (
        <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
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

const SurfsCollection = () => {
    
    return (
        <div className="canvas">
            <Canvas colorManagement shadowMap camera={{ position: [-2, 1, 0], fov: 60 }}>
                <Lights />
                <Suspense fallback={null}>
                   <SurfComponent position={[-1,0,0]}/>
                   <SurfComponent position={[1,0,0]}/>
                   {/*
                   <SurfComponent position={[-2,1,-2]}/>
                   <SurfComponent position={[-2,1,2]}/>
                   */}
                   
                </Suspense>
                <OrbitControls enablePan={false}  target = {[0, 1, 0]}/>
            </Canvas>
        </div>
    )
}

export default SurfsCollection;

