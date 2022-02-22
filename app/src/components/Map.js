import { useEffect, useState } from 'react';
import { lastBlockNumURL } from '../constants';
import { useSelector } from 'react-redux';
const axios = require('axios');


export default function Map() {
  const treasureCount = 2;
  const spriteCount = 5;

  let [rowNumber, setRowNumber] = useState(1);
  let mapData = useSelector(state => state.mapData);
  // fill screen with rows of block
  const calcOriginalMapRowNumber = function (height, width) {
    // subtract the p tag height
    height = height * 0.75;
    // one block is 2.5vw high
    let blockHeight = width * 0.025;
    return height / blockHeight;
  };

  // paint original placeholder map before generating
  const drawOriginalMap = function () {
    const { innerWidth: width, innerHeight: height } = window;
    let row = calcOriginalMapRowNumber(height, width);
    row = parseInt(row);
    setRowNumber(row);
  };

  const withinRange = (value, arr) => {
    if (arr.length === 1) {
      return value === arr[0];
    } else if (arr.length > 1) {
      return value >= arr[0] && value <= arr[1];
    }
  };

  const setBlockType = (coordinate, ele_description, blockType, key) => {
    let img = '';
    let className = '';
    if (withinRange(coordinate, ele_description.walkable)) {
      className = 'walkable';
    } else if (withinRange(coordinate, ele_description.unwalkable)) {
      className = 'unwalkable';
      img = <img src={require('../assets/img/block/unwalkable.png')} alt='unwalkable' />;
    } else if (withinRange(coordinate, ele_description.object)) {
      const object = 'treasure-locked-' + Math.floor(Math.random() * treasureCount + 1);
      className = `unwalkable ${object}`;
      img = <img src={require(`../assets/img/block/${object}.png`)} alt={object} />
    } else if (withinRange(coordinate, ele_description.sprite)) {
      const sprite = 'sprite' + Math.floor(Math.random() * spriteCount + 1);
      className = `unwalkable ${sprite}`;
      img = <img src={require(`../assets/img/block/${sprite}.png`)} alt={sprite} />
    }
    return <div className={`map-block flex walkable ${className} ${blockType}`} key={key}>{img}</div>
  };

  const drawBlock = (map, i, j, type, ele_description, key) => {
    let blockType = '';
    if (['ice', 'sand', 'green'].includes(type)) {
      blockType = type;
    }
    return setBlockType(map[i][j], ele_description, blockType, key);
  }

  useEffect(() => {
    drawOriginalMap();
  }, [])

  return (
    // <!-- THE map -->
    <div id="map-wrapper">
      {/* <!-- <p id="poem">一花一世界, 一叶一菩提.</p> --> */}
      <div id="original-map" hidden={mapData.map.length !== 0}>
        {Array.from(Array(rowNumber).keys()).map((row, rowId) => {
          return (<div className='original-map-row flex' key={rowId}>
            {Array.from(Array(32).keys()).map((n, i) => { return <div className='original-map-block flex' key={i}></div> })}
          </div>)
        })}
      </div>
      <div id="map-container" className="">
        <div id="moving-block" className="" style={{ left: '0vw', top: '0vw' }}>
          <img src={require('../assets/img/block/hero.gif')} alt="" />
        </div>
        <div id="map">
          {mapData.map && mapData.map.map((row, rowId) => {
            return (<div className='map-row flex' key={rowId}>
              {Array.from(Array(32).keys()).map((n, j) => { return drawBlock(mapData.map, rowId, j, mapData.type, mapData.ele_description, j) })}
            </div>)
          })}
        </div>
      </div>
    </div>
  );
}

