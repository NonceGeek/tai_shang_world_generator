import { combineReducers } from 'redux'
import defaultState from './state.js'

function progress (state = defaultState.progress, action) {
  switch (action.type) {
    case 'SET_PROGRESS':
      return action.data
    default:
      return state
  }
}

function page (state = defaultState.page, action) {
    switch (action.type) {
      case 'SET_PAGE':
        return action.data
      default:
        return state
    }
  }

export default combineReducers({
  progress,
  page
})