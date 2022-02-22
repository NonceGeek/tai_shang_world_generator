import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


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
    return <div className={`map-block flex ${className} ${blockType}`} key={key}>{img}</div>
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
  }, []);

  // game
  const stepLength = 2.5;
  let direction = null;
  let targetPosition = null;
  let oDiv = 'moving-block'

  let [heroPosition, setHeroPosition] = useState({left: 0, top: 0});

  // move moving-block when possible
  const move = (oDiv, direction, stepLength) => {
    // if (willCrossBorder(oDiv, map, direction, stepLength)) {
    //   return;
    // }

    const currentPosition = getCoordinate(oDiv, stepLength);

    if (willCollide(currentPosition, direction)) {
      return;
    }
    let left, top;

    switch (direction) {
      case 'left':
        left = parseFloat(heroPosition.left) - stepLength;
        setHeroPosition({...setHeroPosition, left: left});
        break;
      case 'top':
        top = parseFloat(heroPosition.top) - stepLength;
        setHeroPosition({...setHeroPosition, top: top});
        // scrollIfNeeded(oDiv, wrapper, 'top');
        break;
      case 'right':
        left = parseFloat(heroPosition.left) + stepLength;
        setHeroPosition({...setHeroPosition, left: left});
        break;
      case 'bottom':
        top = parseFloat(heroPosition.top) + stepLength;
        setHeroPosition({...setHeroPosition, top: top});
        // scrollIfNeeded(oDiv, wrapper, 'bottom');
        break;
      default:
        break;
    }
  };

  const getCoordinate = (stepLength) => {
    const x = parseFloat(heroPosition.top) / stepLength;
    const y = parseFloat(heroPosition.left) / stepLength;
    
    return { x, y };
  }

  const willCollide = (currentPosition, direction) => {
    let { x, y } = currentPosition;

    if (direction === 'left') {
      y -= 1;
    } else if (direction === 'right') {
      y += 1;
    } else if (direction === 'top') {
      x -= 1;
    } else if (direction === 'bottom') {
      x += 1;
    }
    // FIXME: if !unwalkable => walkable
    console.log(mapData);
    return !withinRange(mapData.map[x][y], mapData.ele_description.walkable)
    // return document
    //   .querySelectorAll('.map-row')[x]
    //   .children.item(y)
    //   .classList.contains('unwalkable')
  }

  const interact = async (oDiv, direction) => {
  }

  useEffect(() => {
    const onKeyDown = (ev) => {
      // var ev = ev || event;
      var keyCode = ev.keyCode;
  
      switch (keyCode) {
        case 37:
          ev.preventDefault();
          direction = 'left';
          move(oDiv, direction, stepLength);
          break;
        case 38:
          ev.preventDefault();
          direction = 'top';
          move(oDiv, direction, stepLength);
          break;
        case 39:
          ev.preventDefault();
          direction = 'right';
          move(oDiv, direction, stepLength);
          break;
        case 40:
          ev.preventDefault();
          direction = 'bottom';
          move(oDiv, direction, stepLength);
          break;
        case 32:
          ev.preventDefault();
          interact(oDiv, direction);
          break;
        case 33: // PageUp
        case 34: // PageDown
        case 35: // End
        case 36: // Home
          ev.preventDefault();
      }
    };

    const onKeyUp = (ev) => {
      // var ev = ev || event;
      var keyCode = ev.keyCode;
  
      switch (keyCode) {
        case 37:
          ev.preventDefault();
          direction = 'left';
          break;
        case 38:
          ev.preventDefault();
          direction = 'top';
          break;
        case 39:
          ev.preventDefault();
          direction = 'right';
          break;
        case 40:
          ev.preventDefault();
          direction = 'bottom';
          break;
        case 32:
          ev.preventDefault();
          break;
        default:
          ev.preventDefault();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
    }
  }, []);

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
        <div id="moving-block" className="" style={{ left: `${heroPosition.left}vw`, top: `${heroPosition.top}vw` }}>
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

