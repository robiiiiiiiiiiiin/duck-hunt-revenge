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
        this.sceneEl = document.querySelector('a-scene');
        this.gameManager = document.getElementById('game-manager')
        this.player = document.getElementById('rig')
        this.duck = document.getElementById('boss-duck')
        this.lifeBar = document.getElementById('boss-life')
        this.lifeBarInitialWidth = 20
        this.maxLife = this.data.life
        this.target = this.data.lookAt.object3D.position
        this.lookAtActive = true
        this.weapon1 = document.querySelector('.weapon-1')

        this.el.addEventListener('appear', () => {
            setTimeout(() => {
                this.weapon1trigger()
            }, 1500);
        });
        this.el.addEventListener('toggle-look-at', () => {
            this.lookAtActive = !this.lookAtActive
        });
        this.el.addEventListener('hit', () => {
            this.hitted(this.el)
        });
        this.duck.addEventListener('animationcomplete', (evt) => {
            switch (evt.detail.name) {
                case "animation__leanback":
                    this.duck.emit('leanFront')
                    break;
                case "animation__leanfront":
                    this.duck.emit('weapon1shoot')
                    setTimeout(() => {
                        this.weapon1trigger()
                    }, 2500);
                    break;
            }
        });
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
        this.data.life -= 1
        if (this.data.life <= 0) this.died()
        let lifeBarWidth = (this.data.life / this.maxLife) * this.lifeBarInitialWidth
        if (lifeBarWidth < 0) lifeBarWidth = 0
        this.lifeBar.setAttribute('geometry', {width: lifeBarWidth})
    },

    died: function (el) {
        console.log("die boss")
    },

    weapon1trigger: function() {
        let newW1 = this.weapon1.cloneNode(false)
        this.sceneEl.appendChild(newW1)
        newW1.setAttribute('weapon-1', '')
    },

    runAway: function() {
        
    }
});