var blipp = require('blippar').blipp;

blipp.read("main.json");

var franklinScene = blipp.addScene();

var markerWidth = blipp.getMarker().getWidth();
var markerHeight = blipp.getMarker().getHeight();

var screenHeight = blipp.getScreenHeight() * 1.003;
var screenWidth = blipp.getScreenWidth() * 1.003;

franklinScene.onCreate = function(){
  console.log("scene created");
  var sphere = franklinScene.addMesh('cube1.md2');
  sphere.addScale(200);
  var defaultLight = scene.addLight("light");
  var defaultMaterial = scene.addMaterial("material");
  sphere.setMaterial(defaultMaterial);
  franklinScene.setLight(defaultLight);
}

franklinScene.onShow = function(){
  console.log("Scene displayed");
}
