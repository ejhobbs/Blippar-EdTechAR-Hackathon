var blipp = require('blippar').blipp;

var scene = blipp.addScene();
var screen = scene.getScreen();
var kite = screen.addSprite();
var cloud = scene.addMesh("cube1.md2");

var markerWidth = blipp.getMarker().getWidth();
var markerHeight = blipp.getMarker().getHeight();

var screenHeight = blipp.getScreenHeight() * 1.003;
var screenWidth = blipp.getScreenWidth() * 1.003;

scene.onCreate = function(){
  console.log(blipp.getCameraPosition());
  kite.setType('solid');
  kite.setTexture('kite.png');
  kite.setTranslation([screenWidth/4,screenHeight/4, 0]);
  cloud.setTranslation(24,24,300);
  cloud.setScale(50);
  cloud.setColor(50,50,50);
}

scene.onShow = function(){
  console.log("Scene displayed");
}

scene.onUpdate = function(){
  var scale = blipp.getCameraPosition()[2]/1000;
  //console.log(scale)
  kite.setScale(screenWidth/3*(1/(scale)));
  //TODO move cloud
  //TODO check collision
}
