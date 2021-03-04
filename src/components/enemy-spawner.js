AFRAME.registerComponent('enemy-spawner', {
    schema: {
    },

    init: function () {
        this.sceneEl = document.querySelector('a-scene');
        this.enemy_1 = document.querySelector('.enemy_1');
  
        this.throttledFunction = AFRAME.utils.throttle(this.enemySpawner, 2000, this);
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
        let el = this.enemy_1.cloneNode(false)
        this.sceneEl.appendChild(el)
    }
});