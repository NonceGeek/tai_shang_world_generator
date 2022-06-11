import { useState } from 'react';
import { genMapURL } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setMapSeed, setMapData, setProgress } from "../store/actions";
import axios from 'axios';

export default function ViewMap() {
  const queryParams = new URLSearchParams(window.location.search);
  const tokenId = queryParams.get('token_id');
  const contractId = queryParams.get('contract_id');
  let dispatch = useDispatch();
  let mapSeed = useSelector(state => state.mapData.mapSeed);
  let [mapState, setMapState] = useState({
    tokenId: tokenId === undefined ? 1 : tokenId,
    contractId: contractId === undefined ? 1 : contractId
  });
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

  const clearProgress = () => {
    dispatch(setProgress({display: false, value: 0}));
  };

  // post view setting
  const viewMap = async () => {
    // progress.style.display = 'block';
    startProgress(85);
    const url = genMapURL;
    const data = {
      token_id: mapState.tokenId,
      contract_id: mapState.contractId,
    };

    const response = await axios.post(url, data).catch((err) => {
      console.log(err);
      clearProgress();
      return;
    });

    const responseData = response.data;
    console.log(responseData);
    dispatch(setMapData(responseData.result));
    // map.style.opacity = 0;
    dispatch(setMapSeed({...mapSeed, blockNumber: responseData.result.block_height}));
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
    </div>
  );
}