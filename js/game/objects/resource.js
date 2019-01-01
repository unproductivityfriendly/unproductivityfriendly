import * as Utils from './utils.js'

export class Resource extends Utils.GameObject {
	constructor(resourceid=0, type, value, decimal, lmin, lmax, label_en, options) {
		super('Resource', resourceid)
		this.resourcetype = type
		this.resourcevalue = value
		this.resourcedecimal = decimal
		this.resourcelmin = lmin
		this.resourcelmax = lmax
		this.resourcelabel_en = label_en
		/* options */
		this.resourcecolor = null
		this.resourcecolorcondition = null

		if (options.color !== null) {
			this.resourcecolor = options.color
		} else if (options.colorccondition !== null) {
			this.resourcecolorcondition = options.colorccondition
		}
	}

	get type() {return this.resourcetype}

	get value() {return Utils.toDecimal(this.resourcevalue, this.resourcedecimal)}
	get render() {return this.resourcevalue.toFixed(this.resourcedecimal)}
	set value(number=0) {
		this.resourcevalue = Math.max(parseInt(number, 10), this.resourcelmin)
		/* value can't go above lmax if has max limit */
		if (this.resourcelmax !== null) {
			this.resourcevalue = Math.min(parseInt(this.resourcevalue, 10), this.resourcelmax)
		}
	}

	get decimal() {return this.resourcedecimal}
	get min() {return this.resourcelmin}
	get max() {return this.resourcelmax}
	get label() {return this.resourcelabel_en}

	static create(settings={
		name: "RESOURCE_0000",
		type: "persistent",
		value: 100,
		decimal: 0,
		lmin: 0,
		lmax: 999999,
		label_en: "UndefinedResource",
		color: null,
		colorccondition: null
		}) {
		if (typeof yourVariable !== 'object') {
			throw new Error("Resource.create(): settings object required.")
		} else if (!settings.name) {
			throw new Error("Resource.create(): name property not specified.")
		} else if (settings.name.slice(6) !== "RESOURCE_") {
			throw new Error("Resource.create(): not a resource data object.")
		}
		/* define possible results for some property */
		let resourcetypes = ["persistent","temporary"]
		let decimalmin = 0
		let decimalmax = 17
		/* set the parsed data to use */
		let resourceid = settings.name.slice(-4)
		let type = resourcetypes.find(function(ttype){return ttype === type}) || resourcetypes[0]
		let value = 0
		let decimal = Math.max(Math.min(parseInt(settings.decimal, 10), decimalmax), decimalmin)
		let lmin = parseInt(settings.lmin, 10) || 0
		let lmax = parseInt(settings.lmax, 10) || null
		let label_en = settings.label_en.toString()
		// TO DO
		let options = {
			color: null,
			colorccondition: null
		}
		/* check so lmax can't be lower than lmin */
		if (lmax !== null && lmax < lmin) {
			throw new Error("Resource.create():  lmax ("+lmax.toString()+") is smaller than lmin ("+lmin.toString()+")")
		}
		/* value can't go below lmin */
		value = Math.max(parseInt(settings.value, 10), lmin)
		/* value can't go above lmax if has max limit */
		if (lmax !== null) {
			value = Math.min(parseInt(value, 10), lmax)
		}

		let newresource = new Resource(resourceid, type, value, decimal, lmin, lmax, label_en, options)

		return newresource
	}
}