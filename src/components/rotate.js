AFRAME.registerComponent('rotate', {
    schema: {
      x: {type: 'number'},
      y: {type: 'number'},
      z: {type: 'number'}
    },
  
    init: function () {
      // Do something when component first attached.
    },
  
    update: function () {
      // Do something when component's data is updated.
    },
  
    remove: function () {
      // Do something the component or its entity is detached.
    },
  
    tick: function (time, timeDelta) {
      // Do something on every scene tick or frame.
      /* this.el.object3D.rotation.set(
        THREE.Math.degToRad(this.el.getAttribute('rotation').x),
        THREE.Math.degToRad(this.el.getAttribute('rotation').y),
        THREE.Math.degToRad(this.el.getAttribute('rotation').z+ this.data.speed)
      ); */
      this.el.object3D.rotation.x += (this.data.x) ? THREE.Math.degToRad(this.data.x) : 0;
      this.el.object3D.rotation.y += (this.data.y) ? THREE.Math.degToRad(this.data.y) : 0;
      this.el.object3D.rotation.z += (this.data.z) ? THREE.Math.degToRad(this.data.z) : 0;
    }
  });