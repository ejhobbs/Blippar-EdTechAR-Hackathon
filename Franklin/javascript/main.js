var blipp = require('blippar').blipp;
//need this later
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
var scene = blipp.addScene();
var screen = scene.getScreen();
var kite = scene.addSprite();
var kiteTextures = ['kite_metal.png','kite_wood.png'];
var cloudColors = [[0.3,0.3,0.3],[0.1,0.1,0.1]];
var curKiteTexture = 0;
var curCloudColor = 0;
var cloud = scene.addMesh("cube1.md2");
var bulb = screen.addSprite();

var markerWidth = blipp.getMarker().getWidth();
var markerHeight = blipp.getMarker().getHeight();

var screenHeight = blipp.getScreenHeight() * 1.003;
var screenWidth = blipp.getScreenWidth() * 1.003;

scene.onCreate = function(){
  blipp.setFPS(60);
  blipp.hideUiComponents('navBar')
  //
  swapMaterial();
  kite.setTranslation(0,0, 400);
  kite.setScale(200);
  kite.onTouchEnd = swapMaterial;
  //
  cloud.setTranslation(24,24,300);
  cloud.setScale(50);
  cloud.setColor(0.3,0.3,0.3);
  cloud.setClickable(true);
  cloud.onTouchEnd = toggleCloud;
  //
  bulb.setTexture('lightbulb_off.png');
  bulb.setScale(100);
  bulb.setTranslation((screenWidth/2)-60,(-screenHeight/2)+60,0);
}

scene.onShow = function(){
  //console.log("Scene displayed");
  var moveKite = scene.animate().duration(33).loop(true);
  moveKite.onLoop = function(){
    curCameraPos = blipp.getCameraPosition();
    //console.log("updating camera")
    var cameraZ = curCameraPos[2];
    var cameraY = curCameraPos[1];
    var cameraX = curCameraPos[0];
    //console.log(cameraZ);
    kite.setTranslation(cameraX,cameraY,cameraZ-800);
  }

  var cloudMover = scene.animate().duration(10000).loop(true);
  cloudMover.onLoop = function(){
    moveCloud();
  }
  var checkCollision = scene.animate().duration(33).loop(true);
  checkCollision.onLoop = function(){
    var kitePos = kite.getTranslation();
    var cloudPos = cloud.getTranslation();
    var result = [null,null,null];
    result.forEach(function(item,index,array){
      if(kitePos[index] < cloudPos[index]+30 && kitePos[index] > cloudPos[index]-30){
        array[index] = true;
      }
    });
    if (result[0] == result[1] == result[2] && curKiteTexture%2 == 0 && curCloudColor%2 == 0 ){
      changeLight("on");
    } else {
      changeLight("off");
    }
  }
}

scene.onUpdate = function(){
  //TODO check collision ()
  //TODO change materials (change texture file)
}

function moveCloud(){
  console.log("moving");
  var x = getRandomArbitrary(markerWidth-((3*markerWidth)/2),markerWidth/2);
  var y = getRandomArbitrary(markerHeight-((3*markerHeight)/2),markerWidth/2);
  var z = getRandomArbitrary(250,350);
  cloud.setTranslation(x,y,z);

}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function changeLight(position){
  bulb.setTexture("lightbulb_"+position+".png");
}

function swapMaterial(){
  curKiteTexture += 1;
  kite.setTexture(kiteTextures[curKiteTexture%2]);
  console.log(curKiteTexture);
}

function toggleCloud(){
  curCloudColor += 1;
  newColor = cloudColors[curCloudColor%2]
  cloud.setColor(newColor[0],newColor[1],newColor[2]);
}
