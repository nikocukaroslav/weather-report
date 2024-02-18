import { useEffect, useRef, useState } from "react";
import { WeatherList } from "./components/WeatherList";
import { CurrentDayInfoList } from "./components/CurrentDayInfoList";
import { BackButton } from "./components/BackButton";
import { Input } from "./components/Input";
import { Loading } from "./components/Loading";
import { Error } from "./components/Error";
import { ScrolleButtons } from "./components/ScrolleButtons";

function App() {
  const [forecastInfo, setForecastInfo] = useState(null);
  const [city, setCity] = useState("Житомир");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(3);

  const debounceRef = useRef(null);

  function HandleDaysCountPlus() {
    if (end < 8) {
      setStart((s) => s + 1);
      setEnd((e) => e + 1);
    }
  }

  function HandleDaysCountMinus() {
    if (start > 0) {
      setStart((s) => s - 1);
      setEnd((e) => e - 1);
    }
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function weather() {
        try {
          setLoading(true);
          const res = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=f38c6a4ab8c24e0aa8a144634241202&q=${city}&aqi=no&days=8`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            setError("Can't find that city");
          }
          const data = await res.json();
          setForecastInfo(data.forecast);
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
          console.log(err.name);
        } finally {
          setLoading(false);
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
      {!forecastInfo && <WeatherBoxPlaceHolder />}

      {activeIndex === null ? (
        <WeatherList
          start={start}
          end={end}
          forecastInfo={forecastInfo}
          setActiveIndex={setActiveIndex}
          HandleDaysCountPlus={HandleDaysCountPlus}
          HandleDaysCountMinus={HandleDaysCountMinus}
        />
      ) : (
        <CurrentDayInfoList
          forecastInfo={forecastInfo}
          activeIndex={activeIndex}
        />
      )}
      {activeIndex === null && !loading && !error && forecastInfo && (
        <ScrolleButtons
          end={end}
          HandleDaysCountPlus={HandleDaysCountPlus}
          HandleDaysCountMinus={HandleDaysCountMinus}
        />
      )}
    </div>
  );
}

function WeatherBoxPlaceHolder() {
  return <div className="placeholder"></div>;
}

export default App;
