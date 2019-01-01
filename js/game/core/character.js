import * as Utils from './utils.js'
import * as SkillRacePassiveModule from './skillRacePassives.js'

export class Character extends Utils.GameObject {
	constructor(race='DefaultRace') {
		super('Character')
		this.race = race

		this.nickname = 'Noname'

		this.statTotalExp = 0
		this.statLevel    = 1
		this.statExp      = 0
		// gender 0 = female, 1 = male
		this.gender = 1

		this.timeAlive    = 10
		this.timeRollBack = 0
		this.trueAge      = 0
		this.age          = 0 /* float */
		/* Tier 1 */
		this.statSTR = 10
		this.statAGI = 10
		this.statINT = 10

		this.endurance  = 1000
		this.stamina    = 1000
		this.magicpower = 1000
		this.currentEndurance  = 1000
		this.currentStamina    = 1000
		this.currentMagicpower = 1000

		/* Damage modifiers */
		this.damageReductionRatio      = 0
		this.magicDamageReductionRatio = 0

		/* skills */
		this.skills = {
			passives : {},
			toggles : {},
			actives : {}
		}

		/* buffs */
		this.buffs = {}
		/* status effects */
		this.statuseffects = {}

		/* character equipped items */
		this.equippeditems = []
		this.equippedweight = 0
		this.equippedweightlimit = 10
		this.bodyslot = {}
		this.bodyslotlimit = {}

		/* coordinates */
		this.x = 1
		this.y = 1
		/* depends on STR, AGI*/
		this.mspd = 1
		this.velocity = 1.02
		/* depends on race & increased by equippedweight */
		this.staminaPerMovement = 0.01
		/* where looking, 360° */
		this.direction = 45

		/* last game tick, will refer to this to update age stuff */
		this.lastTick     = 0
		this.dataLevelTable = [100000,200000,300000,400000,500000,600000,700000,800000,900000]
	}

	updateStat(attr, value) {
		if (attr == 'gender') {
			this.gender = value === 1 ? 1 : 0
		} else if (attr == 'statLevel') {
			let parsedValue = parseInt(value)
			this.statLevel = parsedValue > 1 ? parsedValue : 1
			if (parsedValue <= this.dataLevelTable.length) {
				this.statTotalExp = parsedValue > 1 ? this.dataLevelTable[this.statLevel-2] : 0 
			} else {
				let levelTableSize = this.dataLevelTable.length
				let overflowExpPerLevel = this.dataLevelTable[levelTableSize-1] - this.dataLevelTable[levelTableSize-2]
				this.statTotalExp = this.dataLevelTable[levelTableSize-1] + (parsedValue - levelTableSize - 1) * overflowExpPerLevel
			}
			/* update damage modifiers */
			let difficulty = window.gamesettings.difficulty
			this.damageReductionRatio = this.calcDamageReduction(this.statSTR - ((difficulty + 1) * 100))
			this.magicDamageReductionRatio = this.calcDamageReduction(this.statINT - ((difficulty + 1) * 100))
		} else if (attr == 'timeRollBack') {
			this.timeRollBack = parseInt(value)
			// TODO : calc trueAge & age
		} else if (attr == 'statSTR') {
			this.statSTR = value > 1 ? parseInt(value) : 1
		} else if (attr == 'statAGI') {
			this.statAGI = value > 1 ? parseInt(value) : 1
		} else if (attr == 'statINT') {
			this.statINT = value > 1 ? parseInt(value) : 1
		} else if (attr == 'endurance') {
			this.endurance = value > 1 ? parseInt(value) : 1
		} else if (attr == 'stamina') {
			this.stamina = value > 1 ? parseInt(value) : 1
		} else if (attr == 'magicpower') {
			this.magicpower = value > 1 ? parseInt(value) : 1
		} else if (attr == 'currentEndurance') {
			this.currentEndurance = value > 1 ? Math.min(parseInt(value), this.endurance) : 1
		} else if (attr == 'currentStamina') {
			this.currentStamina = value > 1 ? Math.min(parseInt(value), this.stamina) : 1
		} else if (attr == 'currentMagicpower') {
			this.currentMagicpower = value > 1 ? Math.min(parseInt(value), this.magicpower) : 1
		} else if (attr == 'mspd') {
			this.mspd = value > 1 ? parseInt(value) : 1
		} else if (attr == 'direction') {
			this.direction = value > 1 ? Math.min(parseInt(value), 359) : 0
		}

	}
	us(statname, value) {
		this.updateStat(statname, value)
	}

