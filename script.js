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
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
  const data = await res.json();

  if (data.cod !== 200) return;

  currentCity = data.name;

  cityName.innerText = data.name;
  temperature.innerText = `${Math.round(data.main.temp)}°C`;
  description.innerText = data.weather[0].description;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

/* SIDE */
async function getSideWeather(card, city) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
  const data = await res.json();

  if (data.cod !== 200) return;

  card.querySelector(".side-temp").innerText = `${Math.round(data.main.temp)}°C`;
  card.querySelector(".side-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  card.querySelector(".side-desc").innerText = data.weather[0].description;
}

/* MODAL */
function openModal(city) {
  modal.classList.remove("hidden");
  modalContent.innerHTML = `<h2>${city}</h2><p>Loading forecast...</p>`;
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

/* RENDER */
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
  if (!pinnedCities.includes(currentCity) && pinnedCities.length < 6) {
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