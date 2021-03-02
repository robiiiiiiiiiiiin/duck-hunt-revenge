AFRAME.registerComponent('score', {
    schema: {
    },

    init: function () {
        // enemy reached player listener
        this.el.addEventListener('scoreChange', (event) => {
            this.updateScore(event.detail)
        });
        
    },

    update: function () {
    },

    remove: function () {
    },

    tick: function (time, timeDelta) {
    },

    updateScore: function(score) {
        this.el.setAttribute('text', {
            value: score
        })
    }
});