	calcDamageReduction(modifier=0) {
		let diffRatio = 1 + window.gamesettings.difficulty * 1
		let base = 100 * diffRatio
		let ratio = 0
		//console.warn("base",base,"ratio",modifier * diffRatio)
		if (modifier * diffRatio >= 0) {
			ratio = base / (base + modifier) * Math.sqrt(diffRatio)
		} else {
			ratio = 2 * Math.sqrt(diffRatio) - base / (base - modifier * diffRatio)
		}
		return ratio
	}
	calcLevelExp() {
		let char_level = 0
		let char_exp = 0
		let levelTableSize = this.dataLevelTable.length
		let char_exptonextlevel = 0
		/* Check if total exp is greater than total exp from table,
			if it is, emulate exp diff based on the last level requirement */
		if (this.statTotalExp >= this.dataLevelTable[levelTableSize-1]) {
			let overflowExpPerLevel = this.dataLevelTable[levelTableSize-1] - this.dataLevelTable[levelTableSize-2]
			let overflowExp = this.statTotalExp - this.dataLevelTable[levelTableSize-1]
			let overflowModulo = overflowExp % overflowExpPerLevel
			let overflowLevel = Math.floor(overflowExp / overflowExpPerLevel)
			this.statLevel = levelTableSize + overflowLevel + 1
			this.statExp   = overflowModulo
			char_exptonextlevel = overflowExpPerLevel
		} else {
			for (let u = 0; u < this.dataLevelTable.length; u++) {
				if (this.statTotalExp >= this.dataLevelTable[u]) {
					char_level++
				}
			}
			if (char_level > 0) {
				char_exp = this.statTotalExp - this.dataLevelTable[char_level-1]
				char_exptonextlevel = this.dataLevelTable[char_level] - this.dataLevelTable[char_level-1]
			} else {
				char_exp = this.statTotalExp
				char_exptonextlevel = this.dataLevelTable[0]
			}
			this.statLevel = char_level + 1
			this.statExp   = char_exp
		}

		console.log("Level "+this.statLevel+" Exp "+this.statExp+"/"+char_exptonextlevel)
		return char_exptonextlevel
	}
	setTick(currentTick) {
		if (parseInt(currentTick) > this.lastTick) {
			this.lastTick = parseInt(currentTick)
		} else {
			console.error("Tick error on " + this.nickname + " Character. lastTick="+this.lastTick+", currentTick="+parseInt(currentTick))
		}
	}

	gainExp(exp) {
		this.statTotalExp += parseInt(exp)
		this.calcLevelExp()
	}
	get requiredExpToNextLevel() {
		return this.calcLevelExp()
	}
	get stats() {
		return {
			race : this.race,
			nickname : this.nickname,
			statTotalExp : this.statTotalExp,
			statLevel : this.statLevel,
			statExp : this.statExp,
			gender : this.gender,
			timeAlive : this.timeAlive,
			timeRollBack : this.timeRollBack,
			trueAge : this.trueAge,
			age : this.age,
			statSTR : this.statSTR,
			statAGI : this.statAGI,
			statINT : this.statINT,
			endurance : this.endurance,
			stamina : this.stamina,
			magicpower : this.magicpower,
			currentEndurance : this.currentEndurance,
			currentStamina : this.currentStamina,
			currentMagicpower : this.currentMagicpower
		}
	}

	get position() {
		return {
			x : this.x,
			y : this.y,
			mspd : this.mspd,
			direction : this.direction
		}
	}

	statfrompassive(passiveName, statname, basestatsObj) {
		return 0
	}
	statfromallpassives(statname, basestatsObj) {
		return 0
	}
	/* isactive: 1 = active only, 0 = non active only, -1 = any | will return 0 if the skill is in different state */
	statfromtoggle(toggleName, statname, isactive=1, basestatsObj) {
		return 0
	}
	/* isactive: 1 = active only, 0 = non active only, -1 = any */
	statfromalltoggles(statname, isactive=1, basestatsObj) {
		return 0
	}

	statfrombuff(buffName, statname, basestatsObj) {
		return 0
	}
	statfromallbuffs(statname, basestatsObj) {
		return 0
	}
}

