var container;
var camera, scene, renderer, controls, object;
var plane,mesh;
var mouseX=0,
	mouseY=0;

var windowHalfX=window.innerWidth/2;
var windowHalfY=window.innerHeight/2;

var showPerspective=true;

window.addEventListener('resize', function(){
	let l=window.innerWidth>window.innerHeight?window.innerHeight:window.innerWidth;
	$('#objlayer').width(l);
	$('#objlayer').height(l);
},false);

function startRendering(){
	init();
	animate();
	windowHalfX = $('#objlayer').width() / 2;
    windowHalfY = $('#objlayer').height() / 2;
}

function init(){
	container = document.createElement('div');
	$("#objlayer").append(container);

	camera = new THREE.PerspectiveCamera(35, $('#objlayer').width() / $('#objlayer').height(), 1, 100);
	camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);

	camera.position.set(0,0,-2);
	camera2.position.set(0,0,-280);

	cameraTarget=new THREE.Vector3(0,0,0);

	//scene
	scene=new THREE.Scene();
	scene.fog = new THREE.Fog(0x72645b, 2, 15);

	//ground
	plane=new THREE.Mesh(
		new THREE.PlaneBufferGeometry(1,1),
		new THREE.MeshPhongMaterial({
			color:0xffffff,
			specular:0x707070
		})
		);
	plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
    plane.receiveShadow = true;
    plane.normal = new THREE.Vector3(0, 1, 0);
    scene.add(plane);

    //ceil
    plane=new THREE.Mesh(
    	new THREE.PlaneBufferGeometry(1,1),
    	new THREE.MeshPhongMaterial({
    		color:0xffffff,
    		specular:0x000000
    	})
    );
    plane.rotation.x=Math.PI/2;
    plane.position.y=0.5;
    plane.receiveShadow=true;
    plane.normal=new THREE.Vector3(0,-1,0);
    scene.add(plane);

    //light
    plane=new THREE.Mesh(
    	new THREE.PlaneBufferGeometry(0.25,0.25),
    	new THREE.MeshBasicMaterial(
    	{
    		color:0xffffff
    	})
    );
    plane.rotation.x=Math.PI/2;
    plane.position.y=0.49999;
    plane.position.z=0;
    plane.receiveShadow=true;

    plane.normal=new THREE.Vector3(0,-1,0);
    scene.add(plane);

    //right
    plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(1, 1),
        new THREE.MeshPhongMaterial({
            color: 0x910606,
            specular: 0x707070
        })
    );
    plane.rotation.y = -Math.PI / 2;
    plane.position.x = 0.5;
    plane.receiveShadow = true;

    plane.normal = new THREE.Vector3(-1, 0, 0);
    scene.add(plane);

    // left
    plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(1, 1),
        new THREE.MeshPhongMaterial({
            color: 0x063c06,
            specular: 0x707070
        })
    );
    plane.rotation.y = Math.PI / 2;
    plane.position.x = -0.5;
    plane.receiveShadow = true;

    plane.normal = new THREE.Vector3(1, 0, 0);
    scene.add(plane);

    // back

    plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(1, 1),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x707070
        })
    );
    plane.rotation.z = Math.PI;
    plane.position.z = -0.5;
    plane.receiveShadow = true;

    plane.normal = new THREE.Vector3(0, 0, 1);
    scene.add(plane);

    // front

    plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(1, 1),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x707070
        })
    );
    plane.rotation.y = Math.PI;
    plane.position.z = 0.5;
    plane.receiveShadow = true;

    plane.normal = new THREE.Vector3(0, 0, -1);
    scene.add(plane);

    //环境光
    var ambient=new THREE.AmbientLight(0x050505);
    scene.add(ambient);
    addSpotLight(0,0.45,0,0xffdd88,0.25);
    addPointLight(0,0.45,0,0xffdd88,0.25);

    renderer=new THREE.WebGLRenderer({
    	antialias:true
    });
    renderer.setClearColor(scene.fog.color);
    console.log(renderer)
     renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize($('#objlayer').width(), $('#objlayer').height());
    // 所有纹理和颜色是否使用预乘的gamma值来输入
    renderer.gammaInput=true;
    //所有纹理和颜色是否使用预乘的gamma值来输出。默认为false。
    renderer.gammaOutput = true;

    //是否启用在场景中的阴影贴图。默认为false。
    // renderer.shadowMap.enabled=true;
    // renderer.shadowMap.cullFace=THREE.CullFaceBack;

    container.appendChild(renderer.domElement);

    scene.add(camera);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.enableKeys = true;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 2;
    controls.addEventListener('change', animate);

    window.addEventListener('resize', onWindowResize, false);
}

