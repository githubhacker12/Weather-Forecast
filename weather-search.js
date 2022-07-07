const timeEl = document.querySelector(".time");
const dateEl = document.querySelector(".date");
const currentWeatherItemsEl = document.querySelector("#current-weather-items");
const timezone = document.querySelector(".time-zone");
const countryEl = document.querySelector(".country");
const weatherForecastEl = document.querySelector(".weather-forecast");
const currentTempEl = document.querySelector("#current-temp");

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Sarturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "aaa74cb61c515b9509baf2c7bef24143";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span class="am-pm">${ampm}</span>`;
  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

weatherForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const address = search.value;
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      getWeatherData(data);
    });
});

function getWeatherData(data) {
  console.log(data);
  let { lon, lat } = data.coord;

  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      showWeatherData(data);
    });
}

function showWeatherData(data) {
  let { weather,humidity, pressure, temp, wind_speed } = data.current;

  timezone.innerHTML = data.timezone;
  countryEl.innerHTML = data.lat + "N " + data.lon + "E";

  currentWeatherItemsEl.innerHTML = `
  <div class="others">
  <div class="container">
    <div class="row  weather-items">
      <div class="col-6 weather-name">
        Weather
      </div>
      <div class="col-6 weather-num">
        ${weather[0].description.toUpperCase()}
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row  weather-items">
      <div class="col-6 weather-name">
        Temperature
      </div>
      <div class="col-6 weather-num">
        ${temp}&#176;C
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row  weather-items">
      <div class="col-6 weather-name">
        Humidity
      </div>
      <div class="col-6 weather-num">
        ${humidity}%
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row weather-items">
      <div class="col-6 weather-name">
        Pressure
      </div>
      <div class="col-6 weather-num">
        ${pressure}
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row weather-items">
      <div class="col-7 weather-name">
        Wind-speed <i class="fa-solid fa-wind"></i>
      </div>
      <div class="col-5 weather-num">
        ${wind_speed}
      </div>
    </div>
  </div>
  </div>

    `;

  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
          <div class="today">
            <img src="http://openweathermap.org/img/wn//${
              day.weather[0].icon
            }@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">Today</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
          </div>

            `;
    } else {
      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>

            `;
    }
  });

  weatherForecastEl.innerHTML = otherDayForcast;
}
