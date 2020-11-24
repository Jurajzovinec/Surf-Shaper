let scene, camera, render; 

function init() {
    
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(0.12, window.innerWidth / window.innerHeight, 100, 5000); 
    camera.rotation.y = 270 / 180*Math.PI;
    camera.position.x = 500;
    camera.position.y = 0;
    camera.position.z = 1000;

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.antialias = true;
    renderer.setSize(window.innerWidth, window.innerHeight);

    light = new THREE.AmbientLight(0xdad2d0, 0.1);
    light.castShadow = true;
    scene.add(light);

/*  hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x0808dd, 1);
    scene.add(hemisphereLight); */
    
    spotLight = new THREE.SpotLight( 0xffffff, 1.0, 10000 );
    spotLight.position.set( 1000, 1000, 1000 );    
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 500;
    spotLight.shadow.mapSize.height = 500;
    spotLight.shadow.camera.near = 0;
    spotLight.shadow.camera.far = 0;
    spotLight.shadow.camera.fov = 30;
    scene.add( spotLight );
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();
    
    document.body.appendChild(renderer.domElement);

    let loader = new THREE.GLTFLoader();
    loader.load('/surf.gltf', (gltf) => {
        surf = gltf.scene;
        surf.traverse((object) => {
            if (object.isMesh) object.material = new THREE.MeshPhongMaterial({

                color: 0x2194ce, 
                shininess: 1,
                wireframe: false, 
                emissive: 0x0,
                envMaps: "reflection",
                specular: 0xffffff,
                combine: THREE.MultiplyOperation,
                reflectivity: 1,
                refractionRatio: 1});
        });
        scene.add(surf);
    });
        
}

function animate() {
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
  }

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
 }
 
window.addEventListener('resize', onWindowResize, false);
init();
animate();
