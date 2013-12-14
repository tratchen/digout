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
