var blipp = require('blippar').blipp;

blipp.read("main.json");
var scene = blipp.addScene();
var markerWidth = blipp.getMarker().getWidth();
var markerHeight = blipp.getMarker().getHeight();
var screenHeight = blipp.getScreenHeight() * 1.003;
var screenWidth = blipp.getScreenWidth() * 1.003;

scene.onCreate = function(){
  //needed variables
  scene.prevGyroAngle 		= 0;
  scene.prevGyroOffset 		= 0;
	scene.gravity 				= [0,1,0];
  var screen = scene.getScreen();
  // sprites for adding objects
  scene.world   = screen.addSprite();
	scene.pivot   = scene.addSprite().setParent(scene.world);

  //create kite
  scene.kite = scene.pivot.addSprite()
					  		.setTranslation(0, -1.5*unitM, -5*unitM).setScale(screenWidth/7)
					  		.setRotation(-90,0,0).setTexture('kite.png');
  initializeGyro();
}

scene.onShow = function(){
  console.log("Scene displayed");
}

scene.onUpdate = function(){
  // Get sensor values
	var curGravity    = blipp.getSensor().getGravity();
	var curGyroY      = blipp.getSensor().getGyro()[1] * -180;

	// Compute current scene values
	var curGyroAngle  = curGyroY - scene.initGyroY;
	var curGyroOffset = curGyroAngle - scene.prevGyroAngle;
  var kiteRotY      = scene.prevGyroAngle + (curGyroOffset / 50);

  scene.kite.setRotationX(scene.gravity[2]*45+180+30)
					 .setRotationY(kiteRotY);
}

function initializeGyro() {
	// Calibrate the gyro
	blipp.getSensor().calibrateGyroscope();

	// Cache intial vertical gyro value
	scene.initGyroY = blipp.getSensor().getGyro()[1] * -180;
}
