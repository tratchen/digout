/*==========
	WALLS
==========*/

var Walls = function() {
	
	this.init = function(settings, gameComponents, root) {
		this.root = root;
		this.settings = settings;
		this.component = gameComponents;
		this.drawCollisionWalls();
	};

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
					class: this.component.walls[this.settings.currentLevel[row][col]].type,
					id: 'wall-' + row + '-' + col,
					"data-row": row,
					"data-col": col,
					"data-type": this.settings.currentLevel[row][col]
				});

				var actionWallDiv = collisionWallDiv.clone();

				// place elements
				wallsDiv.appendTo(collisionWallDiv);
				this.component.DomWall.$levelsLayer.append(collisionWallDiv.addClass('collisionWall'));
				this.component.DomWall.$actionLayer.append(actionWallDiv.addClass('actionWall'));
			}
		}

		this.component.DomWall.$levelsLayer.css({
			width: length * this.settings.baseMap,
			height: length * this.settings.baseMap
		});
	};
};
