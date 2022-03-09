import './TrainArrival.css';

// http://web.mta.info/developers/resources/line_colors.htm
const colorForRoute = (route) => {
  switch (route) {
    case 'B':
    case 'D':
    case 'M':
    case 'F':
      return '#ff6319';
    case 'J':
    case 'Z':
      return '#996633'
    case 'A':
    case 'C':
    case 'E':
      return '#0039A6'
    case 'L':
      return '#A7A9AC';
    case 'N':
    case 'Q':
    case 'R':
      return '#FCCC0A'
    case '1':
    case '2':
    case '3':
      return '#EE352E'
    case '4':
    case '5':
    case '6':
      return '#00933C'
    case '7':
      return '#B933AD'
  }
}

const TrainArrival = ({ route, label, now, arrivalTimes }) => {
  const routeColor = colorForRoute(route);
  const timeLabel = arrivalTimes
    .slice(0, 3)
    .map((arrivalTime) => `${Math.floor((arrivalTime - Math.round(now.valueOf() / 1000)) / 60)} min`)
    .join(', ')

  const isExpress = route.charAt(1) === 'X';

  return (
    <div className="TrainArrival">
      <div className={`TrainArrival-route ${isExpress ? "TrainArrival-express" : "TrainArrival-bullet"}`} style={{ backgroundColor: routeColor }}>
        <p>{route}</p>
      </div>
      <p className="TrainArrival-label">{label}</p>
      <p className="TrainArrival-time">{timeLabel}</p>
    </div >
  );
};

export default TrainArrival;