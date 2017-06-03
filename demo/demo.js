const regl = require('regl')({
  extensions: 'OES_element_index_uint'
})
const camera = require('regl-camera')(regl, {})
const calcNormals = require('angle-normals')
const sc = require('simplicial-complex')
const repairMesh = require('../mesh-fixer')
const leg = require('./leg.json')

const repaired = repairMesh(leg.cells, leg.positions)

function Mesh (cells, positions) {
  this.positions = regl.buffer(positions)
  this.normals = regl.buffer(calcNormals(cells, positions))
  this.elements = regl.elements(
    sc.skeleton(cells, 1))
}

Mesh.prototype.draw = regl({
  elements: regl.this('elements'),

  attributes: {
    position: regl.this('positions'),
    normal: regl.this('normals')
  },

  frag: `
  precision highp float;
  varying vec3 color;
  void main () {
    gl_FragColor = vec4(
      pow(color, vec3(1. / 2.2)),
      1.);
  }
  `,

  vert: `
  precision highp float;
  attribute vec3 position, normal;
  uniform vec3 lcolor;
  varying vec3 color;
  uniform mat4 projection, view;
  void main () {
    color = pow(lcolor * 0.5 * (normal + 1.), vec3(2.2));
    gl_Position = projection * view * vec4(position, 1);
  }
  `,

  uniforms: {
    lcolor: regl.prop('color')
  }
})

const legMesh = new Mesh(leg.cells, leg.positions)
const repairedMesh = new Mesh(repaired.cells, repaired.positions)

const state = {
  repaired: true,
  input: true
}

require('control-panel')([
  {type: 'checkbox', label: 'repaired', initial: true},
  {type: 'checkbox', label: 'input', initial: true}
]).on('input', (data) => {
  Object.assign(state, data)
})

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  camera(() => {
    if (state.input) {
      legMesh.draw({ color: [1, 0.5, 0.25] })
    }
    if (state.repaired) {
      repairedMesh.draw({ color: [0.25, 0.5, 1] })
    }
  })
})
