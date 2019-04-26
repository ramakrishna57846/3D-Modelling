
/* PI value */
var PI = 3.14;

/* Indication if the mouse movement is used for camera rotation */
var isRotating = false;

/* dragging parameters */
var drag = {"isDragging": false, "dragObj": null, "direction": 'x', "dragXLine": null, "dragYLine": null, "dragZLine": null, "currDragLine": null};

/* select parameters */
var select = {"isSelected": false, "selectObj": null, "selectOutline": null, "wireframeMode" : false};

/* select vertices parameters*/
var vertexSelect = {"isSelected": false, "selectObj": null, "selectOutline": null};

/* Edit parameters */
var edit = {"isEdit" :false};

/* scale parameters */
var scale = {"isScaling": false, "scaleObj": null, "direction": ' '};

/* Rotate parameters */
var rotate = {"isRotating" : false , "rotateObj" : null, "rotateAxis" : 'x'};

/* Start position from where the mouse position is tracked */
var startX = 0; var startY = 0;

/* Camera position (pi, theta). The two angles made by the camera to the xy Plane (pi) and the 
   yz plane (theta). These angles are used to find out the x, y, z position of the camera */
var xyAngle = PI/4; var yzAngle = -3*PI/4; var xzAngle = -PI/4;

/* Element which currently has focus */
var focusElement;

var control;

function initControl()
{
	control = new Object();
	control.drag = drag;
	control.select = select;
	control.vertexSelect = vertexSelect;
	control.edit = edit;
	control.scale = scale;
	control.rotate = rotate;
	control.isRotating = isRotating;
	control.startX = startX;
	control.startY = startY;
	control.xyAngle = xyAngle;
	control.yzAngle = yzAngle;
	control.xzAngle = xzAngle;
	control.focusElement = focusElement;
	control.viewCameraProps = viewCameraProps;
}

