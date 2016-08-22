'use strict';

const CianService = require('./cian-service');
const CianCache = require('./cian-cache');

const options = {
	uri: 'http://www.cian.ru/cat.php?deal_type=sale&engine_version=2&minbalkon=1&minfloor=3&minsu_r=1&offer_type=flat&room2=1&street%5B0%5D=2246&street%5B1%5D=1096&street%5B2%5D=772&street%5B3%5D=1095&street%5B4%5D=2816&street%5B5%5D=1216&street%5B6%5D=2014',
	callback: onCianData,
	errback: onCianError
};
const service = new CianService(options);
const cache = new CianCache();

service.start();
// service.stop();


function onCianData(data) {
	var newFlats = cache.findNewAndSave(data);
	if (newFlats && newFlats.length > 0) {
		console.log('New flats: ', newFlats)
	}
}

function onCianError(err) {
	console.log('onCianError: ', err);
}