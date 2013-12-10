
/*Random level generator*/

var LevelGeneration = function(levelRow, levelCol) {
	var i,
		j,
		newNumber,
		level = [];

	for (i = 1; i <= levelCol; i++) {
		var levelNewLine = [];
		for(j = 1; j <= levelRow; j++) {
			// rock walls around the map
			if (j === 1 || j === levelRow || i === 1 || i === levelCol) {
				newNumber = 1;
			} else {
				newNumber = Math.floor(Math.random() * 4);
				// 1 is for walls
				if (newNumber === 1) {
					newNumber = 0;
				}
			}
			//add number in lines
			levelNewLine.push(newNumber);
		}
		//add lines in map
		level.push(levelNewLine);
	}

	//add Door and Exit
	var randomDoorCol = Math.floor(Math.random()*(levelCol-2)+1);
	var randomDoorRow = Math.floor(Math.random()*(levelRow-2)+1);

	var randomExitCol = Math.floor(Math.random()*(levelCol-2)+1);
	var randomExitRow = Math.floor(Math.random()*(levelRow-2)+1);

	var randomKeyCol = Math.floor(Math.random()*(levelCol-2)+1);
	var randomKeyRow = Math.floor(Math.random()*(levelRow-2)+1);

	//they can be in the same place
	while (randomDoorCol === randomExitCol && randomDoorRow === randomExitRow) {
		randomExitCol = Math.floor(Math.random()*(levelCol-2)+1);
		randomExitRow = Math.floor(Math.random()*(levelRow-2)+1);
	}

	while (randomDoorCol === randomKeyCol && randomDoorRow === randomKeyRow) {
		randomKeyCol = Math.floor(Math.random()*(levelCol-2)+1);
		randomKeyRow = Math.floor(Math.random()*(levelRow-2)+1);
	}
	

	// set 0 around door (up, down, right, left)
	level[randomDoorCol-1][randomDoorRow] !== undefined ? (level[randomDoorCol-1][randomDoorRow] !== 1 ? level[randomDoorCol-1][randomDoorRow] = 0 : level[randomDoorCol-1][randomDoorRow] = 1) : null;
	level[randomDoorCol+1][randomDoorRow] !== undefined ? (level[randomDoorCol+1][randomDoorRow] !== 1 ? level[randomDoorCol+1][randomDoorRow] = 0 : level[randomDoorCol+1][randomDoorRow] = 1) : null;
	level[randomDoorCol][randomDoorRow+1] !== undefined ? (level[randomDoorCol][randomDoorRow+1] !== 1 ? level[randomDoorCol][randomDoorRow+1] = 0 : level[randomDoorCol][randomDoorRow+1] = 1) : null;
	level[randomDoorCol][randomDoorRow-1] !== undefined ? (level[randomDoorCol][randomDoorRow-1] !== 1 ? level[randomDoorCol][randomDoorRow-1] = 0 : level[randomDoorCol][randomDoorRow-1] = 1) : null;

	// set 0 around exit (up, down, right, left)
	level[randomExitCol-1][randomExitRow] !== undefined ? (level[randomExitCol-1][randomExitRow] !== 1 ? level[randomExitCol-1][randomExitRow] = 0 : level[randomExitCol-1][randomExitRow] = 1) : null;
	level[randomExitCol+1][randomExitRow] !== undefined ? (level[randomExitCol+1][randomExitRow] !== 1 ? level[randomExitCol+1][randomExitRow] = 0 : level[randomExitCol+1][randomExitRow] = 1) : null;
	level[randomExitCol][randomExitRow+1] !== undefined ? (level[randomExitCol][randomExitRow+1] !== 1 ? level[randomExitCol][randomExitRow+1] = 0 : level[randomExitCol][randomExitRow+1] = 1) : null;
	level[randomExitCol][randomExitRow-1] !== undefined ? (level[randomExitCol][randomExitRow-1] !== 1 ? level[randomExitCol][randomExitRow-1] = 0 : level[randomExitCol][randomExitRow-1] = 1) : null;

	//DOOR
	level[randomDoorCol][randomDoorRow] = 4;
	//EXIT
	level[randomExitCol][randomExitRow] = 5;
	//KEY
	level[randomKeyCol][randomKeyRow] = 6;

	return level;
};
