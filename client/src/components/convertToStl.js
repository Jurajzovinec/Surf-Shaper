import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { createAsset } from "use-asset";

import * as THREE from 'three';

const convertToStl = (gltfData) => {

    let model, scene, loader;
    scene = new THREE.Scene();

    loader = new GLTFLoader();
    
    loader.parse(JSON.stringify(gltfData),
        '',
        (gltf) => { model = gltf.scene; scene.add(model); console.log(gltf); },
        true);
    console.log(scene);
    const stl = new STLExporter().parse(scene);
    console.log(stl);
    console.log(typeof(stl));
};


export default convertToStl;

