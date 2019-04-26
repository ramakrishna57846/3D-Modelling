
function onKeyDown(e)
{
  var breakOps = false;
  e = window.event || e; // old IE support

  if(sessionData.focusElement == viewPort)
  {
    if(e.altKey == true)
    {
      sessionData.isCamRotating = true;
      sessionData.startX = sessionData.lastXPos;
      sessionData.startY = sessionData.lastYPos;
    }
    
    switch(e.keyCode)
    {
      case 37: /* Left Arrow -> Left/Right Side View */
      {
        sceneData.viewMode = "Orthographic"; if(sessionData.viewCameraProps.viewPortCamPresp == true) { sceneData.viewMode = "Prespective"; }
        if(e.shiftKey == true) { sessionData.xyAngle = 0; sessionData.yzAngle = 3*PI/2; sessionData.xzAngle = 0; sessionData.viewCameraProps.camUp.set(0, 0, -1); sceneData.viewMode = "Left " + sceneData.viewMode + " View"; } /* Left Side View */
        else { sessionData.xyAngle = 0; sessionData.yzAngle = PI/2; sessionData.xzAngle = 0; sessionData.viewCameraProps.camUp.set(0, 0, 1); sceneData.viewMode = "Right " + sceneData.viewMode + " View"; } /* Right Side View */
        $("#cameraStatus").html(sceneData.viewMode);
        sceneData.gridXY.visible = false; sceneData.gridXZ.visible = false; sceneData.gridYZ.visible = true;
        sessionData.viewCameraProps.lookAt.set(0, 0, 0);
        sessionData.viewCameraProps.fixedView = true;
      }
      break;

      case 38: /* Up Arrow -> Top/Bottom View */
      {
        if(e.altKey == true)
        {
          window.event.wheelDelta = 1;
          zoomControl({wheelDelta: 1});
        }
        else
        {
          sceneData.viewMode = "Orthographic"; if(sessionData.viewCameraProps.viewPortCamPresp == true) { sceneData.viewMode = "Prespective"; }
          if(e.shiftKey == true) { sessionData.xyAngle = 3*PI/2; sessionData.yzAngle = 0; sessionData.xzAngle = 0; sessionData.viewCameraProps.camUp.set(0, -1, 0); sceneData.viewMode = "Bottom " + sceneData.viewMode + " View"; } /* Bottom View */
          else { sessionData.xyAngle = PI/2; sessionData.yzAngle = 0; sessionData.xzAngle = 0; sessionData.viewCameraProps.camUp.set(0, 1, 0); sceneData.viewMode = "Top " + sceneData.viewMode + " View"; } /* Top View */
          $("#cameraStatus").html(sceneData.viewMode);
          sceneData.gridXY.visible = true; sceneData.gridXZ.visible = false; sceneData.gridYZ.visible = false;
          sessionData.viewCameraProps.lookAt.set(0, 0, 0);
          sessionData.viewCameraProps.fixedView = true;
        }
      }
      break;

      case 39: /* Right Arrow -> Front/Back View */
      {
        sceneData.viewMode = "Orthographic"; if(sessionData.viewCameraProps.viewPortCamPresp == true) { sceneData.viewMode = "Prespective"; }
        if(e.shiftKey == true) { sessionData.xyAngle = 0; sessionData.yzAngle = 0; sessionData.xzAngle = 3*PI/2; sessionData.viewCameraProps.camUp.set(-1, 0, 0); sceneData.viewMode = "Back " + sceneData.viewMode + " View"; } /* Back View */
        else { sessionData.xyAngle = 0; sessionData.yzAngle = 0; sessionData.xzAngle = PI/2; sessionData.viewCameraProps.camUp.set(1, 0, 0); sceneData.viewMode = "Front " + sceneData.viewMode + " View"; } /* Front View */
        $("#cameraStatus").html(sceneData.viewMode);
        sceneData.gridXY.visible = false; sceneData.gridXZ.visible = true; sceneData.gridYZ.visible = false;
        sessionData.viewCameraProps.lookAt.set(0, 0, 0);
        sessionData.viewCameraProps.fixedView = true;
      }
      break;

      case 40: /* Down Arrow */
      {
        if(e.altKey == true)
        {
          window.event.wheelDelta = -1;
          zoomControl({wheelDelta: -1});
        }
        else
        {
          sceneData.viewMode = "Orthographic"; if(sessionData.viewCameraProps.viewPortCamPresp == true) { sceneData.viewMode = "Prespective"; }
          sessionData.xyAngle = PI/4; sessionData.yzAngle = -3*PI/4; sessionData.xzAngle = -PI/4; sceneData.viewMode = sceneData.viewMode + " View"; /* Presp/Orth View */
          $("#cameraStatus").html(sceneData.viewMode);
          sceneData.gridXY.visible = true; sceneData.gridXZ.visible = false; sceneData.gridYZ.visible = false;
          sessionData.viewCameraProps.camUp.set(0, 0, 1);
          sessionData.viewCameraProps.lookAt.set(sceneData.cursor.position.x, sceneData.cursor.position.y, sceneData.cursor.position.z);
          sessionData.viewCameraProps.fixedView = false;
        }
      }
      break;

      case 80:  /* P -> Switch off/on Prespective view */
      case 112: /* p*/
      {
        if(sessionData.viewCameraProps.viewPortCamPresp == true)
        {
          sessionData.viewCameraProps.viewPortCamPresp = false;
        }
        else
        {
          sessionData.viewCameraProps.viewPortCamPresp = true;
        }

        if(sessionData.viewCameraProps.viewPortCamPresp == true) { sceneData.viewMode = sceneData.viewMode.replace("Orthographic", "Prespective"); }
        else { sceneData.viewMode = sceneData.viewMode.replace("Prespective", "Orthographic"); }
        $("#cameraStatus").html(sceneData.viewMode);
        
        applyRotation();
        applyZoom();
      }
      break;
      
      case 79:  /* O -> Back to origin / open saved scene */
      case 111: /* o*/
      {
        if(e.ctrlKey == true)
        {
          importScene();
        }
        else
        {
          sceneData.cursor.position.set(0, 0, 0);
          if(sessionData.viewCameraProps.fixedView == false)
          {
            sessionData.viewCameraProps.lookAt.set(sceneData.cursor.position.x, sceneData.cursor.position.y, sceneData.cursor.position.z);
          }
        }
        
        e.preventDefault(); breakOps = true;
      }
      break;
      
      case 83:  /* S -> Save scene */
      case 115: /* s */
      {
        if(e.ctrlKey == true)
        {
          exportScene();
          breakOps = true;
        }
        
        e.preventDefault();
      }
      break;

      case 78: /* N -> new */
      case 110: /* n */
      {
        sceneData.viewPortScene.remove(sceneData.objroot);
        sceneData.objroot = undefined;
        createScene(null);
      }
      break;
      
      case 121: /* y -> Redo */
      case 89:  /* Y */
      {
        if(e.ctrlKey == true)
        {
          redoStep();
        }
      }
      break;
      
      case 122: /* z -> Undo */
      case 90:  /* Z */
      {
        if(e.ctrlKey == true)
        {
          undoStep();
        }
      }
      break;

      default:
      break;
    }
    
    /* Key operations when object selected */
    if((sessionData.objSelect.isSelected == true) && (breakOps == false))
    {
      var selectedObj = getSelectedObject();
      var selectObjOutline = getSelectedObjectOutline();
      
      switch(e.keyCode)
      {
        case 27: /* ESC -> unselect */
        {
          unSelectObject(false);
        }
        break;
        
        case 71:  /* G -> Grab (drag) object */
        case 103: /* g */
        {
          sessionData.objSelect.isScaling  = false;
          sessionData.objSelect.isDragging = true;
          sessionData.objSelect.isRotating = false;
          sessionData.objSelect.direction = 'x';
          setLocalAxis(selectedObj, sessionData.objSelect.direction);
        }
        break;

        case 83:  /* S -> Scale objects */
        case 115: /* s */
        {  
          sessionData.objSelect.isDragging = false;
          sessionData.objSelect.isScaling  = true;
          sessionData.objSelect.isRotating = false;
          sessionData.objSelect.direction = ' ';
          setLocalAxis(selectedObj, sessionData.objSelect.direction);
        }
        break;
        
        case 82:   /* R -> Rotate objects */
        case 114:  /* r */
        {
          sessionData.objSelect.isDragging = false;
          sessionData.objSelect.isScaling = false;
          sessionData.objSelect.isRotating = true;
          sessionData.objSelect.direction = 'x';
          setLocalAxis(selectedObj, sessionData.objSelect.direction);
        }
        break;
        
        case 120: /* x -> Select x-axis */
        case 88:  /* X */
        {
          sessionData.objSelect.direction = 'x';
          setLocalAxis(selectedObj, sessionData.objSelect.direction);
        }
        break;
        
        case 121: /* y -> Select y-axis */
        case 89:  /* Y */
        {
          sessionData.objSelect.direction = 'y';
          setLocalAxis(selectedObj, sessionData.objSelect.direction);
        }
        break;
        
        case 122: /* z -> Select z-axis */
        case 90:  /* Z */
        {
          sessionData.objSelect.direction = 'z';
          setLocalAxis(selectedObj, sessionData.objSelect.direction);
        }
        break;
        
        /* 1 - 9 -> Set pre-defined colors */
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
        {
          var colors = [0xffffff, 0xffff00, 0xff00ff, 0x00ffff, 0xff0000, 0x00ff00, 0x0000ff, 0xcccccc, 0x666666];
          var idx = e.keyCode - 49;
          selectedObj.material.color.setHex(colors[idx]);
        }
        break;
        
        case 68:  /* D -> Duplicate objects */
        case 100: /* d */
        {
          /* Before duplicating, leave edit mode and unselect */
          leaveEditMode();
          unSelectObject(true);
          
          var clonedObj = new THREE.Mesh(selectedObj.geometry, selectedObj.material);
          
          clonedObj.name = "c" + selectedObj.name;
          sceneData.objroot.add(clonedObj);
          
          sessionData.objSelect.selectedObjName = clonedObj.name;
          selectObject(true);
          
          sessionData.objSelect.isScaling  = false;
          sessionData.objSelect.isDragging = true;
          sessionData.objSelect.isRotating = false;
          
          sessionData.objSelect.direction = 'x';
          setLocalAxis(selectedObj, sessionData.objSelect.direction);
        }
        break;

        case 08:  /* Backspace -> Delete objects */
        case 127: /* Delete */
        {
          sceneData.objroot.remove(selectedObj);
          e.preventDefault();
        }
        break;

        case 87:  /* W -> WIREFRAME change the object to wireframe mode */
        case 119: /* w */
        {
          if(sessionData.objSelect.wireframeMode == true)
          {
            sessionData.objSelect.wireframeMode = false;
          }
          else
          {
            sessionData.objSelect.wireframeMode = true;
          }
          
          selectedObj.material.wireframe      = sessionData.objSelect.wireframeMode;
          selectObjOutline.material.wireframe = sessionData.objSelect.wireframeMode;
        }
        break;

        case 69:  /* E -> EDIT - edit face,vertex or edges */
        case 101: /* e */
        {
          if(sessionData.objSelect.isEdit == false)
          {
            enterEditMode(true);
          }
          else
          {
            leaveEditMode();
          }
        }
        break;
        
        default:
        break;
      }
    }
  }
  
  /* Render again */
  render();
  
  return false;
}

