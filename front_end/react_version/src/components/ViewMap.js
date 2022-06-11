import { useState, useEffect } from 'react';
import { genMapURL, MAP_CONTRACT_ADDRESS } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setMapSeed, setMapData, setProgress, setPage } from "../store/actions";
import { ethers, providers } from 'ethers';
import axios from 'axios';
import { Web3ModalSetup } from '../helpers';
import { encode, decode } from 'js-base64';
import XMLParser from 'react-xml-parser';
import { eventsURL } from '../constants';

export default function ViewMap() {
  const queryParams = new URLSearchParams(window.location.search);
  const tokenId = queryParams.get('t_id');
  const contractId = queryParams.get('contract_id');
  let dispatch = useDispatch();
  let mapSeed = useSelector(state => state.mapData.mapSeed);
  let [mapState, setMapState] = useState({
    tokenId: tokenId === null ? 1 : tokenId,
    contractId: contractId === null ? MAP_CONTRACT_ADDRESS : contractId
  });

  // let [blockHeight, setBlockHeight] = useState(0);
  // let [mapType, setMapType] = useState('event');
  let progress = useSelector(state => state.progress);
  const handleTokenId = (e) => setMapState({...mapState, tokenId: e.target.value});
  const handleContractId = (e) => setMapState({...mapState, contractId: e.target.value});

  const startProgress = (maxProgress) => {
    // dispatch(setProgress({...progress, display: true}));
    if (maxProgress === 0) {
      progress.value = 0;
    }
    let timer = setInterval(() => {
      progress.value++;
      dispatch(setProgress({display: true, value: progress.value}));
      if (progress.value >= maxProgress) {
        if (maxProgress === 100) {
          setTimeout(dispatch(setProgress({display: false, value: 0})), 1000);
        }
        clearInterval(timer);
      }
    }, 35);
  };

  useEffect(() => {
    if (tokenId || contractId) {
      console.log(tokenId, contractId);
      viewMap()
    }
  }, [])

  const clearProgress = () => {
    dispatch(setProgress({display: false, value: 0}));
  };

  const getNFTTokenURI = async (tokenId, contractAddr) => {
    
    const web3Modal = Web3ModalSetup();
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider)
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();

    const abi = [
      {
        "constant": true,
        "inputs": [
          {
            "name": "_tokenId",
            "type": "uint256"
          }
        ],
        "name": "tokenURI",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
      },
    ];

    const contract = new ethers.Contract(contractAddr, abi, signer);

    const response = await contract.tokenURI(tokenId).catch(err => {
      console.error(err);
      clearProgress();
      return;
    });
    if (response === undefined) {
      console.error(`cannot get data from contract: ${contractAddr} token: ${tokenId}`);
      clearProgress();
      return;
    }
    // decode base64 encoded json
    const payloadJson = response.slice("data:application/json;base64,".length);
    const jsonData = JSON.parse(decode(payloadJson));

    // setMapType(jsonData.type);
    const mapType = jsonData.type;

    // decode base64 encoded xml
    const payloadXML = jsonData.image.slice("data:image/svg+xml;base64,".length);
    var xmlData = new XMLParser().parseFromString(decode(payloadXML)); 

    // get block height
    const blockHeight = parseInt(xmlData.children[4].value.slice("block height: ".length))
    // setBlockHeight(bh)
    return [blockHeight, mapType]
  }

  const getEvents = async (block_height) => {
    const url = eventsURL + `?block_height=${block_height}`;

    const response = await axios.get(url).catch((err) => {
      console.log(err);
      clearProgress();
      return;
    });

    const responseData = response.data;
    return responseData;
  }

  // post view setting
  const viewMap = async () => {
    // progress.style.display = 'block';
    startProgress(85);

    const { tokenId, contractId } = mapState;
    const [blockHeight, mapType] = await getNFTTokenURI(tokenId, contractId);
    const events = await getEvents(blockHeight);
    const url = genMapURL;
    const data = {
      block_number: blockHeight,
      type: mapType,
      source: 'a_block'
    };
    // console.log(data)

    const response = await axios.post(url, data).catch((err) => {
      console.log(err);
      clearProgress();
      return;
    });

    const responseData = response.data;
    // console.log(responseData);
    dispatch(setMapData({...responseData.result, events: events, map_type: mapType}));
    // map.style.opacity = 0;
    dispatch(setMapSeed({...mapSeed, blockNumber: blockHeight, type: mapType}));
    startProgress(100);
  };

  return (
    // <!-- View map -->
    <div className="form-control flex" id="view-area">
      <div className="divider mx-10 opacity-50"></div>
      <label id="token-id-label" htmlFor="token-id" className="label mx-10">Token ID:</label>
      <input
        type="text"
        name="token-id"
        placeholder="Token id @"
        className="input input-bordered mx-10 my-1"
        id="token-id"
        value={ mapState.tokenId }
        onChange={ handleTokenId }
      />
      <label id="contract-id-label" htmlFor="contract-id" className="label mx-10">Contract ID:</label>
      <input
        type="text"
        name="contract-id"
        placeholder="Contract id :"
        className="input input-bordered mx-10 my-1"
        id="contract-id"
        value={ mapState.contractId }
        onChange={ handleContractId }
      />
      <button className="btn btn-info mx-10 my-5" id="view" onClick={ viewMap }>View!</button>
      <button className="btn btn-info mx-10 my-5" onClick={ ()=>{window.open("http://map_nft_gallery.noncegeek.com/gallery", '_blank').focus();} }>View All mapNFT</button>
    </div>
  );
}