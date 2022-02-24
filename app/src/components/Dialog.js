import { useDispatch, useSelector } from 'react-redux';
import { setDialog } from "../store/actions";

export default function Dialog(props) {
  let dispatch = useDispatch();
  let dialog = useSelector(state => state.dialog);
  
  const closeNpcDialog = () => {
    dispatch(setDialog({...dialog, display: false}));
  }
  return (
    <div className="dialog" hidden={!dialog.display}>
      <div className="dialog-content" dangerouslySetInnerHTML={{__html: dialog.content}}></div>
      <div className="dialog-actions">
        <div className="dialog-action-no" onClick={closeNpcDialog}>{dialog.noContent}</div>
        <div className="dialog-action-yes" onClick={closeNpcDialog}>{dialog.yesContent}</div>
      </div>
    </div>
  );
}