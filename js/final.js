var renderer;
var camera;
var spotlight;
var scene;

var mouse = new THREE.Vector2();
var selectedobject = undefined;

var raycaster = new THREE.Raycaster();

var hit1, hit2, hit3;
var tie1, tie2;
var enemyhurt1, enemyhurt2;
var lose;
var remove;
var select;
var totalvictory;
var pushit;
function loadSounds(){
    hit1 = new Audio("sounds/hit1.mp3");
    hit1.volume = .7;
    hit2 = new Audio("sounds/hit2.mp3");
    hit2.volume = .7;
    hit3 = new Audio("sounds/hit3.mp3");

    tie1 = new Audio("sounds/tie1.mp3");
    tie1.volume = .7;
    tie2 = new Audio("sounds/tie2.mp3");
    tie2.volume = .7;

    enemyhurt1 = new Audio("sounds/enemyhurt1.mp3");
    enemyhurt1.volume = .7;
    enemyhurt2 = new Audio("sounds/enemyhurt2.mp3");
    enemyhurt2.volume = .7;

    lose = new Audio("sounds/lose.mp3");
    lose.volume = .7;

    remove = new Audio("sounds/remove.mp3");
    remove.volume = .7;

    select = new Audio("sounds/select.mp3");
    select.volume = .9;

    appear = new Audio("sounds/appear.mp3");
    appear.volume = .7;

    totalvictory = new Audio("sounds/totalvictory.mp3");
    totalvictory.volume = .7;

    pushit = new Audio("sounds/PushIt.mp3");
    pushit.volume = .3;
    pushit.loop = true;
    pushit.play();
}

function init() {
    scene = new THREE.Scene();

    addRenderer();
    addCamera();
    addSpotlight();

    loadSounds();

    createDojo();
    createMat();
    createBackingText();
    createRobots();

    document.body.appendChild(renderer.domElement);

    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);

    window.addEventListener('resize', onResize, false);

    render();
}

