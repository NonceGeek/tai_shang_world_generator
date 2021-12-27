let height = screen.height;
let width = screen.width;
let generateButton = document.getElementById('generate');
let alert = document.getElementById('alert');
let progress = document.getElementById('progress');

// fill screen with rows of block
const calcOriginalMapRowNumber = (height, width) => {
  // subtract the p tag height
  height = height * 0.75;
  // one block is 2.5vw high
  let blockHeight = width * 0.025;
  return height / blockHeight;
};

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
  let rowNumber = calcOriginalMapRowNumber(height, width);
  for (let i = 0; i < rowNumber; i++) {
    map.appendChild(row.cloneNode(true));
  }
};

// get highest block now
const getNewestBlockNumber = async () => {
  let newestBlockNumberResponse = await axios
    .get(
      'http://124.251.110.212:4001/tai_shang_world_generator/api/v1/get_last_block_num',
    )
    .catch((err) => console.log(err));
  progress.value = 40;
  return newestBlockNumberResponse.data.result.last_block_num;
};

// get block number, if higher than highest block number, make it highest
const getBlockNumberSetting = async (blockNumber) => {
  let newestBlockNumber = await getNewestBlockNumber();
  let blockNumberNode = document.getElementById('block-number');

  if (
    blockNumber &&
    parseInt(blockNumber) <= newestBlockNumber &&
    parseInt(blockNumber) >= 0
  ) {
    return parseInt(blockNumber);
  }

  blockNumberNode.value = '';

  let newestBlockNumberString = String(newestBlockNumber);
  let newestBlockNumberStringIndex = 0;

  setInterval(() => {
    blockNumberNode.value += newestBlockNumberString.charAt(
      newestBlockNumberStringIndex,
    );
    newestBlockNumberStringIndex++;
  }, 50);

  blockNumberNode.focus();
  return newestBlockNumber;
};

// get data source setting
const getDataSourceSetting = async (dataSource) => {
  if (dataSource) {
    return dataSource;
  }
  let dataSourceNode = document.getElementById('data-source');
  let dataSourceDefault = 'a_block';
  let dataSourceIndex = 0;
  setInterval(() => {
    dataSourceNode.value += dataSourceDefault.charAt(dataSourceIndex);
    dataSourceIndex++;
  }, 50);
  return dataSourceDefault;
};

// get rules settings
const getRulesSetting = async (rulesNodes) => {
  let rules = [];
  for (let rulesNode of rulesNodes) {
    if (rulesNode.checked) {
      rules.push(rulesNode.id);
    }
  }
  return rules;
};

// get generation setting from page
const generationSetting = async () => {
  let blockNumberNode = document.getElementById('block-number');
  let dataSourceNode = document.getElementById('data-source');
  let rulesNodes = document.getElementsByClassName('rules');

  let blockNumber = await getBlockNumberSetting(blockNumberNode.value);
  let dataSource = await getDataSourceSetting(dataSourceNode.value);
  let rules = await getRulesSetting(rulesNodes);
  progress.value = 80;

  return {
    blockNumber: blockNumber,
    dataSource: dataSource,
    rules: rules,
  };
};

// handle setting source and rules error, pop alert if returns true
const isSettingError = async (mapSetting) => {
  if (
    mapSetting.rules.length === 0 ||
    mapSetting.dataSource !== 'a_block'
  ) {
    alert.classList.remove('opacity-0');
    progress.style.display = 'none';
    setTimeout(() => {
      alert.classList.add('opacity-0');
    }, 3000);
    return true;
  } else {
    alert.classList.add('opacity-0');
    return false;
  }
};

// draw individual block from map
const drawBlock = (newBlock, map, i, j, type) => {
  if (type === 'ice') {
    if (map[i][j] === 0) {
      newBlock.style.backgroundColor = '#fffefa';
    }
  }
  if (type === 'sand') {
    if (map[i][j] === 0) {
      newBlock.style.backgroundColor = '#f9cb8b';
    }
  }
  if (type === 'green') {
    if (map[i][j] === 0) {
      newBlock.style.backgroundColor = '#8cc269';
    }
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
  progress.style.display = 'block';
  const mapSetting = await generationSetting();
  if (await isSettingError(mapSetting)) {
    drawOriginalMap();
    return;
  }
  const params = new URLSearchParams({
    source: mapSetting.dataSource,
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
  progress.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', function () {
  drawOriginalMap();
  generateButton.addEventListener('click', generateMap);
});
