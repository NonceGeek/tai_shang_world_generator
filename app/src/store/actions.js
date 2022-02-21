
export function setProgress (data) {
  return (dispatch, getState) => {
    dispatch({ type: 'INCREMENT', data: data })
  }
}