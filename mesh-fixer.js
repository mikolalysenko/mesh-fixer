var rasterize = require('haar-3d/rasterize-cells')
var contour = require('haar-3d/contour')
var calcNormals = require('angle-normals')
var refine = require('refine-mesh')

var createGrid = require('./lib/mesh-grid')
var projectVerts = require('./lib/project-verts')

function calcTolerance (cells, positions) {
  var avgEdge = 0

  for (var i = 0; i < cells.length; ++i) {
    var c = cells[i]
    for (var j = 0; j < 3; ++j) {
      var a = positions[c[j]]
      var b = positions[c[(j + 1) % 3]]
      var d = Math.sqrt(
        Math.pow(a[0] - b[0], 2) +
        Math.pow(a[1] - b[1], 2) +
        Math.pow(a[2] - b[2], 2))

      avgEdge += d
    }
  }

  return 2 * avgEdge / (3 * cells.length)
}

module.exports = function (cells, positions, _options) {
  var options = _options || {}

  var tolerance
  if ('tolerance' in options) {
    tolerance = options.tolerance
  } else {
    tolerance = calcTolerance(cells, positions)
  }

  var GRID_SIZE = 2 * tolerance

  var mesh = contour(rasterize(cells, positions, {
    resolution: 0.5 * tolerance
  }))

  var grid = createGrid(cells, positions, GRID_SIZE)

  mesh.normals = calcNormals(mesh.cells, mesh.positions)
  mesh = refine(mesh.cells, mesh.positions, mesh.normals, {
    edgeLength: 0.5 * tolerance
  })

  projectVerts(
    grid,
    positions,
    mesh.positions,
    mesh.normals,
    GRID_SIZE)

  return mesh
}
