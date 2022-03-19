import './App.css';

import DateTime from './DateTime';
import News from './News';
import Transit from './Transit';
import Weather from './Weather';

const App = () => {
  return (
    <div className="App">
      <DateTime />
      <Transit />
      <Weather />
      <News />
    </div>
  );
}

export default App;
