const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 100, 2, 0.5, 20000 );

// Floor
const floorGeometry = new THREE.BoxGeometry(5000, 1,5000);
const floorMaterial = new THREE.MeshStandardMaterial({color: 0x404040});
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
// floorMesh.position.set(500, 0, 500);
floorMesh.receiveShadow = true;
scene.add(floorMesh);