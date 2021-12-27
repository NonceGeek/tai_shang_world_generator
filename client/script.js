let generateButton = document.getElementById('generate');
let alert = document.getElementById('alert');

// paint original placeholder map before generating
const drawOriginalMap = () => {
  let map = document.getElementById('map');
  let row = document.createElement('DIV');
  row.classList.add('map-row');
  row.classList.add('flex');
  let block = document.createElement('DIV');
  block.classList.add('map-block');
  // 32 is a fixed number for column number
  for (let i = 0; i < 32; i++) {
    row.appendChild(block.cloneNode(true));
  }
  // 25 is a changeable number for row number
  for (let i = 0; i < 24; i++) {
    map.appendChild(row.cloneNode(true));
  }
};

// get generation setting from page
const generationSetting = () => {
  let blockNumber = document.getElementById('block-number');
  let chainSource = document.getElementById('chain-source');
  let rulesNodes = document.getElementsByClassName('rules');
  let rules = [];
  for (let rulesNode of rulesNodes) {
    if (rulesNode.checked) {
      rules.push(rulesNode.id)
    }
  }
  console.log(rules);
  return {
    blockNumber: blockNumber.value ? blockNumber.value : 22793130,
    chainSource: chainSource.value ? chainSource.value : 'a_block',
    rules: rules,
  };
};

// handle setting rules error
const isSettingError = (mapSetting) => {
  if (mapSetting.rules.length === 0) {
    alert.style.display = 'block';
    return true;
  } else {
    alert.style.display = 'none';
    return false;
  }
};

// draw individual block from map
const drawBlock = (newBlock, map, i, j, type) => {
  if (map[i][j] === 0) {
    newBlock.style.backgroundColor = 'white';
  }
};

// draw map from response
const drawMap = (responseJSON) => {
  if (responseJSON.error_code !== 0) {
    drawOriginalMap();
    return;
  }
  const map = responseJSON.result.map;
  const type = responseJSON.result.type;
  console.log(type);
  let mapNode = document.getElementById('map');
  while (mapNode.firstChild) {
    mapNode.removeChild(mapNode.firstChild);
  }
  let row = document.createElement('DIV');
  row.classList.add('map-row');
  row.classList.add('flex');
  let block = document.createElement('DIV');
  block.classList.add('map-block');
  for (let i = 0; i < map.length; i++) {
    let newRow = row.cloneNode(true);
    // 32 is a fixed number for column number
    for (let j = 0; j < 32; j++) {
      let newBlock = block.cloneNode(true);
      drawBlock(newBlock, map, i, j, type);
      newRow.appendChild(newBlock);
    }
    mapNode.appendChild(newRow);
  }
};

// post generation setting
const generateMap = async () => {
  const mapSetting = generationSetting();
  if (isSettingError(mapSetting)) {
    return;
  }

  const params = new URLSearchParams({
    source: mapSetting.chainSource,
  }).toString();
  const url =
    'http://124.251.110.212:4001/tai_shang_world_generator/api/v1/gen_map?' +
    params;
  const data = {
    block_number: mapSetting.blockNumber,
    // only rule 1 now
    rule: mapSetting.rules[0],
  };

  const response = await axios.post(url, data).catch((err) => console.log(err));
  const responseData = response.data;
  drawMap(responseData);
};

document.addEventListener('DOMContentLoaded', function () {
  drawOriginalMap();
  generateButton.addEventListener('click', generateMap);
});
