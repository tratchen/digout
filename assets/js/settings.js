
var gameSettings = {
	
	"gameRunning": false,
	"gameWidth": 800,
	"gameHeight": 600,
	"baseMap": 72,
	"fps": 15,
	"currentLevel": null,
	"levelKey": false,
	"poisoned": false,
	"level": 1,
	"gold": 0,
	"emerald": 0,
	"xp": 0,
	"life": 100,
	"antiPoison": 0
};

var gameComponents = {

	"maximumLevel": 100,

	"treasuresKind": ["antiPoison", "gold", "emerald", "life", "xp"],

	"treasures": {
		"antiPoison": {
			"minimal": 1,
			"maximum": 3
		},

		"gold": {
			"minimal": 3,
			"maximum": 35
		},

		"emerald": {
			"minimal": 1,
			"maximum": 10
		},

		"life": {
			"minimal": 5,
			"maximum": 100
		},

		"xp": {
			"minimal": 1000,
			"maximum": 1000000
		}
	},
	
	"walls": {
		
		"0": {
			"type": "solidWall",
			"action": "impossiblesMoves"
		},

		"1": {
			"type": "solidWallTopLeftCorner",
			"action": "impossiblesMoves"
		},

		"2": {
			"type": "solidWallTopRightCorner",
			"action": "impossiblesMoves"
		},

		"3": {
			"type": "solidWallBottomLeftCorner",
			"action": "impossiblesMoves"
		},

		"4": {
			"type": "solidWallBottomRightCorner",
			"action": "impossiblesMoves"
		},

		"5": {
			"type": "sand",
			"action": "digout",
			"result": "nothing",
			"afterdig": ["sandCleared", 996]
		},

		"6": {
			"type": "sand",
			"action": "digout",
			"result": "treasure",
			"afterdig": ["sandCleared", 996]
		},

		"7": {
			"type": "sand",
			"action": "digout",
			"result": "poison",
			"afterdig": ["sandCleared", 996]
		},

		"8": {
			"type": "sand",
			"action": "digout",
			"result": "gold",
			"afterdig": ["sandCleared", 996]
		},

		"9": {
			"type": "obstacle",
			"action": "impossiblesMoves"
		},

		"10": {
			"type": "monster",
			"action": "digout",
			"result": "monster",
			"afterdig": ["sandCleared", 996]
		},

		"996": {
			"type": "sandCleared",
			"action": "possiblesMoves"
		},

		"997": {
			"type": "key",
			"action": "digout",
			"result": "key",
			"afterdig": ["sandCleared", 996]
		},

		"998": {
			"type": "entrance",
			"action": "possiblesMoves"
		},

		"999": {
			"type": "exit",
			"action": "possiblesMoves"
		}
	}
};