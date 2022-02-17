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
let characterNFTNode = document.getElementById('character-nft');
let mintNameNode = document.getElementById('mint-name');
let mintAddressNode = document.getElementById('mint-address');
let mintCouponNode = document.getElementById('mint-coupon');
let mintDescription = document.getElementById('mint-description');
let tokenIDNode = document.getElementById('token-id');
let contractIDNode = document.getElementById('contract-id');
let viewButton = document.getElementById('view');
let inputs = document.getElementById('inputs');
let poem = document.getElementById('poem');
let mapNode = document.getElementById('map');
let originalMap = document.getElementById('original-map');
let movingBlock = document.getElementById('moving-block');
let backButton = document.querySelector('#back-button');

const treasureCount = 2;
const spriteCount = 5;
const mintData = {};
const characterNFTDescriptions = {
  learner: '参与相关区块链技术付费课程',
  buidler: '参与过 Web3Dev 代码建设工作者',
  partner: 'Web3Dev 的伙伴',
  noncegeeker: 'Web3Dev 核心成员',
  workshoper: '参与过 Web3DevWorkshop 的同学',
  camper: '积极参与 Web3DevCamp 的同学',
  writer: '为 Web3Dev 供稿的同学',
  researcher: '参与过 Web3Dev 研究工作的同学',
  puzzler: '解谜成功者',
};

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
      lastBlockNumURL,
    )
    .catch((err) => {
      console.log(err);
      stopAndClearProgress();
    });
  window.blockHeight = newestBlockNumberResponse.data.result.last_block_num;
  return window.blockHeight;
};

// get block number, if higher than highest block number, make it highest
const getBlockNumberSetting = async (blockNumber) => {
  let newestBlockNumber = await getNewestBlockNumber();

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

  // blockNumberNode.focus();
  return newestBlockNumber;
};

// get data source setting
const getDataSourceSetting = async () => {
  let dataSourceDefault = 'a_block';
  let dataSourceIndex = 0;
  dataSourceNode.value = '';
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
  let dataSource = await getDataSourceSetting();
  let rules = await getRulesSetting(rulesNodes);
  startProgress(85);

  mintData.source = dataSource;

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
  if (['ice', 'sand', 'green'].includes(type)) {
    newBlock.classList.add(type);
  }
};

const setBlockType = (newBlock, coordinate, ele_description) => {
  if (withinRange(coordinate, ele_description.walkable)) {
    newBlock.classList.add('walkable');
  } else if (withinRange(coordinate, ele_description.unwalkable)) {
    newBlock.classList.add('unwalkable');
    insertImage(newBlock, 'unwalkable');
  } else if (withinRange(coordinate, ele_description.object)) {
    const object = 'treasure-locked-' + Math.floor(Math.random() * treasureCount + 1);
    newBlock.classList.add(object, 'unwalkable');
    insertImage(newBlock, object);
  } else if (withinRange(coordinate, ele_description.sprite)) {
    const sprite = 'sprite' + Math.floor(Math.random() * spriteCount + 1);
    newBlock.classList.add(sprite, 'unwalkable');
    insertImage(newBlock, sprite);
  }
};

const insertImage = (parentNode, type) => {
  const img = document.createElement('img')
  img.src = 'assets/img/block/' + type + '.png'

  parentNode.appendChild(img)
}

const withinRange = (value, arr) => {
  if (arr.length === 1) {
    return value === arr[0];
  } else if (arr.length > 1) {
    return value >= arr[0] && value <= arr[1];
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
  const ele_description = responseJSON.result.ele_description;

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
      setBlockType(newBlock, map[i][j], ele_description);
      newRow.appendChild(newBlock);
    }
    mapNode.appendChild(newRow);
  }
};

// const loadPoem = (type) => {
//   fetch('./poems.json')
//     .then((response) => response.json())
//     .then((data) => {
//       const poemsWithType = data[type];
//       poem.style.opacity = 0;
//       setTimeout(() => {
//         poem.innerText =
//           poemsWithType[Math.floor(Math.random() * poemsWithType.length)];
//         poem.style.opacity = 1;
//       }, 888);
//     })
//     .catch((error) => console.log(error));
// };

