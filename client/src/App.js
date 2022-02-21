import './App.css';

import { useEffect, useState } from 'react';

import Headline from './Headline';
import SectionHeader from './SectionHeader';
import Transit from './Transit';
import Weather from './Weather';

const LAT = 40.7174923;
const LON = -73.9848778;

const App = () => {
  const [data, setData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [newsIndex, setNewsIndex] = useState(0);

  const refreshData = async () => {
    fetch('http://localhost:3000/data')
      .then((response) => response.json())
      .then(setData);
  };

  const refreshNewsData = async () => {
    fetch('https://rss.nytimes.com/services/xml/rss/nyt/US.xml')
      .then((response) => response.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/html"))
      .then((data) => {
        const items = data.querySelectorAll("item");
        const titles = [];
        items.forEach((item) => { titles.push(item.querySelector("title").innerHTML) });
        setNewsData(titles);
      });
  };

  const refreshWeatherData = async () => {
    fetch(`http://localhost:3000/weather?lat=${encodeURIComponent(LAT)}&lon=${encodeURIComponent(LON)}`,)
      .then((response) => response.json())
      .then(setWeatherData);
  };

  const refreshNewsIndex = () => {
    if (newsData === null)
      return;

    const newIndex = newsIndex + 1;
    if (newIndex >= newsData.length) {
      setNewsIndex(0);
    } else {
      setNewsIndex(newIndex);
    }
  }

  useEffect(() => {
    refreshData();
    refreshNewsData();
    refreshWeatherData();

    setInterval(refreshData, 60 * 1000);
    setInterval(refreshNewsData, 60 * 60 * 1000);
    setInterval(refreshNewsIndex, 10 * 1000);
    setInterval(refreshWeatherData, 5 * 60 * 1000);
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <Transit data={data} />
      {weatherData && <Weather data={weatherData} />}
      <SectionHeader label="NYT - US News" />
      {newsData && newsData[newsIndex] && <Headline title={newsData[newsIndex]} />}
    </div>
  );
}

export default App;
