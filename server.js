import express from "express";
import {format} from "date-fns";

const app = express();

// Set static folder
app.use(express.static("public"));
// Parse URL-encoded bodies (as sent by HTML forms) - this is what allows you to get fahrenhiet. This is your middleware
app.use(express.urlencoded({extended: true}));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

/* ALL YOUR SERVER STUFF WILL GO HERE */

const apiKey = "5a27d69e27f140f58e7141821230211";
let location = "sproughton";
const days = "3";
let apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${days}`;

app.get("/location", async (req, res) => {
	const response = await fetch(apiUrl);
	const weatherDetails = await response.json();

	res.send(
		`${weatherDetails.location.name}, ${weatherDetails.location.country}`
	);
});

app.get("/weathercard", async (req, res) => {
	const response = await fetch(apiUrl);
	const weatherDetails = await response.json();
	const forecastdays = weatherDetails.forecast.forecastday;
	let html = ``;

	forecastdays.forEach((day) => {
		const date = new Date(day.date);
		const formattedDate = format(date, "eeee");
		const rain = day.day.daily_chance_of_rain;
		let mightRain = "";
		const snow = day.day.daily_chance_of_snow;
		let mightSnow = "";
		const wind = day.day.maxwind_mph;
		let isWindy = "";
		const moonPhase = day.astro.moon_phase;
		const averageTemp = day.day.avgtemp_c;
		const condition = day.day.condition.text;
		const humidity = day.day.avghumidity;

		// Check for rain
		if (rain > 50) {
			mightRain = `<div class="rain" id ="rain">${rain}% chance of rain</div>`;
		} else {
			mightRain = ``;
		}
		// Check for snow
		if (snow > 50) {
			mightSnow = `<div class="snow" id ="snow">${snow}% chance of snow</div>`;
		} else {
			mightSnow = "";
		}
		// Check for wind
		if (wind > 30) {
			isWindy = `Wind speeds of ${wind}/mph expected`;
		} else {
			isWindy = "";
		}

		html += `
			<div class="opaque-background">
			<div class="day" id="day">${formattedDate}, ${averageTemp}°c</div>
			<div class="vl"></div>
			<div class="moon-phase" id="moon-phase">The moon is ${moonPhase}</div>
			<div class="condition" id="condition">${condition}</div>
			<div class="humidity" id="humidity">${humidity}% humidity</div>
			${mightRain}
			${mightSnow}
			${isWindy}
			</div>
		<!--date, moonphase, averagetemp, condition, humidity, rainchance, snowchance, windspeed-->
		`;
	});

	res.send(html);
});

/* app.get("/weathercard", async (req, res) => {
	const response = await fetch(apiUrl);
	const weatherDetails = await response.json();
	const forecastday = weatherDetails.forecast.forecastday[0];
	const rain = forecastday.day.daily_chance_of_rain;
	let mightRain = "";
	const snow = forecastday.day.daily_chance_of_snow;
	let mightSnow = "";
	const wind = forecastday.day.maxwind_mph;
	let isWindy = "";
	const moonPhase = forecastday.astro.moon_phase;
	const averageTemp = forecastday.day.avgtemp_c;
	const condition = forecastday.day.condition.text;
	const humidity = forecastday.day.avghumidity;

	console.log(snow);
	// Check for rain
	if (rain > 50) {
		mightRain = `<div class="rain" id ="rain">${rain}% chance of rain</div>`;
	} else {
		mightRain = ``;
	}
	// Check for snow
	if (snow > 50) {
		mightSnow = `<div class="snow" id ="snow">${snow}% chance of snow</div>`;
	} else {
		mightSnow = "";
	}
	// Check for wind
	if (wind > 30) {
		isWindy = `Wind speeds of ${wind}/mph expected`;
	} else {
		isWindy = "";
	}

	const html = `
			<div class="moon-phase" id="moon-phase">${moonPhase}</div>
			<div class="average-temp" id="average-temp">${averageTemp}°C</div>
			<div class="condition" id="condition">${condition}</div>
			<div class="humidity" id="humidity">${humidity}% humidity</div>
			${mightRain}
			${mightSnow}
			${isWindy}
		<!--date, moonphase, averagetemp, condition, humidity, rainchance, snowchance, windspeed-->
		`;

	res.send(html);
}); */

app.get("/temp", async (req, res) => {
	const response = await fetch(apiUrl);
	const weatherDetails = await response.json();

	res.send(`Current temp: ${weatherDetails.current.temp_c}°C`);
});

app.post("/search", async (req, res) => {
	const searchTerm = req.body.search.toLowerCase();

	try {
		apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchTerm}&days=${days}`;
		// Make HTTP request
		const response = await fetch(apiUrl);

		// Parse the JSON from the response
		const weatherDetails = await response.json();

		if (weatherDetails.error) {
			console.log(
				`${weatherDetails.error.code}, ${weatherDetails.error.message}`
			);
			res.send(`${weatherDetails.error.message}`);
		} else {
			// Use the parsed data to construct the location string
			location = weatherDetails.location.name;
			console.log(location);
			const locationString = `${location}, ${weatherDetails.location.country}`;
			res.status(200).send(locationString);
		}
	} catch (error) {
		console.error("There was an error fetching the data", error);
		res.status(500).send("Error fetching data");
	}
});

// Start the server
app.listen(3000, () => {
	console.log("Server listening on port 3000");
});
