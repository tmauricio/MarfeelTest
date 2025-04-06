const axios = require('axios');

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

const targetUrl = process.env.TARGET_URL;

function generateData() {
	setInterval(async () => {
		[1234, 818181, 919191].forEach(device => {
			const payload = {
				device_id: `device_${device}`,
				temperature: randomFloat(14, 30),
				humidity: randomFloat(0, 100),
				pressure: randomFloat(950, 1050),
				wind_speed: randomFloat(0, 20),
				location: `Location_${randomInt(1, 10)}`,
				timestamp: Math.floor(Date.now() / 1000),
			};

			axios.post(targetUrl, payload);
		});
	}, 500);
}

if (require.main === module) {
	generateData();
}
