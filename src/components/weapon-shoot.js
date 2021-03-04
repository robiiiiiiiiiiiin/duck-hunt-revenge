AFRAME.registerComponent('weapon-shoot', {
    schema: {
        target: { type: 'vec3' },
        player: {type: 'selector'},
        speed: { type: 'number' }
    },

    init: function () {

        this.directionVec3Temp = new THREE.Vector3();
        this.distanceVec3 = new THREE.Vector3();
        this.gameManager = document.querySelector('#game-manager');
        this.radius = 2
        this.directionVec3 = this.directionVec3Temp;
        let targetPosition = this.data.target
        this.worldPosition = new THREE.Vector3();
        let currentPosition = this.el.object3D.getWorldPosition(this.worldPosition)//this.el.object3D.position;
        this.directionVec3.copy(targetPosition).sub(currentPosition);
        let distance = this.directionVec3.length();
        // detect if enemy reached player
        /* if (distance < 1) {
            this.gameManager.emit('weapon-reached-player');
            return;
        } */
        this.factor = this.data.speed / distance;
        ['x', 'y', 'z'].forEach(function (axis) {
            this.directionVec3[axis] *= this.factor * 0.05;
        }.bind(this));
    },

    pause: function() {
    },

    tick: function (time, timeDelta) {
        let playerPosition = this.data.player.object3D.getWorldPosition(this.worldPosition)
        let currentPosition = this.el.object3D.position;
        this.distanceVec3.copy(playerPosition).sub(currentPosition);
        let distance = this.distanceVec3.length();
        if (distance < this.radius) {
            this.gameManager.emit('weapon-hit-player');
            this.el.parentNode.removeChild(this.el)
        }
        // Transalte towards the player
        this.el.object3D.position.x += this.directionVec3.x, 
        this.el.object3D.position.y += this.directionVec3.y, 
        this.el.object3D.position.z += this.directionVec3.z
    },
});