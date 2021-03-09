/* 
-12 2 -20   30
-12 2 20    150
22 2 0      270 
*/

AFRAME.registerComponent('boss', {
    schema: {
        lookAt: {type: 'selector'},
        life: {type: 'number', default: 130}
    },

    init: function () {
        this.sceneEl = document.querySelector('a-scene');
        this.gameManager = document.getElementById('game-manager')
        this.player = document.getElementById('rig')
        this.duck = document.getElementById('boss-duck')
        this.lifeBar = document.getElementById('boss-life')
        this.platforms = document.querySelectorAll('a-hexatile')
        this.lifeBarInitialWidth = 20
        this.maxLife = this.data.life
        this.target = this.data.lookAt.object3D.position
        this.lookAtActive = true
        this.timeoutW2
        /* this.animationInProgress = false
        this.animationToFinish = false */
        this.weapon1 = document.querySelector('.weapon-1')
        this.attack = () => this.attackPhase1()
        this.handl_phase2transition = () => this.phase2transition()
        this.handl_phase3transition = () => this.phase3transition()
        this.handl_hitted = () => this.hitted(this.el)
        this.handl_died = () => this.died(this.el)
        
        this.el.addEventListener('appear', this.attack);
        this.el.addEventListener('toggle-look-at', () => {
            this.lookAtActive = !this.lookAtActive
        });
        this.el.addEventListener('hit', this.handl_hitted);
        this.el.addEventListener('phase2transition', this.handl_phase2transition);
        this.el.addEventListener('phase3transition', this.handl_phase3transition);
        this.el.addEventListener('died', this.handl_died);
        /* this.duck.addEventListener('animationbegin', (evt) => {
            this.animationInProgress = evt.detail.name
        }) */
        this.duck.addEventListener('animationcomplete', (evt) => {
            /* this.animationInProgress = false */
            switch (evt.detail.name) {
                case "animation__leanback":
                    this.duck.emit('leanFront')
                    this.duck.emit('attack1-sound')
                    break;
                case "animation__leanfront":
                    this.duck.emit('weapon1shoot')
                    this.newW1.emit('weapon1-sound')
                    break;
                case "animation__backflip":
                    this.resetRotation()
                    this.attack()
                    break;
            }
        });

        // test

        //this.attack()
    },

    pauseLookAt: function() {
        let rotation = this.el.object3D.rotation
        this.lookAtActive = false
    },

    tick: function (time, timeDelta) {
        if (this.lookAtActive) this.el.object3D.lookAt(new THREE.Vector3(this.target.x,this.target.y, this.target.z));
    },

    pause: function() {
    },

    hitted: function (el) {
        this.data.life -= 1
        if (this.data.life == 0 ) this.el.emit('died')
        let lifePercent = (this.data.life / this.maxLife)
        let lifeBarWidth = lifePercent * this.lifeBarInitialWidth
        if (lifeBarWidth < 0) lifeBarWidth = 0
        this.lifeBar.setAttribute('geometry', {width: lifeBarWidth})
        // phase
        if (lifePercent <= 0.7) this.el.emit('phase2transition')
        if (lifePercent <= 0.3) this.el.emit('phase3transition')
    },

    died: function (el) {
        this.el.removeEventListener('died', this.handl_died);
        // animations
        this.removeAllW1()
        this.duck.emit('backflip')
        this.duck.emit('boss-hit-sound')
    },

    weapon1trigger: function() {
        // 3sec grow
        // 2sec leanBack
        // 0.3sec leanFront
        // 2.5sec before weapon1trigger
        // total 7.8 sec

        this.timeoutW1 = setTimeout(() => {
            this.weapon1trigger()
        }, 7800);

        this.newW1 = this.weapon1.cloneNode(false)
        this.sceneEl.appendChild(this.newW1)
        this.newW1.setAttribute('weapon-1', '')
    },

    weapon2trigger: function() {
        // 4.2sec alarm
        // 1.4sec spikes
        // 2.2sec before weapon2trigger
        // total: 7.8 sec
        
        this.timeoutW2 = setTimeout(() => {
            this.weapon2trigger()
        }, 7800);
        let deadlyKeys = this.get3randNumbers()
        let i = 0
        deadlyKeys.forEach(key => {
            //this.platforms[key].emit("alarm-sound")
            this.platforms[key].emit("blink")
            let spike = this.platforms[key].querySelector('[mixin = spike]')

            // trigger spikes up & down
            /* this.timeoutW2[i] =  */setTimeout(() => {
                spike.emit("spikes-up")
                this.platforms[key].setAttribute('weapon-2', 'player: #rig; duration: 1100')
                setTimeout(() => {
                    spike.emit("spikes-down")
                }, 1100);
            }, 4200);
            i++
        })
    },

    attackPhase1: function() {
        setTimeout(() => {
            this.weapon1trigger()
        }, 500);
    },

    attackPhase2: function() {
        setTimeout(() => {
            this.weapon2trigger()
        }, 500);
        setTimeout(() => {
            this.weapon1trigger()
        }, 1500);
    },
    
    attackPhase3: function() {
        setTimeout(() => {
            this.weapon2trigger()
        }, 500);
        setTimeout(() => {
            this.weapon1trigger()
        }, 1500);
        setTimeout(() => {
            this.weapon1trigger()
        }, 5400);
    },

    phase2transition: function() {
        this.el.removeEventListener('phase2transition', this.handl_phase2transition);
        // Stop current attack
        clearTimeout(this.timeoutW1)
        this.removeAllW1()
        this.attack = () => this.attackPhase2()
        // Mercy Invincibility
        this.el.removeEventListener('hit', this.handl_hitted);
        setTimeout(() => {
            this.el.addEventListener('hit', this.handl_hitted);
        }, 4000);
        // animations
        this.duck.emit('backflip')
        this.duck.emit('boss-hit-sound')
    },
    
    phase3transition: function() {
        this.el.removeEventListener('phase3transition', this.handl_phase3transition);
        // Stop current attack
        clearTimeout(this.timeoutW1)
        clearTimeout(this.timeoutW2)
        /* this.timeoutW2.forEach(elem => {
            clearTimeout(elem)
        }) */
        this.removeAllW1()
        this.attack = () => this.attackPhase3()
        // Mercy Invincibility
        this.el.removeEventListener('hit', this.handl_hitted);
        setTimeout(() => {
            this.el.addEventListener('hit', this.handl_hitted);
        }, 4000);
        // animations
        this.duck.emit('backflip')
        this.duck.emit('boss-hit-sound')
    },

    resetRotation: function() {
        this.duck.object3D.rotation.x = THREE.Math.degToRad(30)
    },

    removeAllW1: function() {
        let w1s = document.querySelectorAll('[weapon-1]')
        w1s.forEach(w1 => {
            w1.parentNode.removeChild(w1)
            w1.destroy()
        })
    },

    get3randNumbers: function() {
        let numbers = [0,1,2,3,4]
        let rand = Math.floor(Math.random() * Math.floor(5))
        numbers.splice(rand, 1)
        rand = Math.floor(Math.random() * Math.floor(4))
        numbers.splice(rand, 1)
        return numbers
    }
});