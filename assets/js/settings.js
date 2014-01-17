
var gameSettings = {
	
	"gameRunning": false,
	"gameWidth": 800,
	"gameHeight": 600,
	"baseMap": 72,
	"fps": 50,
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
			"type": "sand",
			"action": "digout",
			"result": "nothing",
			"afterdig": ["sandCleared", 996]
		},

		"2": {
			"type": "sand",
			"action": "digout",
			"result": "treasure",
			"afterdig": ["sandCleared", 996]
		},

		"3": {
			"type": "sand",
			"action": "digout",
			"result": "poison",
			"afterdig": ["sandCleared", 996]
		},

		"4": {
			"type": "sand",
			"action": "digout",
			"result": "gold",
			"afterdig": ["sandCleared", 996]
		},

		"5": {
			"type": "obstacle",
			"action": "impossiblesMoves"
		},

		"6": {
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