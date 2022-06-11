export default function MintMap() {
  const mintMap = async () => {
    const mintUrl = 'http://map_nft_gallery.noncegeek.com/';
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