var timer = 0;
function render() {
    selectRobot();
    declareFight();

    defeatRobots();

    handleFinalRobot();

    reset();
    checkMusic();

    timer += 0.075;
    uniforms.time.value = timer;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

var canreset = false;
function reset() {
    if(Key.isDown(Key.R)){
        if(canreset){
            if(robot1 !== null){
                scene.remove(robot1);
                robot1 = null;
            }
            if(robot2 !== null){
                scene.remove(robot2);
                robot2 = null;            
            }
            if(robot3 !== null){
                scene.remove(robot3);
                robot3 = null;
            }
            if(robot4 !== null){
                scene.remove(robot4);
                robot4 = null;
            }
            if(robot5 !== null){
                scene.remove(robot5);
                robot5 = null;
            }

            for(var i = 0; i < robots.length; i++){
                scene.remove(robots[i]);
                robots[i] = null;
            }

            alldefeated = false;
            finalcheck = true;
            selectedobject = undefined;

            robot1defeated = false;
            robot2defeated = false;
            robot3defeated = false;
            robot4defeated = false;
            robot5defeated = false;

            currentscore = 0;
            updateScore();

            robots = [];

            createRobots();


            camera.position.set(0, -4.5, 2);
            camera.lookAt(scene.position);
            camera.updateProjectionMatrix();

            canreset = false;
            canfight = false;

            document.querySelector('#opponent').innerHTML = "Select an Opponent";
            document.querySelector('#playermove').innerHTML = "";
            document.querySelector('#opponentmove').innerHTML = "";
            document.querySelector('#result').innerHTML = "Put up a good fight!";
            document.querySelector('#final').innerHTML = "4";
        }
    }
}

var musicplaying = true;
function checkMusic()
{
    if(Key.isDown(Key.M)){
        if(musicplaying){
            pushit.pause();
            musicplaying = false;
        }
        else{
            pushit.play();
            musicplaying = true;
        }

    }
}

function declareFight(){
    if(Key.isDown(Key.A)){
        fightingFun("punch");
    }
    if(Key.isDown(Key.W)){
        fightingFun("kick");
    }
    if(Key.isDown(Key.D)){
        fightingFun("block");
    }
}

function selectRobot() {
    if(Key.isDown(Key._1)){
        if(robot1 !== null){
            selectedobject = robot1;
            updateRobotCamera();
            canreset = true;
            canfight = true;
            select.play();

            document.querySelector('#opponent').innerHTML = "WHITE BELT";
            document.querySelector('#playermove').innerHTML = "";
            document.querySelector('#opponentmove').innerHTML = "";
            document.querySelector('#result').innerHTML = "Put up a good fight!";
        }
    }
    if(Key.isDown(Key._2)){
        if(robot2 !== null){
            selectedobject = robot2;
            updateRobotCamera();
            canreset = true;
            canfight = true;
            select.play();

            document.querySelector('#opponent').innerHTML = "BLUE BELT";
            document.querySelector('#playermove').innerHTML = "";
            document.querySelector('#opponentmove').innerHTML = "";
            document.querySelector('#result').innerHTML = "Put up a good fight!";
        }
    }
    if(Key.isDown(Key._3)){
        if(robot3 !== null){
            selectedobject = robot3;
            updateRobotCamera();
            canreset = true;
            canfight = true;
            select.play();

            document.querySelector('#opponent').innerHTML = "RED BELT";
            document.querySelector('#playermove').innerHTML = "";
            document.querySelector('#opponentmove').innerHTML = "";
            document.querySelector('#result').innerHTML = "Put up a good fight!";
        }
    }
    if(Key.isDown(Key._4)){
        if(robot4 !== null){
            selectedobject = robot4;
            updateRobotCamera();
            canreset = true;
            canfight = true;
            select.play();

            document.querySelector('#opponent').innerHTML = "BLACK BELT";
            document.querySelector('#playermove').innerHTML = "";
            document.querySelector('#opponentmove').innerHTML = "";
            document.querySelector('#result').innerHTML = "Put up a good fight!";
        }
    }
    if(Key.isDown(Key._5)){
        if(robot5 !== null){
            selectedobject = robot5;
            updateRobotCamera();
            canreset = true;
            canfight = true;
            select.play();

            document.querySelector('#opponent').innerHTML = "GRANDMASTER";
            document.querySelector('#playermove').innerHTML = "";
            document.querySelector('#opponentmove').innerHTML = "";
            document.querySelector('#result').innerHTML = "Put up a good fight!";
        }
    }
}

var cameradist = -2.75, cameraheight = 2;
function updateRobotCamera() {
    camera.position.x = selectedobject.position.x;
    camera.position.y = selectedobject.position.y + cameradist;
    camera.position.z = selectedobject.position.z + cameraheight;

    var cameravector = new THREE.Vector3(selectedobject.position.x, selectedobject.position.y, selectedobject.position.z + 1);
    camera.lookAt(cameravector);
    camera.updateProjectionMatrix();
}

var robot1defeated = false, robot2defeated = false, robot3defeated = false, robot4defeated = false, robot5defeated = false;
function defeatRobots(){
    if(robot1defeated){
        robot1.position.y += 0.0075;
        robot1.position.z += 0.0075;
        robot1.rotation.x -= (Math.PI/180)*0.75;
    
        setTimeout(function() {
            scene.remove(robot1);
            robot1 = null;
            robot1defeated = false;
            remove.play();

            checkDefeated();
        }, 750);
    }
    if(robot2defeated){
        robot2.position.y += 0.0075;
        robot2.position.z += 0.0075;
        robot2.rotation.x -= (Math.PI/180)*0.75;
    
        setTimeout(function() {
            scene.remove(robot2);
            robot2 = null;
            robot2defeated = false;
            remove.play();

            checkDefeated();
        }, 750);
    }
    if(robot3defeated){
        robot3.position.y += 0.0075;
        robot3.position.z += 0.0075;
        robot3.rotation.x -= (Math.PI/180)*0.75;
    
        setTimeout(function() {
            scene.remove(robot3);
            robot3 = null;
            robot3defeated = false;
            remove.play();

            checkDefeated();
        }, 750);
    }
    if(robot4defeated){
        robot4.position.y += 0.0075;
        robot4.position.z += 0.0075;
        robot4.rotation.x -= (Math.PI/180)*0.75;
    
        setTimeout(function() {
            scene.remove(robot4);
            robot4 = null;
            robot4defeated = false;
            remove.play();

            checkDefeated();
        }, 750);
    }
    if(robot5defeated){
        robot5.position.y += 0.0075;
        robot5.position.z += 0.0075;
        robot5.rotation.x -= (Math.PI/180)*0.75;
    
        setTimeout(function() {
            scene.remove(robot5);
            robot5 = null;
            robot5defeated = false;
            remove.play();

            totalvictory.play();
        }, 750);
    }
}

var alldefeated = false;
function handleFinalRobot(){
    if(alldefeated){
        alldefeated = false;
        createFinalRobot();
        appear.play();

        document.querySelector('#final').innerHTML = 5;
    }
}

var finalcheck = true;
function checkDefeated() {
    if(robot1 == null && robot2 == null && robot3 == null && robot4 == null && finalcheck){
        alldefeated = true;
        finalcheck = false;
    }
}

function onResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function addRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
}

function addCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, -4.5, 2);
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(scene.position);
}

function addSpotlight() {
    spotlight = new THREE.SpotLight(0xffffff, 0.75);
    spotlight.position.set(0, -30, 500);
    spotlight.angle = 1.05;
    spotlight.distance = 1000;
    spotlight.penumbra = 0;
    spotlight.decay = 0.5;
    spotlight.shadow.camera.visible = true;
    spotlight.shadow.camera.near = 10;
    spotlight.shadow.camera.far = 1000;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    spotlight.shadow.camera.right = 10;
    spotlight.shadow.camera.left = -10;
    spotlight.shadow.camera.top = 5;
    spotlight.shadow.camera.bottom = -5;

    spotlight.castShadow = true;
    scene.add(spotlight);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
}

var floorwidth = 8, floorlength = 4;
var floorz = -1.5;
function createDojo() {
    (new THREE.TextureLoader()).load('images/floor.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(16, 16);

        var floorGeometry = new THREE.PlaneGeometry(floorwidth, floorlength);
        var floorMaterial = new THREE.MeshLambertMaterial({map: texture});

        var floorPlane = new THREE.Mesh(floorGeometry, floorMaterial);
        floorPlane.position.set(0, 0, floorz);

        floorPlane.receiveShadow = true;
        
        scene.add(floorPlane);
    });

    (new THREE.TextureLoader()).load('images/wall.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(16, 16);

        var sideWallGeometry = new THREE.BoxGeometry(floorlength, 8, .05);
        var backWallGeometry = new THREE.BoxGeometry(floorwidth, floorlength * 2, .05);
        var wallMaterial = new THREE.MeshLambertMaterial({map: texture});

        var sideWall1 = new THREE.Mesh(sideWallGeometry, wallMaterial);
        sideWall1.rotation.z = -(Math.PI/2);
        sideWall1.rotation.y = -(Math.PI/2);
        sideWall1.position.set(-4, 0, floorz + 2);
        sideWall1.receiveShadow = true;

        scene.add(sideWall1);

        var sideWall2 = sideWall1.clone();
        sideWall2.position.set(4, 0, floorz + 2);
        sideWall2.receiveShadow = true;

        scene.add(sideWall2);

        var backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
        backWall.rotation.x = -(Math.PI/2);
        backWall.position.set(0, 2, floorz + 2);
        backWall.receiveShadow = true;

        scene.add(backWall);
    });
}

var planes = [];
function createMat() {
    (new THREE.TextureLoader()).load('images/mat.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(16, 16);

        var matGeometry = new THREE.PlaneGeometry(7.5, 3.5);
        var matMaterial = new THREE.MeshLambertMaterial({map: texture});

        var matPlane = new THREE.Mesh(matGeometry, matMaterial);

        matPlane.position.set(0, 0, floorz + .005);

        matPlane.name = "mat";
        planes.push(matPlane);

        scene.add(matPlane);
    });
}

