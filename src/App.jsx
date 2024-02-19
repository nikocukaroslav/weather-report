import { useEffect, useRef, useState } from "react";
import { WeatherList } from "./components/WeatherList";
import { CurrentDayInfoList } from "./components/CurrentDayInfoList";
import { BackButton } from "./components/BackButton";
import { Input } from "./components/Input";
import { Loading } from "./components/Loading";
import { Error } from "./components/Error";
import { ScrolleButtons } from "./components/ScrolleButtons";
import { useSwipeable } from "react-swipeable";
import { WeatherBoxPlaceHolder } from "./components/WeatherBoxPlaceHolder";

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

  const handlers = useSwipeable({
    onSwipedUp: HandleDaysCountPlus,
    onSwipedDown: HandleDaysCountMinus,
  });

  return (
    <div className="weather-box-container" {...handlers}>
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
      <ChooseTheme />
    </div>
  );
}

function ChooseTheme() {
  function changeTheme(theme) {
    const root = document.documentElement;

    if (theme === "purple") {
      root.style.setProperty("--main-color", "#7048e8");
      root.style.setProperty("--second-color", "#6741d9");
      root.style.setProperty("--third-color", "#d0bfff");
      root.style.setProperty("--text-color", "#e5dbff");
      root.style.setProperty("--gradient-body-1", "#9775fa");
      root.style.setProperty("--gradient-body-2", "#b197fc");
      root.style.setProperty("--gradient-box-1", "#5f3dc4");
      root.style.setProperty("--gradient-box-2", "#7048e8");
    } else if (theme === "blue") {
      root.style.setProperty("--main-color", "#1c7ed6");
      root.style.setProperty("--second-color", "#1864ab");
      root.style.setProperty("--third-color", "#a5d8ff");
      root.style.setProperty("--text-color", "#e7f5ff");
      root.style.setProperty("--gradient-body-1", "#339af0");
      root.style.setProperty("--gradient-body-2", "#74c0fc");
      root.style.setProperty("--gradient-box-1", "#1864ab");
      root.style.setProperty("--gradient-box-2", "#1c7ed6");
    } else if (theme === "gray") {
      root.style.setProperty("--main-color", "#686f76");
      root.style.setProperty("--second-color", "#4b535c");
      root.style.setProperty("--third-color", "#ced4da");
      root.style.setProperty("--text-color", "#f8f9fa");
      root.style.setProperty("--gradient-body-1", "#868e96");
      root.style.setProperty("--gradient-body-2", "#adb5bd");
      root.style.setProperty("--gradient-box-1", "#4b535c");
      root.style.setProperty("--gradient-box-2", "#686f76");
    }
    if (theme === "gray") {
      root.style.setProperty("--main-filter", "grayscale(100%)");
    } else {
      root.style.setProperty("--main-filter", "blur(5px)");
    }
    localStorage.setItem("theme", theme);
  }

  useEffect(function () {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      changeTheme(savedTheme);
    }
  }, []);

  return (
    <div className="color-theme">
      <span>Choose your color-theme:</span>
      <ul className="color-circles">
        <li>
          <button
            className="purple-theme color-circle"
            onClick={() => changeTheme("purple")}
          ></button>
        </li>
        <li>
          <button
            className="blue-theme color-circle"
            onClick={() => changeTheme("blue")}
          ></button>
        </li>
        <li>
          <button
            className="gray-theme color-circle"
            onClick={() => changeTheme("gray")}
          ></button>
        </li>
      </ul>
    </div>
  );
}

export default App;
