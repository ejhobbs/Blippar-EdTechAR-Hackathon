var blipp = require('blippar').blipp;

blipp.read("main.json");

var scene = blipp.addScene("default");

scene.onCreate = function() {
  var earth = scene.addSprite();
  earth.addMesh("cube1.md2");
  earth.addMesh("cube2.md2");
  var dimension = scene.getWidth()/2;
  earth.setHeight(dimension):
  earth.setWidth(dimension);
}
