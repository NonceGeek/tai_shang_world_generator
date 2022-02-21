import { useState } from 'react';

export default function ViewMap() {
  let [mapState, setMapState] = useState({tokenId: '', contractId: ''});
  const handleTokenId = (e) => setMapState({...mapState, tokenId: e.target.value});
  const handleContractId = (e) => setMapState({...mapState, contractId: e.target.value});
  return (
    // <!-- View map -->
    <div className="form-control flex" id="view-area">
      <div className="divider mx-10 opacity-50"></div>
      <label id="token-id-label" htmlFor="token-id" className="label mx-10">Token ID:</label>
      <input
        type="text"
        name="token-id"
        value="1"
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
        value="1"
        placeholder="Contract id :"
        className="input input-bordered mx-10 my-1"
        id="contract-id"
        value={ mapState.contractId }
        onChange={ handleContractId }
      />
      <button className="btn btn-info mx-10 my-5" id="view">View!</button>
    </div>
  );
}