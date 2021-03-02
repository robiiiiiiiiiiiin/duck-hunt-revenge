AFRAME.registerComponent('bind-rotation', {
  schema: {
    target: {type: 'selector'}
  },
  tick: function () {
    this.el.object3D.rotation.copy(this.data.target.object3D.rotation);
  }
});