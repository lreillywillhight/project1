var tileWidth = 64
var tileHeight = 64

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render })
// var game = new Phaser.Game((24 * tileWidth), (16 * tileHeight), Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render})


function preload() {
  game.load.tilemap('newMap', 'assets/tilemap64_2.json', null, Phaser.Tilemap.TILED_JSON)
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
      map.getTile(x, y).properties.visited = false // set to remove null error in checkTunnel
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

let startX = 4 //starting XY coords for initial generation
let startY = 9
let currentNode = 0 //node for debugging purposes
let nodeList = {} //used to calculate backtrack for tunneling to new draw locations
let currentX
let currentY

//BACKTRACKTUNNELUP
// currentNode +=1
// nodeListUp = [] //local
// randomly selects an index value X from nodeList (newCXUp)
// places a floor tile at (newCXUp,y-1)
// setVisited(newCXUp),y-1)
// newCXUp = X //local from nodeList
// newCYUp = Y-2
// drawUp()
// let newCXUp
// let newCYUp

// function backtrackTunnelUp(n, y) {
  // if (y < 3) { return }
  // else {
    // nl.pop()
    // drawUp(n, y - 2)
  // }
// }

function backtrackTunnelDown(nl, y) {
  if (y > map.height - 3) { return }
  else {
    // nl.pop()
    let newX = nl[Math.ceil(Math.random() * nl.length)]
    console.log('backtrackTunnelDown.newX',newX)
    drawDown(newX, y + 2)
  }
}

function backtrackTunnelRight(x, nl) {
  if (x > map.width - 3) { return }
  else {
    // nl.pop()
    let newY = nl[Math.ceil(Math.random() * nl.length)]
    console.log('backtrackTunnelRight.newY',newY)
    drawRight(x + 2, newY)
  }
}



function drawUp() {
  // let nodeStartX = cX
  // let nodeEndX
  let newXUp = currentNodeUp[0][0]
  let newYUp = currentNodeUp[0][1]
  currentNodeUp.shift()
  placeFloor(newXUp, newYUp - 1)
  setVisited(newXUp, newYUp - 1)
  placeFloor(newXUp, newYUp)
  // placeWall(newXUp + 1, newYUp); placeWall(newXUp - 1, newYUp)
  // setVisited(newXUp, newYUp)
  newYUp = newYUp - 1
  for (let i = newYUp; i > 0; i--) {
    // checkCollide()
    setVisited(newXUp, i)
    placeWall(newXUp + 1, i)
    placeWall(newXUp - 1, i)
    nodeListUp.push(i)
  }
  resetCollision()
  currentNodeLeft.push([ newXUp , nodeListUp[Math.ceil(Math.random() * nodeListUp.length)]])
  currentNodeRight.push([ newXUp , nodeListUp[Math.ceil(Math.random() * nodeListUp.length)]])
  console.log('drawUp() end')
}


function drawDown() {
  // let nodeStartX = cX
  // let nodeEndX
  let newXDown = currentNodeDown[0][0]
  let newYDown = currentNodeDown[0][1]
  currentNodeDown.shift()
  placeFloor(newXDown, newYDown + 1)
  setVisited(newXDown, newYDown)
  placeFloor(newXDown, newYDown)
  // placeWall(newXDown + 1, newYDown); placeWall(newXDown - 1, newYDown)
  // setVisited(newXDown, newYDown)
  newYDown = newYDown + 1
  for (let i = newYDown; i < map.height; i++) {
    // checkCollide()
    setVisited(newXDown, i)
    placeWall(newXDown + 1, i)
    placeWall(newXDown - 1, i)
    nodeListDown.push(i)
  }
  resetCollision()

  currentNodeLeft.push([newXDown,nodeListDown[Math.ceil(Math.random() * nodeListDown.length)]])

  currentNodeRight.push([newXDown,nodeListDown[Math.ceil(Math.random() * nodeListDown.length)]])

  console.log('drawDown() end')
}

// let checkTunnelRight = function (x, nly) {
//   // if (x === 22 || x === 21) { return }
//   // else {
//   let newListRight = []
//   for (i = 0; i < nly.length; i++) {
//     if (checkViableRight(x, nly[i])) {
//       newListRight.push(nly[i])
//     }
//   }
//   return newListRight
//   // }
// }

// function checkViableRight(x, nY) {
//   return (map.getTile((x + 2), nY).properties.visited === false && x + 1 !== 23 && x + 2 !== 23)
// }
// let newCXRight
// let newCYRight

// function backtrackTunnelRight(x, nl) {
//   // currentNode += 1
//   if (nl.length < 2) { return }
//   else {
//     let newListRight = checkTunnelRight(x, nl)
//     newCYRight = newListRight[Math.ceil(Math.random() * nl.length)]
//     placeFloor(x + 1, newCYRight)
//     newCXRight = x + 2
//     console.log('backtrackTunnelRight', newCXRight, newCYRight)
//     // drawRight(newCXRight, newCYRight)
//   }
// }

// //CHECKTUNNELUP
// //checks current nodelist (X values)
// //parses for each nodeList[i] (X) that returns IF map.getTile(nL[i],y+2).properties.visited = true;
// //                                             OR y+1 = 0;
// // returns parsed list

// let checkTunnelUp = function (nlx, y) {
//   // if (y === 1 || y === 2) { return }
//   // else {
//   let newListUp = []
//   for (i = 0; i < nlx.length; i++) {
//     if (checkViableUp(nlx[i], y)) {
//       newListUp.push(nlx[i])
//     }
//   }
//   return newListUp
//   // }
// }

// //CHECKVIABLEUP
// //helper function for checkTunnelUp()
// //returns true if tunneling is viable given x values of nodeList
// function checkViableUp(nX, y) {
//   return (map.getTile(nX, (y - 2)).properties.visited === false && y - 1 !== 0 && y - 2 !== 0)
// }

// // function checkTunnelDown() {

// // }

// function drawUp(cX, cY) {
//   // let nodeStartX = cX
//   // let nodeEndX
//   let newNodeListUp = []
//   // let newX = cX
//   // let newY = cY
//   for (let i = cY; (i > 0) && (map.getTile(cX, i).faceTop === false); i--) {
//     console.log(i)
//     // checkCollide() //moved to let loop
//     setVisited(cX, i)
//     // setNode(cX, i)
//     placeWall(cX + 1, i)
//     placeWall(cX - 1, i)
//     // nodeEndX = i
//     newNodeListUp.push(i)
//   }
//   resetCollision()
//   console.log('newNodeListUp', newNodeListUp)
//   if (newNodeListUp.length === 1) {
//     drawRight(cX,newNodeListUp[0])
//   }
//   else{
//   backtrackTunnelRight(cX, newNodeListUp) //backtrack to random location in currentNode, tunnel up
//   drawRight(newCXRight, newCYRight)
//   }
//   // checkTunnelDown()
//   // backtrackTunnelDown()
//   // resetCollision()
//   console.log('drawUp() end')
// }
// newNodeListUp = checkViableRight(cX,newNodeListUp)
// console.log('newNodeList.drawUp', newNodeListUp)

// newNodeListRight = checkTunnelRight(cX, newNodeListUp)
// console.log('newNodeListRight.drawUp',newNodeListUp)

// backtrackTunnelRight(cX, newNodeListUp) //backtrack to random location in currentNode, tunnel Right
// checkTunnelDown()
// backtrackTunnelDown()
// let currentXRight = []
// let currentXLeft = []
// let currentXUp = []
// let currentXDown = []
// let currentYRight = []
// let currentYLeft = []
// let currentYUp = []
// let currentYDown = []
let nodeListRight = []
let nodeListLeft = []
let nodeListUp = []
let nodeListDown = []
let currentNodeRight  = []
let currentNodeLeft = []
let currentNodeUp = []
let currentNodeDown = []
let masterNodeList = []

function drawLeft() {
  // let nodeStartX = cX
  // let nodeEndX
  let newXLeft = currentNodeLeft[0][0]
  let newYLeft = currentNodeLeft[0][1]
  currentNodeLeft.shift()
  newXLeft = newXLeft - 1
  placeFloor(newXLeft - 1, newYLeft)
  setVisited(newXLeft - 1, newYLeft)
  placeFloor(newXLeft, newYLeft); placeWall(newXLeft, newYLeft + 1); placeWall(newXLeft, newYLeft - 1)
  setVisited(newXLeft, newYLeft)
  for (let i = newXLeft; i > 0; i--) {
    // checkCollide()
    setVisited(i, newYLeft)
    placeWall(i, newYLeft + 1)
    placeWall(i, newYLeft - 1)
    nodeListLeft.push(i)
  }
  resetCollision()
  
  currentNodeUp.push([nodeListLeft[Math.ceil(Math.random() * nodeListLeft.length)], newYLeft])
  
  currentNodeDown.push([nodeListLeft[Math.ceil(Math.random() * nodeListLeft.length)], newYLeft])
  
  console.log('drawLeft() end')
}


function drawRight() {
  // let nodeStartX = cX
  // let nodeEndX
  let newXRight = currentNodeRight[0][0]
  let newYRight = currentNodeRight[0][1]
  currentNodeRight.shift()
  newXRight = newXRight + 1
  placeFloor(newXRight, newYRight)
  setVisited(newXRight, newYRight)
  placeFloor(newXRight, newYRight); placeWall(newXRight, newYRight + 1); placeWall(newXRight, newYRight - 1)
  setVisited(newXRight, newYRight)
  for (let i = newXRight; i < map.width - 1; i++) {
    // checkCollide()
    setVisited(i, newYRight)
    placeWall(i, newYRight + 1)
    placeWall(i, newYRight - 1)
    nodeListRight.push(i)
  }
  resetCollision()
  
  currentNodeUp.push([nodeListRight[Math.ceil(Math.random() * nodeListRight.length)], newYRight])
  
  currentNodeDown.push([nodeListRight[Math.ceil(Math.random() * nodeListRight.length)], newYRight])
  
  console.log('drawRight() end')
}


let playerStartX = (2 * tileWidth)
let playerStartY = (9 * tileHeight)

//first map generation function
function generateMap0() {
  nodeList = []
  clearMap() //resets map to blank (except outer walls)
  // placeWall(playerStartX, 5); placeWall(2, 5); placeWall(3, 5); placeWall(4, 1); placeWall(4, 2); placeWall(4, 4); placeWall(4, 5);
  placeWall(1, 7); placeWall(2, 7); placeWall(3, 7); placeWall(4, 7); placeWall(4, 8); placeWall(4, 10); placeWall(4, 11); placeWall(3, 11); placeWall(2, 11); placeWall(1, 11);
  resetCollision()
  player.reset(2 * tileWidth, 9 * tileHeight) //resets player sprite to tile 2,2
  map.getTile(4, 9).properties.gate = true //adds key value gate to starting entrance
  // currentNodeRight.push([startX,startY])
  // drawAll(startX, startY)
}

currentNodeRight.push([startX,startY])
function drawAll() {
  drawRight()
  drawUp()
  drawLeft()
  drawDown()
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