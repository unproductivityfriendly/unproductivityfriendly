import * as utils from './utils.js';

export class Skill extends utils.GameObject {
	constructor(type='DefaultType') {
		super('Skill')
		this.type = type
		this.name = 'TemplateSkill'
		this.isRacial = false
	}	


	static info(obj) {
		if (obj.hasOwnProperty('type') === true
			&& ['passive', 'toggle', 'active', 'racepassive'].includes(obj.type) === true) {
			return {type: obj.type}
		} else {
			console.error('This is not a Skill.')
			return false
		}
	}
}

export class PassiveSkill extends Skill {
	constructor(name='TemplatePassiveSkillSkill') {
		super('passive')

	}
}
export class ToggleSkill extends Skill {
	constructor(name='TemplateToggleSkill') {
		super('toggle')
		this.lastTick = 0
		this.isActive = 0.
		this.consumption = {
			tickDuration: 1,
			perTick: {endurance: 0, stamina:0, magicpower: 0},
			perDamageDealt: {endurance: 0, stamina:0, magicpower: 0},
			perDamageTaken: {endurance: 0, stamina:0, magicpower: 0}
		}
	}
}
export class ActiveSkill extends Skill {
	constructor(name='TemplateActiveSkill') {
		super('active')

	}
}

export class RacePassive extends Skill {
	constructor(name='TemplateRacePassiveSkill') {
		super('racepassive')
		this.name = name
	}
}