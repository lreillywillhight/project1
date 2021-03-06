
var tileWidth = 64
var tileHeight = 64

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render })


function preload() {
  game.load.tilemap('newMap', 'assets/tilemap64_new.json', null, Phaser.Tilemap.TILED_JSON)
  game.load.image('tiles', 'assets/tileset.png')
  game.load.image('player', 'assets/meatball.png')
  game.load.image('goomber', 'assets/goomber.png')
  game.load.image('sign', 'assets/sign.png');


}

//misc
var map
var tileset
var layer
var player
var cursors
let keys = 0
let playerSpeed = 1000
var goomberSpeed = 150

//node storage, called by draw functions
let nodeListRight = []
let nodeListLeft = []
let nodeListUp = []
let nodeListDown = []
let currentNodeRight = []
let currentNodeLeft = []
let currentNodeUp = []
let currentNodeDown = []
let masterNodeList = [] //used to check all nodes simultaneously

function create() {

  game.physics.startSystem(Phaser.Physics.P2JS)


  game.stage.backgroundColor = '#787878'

  map = game.add.tilemap('newMap')

  map.addTilesetImage('tileset', 'tiles')
  layer = map.createLayer('tileLayer1')
  // map.setCollisionBetween(2, 3)
  // map.setCollisionBetween(8, 8)

  layer.resizeWorld()
  resetCollision()

  player = game.add.sprite((8 * tileWidth), (7 * tileHeight), 'player')

  goomber = game.add.sprite((10 * tileWidth), (9 * tileHeight), 'goomber')

  sign = game.add.image(1235, 331, 'sign')
  sign.alpha = 0
  // sign.anchor.set(0.5);

  game.physics.p2.enable(player, false)
  game.physics.p2.enable(goomber, false)

  //body physics
  player.body.fixedRotation = true
  player.body.setCircle(20, 0, 7)
  player.body.damping = .999
  player.body.collideWorldBounds = true

  // goomber.body.fixedRotation = true
  goomber.body.setCircle(25, 0, 0)
  goomber.body.velocity.x = -150
  goomber.body.damping = .4


  // game.input.addMoveCallback(p, this);

  game.physics.p2.setBoundsToWorld(true, true, true, true, false)
  game.camera.follow(player)

  cursors = game.input.keyboard.createCursorKeys()

  // unlockButton = game.input.keyboard.addKey(Phaser.keyboard.SPACEBAR ) //call in update()

}


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

//JS doesn't like these vars
let playerStartX = (1 * tileWidth)
let playerStartY = (9 * tileHeight)
//first map generation function
function generateMap0() {
  nodeList = []
  clearMap() //resets map to blank (except outer walls)
  // placeWall(playerStartX, 5); placeWall(2, 5); placeWall(3, 5); placeWall(4, 1); placeWall(4, 2); placeWall(4, 4); placeWall(4, 5);
  // placeWall(1, 8); placeWall(2, 8); placeWall(2, 8); placeWall(2, 9); placeWall(2, 10);; placeWall(2, 10); placeWall(1, 10);
  resetCollision()
  player.reset(playerStartX, playerStartY) //resets player sprite to tile
  currentNodeRight = [[startX,startY ]]
  // map.getTile(4, 9).properties.gate = true //adds key value gate to starting entrance
  // currentNodeRight.push([startX,startY])
  // drawAll(startX, startY)
}

