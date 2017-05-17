# mesh-fixer

Patches up holes and cracks in non-manifold meshes.

# Install

```
npm i mesh-fixer
```

# Example

```javascript
const mesh = loadMyBrokenMesh()

const repaired = require('mesh-fixer')(mesh.cells, mesh.positions, {
  tolerance: 0.5
})
```

# API

#### `require('mesh-fixer')(cells, positions, options)`
Fills in holes in a given mesh.

* `cells` are the faces of the mesh
* `positions` are the points of the mesh
* `options` an object containing the options for the mesh
    * `tolerance` the precision to which the mesh is to be repaired to

# Credits

Development supported by [Standard Cyborg](http://www.standardcyborg.com/)

<img src="sc.png" width=150 />

(c) 2017 Mikola Lysenko. MIT License
