import './Weather.css';
import SectionHeader from './SectionHeader';

const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toPrettyCelsius = (temp) => `${Math.round(temp)}°`;

const Weather = ({ data }) => {
  const now = new Date();
  const nowUnix = now.valueOf() / 1000;
  const { current, hourly, daily } = data;

  return (
    <>
      <SectionHeader label={"Weather"} />
      <div className="Weather-row">
        <div className="Weather-box">
          <div className="Weather-header">Feels like</div>
          <div className="Weather-temp">{toPrettyCelsius(current['feels_like'])}</div>
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
                  <div className="Weather-temp">{toPrettyCelsius(hour['temp'])}</div>
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
                </div>
              )
            })
        }
      </div>
    </>
  );
};

export default Weather;