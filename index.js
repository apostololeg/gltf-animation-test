'use strict';

var MESH_DATA_PATH = '/models/monster.gltf';

var scene, canvas, renderer, camera;
var clock, mixer;
var weight = {
    rotate: 1,
    jump: 1
}

var timeoutID;    // for resize event.

function run() {
    init();
    load();
}

function init() {
    var ambient = new THREE.AmbientLight(0x7F7F7F);

    var directional = new THREE.DirectionalLight(0xFFFFFF, 1);
    directional.position.set(0, 1, 1).normalize();

    scene = new THREE.Scene();
    scene.add(ambient);
    scene.add(directional);

    canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setClearColor(0x00007F, 1);
    renderer.autoClear = false;

    var aspect = canvas.width / canvas.height;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(1, 0, 5);
    camera.up.set(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    clock = new THREE.Clock();
}

function load() {
    var loader = new THREE.LegacyGLTFLoader();
    loader.load(MESH_DATA_PATH, function(gltf) {
        const object = gltf.scene.getChildByName('Cube_0');

        scene.add(new THREE.Mesh(object));

        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach(animation => {
          console.log(animation);
          mixer
            .clipAction(animation, object)
            .play();
        });

        loop();
    }, function(progress) {
        console.log(progress)
    }, function(err) {
        console.log(err)
    });
}

function loop() {
    window.requestAnimationFrame(loop);

    var delta = clock.getDelta();

    renderer.clear();

    var width = canvas.width / 3;

    mixer.clipAction('rotate').setEffectiveWeight(weight.rotate);
    mixer.clipAction('jump').setEffectiveWeight(weight.jump);

    mixer.update(delta);

    renderer.setViewport(line.x * width, 0, width, canvas.height);
    renderer.render(scene, camera);
}

function handleWeightchange(e) {
    weight[e.target.id] = parseFloat(e.target.value);
}

window.addEventListener('load', run);
