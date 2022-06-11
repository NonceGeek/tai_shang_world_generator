import { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDialog } from "../store/actions";
import axios from 'axios';
import { marked } from 'marked';


export default function Map() {
  let dispatch = useDispatch();
  const treasureCount = 2;
  const spriteCount = 5;

  let [rowNumber, setRowNumber] = useState(1);
  let [unboxState, setUnboxState] = useState({});
  let mapData = useSelector(state => state.mapData);
  let mapSeed = useSelector(state => state.mapSeed);
  let hero = useSelector(state => state.hero);

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
    row = parseInt(row) + 1;
    setRowNumber(row);
  };

  const withinRange = (value, arr) => {
    if (arr.length === 1) {
      return value === arr[0];
    } else if (arr.length > 1) {
      return value >= arr[0] && value <= arr[1];
    }
  };

  const initialRandomState = () => {
    
    if (mapData.map.length === 0) {
      return {}
    }
    let randomState = {}
    // console.log(mapData.map[0]);
    for (let i = 0; i < mapData.map.length; i++) {
      for (let j = 0; j < 32; j++) {
        let key = `${i}-${j}`;
        if (mapData.ele_description.object !== undefined && withinRange(mapData.map[i][j], mapData.ele_description.object)){
          randomState[key] = Math.floor(Math.random() * treasureCount + 1)
        } else if (withinRange(mapData.map[i][j], mapData.ele_description.sprite)) {
          randomState[key] = Math.floor(Math.random() * spriteCount + 1)
        }
      }
    }
    // setRandomState(randomState);
    return randomState;
  }

  const initialEvents = () => {
    if (mapData.events.length === 0) {
      return {}
    }
    let eventsDict = {}
    for (let i = 0; i < mapData.events.length; i++) {
      let event = mapData.events[i];
      let key = `${event.y}-${event.x}`;
      eventsDict[key] = event;
    }
    return eventsDict;
  }

  let randomState1 = useMemo(() => initialRandomState(), [mapData]);
  let eventsState = useMemo(() => initialEvents(), [mapData]);
  const setBlockType = (map, x, y, ele_description, blockType, key) => {
    let img = '';
    let className = '';
    const title = eventsState[`${x}-${y}`] !== undefined ? 
      <div style={{position: 'absolute', top: `${2.5 * x - 1.25}vw`, left: `${2.5 * y+1.25}vw`, color: 'red'}}>!</div> : '';
    if (withinRange(map[x][y], ele_description.walkable)) {
      className = 'walkable';
    } else if (withinRange(map[x][y], ele_description.unwalkable)) {
      className = 'unwalkable';
      img = <img src={require('../assets/img/block/unwalkable.png')} alt='unwalkable' />;
    } else if (ele_description.object !== undefined && withinRange(map[x][y], ele_description.object)) {
      let lockState = unboxState[`${x}-${y}`] === true ? 'unlocked' : 'locked';
      let randomStateKey = randomState1[`${x}-${y}`];
      const object = `treasure-${lockState}-${randomStateKey}`;
      className = `unwalkable ${object}`;
      img = <img src={require(`../assets/img/block/${object}.png`)} alt={object} />
    } else if (withinRange(map[x][y], ele_description.sprite)) {
      const sprite = 'sprite' + randomState1[`${x}-${y}`];
      className = `unwalkable ${sprite}`;
      img = <img src={require(`../assets/img/block/${sprite}.png`)} alt={sprite} />
    }
    return <div className={`map-block flex ${className} ${blockType}`} key={key}>{title}{img}</div>
  };

  const drawBlock = (map, i, j, type, ele_description, key) => {
    let blockType = '';
    if (['ice', 'sand', 'green'].includes(type)) {
      blockType = type;
    }
    return setBlockType(map, i, j, ele_description, blockType, key);
  }

  useEffect(() => {
    drawOriginalMap();
  });

  // -------------------- Game Logic --------------------
  const stepLength = 2.5;
  let direction = null;
  let targetPosition = null;
  const mapContainerRef = useRef(null);
  const heroRef = useRef(null);

  const [heroPosition, setHeroPosition] = useState({left: 0, top: 0});

  // move moving-block when possible
  const move = (direction, stepLength) => {
    if (willCrossBorder(direction, stepLength)) {
      console.log('will cross border');
      return;
    }
    const currentPosition = getCoordinate(stepLength);
    if (willCollide(currentPosition, direction)) {
      console.log("collide");
      return;
    }
    let left, top;
    switch (direction) {
      case 'left':
        left = heroPosition.left - stepLength;
        setHeroPosition({...heroPosition, left: left});
        break;
      case 'top':
        top = heroPosition.top - stepLength;
        setHeroPosition({...heroPosition, top: top});
        scrollIfNeeded('top');
        break;
      case 'right':
        left = heroPosition.left + stepLength;
        setHeroPosition({...heroPosition, left: left});
        break;
      case 'bottom':
        top = heroPosition.top + stepLength;
        setHeroPosition({...heroPosition, top: top});
        scrollIfNeeded('bottom');
        break;
      default:
        break;
    }
    
  };

  // check if moving-block will be out of map
  const willCrossBorder = (direction, stepLength) => {
    if (direction === 'left') {
      return heroPosition.left - stepLength < 0;
    } else if (direction === 'right') {
      // FIXME
      // return heroPosition.left + oDiv.clientWidth + stepLength > map.clientWidth;
      return heroPosition.left + 2 * stepLength > stepLength * 32;
    } else if (direction === 'top') {
      return heroPosition.top - stepLength < 0;
    } else if (direction === 'bottom') {
      return heroPosition.top + 2 * stepLength > stepLength * mapData.map.length;
    }
  };

  const scrollSmoothly = (scrollLength, scrollStep) => {
    const scrollInterval = setInterval(() => {
      mapContainerRef.current.scrollBy(0, scrollStep);
      scrollLength -= scrollStep;
      if (scrollLength === 0) {
        clearInterval(scrollInterval);
      }
    });
  };

  // scroll map when part of moving-block is out of wrapper
  const scrollIfNeeded = (direction) => {
    const scrollLength = parseInt(mapContainerRef.current.clientHeight / 3);
    if (
      direction === 'bottom' &&
      heroRef.current.getBoundingClientRect().bottom >
      mapContainerRef.current.getBoundingClientRect().bottom
    ) {
      
      scrollSmoothly(scrollLength, 1);
    } else if (
      direction === 'top' &&
      heroRef.current.getBoundingClientRect().top < 
      mapContainerRef.current.getBoundingClientRect().top
    ) {
      scrollSmoothly(-scrollLength, -1);
    }
  };

  const getCoordinate = (stepLength) => {
    const x = heroPosition.top / stepLength;
    const y = heroPosition.left / stepLength;
    
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
    // FIXME: if !unwalkable => walkable?
    return !withinRange(mapData.map[x][y], mapData.ele_description.walkable)
  }

  const interact = async (direction) => {
    if (!direction) {
      return;
    }

    const currentPosition = getCoordinate(stepLength);
    switch (direction) {
      case 'left':
        targetPosition = {
          x: currentPosition.x,
          y: currentPosition.y - 1,
        }
        break;
      case 'right':
        targetPosition = {
          x: currentPosition.x,
          y: currentPosition.y + 1,
        }
        break;
      case 'top':
        targetPosition = {
          x: currentPosition.x - 1,
          y: currentPosition.y,
        }
        break;
      case 'bottom':
        targetPosition = {
          x: currentPosition.x + 1,
          y: currentPosition.y,
        }
        break;
      default:
        break;
    }
    const targetBlock = mapData.map[targetPosition.x][targetPosition.y];
    if (withinRange(targetBlock, mapData.ele_description.sprite)) {
      await interactNpc(targetPosition);
    } else if (withinRange(targetBlock, mapData.ele_description.object)) {
      openTreasureBox(targetPosition);
    }
  }

  const interactNpc = async (targetPosition) => {
    const interactResponse = await getInteractResponse(targetPosition, mapSeed.blockNumber);

    if (interactResponse.error_code === 0) {
      const dialogContent = interactResponse.result.event.payload.first;
      showNpcDialog(dialogContent);
    }
  }

  const showNpcDialog = (dialogContent) => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    })
    dispatch(setDialog({display: true, content: marked.parse(dialogContent.text), yesContent: dialogContent.btn.yes, noContent: dialogContent.btn.no}));
  }

  const openTreasureBox = (targetPosition) => {
    let key = `${targetPosition.x}-${targetPosition.y}`;
    let _unboxState = {...unboxState};
    _unboxState[key] = true;
    setUnboxState(_unboxState);
    // FIXME: use data to change element
    const treasureBox = document
      .querySelectorAll('.map-row')[targetPosition.x]
      .children.item(targetPosition.y);

    treasureBox.className = treasureBox.className.replace('treasure-locked', 'treasure-unlocked');
    treasureBox.children[0].src = require('../assets/img/block/treasure-unlocked-1.png');
  }

  const getInteractResponse = async (targetPosition, blockNumber) => {
    const { x, y } = targetPosition;
    
    let interactApi = `https://map.noncegeek.com/tai_shang_world_generator/api/v1/interact?x=${y}&y=${x}&block_height=${blockNumber}`;

    let interactResponse = await axios
      .get(interactApi)
      .catch((err) => {
        console.log(err);
      });

    return interactResponse.data;
  }

  useEffect(() => {
    const onKeyDown = (ev) => {
      // var ev = ev || event;
      var keyCode = ev.keyCode;
  
      switch (keyCode) {
        case 37:
          ev.preventDefault();
          direction = 'left';
          move(direction, stepLength);
          break;
        case 38:
          ev.preventDefault();
          direction = 'top';
          move(direction, stepLength);
          break;
        case 39:
          ev.preventDefault();
          direction = 'right';
          move(direction, stepLength);
          break;
        case 40:
          ev.preventDefault();
          direction = 'bottom';
          move(direction, stepLength);
          break;
        case 32:
          ev.preventDefault();
          interact(direction);
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
  }, [mapData, heroPosition]);

  return (
    // <!-- THE map -->
    <div id="map-wrapper" >
      {/* <!-- <p id="poem">一花一世界, 一叶一菩提.</p> --> */}
      <div id="original-map" hidden={mapData.map.length !== 0}>
        {Array.from(Array(rowNumber).keys()).map((row, rowId) => {
          return (<div className='original-map-row flex' key={rowId}>
            {Array.from(Array(32).keys()).map((n, i) => { return <div className='original-map-block flex' key={i}></div> })}
          </div>)
        })}
      </div>
      <div id="map-container" ref={mapContainerRef}>
        <div id="moving-block" hidden={mapData.map.length === 0} ref={heroRef} style={{ left: `${heroPosition.left}vw`, top: `${heroPosition.top}vw` }}>
          <div id="hero-name">{hero.name}</div>
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

