const WELCOME_SEEN     = 'WELCOME_SEEN'
const DASHBOARD_DONE   = 'DASHBOARD_DONE'
const GET_UI_CONTEXT   = 'GET_UI_CONTEXT'
const FETCHING_CONTEXT_FAILURE = 'FETCHING_CONTEXT_FAILURE'
const FETCHING_CONTEXT_SUCCESS = 'FETCHING_CONTEXT_SUCCESS'

const initialState = {
      welcomeSeen: false,
      dashboardSetup: false,
      discoverySetup: false,
      policySetup: false,
}

export function updateWelcomeSeen () {
  return {
    type: WELCOME_SEEN,
  }
}

export function updateDashboardSetup () {
  return {
    type: DASHBOARD_DONE,
  }
}

export function getUIContext() {
  return {
    type: 'GET_UI_CONTEXT',
  }
}

function fetchingUserSuccess (welcomeSeen, dashboardSetup, discoverySetup, policySetup) {
  return {
    type: FETCHING_CONTEXT_SUCCESS,
    welcomeSeen,
    dashboardSetup,
    discoverySetup,
    policySetup,
  }
}

export function fetchUserContext (welcomeSeen, dashboardSetup, discoverySetup, policySetup) {
  console.log("welcomeSeen:"+welcomeSeen)
  return function (dispatch) {
    dispatch(fetchingUserSuccess (welcomeSeen, dashboardSetup, discoverySetup, policySetup))
  }
}

export function setWelcomeSeen() {
  return function (dispatch) {
      dispatch(updateWelcomeSeen ())
  }
}

export function setDashboardSetup() {
  return function (dispatch) {
      dispatch(updateDashboardSetup ())
  }
}

export default function context (state = initialState, action) {
  switch (action.type) {
    case GET_UI_CONTEXT :
      return state

    case WELCOME_SEEN :
      return {
        ...state,
        welcomeSeen: true,
      }
      
    case DASHBOARD_DONE :
      return {
        ...state,
        dashboardSetup: true,
      }

    case FETCHING_CONTEXT_FAILURE:
      return state

    case FETCHING_CONTEXT_SUCCESS:
      return {
        ...state,
        welcomeSeen: action.welcomeSeen,
        dashboardSetup: action.dashboardSetup,
        discoverySetup: action.discoverySetup,
        policySetup: action.policySetup,
      }

    default :
      return state
  }
}