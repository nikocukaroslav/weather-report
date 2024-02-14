import { CurrentDayInfo } from "./CurrentDayInfo";

export function CurrentDayInfoList({ forecastInfo }) {
  const times = [8, 14, 20];
  return forecastInfo && forecastInfo.forecastday
    ? forecastInfo.forecastday.map((day, index) => {
        return times.map((time, timeIndex) => {
          return (
            <CurrentDayInfo
              key={index * 10 + timeIndex}
              dayTime={
                time === 8
                  ? "Morning(8pm)"
                  : time === 14
                  ? "Day(14am)"
                  : "Evening(20am)"
              }
              icon={day.hour[time].condition.icon}
              weather={day.hour[time].condition.text}
              avgTemp_c={day.hour[time].temp_c}
              windSpeed={day.hour[time].wind_kph}
              humidity={day.hour[time].humidity}
              feelLike={day.hour[time].feelslike_c}
            />
          );
        });
      })
    : null;
}
