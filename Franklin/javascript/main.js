var blipp = require('blippar').blipp;

var scene = blipp.addScene();
var markerWidth = blipp.getMarker().getWidth();
var markerHeight = blipp.getMarker().getHeight();

var screenHeight = blipp.getScreenHeight() * 1.003;
var screenWidth = blipp.getScreenWidth() * 1.003;

scene.onCreate = function(){

}

scene.onShow = function(){
  console.log("Scene displayed");
}

scene.onUpdate = function(){
  //TODO move cloud
  //TODO check collision
}
