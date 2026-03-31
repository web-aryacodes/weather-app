const apiKey = "1284a322dcb6cea1160205217c8a3dd3";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");

// 👉 Click search
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    getWeather(city);
  }
});

// 👉 Press Enter
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city !== "") {
      getWeather(city);
    }
  }
});

async function getWeather(city) {
  try {
    // 👉 Show loading
    cityName.innerText = "Loading...";
    temperature.innerText = "--°C";
    description.innerText = "";
    weatherIcon.src = "";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    // ❌ If city not found
    if (data.cod === "404") {
      cityName.innerText = "City not found ❌";
      temperature.innerText = "--°C";
      description.innerText = "Try another city";
      return;
    }

    // ✅ Update UI
    cityName.innerText = data.name;
    temperature.innerText = `${Math.round(data.main.temp)}°C`;
    description.innerText = data.weather[0].description;

    const icon = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  } catch (error) {
    cityName.innerText = "Error ❌";
    description.innerText = "Something went wrong";
    console.error(error);
  }
}