function createBackingText() {
    (new THREE.TextureLoader()).load('images/scroll.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(14, 14);

        var scrollGeometry = new THREE.PlaneGeometry(6, 1.25);
        var scrollMaterial = new THREE.MeshLambertMaterial({map: texture});

        var scrollPlane = new THREE.Mesh(scrollGeometry, scrollMaterial);

        scrollPlane.rotation.x = (Math.PI/2);
        scrollPlane.position.set(0, 1.95, .85);

        scrollPlane.receiveShadow = true;
        scrollPlane.castShadow = true;

        scrollPlane.name = "scroll";
        planes.push(scrollPlane);

        scene.add(scrollPlane);
    });

    (new THREE.FontLoader()).load('fonts/Ninja Naruto_Regular.json', function (font) {
        var textGeometry = new THREE.TextGeometry("DOJO SHOWDOWN", {
            font: font,

            size: .475,
            height: .2,

            bevelEnabled: false
        });

        var textMaterial = new THREE.MeshLambertMaterial({color: 0xFF3D00});

        var backingText = new THREE.Mesh(textGeometry, textMaterial);
        backingText.scale.set(1, 1.35, 1);

        backingText.rotation.x = (Math.PI/2);
        backingText.position.set(-2.85, 1.9, .525);

        scene.add(backingText);
    });

}

var robot1 = null, robot2 = null, robot3 = null, robot4 = null;
var robots = [];
function createRobots() {

    (new THREE.ObjectLoader()).load('models/enemy-robot.json', function(obj) {
        var robotbase = obj;
        robotbase.scale.set(.010, .010, .010);

        robotbase.rotation.x = (Math.PI/2);
        robotbase.rotation.y = (Math.PI);

        var beltHoopGeometry = new THREE.TorusGeometry(.205, .045, 75, 75);
        var beltSphereGeometry = new THREE.SphereGeometry(.095 , 32, 32);
        var beltFlapGeometry = new THREE.BoxGeometry(.075, .35, .01);

        scene.add(robotbase);

        robot1 = new THREE.Object3D();
        robot1.add(robotbase);
        robot2 = robot1.clone();
        robot3 = robot1.clone();
        robot4 = robot1.clone();

        var belt1Material = new THREE.MeshLambertMaterial({color: 0xEEEEEE});

        var beltHoop1 = new THREE.Mesh(beltHoopGeometry, belt1Material);
        var beltSphere1 = new THREE.Mesh(beltSphereGeometry, belt1Material);
        var beltFlap1 = new THREE.Mesh(beltFlapGeometry, belt1Material);
        var beltFlap11 = beltFlap1.clone();
        
        beltHoop1.position.set(0, 0, .55);

        beltSphere1.position.set(0, -.175, .55);
        
        beltFlap1.rotation.x = (Math.PI/2);
        beltFlap1.rotation.z = (Math.PI/180)*20;
        beltFlap1.position.set(.035, -.175, .45);
        
        beltFlap11.rotation.x = (Math.PI/2);
        beltFlap11.rotation.z = -(Math.PI/180)*20;
        beltFlap11.position.set(-.035, -.175, .45);
        
        scene.add(beltHoop1);
        scene.add(beltSphere1);
        scene.add(beltFlap1);
        scene.add(beltFlap11);

        robot1.add(beltHoop1);
        robot1.add(beltSphere1);
        robot1.add(beltFlap1);
        robot1.add(beltFlap11);
        
        robot1.position.set(-2.75, 0, floorz);
        robot1.name = "Robot1";

        scene.add(robot1);

        var belt2Material = new THREE.MeshLambertMaterial({color: 0x0D47A1})

        var beltHoop2 = new THREE.Mesh(beltHoopGeometry, belt2Material);
        var beltSphere2 = new THREE.Mesh(beltSphereGeometry, belt2Material);
        var beltFlap2 = new THREE.Mesh(beltFlapGeometry, belt2Material);
        var beltFlap22 = beltFlap2.clone();

        beltHoop2.position.set(0, 0, .55);
        
        beltSphere2.position.set(0, -.175, .55);

        beltFlap2.rotation.x = (Math.PI/2);
        beltFlap2.rotation.z = (Math.PI/180)*20;
        beltFlap2.position.set(.035, -.175, .45);
        
        beltFlap22.rotation.x = (Math.PI/2);
        beltFlap22.rotation.z = -(Math.PI/180)*20;
        beltFlap22.position.set(-.035, -.175, .45);

        scene.add(beltHoop2);
        scene.add(beltSphere2);
        scene.add(beltFlap2);
        scene.add(beltFlap22);

        robot2.add(beltHoop2);
        robot2.add(beltSphere2);
        robot2.add(beltFlap2);
        robot2.add(beltFlap22);

        robot2.position.set(-1, 0, floorz);
        robot2.name = "Robot2";

        scene.add(robot2);

        var belt3Material = new THREE.MeshLambertMaterial({color: 0xB71C1C});

        var beltHoop3 = new THREE.Mesh(beltHoopGeometry, belt3Material);
        var beltSphere3 = new THREE.Mesh(beltSphereGeometry, belt3Material);
        var beltFlap3 = new THREE.Mesh(beltFlapGeometry, belt3Material);
        var beltFlap33 = beltFlap3.clone();

        beltHoop3.position.set(0, 0, .55);

        beltSphere3.position.set(0, -.175, .55);

        beltFlap3.rotation.x = (Math.PI/2);
        beltFlap3.rotation.z = (Math.PI/180)*20;
        beltFlap3.position.set(.035, -.175, .45);

        beltFlap33.rotation.x = (Math.PI/2);
        beltFlap33.rotation.z = -(Math.PI/180)*20;
        beltFlap33.position.set(-.035, -.175, .45);

        scene.add(beltHoop3);
        scene.add(beltSphere3);
        scene.add(beltFlap3);
        scene.add(beltFlap33);

        robot3.add(beltHoop3);
        robot3.add(beltSphere3);
        robot3.add(beltFlap3);
        robot3.add(beltFlap33);

        robot3.position.set(1, 0, floorz);
        robot3.name = "Robot3";

        scene.add(robot3);

        var belt4Material = new THREE.MeshLambertMaterial({color: 0x212121});

        var beltHoop4 = new THREE.Mesh(beltHoopGeometry, belt4Material);
        var beltSphere4 = new THREE.Mesh(beltSphereGeometry, belt4Material);
        var beltFlap4 = new THREE.Mesh(beltFlapGeometry, belt4Material);
        var beltFlap44 = beltFlap4.clone();

        beltHoop4.position.set(0, 0, .55);
        
        beltSphere4.position.set(0, -.175, .55);
        
        beltFlap4.rotation.x = (Math.PI / 2);
        beltFlap4.rotation.z = (Math.PI / 180) * 20;
        beltFlap4.position.set(.035, -.175, .45);

        beltFlap44.rotation.x = (Math.PI / 2);
        beltFlap44.rotation.z = -(Math.PI / 180) * 20;
        beltFlap44.position.set(-.035, -.175, .45);

        scene.add(beltHoop4);
        scene.add(beltSphere4);
        scene.add(beltFlap4);
        scene.add(beltFlap44);

        robot4.add(beltHoop4);
        robot4.add(beltSphere4);
        robot4.add(beltFlap4);
        robot4.add(beltFlap44);

        robot4.position.set(2.75, 0, floorz);
        robot4.name = "Robot4";
        
        scene.add(robot4);

        robots.push(robot1);
        robots.push(robot2);
        robots.push(robot3);
        robots.push(robot4);
    });
}

