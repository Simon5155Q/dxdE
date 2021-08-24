const tileSize = 90;
const noiseScale = 0.1;
const speed = 15;
const buffer = 10;
const images = [];

var x = 0;
var y = 0;
var w = 0;
var h = 0;
var xRO = 0; 
var yRO = 0;
var xTO = 0;
var yTO = 0;
var obj;
var canvas;
var zoom = 1.00;
var zMin = 0.05;
var zMax = 9.00;
var sensativity = 0.005;
// var mX = mouseX;
// var mY = mouseY
var drgn;
var x1;
var y1;
var x1A = [];
var y1A = [];
var x2 = 0;
var y2;
var rng;
var rngy;
var dtctn = false;
var drgnGroup;
var plrhp = 100;
var drgnhp = 40;
var spawnLimit = 25;
var chunk;
var chunkSize = 150;
var spawn;
var chunkGroup;
var s1, s2, s3, s4;
var objImg1;


const tiles = [];

function preload() {
  images.push(loadImage('Images/water.png')); //water
  images.push(loadImage('Images/sand.png')); //sand
  images.push(loadImage('Images/1.png')); //grass
  images.push(loadImage('Images/2.png')); //forest

  objImg1 = loadAnimation("Images/tile000.png,Images/tile001.png,Images/tile002.png,Images/tile003.png,Images/tile004.png,Images/tile005.png,Images/tile006.png,Images/tile007.png,Images/tile008.png");
}

function setup() {
 canvas = createCanvas(displayWidth, displayHeight);
  w = width / tileSize + buffer;
  h = height / tileSize + buffer;
  // fill("red");
   obj = createSprite(displayWidth/2,displayHeight/2,50,50);
   obj.debug = true;  
   obj.addAnimation("WF", objImg1);


  drgnGroup = new Group();

  spawn = createSprite(displayWidth/2,displayHeight/2, 850,810);
  spawn.shapeColor = "black"
  spawn.depth = 0;

  chunkGroup = new Group();
  s1 = createSprite(displayWidth/2, displayHeight/2 - 400, 850, 10);
  s2 = createSprite(displayWidth/2, displayHeight/2 + 400 , 850, 10);
  s3 = createSprite(displayWidth/2 + 420, displayHeight/2, 10, 810);
  s4 = createSprite(displayWidth/2 - 420, displayHeight/2, 10, 810);

  

  noStroke();
  //colorMode(HSB);
  drawTerrain();
  //fill("red");
  //obj.debug = true;
  //obj.depth = 10;
  console.log(obj.depth);
  // console.log(obj.x);
  // console.log(obj.y);

  /*for(var i = 0; i<x1A.length; i++){
    x1A[5] = x2
  }
  for(var i = 0; i<y1A.length; i++){
    y2 = y1A[i]
  }*/

}

function checkKey() {
  if (keyDown("W")) {
    y -= speed;
    spawn.velocityY = 5;
    chunkGroup.velocityYEach = 7;
    s1.velocityY = 5;
    s2.velocityY = 5;
    s3.velocityY = 5;
    s4.velocityY = 5;
  }
  if (keyDown("S")) {
    y += speed;
    spawn.velocityY = -5;
    chunkGroup.velocityYEach = -5;
    s1.velocityY = -5;
    s2.velocityY = -5;
    s3.velocityY = -5;
    s4.velocityY = -5;
  }
  if (keyDown("A")) {
    x -= speed;
    spawn.velocityX = 5;
    chunkGroup.velocityXEach = 5;
    s1.velocityX = 5;
    s2.velocityX = 5;
    s3.velocityX = 5;
    s4.velocityX = 5;
  }
  if (keyDown("D")) {
    x += speed;
    spawn.velocityX = -5;
    chunkGroup.velocityYEach = -5;
    s1.velocityX = -5;
    s2.velocityX = -5;
    s3.velocityX = -5;
    s4.velocityX = -5;
  }
    for(var i=0;i<drgnGroup.length;i++){
      if (keyDown("W")) {
        drgnGroup[i].velocityY = 5;
      }
      if (keyDown("S")) {
        drgnGroup[i].velocityY = -5;
      }
      if (keyDown("A")) {
        drgnGroup[i].velocityX = 5;
      }
      if (keyDown("D")) {
        drgnGroup[i].velocityX = -5;
      }
    }
}

