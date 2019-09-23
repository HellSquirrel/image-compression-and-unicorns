import React from 'react';

import cs from './PNGAnalyzer.modules.css';
import silvana from './images/silvana.png';

const Silvana = () => {
  return (
      <div>
        <img src={silvana} style={{width: 300}}></img>
        <img src={silvana} style={{width: 300, imageRendering: "pixelated"}}></img>
      </div>
  )

};

export default Silvana;
