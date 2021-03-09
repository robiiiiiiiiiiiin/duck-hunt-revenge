AFRAME.registerComponent('game-manager', {
    schema: {
    },

    init: function () {
        this.scoreEls = document.querySelectorAll('.score');
        this.lifeEls = document.querySelectorAll('.life');
        this.navmeshStage = document.querySelector('#nav-mesh-stage')
        this.navmeshBoss = document.querySelector('#nav-mesh-boss')
        this.lifeMax = 10
        this.life = 10
        this.score = 0
        this.scoreForBoss = 3000
        this.handl_theme1 = () => this.playTheme1()

        this.el.addEventListener('sound-loaded', (evt) => {
            if (evt.detail.id == "stage1") {
                document.body.addEventListener('mousedown', this.handl_theme1);
            }
        });
        this.el.addEventListener('enemy-reached-player', () => {
            this.lifeDown()
        });
        this.el.addEventListener('weapon-hit-player', () => {
            this.lifeDown()
        });
        this.el.addEventListener('die', () => {
            this.scoreUp() 
        });
        this.el.addEventListener('boss-died', () => {
            this.bossDead() 
        });
        
    },

    update: function () {
    },

    remove: function () {
    },

    tick: function (time, timeDelta) {
    },

    playerDead: function() {
        this.el.emit('player-dead-sound')
        this.el.components.sound__stage1.stopSound()
        this.el.components.sound__boss.stopSound()
        document.getElementById('end-panel').setAttribute('visible', true)
        this.endGame()
    },

    bossDead: function() {
        this.el.components.sound__boss.stopSound()
        this.endGame()
        setTimeout(() => {
            document.getElementById('title').setAttribute('text', {value: 'You Won!'})
            document.getElementById('end-panel').setAttribute('color', '#5ebd4d')
            document.getElementById('end-panel').setAttribute('visible', true)
        }, 3000);
    },

    endGame: function() {
        document.querySelectorAll('[enemy]').forEach(function(el) {
            el.remove();
        });
        document.querySelectorAll('[click-to-shoot]').forEach(function(el) {
            el.remove();
        });
        setTimeout(() => {
            document.querySelector('[boss]').pause();
        }, 2000);
    },

    bossStageAppear: function() {
        this.el.emit('bossStage')
        this.el.components.sound__stage1.stopSound()
        this.el.emit('boom-sound')
        this.el.emit('ground-rising-sound')
        setTimeout(() => {
            this.el.emit('boss-talk-1-sound')
            this.el.emit('ground-rise')
        }, 4000)
        setTimeout(() => {
            this.activateTeleporter()
            this.switchNavMesh()
            this.el.emit('boss-talk-2-sound')
        }, 12000)
        setTimeout(() => {
            this.el.emit('boss-theme-start')
        }, 8500)
        setTimeout(() => {
            this.el.emit('bossEntry')
        }, 14500);

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
        if(this.life <= 0) {
            this.playerDead()
        } else this.el.emit('player-hit-sound')
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

    switchNavMesh: function() {
        this.navmeshStage.removeAttribute('nav-mesh');
        this.navmeshStage.setAttribute('nav-mesh-disable', '');
        this.navmeshBoss.removeAttribute('nav-mesh-disable');
        this.navmeshBoss.setAttribute('nav-mesh', '');
    },

    playTheme1: function() {
        // I need to do this to workaround a bug in case it appears
        this.el.components.sound__stage1.pauseSound()
        this.el.components.sound__stage1.playSound()
        document.body.removeEventListener('mousedown', this.handl_theme1);
    }
});