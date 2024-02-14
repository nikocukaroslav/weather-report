import { useEffect, useState } from "react";
import { WeatherList } from "./components/WeatherList";
import { CurrentDayInfoList } from "./components/CurrentDayInfoList";

function App() {
  const [forecastInfo, setForecastInfo] = useState("");
  const [city, setCity] = useState("Житомир");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  function HandleActive() {
    setActive(!active);
  }

  useEffect(
    function () {
      async function weather() {
        try {
          const res = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=f38c6a4ab8c24e0aa8a144634241202&q=${city}&aqi=no&days=3`
          );
          const data = await res.json();
          setForecastInfo(data.forecast);
          console.log(data.location.name);
        } catch (err) {
          console.log(err);
        }
      }
      weather();
    },
    [city]
  );

  return (
    <div className="weather-box-container">
      <div className="navigation">
        {!active && <BackButton HandleActive={HandleActive} />}
        {active && <Input setCity={setCity} city={city} />}
      </div>
      {!active && (
        <CurrentDayInfoList
          forecastInfo={forecastInfo}
          HandleActive={HandleActive}
        />
      )}
      {active && (
        <WeatherList forecastInfo={forecastInfo} HandleActive={HandleActive} />
      )}
    </div>
  );
}

function Input({ setCity, city }) {
  return (
    <div className="choose-city">
      <label>Choose your city</label>
      <input
        type="text"
        className="choose-city-input"
        value={city}
        placeholder="New York"
        onChange={(e) => setCity(e.target.value)}
      />
    </div>
  );
}

function BackButton({ HandleActive }) {
  return (
    <button className="button" onClick={HandleActive}>
      &larr; Back
    </button>
  );
}
export default App;
