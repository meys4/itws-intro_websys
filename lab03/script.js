document.getElementById("getWeatherButton").addEventListener("click", getWeather);
document.getElementById("getJokeButton").addEventListener("click", handleJokeRequest);

// Hide joke button initially
document.getElementById("getJokeButton").style.display = "none";

let currentWeatherDescription = "";
let currentJokes = [];
let currentJokeIndex = 0;

// xuser location and fetch weather
function getWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getCurrentWeather(lat, lon);
      },
      function(error) {
        console.error("Error getting location:", error);
      }
    );
  }
}

// current weather
function getCurrentWeather(lat, lon) {
  const apiKey = "54866d844f552d3d4770e55c5ad28470";
  const url = "https://api.openweathermap.org/data/2.5/weather";

  $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    data: {
      lat: lat,
      lon: lon,
      units: "imperial",
      appid: apiKey
    },
    success: function(data) {
      const city = data.name;
      const country = data.sys.country;
      const temp = data.main.temp;
      const humidity = data.main.humidity;
      const rawDesc = data.weather[0].description;
      const desc = toTitleCase(rawDesc); // Capitalize each word
      const icon = data.weather[0].icon;
      const wind = data.wind.speed;
      currentWeatherDescription = desc;

      const html = `
        <div class="weather-box">
          <h2>Weather in ${city}, ${country}</h2>
          <div id="weatherIcon">
              <p><img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${desc}"></p>
          </div>
          <p><strong>Temperature:</strong> ${temp} °F</p>
          <p><strong>Humidity:</strong> ${humidity}%</p>
          <p><strong>Condition:</strong> ${desc}</p>
          <p><strong>Wind Speed:</strong> ${wind} mph</p>
        </div>
      `;

      document.getElementById("weatherResults").style.display = "block";
      document.getElementById("weatherResults").innerHTML = html;

      // joke button after weather is displayed
      document.getElementById("getJokeButton").style.display = "inline-block";

      // Hide getWeatherButton after click
      document.getElementById("getWeatherButton").style.display = "none";
    },
    error: function(xhr, status, error) {
      console.error("Error fetching weather:", status, error);
    }
  });
}

function handleJokeRequest() {
  if (!currentWeatherDescription) {
    displayJoke("Weather not loaded yet!");
    return;
  }

  // Show loading text first
  displayJoke("Generating joke...");
  
  // Wait 1 second, then fetch
  setTimeout(function() {
    getDadJoke(currentWeatherDescription);
  }, 500);
}

// get jokes with weather
function getDadJoke(desc) {
  const keywords = mapWeatherToKeyword(desc);
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];

  fetch("https://icanhazdadjoke.com/search?term=" + keyword, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "WeatherDadJokeApp (https://github.com/meys4/itws-intro_websys)"
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.results.length > 0) {
        currentJokes = data.results;
        currentJokeIndex = 0;
        displayJoke(currentJokes[currentJokeIndex].joke);
      } else {
        displayJoke("No jokes found for this weather!");
      }
    })
    .catch(function(error) {
      console.error("Error fetching joke:", error);
      displayJoke("Error getting a joke.");
    });
}

// Show joke
function displayJoke(jokeText) {
  document.getElementById("jokeBox").textContent = jokeText;
}

// uppercase
function toTitleCase(str) {
  return str
    .split(" ")
    .map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// weather descriptions to joke keywords
function mapWeatherToKeyword(desc) {
  const d = desc.toLowerCase();

  if (d.includes("rain")) {
    return ["wet", "rain", "storm"];
  }
  if (d.includes("clear") || d.includes("sun") || d.includes("sunny")) {
    return ["bright", "hot", "sun"];
  }
  if (d.includes("cloud")) {
    return ["cloud", "grey"];
  }
  if (d.includes("snow")) {
    return ["cold", "snow", "freeze", "frost"];
  }
  if (d.includes("wind")) {
    return ["wind", "draft", "fly"];
  }
  if (d.includes("fog") || d.includes("mist")) {
    return ["mist", "invisible"];
  }
  if (d.includes("hot") || d.includes("heat")) {
    return ["hot", "burn", "boil"];
  }
  if (d.includes("cold") || d.includes("chill") || d.includes("freezing")) {
    return ["freeze", "cold", "ice", "frost"];
  }
  if (d.includes("humid")) {
    return ["moist", "wet"];
  }
  return ["weather"]; // default
}
