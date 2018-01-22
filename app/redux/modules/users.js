import auth, {logout, getUserInfoSAAS} from '../../../app/helpers/auth'

const AUTH_USER = 'AUTH_USER'
const UNAUTH_USER = 'UNAUTH_USER'
const FETCHING_USER = 'FETCHING_USER'
const FETCHING_USER_FAILURE = 'FETCHING_USER_FAILURE'
const FETCHING_USER_SUCCESS = 'FETCHING_USER_SUCCESS'

function getUser(){
  return {
    type: 'GET_USER'
  }
}

function authUser (uid) {
  return {
    type: AUTH_USER,
    uid,
  }
}

function unauthUser () {
  return {
    type: UNAUTH_USER,
  }
}

function fetchingUser () {
  return {
    type: FETCHING_USER,
  }
}

function fetchingUserFailure (error) {
  console.warn("Warning! Login error", error, error.data.message)
  let message =  "";
   if (error.data != null && error.data.maxatt != null && error.data.maxatt){
     message = "Your account has been suspended because the number of failed logins has exceeded the limit. Please contact the administrator to activate the account";
   }
   else {
     message = 'The username or password you entered is incorrect.'
   }
  return {
    type: FETCHING_USER_FAILURE,
    error: message
  }
}

function fetchingUserSuccess (uid, user, login, timestamp) {
  return {
    type: FETCHING_USER_SUCCESS,
    uid,
    user,
    login,
    timestamp,
  }
}

export function resetUser(){
  return function (dispatch) {
    dispatch(getUser())
  }
}

export function fetchAndHandleAuthedUser (username, password) {
  return function (dispatch) {
    dispatch(fetchingUser())
    return auth(username, password)
      .then((user) => {
        console.log("authedIdauthedId", user.uid, user, username, Date.now())
        if (user.name){
          console.log("user:"+ JSON.stringify(user))
          dispatch(fetchingUserSuccess(user.uid, user, username, Date.now()))
          dispatch(authUser(user.uid))
          dispatch(getUser())
          return user.user
        } else {
          dispatch(fetchingUserSuccess(user.uid, user, username, Date.now()))
          dispatch(getUser())
          return user.user
        }
      })
      .catch((error) => {
        console.log("response.errorresponse.error 0.0", error)
        if (!error.data.license){
          dispatch(fetchingUserFailure(error))
        } else {
          return error;
        }
      })
  }
}

export function fetchAndHandleAuthedUserSAAS (userobj) {
  return function (dispatch) {
    console.log("userobj, userobjuserobj", userobj)
    dispatch(fetchingUser())
    dispatch(fetchingUserSuccess(userobj.uid, userobj, userobj.name, Date.now()))
    dispatch(authUser(user.uid))
    dispatch(getUser())
    return user.user
    // getUserInfoSAAS(username, password)
    //   .then((user) => {
    //     console.log("authedIdauthedId", user)
    //     if (user.name){
    //       console.log("user:"+ JSON.stringify(user))
    //       dispatch(fetchingUserSuccess(user.uid, user, username, Date.now()))
    //       dispatch(authUser(user.uid))
    //       dispatch(getUser())
    //       return user.user
    //     } else {
    //       dispatch(fetchingUserSuccess(user.uid, user, username, Date.now()))
    //       dispatch(getUser())
    //       return user.user
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("response.errorresponse.error 0.0", error)
    //     if (!error.data.license){
    //       dispatch(fetchingUserFailure(error))
    //     } else {
    //       return error;
    //     }
    //   })
  }
}

export function logoutAndUnauth () {
  return function (dispatch) {
    localStorage.removeItem('state');
    logout()
    dispatch(unauthUser())
  }
}

export function logoutAndUnauthWithError (error) {
  return function (dispatch) {
    logout()
    dispatch(unauthUser())
  	dispatch(sessionFailure(error))
  }
}

export function sessionFailure (error) {
  return {
    type: FETCHING_USER_FAILURE,
    error: error,
  }
}

const initialUserState = {
  lastUpdated: 0,
  info: {
    name: '',
    uid: '',
    avatar: '',
  },
}

function user (state = initialUserState, action) {
  switch (action.type) {
    case FETCHING_USER_SUCCESS :
      return {
        ...state,
        info: action.user,
        lastUpdated: action.timestamp,
        login: action.login,
      }
    default :
      return state
  }
}

const initialState = {
  isFetching: false,
  error: '',
  isAuthed: false,
  authedId: '',
}

export default function users (state = initialState, action) {
  switch (action.type) {
    case 'GET_USER' :
      return state
    case 'SET_USER':
      return{
        ...state,
        isFetching: action.loginUser.isFetching,
        error: action.loginUser.error,
        isAuthed: action.loginUser.isAuthed,
        authedId: action.loginUser.authedId,
      }
    case AUTH_USER :
      return {
        ...state,
        isAuthed: true,
        authedId: action.uid,
      }
    case UNAUTH_USER :
      return {
        ...state,
        isAuthed: false,
        authedId: '',
      }
    case FETCHING_USER:
      return {
        ...state,
        isFetching: true,
      }
    case FETCHING_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    case FETCHING_USER_SUCCESS:
      return action.user === null
        ? {
          ...state,
          isFetching: false,
          error: '',
        }
        : {
          ...state,
          isFetching: false,
          error: '',
          login: action.login,
          [action.uid]: user(state[action.uid], action),
        }
    default :
       return {
        ...state,
        error: '',
      }
  }
}
