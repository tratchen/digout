
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

var defaultGameSettings = {
	gameWidth: 800,
	gameHeight: 600,
	baseMap: 96,
	fps: 50,
	currentLevel: null
};

/*==========
	GAME
==========*/

var Game = function(settings) {
	
	this.settings = settings;

	this.drawCollisionWalls = function() {

		var length = this.settings.currentLevel.length;
		var row;
		var col;

		// Create wall based on the level titled map
		for (row = 0; row < length; row++) {
			for (col = 0; col < this.settings.currentLevel[row].length; col++) {
								
				//create empty elements
				var wallsDiv = $(document.createElement('div')).addClass('walls');
			
				var collisionWallDiv = $(document.createElement('div')).css({
					top: (row*this.settings.baseMap),
					left: (col*this.settings.baseMap),
					zIndex: ((row+1)*10)+col
				}).attr({
					class: 'type' + this.settings.currentLevel[row][col],
					id: 'wall-' + row + '-' + col,
					"data-row": row,
					"data-col": col,
					"data-type": this.settings.currentLevel[row][col]
				});

				var actionWallDiv = collisionWallDiv.clone();

				// place elements
				wallsDiv.appendTo(collisionWallDiv);
				$levelsLayer.append(collisionWallDiv.addClass('collisionWall'));
				$actionLayer.append(actionWallDiv.addClass('actionWall'));
			}
		}

		$levelsLayer.css({
			width: this.settings.gameWidth,
			height: this.settings.gameHeight
		});
	};

	this.modifyWall = function(col, row, type) {
		settings.currentLevel[row][col] = type;
	}
};


/*============
	PLAYER
============*/

var Player = function(settings) {

	this.settings = settings;
	this.width = this.settings.baseMap;
	this.height = this.settings.baseMap;
	this.x = 0;
	this.y = 0;
	this.baseSpeed = 150;
	this.spriteLoop = 0;
	this.state = "idle";
	this.possiblesMoves = [
		[0,0,0,0,0],
		[0,0,1,0,0],
		[0,1,0,1,0],
		[0,0,1,0,0],
		[0,0,0,0,0]
	];
	this.possiblesActions = [
		[0,0,0,0,0],
		[0,0,1,0,0],
		[0,1,0,1,0],
		[0,0,1,0,0],
		[0,0,0,0,0]
	];
	this.spriteAnimation = null;
	this.actionWallFlag = true;

	this.init = function() {
		this.x = parseInt($actionLayer.find('.type4').css('left'),10);
		this.y = parseInt($actionLayer.find('.type4').css('top'),10);
		this.sprite(this.state);
		this.draw();
	};

	this.draw = function() {

		var Z = parseInt($levelsLayer.find('#wall-' + parseInt( (player.y)/player.settings.baseMap,10 ) + '-' + parseInt( (player.x)/player.settings.baseMap,10 ) ).css('z-index') ,10);

		$player.css({
			top: this.y,
			left: this.x,
			height: this.height,
			width: this.width,
			zIndex: Z+1
		});

		$playerTrigger.css({
			top: this.y,
			left: this.x,
		});

		$allLayers.css({
			top: this.settings.gameWidth/2-(this.y + this.settings.baseMap),
			left: this.settings.gameHeight/2-(this.x - this.settings.baseMap)
		});

		this.checkPossiblesMove();
	};

	this.sprite = function() {
		clearInterval(this.spriteAnimation);
		this.spriteLoop = 0;

		if (this.state === "idle") {
			var rowSprite = 0;
			var steps = 3;
		}

		// Anime it
		this.spriteAnimation = setInterval(function() {
			player.spriteAnimationLoop(rowSprite,steps);
		}, player.baseSpeed*2);
	};

	this.spriteAnimationLoop = function(rowSprite, steps) {
		$playerSprite.css({
			backgroundPositionY: rowSprite,
			backgroundPositionX: -this.spriteLoop*this.settings.baseMap
		});

		if (this.spriteLoop === steps) {
			this.spriteLoop = 0;
		} else {
			this.spriteLoop++;
		}
	};

	this.checkPossiblesMove = function() {
		// calculate possibles moves
		var i;
		var j;
		var row = parseInt(this.y/this.settings.baseMap,10);
		var col = parseInt(this.x/this.settings.baseMap,10);
		var possiblesMovesLength = this.possiblesMoves.length;
		var possiblesActionsLength = this.possiblesActions.length;

		// reset
		$actionLayer.find('.actionWall').removeClass('possiblesMoves impossiblesMoves minable');

		for (i = 0; i < possiblesMovesLength; i++) {
			for (j = 0; j < this.possiblesMoves[i].length; j++) {
				if (this.possiblesMoves[i][j] === 1) {
					var aroundRow = i + row - 2;
					var aroundCol = j + col - 2;
					var targetWall = $actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+aroundCol+'"]');
					var targetWallAttribute;
					//move possible
										
					switch(targetWall.attr('class').split(/\s+/)[0]) {
						case "type0":
						targetWallAttribute = 'possiblesMoves';
						break;

						case "type1":
						targetWallAttribute = 'impossiblesMoves';
						break;

						case "type2":
						targetWallAttribute = 'minable';
						break;

						case "type3":
						targetWallAttribute = 'impossiblesMoves';
						break;

						case "type4":
						targetWallAttribute = 'possiblesMoves';
						break;

						case "type5":
						targetWallAttribute = 'possiblesMoves';
						break;

						case "type6":
						targetWallAttribute = 'minable';
						break;
					}

					targetWall.addClass(targetWallAttribute);
				}
			}
		}

	};

	this.move = function(Y,X,Z) {

		// stop animation
		clearInterval(this.spriteAnimation);

		var oldZIndex = $player.css('z-index');
		var that = this;

		// previens le glitch avant le déplacement 
		if (Z - oldZIndex >= 9) {
			$player.css({
				zIndex: Z+1
			});
		} else if (Z - oldZIndex < -9)  {
			$player.css({
				zIndex: Z+11
			});
		} else {
			$player.css({
				zIndex: Z+9
			});
		}

		// move the player sprite
		$player.animate({
			top: Y,
			left: X,
			zIndex: Z+1
		},this.baseSpeed, function() {
			that.x = X;
			that.y = Y;
			that.checkPossiblesMove();
			that.sprite('idle');
		});

		// move the player trigger
		$playerTrigger.animate({
			top: Y,
			left: X
		},this.baseSpeed);

		// move the "camera"
		$allLayers.stop().animate({
			top: this.settings.gameWidth/2-(Y + this.settings.baseMap),
			left: this.settings.gameHeight/2-(X - this.settings.baseMap)
		},this.baseSpeed*10, "easeOutExpo");
	};

	this.mining = function(col, row, blocElement) {
		
		console.log('mining');

		var typeResult;

		if (parseInt(blocElement.attr('data-type'), 10) === 2) {
			typeResult = 0;
		}

		this.actionWallFlag = false;

		$player.find('.miningBar').fadeIn(250).find('.progression').css('width',0).animate({
			width: '100%'
		}, 800, function() {			
			
			player.actionWallFlag = true;
			blocElement.attr({
				class: 'type'+ typeResult + ' actionWall possiblesMoves',
				'data-type': typeResult
			});
			
			$player.find('.miningBar').fadeOut(250);

		});

		return typeResult;
	};
};
// END PLAYER




