import {useSelector} from 'react-redux';

export default function ProgressBar() {
  let progress = useSelector(state => state.progress);
  return (
    // <!-- progress bar -->
    <div className="artboard phone fixed bottom-0 left-0 px-2" style={{width: '100vw'}}>
      <progress
        id="progress"
        className="progress progress-primary"
        value={progress}
        max="100"
        hidden={progress === 0}
      ></progress>
    </div>
  );
}