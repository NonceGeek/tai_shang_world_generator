import { useEffect, useState } from 'react';
import { lastBlockNumURL } from '../constants';
const axios = require('axios');


export default function Map() {
  let [rowNumber, setRowNumber] = useState(1);
  // fill screen with rows of block
  const calcOriginalMapRowNumber = function(height, width){
    // subtract the p tag height
    height = height * 0.75;
    // one block is 2.5vw high
    let blockHeight = width * 0.025;
    return height / blockHeight;
  };
  
  // paint original placeholder map before generating
  const drawOriginalMap = function() {
    const { innerWidth: width, innerHeight: height } = window;
    let row = calcOriginalMapRowNumber(height, width);
    setRowNumber(row);
  };

  useEffect(() => {
    drawOriginalMap();
  }, [])

  return (
    // <!-- THE map -->
    <div id="map-wrapper">
      {/* <!-- <p id="poem">一花一世界, 一叶一菩提.</p> --> */}
      <div id="original-map">
        {Array.from(Array(24).keys()).map((row, rowId) => {
          return (<div className='original-map-row flex' key={rowId}>
            {Array.from(Array(32).keys()).map((n, i)=>{ return <div className='original-map-block flex' key={i}></div>})}
            </div>)
        })}</div>
      <div id="map-container" className="">
          <div id="moving-block" className="" style={{left: '0vw', top: '0vw'}}>
            <img src="../assets/img/block/hero.gif" alt="" />
          </div>
          <div id="map"></div>
      </div>
    </div>
  );
}
  
