import { useEffect } from 'react';
import { setProgress, setPage } from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { lastBlockNumURL, genMapURL } from '../constants';
import { setMapData, setMapSeed, setAlert } from "../store/actions";
import axios from "axios";


export default function GenMap() {
  let dispatch = useDispatch();
  let mapSeed = useSelector(state => state.mapSeed);
  let progress = useSelector(state => state.progress);
  let alert = useSelector(state => state.alert);
  const handleChainSource = (e) => dispatch(setMapSeed({...mapSeed, chainSource: e.target.value}));
  const handleBlockNumber = (e) => dispatch(setMapSeed({...mapSeed, blockNumber: e.target.value}));
  const handleRuleChange = (e) => dispatch(setMapSeed({...mapSeed, rule: e.target.value}));
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

  // get highest block now
  const getNewestBlockNumber = async () => {
    let newestBlockNumberResponse = await axios
      .get(
        lastBlockNumURL,
      )
      .catch((err) => {
        console.log(err);
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

  // handle setting source and rules error, pop alert if returns true
  const isSettingError = async (mapSetting) => {
    if (mapSetting.types.length === 0 || mapSetting.dataSource !== 'a_block') {
      dispatch(setAlert({...alert, display: true}));
      setTimeout(() => {
        dispatch(setAlert({...alert, display: false}));
      }, 3000);
      return true;
    } else {
      dispatch(setAlert({...alert, display: false}));
      return false;
    }
  };

  // get generation setting from page
  const generationSetting = async () => {
    let blockNumber = await getBlockNumberSetting(mapSeed.blockNumber);
    let dataSource = await getDataSourceSetting();
    // let rules = await getRulesSetting(rulesNodes);
    // mintData.source = dataSource;

    return {
      blockNumber: blockNumber,
      dataSource: dataSource,
      types: ['event', 'gallery'],
      // rules: ['ruleA', 'ruleB'],
    };
  };

  const drawOriginalMap = async () => {
    dispatch(setMapData({type: '', ele_description: {}, map: []}));
  }

  // post generation setting
  const generateMap = async () => {
    startProgress(0);
    const mapSetting = await generationSetting();
    startProgress(40);
    if (await isSettingError(mapSetting)) {
      drawOriginalMap();
      clearProgress();
      return;
    }

    const params = new URLSearchParams({
      source: mapSetting.dataSource,
    }).toString();
    const url = genMapURL + '?' + params;
    const data = {
      block_number: mapSetting.blockNumber,
      // only rule 1 now
      // rule: mapSetting.rules[0],
      type: mapSeed.type,
      source: mapSetting.dataSource
    };

    // mintData.block_number = data.block_number;
    // mintData.rule = data.rule;
    console.log(data);

    const response = await axios.post(url, data).catch((err) => {
      console.log(err);
      clearProgress();
      return;
    });
    startProgress(85);
    const responseData = response.data;
    // console.log(responseData);
    dispatch(setMapData(responseData.result));
    // map.style.opacity = 0;
    startProgress(100);
    
    // hideViewArea
    dispatch(setPage(2));

    clearProgress();
  };

  useEffect(() => {
    getBlockNumberSetting();
    getDataSourceSetting();
  }, [])

  return (
    <>
      {/* <!-- Generate map inputs --> */}
      <div className="form-control flex" id="inputs">
        {/* <!-- Block number input --> */}
        <input
          autoFocus
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
        {/* <!-- Type selector --> */}
        <div className="mx-10 my-5 rule-border" id="types">
          <label className="label my-2">
            <span className="label-text" style={{ marginLeft: '1.25rem' }}>Type:</span>
          </label>
          <label className="cursor-pointer label mx-5 my-1">
            <span className="label-text">Event</span>
            <input
              type="radio"
              name="type"
              value="event"
              className="types checkbox checkbox-primary"
              id="event"
              checked={ mapSeed.type === 'event' }
              onChange={ handleRuleChange }
            />
          </label>
          <label className="cursor-pointer label mx-5 my-1">
            <span className="label-text">Gallery</span>
            <input
              type="radio"
              name="type"
              value="gallery"
              className="types checkbox checkbox-primary"
              id="gallery"
              checked={ mapSeed.type === 'gallery' }
              onChange={ handleRuleChange }
            />
          </label>
        </div>
        {/* <!-- Rules selector --> */}
        {/* <div className="mx-10 my-5 rule-border" id="rules">
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
        </div> */}
        {/* <!-- Submit button --> */}
        <button className="btn btn-primary mx-10 my-5" id="generate" onClick={generateMap}>
          GENERATE!
        </button>
      </div>
    </>
  );
}