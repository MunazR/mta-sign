import './App.css';

import { useEffect, useState } from 'react';

import Direction from './Direction';
import TrainArrival from './TrainArrival';

const App = () => {
  const [data, setData] = useState(null);
  const now = new Date();

  const refreshData = async () => {
    fetch('http://localhost:3000/data')
      .then((response) => response.json())
      .then((response) => {
        setData(response);
      });
  };

  useEffect(() => {
    refreshData();
    setInterval(refreshData, 60 * 1000)
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  const { stopTimeUpdates, stations } = data;

  return (
    <div className="App">
      {
        Object.keys(stopTimeUpdates).sort().map((stop) => {
          const updates = stopTimeUpdates[stop];
          const station = stations[stop.substring(0, 3)];
          const direction = stop.charAt(stop.length - 1);

          const stationLabel = direction === 'N' ? station['North Direction Label'] : station['South Direction Label'];

          return (
            <div key={stop}>
              <Direction label={stationLabel} />
              {
                updates.slice(0, 4).map((update) =>
                  <TrainArrival
                    key={update.id}
                    route={update.routeId}
                    label={station['Line']}
                    now={now}
                    arrivalTime={update.arrivalTime}
                  />
                )
              }
            </div>
          );
        })
      }
    </div>
  );
}

export default App;
