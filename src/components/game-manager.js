AFRAME.registerComponent('game-manager', {
    schema: {
    },

    init: function () {
        this.scoreEls = document.querySelectorAll('.score');
        this.lifeEls = document.querySelectorAll('.life');
        this.lifeMax = 5
        this.life = 5
        this.score = 0
        this.scoreForBoss = 1000
        this.handl_theme1 = () => this.playTheme1()

        //music
        this.el.addEventListener('sound-loaded', (evt) => {
            if (evt.detail.id == "stage1") {
                document.body.addEventListener('mousedown', this.handl_theme1);
            }
        });
        // life down listeners
        this.el.addEventListener('enemy-reached-player', () => {
            this.lifeDown()
        });
        this.el.addEventListener('weapon-hit-player', () => {
            this.lifeDown()
        });

        // score
        this.el.addEventListener('die', () => {
            this.scoreUp() 
        });
        
    },

    update: function () {
    },

    remove: function () {
    },

    tick: function (time, timeDelta) {
    },

    playerDead: function() {
        console.log("YOUR DED")
        this.el.emit('end-game')
        document.querySelectorAll('[enemy]').forEach(function(el) {
            el.pause();
        });
    },

    bossStageAppear: function() {
        this.el.emit('bossStage')
        this.el.components.sound__stage1.stopSound()
        this.el.emit('boss-theme-start')
        setTimeout(() => {
            this.activateTeleporter()
        }, 8000)
        setTimeout(() => {
            this.el.emit('bossEntry')
        }, 10000);

    },

    scoreUp: function() {
        this.score += 50
        if(this.score == this.scoreForBoss) this.bossStageAppear()
        this.scoreEls.forEach(elem => {
            elem.setAttribute('text', {
                value: this.score
            })
        })
    },

    lifeDown: function() {
        this.life -= 1
        console.log("life: "+this.life)
        if(this.life <= 0) this.playerDead()
        this.lifeEls.forEach(elem => {
            elem.setAttribute('scale', `1 ${this.life/this.lifeMax} 1`)
        })
    },

    activateTeleporter: function() {
        let cursor = document.getElementById('cursor')
        let leftHand = document.getElementById('left-hand')
        if (this.el.sceneEl.is('vr-mode')) {
            leftHand.setAttribute('raycaster', {
                showLine: true,
                lineOpacity: 1,
                enabled: true
            })
        } else {
            cursor.setAttribute('raycaster', {
                enabled: true
            })
        }
    },

    playTheme1: function() {
        // I need to do this to workaround a bug in case it appears
        this.el.components.sound__stage1.pauseSound()
        this.el.components.sound__stage1.playSound()
        document.body.removeEventListener('mousedown', this.handl_theme1);
    }
});