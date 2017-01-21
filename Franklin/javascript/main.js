var blipp = require('blippar').blipp;

blipp.read("main.json");

var franklinScene = blipp.addScene();

var markerWidth = blipp.getMarker().getWidth();
var markerHeight = blipp.getMarker().getHeight();

franklinScene.onCreate = function(){
  console.log("scene created");
}

franklinScene.onShow = function(){
  console.log("Scene displayed");
}