function onKeyUp(e)
{
  if(e.altKey == false)
  {
    sessionData.isCamRotating = false;
  }
  
  return false;
}

function setLocalAxis(obj, dir)
{
  /* Remove any existing local axis attached to the scene */
  sceneData.viewPortScene.remove(sceneData.selectAxis.currLocalAxis);
  
  /* Select a local axis based on the given direction */
  if( dir == 'x') {sceneData.selectAxis.currLocalAxis = sceneData.selectAxis.localXAxis; }
  else if(dir == 'y') {sceneData.selectAxis.currLocalAxis = sceneData.selectAxis.localYAxis; }
  else if(dir == 'z') {sceneData.selectAxis.currLocalAxis = sceneData.selectAxis.localZAxis; }
  else { sceneData.selectAxis.currLocalAxis = sceneData.selectAxis.localAxis; }
  
  /* Set the axis location and add to the scene */
  sceneData.selectAxis.currLocalAxis.position.set(obj.position.x, obj.position.y, obj.position.z);
  sceneData.viewPortScene.add(sceneData.selectAxis.currLocalAxis);
}

function applyZoom()
{
  var cam = getCurrentCamera();
  
  if(sessionData.viewCameraProps.viewPortCamPresp == false)
  {
    cam.top    = viewPort.height * sessionData.viewCameraProps.zoomMultiplier;
    cam.bottom = -viewPort.height * sessionData.viewCameraProps.zoomMultiplier;
    cam.left   = -viewPort.width * sessionData.viewCameraProps.zoomMultiplier;
    cam.right  = viewPort.width * sessionData.viewCameraProps.zoomMultiplier;
  }
  else
  {
    cam.fov = sessionData.viewCameraProps.viewAngle;
  }
  
  var oldScale = sceneData.cursor.scale.x;
  sceneData.cursor.scale.multiplyScalar(sessionData.viewCameraProps.zoomMultiplier*2/oldScale);
}

