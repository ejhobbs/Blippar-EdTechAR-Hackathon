// ======================================================
// =                        BLIPP                       =
// ======================================================
blipp = require('blippar').blipp;

// ======================================================
// =                        SCENE                       =
// ======================================================
var	scene   = blipp.addScene('default');
var screenW = blipp.getScreenWidth()  * 1.003;
var screenH = blipp.getScreenHeight() * 1.003;
var unitM   = Math.round((Math.sqrt(screenW * screenW * (1+(256/81)))/5.5) / 0.0254); // 16/9 device with 5.5" diagonal
var unitCM  = unitM / 100;

scene.onCreate = function() {
	// Scene global variables
	scene.waterVideo        	= 'stock-footage-water-surface-fps-slow-motion-x-seconds.mp4';
	scene.poleSegments 			= [];
	scene.flareLayers  			= [];
	scene.poleSegmentsMax		= 100;
	scene.flareLayersMax 		= 5;
	scene.catchTimer 			= Date.now();
	scene.catchTimerHasStarted 	= false;
	scene.caughtFish 			= false;
	scene.floaterJitter 		= 1;
	scene.worldRotationX 		= 0;
	scene.gravity 				= [0,1,0];
	scene.prevGyroAngle 		= 0;
	scene.prevGyroOffset 		= 0;

	// Query the required assets
	blipp.addRequiredAssets([scene.waterVideo,
						     'Flare_0.png', 'Flare_1.png', 'Flare_2.png',
						     'Flare_3.png', 'Flare_4.png']);

	// Get screen node
	var screen = scene.getScreen();

	// Define far-end clipping plabe
	scene.setWorldDepthRange(10000000);

	// Create lights for the scene
    scene.defaultLight = scene.addLight('light')
    						  .setType('omni')
    						  .setTranslation(0, 20*unitM, -20*unitM)
    						  .setColor( 255/255, 223/255, 112/255);
    scene.chromeLight  = scene.addLight('Light_Chrome')
    						  .setType('omni')
    						  .setColor(255/255, 223/255, 112/255);

   	// Create materials for the scene
   	scene.defaultMaterial = scene.addMaterial('material')
    							 .setSelfLightIntensity(0.5)
    							 .setAmbientColor(255/255, 223/255, 112/255);
    scene.shinyMaterial   = scene.addMaterial('Material_Shiny')
    							 .setShininess(50)
    							 .setAmbientColor(255/255, 223/255, 112/255);
    scene.chromeMaterial  = scene.addMaterial('Material_Chrome')
    							 .setType('reflective')
    							 .setShininess(300)
    							 .setReflectivity(0.9)
    							 .setSelfLightIntensity(0.7)
    							 .setAmbientColor(255/255, 223/255, 112/255)
    							 .setReflectionTextures(['TopLights_0.jpg', 'TopLights_1.jpg',
    							 						 'TopLights_2.jpg', 'TopLights_3.jpg',
    							 						 'TopLights_4.jpg', 'TopLights_5.jpg']);

	// Create world and pivot nodes
	scene.world   = screen.addSprite();
	scene.pivot   = scene.addSprite().setParent(scene.world);

	// Create sun and flare objects
	scene.sun     = scene.pivot.addMesh('Sphere.md2')
						 	   .setTranslation(0, 20*unitM, -25*unitM)
						 	   .setScale(2*unitM)
						 	   .setColor('ffffff');
	scene.sunRays = scene.sun.addSprite('Sun.jpg')
						 	 .setScale(8)
						 	 .setRotationX(45)
							 .setSides('both')
						 	 .setBlend('add');
	scene.sunHalo = screen.addSprite()
						  .setScale(screenH, screenH, 0)
						  .setTexture('Halo.png')
						  .setType('aura')
						  .setBlend('add');
	for (var i = 0; i < scene.flareLayersMax; i++) {
		var sprite = scene.pivot.addSprite('Flare_'+i+'.png')
						  		.setTranslation(0, 18*unitM, (i/scene.flareLayersMax-18)*unitM)
						  		.setRotationX(45)
						  		.setScale((2+i/2) * 2 * unitM)
						  		.setType('aura')
						  		.setSides('both')
						  		.setBlend('add');
		scene.flareLayers.push(sprite);
	}

	// Create lake object and horizonn line
	scene.lake = scene.pivot.addSprite()
					  		.setTranslation(0, -1.5*unitM, -5*unitM)
					  		.setRotation(-90,0,0);
	var lakeLayersMax   = 50;
	var lakeLayerParent = scene.lake;
	for (var i = 0; i < lakeLayersMax; i++) {
		var ratio  = i/lakeLayersMax;
		var sprite = scene.addSprite()
					  	  .setTranslation(0, 0, unitCM)
					  	  .setColor(0, 0.65 * ratio, 1)
					  	  .setAlpha(0.04)
					  	  .setType('phantom')
					  	  .setParent(lakeLayerParent);
		if (i == 0) {
			sprite.setTranslation(0, 0, -lakeLayersMax*unitCM)
				  .setScale(10*unitM, 10*unitM, 1);
		}
		lakeLayerParent = sprite;
	}
	scene.lakeTopShine = scene.lake.addSprite('Water.jpg')
							  	   .setTranslation(0, -1.5*unitM, -1*unitCM)
							  	   .setScale(7*unitM, 7*unitM, 1)
								   .setAlpha(0.5)
								   .setBlend('add')
								   .setLight(scene.defaultLight)
								   .setMaterial(scene.shinyMaterial);
	scene.lakeTop = scene.lake.addSprite()
							  .setTranslation(0, -1.5*unitM, 0)
							  .setScale(7*unitM, 7*unitM, 1)
							  .setAlpha(0.5)
							  .setBlend('add');

	scene.lakeTop.onCreate = function() {
		this.playVideo(scene.waterVideo, '', true, false, false);
	}

	// Create floater object
	scene.floaterRoot  = scene.lake.addSprite()
								   .setTranslation(0, -5*unitM, 0);
	scene.floaterPivot = scene.floaterRoot.addSprite();
	scene.floater	   = scene.floaterPivot.addMesh('Sphere.md2')
							  			   .setScale(10*unitCM, 10*unitCM, 10*unitCM)
							  			   .setColor("ffffff")
							  			   .setType('solid')
							  			   .setLight(scene.defaultLight)
							  			   .setMaterial(scene.defaultMaterial);
	scene.floaterStick = scene.floater.addMesh('Cylinder.md2')
									  .setTranslation(0, 0, -1.5)
									  .setScale(0.1, 0.1, 3)
									  .setColor("ff0000")
									  .setType('solid')
									  .setLight(scene.defaultLight)
									  .setMaterial(scene.defaultMaterial);
	scene.floaterLine  = scene.floater.addMesh('Cylinder.md2')
									  .setTranslation(0, 0, -0.05)
									  .setScale(1.2, 1.2, 0.1)
									  .setColor("ff0000")
									  .setType('solid')
									  .setLight(scene.defaultLight)
									  .setMaterial(scene.defaultMaterial);

	// Create fish object
	scene.fishRoot = scene.lake.addSprite()
						  	   .setTranslation(0, -5*unitM, 0);
	scene.fish     = scene.fishRoot.addSprite()
								   .setTranslation(0, 3*unitM, 0.5*unitCM)
								   .setScale(100*unitCM)
								   .setType('solid')
								   .setBlend('add')
								   .setTexturesPreload(true)
		   						   .setTextures(['CircleRed.png', 'CircleGreen.png'])
		   						   .setActiveTexture(0);
	scene.fish.onUpdate = function() {
		this.addRotation([0,0,5]);
	}

	// Create water ripples
	scene.ripplesRoot = scene.lake.addSprite()
								  .setTranslation(0, -5*unitM, 0);
	scene.ripples     = scene.ripplesRoot.addSprite()
									 	 .setTranslation([0,0,1*unitCM])
										 .setScale(70*unitCM)
										 .setType('solid')
										 .setBlend('add')
										 .setTexturesPreload(true)
										 .setTextures(['Ripple_0.png', 'Ripple_1.png', 'Ripple_2.png',
										 			   'Ripple_3.png', 'Ripple_4.png', 'Ripple_5.png',
										 			   'Ripple_6.png', 'Ripple_7.png', 'Ripple_8.png',
										 			   'Ripple_9.png'])
										 .setActiveTexture(0);
	scene.ripples.onCreate = function() {
		this.animate().activeTexture(10).duration(1000).loop();
	}

	// Create fishing pole
	scene.fishingPole = scene.pivot.addSprite()
							  	   .setScale(screenW/4)
								   .setTranslation(screenW/2, -screenH/2, screenH/2)
								   .setRotation(180, 0, 0);
	for (var i = 0; i < scene.poleSegmentsMax; i++) {
		var sprite = scene.addMesh('Cylinder.md2')
						  .setTranslation(0, 0, 0.98)
						  .setScale(0.98)
						  .setColor('ff0000')
						  .setType('solid')
						  .setLight(scene.defaultLight)
						  .setMaterial(scene.defaultMaterial)

		sprite.addMesh('Cylinder.md2')
			  .setColor("ffffff88")
		      .setScale(0.03, 0.03, 0.95)
			  .setRotationX(2)
			  .setTranslation(0, 1.6, 0)
			  .setType('solid');

		if (i == 0) {
			sprite.setParent(scene.fishingPole)
				  .setScale(1, 1, 2)
				  .setRotation(20, 0, 20);
		} else {
			sprite.setParent(scene.poleSegments[i-1]);
			sprite.setRotation(-1, 0, 0);

			if (i%10 == 0) {
				scene.poleSegments[i-1].addMesh('Torus.md2')
									   .setTranslation(0, 1.2, 0.95)
									   .setScale(1.2)
									   .setColor('ffffff')
									   .setType('solid')
									   .setLight(scene.defaultLight)
									   .setMaterial(scene.chromeMaterial);

				scene.poleSegments[i-1].addMesh('Torus.md2')
								       .setTranslation(0, 0, 0.95)
								       .setScale(1.2)
								       .setColor('ffffff')
								       .setType('solid')
								       .setLight(scene.defaultLight)
								       .setMaterial(scene.chromeMaterial);

				scene.poleSegments[i-1].setColor("ffffff");
			}
		}
		if (i < 3) {
			sprite.setColor("333333");
		}

		scene.poleSegments.push(sprite);
	}

	// Create the gyro reset button
	scene.resetGyro = screen.addSprite()
						 	.setTexture(['ResetGyro.png','ResetGyro-A.png'])
						 	.setTranslation(-screenW/2 + screenH/14, -screenH/2 + screenH/14, 1)
						 	.setRotation(0, 0, -90)
					     	.setScale(screenH/16)
					     	.setClickable(true);
	scene.resetGyro.on('touchEnd', function(id, x, y) {
		initializeGyro();
	});

	// Create badges
	scene.badgesBG = screen.addSprite()
						   .setScale(0)
						   .setColor("ffffffcc");
	scene.badgesBG.on('touchEnd', function(id, x, y) {
		scene.badgesBG.setScale(0);
		scene.instructions.setScale(0);
		scene.caughtBadge.setScale(0);
		scene.gotAwayBadge.setScale(0);

		scene.catchTimer = Date.now();
		scene.catchTimerHasStarted = false;
		scene.caughtFish = false;

		resetFishing();
	});

	scene.instructions = screen.addSprite('Rules.png')
							   .setScale(screenH, screenH, 1)
							   .setAlpha(0);
	scene.pullUpBadge  = screen.addSprite('PullUp.png')
							   .setTranslationY(-screenH/3)
							   .setScale(screenH/4)
							   .setAlpha(0);
	scene.caughtBadge  = screen.addSprite('Caught.png')
							   .setScale(0);
	scene.gotAwayBadge = screen.addSprite('GotAway.png')
							   .setScale(0);

	// Create the timer object
	scene.timer = screen.addSprite()
						.setTranslation(-screenW/2, -screenH/2 - screenW*0.1, 0)
						.setScale(screenW/4)
						.setColor("ff0000ee");
	scene.timer.onUpdate = function() {
		timerUpdate();
	}


	// Initialize the gyro
	initializeGyro();

	// Reset the game parameters
	resetFishing();

	// Pop-up the instructions
	showRules();
}

