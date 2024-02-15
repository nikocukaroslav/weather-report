import { useEffect, useRef, useState } from "react";
import { WeatherList } from "./components/WeatherList";
import { CurrentDayInfoList } from "./components/CurrentDayInfoList";

function App() {
  const [forecastInfo, setForecastInfo] = useState("");
  const [city, setCity] = useState("Житомир");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debounceRef = useRef(null);

  function HandleActive() {
    setActive(!active);
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function weather() {
        try {
          setLoading(true);
          const res = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=f38c6a4ab8c24e0aa8a144634241202&q=${city}&aqi=no&days=3`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setForecastInfo(data.forecast);
          console.log(data.location.name);
        } catch (err) {
          if (err.name === "AbortError") setLoading(true);
          if (err.name === "TypeError") {
            setError("We can't find that city...");
          } else setLoading(true);
          console.log(err.name);
        } finally {
          setLoading(false);
        }
        if (city.length < 3) {
          setError("Choose city to see info →");
          return;
        }
      }

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        weather();
        setError("");
      }, 500);

      return function () {
        controller.abort();
      };
    },
    [city]
  );

  return (
    <div className="weather-box-container">
      <div className="navigation">
        {error ? <Error error={error} /> : <WeatherList />}
        {loading && !error ? <Loading /> : <WeatherList />}
        {!active && <BackButton HandleActive={HandleActive} />}
        {active && <Input setCity={setCity} city={city} />}
      </div>
      {!active && (
        <CurrentDayInfoList
          forecastInfo={forecastInfo}
          HandleActive={HandleActive}
        />
      )}
      {active && !loading && (
        <WeatherList forecastInfo={forecastInfo} HandleActive={HandleActive} />
      )}
    </div>
  );
}

function Loading() {
  return <span className="loading">Loading...</span>;
}
function Error({ error }) {
  return <span className="loading">{error}</span>;
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
