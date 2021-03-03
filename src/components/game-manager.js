AFRAME.registerComponent('game-manager', {
    schema: {
    },

    init: function () {
        this.scoreEl = document.querySelectorAll('[score]');
        this.score = 0
        this.scoreForBoss = 50

        // enemy reached player listener
        this.el.addEventListener('enemy-reached-player', () => {
            this.el.emit('end-game')
            this.playerDead()
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
        document.querySelectorAll('[enemy]').forEach(function(el) {
            el.pause();
        });
    },

    bossStageAppear: function() {
        console.log("bossStageAppear()")
        let secondaryPlatforms = document.querySelector('.secondary_plateforms')
        let ocean = document.querySelector('a-ocean')
        secondaryPlatforms.emit('bossStage')
        ocean.emit('bossStage')

    },

    scoreUp: function() {
        this.score += 50
        if(this.score >= this.scoreForBoss) this.bossStageAppear()
        this.scoreEl.forEach(elem => {
            elem.emit("scoreChange", this.score)
        })
    }
});