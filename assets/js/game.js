
// GAME

var customcursor = function(element,cursorState) {
	$('body').append('<span id="mycursor" class="'+cursorState+'"></span>');
	element.css('cursor','none');
	$(element).hover(function() {
		$('#mycursor').show();
	},function() {
		$('#mycursor').hide();		
	});
	$(element).mousemove(function(e){
		$('#mycursor').css('left', e.clientX - 1).css('top', e.clientY + 1);
	});
};

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


// TEST
//	var levelLeft = parseInt($levelsLayer.css('left'),10),
//		levelTop = parseInt($levelsLayer.css('top'),10);
//	
//	console.log(levelLeft,levelTop);



var Game = function(gameWidth, gameHeight, baseMap, fps, currentLevel) {

	this.settings = [gameWidth, gameHeight, baseMap, fps];
	this.gameWidth = gameWidth;
	this.gameHeight = gameHeight;
	this.baseMap = baseMap;
	this.fps = fps;
	this.currentLevel = currentLevel;

	this.drawCollisionWalls = function() {

		var length = this.currentLevel.length;
		var row;
		var col;

		for (row = 0; row < length; row++) {
			for (col = 0; col < this.currentLevel[row].length; col++) {
								
				//create elements
				var wallsDiv = $(document.createElement('div')).addClass('walls');
			
				var collisionWallDiv = $(document.createElement('div')).css({
					top: (row*this.baseMap),
					left: (col*this.baseMap),
					zIndex: ((row+1)*10)+col
				}).attr({
					class: 'type' + this.currentLevel[row][col],
					id: 'wall-' + row + '-' + col,
					"data-row": row,
					"data-col": col
				});

				var actionWallDiv = collisionWallDiv.clone();

				// place elements
				wallsDiv.appendTo(collisionWallDiv);
				$levelsLayer.append(collisionWallDiv.addClass('collisionWall'));
				$actionLayer.append(actionWallDiv.addClass('actionWall'));
			}
		}
	};
};



/*==========
   PLAYER
==========*/

var possiblesMoves = [
	[0,0,0,0,0],
	[0,0,1,0,0],
	[0,1,0,1,0],
	[0,0,1,0,0],
	[0,0,0,0,0]
];

var possiblesActions = [
	[0,0,0,0,0],
	[0,0,1,0,0],
	[0,1,0,1,0],
	[0,0,1,0,0],
	[0,0,0,0,0]
];


var Player = function($player, $playerTrigger, settings) {

	this.settings = settings;
	this.width = this.settings[2];
	this.height = this.settings[2];
	this.x = 0;
	this.y = 0;
	this.baseSpeed = 150;
	this.spriteLoop = 0;
	this.state = "idle";
	this.possiblesMoves = null;
	this.possiblesActions = null;
	this.spriteAnimation = null;
	this.actionWallFlag = true;

	this.init = function() {
		this.possiblesMoves = possiblesMoves;
		this.possiblesActions = possiblesActions;
		this.x = parseInt($actionLayer.find('.type4').css('left'),10);
		this.y = parseInt($actionLayer.find('.type4').css('top'),10);
		this.sprite(this.state);
	};

	this.draw = function(Z) {

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
			top: this.settings[0]/2-(this.y + this.settings[2]),
			left: this.settings[1]/2-(this.x - this.settings[2])
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
			backgroundPositionX: -this.spriteLoop*this.settings[2]
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
		var row = parseInt(this.y/this.settings[2],10);
		var col = parseInt(this.x/this.settings[2],10);
		var possiblesMovesLength = this.possiblesMoves.length;
		var possiblesActionsLength = this.possiblesActions.length;

		// reset
		$actionLayer.find('.actionWall').removeClass('possiblesMoves impossiblesMoves minable');

		for (i=0; i < possiblesMovesLength; i++) {
			for (j=0; j < this.possiblesMoves[i].length; j++) {
				if (this.possiblesMoves[i][j] === 1) {
					var aroundRow = i + row - 2;
					var aroundCol = j + col - 2;
					//move possible
					$actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+aroundCol+'"].type0').addClass('possiblesMoves');
					$actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+aroundCol+'"].type4').addClass('possiblesMoves');
					$actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+aroundCol+'"].type5').addClass('possiblesMoves');
					//action : mining
					$actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+aroundCol+'"].type2').addClass('minable');
					$actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+aroundCol+'"].type6').addClass('minable');
					//move imposible
					$actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+aroundCol+'"].type3').addClass('impossiblesMoves');
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
			top: this.settings[0]/2-(Y + this.settings[2]),
			left: this.settings[1]/2-(X - this.settings[2])
		},this.baseSpeed*10, "easeOutExpo");
	};
};
// END PLAYER




// check updates status and animations
function update() {
	
}

// draw for test
(function start() {

	customcursor($game,'normal');

	// temp : randomize small maps
	var randomMapCols = Math.floor(Math.random() * 6) + 6;
	var randomMapsRows = Math.floor(Math.random() * 6) + 6;

	// Set the level
	// Radom level :
	// level = new LevelGeneration(randomMapCols, randomMapsRows);
	
	level = level_test_0; // <- Static level
	
	$levelsLayer.css({
		width: randomMapCols*Game.baseMap,
		height: randomMapsRows*Game.baseMap
	});

	// draw walls
	var newGame = new Game(800, 600, 96, 50, level);
	newGame.drawCollisionWalls();

	// player set
	player = new Player($player, $playerTrigger, newGame.settings);
	player.init();
	
	// set z-index
	player.draw(parseInt($levelsLayer.find('#wall-' + parseInt( (player.y)/newGame.baseMap,10 ) + '-' + parseInt( (player.x)/newGame.baseMap,10 ) ).css('z-index') ,10));

	
	// ACTIONS WALL BINDING
	$actionLayer.find('.actionWall').on('click', function() {

		var $this = $(this);

		if (player.actionWallFlag) {
			// WALK FREE
			if ($this.hasClass('possiblesMoves')) {
				var destinationY = parseInt($this.css('top'),10) + (newGame.baseMap/2) -player.height/2;
				var destinationX = parseInt($this.css('left'),10) + (newGame.baseMap/2) -player.width/2;
				var positionIDWall = parseInt($this.css('z-index'),10);

				player.move(destinationY,destinationX,positionIDWall);

			} else if ($this.hasClass('minable')) {
				
				// MINE BLOCK
				// var dataCol = parseInt($(this).attr('data-col'),10);
				// var dataRow = parseInt($(this).attr('data-row'),10);

				console.log('mining');

				player.actionWallFlag = true;

				$(this).removeClass('impossiblesMoves minable').addClass('possiblesMoves');
			}
		}		
	});

	//Drag and drop gamezone
	$game.draggable();

	setInterval(function() {
		update();
	}, 1000/newGame.fps);
})();
