import { useEffect, useRef, useState } from "react";
import { WeatherList } from "./WeatherList";
import { CurrentDayInfoList } from "./CurrentDayInfoList";
import { BackButton } from "./BackButton";
import { Input } from "./Input";
import { Loading } from "./Loading";
import { Error } from "./Error";
import { ScrolleButtons } from "./ScrolleButtons";
import { useSwipeable } from "react-swipeable";
import { WeatherBoxPlaceHolder } from "./WeatherBoxPlaceHolder";
import { ChooseTheme } from "./ChooseTheme";
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

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

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
            `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&aqi=no&days=8`,
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
        localStorage.setItem("city", city);
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

  useEffect(function () {
    const savedCity = localStorage.getItem("city");
    if (savedCity) {
      setCity(savedCity);
    }
  }, []);

  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }

  const handlers = useSwipeable(
    forecastInfo?.forecastday?.length > 3 && {
      onSwipedUp: HandleDaysCountPlus,
      onSwipedDown: HandleDaysCountMinus,
      preventDefaultTouchmoveEvent: true,
      trackMouse: true,
    }
  );

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
        {activeIndex === null ? (
          <div {...handlers}>
            {!forecastInfo && <WeatherBoxPlaceHolder />}
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
        {activeIndex === null &&
          !loading &&
          !error &&
          forecastInfo &&
          forecastInfo.forecastday.length > 3 && (
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
