import { useState } from 'react';
import { genMapURL } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setMapSeed, setMapData } from "../store/actions";
import axios from 'axios';

export default function ViewMap() {
  let dispatch = useDispatch();
  let mapSeed = useSelector(state => state.mapData.mapSeed);
  let [mapState, setMapState] = useState({tokenId: 1, contractId: 1});
  const handleTokenId = (e) => setMapState({...mapState, tokenId: e.target.value});
  const handleContractId = (e) => setMapState({...mapState, contractId: e.target.value});

  // post view setting
  const viewMap = async () => {
    // progress.style.display = 'block';
    const url = genMapURL;
    const data = {
      token_id: mapState.tokenId,
      contract_id: mapState.contractId,
    };

    const response = await axios.post(url, data).catch((err) => {
      console.log(err);
      // clearProgress();
    });

    const responseData = response.data;
    console.log(responseData);
    dispatch(setMapData(responseData.result));
    // map.style.opacity = 0;
    dispatch(setMapSeed({...mapSeed, blockNumber: responseData.result.block_height}));
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