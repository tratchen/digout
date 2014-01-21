/*==========
	GAME
==========*/

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

	this.updating = function() {
		
		this.player.calculateXP();
		this.player.spriteAnimation();
		this.UIUpdate();
		this.centerCamera();
	};

	this.centerCamera = function() {

		var cameraPosTop = Math.floor( (this.settings.gameHeight / 2) - (this.settings.currentLevel.length / 2) - this.player.y );
		var cameraPosLeft =  Math.floor( (this.settings.gameWidth / 2) - (this.settings.currentLevel.length / 2) - this.player.x );

		// move the "camera"
		this.component.DomWall.$allLayers.stop().animate({
			top: cameraPosTop,
			left: cameraPosLeft
		},this.player.baseSpeed * 10, 'easeOutExpo');
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

	this.modifyWall = function(col, row, type) {
		if (this.settings.currentLevel[row] !== undefined) {
			if (this.settings.currentLevel[row][col] !== undefined) {
				this.settings.currentLevel[row][col] = type || 0;
			}
		}
		return this.settings.currentLevel;
	};

	this.onClick = function(elem) {
		if (this.settings.gameRunning) {
			var dataCol = parseInt(elem.attr('data-col'), 10);
			var dataRow = parseInt(elem.attr('data-row'), 10);

			// Update the player level setting, Move the player, Update the level map 
			this.settings.currentLevel = this.modifyWall(dataCol, dataRow, this.player.moving(elem));

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

		if (moveAllowed && dataCol >= 0 && dataRow >= 0) {
			event.preventDefault();
			var elem = that.component.DomWall.$actionLayer.find('.actionWall#wall-'+ dataCol +'-'+ dataRow);
			if(elem) {
				that.settings.currentLevel = that.modifyWall(dataCol, dataRow, that.player.moving(elem));
			}
		}
	};
};