export class Human extends Character {
	constructor(nickname='NamelessHuman', gender=1) {
		super('Human')
		this.nickname = nickname
		this.gender = parseInt(gender)

		this.bodyslot = {
			head: 0,	neck: 0,	chest: 0,
			armleft: 0, armright: 0,
			handleft: 0, handright: 0,
			legleft: 0, leftright: 0,
			footleft: 0, footright: 0
		}
		this.bodyslotlimit = {
			head: 35,	neck: 25,	chest: 200,
			armleft: 70, armright: 70,
			handleft: 15, handright: 15,
			legleft: 170, leftright: 220,
			footleft: 30, footright: 30
		}


		this.dataLevelTable = [
			1000,2500,4600,7450,11250,16250,22750,31100,41700,
			55000,71500,91750,116350,145950,181250,223000,272000,329100,395200,
			471250,558250,657250,769350,895700,1037500,1196000,1372500,1568350,1784950,
			2023750,2286250,2574000,2888600,3231700,3605000,4010250,4449250,4923850,5435950,
			5987500,6580500,7217000,7899100,8628950,9408750,10240750,11127250,12070600,13073200,
			14137500,15266000,16461250,17725850,19062450,20473750,21962500,23531500,25183600,26921700,
			28748750,30667750,32681750,34793850,37007200,39325000,41750500,44287000,46937850,49706450,
			52596250,55610750,58753500,62028100,65438200,68987500,72679750,76518750,80508350,84652450,
			88955000,93420000,98051500,102853600,107830450,112986250,118325250,123851750,129570100,135484700,
			141600000,147920500,154450750,161195350,168158950,175346250,182762000,190411000,198298100,206428200,
			214806250,223437250,232326250,241478350,250898700,260592500,270565000,280821500,291367350,302207950,
			313348750,324795250,336553000,348627600,361024700,373750000,386809250,400208250,413952850,428048950,
			442502500,457319500,472506000,488068100,504011950,520343750,537069750,554196250,571729600,589676200,
			608042500,626835000,646060250,665724850,685835450,706398750,727421500,748910500,770872600,793314700,
			816243750,839666750,863590750,888022850,912970200,938440000,964439500,990976000,1018056850,1045689450,
			1073881250,1102639750,1131972500,1161887100,1192391200,1223492500,1255198750,1287517750,1320457350,1354025450,
			1388230000,1423079000,1458580500,1494742600,1531573450,1569081250,1607274250,1646160750,1685749100,1726047700,
			1767065000,1808809500,1851289750,1894514350,1938491950,1983231250,2028741000,2075030000,2122107100,2169981200,
			2218661250,2268156250,2318475250,2369627350,2421621700,2474467500,2528174000,2582750500,2638206350,2694550950,
			2751793750,2809944250,2869012000,2929006600,2989937700,3051815000,3114648250,3178447250,3243221850,3308981950,
			3375737500,3443498500,3512275000,3582077100,3652914950,3724798750,3797738750,3871745250,3946828600,4022999200,
			4100267500,4178644000,4258139250,4338763850,4420528450,4503443750,4587520500,4672769500,4759201600,4846827700,
			4935658750,5025705750,5116979750,5209491850,5303253200,5398275000,5494568500,5592145000,5691015850,5791192450,
			5892686250,5995508750,6099671500,6205186100,6312064200,6420317500,6529957750,6640996750,6753446350,6867318450,
			6982625000,7099378000,7217589500,7337271600,7458436450,7581096250,7705263250,7830949750,7958168100,8086930700,
			8217250000,8349138500,8482608750,8617673350,8754344950]
	}

	calcStats(currentTick) {
		/* Tier 0 */
		super.calcLevelExp()
		super.setTick(currentTick)


		/* Gender affinity*/
		let affinitySTR = 0
		let affinityAGI = 0
		switch (this.gender) {
			case 0:
				affinitySTR = 1
				affinityAGI = 2
				break
			case 1:
				affinitySTR = 2
				affinityAGI = 1
				break
		}

		/* Tier 1 */
		let baseT1 = {
			statSTR: 20 + (2 * Math.floor(this.statLevel/3)) + (-1 * Math.floor(this.age/10)) + (affinitySTR * Math.floor(this.statLevel/7)),
			statAGI: 18 + (1 * Math.floor(this.statLevel/2)) + (-1 * Math.floor(this.age/12)) + (affinityAGI * Math.floor(this.statLevel/7)),
			statINT: 17 + (2 * Math.floor(this.statLevel/3)) + (1 * Math.floor(this.trueAge/12)) + (1 * Math.floor(this.statLevel/5))
		}

		super.us('statSTR', baseT1.statSTR + super.statfromallpassives('statSTR', baseT1) + super.statfromalltoggles('statSTR', 1, baseT1) + super.statfromallbuffs('statSTR', baseT1))
		super.us('statAGI', baseT1.statAGI + super.statfromallpassives('statAGI', baseT1) + super.statfromalltoggles('statAGI', 1, baseT1) + super.statfromallbuffs('statAGI', baseT1))
		super.us('statINT', baseT1.statINT + super.statfromallpassives('statINT', baseT1) + super.statfromalltoggles('statINT', 1, baseT1) + super.statfromallbuffs('statINT', baseT1))

		/* Tier 2 */
		let endurance  = 100 + (20 * this.statLevel) + (-5 * Math.floor(this.age/5)) + this.statSTR*4 + this.statAGI*2 + this.statINT
		let stamina    = 80 + (25 * this.statLevel) + (-5 * Math.floor(this.age/4)) + this.statSTR*3 + this.statAGI*3 + this.statINT*2
		let magicpower = 80 + (25 * this.statLevel) + (2 * this.age) + this.statSTR + this.statAGI + this.statINT*6
		super.us('endurance', endurance)
		super.us('stamina', stamina)
		super.us('magicpower', magicpower)
		console.log("STR", baseT1.statSTR,"AGI", baseT1.statAGI,"INT", baseT1.statINT,
			"| Endurance",endurance,"Stamina",stamina,"Magic Power",magicpower,"| Armor", this.damageReductionRatio,"MR",this.magicDamageReductionRatio)
	}
}
