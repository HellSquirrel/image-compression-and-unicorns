import React, { useState } from 'react';
import classNames from 'classnames/bind';
import FileLoader from './FileLoader';

import cs from './PNGAnalyzer.modules.css';

const cx = classNames.bind(cs);
const PNGAnalyser = () => {
  const [size, setSize] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [pallete, setPallete] = useState(null);
  return (
    <div className={cx('PGNAnalyser')}>
      <FileLoader
        onChange={(sizeFromEvent, metaDataFromEvent, palleteFromEvent) => {
          setSize(sizeFromEvent);
          setMetaData(metaDataFromEvent);
          setPallete(palleteFromEvent);
        }}
      />
      {size && <div className={cx('size')}>{size} Byte</div>}
      {metaData && (
        <div className={cx('meta')}>
          {Object.entries(metaData).map(([key, value]) => (
            <React.Fragment key={key}>
              <div>{key}</div>
              <div>{value}</div>
            </React.Fragment>
          ))}
        </div>
      )}
      {pallete && (
        <div className={cx('pallete')}>
          <div>Pallete</div>
          {pallete.map((p, index) => (
            <div
              key={index}
              style={{ width: 10, height: 10, background: `rgb(${p.join()})` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PNGAnalyser;
