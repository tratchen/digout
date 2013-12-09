
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
}

Math.rand = function(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

Array.prototype.random = function() {
	return this[Math.rand(0, this.length)];  
}

Number.prototype.clamp = function(min, max) {
	return Math.min(Math.max(this, min), max);
};





//jquery get dom elems
var $game = $('#gameZone'),
	$levelsLayer = $game.find('#levelsLayer'),
	$actionLayer = $game.find('#actionLayer'),
	$allLayers = $game.find('#levelsLayer, #actionLayer, #playerTriggerLayer'),
	$player = $game.find('#player'),
	$playerSprite = $player.find('#playerSprite'),
	$playerTrigger = $game.find('#playerTrigger');


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

		var length = this.currentLevel.length,
			row,
			col;

		for (row = 0; row < length; row++) {
			for (col = 0; col < this.currentLevel[row].length; col++) {
					
				var zIndex = ((row+1)*10)+col;
				//decor container and collisions
				$levelsLayer.append(
					'<div class="collisionWall type'+this.currentLevel[row][col]+'" id="wall-'+row+'-'+col+'" style="'
					+'left:'+(col*this.baseMap)+'px; '
					+'top:'+(row*this.baseMap)+'px; '
					+'z-index:'+zIndex+';"><div class="walls"></div></div>'
				);
				//click triggers
				$actionLayer.append(
					'<div class="actionWall type'+this.currentLevel[row][col]+'" data-row="'+row+'" data-col="'+col+'" style="'
					+'left:'+(col*this.baseMap)+'px; '
					+'top:'+(row*this.baseMap)+'px; '
					+'z-index:'+zIndex+';"></div>'
				);
			}
		}
	};
};



/*==========
   PLAYER
==========*/

var possiblesMoves = [
	[0,0,0,0,0],
	[0,2,1,2,0],
	[0,1,0,1,0],
	[0,2,1,2,0],
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

		//Anime it
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
		//calculate possibles moves
		var i,
			j,
			row = parseInt(this.y/this.settings[2],10),
			col = parseInt(this.x/this.settings[2],10),
			possiblesMovesLength = this.possiblesMoves.length,
			possiblesActionsLength = this.possiblesActions.length;

		//reset
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

				} else if (this.possiblesMoves[i][j] === 2) {

					//check diagonales
					var aroundRow = i + row - 2;
					var aroundCol = j + col - 2;
					var $diagonalToCheck = $actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+aroundCol+'"]');

					// not type 1, 2, 3 (ok to type 0, 4, 5 ...)
					if (!$diagonalToCheck.is('.type1, .type2, .type3')) {
						//check obstacle around diagonales
						if (i-2 > 0) {
							// bas
							if (j-2 > 0) {
								// droite
								if (!$actionLayer.find('[data-row="'+(aroundRow-1)+'"][data-col="'+aroundCol+'"]').hasClass('impossiblesMoves') && !$actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+(aroundCol-1)+'"]').hasClass('impossiblesMoves')) {
									//diagonales possibles:
									$diagonalToCheck.addClass('possiblesMoves');
								}
							} else {
								// gauche
								if (!$actionLayer.find('[data-row="'+(aroundRow-1)+'"][data-col="'+aroundCol+'"]').hasClass('impossiblesMoves') && !$actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+(aroundCol+1)+'"]').hasClass('impossiblesMoves')) {
									//diagonales possibles:
									$diagonalToCheck.addClass('possiblesMoves');
								}
							}
						} else {
							// haut
							if (j-2 > 0) {
								//droite
								if (!$actionLayer.find('[data-row="'+(aroundRow+1)+'"][data-col="'+aroundCol+'"]').hasClass('impossiblesMoves') && !$actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+(aroundCol-1)+'"]').hasClass('impossiblesMoves')) {
									//diagonales possibles:
									$diagonalToCheck.addClass('possiblesMoves');
								}
							} else {
								// gauche
								if (!$actionLayer.find('[data-row="'+(aroundRow+1)+'"][data-col="'+aroundCol+'"]').hasClass('impossiblesMoves') && !$actionLayer.find('[data-row="'+aroundRow+'"][data-col="'+(aroundCol+1)+'"]').hasClass('impossiblesMoves')) {
									//diagonales possibles:
									$diagonalToCheck.addClass('possiblesMoves');
								}
							}
						}
					}
				}
			}
		}

	};

	this.move = function(Y,X,Z) {

		// console.log(
		// 	' Y: ', Y, '->' , this.y,'\n',
		// 	'X: ', X, '->' , this.x
		// );

		//stop animation
		clearInterval(this.spriteAnimation);

		var oldZIndex = $player.css('z-index')
			that = this;

		//previens le glitch avant le déplacement 
		if (Z - oldZIndex >= 9) {
			//console.log(Z - oldZIndex >= 9, Z - oldZIndex < -9);
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

		$playerTrigger.animate({
			top: Y,
			left: X
		},this.baseSpeed);

		$allLayers.stop().animate({
			top: this.settings[0]/2-(Y + this.settings[2]),
			left: this.settings[1]/2-(X - this.settings[2])
		},this.baseSpeed*10, "easeOutExpo");
	};
};
//END PLAYER




//check updates status and animations
function update() {
	
}

//draw for test
(function start() {

	customcursor($game,'normal');

	//temp : randomize small maps
	var randomMapCols = Math.floor(Math.random() * 6) + 6;
	var randomMapsRows = Math.floor(Math.random() * 6) + 6;

	//set level
	level = new LevelGeneration(randomMapCols, randomMapsRows);
	
	$levelsLayer.css({
		width: randomMapCols*Game.baseMap,
		height: randomMapsRows*Game.baseMap
	});

	//draw walls
	var newGame = new Game(800, 600, 96, 50, level);
	newGame.drawCollisionWalls();

	//player set
	player = new Player($player, $playerTrigger, newGame.settings);
	player.init();
	
	//set z-index
	player.draw(parseInt($levelsLayer.find('#wall-'+ parseInt((player.y)/newGame.baseMap,10)+'-'+parseInt((player.x)/newGame.baseMap),10).css('z-index'),10));

	
	//ACTIONS WALL BINDING
	$actionLayer.find('.actionWall').on('click', function() {

		var $this = $(this);

		if (player.actionWallFlag) {
			//WALK FREE
			if ($this.hasClass('possiblesMoves')) {
				var destinationY = parseInt($this.css('top'),10) + (newGame.baseMap/2) -player.height/2;
				var destinationX = parseInt($this.css('left'),10) + (newGame.baseMap/2) -player.width/2;
				var positionIDWall = parseInt($this.css('z-index'),10);

				player.move(destinationY,destinationX,positionIDWall);

			} else if ($this.hasClass('minable')) {
				
				//MINE BLOCK
				//var dataCol = parseInt($(this).attr('data-col'),10);
				//var dataRow = parseInt($(this).attr('data-row'),10);

				//console.log('minable');

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
