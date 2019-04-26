
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
    
    for ( var i = 0; i <= numOfGridLines; i ++ ) 
	{
        var linex = new THREE.Line( geometry, ((i == (numOfGridLines/2))?(linesMaterialX):(linesMaterial)) );
        linex.position.y = ( i * scale ) - (gridSize/2);
        gridXY.add( linex );

        var liney = new THREE.Line( geometry, ((i == (numOfGridLines/2))?(linesMaterialY):(linesMaterial)) );
        liney.position.x = ( i * scale ) - (gridSize/2);
        liney.rotation.z = 90 * Math.PI / 180;
        gridXY.add( liney );

        if(i >= numOfGridLines) break;

        for( var j = 1; j <= (numOfSubGridLines-1); j++)
        {
            var linesx = new THREE.Line( geometry, sublinesMaterial );
            linesx.position.y = linex.position.y + (j * subScale);
            gridXY.add( linesx );

            var linesy = new THREE.Line( geometry, sublinesMaterial );
            linesy.position.x = liney.position.x + (j * subScale);
            linesy.rotation.z = 90 * Math.PI / 180;
            gridXY.add( linesy );
        }
    }

	gridXYPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
	
	for ( var i = 0; i <= numOfGridLines; i ++ ) 
	{
		var linex = new THREE.Line( geometry, ((i == (numOfGridLines/2))?(linesMaterialX):(linesMaterial)) );
		linex.position.z = ( i * scale ) - (gridSize/2);
		gridXZ.add( linex );

		var linez = new THREE.Line( geometry, ((i == (numOfGridLines/2))?(linesMaterialZ):(linesMaterial)) );
		linez.position.x = ( i * scale ) - (gridSize/2);
		linez.rotation.y = 90 * Math.PI / 180;
		gridXZ.add( linez );

		if(i >= numOfGridLines) break;

		for( var j = 1; j <= (numOfSubGridLines-1); j++)
		{
			var linesx = new THREE.Line( geometry, sublinesMaterial );
			linesx.position.z = linex.position.z + (j * subScale);
			gridXZ.add( linesx );
		  
			var linesz = new THREE.Line( geometry, sublinesMaterial );
			linesz.position.x = linez.position.x + (j * subScale);
			linesz.rotation.y = 90 * Math.PI / 180;
			gridXZ.add( linesz );
		}
	}
	
	gridXZPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
	
	for ( var i = 0; i <= numOfGridLines; i ++ ) 
	{
		var liney = new THREE.Line( geometry, ((i == (numOfGridLines/2))?(linesMaterialY):(linesMaterial)) );
		liney.position.z = ( i * scale ) - (gridSize/2);
		liney.rotation.z = 90 * Math.PI / 180;
		gridYZ.add( liney );

		var linez = new THREE.Line( geometry, ((i == (numOfGridLines/2))?(linesMaterialZ):(linesMaterial)) );
		linez.position.y = ( i * scale ) - (gridSize/2);
		linez.rotation.y = 90 * Math.PI / 180;
		gridYZ.add( linez );

		if(i >= numOfGridLines) break;

		for( var j = 1; j <= (numOfSubGridLines-1); j++)
		{
			var linesy = new THREE.Line( geometry, sublinesMaterial );
			linesy.position.z = liney.position.z + (j * subScale);
			linesy.rotation.z = 90 * Math.PI / 180;
			gridYZ.add( linesy );
		  
			var linesz = new THREE.Line( geometry, sublinesMaterial );
			linesz.position.y = linez.position.y + (j * subScale);
			linesz.rotation.y = 90 * Math.PI / 180;
			gridYZ.add( linesz );
		}
	}
	
	gridYZPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
}

function createVisualAids(size)
{
	var geometry;
	
	linesMaterial  = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: .3, linewidth: 1 } );
	linesMaterialX = new THREE.LineBasicMaterial( { color: 0x00ffff, opacity: .9, linewidth: 1 } );
	linesMaterialY = new THREE.LineBasicMaterial( { color: 0xff00ff, opacity: .9, linewidth: 1 } );
	linesMaterialZ = new THREE.LineBasicMaterial( { color: 0xffff00, opacity: .9, linewidth: 1 } );
	
	geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( -size, 0, 0 ) );
    geometry.vertices.push(new THREE.Vector3( size, 0, 0 ) );
	control.drag.dragXLine = new THREE.Line( geometry, linesMaterial );
	
	geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( 0, -size, 0 ) );
    geometry.vertices.push(new THREE.Vector3( 0, size, 0 ) );
	control.drag.dragYLine = new THREE.Line( geometry, linesMaterial );
	
	geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( 0, 0, -size ) );
    geometry.vertices.push(new THREE.Vector3( 0, 0, size ) );
	control.drag.dragZLine = new THREE.Line( geometry, linesMaterial );
	
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
	cursor.add(curX); cursor.add(curY); cursor.add(curZ);
	cursor.renderOrder = 1000;

	control.drag.currDragLine = null;
}

function createCube()
{
	var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x999999, wireframe: false});
	cube = new THREE.Mesh(new THREE.BoxGeometry(90, 90, 90), cubeMaterial);
	cube.position.set(cursor.position.x, cursor.position.y, cursor.position.z);
	cube.rotation.set(0, 0, 0);
	
	objroot.add(cube);
	render();
}

function createSphere()
{
	var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x999999, wireframe: false});
	sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 16, 16), sphereMaterial);
	sphere.position.set(cursor.position.x, cursor.position.y, cursor.position.z);
	sphere.rotation.set(0, 0, 0);
	
	objroot.add(sphere);
	render();
}

function createCylinder()
{
	var cylinderMaterial = new THREE.MeshLambertMaterial( {color: 0x999999, wireframe: false} );
	cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 50, 50, 200, 32 ), cylinderMaterial );
	cylinder.position.set(cursor.position.x, cursor.position.y, cursor.position.z);
	cylinder.rotation.set(0, 0, 0);

	objroot.add(cylinder);
	render();
}

function createCone()
{
	var coneMaterial = new THREE.MeshLambertMaterial( {color: 0x999999, wireframe: false} );
	cone = new THREE.Mesh(new THREE.CylinderGeometry( 0, 50, 200, 32,false), coneMaterial );
	cone.position.set(cursor.position.x, cursor.position.y, cursor.position.z);
	cone.rotation.set(0, 0, 0);

	objroot.add(cone);
	render();
}


function selectObject(obj)
{
	var outlineMaterial  = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.BackSide , wireframe: false} );
	var outline = new THREE.Mesh(obj.geometry, outlineMaterial);
	outline.scale.multiplyScalar(1.01);
	outline.position = obj.position;
	obj.add(outline);
	return outline;
}

function unSelectObject()
{
	if(control.edit.isEdit == true)
	{
		if(control.vertexSelect.selectObj != null) { control.vertexSelect.selectObj.remove(control.vertexSelect.selectOutline); }
		control.vertexSelect.isSelected = false;
		control.vertexSelect.selectObj  = null;
	}
	else
	{
		if(control.select.selectObj != null) { control.select.selectObj.remove(control.select.selectOutline); }
		control.select.isSelected = false;
		control.select.selectObj  = null;
	}

	control.rotate.isRotating = false;
	control.scale.isScaling   = false;
	control.drag.isDragging   = false;
	
	viewPortScene.remove(control.drag.currDragLine);
	control.drag.currDragLine = null;
	control.scale.scaleObj    = null;
}