var robot5 = null;
function createFinalRobot() {
    (new THREE.ObjectLoader()).load('models/enemy-robot.json', function(obj) {
        var robotbase = obj;
        robotbase.scale.set(.010, .010, .010);

        robotbase.rotation.x = (Math.PI/2);
        robotbase.rotation.y = (Math.PI);

        var beltHoopGeometry = new THREE.TorusGeometry(.205, .045, 75, 75);
        var beltSphereGeometry = new THREE.SphereGeometry(.095 , 32, 32);
        var beltFlapGeometry = new THREE.BoxGeometry(.075, .35, .01);

        scene.add(robotbase);

        robot5 = new THREE.Object3D();
        robot5.add(robotbase);

        var belt5Material = createCustomShaderMaterial();

        var beltHoop5 = new THREE.Mesh(beltHoopGeometry, belt5Material);
        var beltSphere5 = new THREE.Mesh(beltSphereGeometry, belt5Material);
        var beltFlap5 = new THREE.Mesh(beltFlapGeometry, belt5Material);
        var beltFlap55 = beltFlap5.clone();
        
        beltHoop5.position.set(0, 0, .55);

        beltSphere5.position.set(0, -.175, .55);
        
        beltFlap5.rotation.x = (Math.PI/2);
        beltFlap5.rotation.z = (Math.PI/180)*20;
        beltFlap5.position.set(.035, -.175, .45);
        
        beltFlap55.rotation.x = (Math.PI/2);
        beltFlap55.rotation.z = -(Math.PI/180)*20;
        beltFlap55.position.set(-.035, -.175, .45);
        
        scene.add(beltHoop5);
        scene.add(beltSphere5);
        scene.add(beltFlap5);
        scene.add(beltFlap55);

        robot5.add(beltHoop5);
        robot5.add(beltSphere5);
        robot5.add(beltFlap5);
        robot5.add(beltFlap55);

        var moustacheMaterial = new THREE.MeshLambertMaterial({color: 0x3E2723});
        var moustacheGeometry = new THREE.BoxGeometry(.15, .075, .01);

        var moustache1 = new THREE.Mesh(moustacheGeometry, moustacheMaterial);
        var moustache2 = moustache1.clone();

        moustache1.rotation.x = (Math.PI/2);
        moustache1.rotation.z = -(Math.PI/180)*27.5;
        moustache1.position.set(-.08, -.255, 1.05);

        moustache2.rotation.x = (Math.PI/2);
        moustache2.rotation.z = (Math.PI/180)*27.5;
        moustache2.position.set(.08, -.255, 1.05);

        scene.add(moustache1);
        scene.add(moustache2);

        robot5.add(moustache1);
        robot5.add(moustache2);
        
        robot5.position.set(0, 0, floorz);
        robot5.scale.set(1.25, 1.25, 1.25);
        robot5.name = "Robot5";

        scene.add(robot5);

        robots.push(robot5);
    });
}

