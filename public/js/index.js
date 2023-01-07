const socket = io('ws://localhost:3001');
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
const canvasMap = $('#canvas')[0];

const renderer = new THREE.WebGLRenderer({canvas: canvasMap});
renderer.setClearColor('hotpink');
renderer.shadowMap.enabled = true;


camera.position.set(10000, 300, 1000);
// controls.update();
camera.lookAt(floorMesh.position);
