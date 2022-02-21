import { MintMap, LoadNFT } from "../components";

function App() {
  return (
    <div>
      {/* <Map /> */}
      {/* <!-- Inputs --> */}
      <div style={{ width: 'calc(20% - 1rem)', maxHeight: '100vh', marginLeft: '10px'}}>
        {/* <Input /> */}
        {/* <ViewMap /> */}
        {/* <Back /> */}
        <MintMap />
        <LoadNFT />
      </div>
      {/* <ProgressBar /> */}
    </div>
  );
}
export default App;