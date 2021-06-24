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
        this.duckDead = 0
        this.duckDeadForBoss = 30
        this.gameEnded = false
        this.handl_theme1 = () => this.playTheme1()
        this.handl_shoot = () => this.player_shooted()

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
            this.duckDied() 
        });
        this.el.addEventListener('boss-died', () => {
            this.bossDead() 
        });
        this.el.addEventListener('shoot', this.handl_shoot);
        
    },

    update: function () {
    },

    remove: function () {
    },

    tick: function (time, timeDelta) {
        if(this.gameEnded) this.totalTime = time
    },

    playerDead: function() {
        this.el.emit('player-dead-sound')
        this.el.components.sound__stage1.stopSound()
        this.el.components.sound__boss.stopSound()
        document.getElementById('end-panel').setAttribute('visible', true)
        this.endGame()
    },

    player_shooted: function() {
        this.score -= 10
        this.updateScoreEl()
    },

    bossDead: function() {
        this.el.components.sound__boss.stopSound()
        this.gameEnded = true
        this.endGame()
        setTimeout(() => {
            let finalScore = Math.ceil(( this.life * this.score ) / (this.totalTime/1000))
            let finalScoreDetails = `(life: ${this.life} * score: ${this.score} / time: ${Math.ceil(this.totalTime/1000)})`
            document.getElementById('title').setAttribute('text', {value: 'You Won!'})
            document.getElementById('final-score-detail').setAttribute('text', {value: finalScoreDetails})
            document.getElementById('final-score').setAttribute('text', {value: `Final score: ${finalScore} points`})
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
        document.querySelector('[enemy-spawner]').remove();
        setTimeout(() => {
            document.querySelector('[boss]').pause();
        }, 2000);
    },

    bossStageAppear: function() {
        this.el.removeEventListener('shoot', this.handl_shoot);
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

    duckDied: function() {
        this.duckDead += 1
        this.score += 50
        if(this.duckDead == this.duckDeadForBoss) this.bossStageAppear()
        this.updateScoreEl()
    },

    updateScoreEl: function() {
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