// const generatePoem = (responseData) => {
//   loadPoem(responseData.result.type);
// };

const showMovingBlockAndMapContainer = () => {
  movingBlock.classList.remove('hidden');
  movingBlock.style.opacity = 0;
  setTimeout(() => {
    movingBlock.style.opacity = 1;
  }, 233);
  document.getElementById('map-container').classList.remove('hidden');
};

const getTokenId = (tokenIDNode) => {
  return +tokenIDNode.value;
};

const getContractId = (contractIDNode) => {
  return +contractIDNode.value;
};

const viewSetting = () => {
  let tokenId = getTokenId(tokenIDNode);
  let contractId = getContractId(contractIDNode);
  return {
    tokenId,
    contractId,
  };
};

// post view setting
const viewMap = async () => {
  progress.style.display = 'block';
  const mapSetting = viewSetting();
  // if (await isSettingError(mapSetting)) {
  //   drawOriginalMap();
  //   return;
  // }
  const url = genMapURL;
  const data = {
    token_id: mapSetting.tokenId,
    contract_id: mapSetting.contractId,
  };

  mintData.token_id = data.tokenId;
  mintData.contract_id = data.contract_id;

  const response = await axios.post(url, data).catch((err) => {
    console.log(err);
    clearProgress();
  });

  const responseData = response.data;
  map.style.opacity = 0;
  blockNumberNode.value = responseData.result.block_height;
  setTimeout(() => {
    drawMap(responseData);
    map.style.opacity = 1;
  }, 233);
  clearProgress();
  originalMap.classList.add('hidden');
  showMovingBlockAndMapContainer();
  setTimeout(() => {
    hideGenerateArea();
    hideViewArea();
    showCharacterNFTArea();
    loadChainInfo();
    hideMintArea();
    showBackButton();
  }, 233);
  // generatePoem(responseData);
};


// post generation setting
const generateMap = async () => {
  progress.style.display = 'block';
  const mapSetting = await generationSetting();
  if (await isSettingError(mapSetting)) {
    drawOriginalMap();
    return;
  }

  hideViewArea();

  const params = new URLSearchParams({
    source: mapSetting.dataSource,
  }).toString();
  const url = genMapURL + '?' + params;
  const data = {
    block_number: mapSetting.blockNumber,
    // only rule 1 now
    rule: mapSetting.rules[0],
  };

  mintData.block_number = data.block_number;
  mintData.rule = data.rule;

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
  originalMap.classList.add('hidden');
  showMovingBlockAndMapContainer();
  setTimeout(() => {
    hideGenerateArea();
    showBackButton();
    showMintButtonAndInputs();
  }, 233);
  // generatePoem(responseData);
};

const reloadPage = () => {
  window.location.reload();
};

// reset moving block
const resetMovingBlock = () => {
  movingBlock.style.transition = 'top 666ms ease-in-out 0s';
  movingBlock.style.top = '0';
  movingBlock.style.left = '0';
  setTimeout(() => {
    movingBlock.style.transition = 'none';
  }, 2000);
};

// hide mint button and mint inputs, show generate inputs, reset mint info
const showGenerateInputs = () => {
  showGenerateArea();
  hideCharacterNFTArea();
  hideMintArea();
  generateButton.classList.add('mx-10');
  generateButton.classList.remove('mx-10');
  alert.classList.add('mx-10');
  alert.classList.remove('mx-5');
  // generateButton.innerText = 'Generate!';
  resetMovingBlock();
  // generateButton.addEventListener('click', generateMap);
};

