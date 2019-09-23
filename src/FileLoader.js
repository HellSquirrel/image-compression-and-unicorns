import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import cs from './FileLoader.module.css';
import { splitToChunks, getMetaData, getPallete } from './utils/splitToChunks';

const cx = classNames.bind(cs);

const FileLoader = ({ onChange }) => {
  const input = useRef(null);
  const reader = useRef(new FileReader());
  const stringReader = useRef(new FileReader());
  const [file, setFile] = useState(null);
  useEffect(() => {
    reader.current.onload = event => {
      const parsedFile = splitToChunks(event.target.result);
      onChange(
        parsedFile.size,
        getMetaData(parsedFile.chunks),
        getPallete(parsedFile.chunks)
      );

      console.log(parsedFile);
    };

    stringReader.current.onload = event => {
      setFile(event.target.result);
    };
  }, []);

  return (
    <div className={cx('fileLoader')}>
      <form>
        <input
          type="file"
          ref={input}
          onChange={() => {
            const file = input.current.files[0];
            reader.current.readAsArrayBuffer(file);
            stringReader.current.readAsDataURL(file);
          }}
        />
      </form>
      {file && <img src={file} />}
    </div>
  );
};

export default FileLoader;
