'use strict';

const fs = require('fs');

const FILE_PATH = 'cache';
const DELIMETER = '--------------------------';

class CianCache {
	constructor() {
		this.flats = [];
		this.load();
	}

	load() {
		this.ready = false;

		fs.readFile(FILE_PATH, (err, data) => {
			if (err) {
				console.log(err);
				return;
			}

			let lines = data.toString().split('\r\n');
			for (let i in lines) {
				let id = +lines[i];
				if (!isNaN(id)) {
					this.flats.push(id);
				}
			}

			this.ready = true;
		});
	}

	save() {
		const data = this.flats.join('\r\n');
		fs.appendFile(FILE_PATH, data, (err) => {
			if (err) {
				throw err;
			}
		});
	}

	findNew(flats) {
		return flats.filter((flat) => {
			return this.flats.indexOf(flat) === -1;
		});
	}

	findNewAndSave(flats) {
		const newFlats = this.findNew(flats);
		if (newFlats && newFlats.length > 0) {
			this.flats = this.flats.concat(newFlats);

			const newFlatsStr = newFlats.join('\r\n');
			const newPart = `${DELIMETER}\r\n${newFlatsStr}`;
			fs.appendFile(FILE_PATH, newPart, (err) => {
				if (err) {
					throw err;
				}
			});
		}

		return newFlats;
	}
}

module.exports = CianCache;
