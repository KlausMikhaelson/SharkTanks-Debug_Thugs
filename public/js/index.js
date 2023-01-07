const socket = io();
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
const canvas3d = $('#canvas-3d')[0];

const renderer = new THREE.WebGLRenderer({canvas: canvas3d, antialias: true});
renderer.setClearColor('skyblue');
renderer.shadowMap.enabled = true;

camera.position.set(1000, 300, 1000);
camera.lookAt(floorMesh.position);

const bulletMaterial = new THREE.MeshLambertMaterial( { color: 0x808080 } );
const wallMaterial = new THREE.MeshLambertMaterial( { color: 'firebrick' } );
const playerMaterial = new THREE.MeshLambertMaterial({});
const textMaterial = new THREE.MeshBasicMaterial({ color: 0xf39800, side: THREE.DoubleSide });
const nicknameMaterial = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide });

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera);
}

animate();

function gameStart() {
    const name = $("#player_name").val();
    socket.emit('game-start', {name: name});
    $("#start-screen").hide();
}
$("#start-button").on('click', gameStart);