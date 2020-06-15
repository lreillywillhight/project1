var tileWidth = 64
var tileHeight = 64

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render })
// var game = new Phaser.Game((24 * tileWidth), (16 * tileHeight), Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render})


function preload() {
  game.load.tilemap('newMap', 'assets/tilemap64.json', null, Phaser.Tilemap.TILED_JSON)
  game.load.image('tiles', 'assets/tileset.png')
  game.load.image('player', 'assets/meatball.png')
}

var map
var tileset
var layer
var player
var cursors

function create() {

  game.physics.startSystem(Phaser.Physics.P2JS)

  game.physics.p2.restitution = .8

  game.stage.backgroundColor = '#787878'

  map = game.add.tilemap('newMap')

  map.addTilesetImage('tileset', 'tiles')

  map.setCollisionBetween(2, 3)

  layer = map.createLayer('tileLayer1')


  layer.resizeWorld()

  resetCollision()

  player = game.add.sprite((8 * tileWidth), (7 * tileHeight), 'player')

  game.physics.p2.enable(player, false)

  // player.body.damping()
  player.body.fixedRotation = true
  player.body.setCircle(20, 0, 7)

  // game.physics.arcade.gravity.x = 199 

  // player.body.bounce.y = .5
  // player.body.bounce.x = .5
  // player.body.linearDamping = .5
  // player.body.collideWorldBounds = true
  // player.body.setSize(24, 24, 24, 32)
  game.physics.p2.setBoundsToWorld(true, true, true, true, false)


  game.camera.follow(player)

  cursors = game.input.keyboard.createCursorKeys()

}

// let mapHeight = map.height

//CLEARMAP
//removes all tiles (except outer walls) from map
//map.removeTile(x,y) //x,y is tile
//map.width; map.height //x,y is tile
//map.getTile(x,y) // xy is tile

function clearMap() {
  for (let x = 1; x < map.width - 1; x++) {
    for (let y = 1; y < map.height - 1; y++) {
      map.removeTile(x, y)  //removes tile
      placeFloor(x, y)    //places floor tile
      map.getTile(x,y).properties.visited = false // set to remove null error in checkTunnel
    }
  }
  resetCollision()
}

document.getElementById("clearMapButton").addEventListener("click", function (e) {
  clearMap()
})

document.getElementById('generateMap0').addEventListener('click', function (e) {
  console.log('bing')
  generateMap0()
})


//helpers for map generation
function placeWall(x, y) { map.putTile(2, x, y) } //places a collidable wall at x,y tile\
function placeFloor(x, y) { map.putTile(1, x, y) } //places a floor tile at xy tile
function resetCollision() { game.physics.p2.convertTilemap(map, layer) }
function setVisited(x, y) { map.getTile(x, y).properties.visited = true }
function setNode(x, y) { map.getTile(x, y).properties.node = currentNode }

let startX = 5 //starting XY coords for initial generation
let startY = 9
let currentNode = 0 //node for debugging purposes
let nodeList = [] //used to calculate backtrack for tunneling to new draw locations

//BACKTRACKTUNNELUP
// currentNode +=1
// nodeListUp = [] //local
// randomly selects an index value X from nodeList (newCXUp)
// places a floor tile at (newCXUp,y-1)
// setVisited(newCXUp),y-1)
// newCXUp = X //local from nodeList
// newCYUp = Y-2
// drawUp()

function backtrackTunnelUp (nl, y) {
  if (nl = null) {return}
  else {
  currentNode +=1
  let newListUp = []
  newCXUp = nl[Math.ceil(Math.random() * nl.length)]
  placeFloor(newCXUp, y-1)
  newCYUp = y-2
  drawUp(newCXUp, newCYUp)
  }
}

function backtrackTunnelRight (x, nl) {
  if (nl = null) {return}
  else {
  currentNode +=1
  // let newListRight = []
  newCY = nl[Math.ceil(Math.random() * nl.length)]
  placeFloor(x+1, newCYUp)
  newCX = x + 2
  drawRight(newCX, newCY)
  }
}

function checkViableRight(x, nY) {
  return (map.getTile((x + 2), nY).properties.visited === false && x + 1 !== 23)
}

let checkTunnelRight = function(x, nly) {
  let newListRight = []
  for (i = 0; i < nly.length; i++)
  if (checkViableRight(x, nly[i])) {
    newListRight.push(nly[i])
  }
  // else {
  //   false
  // }
  // newNodeList = newListUp
  // console.log('newListRight.checkTunnelRight()',newListRight)
  return newListRight
}

