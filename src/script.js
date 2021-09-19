function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiKey = "56a5727662e9674f972770adf6f30527";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayCurrentData);
}

function displayNewCity(event) {
  event.preventDefault();
  let newCity = document.querySelector("#new-city").value;

  let searchInput = newCity.split(" ");
  for (let i = 0; i < searchInput.length; i++) {
    searchInput[i] = searchInput[i][0].toUpperCase() + searchInput[i].substr(1);
  }
  let city = searchInput.join(" ");

  let weatherCityHeader = document.querySelector("#weather-city");
  weatherCityHeader.innerHTML = `${city}`;
}

function displayCurrentTime() {
  let now = new Date();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[now.getDay()];
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (hours > 12) {
    hours = `${hours - 12}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let currentTime = `${day} ${hours}:${minutes}`;
  let searchTime = document.querySelector("#current-time");
  searchTime.innerHTML = `${currentTime}`;
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#new-city");
  search(cityInputElement.value);
}

function search(city) {
  let apiKey = "56a5727662e9674f972770adf6f30527";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayCurrentData);
}

function displayCurrentData(response) {
  //console.log(response.data);

  let currentTemp = Math.round(response.data.main.temp);
  let temperature = document.querySelector("#current-temp");
  temperature.innerHTML = `${currentTemp}`;

  let currentLow = Math.round(response.data.main.temp_min);
  let lowTemp = document.querySelector("#current-low");
  lowTemp.innerHTML = `${currentLow}`;

  let currentHigh = Math.round(response.data.main.temp_max);
  let highTemp = document.querySelector("#current-high");
  highTemp.innerHTML = `${currentHigh}`;

  let currentCity = `${response.data.name}`;
  //To add country, change to let currentCity = `${response.data.name}, ${response.data.sys.country}`;
  let weatherCityHeader = document.querySelector("#weather-city");
  weatherCityHeader.innerHTML = `${currentCity}`;

  fahrenheitTemperature = response.data.main.temp;
  fahrenheitLowTemp = response.data.main.temp_min;
  fahrenheitHighTemp = response.data.main.temp_max;
  fahrenheitFeelsLikeTemp = response.data.main.feels_like;

  let iconElement = document.querySelector(".current-emoji");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  let description = response.data.weather[0].description;
  let descriptionInput = description.split(" ");
  for (let i = 0; i < descriptionInput.length; i++) {
    descriptionInput[i] =
      descriptionInput[i][0].toUpperCase() + descriptionInput[i].substr(1);
  }
  let newDescription = descriptionInput.join(" ");
  let currentDescription = document.querySelector("#weather-description");
  currentDescription.innerHTML = `${newDescription}`;

  let feelsLike = Math.round(response.data.main.feels_like);
  let currentFeelsLike = document.querySelector("#feels-like");
  currentFeelsLike.innerHTML = `${feelsLike}`;

  let wind = Math.round(response.data.wind.speed);
  let currentWind = document.querySelector("#wind");
  currentWind.innerHTML = `${wind} mph Wind`;

  let humidity = response.data.main.humidity;
  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = `${humidity}% Humidity`;

  getForecast(response.data.coord);
}

function convertToCelsius(event) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#current-temp");
  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  let fahrenheitLowElement = document.querySelector("#current-low");
  let celsiusLowTemp = ((fahrenheitLowTemp - 32) * 5) / 9;
  fahrenheitLowElement.innerHTML = Math.round(celsiusLowTemp);

  let fahrenheitHighElement = document.querySelector("#current-high");
  let celsiusHighTemp = ((fahrenheitHighTemp - 32) * 5) / 9;
  fahrenheitHighElement.innerHTML = Math.round(celsiusHighTemp);

  let fahrenheitFeelsLikeElement = document.querySelector("#feels-like");
  let celsiusFeelsLikeTemp = ((fahrenheitFeelsLikeTemp - 32) * 5) / 9;
  fahrenheitFeelsLikeElement.innerHTML = Math.round(celsiusFeelsLikeTemp);
}

function convertToFahrenheit(event) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let lowTempElement = document.querySelector("#current-low");
  lowTempElement.innerHTML = Math.round(fahrenheitLowTemp);

  let highTempElement = document.querySelector("#current-high");
  highTempElement.innerHTML = Math.round(fahrenheitHighTemp);

  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = Math.round(fahrenheitFeelsLikeTemp);
}

function getForecast(coordinates) {
  let apiKey = "56a5727662e9674f972770adf6f30527";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row justify-content-center" id="forecast">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col">        
              <h4>
                ${formatForecastDay(forecastDay.dt)}
              </h4>
              <p>
                <div class="forecast-temps">
                  <span id="forecast-low">
                    ${Math.round(forecastDay.temp.min)}ºF
                  </span>
                   / 
                  <span id="forecast-high">
                    ${Math.round(forecastDay.temp.max)}ºF
                  </span>
                </div>
                <div class="forecast-description">
                  ${forecastDay.weather[0].main}
                </div>
                <div class="forecast-icon">
                  <img src="https://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png" alt="" width="50"/>
                </div>
              </p>
            </div>`;
    }

    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
  });
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

let form = document.querySelector("#new-city-search");
form.addEventListener("submit", handleSubmit);

let useCurrentLocation = document.querySelector("button");
useCurrentLocation.addEventListener("click", getPosition);
useCurrentLocation.addEventListener("click", displayCurrentTime);

let fahrenheitTemperature = null;
let fahrenheitLowTemp = null;
let fahrenheitHighTemp = null;
let fahrenheitFeelsLikeTemp = null;

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

displayCurrentTime();

search("New York");
