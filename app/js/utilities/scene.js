
/* PI value */
var PI = 3.14;

/* Scene related data */
var sceneData;

/* Session related data */
var sessionData;

/* Scene defaults */
var sceneDefaults = {bgColor: 0x000000, bgAlpha: 1, gridSize: 1000, numGirdLines: 20,
                     numGridDivisions: 10, viewMode: "Orthographic", focusElement: null,
                     isEditDone: false, isObjSelectDone: false, isVefSelectDone: false,
                     selectAxis: {"localAxis": null, "localXAxis": null, "localYAxis": null,
                                  "localZAxis": null, "currLocalAxis": null}
                    };

/* Session defaults */
var sessionDefaults = {viewCameraProps: {viewAngle: 39, aspectRatio: 1.777, nearCutOff: 0.1,
                                         farCutOff: 10000.0, zoomMultiplier: 0.8, viewPortCamPresp: false,
                                         camUp: {x: 0, y: 0, z: 1},
                                         lookAt: {x: 0, y: 0, z: 0}
                                        },
                      objSelect: {selectedObjName: '', isSelected: false, isEdit :false,
                                  isDragging: false, isScaling: false, isRotating : false,
                                  direction: '', editMode: '', wireframeMode : false
                                 },
                       xyAngle: PI/4, yzAngle: -3*PI/4, xzAngle: -PI/4,
                       isCamRotating: false, startX: 0, startY: 0,
                       numCubes: 0, numCylinders: 0, numSpehers: 0, numCones: 0
                      };

/* Default Step information for undo/redo operations */                      
var stepInfoDefaults = {maxSteps: 30, undoStepIdx: -1, numUndoSteps: 0, redoStepIdx: -1, numRedoSteps: 0};

/* Step information for undo/redo operations */
var stepInfo;

