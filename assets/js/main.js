
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



$(document).ready(function() {

	// Get the dom elements (TODO: Create them on the fly)
	var $game = $('#gameZone');

	// Save dom elements in the gameSettings
	gameSettings.DomWall = {};

	gameSettings.DomWall.game = $game;
	gameSettings.DomWall.levelsLayer = $game.find('#levelsLayer');
	gameSettings.DomWall.actionLayer = $game.find('#actionLayer');
	gameSettings.DomWall.allLayers = $game.find('#levelsLayer, #actionLayer, #playerTriggerLayer');
	gameSettings.DomWall.player = $game.find('#player');
	gameSettings.DomWall.playerSprite = $game.find('#playerSprite');
	gameSettings.DomWall.playerTrigger = $game.find('#playerTrigger');




	// Check updates status and animations
	function update() {
		
	}

	// Auto start for test
	function start() {
		// Radom level :
		// level = new LevelGeneration(Math.floor(Math.random() * 6) + 6, Math.floor(Math.random() * 6) + 6);
		
		// Set a static level
		gameSettings.currentLevel = level_test_0;

		// Create a new Game - auto init
		var newGame = new Game().init(gameSettings);

		// Create a new Player - auto init
		var player = new Player().init(gameSettings);

		// Click on a floor
		gameSettings.DomWall.actionLayer.find('.actionWall').on('click', function() {
			var dataCol = parseInt($(this).attr('data-col'),10);
			var dataRow = parseInt($(this).attr('data-row'),10);

			// Move the player and update the level map
			newGame.modifyWall(dataCol, dataRow, player.moving($(this)));
		});

		// Drag and drop gamezone
		gameSettings.DomWall.game.draggable();

		// Animation Cycle
		setInterval(function() {
			update();
		}, 1000/newGame.fps);
	};

	//Demo temp
	start();
});
