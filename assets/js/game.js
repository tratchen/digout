

// GAME CLASS

var Game = function(gameSettings, gameComponents) {

	this.settings = gameSettings;
	this.component = gameComponents;

	this.init = function() {

		var that = this;

		this.settings.gameWidth = $(window).width();
		this.settings.gameHeight = $(window).height();

		this.walls = new Walls();
		this.player = new Player();

		this.walls.init(this.settings, this.component, this);
		this.player.init(this.settings, this.component, this);

		// Drag and drop gamezone
		this.component.DomWall.$game.draggable();

		// Click on a floor bind event
		this.component.DomWall.$actionLayer.find('.actionWall').on('click', function(event) {
			event.preventDefault();
			that.onClick($(this));
		});
		
		// Move with Arrow Keys
		$(document.documentElement).keydown(function(event) {		
			that.onKeyDown(event);
		});
	};

	this.UIUpdate = function() {
		// Update the UI based on game settings
		// TEMPORARY TESTS
		this.component.DomWall.$game.find('#ui .antiPoison').html('Anti-Poison: ' + this.settings.antiPoison);
		this.component.DomWall.$game.find('#ui .poisonStatus').html('Poisoned?: ' + this.settings.poisoned);
		this.component.DomWall.$game.find('#ui .level').html('Level: ' + this.settings.level);
		this.component.DomWall.$game.find('#ui .life').html('PV: ' + this.settings.life);
		this.component.DomWall.$game.find('#ui .xp').html('Xp: ' + this.settings.xp);
		this.component.DomWall.$game.find('#ui .gold').html('Gold: ' + this.settings.gold);
		this.component.DomWall.$game.find('#ui .emerald').html('Emerald: ' + this.settings.emerald);
		this.component.DomWall.$game.find('#ui .key').html('Key?: ' + this.settings.levelKey);
	};

	this.onClick = function(elem) {
		if (this.settings.gameRunning) {
			var dataCol = parseInt(elem.attr('data-col'), 10);
			var dataRow = parseInt(elem.attr('data-row'), 10);

			// Update the player level setting, Move the player, Update the level map 
			this.player.settings.currentLevel = this.walls.modifyWall(dataCol, dataRow, this.player.moving(elem));

			// TODO : Save the player settings online
			saveGame('save', this.player.settings);
		}
	};

	this.onKeyDown = function(event) {
		var playerPosition = game.component.DomWall.$player;
		var dataRow = parseInt(playerPosition.attr('data-row'), 10);
		var dataCol = parseInt(playerPosition.attr('data-col'), 10);
		var moveAllowed = false;
		var that = this;
		
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
			var elem = that.component.DomWall.$actionLayer.find('.actionWall#wall-'+ dataCol +'-'+ dataRow);
			that.player.settings.currentLevel = that.walls.modifyWall(dataCol, dataRow, that.player.moving(elem));
		}
	};
};