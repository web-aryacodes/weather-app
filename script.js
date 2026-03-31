const apiKey = "1284a322dcb6cea1160205217c8a3dd3";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");

/* CENTER WEATHER */
async function getWeather(city) {
  try {
    cityName.innerText = "Loading...";
    temperature.innerText = "--°C";
    description.innerText = "";
    weatherIcon.src = "";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      cityName.innerText = "City not found ❌";
      description.innerText = "Try again";
      return;
    }

    cityName.innerText = data.name;
    temperature.innerText = `${Math.round(data.main.temp)}°C`;
    description.innerText = data.weather[0].description;

    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  } catch (error) {
    cityName.innerText = "Error ❌";
    description.innerText = "Something went wrong";
  }
}

/* SIDE WEATHER */
async function getSideWeather(card, city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) return;

    const temp = card.querySelector(".side-temp");
    const icon = card.querySelector(".side-icon");

    temp.innerText = `${Math.round(data.main.temp)}°C`;
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  } catch (error) {
    console.error(error);
  }
}

/* LOAD SIDEBARS */
const cityCards = document.querySelectorAll(".weather-box.small");

cityCards.forEach(card => {
  const city = card.getAttribute("data-city");
  getSideWeather(card, city);
});

/* SEARCH */
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    getWeather(city);
  }
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city !== "") {
      getWeather(city);
    }
  }
});

/* DEFAULT CENTER */
getWeather("Mumbai");