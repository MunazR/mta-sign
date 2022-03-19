import './DateTime.css';

import { useEffect, useState } from 'react';
import moment from 'moment';


const DateTime = () => {
  const [now, setNow] = useState(moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(moment())
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [now, setNow])

  return (
    <div className="DateTime">
      <p className="DateTime-text">
        {now.format('dddd, MMMM Do YYYY')}
        <br />
        {now.format('h:mm a')}
      </p>
    </div>
  );
};

export default DateTime;