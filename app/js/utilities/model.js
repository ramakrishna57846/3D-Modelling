
function createGridLines(gridSize, numOfGridLines, numOfSubGridLines)
{
  var scale    = gridSize/numOfGridLines;
  var subScale = scale/numOfSubGridLines;
  var geometry = new THREE.Geometry();
  
  geometry.vertices.push(new THREE.Vector3( - gridSize/2, 0, 0 ) );
  geometry.vertices.push(new THREE.Vector3( gridSize/2, 0, 0 ) );

  linesMaterialX   = new THREE.LineBasicMaterial( { color: 0x990000, opacity: .3, linewidth: .2 } );
  linesMaterialY   = new THREE.LineBasicMaterial( { color: 0x009900, opacity: .3, linewidth: .2 } );
  linesMaterialZ   = new THREE.LineBasicMaterial( { color: 0x000099, opacity: .3, linewidth: .2 } );
  linesMaterial    = new THREE.LineBasicMaterial( { color: 0x333333, opacity: .3, linewidth: .2 } );
  sublinesMaterial = new THREE.LineBasicMaterial( { color: 0x121212, opacity: .1, linewidth: .1 } );
  planeMaterial    = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0 } );
  
  sceneData.gridXY = new THREE.Object3D();
  sceneData.gridXZ = new THREE.Object3D();
  sceneData.gridYZ = new THREE.Object3D();
  
  sceneData.gridXY.visible = true; sceneData.gridXZ.visible = false; sceneData.gridYZ.visible = false;
  sceneData.gridXY.name = "gridXY"; sceneData.gridXZ.name = "gridXZ"; sceneData.gridYZ.name = "gridYZ";
  
  sceneData.gridXYPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  sceneData.gridXZPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  sceneData.gridYZPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
  
  for ( var i = 0; i <= numOfGridLines; i ++ ) 
  {
      var linex = new THREE.Line( geometry, ((i == (numOfGridLines/2))?(linesMaterialX):(linesMaterial)) );
      linex.position.y = ( i * scale ) - (gridSize/2);
      sceneData.gridXY.add( linex );

      var liney = new THREE.Line( geometry, ((i == (numOfGridLines/2))?(linesMaterialY):(linesMaterial)) );
      liney.position.x = ( i * scale ) - (gridSize/2);
      liney.rotation.z = 90 * Math.PI / 180;
      sceneData.gridXY.add( liney );

      if(i >= numOfGridLines) break;

      for( var j = 1; j <= (numOfSubGridLines-1); j++)
      {
          var linesx = new THREE.Line( geometry, sublinesMaterial );
          linesx.position.y = linex.position.y + (j * subScale);
          sceneData.gridXY.add( linesx );

          var linesy = new THREE.Line( geometry, sublinesMaterial );
          linesy.position.x = liney.position.x + (j * subScale);
          linesy.rotation.z = 90 * Math.PI / 180;
          sceneData.gridXY.add( linesy );
      }
  }

  for ( var i = 0; i <= numOfGridLines; i ++ ) 
  {
    var linex = new THREE.Line( geometry, ((i == (numOfGridLines/2))?(linesMaterialX):(linesMaterial)) );
    linex.position.z = ( i * scale ) - (gridSize/2);
    sceneData.gridXZ.add( linex );

    var linez = new THREE.Line( geometry, ((i == (numOfGridLines/2))?(linesMaterialZ):(linesMaterial)) );
    linez.position.x = ( i * scale ) - (gridSize/2);
    linez.rotation.y = 90 * Math.PI / 180;
    sceneData.gridXZ.add( linez );

    if(i >= numOfGridLines) break;

    for( var j = 1; j <= (numOfSubGridLines-1); j++)
    {
      var linesx = new THREE.Line( geometry, sublinesMaterial );
      linesx.position.z = linex.position.z + (j * subScale);
      sceneData.gridXZ.add( linesx );
      
      var linesz = new THREE.Line( geometry, sublinesMaterial );
      linesz.position.x = linez.position.x + (j * subScale);
      linesz.rotation.y = 90 * Math.PI / 180;
      sceneData.gridXZ.add( linesz );
    }
  }
  
  for ( var i = 0; i <= numOfGridLines; i ++ ) 
  {
    var liney = new THREE.Line( geometry, ((i == (numOfGridLines/2))?(linesMaterialY):(linesMaterial)) );
    liney.position.z = ( i * scale ) - (gridSize/2);
    liney.rotation.z = 90 * Math.PI / 180;
    sceneData.gridYZ.add( liney );

    var linez = new THREE.Line( geometry, ((i == (numOfGridLines/2))?(linesMaterialZ):(linesMaterial)) );
    linez.position.y = ( i * scale ) - (gridSize/2);
    linez.rotation.y = 90 * Math.PI / 180;
    sceneData.gridYZ.add( linez );

    if(i >= numOfGridLines) break;

    for( var j = 1; j <= (numOfSubGridLines-1); j++)
    {
      var linesy = new THREE.Line( geometry, sublinesMaterial );
      linesy.position.z = liney.position.z + (j * subScale);
      linesy.rotation.z = 90 * Math.PI / 180;
      sceneData.gridYZ.add( linesy );
      
      var linesz = new THREE.Line( geometry, sublinesMaterial );
      linesz.position.y = linez.position.y + (j * subScale);
      linesz.rotation.y = 90 * Math.PI / 180;
      sceneData.gridYZ.add( linesz );
    }
  }
  
  /* Add the grids to the scene */
  sceneData.viewPortScene.add(sceneData.gridXY);
  sceneData.viewPortScene.add(sceneData.gridXZ);
  sceneData.viewPortScene.add(sceneData.gridYZ);
}

