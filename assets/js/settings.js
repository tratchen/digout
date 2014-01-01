
var gameSettings = {
	
	"gameRunning": false,
	"gameWidth": 800,
	"gameHeight": 600,
	"baseMap": 96,
	"fps": 50,
	"currentLevel": null,
	"levelKey": false,
	"poisoned": false,
	"level": 100,
	"maximumLevel": 100,
	"gold": 0,
	"emerald": 0,
	"xp": 0,
	"life": 100,
	"antiPoison": 0,

	"treasuresKind": ["antiPoison", "gold", "emerald", "life", "xp"],

	"treasures": {
		"antiPoison": {
			"scale": 1
		},

		"gold": {
			"scale": 10
		},

		"emerald": {
			"scale": 0
		},

		"life": {
			"scale": 5
		},

		"xp": {
			"scale": 100
		}
	},
	
	"walls": {
		
		0: {
			"type": "solidWall",
			"action": "impossiblesMoves"
		},

		1: {
			"type": "sand",
			"action": "digout",
			"result": "nothing",
			"afterdig": ["sandCleared", 996]
		},

		2: {
			"type": "sand",
			"action": "digout",
			"result": "treasure",
			"afterdig": ["sandCleared", 996]
		},

		3: {
			"type": "sand",
			"action": "digout",
			"result": "poison",
			"afterdig": ["sandCleared", 996]
		},

		4: {
			"type": "sand",
			"action": "digout",
			"result": "gold",
			"afterdig": ["sandCleared", 996]
		},

		5: {
			"type": "obstacle",
			"action": "impossiblesMoves"
		},

		6: {
			"type": "monster",
			"action": "digout",
			"result": "monster",
			"afterdig": ["sandCleared", 996]
		},

		996: {
			"type": "sandCleared",
			"action": "possiblesMoves"
		},

		997: {
			"type": "key",
			"action": "digout",
			"result": "key",
			"afterdig": ["sandCleared", 996]
		},

		998: {
			"type": "entrance",
			"action": "possiblesMoves"
		},

		999: {
			"type": "exit",
			"action": "possiblesMoves"
		}
	}
};