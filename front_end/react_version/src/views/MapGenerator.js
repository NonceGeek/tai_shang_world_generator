import { Map, GenMap, ViewMap, MintMap, LoadNFT, Back, ProgressBar, Dialog, Alert, Header } from "../components";
import { useSelector } from "react-redux";

function App() {
  let page = useSelector(state => state.page);
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <Header />
      <div style={{minHeight: '1px', display: 'flex', marginBottom: '20px', position: 'relative'}}>
        <Map />
        {/* <!-- Inputs --> */}
        <div style={{ width: 'calc(20vw - 1rem)', maxHeight: '100vh', marginLeft: '10px'}}>
          { page === 1 && 
            <>
              <GenMap />
              <ViewMap />
              <Alert />
            </>
          }
          { page === 2 &&
            <>
              <Back />
              <MintMap />
              <LoadNFT />
              <Alert />
            </>
          }
        </div>
      </div>
      <Dialog />
      <ProgressBar />
    </div>
  );
}
export default App;