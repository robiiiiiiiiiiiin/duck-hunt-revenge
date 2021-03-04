AFRAME.registerComponent('enemy', {
    schema: {
        y: {type: 'number'}
    },

    init: function () {
        //console.log("init enemy")

        this.gameManager = document.getElementById('game-manager')

        // set inital position & rotation
        const positions = [
            /* N */  {x: 0, z: -30, rotation: THREE.Math.degToRad(0)},
            /* NE */ {x: 30, z: -30, rotation: THREE.Math.degToRad(315)},
            /* E */  {x: 30, z: 0, rotation: THREE.Math.degToRad(270)},
            /* SE */ {x: 30, z: 30, rotation: THREE.Math.degToRad(225)},
            /* S */  {x: 0, z: 30, rotation: THREE.Math.degToRad(180)},
            /* SO */ {x: -30, z: 30, rotation: THREE.Math.degToRad(135)},
            /* O */  {x: -30, z: 0, rotation: THREE.Math.degToRad(90)},
            /* NO */ {x: -30, z: -30, rotation: THREE.Math.degToRad(45)}
        ]
        const random = Math.floor(Math.random() * positions.length);
        const position = positions[random];
        this.el.object3D.position.set(position.x, this.data.y, position.z);
        this.el.object3D.rotation.y = position.rotation;

        // hit & die listeners
        this.el.addEventListener('hit', () => this.hitted(this.el) );
        this.el.addEventListener('die', () => this.died(this.el) );
        
    },

    update: function () {
    },

    remove: function () {
    },

    tick: function (time, timeDelta) {

    },

    hitted: function (el) {
        console.log("hit")
        //el.parentNode.removeChild(el);
    },

    died: function (el) {
        console.log("die")
        this.gameManager.emit('die')
        if(Math.floor(Math.random() * 2) == 1) {
            if(Math.floor(Math.random() * 2) == 1) {
                el.object3D.rotation.x = THREE.Math.degToRad(-90)
            } else {
                el.object3D.rotation.x = THREE.Math.degToRad(90)
            }
        } else {
            if(Math.floor(Math.random() * 2) == 1) {
                el.object3D.rotation.z = THREE.Math.degToRad(-90)
            } else {
                el.object3D.rotation.z = THREE.Math.degToRad(90)
            }
        }
        setTimeout(() => {el.pause()}, 150)
        setTimeout(() => {el.parentNode.removeChild(el)}, 500)
    },
});