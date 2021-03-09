AFRAME.registerComponent('enemy-spawner', {
    schema: {
    },

    init: function () {
        this.sceneEl = document.querySelector('a-scene');
        this.enemy_1 = document.querySelector('.enemy_1');
        this.enemy_2 = document.querySelector('.enemy_2');
  
        this.throttledFunction = AFRAME.utils.throttle(this.enemySpawner, 1200, this);
        this.i = 1
        this.el.addEventListener('bossStage', () => {this.pause()})
    },

    update: function () {
    },

    remove: function () {
    },

    tick: function (time, timeDelta) {
        this.throttledFunction();
    },

    pause: function () {
    },

    enemySpawner: function() {
        let rand = Math.floor(Math.random() * Math.floor(8))
        this.i += 1
        let el
        if (rand != 0 || this.i <= 10){
            el = this.enemy_1.cloneNode(false) 
            this.sceneEl.appendChild(el)
            el.setAttribute('follow', 'speed: 2; target: #rig')
        } else {
            el = this.enemy_2.cloneNode(false)
            this.sceneEl.appendChild(el)
            el.setAttribute('follow', 'speed: 8; target: #rig')
            el.setAttribute('visible', 'true')
            el.setAttribute('sound__scream', {autoplay: true})
        }
    }
});