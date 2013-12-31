
var gameSettings = {
	
	gameRunning: false,
	gameWidth: 800,
	gameHeight: 600,
	baseMap: 96,
	fps: 50,
	currentLevel: null,
	levelKey: false,
	poisoned: false,
	gold: 0,
	
	walls: {
		
		0: {
			type: "solidWall",
			action: "impossiblesMoves"
		},

		1: {
			type: "sand",
			action: "digout",
			result: "nothing",
			afterdig: ["sandCleared", 996]
		},

		2: {
			type: "sand",
			action: "digout",
			result: "treasure",
			afterdig: ["sandCleared", 996]
		},

		3: {
			type: "sand",
			action: "digout",
			result: "poison",
			afterdig: ["sandCleared", 996]
		},

		4: {
			type: "sand",
			action: "digout",
			result: "gold",
			afterdig: ["sandCleared", 996]
		},

		5: {
			type: "obstacle",
			action: "impossiblesMoves"
		},

		996: {
			type: "sandCleared",
			action: "possiblesMoves"
		},

		997: {
			type: "key",
			action: "digout",
			result: "key",
			afterdig: ["sandCleared", 996]
		},

		998: {
			type: "entrance",
			action: "possiblesMoves"
		},

		999: {
			type: "exit",
			action: "possiblesMoves"
		}
	}
};