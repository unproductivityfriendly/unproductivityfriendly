import * as Utils from './utils.js'

export class UnitGroup extends Utils.GameObjectGroup {
	constructor(ugid=0) {
		super('UnitGRP', ugid)
		// this.objectList created by parent
	}
}

export class ResourceGroup extends Utils.GameObjectGroup {
	constructor(ugid=0) {
		super('ResourceGRP', ugid)
		// this.objectList created by parent
	}
}