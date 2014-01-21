/*============
	PLAYER
============*/

var Player = function() {

	this.baseSpeed = 150;
	this.spriteLoop = 0;
	this.state = "idle";
	this.actionWallFlag = true;

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

	this.init = function(settings, gameComponents, root) {
		
		this.root = root;
		this.settings = settings;
		this.component = gameComponents;

		this.width = this.settings.baseMap;
		this.height = this.settings.baseMap;

		// TODO: go to entrance if no saved game of new level else go to the saved position
		this.y = this.settings.y ? this.settings.y : parseInt(this.component.DomWall.$actionLayer.find('.entrance').css('top'), 10) || 0;
		this.x = this.settings.x ? this.settings.x : parseInt(this.component.DomWall.$actionLayer.find('.entrance').css('left'), 10) || 0;

		this.settings.xpRemains = Math.sqrt(this.settings.level) * 1000;
		this.settings.xp = this.settings.xp < 1 ? 1 : this.settings.xp;

		this.draw();
	};

	this.calculateXP = function() {
		while (this.settings.xp > this.settings.xpRemains && this.settings.level <= this.component.maximumLevel) {
			
			var minXP = this.component.treasure.xp.minimal;
			var maxXP = this.component.treasure.xp.maximum;
			var maxLevel = this.component.maximumLevel;

			this.settings.xpRemains = Math.floor(easeInCubic(this.settings.currentLevel, minXP, maxXP, maxLevel));
			
			this.settings.xp = Math.floor(this.settings.xp - this.settings.xpRemains);
			
			if (this.settings.level + 1 <= this.component.maximumLevel) {
				this.settings.level++;
			}
		}
	};

	this.draw = function() {

		this.z = parseInt(this.component.DomWall.$levelsLayer.find('#wall-' + parseInt( (this.y)/this.settings.baseMap, 10 ) + '-' + parseInt( (this.x)/this.settings.baseMap,10 ) ).css('z-index'), 10) + 1;

		// Place the player
		this.component.DomWall.$player.css({
			top: this.y,
			left: this.x,
			height: this.height,
			width: this.width,
			zIndex: this.z
		}).attr({
			'data-row': parseInt( this.x / this.settings.baseMap, 10 ),
			'data-col': parseInt( this.y / this.settings.baseMap, 10 )
		});

		// Place the player trigger
		this.component.DomWall.$playerTrigger.css({
			top: this.y,
			left: this.x,
		});

		// Check moves
		this.checkPossiblesMove();
	};

	this.spriteAnimation = function() {

		var rowSprite;
		var steps;

		//debug(this.state, "State");

		if (this.state === "idle") {
			rowSprite = 0;
			steps = 3;
		}

		if (this.spriteLoop >= steps) {
			this.spriteLoop = 0;
		} else {
			this.spriteLoop++;
		}

		// Anime it
		this.component.DomWall.$playerSprite.css({
			backgroundPositionY: rowSprite,
			backgroundPositionX: - this.spriteLoop * this.settings.baseMap
		});
	};

	this.checkPossiblesMove = function() {

		// calculate possibles moves
		var i;
		var j;
		var row = parseInt(this.y/this.settings.baseMap, 10);
		var col = parseInt(this.x/this.settings.baseMap, 10);
		var possiblesMovesLength = this.possiblesMoves.length;
		var possiblesActionsLength = this.possiblesActions.length;
		var obstacleVisual = this.component.DomWall.$levelsLayer.find('#wall-' + (row + 1) +  "-" + col );
		var obstacleTechnical = this.component.DomWall.$actionLayer.find('#wall-' + (row + 1) +  "-" + col );

		// reset
		this.component.DomWall.$actionLayer.find('.actionWall').removeClass('possiblesMoves impossiblesMoves digout');
		this.component.DomWall.$levelsLayer.find('.collisionWall').css({ opacity: 1 });		

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

					var betweenJumpFloorAction;
					var diag = false;
					
					var targetWall = this.component.DomWall.$actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+aroundCol+'"]');
					
					var type = targetWall.attr('data-type') || 0;
					
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

							if (this.component.walls[this.component.DomWall.$actionLayer.find('[data-row="'+(row + diagRow)+'"][data-col="'+(col)+'"]').attr('data-type') || 0].action !== "impossiblesMoves" && this.component.walls[this.component.DomWall.$actionLayer.find('[data-row="'+(row)+'"][data-col="'+(col + diagCol)+'"]').attr('data-type') || 0].action !== "impossiblesMoves") {
								targetWall.addClass(this.component.walls[type].action);
							} else {
								targetWall.addClass("impossiblesMoves");
							}

						// Double step straight through
						} else {
							betweenJumpFloorAction =  this.component.walls[this.component.DomWall.$actionLayer.find('[data-row="' + longJumpRow + '"][data-col="' + longJumpCol + '"]').attr('data-type') || 0].action;
							if (betweenJumpFloorAction === "possiblesMoves") {

								targetWall.addClass(this.component.walls[type].action);
							

							} else {
								targetWall.addClass("impossiblesMoves");
							}
						}
					} else {
						targetWall.addClass(this.component.walls[type].action);
					}
				}
			}
		}

		if (obstacleTechnical.hasClass('impossiblesMoves')) {
			obstacleVisual.css({ opacity: 0.5 });
		}
	};

	this.move = function(Y,X,Z) {

		var that = this;
		var tempZ;

		this.state = 'walk';

		// previens le glitch avant le déplacement 
		if (Z - this.z >= 9) {
			tempZ = Z + 1;
		} else if (Z - this.z < -9)  {
			tempZ = Z + 11;
		} else {
			tempZ = Z + 9;
		}

		this.component.DomWall.$player.css({
			zIndex: tempZ
		});

		// move the player sprite
		this.component.DomWall.$player.animate({
			top: Y,
			left: X,
			zIndex: Z + 1
		},this.baseSpeed, function() {
			that.x = X;
			that.y = Y;
			that.z = Z + 1;
			that.checkPossiblesMove();
		
			if ( that.state !== "mining" ) {
				that.state = 'idle';
			}

		}).attr({
			'data-row': parseInt( X/that.settings.baseMap, 10 ),
			'data-col': parseInt( Y/that.settings.baseMap, 10 )
		});

		// move the player trigger
		this.component.DomWall.$playerTrigger.animate({
			top: this.y,
			left: this.x
		},this.baseSpeed);
	};

	this.randomTreasures = function() {
		// Treasure amount depend of the teasure kind and player level
		var random = Math.floor(Math.random() * (this.component.treasuresKind.length -1) );
		var kindOfTreasure = this.component.treasuresKind[random];
		var minTreasure = this.component.treasures[kindOfTreasure].minimal;
		var maxTreasure = this.component.treasures[kindOfTreasure].maximum;
		var maxLevel = this.component.maximumLevel;
		var bonus = Math.floor(easeOutCubic(this.settings.level, minTreasure, maxTreasure, maxLevel));

		this.settings[kindOfTreasure] = this.settings[kindOfTreasure] + bonus;
		
		//this.calculateXP();
	};

	this.resultOfTheMinigEvent = function(result) {
		
		// TO DO : MONSTER CASE
		debug(result, "player.resultOfTheMinigEvent");

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
		var blocks = this.component.DomWall.$allLayers.find('#' + blocElement);
		var originalType = that.component.walls[typeResult].type;
		var typeResultClass = this.component.walls[typeResult].afterdig[0];
		var typeResultId = this.component.walls[typeResult].afterdig[1];
		var result = this.component.walls[typeResult].result;

		//TODO: create mining animation
		this.state = 'mining';

		// Stop all action until the animation's end
		this.actionWallFlag = false;

		this.component.DomWall.$player.find('.miningBar').fadeIn(250).find('.progression').css('width',0).animate({
			width: '100%'
		}, 800, function() {

			that.actionWallFlag = true;
			that.state = "idle";
			blocks.removeClass(originalType).addClass(typeResultClass).attr('data-type', typeResultId);
			that.component.DomWall.$player.find('.miningBar').fadeOut(250);

		});

		this.resultOfTheMinigEvent(result);

		return typeResultId;
	};

	// Let te player choose what it does when you click somewhere
	this.moving = function(blocElement) {

		if (blocElement) {
		
			var blocData = blocElement.data();
			var typeResult = blocData.type;

			if (this.actionWallFlag) {
				
				// WALK FREE
				var destinationY = parseInt(blocElement.css('top'), 10);
				var destinationX = parseInt(blocElement.css('left'), 10);
				var positionIDWall = parseInt(blocElement.css('z-index'), 10);

				if (blocElement.hasClass('possiblesMoves')) {

					if (blocElement.hasClass('exit')) {
						
						// Check the levelKey status and make decisions
						debug(this.settings.levelKey ? "Yes, go Exit the level" : "No, the door is closed", "Have you the key ?");
					}
					
					//Move position
					this.move( destinationY, destinationX, positionIDWall );

				} else if (blocElement.hasClass('digout')) {

					// Move position
					this.move( destinationY, destinationX, positionIDWall );

					// Minig block
					typeResult = this.mining(blocElement.attr('id'), typeResult);

				} else {
					// Can't move there
					debug(typeResult, 'no moving possible');
					return typeResult;
				}
			}
			// Update the level map
			return typeResult;
		}	
	};
};
// END PLAYER
