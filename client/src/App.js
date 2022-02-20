import './App.css';

import { useEffect, useState } from 'react';

import Headline from './Headline';
import SectionHeader from './SectionHeader';
import TrainArrival from './TrainArrival';

const App = () => {
  const [data, setData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [newsIndex, setNewsIndex] = useState(0);

  const now = new Date();
  const unixNow = Math.round(now.valueOf() / 1000);

  const refreshData = async () => {
    fetch('http://localhost:3000/data')
      .then((response) => response.json())
      .then((response) => {
        setData(response);
      });
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

    setInterval(refreshData, 60 * 1000);
    setInterval(refreshNewsData, 60 * 60 * 1000);
    setInterval(refreshNewsIndex, 10 * 1000);
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  const { stopTimeUpdates, stations } = data;
  const stopNames = [... new Set(Object.keys(stations).map((stationId) => stations[stationId]['Stop Name']))];

  return (
    <div className="App">
      <SectionHeader label={stopNames.join(', ')} />
      {
        Object.keys(stopTimeUpdates)
          .sort().map((stop) => {
            const updates = stopTimeUpdates[stop];
            const station = stations[stop.substring(0, 3)];
            const direction = stop.charAt(stop.length - 1);

            const directionLabel = direction === 'N' ? station['North Direction Label'] : station['South Direction Label'];

            const routeUpdates = updates
              .filter((update) => update.arrivalTime >= unixNow && update.arrivalTime <= unixNow + 60 * 30)
              .reduce((group, update) => {
                const { routeId } = update;

                return {
                  ...group,
                  [routeId]: [
                    ...(group[routeId] ?? []),
                    update,
                  ],
                }
              }, {})

            return (
              <div key={stop}>
                {
                  Object
                    .keys(routeUpdates)
                    .sort()
                    .map((routeId) =>
                      <TrainArrival
                        key={`${direction}-${routeId}`}
                        route={routeId}
                        label={directionLabel}
                        now={now}
                        arrivalTimes={routeUpdates[routeId].map((update) => update.arrivalTime)}
                      />
                    )
                }
              </div>
            );
          })
      }
      <SectionHeader label="Weather" />
      <SectionHeader label="NYT - US News" />
      {newsData && newsData[newsIndex] && <Headline title={newsData[newsIndex]} />}
    </div>
  );
}

export default App;