function createVisualAids(size)
{
  var geometry;
  
  sceneData.cursor = new THREE.Object3D();
  
  linesMaterial  = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: .3, linewidth: 1 } );
  linesMaterialX = new THREE.LineBasicMaterial( { color: 0x00ffff, opacity: .9, linewidth: 1 } );
  linesMaterialY = new THREE.LineBasicMaterial( { color: 0xff00ff, opacity: .9, linewidth: 1 } );
  linesMaterialZ = new THREE.LineBasicMaterial( { color: 0xffff00, opacity: .9, linewidth: 1 } );
  
  sceneData.selectAxis.localAxis = new THREE.Object3D();
  
  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( -size, 0, 0 ) );
  geometry.vertices.push(new THREE.Vector3( size, 0, 0 ) );
  sceneData.selectAxis.localXAxis = new THREE.Line( geometry, linesMaterialX );
  sceneData.selectAxis.localAxis.add(new THREE.Line( geometry, linesMaterialX ));
  
  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( 0, -size, 0 ) );
  geometry.vertices.push(new THREE.Vector3( 0, size, 0 ) );
  sceneData.selectAxis.localYAxis = new THREE.Line( geometry, linesMaterialY );
  sceneData.selectAxis.localAxis.add(new THREE.Line( geometry, linesMaterialY ));
  
  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( 0, 0, -size ) );
  geometry.vertices.push(new THREE.Vector3( 0, 0, size ) );
  sceneData.selectAxis.localZAxis = new THREE.Line( geometry, linesMaterialZ );
  sceneData.selectAxis.localAxis.add(new THREE.Line( geometry, linesMaterialZ ));
  
  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( -15, 0, 0 ) );
  geometry.vertices.push(new THREE.Vector3( 15, 0, 0 ) );
  var curX = new THREE.Line( geometry, linesMaterialX );
  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( 0, -15, 0 ) ); 
  geometry.vertices.push(new THREE.Vector3( 0, 15, 0 ) );
  var curY = new THREE.Line( geometry, linesMaterialY );
  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3( 0, 0, -15 ) );
  geometry.vertices.push(new THREE.Vector3( 0, 0, 15 ) );
  var curZ = new THREE.Line( geometry, linesMaterialZ );
  
  /* Add the cursor to the scene */
  sceneData.cursor.add(curX); sceneData.cursor.add(curY); sceneData.cursor.add(curZ);
  
  sceneData.cursor.name = "cursor";
  sceneData.viewPortScene.add(sceneData.cursor);
}