function zoomControl(e)
{
  e = window.event || e; // old IE support

  if((sessionData.viewCameraProps.zoomMultiplier > 0.1) && (e.wheelDelta > 0))
  {
    sessionData.viewCameraProps.zoomMultiplier -= 0.05;
  }
  else if((sessionData.viewCameraProps.zoomMultiplier < 1.5) && (e.wheelDelta < 0))
  {
    sessionData.viewCameraProps.zoomMultiplier += 0.05;
  }
  else
  {}

  if((sessionData.viewCameraProps.viewAngle >= 10) && (e.wheelDelta > 0))
  {
    sessionData.viewCameraProps.viewAngle -= 3;
  }
  else if((sessionData.viewCameraProps.viewAngle <= 172) && (e.wheelDelta < 0))
  {
    sessionData.viewCameraProps.viewAngle += 3;
  }
  else
  {}

  applyZoom();

  /* Render again */
  render();

  return false;
}

function onMouseDown(e)
{
  e = window.event || e; // old IE support

  sessionData.focusElement = e.target;
  sessionData.startX = e.clientX;
  sessionData.startY = e.clientY;

  if(sessionData.focusElement == viewPort)
  {
    if(e.button == 0)
    {
      if(sessionData.objSelect.isSelected == false)
      {        
        setCursorPos(e);
      }
      if(sessionData.viewCameraProps.fixedView == false)
      {
        sessionData.viewCameraProps.lookAt.set(sceneData.cursor.position.x, sceneData.cursor.position.y, sceneData.cursor.position.z);
      }
      unSelectObject(false);
    }
    else if(e.button == 1)
    {
      sessionData.isCamRotating = true;
    }
    else if(e.button == 2)
    {
      var obj = findObjectsInPos(e);

      if(obj.length > 0)
      {
        if(sessionData.objSelect.isEdit == false)
        {
          if(sessionData.objSelect.isSelected == false)
          {
            sessionData.objSelect.selectedObjName = obj[0].object.name;
            selectObject(true);
          }
        }
        else
        {
          if(sessionData.objSelect.vertexSelected == false)
          {
            /*sessionData.objSelect.vertexSelected = true;
            sessionData.vertexSelect.selectObj = obj[0].object;
            sessionData.vertexSelect.selectObj.material.color.setHex(0xff0000);*/
          }
        }

        render();
      }
    }
  }

  e.preventDefault();
  e.stopPropagation();
  
  /* Render again */
  render();

  return false;
}

