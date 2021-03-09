AFRAME.registerComponent('weapon-2', {
    schema: {
        player: {type: 'selector'},
        duration: {type: 'number'}
    },

    init: function () {

        this.distanceVec3 = new THREE.Vector3();
        this.gameManager = document.querySelector('#game-manager');
        this.radius = 5
        this.worldPosition = new THREE.Vector3();

        setTimeout(() => {
            this.el.removeAttribute('weapon-2')
        }, this.data.duration);
    },

    pause: function() {
    },

    tick: function (time, timeDelta) {
        let playerPosition = this.data.player.object3D.getWorldPosition(this.worldPosition)
        let currentPosition = { 
            x: this.el.object3D.position.x,
            y: playerPosition.y,
            z: this.el.object3D.position.z
        }
        this.distanceVec3.copy(playerPosition).sub(currentPosition);
        let distance = this.distanceVec3.length();
        if (distance < this.radius) {
            this.gameManager.emit('weapon-hit-player');
            this.el.removeAttribute('weapon-2')
        }
    },
});