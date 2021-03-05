AFRAME.registerComponent('click-to-shoot', {
    init: function () {
        this.handler = () => this.shoot();
        document.body.addEventListener('mousedown', this.handler);
    },

    shoot: function() {
        document.body.removeEventListener('mousedown', this.handler);
        this.el.emit('shoot');
        // sound
        let rand = Math.floor(Math.random() * Math.floor(3)) + 1
        this.el.emit(`blaster${rand}-sound`)
        // firing rate
        setTimeout(() => {
            document.body.addEventListener('mousedown', this.handler)
        }, 300)
    }
});