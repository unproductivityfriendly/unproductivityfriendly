import {stringToFunction, gameInitHTML, GameObject} from './core/utils.js';
import {World} from './core/world.js';

export class UserInterface {
	constructor(gameInstance=null) {
		this.initialized = false
		this.running = false
		this.gameInstance = gameInstance
		this.fps     = 20
		
		/* =================== */
		this.attributeName = "game-ui-init"

		gameInitHTML()
	}

	loop(dateFormated="test") {
		let templates = document.querySelectorAll("["+this.attributeName+"]")
		if (templates.length === 0) {
			this.initialized = true
			UserInterface.eleByID("settingfps").addEventListener("change", function (e) {
				window.gamesettings.framerate = parseInt(this.value);
			});
		} else {
			gameInitHTML()
		}
		if (this.initialized === false) { return false }
		this.updateClock(dateFormated)
	}

	updateClock(clockText="##-##-## ##:##:##") {
		UserInterface.updateTextByID("worldclock",clockText)
	}

	/*DOM*/
	static eleByID(id) {
		return document.getElementById(id)
	}

	static eleByClass(classname) {
		return document.getElementsByClassName(classname)
	}

	static eleBySelector(selector) {
		return document.querySelector(selector)
	}

	static updateTextByID(elementID, text) {
		text = text || ""
		let thisElement = this.eleByID(elementID)
		if (thisElement.innerHTML !== text.toString()) {
			thisElement.innerHTML = text.toString()
		}
	}

	static updateTextBySelector(elementSelector, text) {
		text = text || ""
		let thisElement = this.eleBySelector(elementSelector)
		if (thisElement.innerHTML !== text.toString()) {
			thisElement.innerHTML = text.toString()
		}
	}

	static updateAttributeByID(elementID, attribute, value) {
		let thisElement = this.eleByID(elementID)
		
		if (thisElement.getAttribute(attribute) !== value.toString()) {
			thisElement.setAttribute(attribute, value.toString())
		}
	}

	static updateAttributeBySelector(elementSelector, attribute, value) {
		let thisElement = this.eleBySelector(elementSelector)
		
		if (thisElement.getAttribute(attribute) !== value.toString()) {
			thisElement.setAttribute(attribute, value.toString())
		}
	}
}