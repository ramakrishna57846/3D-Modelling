
var viewPort;
var viewRenderer;
var viewPortPrespCam, viewPortOrthCam;
var viewPortScene;
var viewCameraProps = {viewAngle: 39, zoomMultiplier: 0.5, aspectRatio: 1.777, nearCutOff: 0.1, farCutOff: 10000.0, viewPortCamPresp: false, viewMode: "Orthographic", "camUp": null, "lookAt": null, fixedView: false};
var gridXY, gridXZ, gridYZ;
var gridXYPlane, gridXZPlane, gridYZPlane;
var cursor;
var objroot;
var light;
var rayCaster;
var output;
var camUp;
var saveData;

function createDefaultScene()
{
	/* Initialize controls*/
	initControl();

	/* Initialize the scene and renderer */
    viewPort         = document.getElementById('viewPort');
    viewPortScene    = new THREE.Scene();
    viewRenderer     = new THREE.WebGLRenderer({canvas: viewPort});
	
	/* Set initial states for the renderer */
    viewRenderer.setSize($('#viewPort').width(), $('#viewPort').height());
    viewRenderer.setClearColor( 0x000000, 1);
	
	/* Create other helper objects */
	rayCaster = new THREE.Raycaster();
    gridXY    = new THREE.Object3D(); gridXZ = new THREE.Object3D(); gridYZ = new THREE.Object3D();
    if(objroot === undefined) { objroot   = new THREE.Object3D(); }
	cursor    = new THREE.Object3D();
	
	/* Initialize the drag lines */
	createVisualAids(1000);
	
	/* Create cameras */
    viewPortPrespCam = new THREE.PerspectiveCamera(control.viewCameraProps.viewAngle, control.viewCameraProps.aspectRatio,
		                                           control.viewCameraProps.nearCutOff, control.viewCameraProps.farCutOff);
    viewPortOrthCam  = new THREE.OrthographicCamera(-viewPort.width*control.viewCameraProps.zoomMultiplier, viewPort.width*control.viewCameraProps.zoomMultiplier,
													viewPort.height*control.viewCameraProps.zoomMultiplier, -viewPort.height*control.viewCameraProps.zoomMultiplier,
													control.viewCameraProps.nearCutOff, control.viewCameraProps.farCutOff);
	
	/* Set initial states for the camera and renderer */
    viewPortPrespCam.position.set(-707, -707, 707);
    viewPortPrespCam.rotation.set(0, 0, 0);
	viewPortOrthCam.position.set(-707, -707, 707);
    viewPortOrthCam.rotation.set(0, 0, 0);
	
	/* camera up and lookat vectors */
	control.viewCameraProps.camUp  = new THREE.Vector3(0, 0, 1);
	control.viewCameraProps.lookAt = new THREE.Vector3(0, 0, 0);
	
	/* Add cameras to the scene */
    viewPortScene.add(viewPortPrespCam);
    viewPortScene.add(viewPortOrthCam);

    /* Input controls */
    viewPort.addEventListener("mousewheel", zoomControl, true);
    viewPort.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("mouseclick", onMouseClick, true);
    document.addEventListener("mousedown", onMouseDown, true);
    document.addEventListener("contextmenu", onContextMenu, true);
    document.addEventListener("mouseup", onMouseUp, true);
    document.addEventListener("keydown", onKeyDown, true);

	/* Create a light add to the scene */
    lightl = new THREE.DirectionalLight(0x696969);
	lightr = new THREE.DirectionalLight(0x696969);
	lightl.position.x = 1000 * Math.sin(control.yzAngle+PI/7); lightr.position.x = 1000 * Math.sin(control.yzAngle-PI/7);
	lightl.position.y = 1000 * Math.sin(control.xzAngle+PI/8); lightr.position.y = 1000 * Math.sin(control.xzAngle-PI/8);
	lightl.position.z = 1000 * Math.sin(control.xyAngle+PI/9); lightr.position.z = 1000 * Math.sin(control.xyAngle-PI/9);
    viewPortScene.add(lightl);
    viewPortScene.add(lightr);

    light = new THREE.AmbientLight(0x707070);
    viewPortScene.add(light);
	
	/* Update current view */
	var viewMode = "Orthographic"; if(control.viewCameraProps.viewPortCamPresp == true) { viewMode = "Prespective"; }
	$("#cameraStatus").html(viewMode + " View");

	/* Create grid lines and add to scene */
    createGridLines(1000, 20, 10);
	gridXY.visible = true; gridXZ.visible = false; gridYZ.visible = false;
    viewPortScene.add(gridXY);
    viewPortScene.add(gridXZ);
    viewPortScene.add(gridYZ);
	viewPortScene.add(cursor);
	
	/* add object root to scene */
    viewPortScene.add(objroot);

    /* Render the initial scene */
    render();
}

