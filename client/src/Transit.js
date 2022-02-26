import { useEffect, useState } from 'react';

import SectionHeader from './SectionHeader';
import TrainArrival from './TrainArrival';

const Transit = () => {
  const [data, setData] = useState(null);
  const now = new Date();
  const unixNow = Math.round(now.valueOf() / 1000);

  const refreshData = async () => {
    fetch('http://localhost:3000/data')
      .then((response) => response.json())
      .then(setData)
      .catch(console.error);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return null;
  }

  const { stopTimeUpdates, stations } = data;
  const stopNames = [...new Set(Object.keys(stations).map((stationId) => stations[stationId]['Stop Name']))];

  return (
    <>
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
    </>
  );
};

export default Transit;