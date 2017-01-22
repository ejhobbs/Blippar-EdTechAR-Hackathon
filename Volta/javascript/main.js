var blipp = require('blippar').blipp;
blipp.getPeel()
     .setOrientation('portrait')
     .setType('fit');

var mW    = blipp.getMarker().getWidth();
var mH    = blipp.getMarker().getHeight();
var sW 	  = blipp.getScreenWidth()  * 1.003;
var sH    = blipp.getScreenHeight() * 1.003;

var scene = blipp.addScene();
scene.addTransform().read("hierarchy.json");
var screen = scene.getScreen();

var numOfPair = 1;
var selectedMetal = "zinc";
var rootNode = scene.getChildren()[0];
var nodeContainer = rootNode.getChild("nodeContainer");
var nodeBulb = rootNode.getChild("bulbContainer").getChildren()[0].getChild("bulb");

var txtStatus = screen.addText("").setScale(1.2).setColor([1,0,0]).setTranslation(0, -430, 0);

// Scene creation
scene.onCreate = function() {
  var metalModels = ["battery.md2"];
  scene.setRequiredAssets(metalModels);

  var btnMore = screen.addText("+")
							        .setName("btnMore")
                      .setColor(0,0,0)
                      .setScale(6)
						          .setTranslation(-3*sH/16-40, 50+300, 0);

  var btnLess = screen.addText("-")
							        .setName("btnLess")
                      .setColor(0,0,0)
                      .setScale(10)
						          .setTranslation(-3*sH/16-40, 50+150, 0);

  var btnZinc = screen.addSprite("zinc.jpg")
							        .setName("btnZinc")
						          .setScale(sH/8)
						          .setTranslation(-3*sH/16-40, 0, 0);

	var btnCalcium = screen.addSprite("calcium.jpg")
					               .setName("btnCalcium")
					               .setScale(sH/8)
					               .setTranslation(-3*sH/16-40, -150, 0);

	var btnLithium = screen.addSprite("lithium.jpg")
						             .setName("btnLithium")
						             .setScale(sH/8)
						             .setTranslation(-3*sH/16-40, -300, 0);

  var txtZinc = screen.addText("Zn").setScale(2).setTranslation(-3*sH/16-40, 0, 0);
  var txtCal = screen.addText("Cal").setScale(2).setTranslation(-3*sH/16-40, -150, 0);
  var txtLi = screen.addText("Li").setScale(2).setTranslation(-3*sH/16-40, -300, 0);

  btnMore.onTouchEnd = function() {
    if (numOfPair < 10) {
      numOfPair++;
      redrawNodes();
    }
  }

  btnLess.onTouchEnd = function() {
    if (numOfPair > 0) {
      numOfPair--;
      redrawNodes();
    }
  }

  btnZinc.onTouchEnd = function() {
    selectedMetal = "zinc";
    redrawNodes();
  }

  btnCalcium.onTouchEnd = function() {
    selectedMetal = "calcium";
    redrawNodes();
  }

  btnLithium.onTouchEnd = function() {
    selectedMetal = "lithium";
    redrawNodes();
  }

}

scene.onShow = function() {
  redrawNodes();
}

reCalVoltage = function() {
  var ratio = 1;
  if (selectedMetal === "zinc")
    ratio = 1.1;
  else if (selectedMetal === "calcium")
    ratio = 2.1;
  else if (selectedMetal === "lithium")
    ratio = 3.38;
  var voltage = numOfPair*ratio;
  if (numOfPair === 0)
    txtStatus.setText("Please put some metals!");
  else
    txtStatus.setText("Currently " + selectedMetal + " is providing " + voltage.toFixed(2) + "V");
  nodeBulb.setColor([1,1,(255-7.5*voltage)/255]);
}

redrawNodes = function() {
  removeNodes();
  for (var i=0; i<numOfPair; i++) {
    addMetalPair(selectedMetal, 10+i*20);
  }
  reCalVoltage();
}

removeNodes = function () {
  do {
    var nodes = nodeContainer.getChildren();
    for (var i=0; i<nodes.length; i++) {
      nodes[i].destroy();
    }
  } while (nodeContainer.getChildren().length)
}

addMetalPair = function(metal,zpos) {
  addMetalNode("copper", zpos);
  addMetalNode(metal, zpos+10);
}

addMetalNode = function(metal, zpos) {
  var node = nodeContainer.addChild("Transform");
  node.addMesh("battery.md2")
 			.setScale(0.7,0.7,4)
			.setTranslation(0,0,zpos)
			.setType('solid')
			.setTexture(metal+".jpg");
}
