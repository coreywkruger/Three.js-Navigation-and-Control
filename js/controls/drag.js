THREE.dragger = function( object, canvas, scalex, scaley, domElement) {
	
	var _this = this;
	this.object = object;
	this.object.rotationOrder = 'YXZ';
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	var dragStart = new THREE.Vector3(0,0,0);
	var dragEnd = new THREE.Vector3(0,0,0);
	var clicked = false;
	var moving = false;
	this.direction = new THREE.Vector3(0,0,0);
	
	
    function getMouseVector3d(canvas, clientX, clientY) {
        var rect = canvas.getBoundingClientRect();
        var vec = new THREE.Vector3(scalex * ( clientX - rect.left - canvas.width / 2 ), - scaley * ( clientY - rect.top - canvas.height / 2 ), 0);
        vec.applyEuler(_this.object.rotation, _this.object.rotationOrder);
        return vec;
    }

	this.getDragLine = function() {
		if (clicked && moving) {
			_this.direction.subVectors(dragEnd, dragStart);
			moving = false;
			return _this.direction;
			//console.log(_this.direction);
		}
		return _this.direction;
		_this.direction.set(0, 0, 0);
	}
	
	function mousedown (event) {
		var vec =  getMouseVector3d( canvas, event.clientX, event.clientY );
		dragStart.set(vec.x, vec.y, vec.z);
		clicked = true;
	}
	
	function mousemove (event) {
		if (!clicked) return;
		var vec = getMouseVector3d( canvas, event.clientX, event.clientY );	
		dragEnd.set(vec.x, vec.y, vec.z);
		moving = true;
	}
	
	function mouseup (event) {
		dragEnd.set(0, 0, 0);
		dragStart.set(0, 0, 0);
		clicked = false;
	}
	
	this.domElement.addEventListener('mousedown', mousedown, false);
	this.domElement.addEventListener('mousemove', mousemove, false);
	this.domElement.addEventListener('mouseup', mouseup, false);
}