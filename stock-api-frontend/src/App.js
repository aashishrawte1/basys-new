import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputDate, setInputDate] = useState('');
  const [data, setData] = useState([]);
  const [initialState, setInitialState] = useState(false);

  const callApi = () => {
    setInitialState(true);
    fetch(`https://jsonmock.hackerrank.com/api/stocks?date=${inputDate}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(responseData => {
        setData(responseData.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  return (
    <div className="App">
      <div className="search-container">
        <input
          data-testid="app-input"
          className='search-box input form-control'
          type="text"
          value={inputDate}
          onChange={(e) => setInputDate(e.target.value)}
        />
        <button
          data-testid="submit-button"
          className='button search-button btn btn-primary'
          onClick={callApi}
        >
          Search
        </button>
      </div>

      {initialState && <div>

        { data.length > 0 ? (
            <div>
              {data.map((item, index) => (
                <ul key={index} data-testid="stock-data">
                  <li>Open: {item.open}</li>
                  <li>Close: {item.close}</li>
                  <li>High: {item.high}</li>
                  <li>Low: {item.low}</li>
                </ul>
              ))}
            </div>
          ) : (
            <div data-testid="no-result">No Results Found</div>
        )}

      </div>}
       
      
    </div>
  );
}

export default App;
