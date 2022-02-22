
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

export function setMapData (data) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_MAP_DATA', data: data })
  }
}

export function setMapSeed (data) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_MAP_SEED', data: data })
  }
}