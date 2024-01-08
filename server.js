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
const days = "1";
let apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${days}`;

app.get("/location", async (req, res) => {
	const response = await fetch(apiUrl);
	const weatherDetails = await response.json();

	res.send(
		`${weatherDetails.location.name}, ${weatherDetails.location.country}`
	);
});

app.get("/temp", async (req, res) => {
	const response = await fetch(apiUrl);
	const weatherDetails = await response.json();

	res.send(`${weatherDetails.current.temp_c}°C`);
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