function normalizeObjects(obj)
{
  /* Re-set the operations */
  sceneData.isEditDone = false;
  sceneData.isObjSelectDone = false;
  sceneData.isVefSelectDone = false;
  
  /* Remove object root from scene */
  sceneData.viewPortScene.remove(sceneData.objroot);

  /* Convert objects to string and back to 3D Objects (i.e. Now with generic geometry */
  sceneData.objroot = sceneData.loader.parse(sceneData.exporter.parse(sceneData.objroot));
  sceneData.objroot.name = 'objroot';
  
  /* Add it back to the scene */
  sceneData.viewPortScene.add(sceneData.objroot);
  
  /* Re-select the object if required */
  selectObject(false);
  
  /* Re-enter edit mode if required */
  enterEditMode(false);
}

function createCube()
{
  var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x999999, wireframe: false});
  cube = new THREE.Mesh(new THREE.BoxGeometry(90, 90, 90), cubeMaterial);
  cube.position.set(sceneData.cursor.position.x, sceneData.cursor.position.y, sceneData.cursor.position.z);
  cube.rotation.set(0, 0, 0);
  
  cube.name = "cube" + sessionData.numCubes++;
  sceneData.objroot.add(cube);
  render();
  saveStep('Added-Cube');
}

function createSphere()
{
  var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x999999, wireframe: false});
  sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 16, 16), sphereMaterial);
  sphere.position.set(sceneData.cursor.position.x, sceneData.cursor.position.y, sceneData.cursor.position.z);
  sphere.rotation.set(0, 0, 0);
  
  sphere.name = "sphere" + sessionData.numSpehers++;
  sceneData.objroot.add(sphere);
  render();
  saveStep('Added-Sphere');
}

function createCylinder()
{
  var cylinderMaterial = new THREE.MeshLambertMaterial( {color: 0x999999, wireframe: false} );
  cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 50, 50, 200, 32 ), cylinderMaterial );
  cylinder.position.set(sceneData.cursor.position.x, sceneData.cursor.position.y, sceneData.cursor.position.z);
  cylinder.rotation.set(0, 0, 0);

  cylinder.name = "cylinder" + sessionData.numCylinders++;
  sceneData.objroot.add(cylinder);
  render();
  saveStep('Added-Cylinder');
}

function createCone()
{
  var coneMaterial = new THREE.MeshLambertMaterial( {color: 0x999999, wireframe: false} );
  cone = new THREE.Mesh(new THREE.CylinderGeometry( 0, 50, 200, 32,false), coneMaterial );
  cone.position.set(sceneData.cursor.position.x, sceneData.cursor.position.y, sceneData.cursor.position.z);
  cone.rotation.set(0, 0, 0);

  cone.name = "cone" + sessionData.numCones++;
  sceneData.objroot.add(cone);
  render();
  saveStep('Added-Cone');
}

function getChildObjectByName(obj, objName)
{
  for(var i = 0; i < obj.children.length; i++)
  {
    if(obj.children[i].name == objName)
    {
      return obj.children[i];
    }
    else
    {
      var retObj = getChildObjectByName(obj.children[i], objName);
      
      if(retObj != null)
      {
        return retObj;
      }
    }
  }
  
  return null;
}

function getObjectByName(objName)
{
  return getChildObjectByName(sceneData.objroot, objName);
}

function getSelectedObject()
{
  if(sessionData.objSelect.isSelected == true)
  {
    return getObjectByName(sessionData.objSelect.selectedObjName);
  }
  
  return null;
}

