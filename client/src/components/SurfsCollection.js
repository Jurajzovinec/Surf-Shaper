import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from 'react-three-fiber';
import { softShadows, OrbitControls, Html } from 'drei';
import SurfComponent from './SurfComponent';

import { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import { useSpring, animated } from 'react-spring/three';

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
    console.log('Props positions are', props.positions);
    const [shift, setShifted] = useState(false);
    const [firstPos, setFirstPos] = useState(()=>{
        console.log('collectionInit');
        return [[0,0,0], props.positions[0]];
    });
    
      
    //const [secondPos, setSecondPos] = useState([0,0,0], props.positions[1]);
    //const [thirdPos, setThirdPos] = useState([0,0,0], props.positions[2]);
    function lookForUndefined(array) { array.every((val)=> val!==undefined); } 

    useEffect(() => {
        console.log('Use effect runs...');
        console.log(firstPos);
        lookForUndefined(firstPos) ? setFirstPos(prevPosition =>  [props.positions[0], prevPosition[0]]) : console.log('Some of the values is undefined.');
        //setFirstPos(prevPosition =>  [props.positions[0], prevPosition[0]]);
        //setSecondPos(props.positions[1]);
        //setThirdPos(props.positions[2]);
        return () => {
            console.log('return from resourse set');
        }
    }, [props.positions[0], props.positions[1], props.positions[2]]);

    console.log('first position is', firstPos);


    return (
        <div className="canvas">
            <Canvas colorManagement shadowMap camera={{ position: [0, 2, 10], fov: 60 }}>
                <Lights />
                <Suspense fallback={null}>
                    <SurfComponent position={props.positions[2]} />
                    <SurfComponent position={props.positions[1]} />
                </Suspense>
                <OrbitControls enablePan={false} target={[0, 1, 0]} />
            </Canvas>
        </div>
    )
}

export default SurfsCollection;