function loadShader(shader)
{
    return document.getElementById(shader).textContent;
}

function createCustomShaderMaterial()
{
    var vertex = loadShader("vertexShader");
    var fragment = loadShader("fragmentShader");

    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertex,
        fragmentShader: fragment
    });

    return shaderMaterial;
}

var uniforms = {
    time: {value: 1.0}
};

function onDocumentMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (selectedobject != null) {
        var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
        vector.unproject(camera);
        raycaster.set(camera.position, vector.sub(camera.position).normalize());
    }
}


var x, y, z;
function onDocumentMouseDown(event) {
    event.preventDefault();

    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    vector.unproject(camera);
    raycaster.set(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects(planes, true);
    if (intersects.length > 0) {
        var obj = intersects[0].object;

        selectedobject = obj;
    }
    else{
        selectedobject = undefined;
    }

}

function onDocumentMouseUp(event) {
    event.preventDefault();

    if (selectedobject !== undefined) {

        if(selectedobject.name == "scroll"){
            camera.position.x = selectedobject.position.x;
            camera.position.y = selectedobject.position.y - 4.5;
            camera.position.z = selectedobject.position.z;
    
            camera.lookAt(selectedobject.position);
            camera.updateProjectionMatrix();
        }
        else if(selectedobject.name == "mat"){
            camera.position.x = selectedobject.position.x;
            camera.position.y = selectedobject.position.y - 1.5;
            camera.position.z = selectedobject.position.z + 4.5;

            camera.lookAt(selectedobject.position);
            camera.updateProjectionMatrix();
        }


        
    }
    else {
        camera.position.set(0, -4.5, 2);
        camera.lookAt(scene.position);
        camera.updateProjectionMatrix();

    }

    document.querySelector('#opponent').innerHTML = "Select an Opponent";
    document.querySelector('#result').innerHTML = "Put up a good fight!";

    document.querySelector('#playermove').innerHTML = "";
    document.querySelector('#opponentmove').innerHTML = "";

    canreset = true;
    canfight = false;
}

var moves = ["punch", "kick", "block"];
var canfight = false;
function fightingFun(playermove){
    if(canfight && selectedobject !== undefined){
        var currentopponent = selectedobject.name;
        var opponentmove = "";

        if(currentopponent == "Robot1"){
            document.querySelector('#playermove').innerHTML = playermove.toUpperCase();
            opponentmove = "punch";
            document.querySelector('#opponentmove').innerHTML = opponentmove.toUpperCase();

            if(playermove == opponentmove){
                //Nothing happens, score remains the same, maybe a sound effect plays.
                document.querySelector('#result').innerHTML = "You tied! Select an Opponent";

                var rand = Math.round(Math.random() * 10) % 2;
                if(rand == 0){
                    tie1.play();
                }
                else{
                    tie2.play();
                }
            }
            else if(playermove == "block"){
                //Player wins, score goes up, winning sound effect
                document.querySelector('#result').innerHTML = "You won! Select an Opponent";

                currentscore += 50;
                robot1defeated = true;

                var hitrand = Math.round(Math.random() * 10) % 3;
                var hurtrand = Math.round(Math.random() * 10) % 2;

                if(hitrand == 0){
                    hit1.play();
                }
                else if(hitrand == 1){
                    hit2.play();
                }
                else{
                    hit3.play();
                }

                if(hurtrand == 0){
                    enemyhurt1.play();
                }
                else{
                    enemyhurt2.play();
                }
            }
            else if(playermove == "kick"){
                //Player loses, score resets back to 0, losing sound effect
                document.querySelector('#result').innerHTML = "You lost! Select an Opponent";

                currentscore = 0;
                lose.play();
            }

            //updatescore
            updateScore();
            canfight = false;
            opponentmove = "";
        }

        if(currentopponent == "Robot2"){
            document.querySelector('#playermove').innerHTML = playermove.toUpperCase();

            var choosemove = Math.round(Math.random() * 10) % 3;
            if(choosemove == 0){
                opponentmove = "punch";
            }
            else{
                opponentmove = "kick";
            }
            document.querySelector('#opponentmove').innerHTML = opponentmove.toUpperCase();
            
            if(playermove == opponentmove){
                document.querySelector('#result').innerHTML = "You tied! Select an Opponent";
            
                var rand = Math.round(Math.random() * 10) % 2;
                if(rand == 0){
                    tie1.play();
                }
                else{
                    tie2.play();
                }
            }
            else if((playermove == "punch" && opponentmove == "kick") || (playermove == "block" && opponentmove == "punch")){
                document.querySelector('#result').innerHTML = "You won! Select an Opponent";
                currentscore += 100;
                robot2defeated = true;
            
                var hitrand = Math.round(Math.random() * 10) % 3;
                var hurtrand = Math.round(Math.random() * 10) % 2;

                if(hitrand == 0){
                    hit1.play();
                }
                else if(hitrand == 1){
                    hit2.play();
                }
                else{
                    hit3.play();
                }

                if(hurtrand == 0){
                    enemyhurt1.play();
                }
                else{
                    enemyhurt2.play();
                }
            }
            else{
                document.querySelector('#result').innerHTML = "You lost! Select an Opponent";
                currentscore = 0;
                lose.play();
            }

            updateScore();
            canfight = false;
            opponentmove = "";
        }

        if(currentopponent == "Robot3"){
            document.querySelector('#playermove').innerHTML = playermove.toUpperCase();

            var choosemove = Math.round(Math.random() * 10) % 4;
            if(choosemove == 0){
                opponentmove = "punch";
            }
            else if (choosemove == 1){
                opponentmove = "kick";
            }
            else{
                opponentmove = "block";
            }
            document.querySelector('#opponentmove').innerHTML = opponentmove.toUpperCase();

            if(playermove == opponentmove){
                document.querySelector('#result').innerHTML = "You tied! Select an Opponent";
            
                var rand = Math.round(Math.random() * 10) % 2;
                if(rand == 0){
                    tie1.play();
                }
                else{
                    tie2.play();
                }
            }
            else if((playermove == "punch" && opponentmove == "kick") || (playermove == "kick" && opponentmove == "block") || (playermove == "block" && opponentmove == "punch")){
                document.querySelector('#result').innerHTML = "You won! Select an Opponent";

                currentscore += 150;
                robot3defeated = true;
            
                var hitrand = Math.round(Math.random() * 10) % 3;
                var hurtrand = Math.round(Math.random() * 10) % 2;

                if(hitrand == 0){
                    hit1.play();
                }
                else if(hitrand == 1){
                    hit2.play();
                }
                else{
                    hit3.play();
                }

                if(hurtrand == 0){
                    enemyhurt1.play();
                }
                else{
                    enemyhurt2.play();
                }
            }
            else{
                document.querySelector('#result').innerHTML = "You lost! Select an Opponent";
                currentscore = 0;
                lose.play();
            }

            updateScore();
            canfight = false;
            opponentmove = "";
        }

        if(currentopponent == "Robot4"){
            document.querySelector('#playermove').innerHTML = playermove.toUpperCase();

            var choosemove = Math.round(Math.random() * 10) % 3;
            opponentmove = moves[choosemove];
            document.querySelector('#opponentmove').innerHTML = opponentmove.toUpperCase();

            if(playermove == opponentmove){
                document.querySelector('#result').innerHTML = "You tied! Select an Opponent";
            
                var rand = Math.round(Math.random() * 10) % 2;
                if(rand == 0){
                    tie1.play();
                }
                else{
                    tie2.play();
                }
            }
            else if((playermove == "punch" && opponentmove == "kick") || (playermove == "kick" && opponentmove == "block") || (playermove == "block" && opponentmove == "punch")){
                document.querySelector('#result').innerHTML = "You won! Select an Opponent";
                currentscore += 200;
                robot4defeated = true;
            
                var hitrand = Math.round(Math.random() * 10) % 3;
                var hurtrand = Math.round(Math.random() * 10) % 2;

                if(hitrand == 0){
                    hit1.play();
                }
                else if(hitrand == 1){
                    hit2.play();
                }
                else{
                    hit3.play();
                }

                if(hurtrand == 0){
                    enemyhurt1.play();
                }
                else{
                    enemyhurt2.play();
                }
            }
            else{
                document.querySelector('#result').innerHTML = "You lost! Select an Opponent";
                currentscore = 0;
                lose.play();
            }

            updateScore();
            canfight = false;
            opponentmove = "";
        }

        if(currentopponent == "Robot5"){
            document.querySelector('#playermove').innerHTML = playermove.toUpperCase();

            var difficulty = Math.round(Math.random() * 10) % 8;

            if(difficulty == 0 || difficulty == 1){
                opponentmove = playermove;
            }
            else if(difficulty == 2){
                if(playermove == "punch")
                    opponentmove = "block";
                else if(playermove == "kick")
                    opponentmove = "punch";
                else
                    opponentmove = "kick";
            }
            else{
                var choosemove = Math.round(Math.random() * 10) % 3;
                opponentmove = moves[choosemove];
            }
            document.querySelector('#opponentmove').innerHTML = opponentmove.toUpperCase();

            if(playermove == opponentmove){
                document.querySelector('#result').innerHTML = "You tied! Select an Opponent";
            
                var rand = Math.round(Math.random() * 10) % 2;
                if(rand == 0){
                    tie1.play();
                }
                else{
                    tie2.play();
                }
            }
            else if((playermove == "punch" && opponentmove == "kick") || (playermove == "kick" && opponentmove == "block") || (playermove == "block" && opponentmove == "punch")){
                document.querySelector('#result').innerHTML = "You won! Press R to Reset";
                currentscore += 500;
                robot5defeated = true;
            
                var hitrand = Math.round(Math.random() * 10) % 3;
                var hurtrand = Math.round(Math.random() * 10) % 2;

                if(hitrand == 0){
                    hit1.play();
                }
                else if(hitrand == 1){
                    hit2.play();
                }
                else{
                    hit3.play();
                }

                if(hurtrand == 0){
                    enemyhurt1.play();
                }
                else{
                    enemyhurt2.play();
                }
            }
            else{
                document.querySelector('#result').innerHTML = "You lost! Select an Opponent";
                currentscore = 0;
                lose.play();
            }

            updateScore();
            canfight = false;
            opponentmove = "";
        }
    }
}

var currentscore = 0, hiscore = 0;
function updateScore() {
    document.querySelector('#score').innerHTML = currentscore;
    if(hiscore <= currentscore){
        hiscore = currentscore;
    }
    document.querySelector('#highscore').innerHTML = hiscore;
}


window.onload = init;
