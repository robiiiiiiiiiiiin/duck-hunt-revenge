AFRAME.registerComponent('enemy', {
    schema: {
        y: {type: 'number'}
    },

    init: function () {
        this.gameManager = document.getElementById('game-manager')

        // set inital position & rotation
        this.spawnRadius = 35
        let randAngle = Math.random()*Math.PI*2;
        let position = {
            x: Math.cos(randAngle) * this.spawnRadius,
            z: Math.sin(randAngle) * this.spawnRadius,
            rotation: -randAngle - THREE.Math.degToRad(90)
        }
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
        //el.parentNode.removeChild(el);
    },

    died: function (el) {
        this.el.emit('quack-sound')
        this.gameManager.emit('die')
        // fall & disappear
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
        setTimeout(() => {
            //console.log(el.Audio)
            /* el.components.sound__quack.stopSound()
            el.components.sound__bite.stopSound()
            el.components.sound__nearenemy.stopSound()
            el.removeAttribute('sound__quack')
            el.removeAttribute('sound__bite')
            el.removeAttribute('sound__nearenemy') */
            el.parentNode.removeChild(el)
            el.destroy()
        }, 500)
    },
});