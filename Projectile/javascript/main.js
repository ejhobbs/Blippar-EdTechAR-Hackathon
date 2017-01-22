var blipp = require('blippar').blipp;

var scene = blipp.addScene("default");
var node = scene.addMesh();
var sattelite = node.addMesh("Cannon.md2");
var earth = scene.addMesh("Earth.md2");

var screen = scene.getScreen();
var orbit = screen.addSprite();
var overpower = screen.addSprite();
var crash = screen.addSprite();

scene.onCreate = function() {

  earth.setScale(200);
  earth.setTranslation(0,0,500);
  earth.setColor("#00FF00");

  sattelite.setScale(40);
  sattelite.setTranslation(0,500,500);
  sattelite.addRotation(-90,0,0);
  sattelite.setColor("#FF0000");

  orbit.setColor("#0000FF");
  orbit.setHeight(blipp.getScreenHeight()/2.5);
  orbit.setWidth(blipp.getScreenWidth()/2);
  orbit.setTranslation([0, -(blipp.getScreenHeight()/2), 0]);

  overpower.setColor("#FF0000");
  overpower.setHeight(blipp.getScreenHeight()/2.5);
  overpower.setWidth(blipp.getScreenWidth()/2);
  overpower.setTranslation([(blipp.getScreenWidth()/2), -(blipp.getScreenHeight()/2), 0]);

  crash.setColor("#FF0000");
  crash.setHeight(blipp.getScreenHeight()/2.5);
  crash.setWidth(blipp.getScreenWidth()/2);
  crash.setTranslation([-(blipp.getScreenWidth()/2), -(blipp.getScreenHeight()/2), 0]);

  node.animate().rotation([0,0,360]).duration(3000).loop(true);
}

orbit.on('touchEnd', function() {
  blipp.goToScene(scene);
  sattelite.setHidden(false);
  sattelite.animate().translation([0,500,500]).duration(1000)
  node.animate().rotation([0,0,360]).duration(3000).loop(true);
});

crash.on('touchEnd', function() {
  sattelite.setHidden(false);
  sattelite.animate().translation([0,0,0]).duration(4000).on('end', function() {
    sattelite.setHidden(true);
  });
});

overpower.on('touchEnd', function() {
  sattelite.setHidden(false);
  sattelite.animate().translation([blipp.getScreenWidth(), blipp.getScreenHeight(), 0]).duration(2000).on('end', function() {
    sattelite.setHidden(true);
  });
});
