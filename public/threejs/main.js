let scene, camera, render;

console.log("main opened");

function init() {
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x748385);

    camera = new THREE.PerspectiveCamera(0.12, window.innerWidth / window.innerHeight, 1, 5000); 
    camera.rotation.y = 90 / 180*Math.PI;
    camera.position.x = 500;
    camera.position.y = 0;
    camera.position.z = 1000;

    hlight = new THREE.AmbientLight(0xffffff, 1.0);
    hlight.castShadow = true;
    scene.add(hlight);

    lightFromBottom = new THREE.DirectionalLight(0xffffff, 1);
    lightFromBottom.position.set(0,-500,0);
    lightFromBottom.castShadow = true;
    scene.add(lightFromBottom);
    
    lightFromTop = new THREE.DirectionalLight(0xffffff, 1);
    lightFromTop.position.set(0, 500,0);
    lightFromTop.castShadow = true;
    scene.add(lightFromTop);

    conicLightFromFront = new THREE.PointLight(0xffffff, 4);
    conicLightFromFront.position.set(-1000, 0,0);
    conicLightFromFront.castShadow = true;
    scene.add(conicLightFromFront);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();
    
    document.body.appendChild(renderer.domElement);

    let loader = new THREE.GLTFLoader();
    
    loader.load('/surf.gltf', (gltf) => {
        surf = gltf.scene;
        surf.traverse((object) => {
            if (object.isMesh) object.material = new THREE.MeshLambertMaterial({color: 0x4ac5d4});
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
