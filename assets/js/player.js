/*============
	PLAYER
============*/

var Player = function() {

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

	this.init = function(settings) {
		
		this.settings = settings;

		this.width = this.settings.baseMap;
		this.height = this.settings.baseMap;
		this.x = parseInt(this.settings.DomWall.actionLayer.find('.entrance').css('left'),10) || 0;
		this.y = parseInt(this.settings.DomWall.actionLayer.find('.entrance').css('top'),10) || 0;
		this.sprite(this.state);
		this.draw();

		return this;
	};

	this.draw = function() {

		var Z = parseInt(this.settings.DomWall.levelsLayer.find('#wall-' + parseInt( (this.y)/this.settings.baseMap,10 ) + '-' + parseInt( (this.x)/this.settings.baseMap,10 ) ).css('z-index') ,10);

		this.settings.DomWall.player.css({
			top: this.y,
			left: this.x,
			height: this.height,
			width: this.width,
			zIndex: Z+1
		});

		this.settings.DomWall.playerTrigger.css({
			top: this.y,
			left: this.x,
		});

		this.settings.DomWall.allLayers.css({
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

		this.settings.DomWall.playerSprite.css({
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
		this.settings.DomWall.actionLayer.find('.actionWall').removeClass('possiblesMoves impossiblesMoves digout');

		for (i = 0; i < possiblesMovesLength; i++) {
			for (j = 0; j < this.possiblesMoves[i].length; j++) {
				if (this.possiblesMoves[i][j] === 1) {
					var aroundRow = i + row - 2;
					var aroundCol = j + col - 2;
					var targetWall = this.settings.DomWall.actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+aroundCol+'"]');

					targetWall.addClass(this.settings.walls[targetWall.attr('data-type')].action);
				}
			}
		}
	};

	this.move = function(Y,X,Z) {

		// stop animation
		clearInterval(this.spriteAnimation);

		var oldZIndex = this.settings.DomWall.player.css('z-index');
		var that = this;

		// previens le glitch avant le déplacement 
		if (Z - oldZIndex >= 9) {
			this.settings.DomWall.player.css({
				zIndex: Z + 1
			});
		} else if (Z - oldZIndex < -9)  {
			this.settings.DomWall.player.css({
				zIndex: Z + 11
			});
		} else {
			this.settings.DomWall.player.css({
				zIndex: Z + 9
			});
		}

		// move the player sprite
		this.settings.DomWall.player.animate({
			top: Y,
			left: X,
			zIndex: Z + 1
		},this.baseSpeed, function() {
			that.x = X;
			that.y = Y;
			that.checkPossiblesMove();
			that.sprite('idle');
		});

		// move the player trigger
		this.settings.DomWall.playerTrigger.animate({
			top: Y,
			left: X
		},this.baseSpeed);

		// move the "camera"
		this.settings.DomWall.allLayers.stop().animate({
			top: this.settings.gameWidth / 2 -(Y + this.settings.baseMap),
			left: this.settings.gameHeight / 2 -(X - this.settings.baseMap)
		},this.baseSpeed * 10, 'easeOutExpo');
	};

	this.resultOfTheMinigEvent = function(result) {
		console.log('resultOfTheMinigEvent: ', result);

		//switch case here

		if (result === 'key') {
			this.settings.levelKey = true;
		}

		if (result === 'poison') {
			this.settings.poisoned = true;
		}

		if (result === 'treasure') {
			console.log('Ho look a treasure here!');
		}

		if (result === 'gold') {
			console.log('Mmmh gold!');
		}
	};

	this.mining = function(blocElement, typeResult) {

		var that = this;
		var blocks = this.settings.DomWall.allLayers.find('#' + blocElement);
		var originalType = that.settings.walls[typeResult].type;
		var typeResultClass = this.settings.walls[typeResult].afterdig[0];
		var typeResultId = this.settings.walls[typeResult].afterdig[1];
		var result = this.settings.walls[typeResult].result;
		var r = [typeResultId, result];

		// Stop all action until the animation's end
		this.actionWallFlag = false;

		// Mine block & modify the level
		// newGame.modifyWall(dataCol, dataRow, player.mining(dataCol, dataRow, $this));
		this.settings.DomWall.player.find('.miningBar').fadeIn(250).find('.progression').css('width',0).animate({
			width: '100%'
		}, 800, function() {			
			that.actionWallFlag = true;
			blocks.removeClass(originalType).addClass(typeResultClass).attr('data-type', typeResultId);
			that.settings.DomWall.player.find('.miningBar').fadeOut(250);
			that.resultOfTheMinigEvent(result);
		});

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
				return;
			}
		}

		// Update the level map
		return typeResult;
	};
};
// END PLAYER