document.getElementById("clearMapButton").addEventListener("click", function (e) {
  game.state.restart()
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


// let currentX // I think these are unused
// let currentY //

function drawUp() {
  let newXUp = currentNodeUp[0][0]
  let newYUp = currentNodeUp[0][1]
  currentNodeUp.shift()
  nodeListUp = []

  for (let i = newYUp - 1; i > 0; i--) {
    // checkCollide()
    placeFloor(newXUp, i)
    setVisited(newXUp, i)
    placeWall(newXUp + 1, i)
    placeWall(newXUp - 1, i)

    if (map.getTile(newXUp, i - 1).properties.visited || map.getTile(newXUp, i-1).index === 2 || i === 1) { break }
    nodeListUp.push(i)
  }
  console.log(nodeListUp)
  resetCollision()

  currentNodeLeft.push([newXUp, nodeListUp[Math.ceil(Math.random() * (nodeListUp.length - 1))]])

  currentNodeRight.push([newXUp, nodeListUp[Math.ceil(Math.random() * (nodeListUp.length - 1))]])

  console.log('cNRight', currentNodeRight[currentNodeRight.length - 1])
  console.log('cNLeft', currentNodeLeft[currentNodeLeft.length - 1])
  console.log('drawUp() end')
}


function drawDown() {
  let newXDown = currentNodeDown[0][0]
  let newYDown = currentNodeDown[0][1]
  currentNodeDown.shift()
  nodeListDown = []

  for (let i = newYDown + 1; i < map.height - 1; i++) {
    //checkCollide(cX, i)
    placeFloor(newXDown, i)
    setVisited(newXDown, i)
    placeWall(newXDown + 1, i)
    placeWall(newXDown - 1, i)
    if (map.getTile(newXDown, i + 1).properties.visited || map.getTile(newXDown,i+1).index === 2 || i === map.height-1) { break }
    nodeListDown.push(i)
  }
  console.log(nodeListDown)
  resetCollision()

  currentNodeLeft.push([newXDown, nodeListDown[Math.ceil(Math.random() * (nodeListDown.length - 1))]])

  currentNodeRight.push([newXDown, nodeListDown[Math.ceil(Math.random() * (nodeListDown.length - 1))]])

  console.log('cNLeft', currentNodeLeft[currentNodeLeft.length - 1])
  console.log('cNRight', currentNodeRight[currentNodeRight.length - 1])
  console.log('drawDown() end')
}




function drawLeft() {
  let newXLeft = currentNodeLeft[0][0]
  let newYLeft = currentNodeLeft[0][1]
  currentNodeLeft.shift()
  nodeListLeft = []

  for (let i = newXLeft - 1; i > 0; i--) {
    // checkCollide()
    // if () {}
    placeFloor(i, newYLeft)
    setVisited(i, newYLeft)
    placeWall(i, newYLeft + 1)
    placeWall(i, newYLeft - 1)
    if (map.getTile(i - 1, newYLeft).properties.visited || map.getTile(i-1, newYLeft).index === 2 || i === 1) {break}
      nodeListLeft.push(i)
  }
  console.log(nodeListLeft)
  resetCollision()

  currentNodeUp.push([nodeListLeft[Math.ceil(Math.random() * (nodeListLeft.length - 1))], newYLeft])

  currentNodeDown.push([nodeListLeft[Math.ceil(Math.random() * (nodeListLeft.length - 1))], newYLeft])

  console.log('cNUp', currentNodeUp[currentNodeUp.length - 1])
  console.log('cNDown', currentNodeDown[currentNodeDown.length - 1])
  console.log('drawLeft() end')
}


function drawRight() {
  let newXRight = currentNodeRight[0][0]
  let newYRight = currentNodeRight[0][1]
  currentNodeRight.shift()
  nodeListRight = []

  for (let i = newXRight + 1; i < map.width - 1; i++) {
    // checkCollide()
    // if () {}
    placeFloor(i, newYRight)
    setVisited(i, newYRight)
    placeWall(i, newYRight + 1)
    placeWall(i, newYRight - 1)
    if (map.getTile(i + 1, newYRight).properties.visited || map.getTile(i+1,newYRight).index === 2 || i === map.width-1) { break }
    nodeListRight.push(i)
  }
  console.log(nodeListRight)
  resetCollision()

  currentNodeUp.push([nodeListRight[Math.ceil(Math.random() * (nodeListRight.length - 1))], newYRight])

  currentNodeDown.push([nodeListRight[Math.ceil(Math.random() * (nodeListRight.length - 1))], newYRight])

  console.log('cNUp', currentNodeUp[currentNodeUp.length - 1])
  console.log('cNDown', currentNodeDown[currentNodeDown.length - 1])
  console.log('drawRight() end')
}



//shortcut maps (debug yes)
function r() { drawRight() }
function u() { drawUp() }
function d() { drawDown() }
function l() { drawLeft() }
let rn = currentNodeRight
let un = currentNodeUp
let dn = currentNodeDown
let ln = currentNodeLeft

let startX = 0 //starting XY coords for initial generation
let startY = 9
let currentNode = 0 //node for debugging purposes

//iteration, needs conditions for empty nodeLists, edge cases, collision handling
currentNodeRight = [[startX, startY]]
function drawAll() {
  drawRight()
  drawUp()
  drawLeft()
  drawDown()
}

document.getElementById('drawRight').addEventListener('click', function () {
  drawRight()
})
document.getElementById('drawLeft').addEventListener('click', function () {
  drawLeft()
})
document.getElementById('drawUp').addEventListener('click', function () {
  drawUp()
})
document.getElementById('drawDown').addEventListener('click', function () {
  drawDown()
})
document.getElementById('drawAll').addEventListener('click', function () {
  drawAll()
})


// uses 'keys' on spacebar.isDown
// function unlock() {
//   if ()
// }


//general event handlers for Phaser
function update() {

  //trigger endstate when exit tile is stepped on
  if (map.getTile(layer.getTileX(player.x), layer.getTileY(player.top)).index === 5) {
    if (document.getElementById('gameStatus').innerHTML !== "You escaped the maze!") {
      document.getElementById('gameStatus').innerHTML = "You escaped the maze!"
      player.kill()
    }
    // else {
    //   false
    // }
  }

  //unlock door (tile.index 3), removes a key, changes door to floor, reset collision !!!(refactor me)
  if (map.getTile(layer.getTileX(player.x), layer.getTileY(player.top)).index === 3 || map.getTile(layer.getTileX(player.x), layer.getTileY(player.bottom)).index === 3) {
    if (keys > 0) {
      if (map.getTile(layer.getTileX(player.x), layer.getTileY(player.top)).index === 3) {
        placeFloor(layer.getTileX(player.x), layer.getTileY(player.top))
        keys--
        document.getElementById('keysDisplay').innerHTML = "KEYS: " + keys
        resetCollision()
      }
      else if (map.getTile(layer.getTileX(player.x), layer.getTileY(player.bottom)).index === 3) {
        placeFloor(layer.getTileX(player.x), layer.getTileY(player.bottom))
        keys--
        document.getElementById('keysDisplay').innerHTML = "KEYS: " + keys
        resetCollision()
      }
      else {
        console.log('error in update.unlock')
      }
    }
  }

  //pick up a key
  if (map.getTile(layer.getTileX(player.x), layer.getTileY(player.y)).index === 4) {
    map.getTile(layer.getTileX(player.x), layer.getTileY(player.y)).index = 1
    keys++
    document.getElementById('keysDisplay').innerHTML = "KEYS: " + keys;
  }

  //goomber in jail message
  if (map.getTile(layer.getTileX(goomber.x), layer.getTileY(goomber.y)).index === 7) {
    if (document.getElementById('gameStatus').innerHTML === "Goomball - Arrow keys to move") {
      document.getElementById('gameStatus').innerHTML = "Goomber is in jail! Mean!"
      map.putTile(8, 27, 7)
    }
  }
  // instantly sets velocity to 0
  // player.body.setZeroVelocity()
  if (cursors.right.isDown) {
    player.body.moveRight(playerSpeed)
  }
  else if (cursors.left.isDown) {
    player.body.moveLeft(playerSpeed)
  }
  if (cursors.down.isDown) {
    player.body.moveDown(playerSpeed)
  }
  else if (cursors.up.isDown) {
    player.body.moveUp(playerSpeed)
  }

  // display sign when player on sign tile
  if (map.getTile(layer.getTileX(player.x), layer.getTileY(player.y)).index === 6) {
    sign.alpha = 1;
  }
  else {
    sign.alpha = 0;
  }
}


// goomber.body.velocity.x = -150

// unlockButton.isDown && keys > 1 {

// }

// 

function render() {
  // goomber.body.debug = true //body collision //debugs!
  // player.body.debug = true
  // layer.debug = true //layer collision
}



////////////////////////////GRAVEYARD//////////////////////////////

// function backtrackTunnelDown(nl, y) {
  //   if (y > map.height - 3) { return }
  //   else {
  //     // nl.pop()
  //     let newX = nl[Math.ceil(Math.random() * nl.length)]
  //     console.log('backtrackTunnelDown.newX', newX)
  //     drawDown(newX, y + 2)
  //   }
  // }

  // function backtrackTunnelRight(x, nl) {
  //   if (x > map.width - 3) { return }
  //   else {
  //     // nl.pop()
  //     let newY = nl[Math.ceil(Math.random() * nl.length)]
  //     console.log('backtrackTunnelRight.newY', newY)
  //     drawRight(x + 2, newY)
  //   }
  // }

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


//BACKTRACKTUNNELUP
// currentNode +=1
// nodeListUp = [] //local
// randomly selects an index value X from nodeList (newCXUp)
// places a ceil tile at (newCXUp,y-1)
// setVisited(newCXUp),y-1)
// newCXUp = X //local from nodeList
// newCYUp = Y-2
// drawUp()
// let newCXUp
// let newCYUp

