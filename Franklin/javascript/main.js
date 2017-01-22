var blipp = require('blippar').blipp;
//need this later
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
var scene = blipp.addScene();
//var screen = scene.getScreen();
var kite = scene.addSprite();
var cloud = scene.addMesh("cube1.md2");

var markerWidth = blipp.getMarker().getWidth();
var markerHeight = blipp.getMarker().getHeight();

var screenHeight = blipp.getScreenHeight() * 1.003;
var screenWidth = blipp.getScreenWidth() * 1.003;

scene.onCreate = function(){
  //kite.setType('solid');
  kite.setTexture('kite.png');
  kite.setTranslation(0,0, 400);
  kite.setScale(200)
  cloud.setTranslation(24,24,300);
  cloud.setScale(50);
  cloud.setColor(0.3,0.3,0.3);
  console.log("hello");
  cloud.setClickable(true);
  cloud.onTouchEnd = moveCloud;
}

scene.onShow = function(){
  console.log("Scene displayed");
  var myTimer = scene.animate().duration(33).loop(true);
  myTimer.onLoop = function(){
    curCameraPos = blipp.getCameraPosition();
    console.log("updating camera")
    var cameraZ = curCameraPos[2];
    var cameraY = curCameraPos[1];
    var cameraX = curCameraPos[0];
    //console.log(cameraZ);
    kite.setTranslation(cameraX,cameraY,cameraZ-800);
  }
}

scene.onUpdate = function(){
  //console.log("Cloud x: "+cloud.getTranslation()[0]+ "camera: "+cameraX);
  //TODO check collision ()
  //TODO change materials (change texture file)
}

function moveCloud(){
  console.log("moving");
  var x = getRandomArbitrary(markerWidth-((3*markerWidth)/2),markerWidth/2);
  var y = getRandomArbitrary(markerHeight-((3*markerHeight)/2),markerWidth/2);
  var z = getRandomArbitrary(250,350);
  // var curTranslation = cloud.getTranslation();
  // //console.log(curTranslation);
  // var curX = curTranslation[0];
  // var curY = curTranslation[1];
  // var curZ = curTranslation[2];
  // //console.log("Moving cloud x: "+x+"\n y: "+y+"\n z: "+z);
  // var newX = translateOrigin(mod(x+curX,markerHeight+1),markerWidth);
  // var newY = translateOrigin(mod(y+curY,markerWidth+1),markerHeight);
  console.log("x: "+x+" y: "+y+" z: "+z);
  cloud.setTranslation(x,y,z);

}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function mod(n,m) {
        return ((n % m) + m) % m;
}

function translateOrigin(ord,direction){
    var min = direction-((3*direction)/2);
    var max = direction/2;
    return ord.map(0,direction,min,max);
}
