AFRAME.registerComponent('hardware-manager', {
    schema: {
    },

    init: function () {
        let scene = document.querySelector('a-scene')
        this.vrOnly = scene.querySelectorAll('.vr-only')
        this.vrExcept = scene.querySelectorAll('.vr-except')
        this.vrOnlyBackup = []

        if (this.el.sceneEl.is('vr-mode')) {
            this.setupForVR()
        }
        else {
            this.setupForNotVR()
        }
        window.addEventListener('enter-vr', function() {
            this.setupForVR()
        }.bind(this));
    },

    setupForNotVR: function() {
        this.vrOnly.forEach(elem => {
            this.vrOnlyBackup.push({
                parent: elem.parentNode,
                element: elem
            })
            elem.parentNode.removeChild(elem)
        })
    },
    setupForVR: function() {
        this.vrOnlyBackup.forEach(elem => {
            elem.parent.appendChild(elem.element)
        })
        this.vrExcept.forEach(elem => {
            elem.parentNode.removeChild(elem)
        })
    }
});