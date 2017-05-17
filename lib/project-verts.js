var cross = require('gl-vec3/cross')
var dot = require('gl-vec3/dot')
var sub = require('gl-vec3/subtract')

var EPSILON = 0.000001
var edge1 = [0, 0, 0]
var edge2 = [0, 0, 0]
var tvec = [0, 0, 0]
var pvec = [0, 0, 0]
var qvec = [0, 0, 0]

function shootRay (pt, dir, a, b, c) {
  sub(edge1, b, a)
  sub(edge2, c, a)

  cross(pvec, dir, edge2)
  var det = dot(edge1, pvec)

  if (Math.abs(det) < EPSILON) {
    return Infinity
  }

  sub(tvec, pt, a)
  var u = dot(tvec, pvec)
  if (u < 0 || u > det) {
    return Infinity
  }

  cross(qvec, tvec, edge1)
  var v = dot(dir, qvec)
  if (v < 0 || u + v > det) {
    return Infinity
  }

  return dot(edge2, qvec) / det
}

module.exports = function (grid, origPositions, points, normals, tolerance) {
  for (var i = 0; i < points.length; ++i) {
    var p = points[i]

    var px = p[0]
    var py = p[1]
    var pz = p[1]

    var ix = Math.floor(px / tolerance)
    var iy = Math.floor(py / tolerance)
    var iz = Math.floor(pz / tolerance)

    console.log(ix, iy, iz, tolerance, p)

    var entry = grid[ix + ',' + iy + ',' + iz]
    if (!entry) {
      continue
    }
    console.log(i, entry.length)

    var n = normals[i]

    var tmin = 2.0 * tolerance

    for (var j = 0; j < entry.length; ++j) {
      var f = entry[j]

      var a = origPositions[f[0]]
      var b = origPositions[f[1]]
      var c = origPositions[f[2]]

      var t = shootRay(p, n, a, b, c)

      if (Math.abs(t) < Math.abs(tmin)) {
        tmin = t
      }
    }

    if (Math.abs(tmin) < 2 * tolerance) {
      console.log('hit:', tmin)
      p[0] = px + tmin * n[0]
      p[1] = py + tmin * n[1]
      p[2] = pz + tmin * n[2]
    }
  }
}
