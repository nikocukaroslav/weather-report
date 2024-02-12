import { useEffect, useState } from "react";

function App() {
  const [day, setDay] = useState("");
  const [city, setCity] = useState("Житомир");
  const [temp_c, setTemp_c] = useState("");
  const [weather, setWeather] = useState("");
  const [icon, setIcon] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [humidity, setHumidity] = useState("");
  useEffect(
    function () {
      async function weather() {
        const res = await fetch(
          `http://api.weatherapi.com/v1/forecast.json?key=f38c6a4ab8c24e0aa8a144634241202&q=${city}&aqi=no&days=7`
        );
        const data = await res.json();
        setCity(data.location.name);
        setWeather(data.current.condition.text);
        setIcon(data.current.condition.icon);
        setTemp_c(data.current.temp_c);
        setWindSpeed(data.current.wind_mph);
        setHumidity(data.current.humidity);
        setDay(data.forecast.forecastday[1].date);
        console.log(data);
      }
      weather();
    },
    [temp_c, city]
  );
  return (
    <div className="weather-box">
      <ActiveWeatherBox
        city={city}
        icon={icon}
        weather={weather}
        temp_c={temp_c}
        windSpeed={windSpeed}
        humidity={humidity}
      />

      <WeatherList day={day} icon={icon} />
    </div>
  );
}

function WeatherBox({ day, icon }) {
  return (
    <div className="weather-list-item">
      <h3>{day}</h3>
      <img src={`${icon}`} alt="weather-icon" />
    </div>
  );
}

function WeatherList({ day, icon }) {
  return (
    <ul>
      <WeatherBox day={day} icon={icon} />
    </ul>
  );
}

/*  setWeather(data.forecast.forecastday[0].day.condition.text);*/
function ActiveWeatherBox({
  city,
  icon,
  weather,
  temp_c,
  windSpeed,
  humidity,
}) {
  return (
    <main>
      <h2>Today in {city}</h2>
      <div className="weather-info">
        <div>
          <div className="weather-icon-container">
            <img src={`${icon}`} alt="weather-icon" className="weather-icon" />
            <p>{weather}</p>
          </div>
        </div>
        <ul className="weather-info-list">
          <li>
            Temperature: <span>{temp_c}°C</span>
          </li>
          <li>
            Wind speed: <span>{windSpeed} mph</span>
          </li>
          <li>
            Humidity: <span>{humidity}%</span>
          </li>
        </ul>
      </div>
    </main>
  );
}

export default App;
