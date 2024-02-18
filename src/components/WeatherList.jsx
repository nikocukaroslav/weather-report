import { WeatherBox } from "./WeatherBox";

export function WeatherList({ forecastInfo, setActiveIndex, start, end }) {
  return forecastInfo && forecastInfo.forecastday
    ? forecastInfo.forecastday.slice(start, end).map((day, index) => {
        return (
          <div key={index} onClick={() => setActiveIndex(index + start)}>
            <WeatherBox
              key={index}
              day={day.date}
              icon={day.day.condition.icon}
              weather={day.day.condition.text}
              maxTemp_c={day.day.maxtemp_c}
              minTemp_c={day.day.mintemp_c}
              avgTemp_c={day.day.avgtemp_c}
              windSpeed={day.day.maxwind_kph}
              humidity={day.day.avghumidity}
            />
          </div>
        );
      })
    : null;
}
