AFRAME.registerComponent('hardware-manager', {
    schema: {
    },

    init: function () {
        let scene = document.querySelector('a-scene')
        this.vrOnly = scene.querySelectorAll('.vr-only')
        this.vrExcept = scene.querySelectorAll('.vr-except')
        this.vrOnlyBackup = []
        this.cursor = document.getElementById('cursor')
        this.leftHand = document.getElementById('left-hand')

        if (this.el.sceneEl.is('vr-mode')) this.enterVR()
        else this.exitVR()
        
        window.addEventListener('enter-vr', () => this.enterVR());
        window.addEventListener('exit-vr', () => this.exitVR());
    },

    exitVR: function() {
        this.vrOnly.forEach(elem => {
            this.vrOnlyBackup.push({
                parent: elem.parentNode,
                element: elem
            })
            elem.parentNode.removeChild(elem)
        })
        this.cursor.setAttribute('raycaster', {far: 35})
        this.leftHand.setAttribute('raycaster', {far: 10})
    },

    enterVR: function() {
        this.vrOnlyBackup.forEach(elem => {
            elem.parent.appendChild(elem.element)
        })
        this.vrExcept.forEach(elem => {
            elem.parentNode.removeChild(elem)
        })
        this.cursor.setAttribute('raycaster', {far: 10})
        this.leftHand.setAttribute('raycaster', {far: 35})
    }
});