function addSpotLight(x,y,z,color,intensity){
	var spotLight=new THREE.SpotLight(color);
	spotLight.position.set(x,y,z);
	spotLight.castShadow=false;
	spotLight.shadowMapWidth=1024;
	spotLight.shadowMapHeight=1024;
	spotLight.shadowCameraNear=0.5;
	spotLight.shadowCameraFar=10;
	spotLight.shadowCameraFov=80;

	scene.add(spotLight);
}

function addPointLight(x,y,z,color,intensity){
	var light=new THREE.PointLight(color,intensity);
	light.position.set(x,y,z);
	scene.add(light);
}

function onWindowResize(){
	windowHalfX = $('#objlayer').width() / 2;
    windowHalfY = $('#objlayer').height() / 2;

    camera.aspect = $('#objlayer').width() / $('#objlayer').height();
    camera.updateProjectionMatrix();
    camera2.aspect = $('#objlayer').width() / $('#objlayer').height();
    camera2.updateProjectionMatrix();

    renderer.setSize($('#objlayer').width(), $('#objlayer').height());
    // controls.handleResize();
    animate();
}

function animate(){
	render();

	controls.update();
}

function render(){
	camera.lookAt(cameraTarget);
	camera2.lookAt(cameraTarget);

	renderer.render(scene,showPerspective?camera:camera2);
}

function loadModel(){
	try{
		scene.remove(object);
	}catch(e){}

	var manager = new THREE.LoadingManager();
	manager.onProgress = function(item,loaded,total){
		console.info(item,loaded,total);
		if(loaded==total){
			animate();
		}
	};

	 var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.info(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function(xhr) {};

	var loader=new THREE.OBJLoader(manager);
	loader.load('obj/'+$('#filename').val(),function(object0){
		object0.traverse(function(child){
			if(child instanceof THREE.Mesh){
				var r=Math.round(Math.random()*0xff / 2);
				var g=Math.round(Math.random()*0xff / 2);
				var b=Math.round(Math.random()*0xff / 2);

				child.material = new THREE.MeshPhongMaterial({
					color:0x020000 * r + 0x000200 * g + 0x000002 * b,
					specular:0xffffff,
					shading:$('#smooth')[0].checked ? THREE.SmoothShadering:THREE.FlatShading
				})

				child.castShadow=true;
				child.receiveShadow=true;
				child.geometry=new THREE.Geometry().fromBufferGeometry(child.geometry);
				child.geometry.normalize();
                child.geometry.computeBoundingSphere();

                var s = child.geometry.boundingSphere;
                var c = s.center;
                var r = s.radius;

                child.geometry.computeBoundingBox();

                var b = child.geometry.boundingBox;
                var b1 = b.min;
                // console.log(r);
                // console.log(b1);
                var b2 = b.max;
                var scale = 0.5;
                child.scale.set(scale / r, scale / r, scale / r);
                child.position.set(-c.x * scale / r, -c.y * scale / r - 0.5 + (c.y - b1.y) * scale / r + 0.0001, -c.z * scale / r);
                child.geometry.mergeVertices();
                child.geometry.computeVertexNormals();
                child.geometry.computeFaceNormals();
                mesh = child;
			}
		});
		 scene.add(object0);
        object = object0;
	}, onProgress, onError);
}