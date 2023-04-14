const socket = io();
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
const canvas3d = $('#canvas-3d')[0];

const renderer = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true });
renderer.setClearColor('skyblue');
renderer.shadowMap.enabled = true;

camera.position.set(1000, 300, 1000);
camera.lookAt(floorMesh.position);
const listener = new THREE.AudioListener();
camera.add(listener);
const audioLoader = new THREE.AudioLoader();

const mySound = new THREE.Audio(listener);
audioLoader.load("../assets/firing2.mp3", function (buffer) {
    mySound.setBuffer(buffer)
    mySound.setVolume(0.4)
})

const backMusic = new THREE.Audio(listener)
audioLoader.load("../assets/background.mp3", function (buffer) {
    backMusic.setBuffer(buffer)
    backMusic.setVolume(0.2)
})

window.onload = function () {
    $("#preloader").hide();
}

const textureLoader = new THREE.TextureLoader();
const playerTexture2 = textureLoader.load("../assets/tank2.png")
const playerTexture = textureLoader.load("../assets/front.jpg")
const playerTexture1 = textureLoader.load("../assets/bottom.jpg")
const playerTexture3 = textureLoader.load("../assets/tires.png")
const playerTexture4 = textureLoader.load("../assets/tires2.png")
const playerTexture5 = textureLoader.load("../assets/back.jpg")

const wallTexture = textureLoader.load("../assets/walls.jpg")

const bulletTexture = textureLoader.load("../assets/bullets.jpg")

const bulletMaterial = new THREE.MeshLambertMaterial({ map: bulletTexture });
const wallMaterial = new THREE.MeshLambertMaterial({ map: wallTexture });
const playerMaterial = [
    new THREE.MeshLambertMaterial({ map: playerTexture1, color: 0x404040 }),
    new THREE.MeshLambertMaterial({ map: playerTexture5, color: 0x404040 }),
    new THREE.MeshLambertMaterial({ map: playerTexture2 }),
    new THREE.MeshLambertMaterial({ map: playerTexture, color: 0x404040 }),
    new THREE.MeshLambertMaterial({ map: playerTexture3, color: 0x404040 }),
    new THREE.MeshLambertMaterial({ map: playerTexture4, color: 0x404040 }),
]
const textMaterial = new THREE.MeshBasicMaterial({ color: 0x85bb65, side: THREE.DoubleSide });
const nicknameMaterial = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide });


const loader = new THREE.FontLoader();
let font;
loader.load('fonts/helvetiker_regular.typeface.json', function (font_) {
    font = font_;
});

const loader_map = new THREE.CubeTextureLoader();
const texture = loader_map.load([
    '../assets/nx.png',
    '../assets/px.png',
    '../assets/py1.png',
    '../assets/ny.png',
    '../assets/nz.png',
    '../assets/pz.png',
]);
scene.background = texture;

function animate() {
    setTimeout(function () {
        requestAnimationFrame(animate)
        renderer.render(scene, camera);
    }, 1000 / 20)
}

animate();

function gameStart() {
    const nickname = $("#nickname").val().trim();
    if (nickname === "") {
        alert("Please enter your name first")
    } else if (nickname.length > 10) {
        alert("Please enter name within 10 characters")
    } else {
        socket.emit('game-start', { nickname: nickname });
        $("#start-screen").hide();
        if (localStorage.getItem("nickname") === null) {
            $("#myModal").show();
        }
        $("#canvas-3d").show();
        const tryingsomething = localStorage.setItem("nickname", nickname)
        backMusic.play();

        // console.log(playerName);
        // const stats = document.getElementById("nameOfplayers")
        // const nameOfplayer = document.createElement("p")
        // nameOfplayer.innerHTML = nickname + " just joined the game"
        // stats.append(nameOfplayer)
    }
}

socket.on("joiningList", (joinList) => {
    const stats = document.getElementById("nameOfplayers")
    const nameOfplayer = document.createElement("p")
    nameOfplayer.innerHTML = joinList + " joined the game"
    stats.append(nameOfplayer)
})

socket.on("updatedPlayerList", (updatedPlayers) => {
    console.log(updatedPlayers)
    const stats = document.getElementById("nameOfplayers")
    const nameOfplayer = document.createElement("p")
    nameOfplayer.innerHTML = updatedPlayers + " died"
    stats.append(nameOfplayer)
})

const btn = $(".close")[0];
btn.onclick = function () {
    $("#myModal").hide();
}

const modal = $("#myModal")

window.onclick = function (event) {
    if (event.target == modal) {
        $("#myModal").hide();
    }
}

$("#start-button").on('click', gameStart);

let movement = {};

