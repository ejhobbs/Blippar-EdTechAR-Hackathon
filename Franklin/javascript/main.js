var blipp = require('blippar').blipp;
//need this later
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
var scene = blipp.addScene();
var screen = scene.getScreen();
var kite = screen.addSprite();
var cloud = scene.addMesh("cube1.md2");

var markerWidth = blipp.getMarker().getWidth();
var markerHeight = blipp.getMarker().getHeight();

var screenHeight = blipp.getScreenHeight() * 1.003;
var screenWidth = blipp.getScreenWidth() * 1.003;

scene.onCreate = function(){
  kite.setType('solid');
  kite.setTexture('kite.png');
  kite.setTranslation([screenWidth/4,screenHeight/4, 0]);
  cloud.setTranslation(24,24,300);
  cloud.setScale(50);
  cloud.setColor(0.3,0.3,0.3);
  console.log("hello");
  cloud.setClickable(true);
  cloud.onTouchEnd = moveCloud;
}

scene.onShow = function(){
  console.log("Scene displayed");
}

scene.onUpdate = function(){
  var scale = blipp.getCameraPosition()[2]/1000;
  kite.setScale(screenWidth/2.5*(1/(scale)));
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
  return Math.random()*2 * (max - min) + min;
}

function mod(n,m) {
        return ((n % m) + m) % m;
}

function translateOrigin(ord,direction){
    var min = direction-((3*direction)/2);
    var max = direction/2;
    return ord.map(0,direction,min,max);
}