//CHECKTUNNELUP
//checks current nodelist (X values)
//parses for each nodeList[i] (X) that returns IF map.getTile(nL[i],y+2).properties.visited = true;
//                                             OR y+1 = 0;
// returns parsed list
let checkTunnelUp = function(nlx, y) {
  let newListUp = []
  for (i = 0; i < nlx.length; i++)
  if (checkViableUp(nlx[i],y)) {
    newListUp.push(nlx[i])
  }
  // else {
  //   false
  // }
  // newNodeList = newListUp
  // console.log('checkTunnelUp.newListUp',newListUp)
  return newListUp
}

//CHECKVIABLEUP
//helper function for checkTunnelUp()
//returns true if tunneling is viable given x values of nodeList
function checkViableUp(nX, y) {
  // console.log(map.getTile(nX,y - 2).properties)
  return (map.getTile(nX, (y - 2)).properties.visited === false && y-1 !== 0 && y-2 !== 0)
}

// function checkTunnelDown() {

// }

function drawUp(cX, cY) {
  // let nodeStartY = cY
  // let nodeEndY
  let newNodeListUp = []
  // let newNodeListUp = []
  // let newX = cX
  // let newY = cY
  for (let i = cY; i > 0; i--) {
    setVisited(cX, i)
    setNode(cX, i)
    // console.log(map.getTile(cX, i).properties)
    // map.getTile(cX, i).properties
    placeWall(cX - 1, i)
    placeWall(cX + 1, i)
    // nodeEndY = i
    newNodeListUp.push(i)
    // return newNodeListUp
    // console.log('blahh',newNodeList)
  }
  resetCollision()
  newNodeListUp = checkTunnelRight(cX, newNodeListUp)
  console.log('newNodeList.drawUp',newNodeListUp)
  backtrackTunnelRight(cX, newNodeListUp) //backtrack to random location in currentNode, tunnel Right
  // checkTunnelDown()
  // backtrackTunnelDown()
  console.log('drawUp() end')
}

function drawRight(cX, cY) {
  // let nodeStartX = cX
  // let nodeEndX
  let newNodeList = []
  // let newX = cX
  // let newY = cY
  for (let i = cX; i < map.width; i++) {
    setVisited(i, cY)
    setNode(i, cY)
    placeWall(i, cY + 1)
    placeWall(i, cY - 1)
    // nodeEndX = i
    newNodeList.push(i)
  }
  resetCollision()
  newNodeList = checkTunnelUp(newNodeList, cY)
  console.log('newNodeList.drawRight',newNodeList)
  backtrackTunnelUp(newNodeList, cY) //backtrack to random location in currentNode, tunnel up
  // checkTunnelDown()
  // backtrackTunnelDown()
  console.log('drawRight() end')
}

let playerStartX = (2 * tileWidth)
let playerStartY = (18 / 2 * tileHeight)
//first map generation function
function generateMap0() {
  nodeList = []
  clearMap() //resets map to blank (except outer walls)
  // placeWall(playerStartX, 5); placeWall(2, 5); placeWall(3, 5); placeWall(4, 1); placeWall(4, 2); placeWall(4, 4); placeWall(4, 5);
  placeWall(1, 7); placeWall(2,7); placeWall(3,7); placeWall(4,7); placeWall(4,8); placeWall(4,10); placeWall(4,11); placeWall(3,11); placeWall(2,11); placeWall(1,11);
  resetCollision()
  player.reset(playerStartX,playerStartY) //resets player sprite to tile 2,2
  map.getTile(4, 9).properties.gate = true //adds key value gate to starting entrance
  drawRight(startX, startY)
}



function update() {

  // game.physics.arcade.collide(player, layer)
  // player.body.velocity.x = 0
  // player.body.velocity.y = 0
  player.body.setZeroVelocity()

  if (cursors.right.isDown) {
    player.body.moveRight(300)
  }
  else if (cursors.left.isDown) {
    player.body.moveLeft(300)
  }
  if (cursors.down.isDown) {
    player.body.moveDown(300)
  }
  else if (cursors.up.isDown) {
    player.body.moveUp(300)
  }
}

function render() {
  // game.debug.bodyinfo()
  player.body.debug = true
  layer.debug = true
}