function initSceneData()
{
  /* Initialize the scene and renderer */
  sceneData.viewPort      = document.getElementById('viewPort');
  sceneData.viewPortScene = new THREE.Scene();
  sceneData.viewRenderer  = new THREE.WebGLRenderer({canvas: sceneData.viewPort});
  sceneData.viewRenderer.sortObjects = true;
  
  /* Get the dimensions of the view port */
  var width = $('#viewPort').width();
  var height = $('#viewPort').height();

  /* The default value is for a view port width of 849, calculate accoring to the width of the current viewport. */
  sessionData.viewCameraProps.zoomMultiplier = (sessionData.viewCameraProps.zoomMultiplier * 846) / width;
  sceneData.viewRenderer.setSize(width, height);
  sceneData.viewRenderer.setClearColor(sceneData.bgColor, sceneData.bgAlpha);
  
  /* Create prespective camera */
  sceneData.viewPortPrespCam = new THREE.PerspectiveCamera(sessionData.viewCameraProps.viewAngle, sessionData.viewCameraProps.aspectRatio,
                                                           sessionData.viewCameraProps.nearCutOff, sessionData.viewCameraProps.farCutOff);
  /* Set initial states for the camera */
  sceneData.viewPortPrespCam.position.set(-707, -707, 707);
  sceneData.viewPortPrespCam.rotation.set(0, 0, 0);
  sceneData.viewPortPrespCam.name = "viewPortPrespCam";
  
  /* Create orthographic camera */
  sceneData.viewPortOrthCam  = new THREE.OrthographicCamera((-sceneData.viewPort.width  * sessionData.viewCameraProps.zoomMultiplier),
                                                            ( sceneData.viewPort.width  * sessionData.viewCameraProps.zoomMultiplier),
                                                            ( sceneData.viewPort.height * sessionData.viewCameraProps.zoomMultiplier),
                                                            (-sceneData.viewPort.height * sessionData.viewCameraProps.zoomMultiplier),
                                                            sessionData.viewCameraProps.nearCutOff, sessionData.viewCameraProps.farCutOff);
  
  /* Set initial states for the camera */
  sceneData.viewPortOrthCam.position.set(-707, -707, 707);
  sceneData.viewPortOrthCam.rotation.set(0, 0, 0);
  sceneData.viewPortOrthCam.name = "viewPortOrthCam";
  
  /* camera up and lookat vectors */
  sessionData.viewCameraProps.camUp  = new THREE.Vector3(sessionData.viewCameraProps.camUp.x, sessionData.viewCameraProps.camUp.y, sessionData.viewCameraProps.camUp.z);
  sessionData.viewCameraProps.lookAt = new THREE.Vector3(sessionData.viewCameraProps.lookAt.x, sessionData.viewCameraProps.lookAt.y, sessionData.viewCameraProps.lookAt.z);
  
  /* Add cameras to the scene */
  sceneData.viewPortScene.add(sceneData.viewPortPrespCam);
  sceneData.viewPortScene.add(sceneData.viewPortOrthCam);

  /* Input controls */
  sceneData.viewPort.addEventListener("mousewheel", zoomControl, true);
  sceneData.viewPort.addEventListener("mousemove", onMouseMove, true);
  document.addEventListener("mouseclick", onMouseClick, true);
  document.addEventListener("mousedown", onMouseDown, true);
  document.addEventListener("contextmenu", onContextMenu, true);
  document.addEventListener("mouseup", onMouseUp, true);
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("keyup", onKeyUp, true);

  /* Create camera helper lights and add to the scene */
  sceneData.lightl = new THREE.DirectionalLight(0x696969);
  sceneData.lightr = new THREE.DirectionalLight(0x696969);
  sceneData.lightl.position.x = sceneData.gridSize * Math.sin(sessionData.yzAngle+PI/7); sceneData.lightr.position.x = sceneData.gridSize * Math.sin(sessionData.yzAngle-PI/7);
  sceneData.lightl.position.y = sceneData.gridSize * Math.sin(sessionData.xzAngle+PI/8); sceneData.lightr.position.y = sceneData.gridSize * Math.sin(sessionData.xzAngle-PI/8);
  sceneData.lightl.position.z = sceneData.gridSize * Math.sin(sessionData.xyAngle+PI/9); sceneData.lightr.position.z = sceneData.gridSize * Math.sin(sessionData.xyAngle-PI/9);
  sceneData.lightl.name = "lightl";
  sceneData.lightr.name = "lightr";
  sceneData.viewPortScene.add(sceneData.lightl);
  sceneData.viewPortScene.add(sceneData.lightr);

  /* Create a ambient light and add to the scene */
  sceneData.light = new THREE.AmbientLight(0x707070);
  sceneData.light.name = "light";
  sceneData.viewPortScene.add(sceneData.light);
  
  /* Update current view */
  $("#cameraStatus").html(sceneData.viewMode + " View");

  /* Create drag lines */
  createVisualAids(sceneData.gridSize);
  
  /* Create grid lines */
  createGridLines(sceneData.gridSize, sceneData.numGirdLines, sceneData.numGridDivisions);
 
  /* If no objectroot available initialize it */
  if(sceneData.objroot === undefined) { sceneData.objroot = new THREE.Object3D(); }
  
  /* add object root to scene */
  sceneData.objroot.name = "objroot";
  sceneData.viewPortScene.add(sceneData.objroot);
}

function createScene(data)
{
  /* Copy the default values */
  sceneData   = jQuery.extend(true, {}, sceneDefaults);
  sessionData = jQuery.extend(true, {}, sessionDefaults);
  
  /* Only for new scenes */
  if(data == null)
  {
    /* Reset the step information */
    stepInfo = jQuery.extend(true, {}, stepInfoDefaults);
  }
  
  /* Create the required utilities */
  sceneData.rayCaster = new THREE.Raycaster();
  sceneData.exporter  = new THREE.OBJExporter();
  sceneData.loader    = new THREE.OBJLoader();
  
  /* If import/undo/redo data available */
  if(data != null)
  {
    /* If there is no sceneData */
    if((data.sceneData == null) || (data.sceneData === undefined))
    {
      console.log('Open scene failed');
    }
    else
    {
      sceneData.objroot = sceneData.loader.parse(data.sceneData);
      sceneData.objroot.name = "objroot";
    }
    
    /* If session data available */
    if(data.sessionData != null)
    {
      sessionData = JSON.parse(data.sessionData);
    }
  }
  
  /* Initialize Scene Data */
  initSceneData();
  
  /* Re-select the object if required */
  selectObject(false);
  
   /* Re-enter edit mode if required */
  enterEditMode(false);
  
  /* Apply the zoom again */
  applyZoom();
  
  /* Render the initial scene */
  render();
  
  if(data == null)
  {
    saveStep('Initial');
  }
}