function getScreenXY(obj)
{
	var p = obj.matrixWorld.getPosition().clone();
	p.project(getCurrentCamera());
	
    var xy = new THREE.Vector2();
	
	xy.x = (((p.x + 1) / 2) * viewPort.width);
	xy.y = (((-p.y + 1) / 2) * viewPort.height);
	
	return xy;
}

function getSceneXYZ(pos)
{
	var xyz = new THREE.Vector3();
	
	xyz.x = (((pos.x / viewPort.width) * 2) - 1);
	xyz.y = -(((pos.y / viewPort.height) * 2) - 1); 
	xyz.z = 0.5;
	
	xyz.unproject(getCurrentCamera());
	
	return xyz;
}

function setCursorPos(e)
{
	var offset = $(".viewPort").offset();
	var pos = new THREE.Vector3( ( (e.clientX - offset.left)  / viewPort.width ) * 2 - 1,
		- (( e.clientY - offset.top) / viewPort.height ) * 2 + 1,1 );

	rayCaster.setFromCamera(pos, getCurrentCamera());
	
	var rayLine = new THREE.Line3( rayCaster.ray.origin, rayCaster.ray.direction );
	
	var curPos; 
	if(gridXY.visible == true) { curPos = gridXYPlane.intersectLine(rayLine) }
	else if(gridXZ.visible == true) { curPos = gridXZPlane.intersectLine(rayLine) }
	else if(gridYZ.visible == true) { curPos = gridYZPlane.intersectLine(rayLine) }
	else { curPos = new Vector3(0, 0, 0); }
	if(curPos != undefined)
	{
		curPos.x = curPos.x * 1000; curPos.y = curPos.y * 1000; curPos.z = curPos.z * 1000;
		cursor.position.set(curPos.x, curPos.y, curPos.z);
	}
	render();
}

function findObjectsInPos(e)
{
	var offset = $(".viewPort").offset();
    var pos = new THREE.Vector3( ( (e.clientX - offset.left)  / viewPort.width ) * 2 - 1,
								 - (( e.clientY - offset.top) / viewPort.height ) * 2 + 1,
								 1 );
	
	rayCaster.setFromCamera(pos, getCurrentCamera());
	if(control.edit.isEdit == true)
    {
        return rayCaster.intersectObjects(control.select.selectObj.children, true);
    }

	return  rayCaster.intersectObjects(objroot.children, true);
}

function getCurrentCamera()
{
	if(control.viewCameraProps.viewPortCamPresp == true)
	{
		return viewPortPrespCam;
	}
	else
	{
		return viewPortOrthCam;
	}
}

function render()
{
	/* Get the current camera */
	var cam = getCurrentCamera();
	
	/* Rotate camera towards origin */
	cam.up.set(control.viewCameraProps.camUp.x, control.viewCameraProps.camUp.y, control.viewCameraProps.camUp.z);
	cam.lookAt(control.viewCameraProps.lookAt);
	
	/* Update the projection */
	cam.updateProjectionMatrix();
	
	DebugInfo("render: Camera.pos.xyz (" + cam.position.x + ", " + cam.position.y + ", " + cam.position.z + ")");
	DebugInfo("render: Camera.rot.xyz (" + cam.rotation.x + ", " + cam.rotation.y + ", " + cam.rotation.z + ")");
	
	/* Render */
	viewRenderer.render(viewPortScene, cam);
}

function exportScene()
{
	var exporter = new THREE.OBJExporter();
	saveData = exporter.parse(objroot);
	socket.emit('export', saveData);
}

function importScene()
{
	var loader = new THREE.OBJLoader();
	objroot = loader.parse(saveData);
	viewPortScene.add(objroot);
}

function DebugInfo(info)
{
	if(debug == 1)
	{			
		console.log(info);
	}
}