AFRAME.registerComponent('click-to-shoot', {
    init: function () {
        this.handler = () => this.shoot();
        document.body.addEventListener('mousedown', this.handler);
    },

    shoot: function() {
        document.body.removeEventListener('mousedown', this.handler);
        this.el.emit('shoot');
        setTimeout(() => {
            document.body.addEventListener('mousedown', this.handler)
        }, 300)
    }
});