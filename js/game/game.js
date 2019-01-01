import {stringToFunction, toDecimal, GameObject} from './core/utils.js';
import * as Char from './core/character.js';

export class GameEngine {
	constructor() {
		this.frame = 1000
		this.fps = 1
		this.lastFrameTimeStamp = 0

		this.templateEntities = {
			boards 				: {},

			units 				: {},
			unitgroups 			: {},
			resources 			: {},
			resourcegroups 		: {},
			technologies 		: {},
			technologygroups 	: {},
			events 				: {},
			eventgroups 		: {},
			quests 				: {},
			questgroups 		: {},
			tables 				: {},
			tablegroups 		: {}
		}

		this.constances = {
			entitylists			: {
				units 			: {},
				resources 		: {},
				technologies 	: {},
				events 			: {},
				quests 			: {},

			},

			scenes 				: {},

			ui 					: {},
			uil 				: {},
			uie 				: {},

			buffs 				: {},
			modifiers 			: {}
		}

		this.instanceEntities = {
			boards 				: {},
			unitgroups 			: {},
			resourcegroups 		: {},
			technologygroups 	: {},
			eventgroups 		: {},
			questgroups 		: {},
			tablegroups 		: {}
		}
	}

	init(entitydata) {
		this.initTemplates(entitydata.templateEntities)
		this.initConstances(entitydata.constances)

		/* will load directly from template groups*/
		this.initInstances()
	}

	/* Add all entities as template */
	initTemplates(tedata) {
		if (tedata.resources.hasOwnProperty('count') && tedata.resources.count > 0) {
			for (let i = tedata.resources.count - 1; i >= 0; i--) {
				let strID = GameObject.idToStringNumber(i+1)
				if (tedata.resources.hasOwnProperty('RESOURCE_'+strID)) {
					this.templateEntities.resources['RESOURCE_'+strID] = tedata.resources['RESOURCE_'+strID]
				} else {throw new Error("initTemplates: RESOURCE_"+strID+" is not a property.")}
			}
		}
		if (tedata.resourcegroups.hasOwnProperty('count') && tedata.resourcegroups.count > 0) {
			for (let i = tedata.resourcegroups.count - 1; i >= 0; i--) {
				let strID = GameObject.idToStringNumber(i+1)
				if (tedata.resourcegroups.hasOwnProperty('RESOURCEGRP_'+strID)) {
					this.templateEntities.resourcegroups['RESOURCEGRP_'+strID] = tedata.resourcegroups['RESOURCEGRP_'+strID]
				} else {throw new Error("initTemplates: RESOURCEGRP_"+strID+" is not a property.")}
			}
		}
		console.log(this.templateEntities)
	}
	initConstances(cnstdata) {
		if (cnstdata.entitylists.hasOwnProperty('count') && cnstdata.entitylists.count > 0) {
			for (let i = cnstdata.entitylists.count - 1; i >= 0; i--) {
				let strID = GameObject.idToStringNumber(i+1)
				if (cnstdata.entitylists.hasOwnProperty('EL_'+strID) && cnstdata.entitylists['EL_'+strID].hasOwnProperty('grouptype')) {
					if (cnstdata.entitylists['EL_'+strID].grouptype === 'unit') {
						this.constances.entitylists.units['EL_'+strID] = cnstdata.entitylists['EL_'+strID]
					} else if (cnstdata.entitylists['EL_'+strID].grouptype === 'resource') {
						this.constances.entitylists.resources['EL_'+strID] = cnstdata.entitylists['EL_'+strID]
					} else if (cnstdata.entitylists['EL_'+strID].grouptype === 'technology') {
						this.constances.entitylists.technologies['EL_'+strID] = cnstdata.entitylists['EL_'+strID]
					} else if (cnstdata.entitylists['EL_'+strID].grouptype === 'event') {
						this.constances.entitylists.events['EL_'+strID] = cnstdata.entitylists['EL_'+strID]
					} else if (cnstdata.entitylists['EL_'+strID].grouptype === 'quest') {
						this.constances.entitylists.quests['EL_'+strID] = cnstdata.entitylists['EL_'+strID]
					}
				} else {throw new Error("initConstances: EL_"+strID+" is not a property.")}
			}
		}
	}
	initInstances() {
		/* reset */
		this.instanceEntities.boards = {}
		this.instanceEntities.unitgroups = {}
		this.instanceEntities.resourcegroups = {}
		this.instanceEntities.technologygroups = {}
		this.instanceEntities.eventgroups = {}
		this.instanceEntities.questgroups = {}
		this.instanceEntities.tablegroups = {}
		/* init instances from template */
	}


	loop() {
		let now = performance.now()
		this.frame += 1
		this.fps = toDecimal(1000 / (now - this.lastFrameTimeStamp), 0)
		this.lastFrameTimeStamp = now


		/***************************
		** CHECK QUEUES
		***************************/

		/* Event Queue */

	}


	loopResource() {

	}

	// 
	loadObjects() {

	}


/*	createCharacter(characterName="Hayenn", characterRace="Human") {
		this.characters.push(new Char[characterRace](characterName))
		console.log(this.characters)
	}*/
	createBuilding() {

	}
/*	createEnvironment(svg,params) {
		doMap(svg,params)
	}*/


}