var rasterize = require('haar-3d/rasterize-cells')
var contour = require('haar-3d/contour')
var calcNormals = require('angle-normals')
var refine = require('refine-mesh')
var smooth = require('taubin-smooth')

var createGrid = require('./lib/mesh-grid')
var projectVerts = require('./lib/project-verts')

module.exports = function (cells, positions, options) {
  var tolerance = options.tolerance

  var haar = rasterize(cells, positions, {
    resolution: tolerance
  })

  var mesh = contour(haar)

  var grid = createGrid(cells, positions, 2 * tolerance)

  var normals = calcNormals(mesh.cells, mesh.positions)
  mesh = refine(mesh.cells, mesh.positions, normals, {
    edgeLength: 0.5 * tolerance
  })

  mesh.positions = smooth(mesh.cells, mesh.positions, {
    passBand: 0.1,
    iters: 50
  })

  projectVerts(
    grid,
    positions,
    mesh.positions,
    mesh.normals,
    2 * tolerance)

  return mesh
}
