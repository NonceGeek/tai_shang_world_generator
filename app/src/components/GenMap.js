import { useState, useEffect } from 'react';
import { setProgress, setPage } from '../store/actions';
import { useDispatch } from 'react-redux';
import { lastBlockNumURL } from '../constants';
import axios from "axios";


export default function GenMap() {
  let dispatch = useDispatch();
  let [mapState, setMapState] = useState({chainSource: '', blockNumber: '', rule: 'RuleA'});
  const handleChainSource = (e) => setMapState({...mapState, chainSource: e.target.value});
  const handleBlockNumber = (e) => setMapState({...mapState, blockNumber: e.target.value});
  const handleRuleChange = (e) => setMapState({...mapState, rule: e.target.value});

  // get highest block now
  const getNewestBlockNumber = async () => {
    // startProgress(40);
    let newestBlockNumberResponse = await axios
      .get(
        lastBlockNumURL,
      )
      .catch((err) => {
        console.log(err);
        // stopAndClearProgress();
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
    let newestBlockNumberString = String(newestBlockNumber);
    let newestBlockNumberStringIndex = 0;
    setMapState({...mapState, blockNumber: newestBlockNumberString});
    // let num = ''
    // setInterval(() => {
    //   num += newestBlockNumberString.charAt(
    //     newestBlockNumberStringIndex,
    //   );
    //   setMapState({...mapState, blockNumber: num});
    //   newestBlockNumberStringIndex++;
    // }, 50);

    // blockNumberNode.focus();
    return newestBlockNumber;
  };

  // get data source setting
  const getDataSourceSetting = async () => {
    let dataSourceDefault = 'a_block';
    let dataSourceIndex = 0;
    let source = '';
    setMapState({...mapState, chainSource: dataSourceDefault});
    // setInterval(() => {
    //   source += dataSourceDefault.charAt(dataSourceIndex);
    //   setMapState({...mapState, chainSource: source});
    //   dataSourceIndex++;
    // }, 50);
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

  const generate = () => {
    console.log('generate');
    dispatch(setProgress(25));
    dispatch(setPage(2));
  }

  useEffect(() => {
    getBlockNumberSetting();
    getDataSourceSetting();
  }, [])
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