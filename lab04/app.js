const openWeatherKey = "54866d844f552d3d4770e55c5ad28470"; // Replace with your actual key

// Fetch current weather by city name
async function fetchWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${openWeatherKey}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(`Weather API error: ${err.message}`);
  }
  return await resp.json();
}

// Display weather info
function displayWeather(weatherData) {
  const weatherDiv = document.getElementById("weatherInfo");
  const city = weatherData.name;
  const temp = Math.round(weatherData.main.temp);
  const feelsLike = Math.round(weatherData.main.feels_like);
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;
  const desc = weatherData.weather[0].description;
  const iconCode = weatherData.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  weatherDiv.style.display = "flex"; // Show the box
  weatherDiv.innerHTML = `
    <div class="weather-container">
      <div class="weather-icon">
        <img src="${iconUrl}" alt="${desc}" />
      </div>
      <div class="weather-details">
        <h2>${city}</h2>
        <p><strong>${temp}°F</strong> (Feels like ${feelsLike}°F)</p>
        <p style="text-transform: capitalize;">${desc}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} mph</p>
      </div>
    </div>
  `;
}

// Get local hour for a city
function getLocalHour(weatherData) {
  const localTimestamp = (weatherData.dt + weatherData.timezone) * 1000;
  const localDate = new Date(localTimestamp);
  return localDate.getUTCHours();
}

// Determine time of day from hour
function getTimeOfDay(hour) {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

// Clamp value between min and max
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// Brighten or darken a base color
function adjustColorBrightness(hex, amount, warm = false) {
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = clamp(r + amount, 0, 255);
  g = clamp(g + amount, 0, 255);
  b = clamp(b + amount, 0, 255);

  if (warm && amount < 0) {
    r = clamp(r + 10, 0, 255);
  }

  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Choose base color from weather and time
function weatherToBaseColor(weatherData, timeOfDay) {
  const temp = weatherData.main.temp;
  const cond = weatherData.weather[0].main.toLowerCase();

  let base;

  if (cond.includes("rain") || cond.includes("storm") || cond.includes("drizzle")) {
    base = "708090"; // slate gray
  } else if (cond.includes("snow")) {
    base = "E0F7FA"; // icy blue
  } else if (cond.includes("cloud")) {
    base = "87A0B3"; // muted sky blue
  } else if (cond.includes("clear")) {
    if (temp > 80) {
      base = "FFD54F"; // sunny yellow
    } else if (temp > 60) {
      base = "AED581"; // greenish
    } else {
      base = "81D4FA"; // light blue
    }
  } else {
    base = "B0BEC5"; // fallback neutral
  }

  // Adjust for time of day
  switch (timeOfDay) {
    case "morning":
      return adjustColorBrightness(base, 30);
    case "afternoon":
      return adjustColorBrightness(base, 10);
    case "evening":
      return adjustColorBrightness(base, -20, true);
    case "night":
      return adjustColorBrightness(base, -40);
    default:
      return base;
  }
}

// Fetch a palette from TheColorAPI
async function fetchPalette(hex, count, mode) {
  const url = `https://www.thecolorapi.com/scheme?hex=${hex.replace("#", "")}&mode=${mode}&count=${count}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch palette");
  const data = await res.json();
  return data.colors; // array of colors
}

// Main function
async function generate() {
  const city = document.getElementById("locInput").value.trim();
  if (!city) {
    alert("Enter a city name.");
    return;
  }

  try {
    const weatherData = await fetchWeatherByCity(city);

    // Remove this line, because .start-screen doesn't exist now:
    // document.querySelector(".start-screen").style.display = "none";

    document.querySelector(".start-screen").style.display = "none";
    document.body.classList.remove("initial-load");
    document.body.classList.add("top-layout");
    displayWeather(weatherData);

    const hour = getLocalHour(weatherData);
    const timeOfDay = getTimeOfDay(hour);
    const baseHex = weatherToBaseColor(weatherData, timeOfDay);

    const modes = ["analogic", "monochrome", "complement"];
    const palettes = await Promise.all(
      modes.map((mode) => fetchPalette(baseHex, 5, mode))
    );

    const paletteDiv = document.getElementById("palette");
    paletteDiv.innerHTML = "";

    palettes.forEach((palette, index) => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.flexDirection = "column";
      row.style.alignItems = "center";
      row.style.textAlign = "center";
      row.style.gap = "10px";
      row.style.marginBottom = "30px";

      const title = document.createElement("h3");
      title.textContent = modes[index][0].toUpperCase() + modes[index].slice(1);

      const swatchRow = document.createElement("div");
      swatchRow.style.display = "flex";
      swatchRow.style.justifyContent = "center";
      swatchRow.style.gap = "10px";

      palette.forEach((c) => {
        const sw = document.createElement("div");
        sw.className = "swatch";
        sw.style.backgroundColor = c.hex.value;
        sw.innerHTML = `<div>${c.name.value}</div><div>${c.hex.value}</div>`;
        swatchRow.appendChild(sw);
      });

      row.appendChild(title);
      row.appendChild(swatchRow);
      paletteDiv.appendChild(row);
    });
  } catch (e) {
    console.error(e);
    alert("Error: " + e.message);
    document.getElementById("weatherInfo").style.display = "none"; // Hide weather on error
  }
}

document.getElementById("btn").addEventListener("click", generate);