scene.onUpdate = function() {

	// Get sensros
	var curGravity    = blipp.getSensor().getGravity();
	var curGyroY      = blipp.getSensor().getGyro()[1] * -180;

	// Compute current scene values
	var curGyroAngle  = curGyroY - scene.initGyroY;
	var curGyroOffset = curGyroAngle - scene.prevGyroAngle;
	scene.gravity[0]  = curGravity[0]*0.5 + scene.gravity[0]*0.5;
	scene.gravity[1]  = curGravity[1]*0.5 + scene.gravity[1]*0.5;
	scene.gravity[2]  = curGravity[2]*0.5 + scene.gravity[2]*0.5;

	// Cache current scene values for next iteration
	scene.prevGyroOffset = curGyroOffset;
	scene.prevGyroAngle  = curGyroAngle;

	// Update scene, floater, water and pole, sun flare position & orientation
	scene.world.setRotationX(-scene.gravity[2]*45);
	scene.pivot.setRotationY(curGyroAngle);

}

scene.onShow = function() {
	console.log("showing");
}

// ======================================================
// =                    USER FUNCTIONS                  =
// ======================================================
function initializeGyro(){
	// Calibrate the gyro
	blipp.getSensor().calibrateGyroscope();

	// Cache intial vertical gyro value
	scene.initGyroY = blipp.getSensor().getGyro()[1] * -180;
}

}
