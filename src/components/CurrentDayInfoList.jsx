import { CurrentDayInfo } from "./CurrentDayInfo";

export function CurrentDayInfoList({ forecastInfo, activeIndex }) {
  const times = [8, 14, 20];

  return times.map((time, _) => {
    return (
      <CurrentDayInfo
        key={time}
        dayTime={
          time === 8
            ? "Morning (8pm)"
            : time === 14
            ? "Day (2am)"
            : "Evening (8am)"
        }
        icon={forecastInfo.forecastday[activeIndex].hour[time].condition.icon}
        weather={
          forecastInfo.forecastday[activeIndex].hour[time].condition.text
        }
        avgTemp_c={forecastInfo.forecastday[activeIndex].hour[time].temp_c}
        windSpeed={forecastInfo.forecastday[activeIndex].hour[time].wind_kph}
        humidity={forecastInfo.forecastday[activeIndex].hour[time].humidity}
        feelLike={forecastInfo.forecastday[activeIndex].hour[time].feelslike_c}
      />
    );
  });
}
