
/*
	DigOut - HTML5 Game
	https://github.com/copycut/digout
	Didier Chartrain - copycut.design@gmail.com
*/

Math.rand = function(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
};

Array.prototype.random = function() {
	return this[Math.rand(0, this.length)];  
};

Number.prototype.clamp = function(min, max) {
	return Math.min(Math.max(this, min), max);
};





// jquery get dom elems
var $game = $('#gameZone');
var $levelsLayer = $game.find('#levelsLayer');
var $actionLayer = $game.find('#actionLayer');
var $allLayers = $game.find('#levelsLayer, #actionLayer, #playerTriggerLayer');
var $player = $game.find('#player');
var $playerSprite = $player.find('#playerSprite');
var $playerTrigger = $game.find('#playerTrigger');


// check updates status and animations
function update() {
	
}

// Auto start for test
(function start() {

	// Radom level :
	// level = new LevelGeneration(Math.floor(Math.random() * 6) + 6, Math.floor(Math.random() * 6) + 6);
	
	// Set a static level
	gameSettings.currentLevel = level_test_0;

	// Create a new game
	var newGame = new Game(gameSettings);

	// Player set - with the game settings at this moment
	var player = new Player(gameSettings);
	
	// Draw walls
	newGame.drawCollisionWalls();

	// Init the player
	player.init();
	
	// Click on a wall (or floor case)
	$actionLayer.find('.actionWall').on('click', function() {
		var dataCol = parseInt($(this).attr('data-col'),10);
		var dataRow = parseInt($(this).attr('data-row'),10);

		// Move the player and update the level map
		newGame.modifyWall(dataCol, dataRow, player.moving($(this)));
	});

	//Drag and drop gamezone
	$game.draggable();

	setInterval(function() {
		update();
	}, 1000/newGame.fps);
})();
