/* Core Components*/
import {stringToFunction, GameObject} from './core/utils.js';
import {World} from './core/world.js';
/*import {Character, Human} from './core/character.js';
import {Skill, PassiveSkill, ToggleSkill, ActiveSkill} from './core/skill.js';*/
import {GameEngine} from './game.js';
import {UserInterface} from './ui.js';
import {Board} from './board.js';

/* Load Custom Characters */

/* Load Custom Skills */
window.gamesettings = {
	difficulty: 0,
	framerate : 40
}
const GameInstance = {
	engine: null,
	ui: null,
	board: null,
	currentWorld: null
}

GameInstance.currentWorld = new World("Type3")
GameInstance.engine = new GameEngine()
GameInstance.ui = new UserInterface(GameInstance)


const EntityData = {
	templateEntities: {
		resources: {
			count: 3,
			RESOURCE_0001: {
				name: "ore",
				value: 100,
				decimal: 0,
				lmin: 0,
				lmax: 999999,
				label_en: "Ore"
			},
			RESOURCE_0002: {
				name: "lumber",
				value: 100,
				decimal: 0,
				lmin: 0,
				lmax: 999999,
				label_en: "Lumber"
			},
			RESOURCE_0003: {
				name: "leather",
				value: 100,
				decimal: 0,
				lmin: 0,
				lmax: 999999,
				label_en: "Leather"
			},
		},
		resourcegroups: {
			count: 1,
			RESOURCEGRP_0001: {
				name: "basics",
				resources: [1,2,3],
				hidden: [2]
			}
		},
	},
	constances : {
		entitylists: {
			count: 1,
			EL_0001: {
				grouptype: "resource",
				groupid: 1,
				unique: true,
				list: [3,1,2],
				label_en: "testorder"
			}
		}
	}
}

GameInstance.engine.init(EntityData)

console.log(GameInstance.currentWorld)
console.log(GameInstance.ui)

function gameGELoop() {
	GameInstance.currentWorld.tick()
	GameInstance.engine.loop()
	window.setTimeout(gameGELoop, 1000 / window.gamesettings.framerate)
}
let gameUILoop = function () { 
	GameInstance.ui.loop(GameInstance.currentWorld.dateFormat)
	if (GameInstance.ui.initialized === true) {
		UserInterface.updateTextByID("rangevalue",window.gamesettings.framerate)
		UserInterface.updateTextByID("gamenginefps",GameInstance.engine.fps)
	}
}
let _gameGELoop = gameGELoop()
let _gameUILoopId = setInterval(gameUILoop, 1000 / 20)


/*tests*/
//GameInstance.engine.createEnvironment(d3.select("#map"), defaultParams)

/*
let Hayenn = new Human("Hayenn")
Hayenn.trueAge = 29
Hayenn.age = 15

let curTick = performance.now()
let testDifficulty = 0
console.log("=========================== latency: " + (performance.now() - curTick))
curTick = performance.now()
window.gamesettings.difficulty = testDifficulty
Hayenn.updateStat('statLevel', testDifficulty*100+1); Arisa.updateStat('statLevel', testDifficulty*100+1); Mito.updateStat('statLevel', testDifficulty*100+1)
Hayenn.calcStats(curTick); Arisa.calcStats(curTick); Mito.calcStats(curTick)
console.log("=========================== latency: " + (performance.now() - curTick))
curTick = performance.now()
window.gamesettings.difficulty = testDifficulty
Hayenn.updateStat('statLevel',testDifficulty*250+2); Arisa.updateStat('statLevel',testDifficulty*250+2); Mito.updateStat('statLevel',testDifficulty*250+2)
Hayenn.calcStats(curTick); Arisa.calcStats(curTick); Mito.calcStats(curTick)
console.log("=========================== latency: " + (performance.now() - curTick))
*/