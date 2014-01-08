
/*
	DigOut - HTML5 Game
	https://github.com/copycut/digout
	Didier Chartrain - copycut.design@gmail.com
*/

Math.rand = function(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
};

// Array.prototype.random = function() {
//	return this[Math.rand(0, this.length)];  
// };

Number.prototype.clamp = function(min, max) {
	return Math.min(Math.max(this, min), max);
};

var saveGame = function(key, value){
	localStorage.setItem(key, JSON.stringify(value));
};

var getSavedGame = function(key){
	return JSON.parse(localStorage.getItem(key));
};

var easeOutCubic = function (t, b, c, d) {
	return c*((t=t/d-1)*t*t + 1) + b;
};

var easeInCubic = function (t, b, c, d) {
	return c*(t/=d)*t*t + b;
};

var newGame;
var player;
var level;

// Get the dom elements
// TODO: Create them on the fly
var $game = $('#gameZone');

// Save dom elements in the gameSettings
gameComponents.DomWall = {};

gameComponents.DomWall.game = $game;
gameComponents.DomWall.levelsLayer = $game.find('#levelsLayer');
gameComponents.DomWall.actionLayer = $game.find('#actionLayer');
gameComponents.DomWall.allLayers = $game.find('#levelsLayer, #actionLayer, #playerTriggerLayer');
gameComponents.DomWall.player = $game.find('#player');
gameComponents.DomWall.playerSprite = $game.find('#playerSprite');
gameComponents.DomWall.playerTrigger = $game.find('#playerTrigger');

// Check updates status and animations
function update() {
	// Update the ui
	if (gameSettings.gameRunning) {
		newGame.UIUpdate(player.settings);
	}
}

// Auto start for test
function start() {
	 
	if (localStorage) {

		if (localStorage.save) {
			
			gameSettings = getSavedGame('save');
			
			console.log('There is a saved game: ', gameSettings);
		
		} else {
			console.log('No saved game, new party.');
			
			// Radom level :
			// level = new LevelGeneration(Math.floor(Math.random() * 6) + 6, Math.floor(Math.random() * 6) + 6);

			// Set a static level
			gameSettings.currentLevel = level_test_0;

			// Set the key status of this level
			gameSettings.levelKey = false;

			// Set the poison player status
			gameSettings.poisoned = false;

			// After loading
			gameSettings.gameRunning = true;
		}
	}

	// Create a new Game - auto init
	newGame = new Game().init(gameSettings, gameComponents);

	// Create a new Player - auto init
	player = new Player().init(gameSettings, gameComponents);

	// Click on a floor bind event
	gameComponents.DomWall.actionLayer.find('.actionWall').on('click', function(event) {
		event.preventDefault();

		if (gameSettings.gameRunning) {
			var dataCol = parseInt($(this).attr('data-col'), 10);
			var dataRow = parseInt($(this).attr('data-row'), 10);

			// Move the player and update the level map and update the player level setting
			player.settings.currentLevel = newGame.modifyWall(dataCol, dataRow, player.moving($(this)));

			// TODO : Save the player settings online
			gameSettings = player.settings;
			console.log(gameSettings);
			saveGame('save', gameSettings);
		}
	});

	// Move with Arrow Keys
	$(document.documentElement).keydown(function(event) {		
		var playerPosition = gameComponents.DomWall.player;
		var dataRow = parseInt(playerPosition.attr('data-row'), 10);
		var dataCol = parseInt(playerPosition.attr('data-col'), 10);
		var moveAllowed = false;
		
		if (event.keyCode === 40) {
			// Down
			moveAllowed = true;
			dataCol++;
		} else if (event.keyCode === 38) {
			// UP
			moveAllowed = true;
			dataCol--;
		} else if (event.keyCode === 37) {
			// Left
			moveAllowed = true;
			dataRow--;
		} else if (event.keyCode === 39) {
			// Right
			moveAllowed = true;
			dataRow++;
		}

		if (moveAllowed) {
			event.preventDefault();
			var elem = gameComponents.DomWall.actionLayer.find('.actionWall#wall-'+ dataCol +'-'+ dataRow);
			player.settings.currentLevel = newGame.modifyWall(dataCol, dataRow, player.moving(elem));
		}
	});

	// Drag and drop gamezone
	gameComponents.DomWall.game.draggable();

	// Animation Cycle
	setInterval(function() {
		update();
	}, 1000/newGame.fps);
}

//Demo temp
start();
