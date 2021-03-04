AFRAME.registerComponent('follow', {
    schema: {
        target: { type: 'selector' },
        speed: { type: 'number' }
    },

    init: function () {
        this.directionVec3 = new THREE.Vector3();
        this.gameManager = document.querySelector('#game-manager');
        
        this.el.addEventListener('player-dead', () => this.pause() );
        this.stepUp = this.el.object3D.position.y + 0.3
    },

    pause: function() {
    },

    tick: function (time, timeDelta) {
        // Transalte towards the player
        let directionVec3 = this.directionVec3;
        let targetPosition = {
            x: this.data.target.object3D.position.x,
            y: this.el.object3D.position.y,
            z: this.data.target.object3D.position.z,
            isVector3: true
        };
        let currentPosition = this.el.object3D.position;
        directionVec3.copy(targetPosition).sub(currentPosition);
        let distance = directionVec3.length();
        // detect if enemy is on the platform
        if (distance < 4.5) {
            this.el.object3D.position.y = this.stepUp
        }
        // detect if enemy reached player
        if (distance < 1) {
            this.gameManager.emit('enemy-reached-player');
            this.el.removeAttribute('follow')
            return;
        }
        let factor = this.data.speed / distance;
        ['x', 'y', 'z'].forEach(function (axis) {
            directionVec3[axis] *= factor * (timeDelta / 1000);
        });
        this.el.object3D.position.set(
            currentPosition.x + directionVec3.x, 
            currentPosition.y + directionVec3.y, 
            currentPosition.z + directionVec3.z
        );
    },
});