$("#right").on('touchstart touchend', (touch) => {
    const command = 'right'
    if (command) {
        if (touch.type === "touchstart") {
            movement[command] = true;
            // console.log(command)
        } else if (touch.type === "touchend") {
            movement[command] = false;
        }
        socket.emit('movement', movement);
    }
})

$("#left").on('touchstart touchend', (touch) => {
    const command = 'left'
    if (command) {
        if (touch.type === 'touchstart') {
            movement[command] = true;
            // console.log(command)
        } else if (touch.type === 'touchend') {
            movement[command] = false;
        }
        socket.emit('movement', movement);
    }
})

$("#forward").on('touchstart touchend', (touch) => {
    const command = 'forward'
    if (command) {
        if (touch.type === "touchstart") {
            movement[command] = true;
            // console.log(command)
        } else if (touch.type === "touchend") {
            movement[command] = false;
        }
        socket.emit('movement', movement);
    }
})

$("#backward").on('touchstart touchend', (touch) => {
    const command = 'back'
    if (command) {
        if (touch.type === "touchstart") {
            movement[command] = true;
            // console.log(command)
        } else if (touch.type === "touchend") {
            movement[command] = false;
        }
        socket.emit('movement', movement);
    }
})
$("#shoot").on('touchstart touchend', (touch) => {
    // const command = 'left'
    if (touch.type === 'touchstart') {
        socket.emit('shoot');
        mySound.play();
    }
})




$(document).on('keydown keyup', (event) => {
    const KeyToCommand = {
        'ArrowUp': 'forward',
        'ArrowDown': 'back',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'w': 'forward',
        's': 'back',
        'a': 'left',
        'd': 'right',
        'W': 'forward',
        'S': 'back',
        'A': 'left',
        'D': 'right'
    };
    const command = KeyToCommand[event.key];
    // console.log(event.key)
    if (command) {
        if (event.type === "keydown") {
            movement[command] = true;
        } else {
            movement[command] = false;
        }
        socket.emit('movement', movement);
    }
    if ((event.key === ' ' || event.key === "x" || event.key === "X") && event.type === "keydown") {
        socket.emit('shoot');
        mySound.play();
    }
})

socket.on("updatedUserlist", (users) => {
    console.log(users);
    const userLists = document.getElementById("userList")
    userLists.innerText = "Active players:" + users;
})

// var playerNames = [];

