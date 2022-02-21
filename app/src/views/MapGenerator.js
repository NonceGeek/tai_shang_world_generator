import { Map, GenMap, ViewMap, MintMap, LoadNFT, Back, ProgressBar } from "../components";
import { useSelector } from "react-redux";

function App() {
  let page = useSelector(state => state.page);
  return (
    <div style={{display: 'flex'}}>
      <Map />
      {/* <!-- Inputs --> */}
      <div style={{ width: 'calc(20% - 1rem)', maxHeight: '100vh', marginLeft: '10px'}}>
        { page === 1 && 
          <span>
            <GenMap />
            <ViewMap />
          </span>
        }
        { page === 2 &&
          <div>
            <Back />
            <MintMap />
            <LoadNFT />
          </div>
        }
      </div>
      <ProgressBar />
    </div>
  );
}
export default App;