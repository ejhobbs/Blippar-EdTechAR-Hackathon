var blipp = require('blippar').blipp;

blipp.read("main.json");

var scene = blipp.addScene("default");

scene.onCreate = function() {

  var earth = scene.addMesh("Earth.md2");
  earth.setScale(200);
  earth.setTranslation(0,0,500);

  var cannon = scene.addMesh("Cannon.md2");
  cannon.setScale(20);
  cannon.setTranslation(0,280,500);
  cannon.addRotation(-90,0,0);
}
