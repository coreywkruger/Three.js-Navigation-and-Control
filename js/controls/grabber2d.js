THREE.grabber2d = function( object, camera, cursor, scalex, scaley, domElement ) {
	
	var _this = this;
	this.camera = camera;
	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;
	this.scaleW = scalex;
    this.scaleH = scaley;
	this.useCursor = true;
	if ( cursor == undefined ) {
		this.useCursor = false;
	} else {
		this.cursor = cursor;
	}	

	this.prevPosition = new THREE.Vector3().copy( this.object.position );
	this.direction = new THREE.Vector3(0,0,0);
	this.useX = true;
	this.useY = true;
	var dragStart = new THREE.Vector3(0,0,0);
	var dragEnd = new THREE.Vector3(0,0,0);
	var clicked = false;
	var moving = false;
	
    this.getMouseVector = function(element, clientX, clientY) {
        return {
		    x:   _this.scaleW * ( clientX - element.offsetLeft - element.style.width.slice(0, -2) / 2 - element.style.padding.slice(0, -2)),
		    y: - _this.scaleH * ( clientY - element.offsetTop - element.style.height.slice(0, -2) / 2 - element.style.padding.slice(0, -2)),
		    z: - _this.camera.near
        };
    }

	this.update = function() {
		if ( _this.useCursor == true ) _this.cursor.position.copy(dragStart), _this.cursor.position.setZ(0);
		if ( clicked && moving ) {
			_this.updatePosition();
		} else if (moving) {
			moving = false;
		}
	}
	
	this.updatePosition = function () {
		_this.direction.subVectors( dragEnd, dragStart );
		if ( _this.useX == false ) _this.direction.x = 0;
		if ( _this.useY == false ) _this.direction.y = 0;
		_this.object.position.set(
			_this.prevPosition.x + _this.direction.x,
			_this.prevPosition.y + _this.direction.y,
			0
		);
	}
	
	this.useAxisX = function ( flag ) {
		_this.useX = flag;
	}
	
	this.useAxisY = function ( flag ) {
		_this.useY = flag;
	}
	
    this.updateScaling = function (x, y) {
        _this.scaleW = x;
        _this.scaleH = y;
    }
    
    this.reset = function (x, y, z) {
        _this.object.position.set(x, y, z);
        _this.prevPosition.set(x, y, z);
    }
    
	function mousedown ( event ) {
		if (!event.button == 0) return;
		event.stopPropagation();
		dragStart.copy( _this.getMouseVector( _this.domElement, event.clientX, event.clientY ) );
		var point = new THREE.Vector3(0,0,-10);
        var ray = new THREE.Raycaster(dragStart, point.normalize(), 0, 500);
		var intersects = ray.intersectObject(_this.object);
		if (intersects.length > 0) clicked = true;
	}
	
	function mousemove ( event ) {
		if (!clicked) return;
		event.stopPropagation();
		dragEnd.copy( _this.getMouseVector( _this.domElement, event.clientX, event.clientY ) );
		moving = true;
	}
	
	function mouseup ( event ) {
		event.stopPropagation();
		_this.prevPosition.copy(_this.object.position);
		clicked = false;
	}
	
	this.domElement.addEventListener('mousedown', mousedown, false);
	document.addEventListener('mousemove', mousemove, false);
	document.addEventListener('mouseup', mouseup, false);
}