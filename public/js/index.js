const socket = io();
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
const canvas3d = $('#canvas-3d')[0];

const renderer = new THREE.WebGLRenderer({canvas: canvas3d, antialias: true});
renderer.setClearColor('skyblue');
renderer.shadowMap.enabled = true;

camera.position.set(10000, 300, 1000);
camera.lookAt(floorMesh.position);
