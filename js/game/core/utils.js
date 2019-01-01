'use strict';
export let stringToFunction = function(str) {
	let arr = str.split(".")

	let fn = (window || this)
	for (let i = 0, len = arr.length; i < len; i++) {
		fn = fn[arr[i]]
	}

	if (typeof fn !== "function") {
		throw new Error("function not found")
	}

	return  fn
};

export let Flr = function(number) {
	return Math.floor(number)
}

export let gameInitHTML = function() {
	let attributeName = "game-ui-init"
	let file, xhttp
	let template = null
	let templates = document.querySelectorAll("["+attributeName+"]")
	let n = templates.length

	for (let i = templates.length - 1; i >= 0; i--) {
		template = templates[i]
		file = template.getAttribute(attributeName)
		if (file) {
			xhttp = new XMLHttpRequest()
			xhttp.onreadystatechange = function() {
			  if (this.readyState == 4) {
			    if (this.status == 200) {template.innerHTML = this.responseText.toString()}
			    if (this.status == 404) {template.innerHTML = "Page not found."}
			    /*remove the attribute, and call this function once more:*/
			    template.removeAttribute(attributeName)
			    gameInitHTML()
			  }
			}
			xhttp.open("GET", file, true)
			xhttp.send()
		}
	}
}

export class GameObject {
	construct(entity='UndefinedGameObject', goid=0) {
		this.settings = {
			idmin: 1, // (only positive int)
			idmax: 9999
		}
		//entity means GameObject Type
		this.entity = entity.replace(/[^a-zA-Z ]/g, "").toUpperCase()
		this.goid = Math.min(Math.max(Math.abs(parseInt(goid, 10)),this.settings.idmin), this.settings.idmax)
		//instance id
		this.iid = 0
	}

	is() {
		return this.entity
	}

	// id of the GameObject (int)
	get id() {return this.goid}
	// id in string with leading zeros
	get idz() {return this.goid.toString().padStart(4, '0')}

	get iid() {return this.iid}
	get iidz() {return this.iid.toString().padStart(10, '0')}
	set iid(newiid) {this.iid = Math.min(Math.abs(parseInt(newiid, 10)), 9999999999)}

	get entity() {return this.entity}
	get name() {return this.entity + '_' + this.goid.toString().padStart(4, '0')}

	static isGo() {
		return true
	}

	static idToStringNumber(id) {
		return id.toString().padStart(4, '0')
	}
}

export class GameObjectGroup extends GameObject {
	constructor(entity='UndefinedGameObjectGroup', goid=0) {
		super(entity, goid)
		// list of unique items (game objects of the same kind)
		this.goList = []
	}

	get goList() {return this.goList}
	get length() {return this.goList.length}


	add(newitemid) {
		if (newitemid < this.settings.idmin || newitemid > this.settings.idmax) {
			throw new RangeError(this.entity+".add(): item id ("+newitemid+") is out of range "+this.settings.idmin+"-"+this.settings.idmax)
		} else if (this.goList.indexOf(newitemid) > -1) {
			throw new Error(this.entity+".add(): item '"+newitemid+"' already in.")
		} else {
			this.goList.push()
		}
	}
	remove(itemid) {
		if (this.goList.indexOf(itemid) === -1) {
			throw new Error(this.entity+".remove(): item '"+itemid+"' does not exist.")
		} else if (itemid < this.settings.idmin || itemid > this.settings.idmax) {
			throw new RangeError(this.entity+".remove(): item id ("+itemid+") is not even in range "+this.settings.idmin+"-"+this.settings.idmax)
		} else {
			this.goList.splice(this.goList.indexOf(itemid), 1)
		}
	}
	check(itemid) {
		if (itemid < this.settings.idmin || itemid > this.settings.idmax) {
			throw new RangeError(this.entity+".remove(): item id ("+itemid+") is not even in range "+this.settings.idmin+"-"+this.settings.idmax)
		} else if (this.goList.indexOf(itemid) === -1) {
			return false
		} else {
			return true
		}
	}
}

/* Math */
export let rng = (chance,max) => {
	let result = Math.random() * max + 1 || 0
	return result < chance
}

export let rngmm = (min, max) => {
	min = min || 0
	max = max || 1
	return Math.random() * (max - min) + min
}

export let log10 = (val) => {
	return Math.log(val) / Math.LN10
}

/* formatting */

export let capFirst = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
}

export let percent = (number, decimal) => {
	number = number || 0
	decimal = decimal || 0
	if (number === 0) { return 0 }
	return toDecimal(Math.floor(number * 100 * Math.pow(10, decimal)) / Math.pow(10, decimal),decimal)
}

export let toDecimal = (number, decimal) => {
	number = number || 0
	decimal = decimal || 0
	let dec = Math.pow(10,decimal)
	if (number === 0) { return 0 }
	return Math.round(number * dec) / dec
}

/* checkers (return true or false */

export let isHex = (h) => {
	let a = parseInt(h,16)
	return (a.toString(16) === h)
}