import { useDispatch, useSelector } from 'react-redux';
import { setDialog } from "../store/actions";

export default function Dialog(props) {
  let dispatch = useDispatch();
  let dialog = useSelector(state => state.dialog);

  const closeNoDialog = () => {
    if (dialog.onNo !== undefined) { dialog.onNo(); }
    dispatch(setDialog({ ...dialog, display: false }));
  }

  const closeYesDialog = () => {
    if (dialog.onYes !== undefined) { dialog.onYes(); }
    dispatch(setDialog({ ...dialog, display: false }));
  }

  return (
    <div className="dialog" hidden={!dialog.display}>
      <div className="dialog-content" dangerouslySetInnerHTML={{ __html: dialog.content }}></div>
      <div className="dialog-actions">
        <div className="dialog-action-no" hidden={dialog.noContent === '' || dialog.noContent === undefined} onClick={closeNoDialog}>{dialog.noContent}</div>
        <div className="dialog-action-yes" hidden={dialog.yesContent === '' || dialog.yesContent === undefined} onClick={closeYesDialog}>{dialog.yesContent}</div>
      </div>
    </div>
  );
}