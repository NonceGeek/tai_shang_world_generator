import { combineReducers } from 'redux'
import defaultState from './state.js'

function progress (state = defaultState.progress, action) {
  switch (action.type) {
    case 'INCREMENT':
      return action.data
    default:
      return state
  }
}

export default combineReducers({
  progress
})