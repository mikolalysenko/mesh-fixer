module.exports = function (cells, positions, tolerance) {
  var grid = {}

  for (var i = 0; i < cells.length; ++i) {
    var f = cells[i]

    var a = positions[f[0]]
    var b = positions[f[1]]
    var c = positions[f[2]]

    var lox = Math.floor(Math.min(a[0], b[0], c[0]) / tolerance) - 1
    var loy = Math.floor(Math.min(a[1], b[1], c[1]) / tolerance) - 1
    var loz = Math.floor(Math.min(a[2], b[2], c[2]) / tolerance) - 1

    var hix = Math.ceil(Math.max(a[0], b[0], c[0]) / tolerance) + 1
    var hiy = Math.ceil(Math.max(a[1], b[1], c[1]) / tolerance) + 1
    var hiz = Math.ceil(Math.max(a[2], b[2], c[2]) / tolerance) + 1

    for (var x = lox; x <= hix; ++x) {
      for (var y = loy; y <= hiy; ++y) {
        for (var z = loz; z <= hiz; ++z) {
          var tok = x + ',' + y + ',' + z
          var entry = grid[tok]
          if (entry) {
            entry.push(f)
          } else {
            grid[tok] = [f]
          }
        }
      }
    }
  }

  return grid
}