// show mint button and mint inputs, hide generate inputs
const showMintButtonAndInputs = async () => {
  hideGenerateArea();
  await loadChainInfo();
  showCharacterNFTArea();
  showMintArea();
  generateButton.classList.remove('mx-10');
  generateButton.classList.add('mx-10');
  alert.classList.remove('mx-10');
  alert.classList.add('mx-5');
  // generateButton.innerText = 'BACK';
  // generateButton.removeEventListener('click', generateMap);
  // generateButton.addEventListener('click', showGenerateInputs);
};

const mintSetting = () => {
  mintName = mintNameNode.value ? mintNameNode.value : 'leeduckgo';
  mintAddress = mintAddressNode.value ? mintAddressNode.value : '0x0';
  mintCoupon = mintCouponNode.value ? mintCouponNode.value : 'nocoupon';
  mintDescription = mintDescription.value ? mintDescription.value : '';

  mintData.description = mintDescription;

  return {
    minter_name: mintName,
    minter_address: mintAddress,
    coupon_id: mintCoupon,
    description: mintDescription,
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
  let mintContractDisplay = tokenInfo.contract_addr;
  let mintNameDisplay = tokenInfo.minter_name;
  let mintTokenIdDisplay = tokenInfo.token_id;
  let mintTransactionIdDisplay = tokenInfo.tx_id;
  let mintUrl = 'https://polygonscan.com/tx/' + mintTokenIdDisplay;
  showCharacterNFTArea();
  showMintArea();
  document.querySelector('#mint-contract_addr').innerText = 'Contract Address: ' + mintContractDisplay;
  document.querySelector('#mint-minter_name').innerText = 'Minter Name: ' + mintNameDisplay;
  document.querySelector('#mint-token_id').innerText = 'Token ID: ' + mintTokenIdDisplay;
  document.querySelector('#mint-tx_id').innerText = 'Transaction ID: ' + mintTransactionIdDisplay;

  generateButton.classList.add('hidden');
  // inputs.innerHTML += `
  //   <div class="mx-5 my-5 rule-border" id='rules'>
  //     <label class="label my-2">
  //       <span class="label-text" style="margin-left: 1.25rem"><b>Minter name: </b><br/>${mintNameDisplay}</span>
  //     </label>
  //     <label class="label my-2">
  //       <span class="label-text" style="margin-left: 1.25rem"><b>Contract Address: </b><br/>${mintContractDisplay}</span>
  //     </label>
  //     <label class="label my-2">
  //       <span class="label-text" style="margin-left: 1.25rem"><b>Token id: </b><br/>${mintTokenIdDisplay} </span>
  //     </label>
  //     <a class="block link link-accent mx-5 my-2 text-center" style="margin-bottom: 1rem;" href=${mintUrl}>Tx on Polygonscan</a>
  //   </div>
  // `;
  // inputs.innerHTML +=
  //   '<button class="btn btn-secondary mx-5 my-5" id="reset">Reset!</button> ';
  // document.getElementById('reset').addEventListener('click', reloadPage);
};

// mint map
const mintMap = async () => {
  const mintUrl = 'https://polygonscan.com/address/0x9c0C846705E95632512Cc8D09e24248AbFd6D679#writeContract';
  window.open(mintUrl, '_blank').focus();
  // progress.classList.add('hidden');
  // const setting = mintSetting();
  // const params = new URLSearchParams({
  //   coupon_id: setting.coupon_id,
  //   minter_name: setting.minter_name,
  //   minter_addr: setting.minter_address,
  // }).toString();
  // const url =
  //   'https://map.noncegeek.com/tai_shang_world_generator/api/v1/mint?' + params;

  // const data = {
  //   block_number: mintData.block_number,
  //   rule: mintData.rule,
  //   source: mintData.source,
  //   // description: mintData.description,
  // };

  // const response = await axios.post(url, data).catch((err) => {
  //   console.log(err);
  //   clearProgress();
  // });

  // const responseData = response.data;
  // showMintInfo(responseData);
  // clearProgress();
};

const loadChainInfo = async () => {
  const response = await axios.get(loadChainURL).catch((err) => {
    console.log(err);
  });

  window.chains = response.data.chains;

  const chainsDropDown = document.querySelector('#chains');
  const chainsChildren = chainsDropDown.children[0];
  for (let i = 0; i < chains.length; i++) {
    const chain = chains[i].name;

    let newNode = chainsChildren.cloneNode();
    newNode.value = chain;
    newNode.innerText = chain;

    chainsDropDown.appendChild(newNode);
  }
  chainsDropDown.removeChild(chainsChildren);

  const contractsDropDown = document.querySelector('#contracts');
  const contractsChildren = contractsDropDown.children[0];
  let contract_addrs = chains[0].contract_addrs;
  for (let i = 0; i < contract_addrs.length; i++) {
    const chain = contract_addrs[i];

    let newNode = contractsChildren.cloneNode();
    newNode.value = chain;
    newNode.innerText = chain;

    contractsDropDown.appendChild(newNode);
  }
  contractsDropDown.removeChild(contractsChildren);
}

// TODO: 选择另一个 chain 之后，contracts 也要对应更新

const loadCharacterNFT = async () => {
  const characterNFTTokenID = document.querySelector('#character-nft-token-id').value;
  if (!characterNFTTokenID) {
    return;
  }

  const chainName = document.querySelector('#chains').value;
  const contractAddr = document.querySelector('#contracts').value;
  const url = `${loadCharacterURL}?chain_name=${chainName}&contract_addr=${contractAddr}&token_id=${characterNFTTokenID}`;

  const response = await axios.get(url).catch((err) => {
    console.log(err);
  });

  const responseData = response.data;

  if (responseData.error_code !== 0) {
    return;
  }

  window.characterNFTs = responseData.result.character_info;

  document.querySelector('#character-nft .nft-info').classList.remove('hidden');
  document.querySelector('#character-nft .nft-info .character-badge').innerText = characterNFTs.badges[0];
  document.getElementById('hero-name').innerText = characterNFTs.badges[0]
  document.querySelector('.character-avatar img').src = './assets/img/meme/' + characterNFTs.badges[0] + '.png';
  document.querySelector('#character-nft .nft-info .character-description').innerText = characterNFTDescriptions[characterNFTs.badges[0]];
}

const showHome = () => {
  hideCharacterNFTArea();
  hideMintArea();
  hideBackButton();
  showGenerateArea();
  showViewArea();
}

// TODO: 将这类隐藏/显示 DOM 的函数统一为两个函数
const hideBackButton = () => {
  document.querySelector('#back').classList.add('hidden');
}

const showBackButton = () => {
  document.querySelector('#back').classList.remove('hidden');
}

const hideGenerateArea = () => {
  document.querySelector('#inputs').classList.add('hidden');
}

const showGenerateArea = () => {
  document.querySelector('#inputs').classList.remove('hidden');
}

const hideViewArea = () => {
  document.querySelector('#view-area').classList.add('hidden');
}

const showViewArea = () => {
  document.querySelector('#view-area').classList.remove('hidden');
}

const hideCharacterNFTArea = () => {
  let loadCharacterNFTButton = document.querySelector('#load-character-nft');
  loadCharacterNFTButton.removeEventListener('click', loadCharacterNFT);
  document.querySelector('#character-nft .nft-info').classList.add('hidden');
  document.querySelector('#character-nft').classList.add('hidden');
}

const showCharacterNFTArea = () => {
  document.querySelector('#character-nft').classList.remove('hidden');
  let loadCharacterNFTButton = document.querySelector('#load-character-nft');
  loadCharacterNFTButton.addEventListener('click', loadCharacterNFT);
}

const hideMintArea = () => {
  document.querySelector('#mint-area').classList.add('hidden');
}

const showMintArea = () => {
  document.querySelector('#mint-area').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', async function () {
  drawOriginalMap();
  await getBlockNumberSetting();
  await getDataSourceSetting();
  generateButton.addEventListener('click', generateMap);
  backButton.addEventListener('click', showHome);
  mintButton.addEventListener('click', mintMap);
  viewButton.addEventListener('click', viewMap);
});
