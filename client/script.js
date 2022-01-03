let height = screen.height;
let width = screen.width;
let generateButton = document.getElementById('generate');
let mintButton = document.getElementById('mint');
let alert = document.getElementById('alert');
let progress = document.getElementById('progress');
let blockNumberNode = document.getElementById('block-number');
let dataSourceNode = document.getElementById('data-source');
let rulesNodes = document.getElementsByClassName('rules');
let rulesContainerNode = document.getElementById('rules');
let mintNameNode = document.getElementById('mint-name');
let mintAddressNode = document.getElementById('mint-address');
let mintCouponNode = document.getElementById('mint-coupon');
let inputs = document.getElementById('inputs');
let poem = document.getElementById('poem');
let mapNode = document.getElementById('map');
let originalMap = document.getElementById('original-map');
let movingBlock = document.getElementById('moving-block');

const startProgress = (maxProgress) => {
  let timer = setInterval(() => {
    progress.value++;
    if (progress.value >= maxProgress) {
      clearInterval(timer);
    }
  }, 35);
};

const clearProgress = () => {
  progress.style.display = 'none';
  progress.value = 0;
};

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
  let row = document.createElement('DIV');
  row.classList.add('original-map-row');
  row.classList.add('flex');
  let block = document.createElement('DIV');
  block.classList.add('original-map-block');
  // 32 is a fixed number for column number
  for (let i = 0; i < 32; i++) {
    row.appendChild(block.cloneNode(true));
  }
  let rowNumber = calcOriginalMapRowNumber(height, width);
  for (let i = 0; i < rowNumber; i++) {
    originalMap.appendChild(row.cloneNode(true));
  }
};

// get highest block now
const getNewestBlockNumber = async () => {
  startProgress(40);
  let newestBlockNumberResponse = await axios
    .get(
      'https://map.noncegeek.com/tai_shang_world_generator/api/v1/get_last_block_num',
    )
    .catch((err) => {
      console.log(err);
      stopAndClearProgress();
    });
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
  let blockNumber = await getBlockNumberSetting(blockNumberNode.value);
  let dataSource = await getDataSourceSetting(dataSourceNode.value);
  let rules = await getRulesSetting(rulesNodes);
  startProgress(85);

  return {
    blockNumber: blockNumber,
    dataSource: dataSource,
    rules: rules,
  };
};

