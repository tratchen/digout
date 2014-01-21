
/*
	DigOut - HTML5 Game
	https://github.com/copycut/digout
	Didier Chartrain - copycut.design@gmail.com
*/

//Private debuging
var debug = function(msg, info) {
	if (debugMode && window.console && window.console.log) {
		if (info) {
			console.log(info+ ': ', msg);
		} else {
			window.console.log(msg);
		}
	}
};

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
	if (key && value) {
		localStorage.setItem(key, JSON.stringify(value));
		debug('Game saved');
	}
};

var getSavedGame = function(key){
	debug('Game loaded');
	return JSON.parse(localStorage.getItem(key));
};

var easeOutCubic = function (t, b, c, d) {
	return c*((t=t/d-1)*t*t + 1) + b;
};

var easeInCubic = function (t, b, c, d) {
	return c*(t/=d)*t*t + b;
};



var debugMode = true;

var game;

// Get the dom elements
// TODO: Create them on the fly
var $game = $('#gameZone');

// Save dom elements in the gameSettings
gameComponents.DomWall = {};

gameComponents.DomWall.$game = $game;
gameComponents.DomWall.$levelsLayer = $game.find('#levelsLayer');
gameComponents.DomWall.$actionLayer = $game.find('#actionLayer');
gameComponents.DomWall.$allLayers = $game.find('#levelsLayer, #actionLayer, #playerTriggerLayer');
gameComponents.DomWall.$player = $game.find('#player');
gameComponents.DomWall.$playerSprite = $game.find('#playerSprite');
gameComponents.DomWall.$playerTrigger = $game.find('#playerTrigger');

// Check updates status and animations
function update() {
	// Update the ui
	if (gameSettings.gameRunning) {
		game.updating();
	}
}

// Auto start for test
function start() {
	 
	if (localStorage) {

		if (localStorage.save) {
			
			gameSettings = getSavedGame('save');
			
			debug(gameSettings, "There is a saved game");
		
		} else {
			debug('No saved game, new party.');
			
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

		if (debugMode) {
			$('.clearMemory').on('click', function(event) {
				event.preventDefault();
				localStorage.clear("save");
			}).show();
		}
	}

	// Init the Game
	game = new Game(gameSettings, gameComponents);
	game.init();
	
	// Animation Cycle
	setInterval(function() {
		update();
	}, 1000/game.settings.fps);
}

//Demo temp
start();


//Resize Event
$(window).resize(function() {
	if ( game ) {
		game.settings.gameWidth = $(window).width();
		game.settings.gameHeight = $(window).height();
	}
});
