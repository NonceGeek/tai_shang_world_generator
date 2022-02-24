export default function MintMap() {
  const mintMap = async () => {
    const mintUrl = 'https://polygonscan.com/address/0x9c0C846705E95632512Cc8D09e24248AbFd6D679#writeContract';
    window.open(mintUrl, '_blank').focus();
  }
  return (
    // <!-- Mint action -->
    <div className="form-control flex" id="mint-area">
      <div className="divider mx-5 opacity-50"></div>
      <button className="btn btn-accent mx-5 my-5" id="mint" onClick={mintMap}>Mint map as NFT</button>
    </div>
  );
}