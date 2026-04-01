const apiKey = "1284a322dcb6cea1160205217c8a3dd3";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const pinBtn = document.getElementById("pinBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

let currentCity = "Mumbai";
let pinnedCities = JSON.parse(localStorage.getItem("cities")) || [];

/* CENTER */
async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await res.json();

    if (data.cod !== 200) return;

    currentCity = data.name;

    cityName.innerText = data.name;
    temperature.innerText = `${Math.round(data.main.temp)}°C`;
    description.innerText = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  } catch {
    cityName.innerText = "Error ❌";
  }
}

/* SIDEBAR */
async function getSideWeather(card, city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  );
  const data = await res.json();

  if (data.cod !== 200) return;

  card.querySelector(".side-temp").innerText = `${Math.round(data.main.temp)}°C`;
  card.querySelector(".side-icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  card.querySelector(".side-desc").innerText =
    data.weather[0].description;
}

/* MODAL + FORECAST */
async function openModal(city) {
  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);

  modalContent.innerHTML = `<p>Loading...</p>`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
    ]);

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    if (currentData.cod !== 200 || forecastData.cod !== "200") {
      modalContent.innerHTML = `<p>Error loading data</p>`;
      return;
    }

    modalContent.style.background = getWeatherBackground(forecastData.list[0].weather[0].main);

    renderForecast(currentData, forecastData.list);

  } catch {
    modalContent.innerHTML = `<p>Error ❌</p>`;
  }
}

/* RENDER FORECAST */
function renderForecast(current, list) {

  const now = new Date();

  const fullDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short"
  });

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  // every 8th item = 1 day
  const daily = list.filter((item, index) => index % 8 === 0);

  let html = `
    <h2>${current.name}</h2>

    <div class="today-card">
  <div class="today-left">
    <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png">
    <h1>${Math.round(current.main.temp)}°C</h1>
    <p>${current.weather[0].description}</p>
  </div>

  <div class="today-right">
    <h3>${fullDate}</h3>
    <h2>${time}</h2>
  </div>
</div>
    <div class="forecast">
  `;

  daily.slice(0, 5).forEach(day => {

    const date = new Date(day.dt_txt);

    const shortDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short"
    });

    html += `
      <div class="forecast-card">
        <p>${shortDate}</p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
        <p>${Math.round(day.main.temp)}°C</p>
        <p class="desc">${day.weather[0].description}</p>
      </div>
    `;
  });

  html += `</div>`;

  modalContent.innerHTML = html;
}

/* MODAL CLOSE */
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }
});

/* SIDEBAR */
function renderSidebar() {
  const slots = document.querySelectorAll(".weather-box.small");

  slots.forEach((card, index) => {
    const city = pinnedCities[index];

    if (city) {
      card.classList.remove("empty");

      card.innerHTML = `
        <button class="remove-btn">❌</button>
        <h3>${city}</h3>
        <img class="side-icon" src="">
        <p class="side-temp">--°C</p>
        <p class="side-desc">--</p>
      `;

      getSideWeather(card, city);

      card.querySelector(".remove-btn").onclick = () => {
        pinnedCities.splice(index, 1);
        save();
      };

      card.onclick = (e) => {
        if (!e.target.classList.contains("remove-btn")) {
          openModal(city);
        }
      };

    } else {
      card.classList.add("empty");
      card.innerHTML = "";
    }
  });
}

/* SAVE */
function save() {
  localStorage.setItem("cities", JSON.stringify(pinnedCities));
  renderSidebar();
}

/* PIN */
pinBtn.onclick = () => {
  if (
    !pinnedCities.includes(currentCity) &&
    pinnedCities.length < 6
  ) {
    pinnedCities.push(currentCity);
    save();
  }
};

/* SEARCH */
searchBtn.onclick = () => getWeather(cityInput.value);

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather(cityInput.value);
});

/* INIT */
getWeather("Mumbai");
renderSidebar();

const centerCard = document.getElementById("centerCard");

centerCard.addEventListener("click", (e) => {
  // Prevent click on pin button from triggering modal
  if (!e.target.classList.contains("pin-btn")) {
    openModal(currentCity);
  }
});

function getWeatherBackground(weather) {
  // ☀️ Clear
  if (weather === "Clear") {
    return "linear-gradient(135deg, #4facfe, #00f2fe)";
  }
  // ☁️ Clouds
  if (weather === "Clouds") {
    return "linear-gradient(135deg, #757f9a, #d7dde8)";
  }
  // 🌧 Rain group
  if (weather === "Rain" || weather === "Drizzle" || weather === "Thunderstorm") {
    return "linear-gradient(135deg, #2c3e50, #4ca1af)";
  }
  // ❄️ Snow
  if (weather === "Snow") {
    return "linear-gradient(135deg, #83a4d4, #b6fbff)";
  }
  // 🌫 Fog / Mist group
  if (
    weather === "Mist" ||
    weather === "Haze" ||
    weather === "Fog" ||
    weather === "Smoke" ||
    weather === "Dust" ||
    weather === "Sand" ||
    weather === "Ash"
  ) {
    return "linear-gradient(135deg, #606c88, #3f4c6b)";
  }

  // Default
  return "rgba(30, 41, 59, 0.7)";
}