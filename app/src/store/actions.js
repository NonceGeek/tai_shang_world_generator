
export function setProgress (data) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_PROGRESS', data: data })
  }
}

export function setPage (data) {
    return (dispatch, getState) => {
      dispatch({ type: 'SET_PAGE', data: data })
    }
  }