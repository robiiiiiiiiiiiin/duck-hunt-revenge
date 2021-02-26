AFRAME.registerComponent('enemy', {
    schema: {
        y: {type: 'number'}
    },

    init: function () {
        console.log("init enemy")

        //inital position
        this.el.object3D.position.set(-1, this.data.y, -3);
    },

    update: function () {
    },

    remove: function () {
        console.log("remove enemy")
    },

    tick: function (time, timeDelta) {

    },

    /* pause: function () {
        console.log("pause enemy")

        //reset position
        this.el.object3D.position.set(-1, this.data.y, -3);
    } */
});