function onMouseUp(e)
{
  e = window.event || e; // old IE support

  sessionData.focusElement = e.target;

  if(e.button == 1)
  {
    sessionData.isCamRotating = false;
  }

  e.preventDefault();
  e.stopPropagation();

  return false;
}

function onMouseClick(e)
{
  e.preventDefault();
  e.stopPropagation();

  return false;
}

function onContextMenu(e)
{
  e.preventDefault();
  e.stopPropagation();

  return false;
}

function onMouseMove(e)
{
  e = window.event || e; // old IE support
  
  sessionData.lastXPos = e.clientX;
  sessionData.lastYPos = e.clientY;
  
  if(sessionData.isCamRotating == true)
  {
    rotateCamera(e);
  }
  else if(sessionData.objSelect.isDragging == true)
  {
    dragCurrElement(e);
  }
  else if(sessionData.objSelect.isScaling == true)
  {
    scaleCurrElement(e);
  }
  else if(sessionData.objSelect.isRotating == true)
  {
    rotateCurrElement(e);
  }
}

function applyRotation()
{
  var cam = getCurrentCamera();
  
  cam.position.x = 1000 * Math.sin(sessionData.yzAngle);
  cam.position.y = 1000 * Math.sin(sessionData.xzAngle);
  cam.position.z = 1000 * Math.sin(sessionData.xyAngle);
  
  sceneData.lightl.position.x = sceneData.gridSize * Math.sin(sessionData.yzAngle+PI/7); sceneData.lightr.position.x = sceneData.gridSize * Math.sin(sessionData.yzAngle-PI/7);
  sceneData.lightl.position.y = sceneData.gridSize * Math.sin(sessionData.xzAngle+PI/8); sceneData.lightr.position.y = sceneData.gridSize * Math.sin(sessionData.xzAngle-PI/8);
  sceneData.lightl.position.z = sceneData.gridSize * Math.sin(sessionData.xyAngle+PI/9); sceneData.lightr.position.z = sceneData.gridSize * Math.sin(sessionData.xyAngle-PI/9);
  
  DebugInfo("applyRotation: Camera.angle (" + ((sessionData.yzAngle/(2*PI))*360) + ", " + ((sessionData.xzAngle/(2*PI))*360) + ", " + ((sessionData.xyAngle/(2*PI))*360) + ")");
  DebugInfo("applyRotation: Camera.xyz (" + cam.position.x + ", " + cam.position.y + ", " + cam.position.z + ")");
}