const Meshes = [];
socket.on('state', (players, bullets, walls) => {
    Object.values(Meshes).forEach((mesh) => { mesh.used = false; });

    // Players
    Object.values(players).forEach((player) => {
        let playerMesh = Meshes[player.id];
        if (!playerMesh) {
            // console.log('create player mesh');
            playerMesh = new THREE.Group();
            playerMesh.castShadow = true;
            Meshes[player.id] = playerMesh;
            scene.add(playerMesh);
        }
        playerMesh.used = true;
        playerMesh.position.set(player.x + player.width / 2, player.width / 2, player.y + player.height / 2);
        playerMesh.rotation.y = - player.angle;

        if (!playerMesh.getObjectByName('body')) {
            // console.log('create body mesh');
            // const playerModel = new GLTFLoader;
            // playerModel.load(
            //     "../models/tank2.glb",
            //     function (gltf) {
            //         console.log(gltf.scene);
            //         gltf.scene.scale.set(30, 30, 30);
            //         playerMesh.add(gltf.scene)
            //     },
            //     undefined,
            //     function (error) {
            //         console.error(error);
            //     },
            //     );
            mesh = new THREE.Mesh(new THREE.BoxGeometry(player.width, player.width, player.height), playerMaterial);
            // mesh = new THREE.Mesh(new this.model)
            mesh.castShadow = true;
            mesh.name = 'body';
            playerMesh.add(mesh);
        }


        if (font) {
            if (!playerMesh.getObjectByName('nickname')) {
                var mesh = new THREE.Mesh(
                    new THREE.TextGeometry(player.nickname,
                        { font: font, size: 10, height: 1 }),
                    nicknameMaterial,
                );
                // playerNames.push(player.nickname);
                // console.log(playerNames)
                mesh.name = 'nickname';
                playerMesh.add(mesh);

                mesh.position.set(0, 70, 0);
                mesh.rotation.y = Math.PI / 2;
            }
            {
                let mesh = playerMesh.getObjectByName('health');

                if (mesh && mesh.health !== player.health) {
                    playerMesh.remove(mesh);
                    mesh.geometry.dispose();
                    mesh = null;
                }
                if (!mesh) {
                    // console.log('create health mesh');
                    mesh = new THREE.Mesh(
                        new THREE.TextGeometry('$'.repeat(player.health),
                            { font: font, size: 10, height: 2 }),
                        textMaterial,
                    );
                    mesh.name = 'health';
                    mesh.health = player.health;
                    playerMesh.add(mesh);
                }
                mesh.position.set(0, 50, 0);
                mesh.rotation.y = Math.PI / 2;
            }
        }


        if (player.socketId === socket.id) {
            // camera position
            // console.log(player.point)
            $("#score")[0].innerText = "Your Score: " + player.point;


            // this.context2D_.canvas.fillText(player.point, 128, 64)



            camera.position.set(
                player.x + player.width / 2 - 150 * Math.cos(player.angle),
                200,
                player.y + player.height / 2 - 150 * Math.sin(player.angle)
            );
            camera.rotation.set(0, - player.angle - Math.PI / 2, 0);
            // if(player.socketId === socket.id){
            //     context.save();
            //     context.font = '30px Bold Arial';
            //     context.fillText('You', player.x, player.y - 20);
            //     context.fillText(player.point + ' point', 20, 40);
            //     context.restore();
            // }

        }
    });

    // Bullets
    Object.values(bullets).forEach((bullet) => {
        let mesh = Meshes[bullet.id];
        if (!mesh) {
            mesh = new THREE.Mesh(new THREE.SphereGeometry(10, 10), bulletMaterial);
            mesh.castShadow = true;
            Meshes[bullet.id] = mesh;
            // Meshes.push(mesh);
            scene.add(mesh);
        }
        mesh.used = true;
        mesh.position.set(bullet.x + bullet.width / 2, 80, bullet.y + bullet.height / 2);
    });

    // Walls
    // Object.values(walls).forEach((wall) => {
    //     let mesh = Meshes[wall.id];
    //     if (!mesh) {
    //         mesh = new THREE.Mesh(new THREE.BoxGeometry(wall.width, 200, 1000), wallMaterial);
    //         mesh.castShadow = true;
    //         Meshes.push(mesh);
    //         Meshes[wall.id] = mesh;
    //         scene.add(mesh);
    //     }
    //     mesh.used = true;
    //     mesh.position.set(wall.x + wall.width / 2, 50, wall.y + wall.height / 2);
    // });

    let mesh = Meshes[Math.floor(Math.random() * 10000)]
    mesh = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 1000), wallMaterial);
    mesh.castShadow = true;
    Meshes.push(mesh);
    Meshes[Math.floor(Math.random() * 10000)] = mesh;
    scene.add(mesh);
    mesh.used = true;
    mesh.position.set(200 / 2, 50, 2 + 1000 / 2);

    let mesh2 = Meshes[Math.floor(Math.random() * 10000)]
    mesh2 = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 1000), wallMaterial);
    mesh2.castShadow = true;
    Meshes.push(mesh2);
    Meshes[Math.floor(Math.random() * 10000)] = mesh2;
    scene.add(mesh2);
    mesh2.used = true;
    mesh2.position.set(1000 + 200 / 2, 50, 100 + 1000 / 2);

    let mesh3 = Meshes[Math.floor(Math.random() * 10000)]
    mesh3 = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 1000), wallMaterial);
    mesh3.castShadow = true;
    Meshes.push(mesh3);
    Meshes[Math.floor(Math.random() * 10000)] = mesh3;
    scene.add(mesh3);
    mesh3.used = true;
    mesh3.position.set(2000 + 200 / 2, 50, 1000 + 1000 / 2);

    // gotta check it
    let mesh4 = Meshes[Math.floor(Math.random() * 10000)]
    mesh4 = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 1000), wallMaterial);
    mesh4.castShadow = true;
    Meshes.push(mesh4);
    Meshes[Math.floor(Math.random() * 10000)] = mesh4;
    scene.add(mesh4);
    mesh4.used = true;
    mesh4.position.set(-1000 + 200 / 2, 50, -1000 + 1000 / 2);

    let mesh6 = Meshes[Math.floor(Math.random() * 10000)]
    mesh6 = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 1000), wallMaterial);
    mesh6.castShadow = true;
    Meshes.push(mesh6);
    Meshes[Math.floor(Math.random() * 10000)] = mesh6;
    scene.add(mesh6);
    mesh6.used = true;
    mesh6.position.set(-1500 + 200 / 2, 50, 700 + 1000 / 2);




    // Clear unused Meshes
    Object.keys(Meshes).forEach((key) => {
        const mesh = Meshes[key];
        if (!mesh.used) {
            // console.log('removing mesh', key);
            scene.remove(mesh);
            mesh.traverse((mesh2) => {
                if (mesh2.geometry) {
                    mesh2.geometry.dispose();
                }
            });
            delete Meshes[key];
        }
    });
});


const msgbar = document.getElementById("userList")
msgbar.scrollTop = msgbar.scrollHeight;
socket.on('dead', () => {
    $("#start-screen").show();
    $("#canvas-3d").hide();
    $("myModal").hide();
});
