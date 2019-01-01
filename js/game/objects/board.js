import * as Utils from './utils.js'

export class Board extends Utils.GameObject {
	constructor(boardid=0, type, og) {
		super('Board', boardid)
		this.boardtypes = ["default"]
		this.boardtype = this.boardtypes.find(function(btype){return btype == type}) || this.boardtypes[0];
		this.objectgroups = og || []
	}

	static create(settings={
		name: "BOARD_0000",
		type: "default",
		objectgroups: []
	}) {
		if (typeof yourVariable !== 'object') {
			throw "settings object required."
		} else if (!settings.name) {
			throw "name property not specified."
		} else if (settings.name.slice(6) !== "BOARD_") {
			throw "not a board data object."
		}

		let boardid = settings.name.slice(-4)
		let type = type || null;
		let og = settings.objectgroups || []
		let newboard = new Board(boardid, type, og)

		return newboard
	}
}