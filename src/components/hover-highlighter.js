AFRAME.registerComponent('hover-highlighter', {
  schema: {
    color: {type: 'color', default: 'white'}
  },
  init: function () {
    let target = this.el;
    target.addEventListener("mouseenter", evt => this.onEnter(evt));
    target.addEventListener("mouseleave", evt => this.onLeave(evt));
  },
  onEnter: function (evt) {
    let cursor = evt.detail.cursorEl;
    this.savedColor = cursor.getAttribute("material").color;
    cursor.setAttribute("material", `color: ${this.data.color}`);
  },
  onLeave: function (evt) {
    let cursor = evt.detail.cursorEl;
    cursor.setAttribute("material", `color: ${this.savedColor}`);
  },
});