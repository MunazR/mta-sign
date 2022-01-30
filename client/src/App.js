import './App.css';

import { useEffect, useState } from 'react';

import logo from './logo.svg';

const App = () => {

  const [data, setData] = useState(null);

  const refreshData = async () => {
    fetch('http://localhost:3000/data')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  useEffect(() => {
    refreshData();
    setInterval(refreshData, 60 * 1000)
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
