AFRAME.registerPrimitive('a-hexatile', {
  defaultComponents: {
    'hexatile': {}
  },
  mappings: {
    size: 'hexatile.size',
    color: 'hexatile.color',
    'color-variation': 'hexatile.color-variation',
    'color-variation-entropy': 'hexatile.color-variation-entropy',
    'color-variation-number': 'hexatile.color-variation-number',
    cellsize: 'hexatile.cellsize',
    height: 'hexatile.height',
    bevel: 'hexatile.bevel',
    merged: 'hexatile.merged'
  }
});

AFRAME.registerComponent('hexatile', {
  schema: {
    size: {type: 'int', default: 10},
    color: {type: 'color', default: '#216138'},
    rayInterColor: {type: 'color', default: '#18a370'},
    blinkColor: {type: 'color', default: '#eb4034'},
    'color-variation': {type: 'boolean', default: true},
    'color-variation-entropy': {type: 'int', default: 20},
    'color-variation-number': {type: 'int', default: 3},
    bevel: {type: 'boolean', default: false},
    cellsize: {type: 'number', default: 1},
    height: {type: 'number', default: 1},
    merged: {type: 'boolean', default: true}
  },
  init: function () {
    this.colorVariation = [];
    this.colorVariationMaterial = [];
    this.colorNodesVariation = new Map();
    this.clearColor = this.data.color
    this.genAll();
    this.worldPosition = new THREE.Vector3();

    // raycaster
    this.handl_raycast_inter = () => {
      this.data.color = this.data.rayInterColor
      this.changeColor()
      this.el.addEventListener('mousedown', () => this.teleport());
    }
    this.handl_raycast_inter_clear = () => {
      this.data.color = this.clearColor
      this.changeColor()
      this.el.removeEventListener('mousedown', () => this.teleport());
    }

    this.el.addEventListener('raycaster-intersected', this.handl_raycast_inter);
    this.el.addEventListener('raycaster-intersected-cleared', this.handl_raycast_inter_clear);

    // alarm
    this.el.addEventListener('blink', function() {
        let goRed = () => {this.data.color = this.data.blinkColor; this.changeColor(); this.el.querySelector('[mixin=spike]').emit('alarm-sound')}
        let goGreen = () => {this.data.color = this.clearColor; this.changeColor()}
        
        this.el.removeEventListener('raycaster-intersected', this.handl_raycast_inter);
        this.el.removeEventListener('raycaster-intersected-cleared', this.handl_raycast_inter_clear);
        
        goRed()
        setTimeout(goGreen, 350);
        setTimeout(goRed, 700);
        setTimeout(goGreen, 1050);
        setTimeout(goRed, 1400);
        setTimeout(goGreen, 1750);
        setTimeout(goRed, 2100);
        setTimeout(goGreen, 2450);
        setTimeout(goRed, 2800);
        setTimeout(goGreen, 2975);
        setTimeout(goRed, 3150);
        setTimeout(goGreen, 3325);
        setTimeout(goRed, 3500);
        setTimeout(goGreen, 3675);
        setTimeout(goRed, 3850);
        setTimeout(goGreen, 4025);
        setTimeout(goRed, 4200);
        setTimeout(() => {
          goGreen()
          this.el.addEventListener('raycaster-intersected', this.handl_raycast_inter);
          this.el.addEventListener('raycaster-intersected-cleared', this.handl_raycast_inter_clear);
        }, 5300);

    }.bind(this))

  },
  genAll: function () {
    this.genVertices();
    this.genShape();
    this.genGeometry();
    this.genMaterial();
    this.genMesh();
    this.genTilemap();
    this.genColorVariation();
    this.genColorVariationMaterial();
    this.applyColorVariation();
    this.mergeGeometry();
  },
  genVertices: function () {
    this.vertices = [];
    for (let i = 0; i < 6; i++ ) {
      let angle_rad = 1.0471975511965976 * i; // (Math.PI / 180) * 60 * i
      this.vertices.push(new THREE.Vector2(this.data.cellsize * Math.cos(angle_rad), this.data.cellsize * Math.sin(angle_rad)));
    }
  },
  genShape: function() {
    this.shape = new THREE.Shape();
    this.shape.moveTo(this.vertices[0].x, this.vertices[0].y);
    for (let i = 1; i < 6; i++) this.shape.lineTo(this.vertices[i].x, this.vertices[i].y);
    this.shape.lineTo(this.vertices[0].x, this.vertices[0].y);
  },
  genGeometry: function() {
    this.geometrySettings = {
      depth: this.data.height,
      bevelEnabled: this.data.bevel,
      bevelSegments: 1,
      steps: 1,
      bevelSize: this.data.cellsize / 20,
      bevelThickness: this.data.cellsize / 20
    };
    this.geometry = new THREE.ExtrudeGeometry(this.shape, this.geometrySettings);
  },
  genMaterial: function () {
    this.material = new THREE.MeshLambertMaterial({color: new THREE.Color(this.data.color)});
  },
  genMesh: function() {
    this.mesh =  new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotateOnAxis(new THREE.Vector3(-1, 0, 0), Math.PI / 2);
    if (this.data.bevel) {
      this.mesh.scale.set(0.95, 0.95, 1);
    } else {
      this.mesh.scale.set(0.98, 0.98, 1);
    }
  },
  genTilemap: function() {
    this.tilemap = [];
    let size = this.data.size - 1;
    for (let q = -size; q <= size; q++) {
      for (let r = Math.max(-size, -q - size); r <= Math.min(size, -q + size); r++) {
        let s = -q - r;
        let x = this.data.cellsize * (1.5 * q);
        let z = this.data.cellsize * (Math.sqrt(3) / 2 * q  +  Math.sqrt(3) * r);
        let mesh = this.mesh.clone();
        mesh.userData.coordinates = {q, r, s};
        mesh.position.set(x, 0, z);
        this.tilemap.push(mesh);
      }
    }
  },
  genColorVariation: function (refresh = false) {
    if (!this.data['color-variation']) return;
    let variation = -this.data['color-variation-entropy'] / 255;
    let step = (2 * -variation) / this.data['color-variation-number'];
    for (let i = 0; i < this.data['color-variation-number']; i++) {
      this.colorVariation[i] = variation;
      variation += step;
    }
  },
  genColorVariationMaterial: function (refresh = false) {
    if (!this.data['color-variation']) return;
    // generate a fixed number of variation material
    if (this.colorVariationMaterial.length != this.data['color-variation-number'] || refresh) {
      this.colorVariationMaterial = [];
      const rgb = (new THREE.Color(this.data.color)).toArray();
      for (let variation of this.colorVariation) {
        const rgbVariation = rgb.map(color => Math.max(0, Math.min(color + variation, 1)));
        this.colorVariationMaterial.push(new THREE.MeshLambertMaterial({color: new THREE.Color(...rgbVariation)}));
      }
    }
  },
  changeColor: function() {
    this.genMaterial();
    this.genColorVariationMaterial(true);
    this.mergeGeometry();
  },
  applyColorVariation: function (refresh = false) {
    if (!this.data['color-variation']) return;
    // Affect a random one to each mesh
    this.tilemap.forEach(node => {
      let {q, r, s} = node.userData.coordinates;
      let materialIndex;
      if (!refresh && this.colorNodesVariation.has(`${q}.${r}.${s}`)) {
        materialIndex = this.colorNodesVariation.get(`${q}.${r}.${s}`);
      } else {
        materialIndex = Math.floor(Math.random() * this.data['color-variation-number']);
        // Save the variation value for this node coordinate (for possible futur color update)
        this.colorNodesVariation.set(`${q}.${r}.${s}`, materialIndex);
      }
      node.userData.materialIndex = materialIndex;
      node.material = this.colorVariationMaterial[materialIndex];
    });
  },
  mergeGeometry: function () {
    if (!this.data.merged) {
      let group = new THREE.Object3D();
      group.add(...this.tilemap);
      this.el.setObject3D('mesh', group);
      return;
    }
    if (this.data['color-variation']) {
      this.mergeGeometryWithVariation();
      return;
    }
    let mergedGeo = new THREE.Geometry();
    this.tilemap.forEach(node => {
      node.updateMatrix();
      mergedGeo.merge(node.geometry, node.matrix);
    });
    this.el.setObject3D('mesh', new THREE.Mesh(mergedGeo, this.material));
  },
  mergeGeometryWithVariation: function () {
    let mergedGeo = [];
    for (let i = 0; i < this.data['color-variation-number']; i++) {
      mergedGeo[i] = new THREE.Geometry();
    }
    this.tilemap.forEach(node => {
      node.updateMatrix();
      mergedGeo[node.userData.materialIndex].merge(node.geometry, node.matrix);
    });
    let group = new THREE.Object3D();
    for (let i = 0; i < this.data['color-variation-number']; i++) {
      group.add(new THREE.Mesh(mergedGeo[i], this.colorVariationMaterial[i]));
    }
    this.el.setObject3D('mesh', group);
  },
  update: function (oldData) {
    // We doesn't need the update phase during the initialisation phase
    if (Object.entries(oldData).length === 0) return;
    if (this.data.cellsize !== oldData.cellsize || this.data.size !== oldData.size || this.data.bevel !== oldData.bevel) {
      this.genAll();
    }
    if (this.data['color-variation'] !== oldData['color-variation']) {
      this.genColorVariation();
      this.genColorVariationMaterial();
      this.mergeGeometry();
    }
    if (this.data['color-variation-number'] !== oldData['color-variation-number'] && this.data['color-variation']) {
      this.genColorVariation();
      this.genColorVariationMaterial();
      this.applyColorVariation(true);
      this.mergeGeometry();
    }
    if (this.data['color-variation-entropy'] !== oldData['color-variation-entropy'] && this.data['color-variation']) {
      this.genColorVariation(true);
      this.genColorVariationMaterial(true);
      this.mergeGeometry();
    }
    if (this.data.color !== oldData.color) {
      this.genMaterial();
      this.genColorVariationMaterial(true);
      this.mergeGeometry();
    }
    if (this.data.height !== oldData.height) {
      this.setHeight();
      this.mergeGeometry();
    }
    if (this.data.merged !== oldData.merged) {
      this.mergeGeometry();
    }
  },
  setHeight: function () {
    this.geometrySettings.depth = this.data.height;
    this.geometry = new THREE.ExtrudeGeometry(this.shape, this.geometrySettings);
    this.tilemap.forEach(node => node.geometry = this.geometry);
  },
  teleport: function() {
    let hexatilePosition = this.el.object3D.getWorldPosition(this.worldPosition)
    /* document.getElementById('rig').object3D.position.set(
      hexatilePosition.x,
      0,
      hexatilePosition.z
    ) */
    document.getElementById('rig').setAttribute('position', {x: hexatilePosition.x, y: 0, z: hexatilePosition.z});
  },
  remove: function () {
    this.el.removeObject3D('mesh');
  }
});