function onKeyDown(e)
{
    e = window.event || e; // old IE support

    if(control.focusElement == viewPort)
    {
        switch(e.keyCode)
        {
            case 37: /* Left Arrow -> Left/Right Side View */
            {
				control.viewCameraProps.viewMode = "Orthographic"; if(control.viewCameraProps.viewPortCamPresp == true) { control.viewCameraProps.viewMode = "Prespective"; }
				if(e.shiftKey == true) { control.xyAngle = 0; control.yzAngle = 3*PI/2; control.xzAngle = 0; control.viewCameraProps.camUp.set(0, 0, -1); control.viewCameraProps.viewMode = "Left " + control.viewCameraProps.viewMode + " View"; } /* Left Side View */
				else { control.xyAngle = 0; control.yzAngle = PI/2; control.xzAngle = 0; control.viewCameraProps.camUp.set(0, 0, 1); control.viewCameraProps.viewMode = "Right " + control.viewCameraProps.viewMode + " View"; } /* Right Side View */
				$("#cameraStatus").html(control.viewCameraProps.viewMode);
				gridXY.visible = false; gridXZ.visible = false; gridYZ.visible = true;
				control.viewCameraProps.lookAt.set(0, 0, 0);
				control.viewCameraProps.fixedView = true;
            }
            break;

            case 38: /* Up Arrow -> Top/Bottom View */
            {
				control.viewCameraProps.viewMode = "Orthographic"; if(control.viewCameraProps.viewPortCamPresp == true) { control.viewCameraProps.viewMode = "Prespective"; }
				if(e.shiftKey == true) { control.xyAngle = 3*PI/2; control.yzAngle = 0; control.xzAngle = 0; control.viewCameraProps.camUp.set(0, -1, 0); control.viewCameraProps.viewMode = "Bottom " + control.viewCameraProps.viewMode + " View"; } /* Bottom View */
				else { control.xyAngle = PI/2; control.yzAngle = 0; control.xzAngle = 0; control.viewCameraProps.camUp.set(0, 1, 0); control.viewCameraProps.viewMode = "Top " + control.viewCameraProps.viewMode + " View"; } /* Top View */
				$("#cameraStatus").html(control.viewCameraProps.viewMode);
				gridXY.visible = true; gridXZ.visible = false; gridYZ.visible = false;
				control.viewCameraProps.lookAt.set(0, 0, 0);
				control.viewCameraProps.fixedView = true;
            }
            break;

            case 39: /* Right Arrow -> Front/Back View */
            {
				control.viewCameraProps.viewMode = "Orthographic"; if(control.viewCameraProps.viewPortCamPresp == true) { control.viewCameraProps.viewMode = "Prespective"; }
				if(e.shiftKey == true) { control.xyAngle = 0; control.yzAngle = 0; control.xzAngle = 3*PI/2; control.viewCameraProps.camUp.set(-1, 0, 0); control.viewCameraProps.viewMode = "Back " + control.viewCameraProps.viewMode + " View"; } /* Back View */
				else { control.xyAngle = 0; control.yzAngle = 0; control.xzAngle = PI/2; control.viewCameraProps.camUp.set(1, 0, 0); control.viewCameraProps.viewMode = "Front " + control.viewCameraProps.viewMode + " View"; } /* Front View */
				$("#cameraStatus").html(control.viewCameraProps.viewMode);
				gridXY.visible = false; gridXZ.visible = true; gridYZ.visible = false;
				control.viewCameraProps.lookAt.set(0, 0, 0);
				control.viewCameraProps.fixedView = true;
            }
            break;

            case 40: /* Down Arrow */
            {
				control.viewCameraProps.viewMode = "Orthographic"; if(control.viewCameraProps.viewPortCamPresp == true) { control.viewCameraProps.viewMode = "Prespective"; }
				control.xyAngle = PI/4; control.yzAngle = -3*PI/4; control.xzAngle = -PI/4; control.viewCameraProps.viewMode = control.viewCameraProps.viewMode + " View"; /* Presp/Orth View */
				$("#cameraStatus").html(control.viewCameraProps.viewMode);
				gridXY.visible = true; gridXZ.visible = false; gridYZ.visible = false;
				control.viewCameraProps.camUp.set(0, 0, 1);
				control.viewCameraProps.lookAt.set(cursor.position.x, cursor.position.y, cursor.position.z);
				control.viewCameraProps.fixedView = false;
            }
            break;
			
			case 27: /* ESC */
			{
				unSelectObject();
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
					cursor.position.set(0, 0, 0);
					if(control.viewCameraProps.fixedView == false)
					{
						control.viewCameraProps.lookAt.set(cursor.position.x, cursor.position.y, cursor.position.z);
					}
				}
				e.preventDefault();
			}
			break;
			
			case 80:  /* P -> Switch off/on Prespective view */
			case 112: /* p*/
			{
				if(control.viewCameraProps.viewPortCamPresp == true)
				{
					control.viewCameraProps.viewPortCamPresp = false;
				}
				else
				{
					control.viewCameraProps.viewPortCamPresp = true;
				}

				if(control.viewCameraProps.viewPortCamPresp == true) { control.viewCameraProps.viewMode = control.viewCameraProps.viewMode.replace("Orthographic", "Prespective"); }
				else { control.viewCameraProps.viewMode = control.viewCameraProps.viewMode.replace("Prespective", "Orthographic"); }
				$("#cameraStatus").html(control.viewCameraProps.viewMode);
				
				applyRotation();
				applyZoom();
			}
			break;
			
			case 71:  /* G -> Grab (drag) object */
			case 103: /* g */
			{

				if(control.select.isSelected == true)
				{
					control.scale.isScaling = false;
					control.drag.isDragging = true;
					control.rotate.isRotating = false;
					control.drag.dragObj = control.select.selectObj;
					control.drag.direction = 'x'; control.drag.currDragLine = control.drag.dragXLine;
					control.drag.dragXLine.position.set(control.drag.dragObj.position.x,control.drag.dragObj.position.y,
														control.drag.dragObj.position.z);
					viewPortScene.add(control.drag.currDragLine);
				}
			}
			break;

			case 68:  /* D -> Duplicate objects */
			case 100: /* d */
			{
				if(control.select.isSelected == true)
				{
					var currentObject = control.select.selectObj;
					unSelectObject();

					var clonedObj = currentObject.clone();
					objroot.add(clonedObj);

					control.select.isSelected = true;
					control.select.selectObj  = clonedObj;
					selectObject(clonedObj);
					control.scale.isScaling = false;
					control.drag.isDragging = true;
					control.rotate.isRotating = false;
					control.drag.dragObj = control.select.selectObj;
					control.drag.direction = 'x'; control.drag.currDragLine = control.drag.dragXLine;
					control.drag.dragXLine.position.set(control.drag.dragObj.position.x, control.drag.dragObj.position.y, control.drag.dragObj.position.z);
					viewPortScene.add(control.drag.currDragLine);
				}
			}
				break;
			
			case 83:  /* S -> Scale objects / Save scene */
			case 115: /* s */
			{
				if(e.ctrlKey == true)
				{
					exportScene();
				}
				else				
				{	
					if(control.select.isSelected == true)
					{
						control.drag.isDragging = false;
						control.scale.isScaling = true;
						control.rotate.isRotating = false;
						control.scale.scaleObj  = control.select.selectObj;
						control.scale.direction = ' ';
					}
				}
				e.preventDefault();
			}
			break;
			
			case 120: /* x -> Select x-axis */
			case 88:  /* X */
			{
				if(control.drag.isDragging == true)
				{
					control.viewPortScene.remove(control.drag.currDragLine);
					control.drag.direction = 'x'; control.drag.currDragLine = control.drag.dragXLine;
					control.drag.dragXLine.position.set(control.drag.dragObj.position.x, control.drag.dragObj.position.y, control.drag.dragObj.position.z);
					viewPortScene.add(control.drag.currDragLine);
				}
				if(control.scale.isScaling == true)
				{
					control.scale.direction = 'x';
				}
				if(control.rotate.isRotating == true)
				{
					control.rotate.rotateAxis = 'x';
				}
			}
			break;
			
			case 121: /* y -> Select y-axis */
			case 89:  /* Y */
			{
				if(control.drag.isDragging == true)
				{
					viewPortScene.remove(control.drag.currDragLine);
					control.drag.direction = 'y'; control.drag.currDragLine = control.drag.dragYLine;
					control.drag.dragYLine.position.set(control.drag.dragObj.position.x, control.drag.dragObj.position.y, control.drag.dragObj.position.z);
					viewPortScene.add(control.drag.currDragLine);
				}
				if(control.scale.isScaling == true)
				{
					control.scale.direction = 'y';
				}
				if(control.rotate.isRotating == true)
				{
					control.rotate.rotateAxis = 'y';
				}
			}
			break;
			
			case 122: /* z -> Select z-axis */
			case 90:  /* Z */
			{
				if(control.drag.isDragging == true)
				{
					viewPortScene.remove(control.drag.currDragLine);
					control.drag.direction = 'z'; control.drag.currDragLine = control.drag.dragZLine;
					control.drag.dragZLine.position.set(control.drag.dragObj.position.x, control.drag.dragObj.position.y, control.drag.dragObj.position.z);
					viewPortScene.add(control.drag.currDragLine);
				}
				if(control.scale.isScaling == true)
				{
					control.scale.direction = 'z';
				}
				if(control.rotate.isRotating == true)
				{
					control.rotate.rotateAxis = 'z';
				}
			}
			break;

			case 82:   /* R -> Rotate objects */
			case 114:  /* r */
			{
				if(control.select.isSelected == true)
				{
					control.drag.isDragging = false;
					control.scale.isScaling = false;
					control.rotate.isRotating = true;
					control.rotate.rotateObj  = control.select.selectObj;
					control.rotate.rotateAxis = 'x';
				}
			}
			break;

			case 08:  /* Backspace -> Delete objects */
			case 127: /* Delete */
			{
				if(control.select.isSelected == true)
				{
					var selectedObj = control.select.selectObj;
					if( selectedObj != null)
					{
						objroot.remove(selectedObj);
					}
					e.preventDefault();
				}
			}
			break;

			case 87:  /* W -> WIREFRAME change the object to wireframe mode */
			case 119: /* w */
			{
				if(control.select.isSelected == true)
				{
					var selectedObj = control.select.selectObj;
					if(control.select.wireframeMode == true)
					{
						control.select.wireframeMode = false;
					}
					else
					{
						control.select.wireframeMode = true;
					}
					if( selectedObj != null)
					{
						selectedObj.material.wireframe = control.select.wireframeMode;
						control.select.selectOutline.material.wireframe = control.select.wireframeMode;
					}
				}
			}
			break;

			case 69:  /* E -> EDIT - edit face,vertex or edges */
			case 101: /* e */
			{
				if(control.select.isSelected == true) {
					var selectedObj = control.select.selectObj;
					if(control.edit.isEdit == false)
					{
						control.edit.isEdit = true;
						selectedObj.remove(control.select.selectOutline);

						var vertices  = selectedObj.geometry.vertices;
						for (var i = 0; i < vertices.length; i ++)
						{
							var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe: false});
							var sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 9, 9), sphereMaterial);
							sphere.position.set(vertices[i].x,vertices[i].y,vertices[i].z);
							sphere.rotation.set(0, 0, 0);
							selectedObj.add(sphere);
						}

					}
					else
					{
						control.edit.isEdit = false;
						if(selectedObj != null)
						{
							var length = selectedObj.children.length;
							for (var i = length; i >= 0; i --)
							{
								selectedObj.remove(selectedObj.children[i]);
							}
						}
					}
					render();
				}
			}
			break;
			
			case 78: /* N -> new */
			case 110: /* n */
			{
				objroot = undefined;
				createDefaultScene();

				e.preventDefault();
			}
			break;

            default:
                break;
        }
    }
	
	var cam = getCurrentCamera();
	
	/* Calculate camera position */
	cam.position.x = 1000 * Math.sin(control.yzAngle);
	cam.position.y = 1000 * Math.sin(control.xzAngle);
	cam.position.z = 1000 * Math.sin(control.xyAngle);
	
	lightl.position.x = 1000 * Math.sin(control.yzAngle+PI/7); lightr.position.x = 1000 * Math.sin(control.yzAngle-PI/7);
	lightl.position.y = 1000 * Math.sin(control.xzAngle+PI/8); lightr.position.y = 1000 * Math.sin(control.xzAngle-PI/8);
	lightl.position.z = 1000 * Math.sin(control.xyAngle+PI/9); lightr.position.z = 1000 * Math.sin(control.xyAngle-PI/9);
	
    /* Render again */
    render();
	
    return false;
}

