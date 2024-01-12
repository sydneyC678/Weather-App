document.addEventListener("DOMContentLoaded", function () {
  const apikey =
    "https://api.weatherapi.com/v1/current.json?key=085149db143a46aab5c200918241101&q=";

  const defaultCity = "montreal"; // What we want to show

  const defaultKey =
    "https://api.weatherapi.com/v1/current.json?key=085149db143a46aab5c200918241101&q=montreal";

  // fetching data
  async function targetAPI(url) {
    try {
      const response = await fetch(url, { mode: "cors" });
      const allData = await response.json();
      return allData;
    } catch (err) {
      console.log(err);
    }
  }

  // taking all the data and returning an object with only the data we want
  function getWeatherData(data) {
    const {
      location: { name, region, country, localtime },
      current: {
        temp_c,
        is_day,
        condition: { text, icon },
        wind_kph,
        precip_mm,
        humidity,
        cloud,
        feelslike_c,
        uv,
      },
    } = data;

    const weatherData = {
      location: { name, region, country, localtime },
      current: {
        temp_c,
        is_day,
        condition: { text, icon },
        wind: {
          kph: wind_kph,
        },
        precip: { mm: precip_mm },
        humidity,
        cloud,
        feelslike: { c: feelslike_c },
        uv,
      },
    };

    return weatherData;
  }

  function displayWeather(weatherData) {
    const locationCity = document.getElementById("title-location");
    const locationRegionCountry = document.getElementById("country-title");
    const date = document.getElementById("date");
    const temperature = document.getElementById("temperature");
    const feelsLike = document.getElementById("feels-like");
    const humidity = document.getElementById("humidity");
    const windSpeed = document.getElementById("wind-speed");
    const cloud = document.getElementById("cloud");
    const precip = document.getElementById("precip");

    precip.innerHTML = `Precipitation <i class="fa-solid fa-umbrella"></i> ${weatherData.current.precip.mm}`;

    if (weatherData.current.cloud === 100) {
      cloud.innerHTML = `Cloud <br> <i class="fa-solid fa-cloud"></i> ${weatherData.current.cloud}%`;
    }
    if (weatherData.current.temp_c < weatherData.current.feelslike.c) {
      feelsLike.innerHTML = `Feels Like <br><i class="fa-solid fa-face-smile"></i> ${weatherData.current.feelslike.c}°C`;
    } else {
      feelsLike.innerHTML = `Feels Like <br><i class="fa-regular fa-face-rolling-eyes"></i> ${weatherData.current.feelslike.c}°C`;
    }

    //if time is past 7 pm but not latest 2 am add moon -> <i class="fa-solid fa-moon"></i>
    //if between 2 am and 6 pm add sun

    //if heavy rain: <i class="fa-solid fa-cloud-rain"></i>
    //<i class="fa-solid fa-umbrella"></i>

    locationCity.innerHTML = `${weatherData.location.name}`;
    locationRegionCountry.innerHTML = `${weatherData.location.region}, ${weatherData.location.country}`;
    date.innerHTML = `${weatherData.location.localtime}`;

    feelsLike.innerHTML = `Feels Like ${weatherData.current.feelslike.c}°C`;
    humidity.innerHTML = `Humidity<br> <i class="fa-solid fa-droplet"></i> ${weatherData.current.humidity}%`;
    windSpeed.innerHTML = `Wind <br><i class="fa-solid fa-wind"></i> ${weatherData.current.wind.kph} km/h`;
    // cloud.innerHTML = `Cloud: ${weatherData.current.cloud}%`;
    // Add conditions for different temperature ranges if needed

    temperature.innerHTML = `Temperature <i class="fa-solid fa-temperature-three-quarters"></i> ${weatherData.current.temp_c}°C`;
  }

  async function fetchPlusDisplay(event) {
    event.preventDefault(); // prevent the form from submitting

    const userinput = document.getElementById("location-input");
    const entercity = apikey.concat(userinput.value.trim());

    let data = "";
    let url = "";
    let weatherData = "";

    if (!userinput.value) {
      url = defaultKey;
      data = await targetAPI(url);
      weatherData = getWeatherData(data);
      displayWeather(weatherData);
    } else {
      url = entercity;
      data = await targetAPI(url);
      weatherData = getWeatherData(data);
      displayWeather(weatherData);
    }
  }

  const form = document.querySelector("form");
  form.addEventListener("submit", fetchPlusDisplay);

  // Display default weather on page load
  fetchPlusDisplay(new Event("submit"));
});
