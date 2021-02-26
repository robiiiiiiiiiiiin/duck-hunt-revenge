AFRAME.registerComponent('follow', {
    schema: {
        target: { type: 'selector' },
        speed: { type: 'number' }
    },

    init: function () {
        this.directionVec3 = new THREE.Vector3();
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
        if (distance < 1) { return; }
        let factor = this.data.speed / distance;
        ['x', 'y', 'z'].forEach(function (axis) {
            directionVec3[axis] *= factor * (timeDelta / 1000);
        });
        this.el.setAttribute('position', {
            x: currentPosition.x + directionVec3.x,
            y: currentPosition.y + directionVec3.y,
            z: currentPosition.z + directionVec3.z
        });
    },
});