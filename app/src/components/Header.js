import { useCallback, useState, useEffect } from 'react';
import { Web3ModalSetup } from '../helpers';
import Blockies from "react-blockies";
import { providers } from "ethers";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { setDialog, setAccount } from '../store/actions';

export default function Header() {
  let dispatch = useDispatch();

  let account = useSelector(state => state.account);
  const web3Modal = Web3ModalSetup();
  const [injectedProvider, setInjectedProvider] = useState();
  const [web3Provider, serWeb3Provider] = useState();

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    dispatch(setAccount({connected: false, loggedIn: false, address: ''}));
  };

  const signMessage = async (message) => {
    let signer = web3Provider.getSigner();
    let signature = await signer.signMessage(message);
    return signature;
  }

  const signinWithSignature = useCallback(async () => {
    // signin with signature
    await signMessage("I authorize signing from this device")
    
    // const user = await axios.get("/api/auth?address=" + account.address)
    //   .then((res) => res.json());

    // const data = axios.post("/api/verify", {
    //   address: account.address,
    //   signature: await signMessage(user.message),
    // }).then((res) => res.json());
    // // set login status
    // dispatch(setAccount({...account, loggedIn: data.authenticated}));
  })

  const toggleSingin = () => {
    dispatch(setDialog({
      display: true,
      content: "Skip approving every interaction with your wallet by allowing TaiShangWorldGenerator to remember you.",
      yesContent: "Remember me",
      onYes: signinWithSignature
    }));
  }

  const loadWeb3Modal = useCallback(async () => {
    
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider)
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
  
    serWeb3Provider(web3Provider);

    dispatch(setAccount({...account, address: address, connected: true}));

    // toggle login modal
    if (!account.loggedIn) {
      toggleSingin();
    }
    
    const network = await web3Provider.getNetwork()
    setInjectedProvider(web3Provider);

    provider.on("chainChanged", chainId => {
      // console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      // console.log(`account changed!`);
      setInjectedProvider(new providers.Web3Provider(provider));
    });

    // Subscribe to provider connection
    provider.on("connect", () => {
      // console.log("connect");
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider, account.connected]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      dispatch(setAccount({...account, connected: true}));
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const ellipseAddress = (address = '', width = 10) => {
    if (!address) {
      return ''
    }
    return `${address.slice(0, width)}...${address.slice(-width)}`
  }

  return (
    <div id="header">
      <div id='logo'></div>
      <div id="account" className='my-5'>
        { account.connected && web3Modal && web3Modal.cachedProvider ? (
          <>
          <div id='avatar'><Blockies seed={account.address.toLowerCase()} size={16} scale={2} /></div>
          <p>{ellipseAddress(account.address)}</p>
          <div id='disconnect' onClick={logoutOfWeb3Modal}>Disconnect</div>
          </>
        ):(
          <div className="btn btn-info btn-sm mx-5" id="connect" onClick={loadWeb3Modal}>
            Connect Wallet
          </div>
        )}
      </div>

      <style jsx="true">{`
      #header {
        margin-top: 10px;
        margin-bottom: 10px;
        width: 100%;
        height: 120px;
        max-height: 1000px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
      }

      #account {
        display: flex;
        align-items: center;
        position: relative;
        font-weight: 500;
        margin-right: 10px;
      }
      
      #avatar {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        overflow: hidden;
        margin-right: 10px;
      }

      #account > p {
        transition: all 0.2s ease-in-out 0s;
        font-weight: bold;
        margin: -2px auto 0.7em;
        // font-size: 1em;
      }

      #disconnect {
        transition: all 0.15s ease-in-out 0s;
        font-size: 12px;
        font-family: monospace;
        position: absolute;
        right: 0px;
        top: 20px;
        cursor: pointer;
        opacity: 1;
        pointer-events: auto;
      }
      #disconnect:hover {
        transform: translateY(-1px);
        opacity: 0.5;
      }
      `}</style>
    </div>
  );
}