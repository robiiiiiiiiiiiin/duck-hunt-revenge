AFRAME.registerComponent('weapon-1', {
    schema: {
    },

    init: function () {
        this.gameManager = document.getElementById('game-manager')
        this.duck = document.getElementById('boss-duck')
        this.player = document.getElementById('rig')
        this.playerPosition
        
        this.el.addEventListener('animationcomplete', () => {
            this.duck.emit('weapon1ready')
        });
        this.el.addEventListener('weapon1shoot', () => {
            this.shoot()
        });
        this.el.addEventListener('aim', () => {
            this.aim()
        });

        this.grow()
    },

    update: function () {
    },

    remove: function () {
    },

    tick: function (time, timeDelta) {

    },

    grow: function() {
        //this.sceneEl.appendChild(this.weapon1)
        this.el.emit('grow-weapon')
    },
    aim: function() {
        this.playerPosition = this.player.object3D.position
    },
    shoot: function() {
        this.el.setAttribute('weapon-shoot', {
            target: `${this.playerPosition.x} ${this.playerPosition.y} ${this.playerPosition.z}`,
            player: "#body",
            speed: 25
        })
        setTimeout(() => {
            this.el.parentNode.removeChild(this.el)
            this.el.destroy()
        }, 5000);
    },
});