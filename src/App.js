import { useEffect, useRef, useState } from "react";
import { WeatherList } from "./components/WeatherList";
import { CurrentDayInfoList } from "./components/CurrentDayInfoList";
import { BackButton } from "./components/BackButton";
import { Input } from "./components/Input";
import { Loading } from "./components/Loading";
import { Error } from "./components/Error";

function App() {
  const [forecastInfo, setForecastInfo] = useState("");
  const [city, setCity] = useState("Житомир");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  const debounceRef = useRef(null);

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
        {error ? <Error error={error} /> : null}
        {loading && !error ? <Loading /> : null}
        {activeIndex !== null && <BackButton setActiveIndex={setActiveIndex} />}
        {activeIndex === null && <Input setCity={setCity} city={city} />}
      </div>
      {activeIndex === null ? (
        <WeatherList
          forecastInfo={forecastInfo}
          setActiveIndex={setActiveIndex}
        />
      ) : (
        <CurrentDayInfoList
          forecastInfo={forecastInfo}
          activeIndex={activeIndex}
        />
      )}
    </div>
  );
}
export default App;
