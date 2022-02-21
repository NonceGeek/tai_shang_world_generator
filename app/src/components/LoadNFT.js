import { useEffect, useState } from "react";
import { loadChainURL, loadCharacterURL } from "../constants";
import axios from "axios";

export default function LoadNFT() {
  let [chainsData, setChainsData] = useState([]);
  let [chains, setChains] = useState([]);
  let [characterNFTs, setCharacterNFTs] = useState({});
  let [contracts, setContracts] = useState([]);
  const [nftState, setNftState] = useState({ chainName: '', contractAddr: '', tokenId: '' });

  const handleChainChange = (e) => {
    let contractList = chainsData.find(item => item.name === e.target.value).contract_addrs;
    setContracts(contractList);
    setNftState({
      ...nftState,
      chainName: e.target.value,
      contractAddr: contractList[0]
    });
  }
  const handleTokenIdChange = (e) => setNftState({
    ...nftState,
    tokenId: e.target.value
  });
  const handleContractChange = (e) => setNftState({
    ...nftState,
    contractAddr: e.target.value
  });

  const loadChainInfo = async () => {
    const response = await axios.get(loadChainURL).catch((err) => {
      console.log(err);
    });
    chainsData = response.data.chains;
    // chainsData = [{contract_addrs: ['a1', 'a2'], name: 'a'}, {contract_addrs: ['b1', 'b2'], name: 'b'}]
    setChainsData(chainsData);
    setChains(chainsData.map((chain) => { return chain.name }));
    setContracts(chainsData[0].contract_addrs);
    nftState.chainName = chainsData[0].name;
    nftState.contractAddr = chainsData[0].contract_addrs[0];
  };

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

  useEffect(() => {
    loadChainInfo();
  }, [])

  // 选择另一个 chain 之后，contracts 也要对应更新
  const loadCharacterNFT = async () => {
    if (!nftState.tokenId) {
      return;
    }
    const url = `${loadCharacterURL}?chain_name=${nftState.chainName}&contract_addr=${nftState.contractAddr}&token_id=${nftState.tokenId}`;
    const response = await axios.get(url).catch((err) => {
      console.log(err);
    });
    const responseData = response.data;
    if (responseData.error_code !== 0) {
      return;
    }
    setCharacterNFTs(responseData.result.character_info);
  }

  return (
    // <!-- Load character NFT -->
    <div className="form-control flex" id="character-nft">
      <div className="divider mx-5 opacity-50"></div>
      {/* <!-- Dropdown of chains -->
      <!-- style: https://tailwindui.com/components/application-ui/elements/dropdowns --> */}
      <select name="chains" id="chains" onChange={handleChainChange} value={nftState.chainName} className="mx-5 my-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
        {/* <option className="dropdown-option mx-5 my-3 block font-medium text-gray-700 px-4 py-2 text-sm" value="option">option</option> */}
        {chains.map((chain, index) => <option className="dropdown-option mx-5 my-3 block font-medium text-gray-700 px-4 py-2 text-sm" key={index} value={chain}>{chain}</option>)}
      </select>
      {/* <!-- Dropdown of contracts --> */}
      <select name="contracts" id="contracts" onChange={handleContractChange} value={nftState.contractAddr} className="mx-5 my-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
        {/* <option className="dropdown-option mx-5 my-3 block font-medium text-gray-700 px-4 py-2 text-sm" value="option">option</option> */}
        {contracts.map((contract, index) => <option className="dropdown-option mx-5 my-3 block font-medium text-gray-700 px-4 py-2 text-sm" key={index} value={contract}>{contract}</option>)}
      </select>
      {/* <!-- Input Token ID --> */}
      <input
        type="text"
        placeholder="Token ID :"
        className="input input-bordered mx-5 my-3"
        id="character-nft-token-id"
        value={nftState.tokenId}
        onChange={handleTokenIdChange}
      />
      {/* <!-- Load --> */}
      <button className="btn btn-accent mx-5 my-3" id="load-character-nft" onClick={loadCharacterNFT}>LOAD</button>

      {/* <!-- Character NFT Detail --> */}
      {characterNFTs?.badges &&
        <div className="flex flex-col mx-5 my-3 p-5 border nft-info">
          <div className="character-badge">{characterNFTs.badges[0]}</div>
          <div className="character-avatar my-2 w-full">
            <img src={`../assets/img/meme/${characterNFTs.badges[0]}.png`} alt="avatar" />
          </div>
          <div className="character-description">{characterNFTDescriptions[characterNFTs.badges[0]]}</div>
        </div>
      }
    </div>
  );
}