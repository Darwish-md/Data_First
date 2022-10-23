import './App.css';
import Graph from './components/Graph';
import Sales from './pages/Sales/Sales';
import React from 'react';
import { useState, useEffect } from 'react';
import * as ReadingService from './utils/readingService';
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import * as Constants from '../../constants';
// import * as utils from '../../utils/JSONConverters';

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    ReadingService.getYearlyData().then((initialData) => {
      setData(initialData.data);
      console.log('effect');
    });
  }, []);
  console.log(data.length);
  const pagesToRender = data.length > 0 ? <Sales data={data} /> : '';
  return (
    <div className='App'>
      <Sales data={data} />
      <Router>
        <nav>
          <ul>
            <li>
              <Link to='/Sales'>Sales</Link>
            </li>
            <li>
              <Link to='/Points'>Sales</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          {/* <Route path='/' element={<Sales data={data} />}></Route>
          <Route path='/sales' element={<Sales data={data} />}></Route> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