// check updates status and animations
function update() {
	
}

// Auto start for test
(function start() {

	// Radom level :
	// level = new LevelGeneration(Math.floor(Math.random() * 6) + 6, Math.floor(Math.random() * 6) + 6);
	
	// Set a static level
	defaultGameSettings.currentLevel = level_test_0;

	// Create a new game
	var newGame = new Game(defaultGameSettings);
	
	// Draw walls
	newGame.drawCollisionWalls();

	// Player set - with the game settings at this moment
	player = new Player(newGame.settings);

	// Init the player
	player.init();
	
	// ACTIONS WALL BINDING
	$actionLayer.find('.actionWall').on('click', function() {

		var $this = $(this);

		if (player.actionWallFlag) {
			
			// WALK FREE
			var destinationY = parseInt($this.css('top'),10) + (player.settings.baseMap/2) - player.height/2;
			var destinationX = parseInt($this.css('left'),10) + (player.settings.baseMap/2) - player.width/2;
			var positionIDWall = parseInt($this.css('z-index'),10);
			var dataCol = parseInt($(this).attr('data-col'),10);
			var dataRow = parseInt($(this).attr('data-row'),10);

			if ($this.hasClass('possiblesMoves')) {
				
				//Move position
				player.move(destinationY,destinationX,positionIDWall);

			} else if ($this.hasClass('minable')) {
				
				// Move position
				player.move(destinationY,destinationX,positionIDWall);

				// Mine block & modify the level
				newGame.modifyWall(dataCol, dataRow, player.mining(dataCol, dataRow, $this));
			
			} else {

				console.log('no moving possible');

			}
		}		
	});

	//Drag and drop gamezone
	$game.draggable();

	setInterval(function() {
		update();
	}, 1000/newGame.fps);
})();
