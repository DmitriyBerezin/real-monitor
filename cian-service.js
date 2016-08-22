'use strict';

const request = require('request').defaults({ 'proxy': 'http://proxy.frsd.ru:3128' });

const ID_REGEX = /oid=\"(\d*?)\"/gi;

class CianSearvice {

	constructor(options) {
		this.intervalID = null;
		this.options = Object.assign({}, CianSearvice.defaults, options);
	}

	start() {
		const fetchFn = _fetch.bind(null, this.options);
		this.intervalID = setInterval(fetchFn, this.options.interval);
	}

	stop() {
		console.log('stop');
	}

	isStarted() {
		return !!this.intervalID;
	}

	static get defaults() {
		return {
			uri: 'http://www.cian.ru/',
			interval: 1 * 1000 // 10min
		};
	}

	static parseHtmlData(html) {
		const flats = [];
		while (ID_REGEX.test(html)) {
			flats.push(+RegExp.$1);
		}
		return flats;
	}
}

function _fetch(options) {
	request.get(options.uri, (err, response, body) => {
		if (err) {
			_onFetchFailed(err, options.errback);
			return;
		}

		if (response.statusCode !== 200) {
			let msg = `The request has been failed with non-success status code: ${response.statusCode}`;
			let notSuccessErr = new Error(msg);
			_onFetchFailed(err, options.errback);
		}
		else {
			_onFetchComplete(body, options.callback);
		}

	});
}

function _onFetchComplete(data, callback) {
	const flats = CianSearvice.parseHtmlData(data);

	if (typeof callback === 'function') {
		callback(flats);
	}
}

function _onFetchFailed(errback, err) {
	if (typeof errback === 'function') {
		errback(err);
	}
}

module.exports = CianSearvice;
