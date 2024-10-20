import "./Weather.css";

import { useEffect, useState } from "react";

import SectionHeader from "./SectionHeader";

const REFRESH_RATE = 5 * 60 * 1000;
const LAT = 40.7174923;
const LON = -73.9848778;
const WEEKDAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const toPrettyCelsius = (temp) => `${Math.round(temp)}°`;

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setCurrentForecast] = useState(null);
  const now = new Date();
  const nowUnix = now.valueOf() / 1000;

  const refreshData = async () => {
    fetch(
      `http://localhost:3000/weather?lat=${encodeURIComponent(
        LAT
      )}&lon=${encodeURIComponent(LON)}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(setCurrentWeather)
      .catch(console.error);

    fetch(
      `http://localhost:3000/forecast?lat=${encodeURIComponent(
        LAT
      )}&lon=${encodeURIComponent(LON)}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(setCurrentForecast)
      .catch(console.error);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, REFRESH_RATE);
    return () => clearInterval(interval);
  }, []);

  if (!currentWeather || !forecast) {
    return null;
  }

  const hourly = [];
  const daily = [];

  return (
    <>
      <SectionHeader label={"Weather"} />
      <div className='Weather-row'>
        <div className='Weather-box'>
          <div className='Weather-header'>Feels like</div>
          <div className='Weather-temp'>
            {toPrettyCelsius(currentWeather["main"]["feels_like"])}
          </div>
          <img
            className='Weather-icon'
            src={`http://openweathermap.org/img/wn/${currentWeather["weather"][0]["icon"]}@2x.png`}
            alt={currentWeather["weather"][0]["description"]}
          />
        </div>
        {forecast["list"]
          .filter((hourly) => hourly["dt"] > nowUnix)
          .slice(1, 6)
          .map((hourly) => {
            const time = new Date(hourly["dt"] * 1000).toLocaleTimeString([], {
              timeStyle: "short",
            });
            const weather = hourly["weather"][0];
            return (
              <div key={hourly["dt"]} className='Weather-box'>
                <div className='Weather-header'>{time}</div>
                <div className='Weather-temp'>
                  {toPrettyCelsius(hourly["main"]["feels_like"])}
                </div>
                <img
                  className='Weather-icon'
                  src={`http://openweathermap.org/img/wn/${weather["icon"]}@2x.png`}
                  alt={weather["description"]}
                />
              </div>
            );
          })}
      </div>
      <div className='Weather-row'>
        {daily.slice(0, 5).map((day) => {
          const date = new Date(day["dt"] * 1000);
          const weather = day["weather"][0];

          return (
            <div key={day["dt"]} className='Weather-box'>
              <div className='Weather-header'>{WEEKDAY[date.getDay()]}</div>
              <div className='Weather-minMax'>
                {toPrettyCelsius(day["temp"]["min"])}/
                {toPrettyCelsius(day["temp"]["max"])}
              </div>
              <img
                className='Weather-icon'
                src={`http://openweathermap.org/img/wn/${weather["icon"]}@2x.png`}
                alt={weather["description"]}
              />
              <div className='Weather-precipitation'>
                Precipitation {Math.round(day["pop"] * 100)}%
              </div>
              {day["rain"] && (
                <div className='Weather-precipitation'>
                  Rain {day["rain"]}mm
                </div>
              )}
              {day["snow"] && (
                <div className='Weather-precipitation'>
                  Snow {day["snow"]}mm
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Weather;
