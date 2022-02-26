import './Weather.css';

import { useEffect, useState } from 'react';

import SectionHeader from './SectionHeader';

const LAT = 40.7174923;
const LON = -73.9848778;
const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toPrettyCelsius = (temp) => `${Math.round(temp)}°`;

const Weather = () => {
  const [data, setData] = useState(null);
  const now = new Date();
  const nowUnix = now.valueOf() / 1000;

  const refreshData = async () => {
    fetch(`http://localhost:3000/weather?lat=${encodeURIComponent(LAT)}&lon=${encodeURIComponent(LON)}`,)
      .then((response) => response.json())
      .then(setData)
      .catch(console.error)
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return null;
  }

  const { current, hourly, daily } = data;

  return (
    <>
      <SectionHeader label={"Weather"} />
      <div className="Weather-row">
        <div className="Weather-box">
          <div className="Weather-header">Feels like</div>
          <div className="Weather-temp">{toPrettyCelsius(current['feels_like'])}</div>
          <img className="Weather-icon" src={`http://openweathermap.org/img/wn/${current['weather'][0]['icon']}@2x.png`} alt={current['weather'][0]['description']} />
        </div>
        {
          hourly
            .filter((h) => h['dt'] > nowUnix)
            .filter((h, i) => i % 3 === 0)
            .slice(0, 5)
            .map((hour) => {
              const time = new Date(hour['dt'] * 1000).toLocaleTimeString([], { timeStyle: 'short' });
              const weather = hour['weather'][0];
              return (
                <div key={hour['dt']} className="Weather-box">
                  <div className="Weather-header">{time}</div>
                  <div className="Weather-temp">{toPrettyCelsius(hour['feels_like'])}</div>
                  <img className="Weather-icon" src={`http://openweathermap.org/img/wn/${weather['icon']}@2x.png`} alt={weather['description']} />
                </div>
              );
            })
        }
      </div>
      <div className="Weather-row">
        {
          daily
            .slice(0, 5)
            .map((day) => {
              const date = new Date(day['dt'] * 1000);
              const weather = day['weather'][0];

              return (
                <div key={day['dt']} className="Weather-box">
                  <div className="Weather-header">{WEEKDAY[date.getDay()]}</div>
                  <div className="Weather-minMax">{toPrettyCelsius(day['temp']['min'])}/{toPrettyCelsius(day['temp']['max'])}</div>
                  <img className="Weather-icon" src={`http://openweathermap.org/img/wn/${weather['icon']}@2x.png`} alt={weather['description']} />
                  <div className="Weather-precipitation">Precipitation {day['pop'] * 100}%</div>
                  {day['rain'] && <div className="Weather-precipitation">Rain {day['rain']}mm</div>}
                  {day['snow'] && <div className="Weather-precipitation">Snow {day['snow']}mm</div>}
                </div>
              )
            })
        }
      </div>
    </>
  );
};

export default Weather;