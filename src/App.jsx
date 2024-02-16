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
  const [daysCount, setDaysCount] = useState([3]);
  const debounceRef = useRef(null);

  function HandleDaysCountPlus(day) {
    setDaysCount(() => daysCount + 1);
  }

  function HandleDaysCountMinus(day) {
    setDaysCount(() => daysCount - 1);
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function weather() {
        try {
          setLoading(true);
          const res = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=f38c6a4ab8c24e0aa8a144634241202&q=${city}&aqi=no&days=${daysCount}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setForecastInfo(data.forecast);
          console.log(data);
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
    [city, daysCount]
  );

  return (
    <div className="weather-box-container">
      {activeIndex === null && (
        <ScrolleButtons
          HandleDaysCountPlus={HandleDaysCountPlus}
          HandleDaysCountMinus={HandleDaysCountMinus}
        />
      )}
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

function ScrolleButtons({ HandleDaysCountPlus, HandleDaysCountMinus }) {
  return (
    <div className="scrolle-buttons">
      <span style={{ paddingRight: "0.4rem" }} onClick={HandleDaysCountMinus}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
          />
        </svg>
      </span>
      <span style={{ paddingLeft: "0.4rem" }} onClick={HandleDaysCountPlus}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
          />
        </svg>
      </span>
    </div>
  );
}
export default App;
