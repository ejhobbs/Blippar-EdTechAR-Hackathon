var blipp = require('blippar').blipp;

blipp.read("main.json");

var scene = blipp.addScene("default");

scene.onCreate = function() {
  var earth = scene.addMesh("cube1.md2");
  var dimension = blipp.getScreenWidth()/2;
  earth.addScale(100);
  earth.setTranslation(0,0,500);
}
