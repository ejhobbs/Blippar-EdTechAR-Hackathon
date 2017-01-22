var blipp = require('blippar').blipp;

var scene = blipp.addScene("default");
var ball = scene.addMesh("ball.md2");
var cannon = scene.addMesh("Cannon.md2");
var earth = scene.addMesh("Earth.md2");

scene.onCreate = function() {

  earth.setScale(637.1);
  earth.setTranslation(0,0,500);
  earth.setColor("#00FF00")

  cannon.setScale(60);
  cannon.setTranslation(0,1000,500);
  cannon.addRotation(-90,0,0);
  cannon.setColor("#FF0000");

  ball.setScale(50);
  ball.setTranslation(0,1000,500);
  ball.setColor("#000000");

  earth.setClickable(true);

}
earth.on('touchEnd', function() {
  fire(ball,59720, 100, 700);
});

function fire(node, mass, velocity, radius) {
  ball.setTranslation(0,1000, 500);
  var acceleration = 0.981;
  //var centripetalAcceleration = (velocity^2 / radius);
  orbit(node, velocity, mass, acceleration, radius);
}
var time = 0;
function orbit(node,velx, mass, acceleration, radius) {
  var vely = 0;
  time = Math.sqrt(((4*Math.pow(Math.PI,2))/acceleration*mass)*Math.pow(radius,3));
  console.log("Time: " + time);
  for (var i = 0; i < time/4; i++){
    velx -= acceleration;
    vely += acceleration;
    adjustPos(node, velx, vely, time);
  }
  // for (var i = 0; i < time/4; i++){
  //   velx -= acceleration;
  //   vely -= acceleration;
  //   setTimeout(adjustPos(velx, vely), 1000);
  // }
  // for (var i = 0; i < time/4; i++){
  //   velx += acceleration;
  //   vely += acceleration;
  //   setTimeout(adjustPos(velx, vely), 1000);
  // }
  // for (var i = 0; i < time/4; i++){
  //   velx += acceleration;
  //   vely -= acceleration;
  //   setTimeout(adjustPos(velx, vely), 1000);
  // }
}

function adjustPos(node, velx, vely, time) {
  node.animate().translation(node.getTranslation() + [velx, vely, 0]).duration(1/time);
  //console.log(new Date() + ":     x: " + velx + "    y: " + vely );
}
