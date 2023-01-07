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

let movement = {};

$(document).on('keydown keyup', (event) => {
    const KeyToCommand = {
        'ArrowUp': 'forward',
        'ArrowDown': 'back',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
    };
    const command = KeyToCommand[event.key];
    if(command) {
        if(event.type === "keydown") {
            movement[command] = true;
        } else {
            movement[command] = false;
        }
        socket.emit('movement', movement);
    }
    if(event.key === ' ' && event.type === "keydown") {
        socket.emit('shoot');
    }
})


const Meshes = [];
socket.on('state', (players, bullets, walls) => {
    Object.values(Meshes).forEach((mesh) => {mesh.used = false;});
    
    // Players
    Object.values(players).forEach((player) => {
        let playerMesh = Meshes[player.id];
        if(!playerMesh){
            console.log('create player mesh');
            playerMesh = new THREE.Group();
    		playerMesh.castShadow = true;
    		Meshes[player.id] = playerMesh;
    		scene.add(playerMesh);
        }
        playerMesh.used = true;
        playerMesh.position.set(player.x + player.width/2, player.width/2, player.y + player.height/2);
		playerMesh.rotation.y = - player.angle;
        
        if(!playerMesh.getObjectByName('body')){
            console.log('create body mesh');
    		mesh = new THREE.Mesh(new THREE.BoxGeometry(player.width, player.width, player.height), playerMaterial);
    		mesh.castShadow = true;
    		mesh.name = 'body';
    		playerMesh.add(mesh);
        }


            if(!playerMesh.getObjectByName('nickname')){
                console.log('create nickname mesh');
                var mesh = new THREE.Mesh(
                    new THREE.TextGeometry(player.nickname,
                        {size: 10, height: 1}),
                        nicknameMaterial,
                );
                mesh.name = 'nickname';
                playerMesh.add(mesh);

                mesh.position.set(0, 70, 0);
                mesh.rotation.y = Math.PI/2;
            }
            {
                let mesh = playerMesh.getObjectByName('health');

                if(mesh && mesh.health !== player.health){
                    playerMesh.remove(mesh);
                    mesh.geometry.dispose();
                    mesh = null;
                }
                if(!mesh){
                    console.log('create health mesh');
                    mesh = new THREE.Mesh(
                        new THREE.TextGeometry('*'.repeat(player.health),
                            {size: 10, height: 1}),
                            textMaterial,
                    );
                    mesh.name = 'health';
                    mesh.health = player.health;
                    playerMesh.add(mesh);
                }
                mesh.position.set(0, 50, 0);
                mesh.rotation.y = Math.PI/2;
            }
        
        
        if(player.socketId === socket.id){
            // camera position
			camera.position.set(
			    player.x + player.width/2 - 150 * Math.cos(player.angle),
			    200,
                player.y + player.height/2 - 150 * Math.sin(player.angle)
            );
			camera.rotation.set(0, - player.angle - Math.PI/2, 0);
			
        }
    });
    
    // Bullets
    Object.values(bullets).forEach((bullet) => {
        let mesh = Meshes[bullet.id];
        if(!mesh){
            mesh = new THREE.Mesh(new THREE.SphereGeometry(10,10), bulletMaterial);
		    mesh.castShadow = true;
    		Meshes[bullet.id] = mesh;
		    // Meshes.push(mesh);
		    scene.add(mesh);
        }
        mesh.used = true;
        mesh.position.set(bullet.x + bullet.width/2, 80, bullet.y + bullet.height/2);
    });
    
    // Walls
    Object.values(walls).forEach((wall) => {
        let mesh = Meshes[wall.id];
        if(!mesh){
    		mesh = new THREE.Mesh(new THREE.BoxGeometry(wall.width, 100, 1000), wallMaterial);
    		mesh.castShadow = true;
    		Meshes.push(mesh);
    		Meshes[wall.id] = mesh;
    		scene.add(mesh);
        }
        mesh.used = true;
        mesh.position.set(wall.x + wall.width/2, 50, wall.y + wall.height/2);
    });
    // Clear unused Meshes
    Object.keys(Meshes).forEach((key) => {
        const mesh = Meshes[key];
        if(!mesh.used){
            console.log('removing mesh', key);
            scene.remove(mesh);
            mesh.traverse((mesh2) => {
                if(mesh2.geometry){
                    mesh2.geometry.dispose();
                }
            });
            delete Meshes[key];
        }
    });
});

socket.on('dead', () => {
    $("#start-screen").show();
});