function setCursorPos(e)
{
  var offset = $(".viewPort").offset();
  var pos = new THREE.Vector3(  ((e.clientX - offset.left) / viewPort.width )  * 2 - 1,
                              - ((e.clientY - offset.top)  / viewPort.height ) * 2 + 1, 1 );

  sceneData.rayCaster.setFromCamera(pos, getCurrentCamera());
  
  var rayLine = new THREE.Line3( sceneData.rayCaster.ray.origin, sceneData.rayCaster.ray.direction );
  
  var curPos; 
  if(sceneData.gridXY.visible == true) { curPos = sceneData.gridXYPlane.intersectLine(rayLine) }
  else if(sceneData.gridXZ.visible == true) { curPos = sceneData.gridXZPlane.intersectLine(rayLine) }
  else if(sceneData.gridYZ.visible == true) { curPos = sceneData.gridYZPlane.intersectLine(rayLine) }
  else { curPos = new Vector3(0, 0, 0); }
  
  if(curPos != undefined)
  {
    curPos.x = curPos.x * sceneData.gridSize; curPos.y = curPos.y * sceneData.gridSize; curPos.z = curPos.z * sceneData.gridSize;
    sceneData.cursor.position.set(curPos.x, curPos.y, curPos.z);
  }
  
  render();
}

function findObjectsInPos(e)
{
  var offset = $(".viewPort").offset();
  var pos = new THREE.Vector3(  ((e.clientX  - offset.left) / viewPort.width )  * 2 - 1,
                              - (( e.clientY - offset.top)  / viewPort.height ) * 2 + 1, 1 );
  
  sceneData.rayCaster.setFromCamera(pos, getCurrentCamera());
  
  if(sessionData.objSelect.isEdit == true)
  {
    var selectedObj = getSelectedObject();
    return sceneData.rayCaster.intersectObjects(selectedObj.children, true);
  }

  return sceneData.rayCaster.intersectObjects(sceneData.objroot.children, true);
}

function getCurrentCamera()
{
  if(sessionData.viewCameraProps.viewPortCamPresp == true)
  {
    return sceneData.viewPortPrespCam;
  }
  else
  {
    return sceneData.viewPortOrthCam;
  }
}

function render()
{
  /* Get the current camera */
  var cam = getCurrentCamera();
  
  /* Calculate camera position */
  cam.position.x = sceneData.gridSize * Math.sin(sessionData.yzAngle);
  cam.position.y = sceneData.gridSize * Math.sin(sessionData.xzAngle);
  cam.position.z = sceneData.gridSize * Math.sin(sessionData.xyAngle);
  
  sceneData.lightl.position.x = sceneData.gridSize * Math.sin(sessionData.yzAngle+PI/7); sceneData.lightr.position.x = sceneData.gridSize * Math.sin(sessionData.yzAngle-PI/7);
  sceneData.lightl.position.y = sceneData.gridSize * Math.sin(sessionData.xzAngle+PI/8); sceneData.lightr.position.y = sceneData.gridSize * Math.sin(sessionData.xzAngle-PI/8);
  sceneData.lightl.position.z = sceneData.gridSize * Math.sin(sessionData.xyAngle+PI/9); sceneData.lightr.position.z = sceneData.gridSize * Math.sin(sessionData.xyAngle-PI/9);
  
  /* Rotate camera towards origin */
  cam.up.set(sessionData.viewCameraProps.camUp.x, sessionData.viewCameraProps.camUp.y, sessionData.viewCameraProps.camUp.z);
  cam.lookAt(sessionData.viewCameraProps.lookAt);
  
  /* Update the projection */
  cam.updateProjectionMatrix();
  
  DebugInfo("render: Camera.pos.xyz (" + cam.position.x + ", " + cam.position.y + ", " + cam.position.z + ")");
  DebugInfo("render: Camera.rot.xyz (" + cam.rotation.x + ", " + cam.rotation.y + ", " + cam.rotation.z + ")");
  
  /* Render */
  sceneData.viewRenderer.render(sceneData.viewPortScene, cam);
  
  /* Normalize objects before rendering */
  normalizeObjects();
  
  /* Render again with normalized objects */
  sceneData.viewRenderer.render(sceneData.viewPortScene, cam);
}

