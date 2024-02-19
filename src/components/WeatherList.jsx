import { WeatherBox } from "./WeatherBox";
import { Fade } from "react-awesome-reveal";
import FlipMove from "react-flip-move";

export function WeatherList({ forecastInfo, setActiveIndex, start, end }) {
  return forecastInfo && forecastInfo.forecastday ? (
    <FlipMove className="weather-box-container-list">
      {forecastInfo.forecastday.slice(start, end).map((day, index) => {
        return (
          <div key={day.date} onClick={() => setActiveIndex(index + start)}>
            <Fade delay={index * 100}>
              <WeatherBox
                day={day.date}
                icon={day.day.condition.icon}
                weather={day.day.condition.text}
                maxTemp_c={day.day.maxtemp_c}
                minTemp_c={day.day.mintemp_c}
                avgTemp_c={day.day.avgtemp_c}
                windSpeed={day.day.maxwind_kph}
                humidity={day.day.avghumidity}
              />
            </Fade>
          </div>
        );
      })}
    </FlipMove>
  ) : null;
}
