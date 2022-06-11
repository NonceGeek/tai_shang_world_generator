export default {
  progress: {
    value: 0,
    display: false
  },
  alert: {
    display: false,
    message: ''
  },
  page: 1,
  mapData: {
    map: [],
    type: '',
    ele_description: {},
    events: [],
    map_type: 'event'
  },
  mapSeed: {
    chainSource: 'a_block',
    blockNumber: '',
    type: 'event'
  },
  dialog: {
    display: false,
    content: '',
    yesContent: '',
    noContent: '',
    onYes: null,
    onNo: null
  },
  hero: {
    name: '',
    position: {left: 0, top: 0}
  },
  account: {
    address: '',
    connected: false,
    loggedIn: false
  }
}