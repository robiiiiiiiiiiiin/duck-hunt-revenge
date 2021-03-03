/* 
-12 2 -20   30
-12 2 20    150
22 2 0      270 
*/

AFRAME.registerComponent('boss', {
    schema: {
        lookAt: {type: 'selector'},
        life: {type: 'number', default: 10}
    },

    init: function () {
        this.gameManager = document.getElementById('game-manager')
        this.player = document.getElementById('rig')
        this.duck = document.getElementById('boss-duck')
        this.target = this.data.lookAt.object3D.position
        this.lookAtActive = true
        this.weapons1 = document.querySelectorAll('.weapon-1')
        this.playerPosition

        console.log(this.duck)

        this.el.addEventListener('toggle-look-at', () => {
            this.lookAtActive = !this.lookAtActive
        });
        this.el.addEventListener('hit', () => this.hitted(this.el) );
        this.weapons1[0].addEventListener('animationcomplete', () => {
            console.log('weapon1ready')
            this.duck.emit('weapon1ready')
        });
        this.duck.addEventListener('animationcomplete', (evt) => {
            switch (evt.detail.name) {
                case "animation__leanback":
                    this.playerPosition = this.player.object3D.position
                    this.duck.emit('weapon1shoot')
                    break;
                case "animation__leanfront":
                    this.weapon1shoot()
                    break;
            }
        });

        this.weapon1prepare()
        
    },

    update: function () {
    },

    pauseLookAt: function() {
        let rotation = this.el.object3D.rotation
        this.lookAtActive = false

    },

    remove: function () {
    },

    tick: function (time, timeDelta) {
        if (this.lookAtActive) this.el.object3D.lookAt(new THREE.Vector3(this.target.x,this.target.y, this.target.z));
    },

    hitted: function (el) {
        console.log("hit boss")
        this.data.life -= 1
        if (this.data.life <= 0) this.died()
    },

    died: function (el) {
        console.log("die boss")
    },

    weapon1prepare: function() {
        this.weapons1.forEach(bullet => {
            bullet.emit('grow-weapon')
        });
    },
    weapon1shoot: function() {
        this.weapons1.forEach(bullet => {
            bullet.setAttribute('weapon-shoot', {
                target: `${this.playerPosition.x} ${this.playerPosition.y} ${this.playerPosition.z}`,
                speed: 8
            })
        });
    },

    runAway: function() {
        
    }
});