function getSelectedObjectOutline()
{
  if(sessionData.objSelect.isSelected == true)
  {
    return getObjectByName(sessionData.objSelect.selectedObjName + '_outline');
  }
  
  return null;
}

function selectObject(forceSelect)
{
  var selectedObj = getObjectByName(sessionData.objSelect.selectedObjName);
  
  if(selectedObj != null)
  {
    if(forceSelect == true)
    {
      sessionData.objSelect.isSelected = true;
    }

    if((sessionData.objSelect.isSelected == true) && (sceneData.isObjSelectDone == false))
    {
      sceneData.isObjSelectDone = true;
      
      var outlineMaterial  = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.BackSide , wireframe: false} );
      var outline = new THREE.Mesh(selectedObj.geometry, outlineMaterial);
      outline.scale.multiplyScalar(1.01);
      outline.position = selectedObj.position;
      outline.name = selectedObj.name + "_outline";
      outline.userData.tempObject = true;
      selectedObj.add(outline);
   
      selectedObj.material.wireframe = sessionData.objSelect.wireframeMode;
      outline.material.wireframe     = sessionData.objSelect.wireframeMode;
    }
  }
}

function unSelectObject(allSelection)
{
  var selectedObj = getSelectedObject();
  var selectObjOutline = getSelectedObjectOutline();
  
  if((sessionData.objSelect.isEdit == true) || (allSelection == true))
  {
    /*selectedVef = getSelectedVef();
    
    if(selectedVef != null)
    {
      selectedVef.material.color.setHex(0xffffff);
    }*/
    sessionData.objSelect.vertexSelected = false;
    sessionData.objSelect.edgeSelected = false;
    sessionData.objSelect.faceSelected = false;
    sceneData.isVefSelectDone = false;
  }
  
  if((sessionData.objSelect.isEdit == false) || (allSelection == true))
  {
    if(selectedObj != null)
    {
      selectedObj.remove(selectObjOutline);
    }
    sessionData.objSelect.isSelected      = false;
    sessionData.objSelect.selectedObjName = '';
    sceneData.isObjSelectDone = false;
  }

  sessionData.objSelect.isRotating = false;
  sessionData.objSelect.isScaling  = false;
  sessionData.objSelect.isDragging = false;
  
  sceneData.viewPortScene.remove(sceneData.selectAxis.currLocalAxis);
  sceneData.selectAxis.currLocalAxis = null;
}

function enterEditMode(forceEdit)
{
  var selectedObj = getSelectedObject();
  var selectObjOutline = getSelectedObjectOutline();
  
  if(forceEdit == true)
  {
    sessionData.objSelect.isEdit = true;
  }
  
  if((sessionData.objSelect.isEdit == true) &&
     (sceneData.isEditDone == false))
  {
    sceneData.isEditDone = true;
    selectObjOutline.visible = false;

    var vertices  = selectedObj.geometry.vertices;
    for (var i = 0; i < vertices.length; i++)
    {
      var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe: false});
      var sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 9, 9), sphereMaterial);
      sphere.position.set(vertices[i].x,vertices[i].y,vertices[i].z);
      sphere.rotation.set(0, 0, 0);
      sphere.userData.tempObject = true;
      selectedObj.add(sphere);
    }
  }
}

function leaveEditMode()
{
  if(sessionData.objSelect.isEdit == true)
  {
    /* Unselect any selection in edit mode */
    unSelectObject(false);
  }
  
  var selectedObj = getSelectedObject();
  var selectObjOutline = getSelectedObjectOutline();

  var length = selectedObj.children.length;
  for (var i = length; i >= 0; i --)
  {
    if(selectedObj.children[i] != selectObjOutline)
    {
      selectedObj.remove(selectedObj.children[i]);
    }
  }
  
  sessionData.objSelect.isEdit = false;
  selectObjOutline.visible = true;
  sceneData.isEditDone = false;
}