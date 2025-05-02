// Selectores
const searchInput = document.querySelector("#input-country");
const countries = document.querySelector(".countries-info");
const weatherIcon = document.querySelector(".weather-icon");
const alertMsg = document.querySelector(".alert-msg");

// evento
searchInput.addEventListener("input", async (e) => {
  // trim elimina los espacion en blanco en los extremos del value del input
  const query = searchInput.value.trim();

  // si el input está vacio
  if (query === "") {
    countries.innerHTML = "";
    document.querySelector(".information").style.display = "none";
    document.querySelector("#img-png").style.display = "block";
    alertMsg.style.display = "none";
    return;
  }

  // apis
  const apiCountries = `https://restcountries.com/v3.1/name/${query}`;
  const apiWeather =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
  const apiKeyWeather = "13d7fc1692a6de862a52dc7f824a0fb6";

  try {
    const responseCountries = await fetch(apiCountries);
    const dataCountries = await responseCountries.json();

    // Demasiados resultados
    if (dataCountries.length > 10) {
      alertMsg.innerHTML =
        "<p>Too many results. Please refine your search.</p>";
      document.querySelector(".information").style.display = "none";
      alertMsg.style.display = "block";
      return;
    }

    // Lista de países (entre 2 y 10)
    if (dataCountries.length > 1 && dataCountries.length <= 10) {
      alertMsg.style.display = "none";
      countries.innerHTML = dataCountries
        .map(
          (country) => `
            <div class="country-item">
              <img src="${country.flags.png}" alt="Bandera de ${country.name.common}" width="40" />
              <span>${country.name.common}</span>
            </div>
          `
        )
        .join("");
      document.querySelector(".information").style.display = "none";
      return;
    }

    // Solo 1 país encontrado
    const country = dataCountries[0];

    // Datos del país
    const nameCountry = country.name.common;
    const flagCountry = country.flags.png;
    const poblationCountry = country.population;
    const continentCountry = country.continents[0];
    const zoneCountry = country.timezones.join(", ");
    const capitalCountry = country.capital ? country.capital[0] : "N/A";

    // Clima
    const responseWeather = await fetch(
      apiWeather + capitalCountry + `&appid=${apiKeyWeather}`
    );
    const dataWeather = await responseWeather.json();

    const temperatura = dataWeather.main?.temp ?? "N/A";
    const clima = dataWeather.weather?.[0]?.main ?? "N/A";

    countries.innerHTML = `
      <h1 id="country">${nameCountry}</h1>
      <img src=${flagCountry} />
      <div id="details">
        <p>Capital: <span>${capitalCountry}</span></p>
        <p>Población: <span>${poblationCountry.toLocaleString()}</span></p>
        <p>Continente: <span>${continentCountry}</span></p>
        <p>Zona Horaria: <span>${zoneCountry}</span></p>
      </div>
    `;

    document.querySelector(".temp").innerHTML = Math.round(temperatura) + "°C";
    document.querySelector(".clima-state").innerHTML = clima;

    // cambio icono
    if (dataWeather.weather[0].main == "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (dataWeather.weather[0].main == "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (dataWeather.weather[0].main == "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    } else if (dataWeather.weather[0].main == "Mist") {
      weatherIcon.src = "images/mist.png";
    } else if (dataWeather.weather[0].main == "Clear") {
      weatherIcon.src = "images/clear.png";
    }

    document.querySelector(".information").style.display = "block";
    document.querySelector("#img-png").style.display = "none";
    alertMsg.style.display = "none";
  } catch (error) {
    console.error("Error obteniendo datos: ", error);
    alertMsg.innerHTML =
      "<p>The country was not found or there was an error in the search.</p>";
    document.querySelector(".information").style.display = "none";
    alertMsg.style.display = "block";
  }
});