function applyZoom()
{
	var cam = getCurrentCamera();
	
	if(control.viewCameraProps.viewPortCamPresp == false)
	{
		cam.top    = viewPort.height * control.viewCameraProps.zoomMultiplier;
		cam.bottom = -viewPort.height * control.viewCameraProps.zoomMultiplier;
		cam.left   = -viewPort.width * control.viewCameraProps.zoomMultiplier;
		cam.right  = viewPort.width * control.viewCameraProps.zoomMultiplier;
	}
	else
	{
		cam.fov = control.viewCameraProps.viewAngle;
	}
	
	var oldScale = cursor.scale.x;
	cursor.scale.multiplyScalar(control.viewCameraProps.zoomMultiplier*2/oldScale);
}

function zoomControl(e)
{
    e = window.event || e; // old IE support

	if((control.viewCameraProps.zoomMultiplier > 0.1) && (e.wheelDelta > 0))
	{
		control.viewCameraProps.zoomMultiplier -= 0.05;
	}
	else if((control.viewCameraProps.zoomMultiplier < 1.5) && (e.wheelDelta < 0))
	{
		control.viewCameraProps.zoomMultiplier += 0.05;
	}
	else
	{}

	if((control.viewCameraProps.viewAngle >= 10) && (e.wheelDelta > 0))
	{
		control.viewCameraProps.viewAngle -= 3;
	}
	else if((control.viewCameraProps.viewAngle <= 172) && (e.wheelDelta < 0))
	{
		control.viewCameraProps.viewAngle += 3;
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

	control.focusElement = e.target;

    if(control.focusElement == viewPort)
    {
		if(e.button == 0)
		{
			if(control.select.isSelected == false)
			{				
				setCursorPos(e);
			}
			if(control.viewCameraProps.fixedView == false)
			{
				control.viewCameraProps.lookAt.set(cursor.position.x, cursor.position.y, cursor.position.z);
			}
			unSelectObject();
		}
        else if(e.button == 1)
        {
			control.isRotating = true;
			control.startX = e.clientX;
			control.startY = e.clientY;
        }
		else if(e.button == 2)
		{
			var obj = findObjectsInPos(e);

			if(obj.length > 0)
			{
				if(control.edit.isEdit == false)
				{
					if(control.select.isSelected == false)
					{
						control.select.isSelected = true;
						control.select.selectObj  = obj[0].object;
						control.select.selectOutline = selectObject(control.select.selectObj);
						control.select.selectObj.material.wireframe = control.select.wireframeMode;
						control.select.selectOutline.material.wireframe = control.select.wireframeMode;
						control.startX = e.clientX;
						control.startY = e.clientY;
					}
				}
				else
				{
					if(control.vertexSelect.isSelected == false)
					{
						control.vertexSelect.isSelected = true;
						control.vertexSelect.selectObj = obj[0].object;
						control.vertexSelect.selectOutline = selectObject(control.vertexSelect.selectObj);
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

	control.focusElement = e.target;

    if(e.button == 1)
    {
		control.isRotating = false;
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
	
	if(control.isRotating == true)
	{
		rotateCamera(e);
	}
	else if(control.drag.isDragging == true)
	{
		dragCurrElement(e);
	}
	else if(control.scale.isScaling == true)
	{
		scaleCurrElement(e);
	}
	else if(control.rotate.isRotating == true)
	{
		rotateCurrElement(e);
	}
}

function applyRotation()
{
	var cam = getCurrentCamera();
	
	cam.position.x = 1000 * Math.sin(control.yzAngle);
	cam.position.y = 1000 * Math.sin(control.xzAngle);
	cam.position.z = 1000 * Math.sin(control.xyAngle);
	
	lightl.position.x = 1000 * Math.sin(control.yzAngle+PI/7); lightr.position.x = 1000 * Math.sin(control.yzAngle-PI/7);
	lightl.position.y = 1000 * Math.sin(control.xzAngle+PI/8); lightr.position.y = 1000 * Math.sin(control.xzAngle-PI/8);
	lightl.position.z = 1000 * Math.sin(control.xyAngle+PI/9); lightr.position.z = 1000 * Math.sin(control.xyAngle-PI/9);
	
	DebugInfo("applyRotation: Camera.angle (" + ((control.yzAngle/(2*PI))*360) + ", " + ((control.xzAngle/(2*PI))*360) + ", " + ((control.xyAngle/(2*PI))*360) + ")");
	DebugInfo("applyRotation: Camera.xyz (" + cam.position.x + ", " + cam.position.y + ", " + cam.position.z + ")");
}

function rotateCamera(e)
{
    var xDelta = (e.clientX - control.startX)/240;
    var yDelta = (e.clientY - control.startY)/240;

	control.startX = e.clientX;
	control.startY = e.clientY;

    if(control.isRotating == true)
    {
		control.xyAngle = (control.xyAngle +  yDelta) % (2*PI);
		control.yzAngle = (control.yzAngle +  xDelta) % (2*PI);
		control.xzAngle = control.yzAngle + (PI/2);

		DebugInfo("rotateCamera: Camera.delta (" + xDelta + ", " + yDelta + ")");

		control.viewCameraProps.viewMode = "Orthographic"; if(control.viewCameraProps.viewPortCamPresp == true) { control.viewCameraProps.viewMode = "Prespective"; }
		control.viewCameraProps.viewMode = control.viewCameraProps.viewMode + " View";
		$("#cameraStatus").html(control.viewCameraProps.viewMode);
		gridXY.visible = true; gridXZ.visible = false; gridYZ.visible = false;

		control.viewCameraProps.camUp.set(0, 0, 1);
        applyRotation();

        /* Render again */
        render();
    }

    return false;
}

function dragCurrElement(e)
{
	var delta = (control.startX - e.clientX);
	control.startX = e.clientX;

	if(control.drag.isDragging == true)
	{
		if(control.drag.direction == 'x') { control.drag.dragObj.position.x += delta; }
		else if(control.drag.direction == 'y') { control.drag.dragObj.position.y += delta; }
		else if(control.drag.direction == 'z') { control.drag.dragObj.position.z += delta; }
		else { control.drag.dragObj.position.x += delta; control.drag.dragObj.position.y += delta; control.drag.dragObj.position.z += delta; }
		render();
	}
	
	return false;
}

function scaleCurrElement(e)
{
	var delta = (control.startX - e.clientX)/300;
	control.startX = e.clientX;

	if(control.scale.isScaling == true)
	{
		if(control.scale.direction == 'x') { control.scale.scaleObj.scale.x *= (delta+1); }
		else if(control.scale.direction == 'y') { control.scale.scaleObj.scale.y *= (delta+1); }
		else if(control.scale.direction == 'z') { control.scale.scaleObj.scale.z *= (delta+1); }
		else { control.scale.scaleObj.scale.multiplyScalar((delta+1)); }
		render();
	}
	
	return false;
}

function rotateCurrElement(e)
{
	var delta = (control.startX - e.clientX)/300;
	control.startX = e.clientX;

	if(control.rotate.isRotating == true)
	{
		if(control.rotate.rotateAxis == 'x') { control.rotate.rotateObj.rotation.x += delta; }
		else if(control.rotate.rotateAxis == 'y') { control.rotate.rotateObj.rotation.y += delta; }
		else if(control.rotate.rotateAxis == 'z') { control.rotate.rotateObj.rotation.z += delta; }
		else { control.rotate.rotateObj.rotation.multiplyScalar((delta+1)); }
		render();
	}

	return false;
}