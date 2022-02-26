import Web3Modal from "web3modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import { INFURA_ID, ALCHEMY_KEY } from "../constants";

/**
  Web3 modal helps us "connect" external wallets:
**/
const web3ModalSetup = () =>
  new Web3Modal({
    network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
    cacheProvider: true,
    theme: "light",
    providerOptions: {
      // walletconnect: {
      //   package: WalletConnectProvider, // required
      //   options: {
      //     bridge: "https://polygon.bridge.walletconnect.org",
      //     infuraId: INFURA_ID,
      //     rpc: {
      //       10: "https://mainnet.optimism.io", // xDai
      //       100: "https://rpc.gnosischain.com", // xDai
      //       137: "https://polygon-rpc.com",
      //       31337: "http://localhost:8545",
      //       42161: "https://arb1.arbitrum.io/rpc",
      //       80001: "https://rpc-mumbai.maticvigil.com"
      //     },
      //   },
      // }
    },
  });

export default web3ModalSetup;
