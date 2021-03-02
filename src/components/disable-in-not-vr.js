AFRAME.registerComponent('disable-in-not-vr', {
  multiple: true,
  schema: {
    component: {type: 'string'},
  },
  init: function () {
    this.handler = () => this.disable();
    if (!this.el.sceneEl.is('vr-mode')) this.disable();
    window.addEventListener('enter-vr', this.handler);
  },
  disable: function () {
    this.el.removeAttribute(this.data.component);
  },
  remove: function () {
    window.removeEventListener('enter-vr', this.handler);
  }
});