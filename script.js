
async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const message = document.getElementById("message");

    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    message.textContent = "Loading weather...";

    try {
        // Find the city's coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to find the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Try another city.");
        }

        const place = geoData.results[0];
        const latitude = place.latitude;
        const longitude = place.longitude;

        // Get current weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to get weather data.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        // Convert weather code into a description and icon
        const weatherTypes = {
            0: ["Clear Sky", "☀️"],
            1: ["Mainly Clear", "🌤️"],
            2: ["Partly Cloudy", "⛅"],
            3: ["Overcast", "☁️"],
            45: ["Foggy", "🌫️"],
            48: ["Foggy", "🌫️"],
            51: ["Light Drizzle", "🌦️"],
            53: ["Drizzle", "🌦️"],
            55: ["Heavy Drizzle", "🌧️"],
            61: ["Light Rain", "🌧️"],
            63: ["Moderate Rain", "🌧️"],
            65: ["Heavy Rain", "🌧️"],
            71: ["Light Snow", "🌨️"],
            73: ["Snow", "❄️"],
            75: ["Heavy Snow", "❄️"],
            80: ["Rain Showers", "🌦️"],
            81: ["Rain Showers", "🌧️"],
            82: ["Heavy Rain Showers", "⛈️"],
            95: ["Thunderstorm", "⛈️"],
            96: ["Thunderstorm with Hail", "⛈️"],
            99: ["Severe Thunderstorm", "⛈️"]
        };

        const weather = weatherTypes[current.weather_code]
            || ["Unknown Conditions", "🌡️"];

        // Display weather details
        document.getElementById("cityName").textContent =
            `${place.name}, ${place.country}`;

        document.getElementById("temperature").textContent =
            `${current.temperature_2m} °C`;

        document.getElementById("condition").textContent = weather[0];

        document.getElementById("weatherIcon").textContent =
            current.is_day ? weather[1] : "🌙";

        document.getElementById("humidity").textContent =
            current.relative_humidity_2m;

        document.getElementById("wind").textContent =
            current.wind_speed_10m;

        message.textContent =
            `Feels like ${current.apparent_temperature} °C`;

    } catch (error) {
        message.textContent = error.message ||
            "Something went wrong. Please try again.";
    }
}

// Search when Enter is pressed
document.getElementById("cityInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
