/*============
	PLAYER
============*/

var Player = function() {

	this.baseSpeed = 150;
	this.spriteLoop = 0;
	this.state = "idle";
	this.possiblesMoves = [
		[0,0,1,0,0],
		[0,1,1,1,0],
		[1,1,0,1,1],
		[0,1,1,1,0],
		[0,0,1,0,0]
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

	this.init = function(settings, gameComponents) {
		
		this.settings = settings;
		this.gameComponents = gameComponents;

		this.width = this.settings.baseMap;
		this.height = this.settings.baseMap;

		// TODO: go to entrance if no saved game of new level else go to the saved position

		this.x = parseInt(this.gameComponents.DomWall.actionLayer.find('.entrance').css('left'), 10) || 0;
		this.y = parseInt(this.gameComponents.DomWall.actionLayer.find('.entrance').css('top'), 10) || 0;

		this.settings.xpRemains = Math.sqrt(this.settings.level) * 1000;
		this.settings.xp = this.settings.xp < 1 ? 1 : this.settings.xp;

		this.sprite(this.state);
		this.draw();

		return this;
	};

	this.calculateXP = function() {
		while (this.settings.xp > this.settings.xpRemains && this.settings.level <= this.gameComponents.maximumLevel) {
			
			var minXP = this.gameComponents.treasure.xp.minimal;
			var maxXP = this.gameComponents.treasure.xp.maximum;
			var maxLevel = this.gameComponents.maximumLevel;

			this.settings.xpRemains = easeInCubic(this.settings.currentLevel, minXP, maxXP, maxLevel);
			
			this.settings.xp = Math.floor(this.settings.xp - this.settings.xpRemains);
			
			if (this.settings.level + 1 <= this.gameComponents.maximumLevel) {
				this.settings.level++;
			}
		}
	};

	this.draw = function() {

		var Z = parseInt(this.gameComponents.DomWall.levelsLayer.find('#wall-' + parseInt( (this.y)/this.settings.baseMap, 10 ) + '-' + parseInt( (this.x)/this.settings.baseMap,10 ) ).css('z-index'), 10);

		this.gameComponents.DomWall.player.css({
			top: this.y,
			left: this.x,
			height: this.height,
			width: this.width,
			zIndex: Z+1
		}).attr({
			'data-row': parseInt( (this.x)/this.settings.baseMap, 10 ),
			'data-col': parseInt( (this.y)/this.settings.baseMap, 10 )
		});

		this.gameComponents.DomWall.playerTrigger.css({
			top: this.y,
			left: this.x,
		});

		this.gameComponents.DomWall.allLayers.css({
			top: this.settings.gameWidth / 2 -(this.y + this.settings.baseMap),
			left: this.settings.gameHeight / 2 -(this.x - this.settings.baseMap)
		});

		this.checkPossiblesMove();
	};

	this.sprite = function() {

		var that = this;

		clearInterval(this.spriteAnimation);
		this.spriteLoop = 0;

		if (this.state === "idle") {
			var rowSprite = 0;
			var steps = 3;
		}

		// Anime it
		this.spriteAnimation = setInterval(function() {
			that.spriteAnimationLoop(rowSprite,steps);
		}, this.baseSpeed * 2);
	};

	this.spriteAnimationLoop = function(rowSprite, steps) {

		this.gameComponents.DomWall.playerSprite.css({
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
		this.gameComponents.DomWall.actionLayer.find('.actionWall').removeClass('possiblesMoves impossiblesMoves digout');

		for (i = 0; i < possiblesMovesLength; i++) {
			for (j = 0; j < this.possiblesMoves[i].length; j++) {


				// straight line, double step & diagonals
				if (this.possiblesMoves[i][j] === 1) {

					var aroundRow = i + row - 2;
					var aroundCol = j + col - 2;
					var longJumpRow = aroundRow;
					var longJumpCol = aroundCol;
					
					var diagRow = 0;
					var diagCol = 0;
					
					var targetWall = this.gameComponents.DomWall.actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+aroundCol+'"]');
					var betweenJumpFloorAction;
					var diag = false;
					
					// Check if 2 step or diagonals is available to move
					if ( Math.abs(i + j - 4) === 0 || Math.abs(i + j - 4) === 2 ) {

						// Top
						if (aroundRow < row) {							
							longJumpRow = longJumpRow + 1;
							
							// top - left or right
							if (aroundCol !== col) {
								diag = true;
								diagRow = aroundRow - row;
							}
						// Bottom
						} else if (aroundRow > row) {
							longJumpRow = longJumpRow - 1;
							
							if (aroundCol !== col) {
								diag = true;
								diagRow = aroundRow - row;
							}
						}

						// Left
						if (aroundCol < col) {
							longJumpCol = longJumpCol + 1;

							if (aroundRow !== row) {
								diag = true;
								diagCol = aroundCol - col;
							}

						// Right
						} else if (aroundCol > col) {
							longJumpCol = longJumpCol - 1;

							if (aroundRow !== row) {
								diag = true;
								diagCol = aroundCol - col;
							}
						}

						// Diagonals
						if (diag) {

							if (this.gameComponents.walls[this.gameComponents.DomWall.actionLayer.find('[data-row="'+(row + diagRow)+'"][data-col="'+(col)+'"]').attr('data-type')].action !== "impossiblesMoves" && this.gameComponents.walls[this.gameComponents.DomWall.actionLayer.find('[data-row="'+(row)+'"][data-col="'+(col + diagCol)+'"]').attr('data-type')].action !== "impossiblesMoves") {
								targetWall.addClass(this.gameComponents.walls[targetWall.attr('data-type')].action);
							} else {
								targetWall.addClass("impossiblesMoves");
							}

						// Double step straight through
						} else {

							betweenJumpFloorAction =  this.gameComponents.walls[this.gameComponents.DomWall.actionLayer.find('[data-row="' + longJumpRow + '"][data-col="' + longJumpCol + '"]').attr('data-type')].action;

							if (betweenJumpFloorAction === "possiblesMoves") {
								targetWall.addClass(this.gameComponents.walls[targetWall.attr('data-type')].action);
							} else {
								targetWall.addClass("impossiblesMoves");
							}
						}
					
					} else {
						targetWall.addClass(this.gameComponents.walls[targetWall.attr('data-type')].action);
					}
				}
			}
		}
	};

	this.move = function(Y,X,Z) {

		// stop animation
		clearInterval(this.spriteAnimation);

		var oldZIndex = this.gameComponents.DomWall.player.css('z-index');
		var that = this;

		// previens le glitch avant le déplacement 
		if (Z - oldZIndex >= 9) {
			this.gameComponents.DomWall.player.css({
				zIndex: Z + 1
			});
		} else if (Z - oldZIndex < -9)  {
			this.gameComponents.DomWall.player.css({
				zIndex: Z + 11
			});
		} else {
			this.gameComponents.DomWall.player.css({
				zIndex: Z + 9
			});
		}

		// move the player sprite
		this.gameComponents.DomWall.player.animate({
			top: Y,
			left: X,
			zIndex: Z + 1
		},this.baseSpeed, function() {
			that.x = X;
			that.y = Y;
			that.checkPossiblesMove();
			that.sprite('idle');
		}).attr({
			'data-row': parseInt( X/that.settings.baseMap, 10 ),
			'data-col': parseInt( Y/that.settings.baseMap, 10 )
		});

		// move the player trigger
		this.gameComponents.DomWall.playerTrigger.animate({
			top: Y,
			left: X
		},this.baseSpeed);

		// move the "camera"
		this.gameComponents.DomWall.allLayers.stop().animate({
			top: this.settings.gameWidth / 2 -(Y + this.settings.baseMap),
			left: this.settings.gameHeight / 2 -(X - this.settings.baseMap)
		},this.baseSpeed * 10, 'easeOutExpo');
	};

	this.randomTreasures = function() {
		// Treasure amount depend of the teasure kind and player level
		var random = Math.floor(Math.random() * (this.gameComponents.treasuresKind.length -1) );
		var kindOfTreasure = this.gameComponents.treasuresKind[random];
		var minTreasure = this.gameComponents.treasures[kindOfTreasure].minimal;
		var maxTreasure = this.gameComponents.treasures[kindOfTreasure].maximum;
		var maxLevel = this.gameComponents.maximumLevel;
		var bonus = Math.floor(easeOutCubic(this.settings.level, minTreasure, maxTreasure, maxLevel));

		this.settings[kindOfTreasure] = this.settings[kindOfTreasure] + bonus;
		
		this.calculateXP();
	};

	this.resultOfTheMinigEvent = function(result) {
		
		// TO DO : MONSTER CASE
		console.log('player.resultOfTheMinigEvent: ', result);

		switch(result) {

			case 'key':
			this.settings.levelKey = true;
			break;

			case 'poison':
			this.settings.poisoned = true;
			break;

			case 'treasure':
			this.randomTreasures();
			break;

			case 'gold':
			this.settings.gold = this.settings.gold + 1;
			break;

			case 'monster':
			break;

			default:
			return;
		}
	};

	this.mining = function(blocElement, typeResult) {

		var that = this;
		var blocks = this.gameComponents.DomWall.allLayers.find('#' + blocElement);
		var originalType = that.gameComponents.walls[typeResult].type;
		var typeResultClass = this.gameComponents.walls[typeResult].afterdig[0];
		var typeResultId = this.gameComponents.walls[typeResult].afterdig[1];
		var result = this.gameComponents.walls[typeResult].result;
		var r = [typeResultId, result];

		// Stop all action until the animation's end
		this.actionWallFlag = false;

		// Mine block & modify the level
		// newGame.modifyWall(dataCol, dataRow, player.mining(dataCol, dataRow, $this));
		this.gameComponents.DomWall.player.find('.miningBar').fadeIn(250).find('.progression').css('width',0).animate({
			width: '100%'
		}, 800, function() {			
			that.actionWallFlag = true;
			blocks.removeClass(originalType).addClass(typeResultClass).attr('data-type', typeResultId);
			that.gameComponents.DomWall.player.find('.miningBar').fadeOut(250);
		});

		this.resultOfTheMinigEvent(result);

		return typeResultId;
	};

	// Let te player choose what it does when you click somewhere
	this.moving = function(blocElement) {
		
		var typeResult = parseInt(blocElement.attr('data-type'), 10);

		if (this.actionWallFlag) {
			
			// WALK FREE
			var destinationY = parseInt(blocElement.css('top'),10) + (this.settings.baseMap/2) - this.height/2;
			var destinationX = parseInt(blocElement.css('left'),10) + (this.settings.baseMap/2) - this.width/2;
			var positionIDWall = parseInt(blocElement.css('z-index'),10);

			if (blocElement.hasClass('possiblesMoves')) {

				if (blocElement.hasClass('exit')) {
					
					// Check the levelKey status and make decisions
					console.log("Have you the key ?", this.settings.levelKey ? "Yes, go Exit the level" : "No, the door is closed");
				}
				
				//Move position
				this.move(destinationY,destinationX,positionIDWall);

			} else if (blocElement.hasClass('digout')) {

				// Minig block
				typeResult = this.mining(blocElement.attr('id'), typeResult);

				// Move position
				this.move(destinationY,destinationX,positionIDWall);

			} else {

				// Can't move there
				console.log('no moving possible');
				return typeResult;
			}
		}

		// Update the level map
		return typeResult;
	};
};
// END PLAYER
