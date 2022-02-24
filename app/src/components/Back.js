import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../store/actions";

export default function Back() {
  let dispatch = useDispatch();
  let page = useSelector(state => state.page);
  return (
    // <!-- Back to generate map inputs -->
    <div className="form-control flex" id="back">
      <button
        className="btn btn-secondary btn-outline mx-5 my-5"
        id="back-button"
        onClick={() => page === 2? dispatch(setPage(1)) : dispatch(setPage(2))}
      >
        BACK
      </button>
    </div>
  );
}