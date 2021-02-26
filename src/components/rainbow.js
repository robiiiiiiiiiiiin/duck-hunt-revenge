AFRAME.registerComponent('rainbow', {
    schema: {
        i: {type: 'number'},
        speed: {type: 'number'},
        color: {type: 'string'}
    },
  
    init: function () {
      // Do something when component first attached.
      console.log("color: ", this.el.getAttribute('material', 'color'))
      this.data.i = 0
    },
  
    update: function () {
      // Do something when component's data is updated.
    },
  
    remove: function () {
      // Do something the component or its entity is detached.
    },
  
    tick: function (time, timeDelta) {
      // Do something on every scene tick or frame.
      this.data.i++
      this.data.color = incrementColor(this.data.color)
      this.el.setAttribute('material', 'color', `#${this.data.color}`);
    }
  });

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function incrementColor(color) {
    let parsedHex = parseInt(color, 16)
    parsedHex += 100
    return parsedHex.toString(16);
  }