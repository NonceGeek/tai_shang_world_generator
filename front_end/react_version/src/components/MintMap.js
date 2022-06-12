import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Web3ModalSetup } from '../helpers';
import { ethers, providers } from 'ethers';
import { MAP_CONTRACT_ADDRESS } from '../constants';

export default function MintMap() {
  let mapNFT = useSelector(state => state.mapNFT);
  const mintMap = async () => {
    const mintUrl = 'http://map_nft_gallery.noncegeek.com/';
    window.open(mintUrl, '_blank').focus();
  }

  const [owner, setOwner] = useState('');

  const getNFTOwner = async (tokenId) => {
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
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "ownerOf",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
      }
    ];
    console.log(tokenId)
    const contract = new ethers.Contract(MAP_CONTRACT_ADDRESS, abi, signer);
    let nftOwner = await contract.ownerOf(tokenId).catch((err) => {
      console.log(err);
      return;
    });
    if (nftOwner === undefined || nftOwner === '') {
      console.error(`cannot get mapNFT for token: ${tokenId}`);
      return;
    }
    return { nftOwner };
  }

  const loadOwner = async () => {
    let { nftOwner } = await getNFTOwner(mapNFT.token_id)
    console.log(nftOwner)
    setOwner(nftOwner)
  }

  useEffect(() => {
    loadOwner()
  }, [mapNFT]);

  return (
    // <!-- Mint action -->
    <div className="form-control flex" id="mint-area">
      {mapNFT.token_id === 0 ? (
        <>
          <div className="divider mx-5 opacity-50"></div>
          <button className="btn btn-accent mx-5 my-5" id="mint" onClick={mintMap}>Mint map as NFT</button>
        </>) : (
        <>
          <div className="divider mx-5 opacity-50"></div>
          <div className="mx-5">TOKEN ID: {mapNFT.token_id}</div>
          {owner && <div className="mx-5">Owner: {owner}</div>}
        </>)
      }
    </div>
  );
}