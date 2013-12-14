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

		var Z = parseInt($levelsLayer.find('#wall-' + parseInt( (this.y)/this.settings.baseMap,10 ) + '-' + parseInt( (this.x)/this.settings.baseMap,10 ) ).css('z-index') ,10);

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
		}, this.baseSpeed*2);
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
					var targetWallAttribute = this.settings.wallTypes[targetWall.attr('class').split(/\s+/)[0]];

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

	this.mining = function(blocElement, typeResult) {
	
		var that = this;

		// I must change this based on settings
		if (typeResult === 2 || typeResult === 6) {
			typeResult = 0;
		}

		this.actionWallFlag = false;

		// Mine block & modify the level
		// newGame.modifyWall(dataCol, dataRow, player.mining(dataCol, dataRow, $this));
		$player.find('.miningBar').fadeIn(250).find('.progression').css('width',0).animate({
			width: '100%'
		}, 800, function() {			
			
			that.actionWallFlag = true;
			blocElement.attr({
				class: 'type'+ typeResult + ' actionWall possiblesMoves',
				'data-type': typeResult
			});
			
			$player.find('.miningBar').fadeOut(250);
		});

		return typeResult;
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
				
				//Move position
				this.move(destinationY,destinationX,positionIDWall);

			} else if (blocElement.hasClass('minable')) {

				// Minig block
				typeResult = this.mining(blocElement, typeResult);

				// Move position
				this.move(destinationY,destinationX,positionIDWall);
			
			} else {

				// Can't move there
				console.log('no moving possible');
			}
		}

		// Update the level map
		return typeResult;
	};
};
// END PLAYER
