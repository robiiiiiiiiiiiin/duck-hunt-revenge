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
        /* this.animationInProgress = false
        this.animationToFinish = false */
        this.weapon1 = document.querySelector('.weapon-1')
        this.attack = () => this.attackPhase1()
        this.handl_phase2transition = () => this.phase2transition()
        this.handl_hitted = () => this.hitted(this.el)
        
        this.el.addEventListener('appear', this.attack);
        this.el.addEventListener('toggle-look-at', () => {
            this.lookAtActive = !this.lookAtActive
        });
        this.el.addEventListener('hit', this.handl_hitted);
        this.el.addEventListener('phase2transition', this.handl_phase2transition);
        /* this.duck.addEventListener('animationbegin', (evt) => {
            this.animationInProgress = evt.detail.name
        }) */
        this.duck.addEventListener('animationcomplete', (evt) => {
            /* this.animationInProgress = false */
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
                case "animation__backflip":
                    this.resetRotation()
                    this.attack()
                    break;
            }
        });
    },

    pauseLookAt: function() {
        let rotation = this.el.object3D.rotation
        this.lookAtActive = false
    },

    tick: function (time, timeDelta) {
        if (this.lookAtActive) this.el.object3D.lookAt(new THREE.Vector3(this.target.x,this.target.y, this.target.z));
    },

    hitted: function (el) {
        this.data.life -= 1
        if (this.data.life <= 0) this.died()
        let lifePercent = (this.data.life / this.maxLife)
        let lifeBarWidth = lifePercent * this.lifeBarInitialWidth
        if (lifeBarWidth < 0) lifeBarWidth = 0
        this.lifeBar.setAttribute('geometry', {width: lifeBarWidth})
        // phase
        if (lifePercent <= 0.7) this.el.emit('phase2transition')
    },

    died: function (el) {
        console.log("die boss")
    },

    weapon1trigger: function() {
        let newW1 = this.weapon1.cloneNode(false)
        this.sceneEl.appendChild(newW1)
        newW1.setAttribute('weapon-1', '')
    },

    attackPhase1: function() {
        setTimeout(() => {
            this.weapon1trigger()
        }, 1500);
    },

    attackPhase2: function() {
        console.log("attack phase 2")
        setTimeout(() => {
            this.weapon1trigger()
        }, 1500);
    },

    phase2transition: function() {
        this.el.removeEventListener('phase2transition', this.handl_phase2transition);
        this.attack = () => this.attackPhase2()
        // Mercy Invincibility
        this.el.removeEventListener('hit', this.handl_hitted);
        setTimeout(() => {
            this.el.addEventListener('hit', this.handl_hitted);
        }, 4000);
        // animations
        this.removeAllW1()
        this.duck.emit('backflip')
    },

    resetRotation: function() {
        this.duck.object3D.rotation.x = THREE.Math.degToRad(30)
    },

    removeAllW1: function() {
        let w1s = document.querySelectorAll('[weapon-1]')
        w1s.forEach(w1 => {
            w1.parentNode.removeChild(w1)
        })
    },

    /* restartAnimation: function() {
        let animation = (this.animationToFinish) ? this.animationToFinish.slice(11) : "";
        switch (animation) {
            case "leanback":
                this.duck.emit('leanBack')
                break;
            case "leanfront":
                this.duck.emit('leanBack')
                break;
            case "backflip":
                break;
        }
    } */
});