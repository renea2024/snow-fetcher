const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

// Your OpenWeatherMap API Key
const API_KEY = 'f4bfbad90b6473dca369856b7554e4b4';

// Middleware to allow frontend calls
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Home route
app.get('/', (req, res) => {
  res.send('❄️ Hello from Snow Storm Tracker backend!');
});

// Snowstorm check route
app.get('/snowstorm', async (req, res) => {
  const location = req.query.location;

  if (!location) {
    return res.status(400).json({ error: 'Location query parameter is required' });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=imperial`
    );

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch weather data from API' });
    }

    const data = await response.json();

    // Optional: log for debugging
    console.log(`Weather data for ${location}:`, data);

    const snow = data.snow;
    const snowDepth = snow?.['1h'] || snow?.['3h'] || 0;
    const isSnowstorm = snowDepth > 0;

    res.json({
      location: data.name,
      snowstorm: isSnowstorm,
      snowDepthInches: snowDepth,
      weatherDescription: data.weather[0]?.description || 'No description available',
      message: isSnowstorm
        ? `❄️ Snowstorm in ${data.name}! Snow depth: ${snowDepth} inches.`
        : `No snowstorm in ${data.name}. Conditions: ${data.weather[0]?.description || 'unknown'}.`
    });
  } catch (error) {
    console.error('Error fetching snowstorm data:', error);
    res.status(500).json({ error: 'Server error while processing request' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