function rotateCamera(e)
{
  var xDelta = (e.clientX - sessionData.startX)/240;
  var yDelta = (e.clientY - sessionData.startY)/240;

  sessionData.startX = e.clientX;
  sessionData.startY = e.clientY;

  if(sessionData.isCamRotating == true)
  {
    sessionData.xyAngle = (sessionData.xyAngle +  yDelta) % (2*PI);
    sessionData.yzAngle = (sessionData.yzAngle +  xDelta) % (2*PI);
    sessionData.xzAngle = sessionData.yzAngle + (PI/2);

    DebugInfo("rotateCamera: Camera.delta (" + xDelta + ", " + yDelta + ")");

    sceneData.viewMode = "Orthographic"; if(sessionData.viewCameraProps.viewPortCamPresp == true) { sceneData.viewMode = "Prespective"; }
    sceneData.viewMode = sceneData.viewMode + " View";
    $("#cameraStatus").html(sceneData.viewMode);
    sceneData.gridXY.visible = true; sceneData.gridXZ.visible = false; sceneData.gridYZ.visible = false;

    sessionData.viewCameraProps.camUp.set(0, 0, 1);
    applyRotation();

    /* Render again */
    render();
  }

  return false;
}

function dragCurrElement(e)
{
  var selectedObj = getSelectedObject();
  var delta = (sessionData.startX - e.clientX);
  sessionData.startX = e.clientX;

  if(sessionData.objSelect.isDragging == true)
  {
    if(sessionData.objSelect.direction == 'x') { selectedObj.position.x += delta; }
    else if(sessionData.objSelect.direction == 'y') { selectedObj.position.y += delta; }
    else if(sessionData.objSelect.direction == 'z') { selectedObj.position.z += delta; }
    else { selectedObj.position.x += delta; selectedObj.position.y += delta; selectedObj.position.z += delta; }
    render();
  }
  
  return false;
}

function scaleCurrElement(e)
{
  var selectedObj = getSelectedObject();
  var delta = (sessionData.startX - e.clientX)/300;
  sessionData.startX = e.clientX;

  if(sessionData.objSelect.isScaling == true)
  {
    if(sessionData.objSelect.direction == 'x') { selectedObj.scale.x *= (delta+1); }
    else if(sessionData.objSelect.direction == 'y') { selectedObj.scale.y *= (delta+1); }
    else if(sessionData.objSelect.direction == 'z') { selectedObj.scale.z *= (delta+1); }
    else { selectedObj.scale.multiplyScalar((delta+1)); }
    render();
  }
  
  return false;
}

function rotateCurrElement(e)
{
  var selectedObj = getSelectedObject();
  var delta = (sessionData.startX - e.clientX)/300;
  sessionData.startX = e.clientX;

  if(sessionData.objSelect.isRotating == true)
  {
    if(sessionData.objSelect.direction == 'x') { selectedObj.rotation.x += delta; }
    else if(sessionData.objSelect.direction == 'y') { selectedObj.rotation.y += delta; }
    else if(sessionData.objSelect.direction == 'z') { selectedObj.rotation.z += delta; }
    else { selectedObj.rotation.x += delta; selectedObj.rotation.y += delta; selectedObj.rotation.z += delta; }
    render();
  }

  return false;
}