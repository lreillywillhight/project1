  var tileWidth = 32
  var tileHeight = 32

  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render})


function preload() {
  game.load.tilemap('newMap', 'assets/tilemap2.json', null, Phaser.Tilemap.TILED_JSON)
  game.load.image('tiles', 'assets/tileset.png')
}

var map
var tileset
var layer
var p
var cursors

function create() {

  game.physics.startSystem(Phaser.Physics.ARCADE)

  game.stage.backgroundColor = '#787878'
  
  map = game.add.tilemap('newMap')

  map.addTilesetImage('tileset1', 'tiles')

  layer = map.createLayer('tileLayer1')

  layer.resizeWorld()

}

function update() {

}

function render() {
  // game.debug.bodyinfo()
}