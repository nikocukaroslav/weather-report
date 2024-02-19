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
import { ChooseTheme } from "./components/ChooseTheme";
import { Fade } from "react-awesome-reveal";

function App() {
  const [forecastInfo, setForecastInfo] = useState(null);
  const [city, setCity] = useState("Житомир");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(3);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const debounceRef = useRef(null);

  function HandleDaysCountPlus() {
    if (end < 8 && !isButtonDisabled) {
      setIsButtonDisabled(true);
      setStart((s) => s + 1);
      setEnd((e) => e + 1);
      setTimeout(() => setIsButtonDisabled(false), 350);
    }
  }

  function HandleDaysCountMinus() {
    if (start > 0 && !isButtonDisabled) {
      setIsButtonDisabled(true);
      setStart((s) => s - 1);
      setEnd((e) => e - 1);
      setTimeout(() => setIsButtonDisabled(false), 350);
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
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <Fade delay={1 * 100}>
      <div className="weather-box-container">
        <div className="navigation">
          {error ? <Error error={error} /> : null}
          {loading && !error ? <Loading /> : null}
          {activeIndex !== null && (
            <BackButton setActiveIndex={setActiveIndex} />
          )}
          {activeIndex === null && <Input setCity={setCity} city={city} />}
        </div>
        {!forecastInfo && <WeatherBoxPlaceHolder />}

        {activeIndex === null ? (
          <div {...handlers}>
            <WeatherList
              start={start}
              end={end}
              forecastInfo={forecastInfo}
              setActiveIndex={setActiveIndex}
            />
          </div>
        ) : (
          <div className="weather-box-container-list">
            <CurrentDayInfoList
              forecastInfo={forecastInfo}
              activeIndex={activeIndex}
            />
          </div>
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
    </Fade>
  );
}

export default App;
