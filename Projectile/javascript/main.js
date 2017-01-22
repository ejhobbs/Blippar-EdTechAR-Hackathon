
var blipp = require('blippar').blipp;


var scene = blipp.addScene("default");
var node = scene.addMesh();
var cannon = node.addMesh("Cannon.md2");
var earth = scene.addMesh("Earth.md2");

scene.onCreate = function() {

  earth.setScale(300);
  earth.setTranslation(0,0,500);
  earth.setColor("#00FF00");

  cannon.setScale(60);
  cannon.setTranslation(0,600,500);
  cannon.addRotation(-90,0,0);
  cannon.setColor("#FF0000");

  earth.setClickable(true);

}
earth.on('touchEnd', function() {
  fire(100);
});

function fire() {
  node.animate().rotation([0,0,360]).duration(3000).loop(true);
}
