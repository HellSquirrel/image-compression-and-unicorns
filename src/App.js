import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import PNGAnalyser from './PNGAnalyzer';
import Silvana from './Silvana';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="navigation">
          <Link to="/png-analyzer" className="link">
            PNG Analyzer
          </Link>
          <Link to="/silvana" className="link">
            Silvana
          </Link>
        </nav>
        <Route path="/png-analyzer" exact component={PNGAnalyser} />
        <Route path="/silvana" exact component={Silvana} />
      </BrowserRouter>
    </div>
  );
}

export default App;
