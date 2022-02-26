import './App.css';

import News from './News';
import Transit from './Transit';
import Weather from './Weather';

const App = () => {
  return (
    <div className="App">
      <Transit />
      <Weather />
      <News />
    </div>
  );
}

export default App;
