  var tileWidth = 64
  var tileHeight = 64

  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render})
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

  game.physics.startSystem(Phaser.Physics.ARCADE)

  game.stage.backgroundColor = '#787878'
  
  map = game.add.tilemap('newMap')

  map.addTilesetImage('tileset', 'tiles')

  map.setCollisionBetween(2,3)

  layer = map.createLayer('tileLayer1')

  layer.debug = true
  
  layer.resizeWorld()
  
  player = game.add.sprite((8 * tileWidth), (7 * tileHeight),'player')
  
  game.physics.enable(player, Phaser.Physics.ARCADE)
  
  // game.physics.arcade.gravity.x = 199 
  
  // player.body.bounce.y = .5
  // player.body.bounce.x = .5
  // player.body.linearDamping = .5
  player.body.collideWorldBounds = true
  player.body.setSize(24, 24, 24, 32)
  player.body.debug = true
  
  game.camera.follow(player)

  cursors = game.input.keyboard.createCursorKeys()

}

function update() {

  game.physics.arcade.collide(player, layer)
  player.body.velocity.x = 0
  player.body.velocity.y = 0

  if (cursors.up.isDown) {
    player.body.velocity.y = -200
  }
  else if (cursors.left.isDown) {
    player.body.velocity.x = -200
  }
  else if (cursors.down.isDown) {
    player.body.velocity.y = 200
  }
  else if (cursors.right.isDown) {
    player.body.velocity.x = 200
  }
}

function render() {
  // game.debug.bodyinfo()
}