function drawTerrain() {
  xRO = x % tileSize;
  yRO = y % tileSize;
  xTO = parseInt(x / tileSize);
  yTO = parseInt(y / tileSize);
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      tiles[i + j * w] = getTile(i, j);
    }
  }
  
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      image(tiles[i + j * w], (i - buffer / 2) * tileSize - xRO, (j - buffer / 2) * tileSize - yRO, tileSize, tileSize);
    }
  }
  
}

function getTile(x, y, terrainScales) {
  var v = noise((xTO + x) * noiseScale, (yTO + y) * noiseScale);
  var scales = [0.4, 0.5, 0.7, 1];
  for (var i = 0; i < scales.length; i++) {
    var terrainScale = scales[i];
    if (v <= terrainScale) {
      return images[i];
    }
  }
}

function draw() {
  
  // translate(displayWidth/20, height/90 - 500);
  // translate(-mouseX, -mouseY);
  // scale(3);
  resetSpeed();
  clear();
  update();
  drawTerrain();
  //chunks();
  drawSprites();
  /*console.log(mouseY);
  console.log(mouseX)*/

  if(keyDown("X")){
    spawnDragons();
    nonRepeat();
  }

  rng = Math.round(random(displayWidth, displayWidth/4));
  rngy = Math.round(random(displayHeight, displayHeight/4));

  obj.x = mouseX;
  obj.y = mouseY;

  // plrDetection();

  if(drgnGroup.isTouching(obj)){
    for(var i = 0; i < drgnGroup.length; i++){
      drgnGroup[i].attractionPoint(0.2,obj.x,obj.y);
      console.log("works");
    }
  }


  push();
  fill('#000000');
  textSize(20);
  text("FPS: "+Math.round(frameRate()), 30,30);
  pop();

  

}

function update() {
  if (keyIsPressed) {
    checkKey(key);
  }
}

function mouseWheel(event) {
  zoom -= sensativity * event.delta;
  zoom = constrain(zoom, zMin, zMax);
  //uncomment to block page scrolling
  return false;
}

function nonRepeat(){
  y1 = Math.round(random(displayHeight, displayHeight/4));
  x1 = Math.round(random(displayWidth, displayWidth/4));
  // return x
  // console.log(x);
  x1A.push(x1);
  y1A.push(y1);
  
  
}

function spawnDragons(){
  if(spawnLimit > 0){
    if(frameCount % 10 === 0){
      for(i = 0; i<x1A.length; i++){
        if(x1A[i] !== x1 && y1A[i] !== y1){
          drgn = createSprite(x1,y1,50,50);
          drgn.setCollider("circle",0,0,150);
          drgn.debug = true;
          drgn.shapeColor = "black"
          drgnGroup.add(drgn);
          // drgn.rotateToDirection = true;
          drgn.friction = 0.28599;
         /* console.log("tst");
          console.log("x1,y1 "+x1, y1);
          console.log("x2val "+x2,y2);
          console.log("array "+x1A, y1A);*/

        }
        if(x1A[i] !== x1 && y1A[i] !== y1){
          spawnLimit = spawnLimit - 1;
          console.log("spawnLimit: "+spawnLimit);
        }
      /*else{
        drgn = createSprite(x1 + rng, y1 + rngy,50,50);
        drgn.shapeColor = "red"
        drgn.setCollider("circle",0,0,150);
        drgn.debug = true;
        console.log("touching");
      }*/
      }
    }
  }
}

function chunks(){
  for (var i = 0; i < width; i=i+250) {
    for (var j = 0; j < height; j=j+200) {
      chunk = createSprite(i,j,chunkSize,chunkSize);
      chunkGroup.lifetime = width/5;
      chunkGroup.velocityYEach = 0;
      chunkGroup.velocityXEach = 0;
      chunkGroup.add(chunk);
      // chunk.depth = -80;
      chunk.debug = true;
    }
  }
}

function resetSpeed(){
  spawn.velocityX = 0;
  spawn.velocityY = 0;

  s1.velocityX = 0;
  s2.velocityX = 0;
  s3.velocityX = 0;
  s4.velocityX = 0;

  s1.velocityY = 0;
  s2.velocityY = 0;
  s3.velocityY = 0;
  s4.velocityY = 0;
}






