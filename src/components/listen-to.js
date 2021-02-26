AFRAME.registerComponent('listen-to', {
  multiple: true,
  schema: {
    target: {type: 'selector'},
    event: {type: 'string', default: 'click'},
    emit: {type: 'string', default: 'click'}
  },
  init: function () {
    let event = this.data.event;
    let target = this.data.target;
    target.addEventListener(event, evt => this.onEvent(evt));
  },
  onEvent: function () {
    this.el.emit(this.data.emit);
  },
  remove: function () {},
});