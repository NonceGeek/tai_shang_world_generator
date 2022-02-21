import { useState } from 'react';

export default function GenMap() {
  let [mapState, setMapState] = useState({chainSource: '', blockNumber: '', rule: 'RuleA'});
  const handleChainSource = (e) => setMapState({...mapState, chainSource: e.target.value});
  const handleBlockNumber = (e) => setMapState({...mapState, blockNumber: e.target.value});
  const handleRuleChange = (e) => setMapState({...mapState, rule: e.target.value});

  const generate = () => {
    console.log('generate');
  }
  return (
    <div>
      {/* <!-- Generate map inputs --> */}
      <div className="form-control flex" id="inputs">
        {/* <!-- Block number input --> */}
        <input
          type="text"
          placeholder="Block number #"
          className="input input-bordered mx-10 my-5"
          id="block-number"
          value={ mapState.blockNumber }
          onChange={ handleBlockNumber }
        />
        {/* <!-- Chain source input --> */}
        <input
          type="text"
          placeholder="Data source @"
          className="input input-bordered mx-10 my-5"
          id="data-source"
          value={ mapState.chainSource }
          onChange={ handleChainSource }
        />
        {/* <!-- Rules selector --> */}
        <div className="mx-10 my-5 rule-border" id="rules">
          <label className="label my-2">
            <span className="label-text" style={{ marginLeft: '1.25rem' }}>Rules:</span>
          </label>
          <label className="cursor-pointer label mx-5 my-1">
            <span className="label-text">Rule A</span>
            <input
              type="radio"
              name="rule"
              value="RuleA"
              className="rules checkbox checkbox-primary"
              id="RuleA"
              checked={ mapState.rule === 'RuleA' }
              onChange={ handleRuleChange }
            />
          </label>
          <label className="cursor-pointer label mx-5 my-1">
            <span className="label-text">Rule B</span>
            <input
              type="radio"
              name="rule"
              value="RuleB"
              className="rules checkbox checkbox-primary"
              id="RuleB"
              checked={ mapState.rule === 'RuleB' }
              onChange={ handleRuleChange }
            />
          </label>
        </div>
        {/* <!-- Submit button --> */}
        <button className="btn btn-primary mx-10 my-5" id="generate" onClick={generate}>
          GENERATE!
        </button>
      </div>
    </div>
  );
}