// handle setting source and rules error, pop alert if returns true
const isSettingError = async (mapSetting) => {
  if (mapSetting.rules.length === 0 || mapSetting.dataSource !== 'a_block') {
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
  while (mapNode.firstChild) {
    mapNode.removeChild(mapNode.firstChild);
  }
  let row = document.createElement('DIV');
  row.classList.add('map-row');
  row.classList.add('flex');
  let block = document.createElement('DIV');
  block.classList.add('map-block');
  startProgress(99);
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

const loadPoem = (type) => {
  fetch('./poems.json')
    .then((response) => response.json())
    .then((data) => {
      const poemsWithType = data[type];
      poem.style.opacity = 0;
      setTimeout(() => {
        poem.innerText =
          poemsWithType[Math.floor(Math.random() * poemsWithType.length)];
        poem.style.opacity = 1;
      }, 888);
    })
    .catch((error) => console.log(error));
};

const generatePoem = (responseData) => {
  loadPoem(responseData.result.type);
};

const showMovingBlockAndMapContainer = () => {
  movingBlock.classList.remove('hidden')
  movingBlock.style.opacity = 0;
  setTimeout(() => {
    movingBlock.style.opacity = 1;
  }, 233);
  document.getElementById('map-container').classList.remove('hidden');
}

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

  const response = await axios.post(url, data).catch((err) => {
    console.log(err);
    clearProgress();
  });
  const responseData = response.data;
  map.style.opacity = 0;
  setTimeout(() => {
    drawMap(responseData);
    map.style.opacity = 1;
  }, 233);
  clearProgress();
  showMintButtonAndInputs();
  generatePoem(responseData);
  originalMap.classList.add('hidden')
  showMovingBlockAndMapContainer();
};

const reloadPage = () => {
  window.location.reload();
};

// hide mint button and mint inputs, show generate inputs, reset mint info
const showGenerateInputs = () => {
  blockNumberNode.classList.remove('hidden');
  dataSourceNode.classList.remove('hidden');
  rulesContainerNode.classList.remove('hidden');
  mintNameNode.classList.add('hidden');
  mintAddressNode.classList.add('hidden');
  mintCouponNode.classList.add('hidden');
  mintButton.classList.add('hidden');
  generateButton.classList.add('mx-10');
  generateButton.classList.remove('mx-5');
  alert.classList.add('mx-10');
  alert.classList.remove('mx-5');
  generateButton.innerText = 'Generate!';
  generateButton.addEventListener('click', generateMap);
};

// show mint button and mint inputs, hide generate inputs
const showMintButtonAndInputs = () => {
  blockNumberNode.classList.add('hidden');
  dataSourceNode.classList.add('hidden');
  rulesContainerNode.classList.add('hidden');
  mintNameNode.classList.remove('hidden');
  mintAddressNode.classList.remove('hidden');
  mintCouponNode.classList.remove('hidden');
  mintButton.classList.remove('hidden');
  generateButton.classList.remove('mx-10');
  generateButton.classList.add('mx-5');
  alert.classList.remove('mx-10');
  alert.classList.add('mx-5');
  generateButton.innerText = 'Regenerate!';
  generateButton.removeEventListener('click', generateMap);
  generateButton.addEventListener('click', showGenerateInputs);
};

const mintSetting = () => {
  let mintName = mintNameNode.value ? mintNameNode.value : 'leeduckgo';
  let mintAddress = mintAddressNode.value ? mintAddressNode.value : '0x0000';
  let mintCoupon = mintCouponNode.value ? mintCouponNode.value : 'nocoupon';

  return {
    minter_name: mintName,
    minter_address: mintAddress,
    coupon_id: mintCoupon,
  };
};

const showMintInfo = (mintData) => {
  if (mintData.error_code !== 0) {
    alert.classList.remove('opacity-0');
    progress.classList.remove('hidden');
    setTimeout(() => {
      alert.classList.add('opacity-0');
    }, 3000);
    return;
  }
  let tokenInfo = mintData.result.token_info;
  let mintNameDisplay = tokenInfo.minter_name;
  let mintContractDisplay = tokenInfo.contract_addr;
  let mintTokenIdDisplay = tokenInfo.token_id;
  let mintUrl = 'https://polygonscan.com/tx/' + mintTokenIdDisplay;
  mintNameNode.classList.add('hidden');
  mintAddressNode.classList.add('hidden');
  mintCouponNode.classList.add('hidden');
  mintButton.classList.add('hidden');
  generateButton.classList.add('hidden');
  inputs.innerHTML += `
    <div class="mx-5 my-5 rule-border" id='rules'>
      <label class="label my-2">
        <span class="label-text" style="margin-left: 1.25rem"><b>Minter name: </b><br/>${mintNameDisplay}</span>
      </label>
      <label class="label my-2">
        <span class="label-text" style="margin-left: 1.25rem"><b>Contract Address: </b><br/>${mintContractDisplay}</span>
      </label>
      <label class="label my-2">
        <span class="label-text" style="margin-left: 1.25rem"><b>Token id: </b><br/>${mintTokenIdDisplay} </span>
      </label>
      <a class="block link link-accent mx-5 my-2 text-center" style="margin-bottom: 1rem;" href=${mintUrl}>Tx on Polygonscan</a>
    </div>
  `;
  inputs.innerHTML +=
    '<button class="btn btn-secondary mx-5 my-5" id="reset">Reset!</button> ';
  document.getElementById('reset').addEventListener('click', reloadPage);
};

// mint map
const mintMap = async () => {
  progress.classList.add('hidden');
  const setting = mintSetting();
  const params = new URLSearchParams({
    coupon_id: setting.coupon_id,
  }).toString();
  const url =
    'http://124.251.110.212:4001/tai_shang_world_generator/api/v1/mint?' +
    params;

  const response = await axios.post(url, null).catch((err) => {
    console.log(err);
    clearProgress();
  });

  const responseData = response.data;
  showMintInfo(responseData);
  clearProgress();
};

document.addEventListener('DOMContentLoaded', function () {
  drawOriginalMap();
  generateButton.addEventListener('click', generateMap);
  mintButton.addEventListener('click', mintMap);
});