function saveStep(stepDesc)
{
  stepInfo.redoStepIdx  = -1;
  stepInfo.numRedoSteps = 0;
  
  stepInfo.undoStepIdx++;
  if(stepInfo.undoStepIdx >= stepInfo.maxSteps) { stepInfo.undoStepIdx = 0; }
  if(stepInfo.numUndoSteps < stepInfo.maxSteps) { stepInfo.numUndoSteps++; }
  
  saveData = sceneData.exporter.parse(sceneData.objroot);
  exportData = JSON.stringify({'sceneName' : 'step_' + stepInfo.undoStepIdx, 'sceneDesc': stepDesc, 'sceneData' : saveData ,'sessionData' : JSON.stringify(sessionData) });
  socket.emit('export', exportData);
}

function exportScene()
{
  saveData = sceneData.exporter.parse(sceneData.objroot);
  exportData = JSON.stringify({'sceneName' : 'test', 'sceneDesc': '', 'sceneData' : saveData ,'sessionData' : JSON.stringify(sessionData) });
  socket.emit('export', exportData);
}

function redoStep()
{
  if(stepInfo.numRedoSteps > 0)
  {
    stepInfo.undoStepIdx++;
    if(stepInfo.undoStepIdx >= stepInfo.maxSteps) { stepInfo.undoStepIdx = 0; }
    if(stepInfo.numUndoSteps < stepInfo.maxSteps) { stepInfo.numUndoSteps++; }
    
    socket.emit('import', 'step_' + stepInfo.redoStepIdx);
    
    stepInfo.numRedoSteps--;
    stepInfo.redoStepIdx++;
    if(stepInfo.redoStepIdx < 0) { stepInfo.redoStepIdx = stepInfo.maxSteps - 1; }
  }
  else
  {
    console.log("No more redo-steps available");
  }
}

function undoStep()
{
  if(stepInfo.numUndoSteps > 0)
  {
    stepInfo.numUndoSteps--;
    stepInfo.undoStepIdx--;
    if(stepInfo.undoStepIdx < 0) { stepInfo.undoStepIdx = stepInfo.maxSteps - 1; }
    
    if(stepInfo.numUndoSteps >= 0)
    {
      stepInfo.redoStepIdx = stepInfo.undoStepIdx + 1;
      if(stepInfo.redoStepIdx >= stepInfo.maxSteps) { stepInfo.redoStepIdx = 0; }
      if(stepInfo.numRedoSteps < stepInfo.maxSteps) { stepInfo.numRedoSteps++; }
    
      socket.emit('import', 'step_' + stepInfo.undoStepIdx);
    }
    else
    {
      console.log("No more undo-steps available");
    }
  }
  else
  {
    console.log("No more undo-steps available");
  }
}

function importScene()
{
  socket.emit('import', 'test');
}

function importData(importData)
{
  data = JSON.parse(importData);

  createScene(data);
}

function DebugInfo(info)
{
  if(debug == 1)
  {      
    console.log(info);
  }
}