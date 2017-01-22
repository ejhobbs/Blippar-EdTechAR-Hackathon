var blipp = require('blippar').blipp;

var scene = blipp.addScene("default");
var node = scene.addMesh();
var sattelite = node.addMesh("Cannon.md2");
var earth = scene.addMesh("Earth.md2");

var screen = scene.getScreen();
var orbit = screen.addSprite("JUST ENOUGH.png");
var overpower = screen.addSprite("TOO FAST.png");
var crash = screen.addSprite("TOO SLOW.png");

var textback = screen.addSprite();

var rotation = null;

scene.onCreate = function() {
  blipp.hideUiComponents('navBar');
}

scene.onShow = function() {

  earth.setScale(200);
  earth.setTranslation(0,0,500);
  earth.setColor("#00FF00");

  sattelite.setScale(40);
  sattelite.setTranslation(0,500,500);
  sattelite.addRotation(-90,0,0);
  sattelite.setColor("#FF0000");

  orbit.setHeight(blipp.getScreenWidth()/2.5);
  orbit.setWidth(blipp.getScreenWidth()/2.5);
  orbit.setTranslation([0, -(blipp.getScreenHeight()/2)+200, 0]);

  overpower.setHeight(blipp.getScreenWidth()/2.5);
  overpower.setWidth(blipp.getScreenWidth()/2.5);
  overpower.setTranslation([(blipp.getScreenWidth()/2)-150, -(blipp.getScreenHeight()/2)+200, 0]);

  crash.setHeight(blipp.getScreenWidth()/2.5);
  crash.setWidth(blipp.getScreenWidth()/2.5);
  crash.setTranslation([-(blipp.getScreenWidth()/2)+150, -(blipp.getScreenHeight()/2)+200, 0]);

  textback.setColor("#FFFFFF");
  textback.setAlpha(0.9);
  textback.setHeight(blipp.getScreenHeight());
  textback.setWidth(blipp.getScreenWidth());
  textback.setHidden(true);

  rotation = node.animate().rotation([0,0,360]).duration(3000).loop(true);


}
orbit.on('touchEnd', function() {
  textback.setHidden(false);
});

textback.on('touchEnd', function () {
  textback.setHidden(true);
  startOrbit();
});

function startOrbit() {
  blipp.goToScene(scene);
}

crash.on('touchEnd', function() {
  sattelite.animate().translation([0,0,0]).duration(2000).on('end', function() {
    textback.setHidden(false);
  });
});

overpower.on('touchEnd', function() {
  rotation.stop();
  sattelite.animate().translation([-blipp.getScreenHeight(), 0, 0]).duration(2000).on('end', function() {
    textback.setHidden(false);
    textback.setTexture("fastMessage.png");
  });
});
