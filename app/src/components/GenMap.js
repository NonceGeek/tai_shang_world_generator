import { useState, useEffect } from 'react';
import { setProgress, setPage } from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { lastBlockNumURL, genMapURL } from '../constants';
import { setMapData, setMapSeed } from "../store/actions";
import axios from "axios";


export default function GenMap() {
  let dispatch = useDispatch();
  let mapSeed = useSelector(state => state.mapSeed);
  const handleChainSource = (e) => dispatch(setMapSeed({...mapSeed, chainSource: e.target.value}));
  const handleBlockNumber = (e) => dispatch(setMapSeed({...mapSeed, blockNumber: e.target.value}));
  const handleRuleChange = (e) => dispatch(setMapSeed({...mapSeed, rule: e.target.value}));

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
    dispatch(setMapSeed({...mapSeed, blockNumber: newestBlockNumberString}));
    // TODO: 1. 动画；2. 聚焦
    return newestBlockNumber;
  };

  // get data source setting
  const getDataSourceSetting = async () => {
    let dataSourceDefault = 'a_block';
    dispatch(setMapSeed({...mapSeed, chainSource: dataSourceDefault}));
    // TODO: 动画
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

  // handle setting source and rules error, pop alert if returns true
  const isSettingError = async (mapSetting) => {
    if (mapSetting.rules.length === 0 || mapSetting.dataSource !== 'a_block') {
      // alert.classList.remove('opacity-0');
      // progress.style.display = 'none';
      // setTimeout(() => {
      //   alert.classList.add('opacity-0');
      // }, 3000);
      return true;
    } else {
      // alert.classList.add('opacity-0');
      return false;
    }
  };

  // get generation setting from page
  const generationSetting = async () => {
    let blockNumber = await getBlockNumberSetting(mapSeed.blockNumber);
    let dataSource = await getDataSourceSetting();
    // let rules = await getRulesSetting(rulesNodes);
    // startProgress(85);

    // mintData.source = dataSource;

    return {
      blockNumber: blockNumber,
      dataSource: dataSource,
      rules: ['ruleA', 'ruleB'],
    };
  };

  // post generation setting
  const generateMap = async () => {
    // progress.style.display = 'block';
    const mapSetting = await generationSetting();
    if (await isSettingError(mapSetting)) {
      // drawOriginalMap();
      return;
    }
    // hideViewArea
    dispatch(setPage(2));

    const params = new URLSearchParams({
      source: mapSetting.dataSource,
    }).toString();
    const url = genMapURL + '?' + params;
    const data = {
      block_number: mapSetting.blockNumber,
      // only rule 1 now
      // rule: mapSetting.rules[0],
      rule: mapSeed.rule,
    };

    // mintData.block_number = data.block_number;
    // mintData.rule = data.rule;

    const response = await axios.post(url, data).catch((err) => {
      console.log(err);
      // clearProgress();
    });
    const responseData = response.data;
    // console.log(responseData);
    dispatch(setMapData(responseData.result));
    // map.style.opacity = 0;

  };

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
          value={ mapSeed.blockNumber }
          onChange={ handleBlockNumber }
        />
        {/* <!-- Chain source input --> */}
        <input
          type="text"
          placeholder="Data source @"
          className="input input-bordered mx-10 my-5"
          id="data-source"
          value={ mapSeed.chainSource }
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
              checked={ mapSeed.rule === 'RuleA' }
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
              checked={ mapSeed.rule === 'RuleB' }
              onChange={ handleRuleChange }
            />
          </label>
        </div>
        {/* <!-- Submit button --> */}
        <button className="btn btn-primary mx-10 my-5" id="generate" onClick={generateMap}>
          GENERATE!
        </button>
      </div>
    </div>
  );
}