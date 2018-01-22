import React from 'react'
import ReactDOM from 'react-dom'
import getRoutes from 'config/routes'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { checkIfAuthed } from 'helpers/auth'
import * as reducers from 'redux/modules'

const loadState = () => {
  try{
    const serializedState = localStorage.getItem('state');
    if(serializedState === null){
      return undefined;
    }
    return JSON.parse(serializedState)
  }catch(err) {
    return undefined;
  }
}

const saveState = (state) => {
  try{
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state',serializedState);
  }catch(err){
    //
  }
}

const persistedState = loadState();

const store = createStore(combineReducers(reducers), persistedState, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : (f) => f
))

store.subscribe(() => {
  saveState(store.getState());
})

function checkAuth (nextState, replace) {
  const isAuthed = checkIfAuthed(store)
  const nextPathName = nextState.location.pathname
  if (nextPathName === '/') {
      replace('/auth')
  } else {
    if (isAuthed !== true) {
      replace('/auth')
    }
  }
}

ReactDOM.render(
  <Provider store={store}>
    {getRoutes(checkAuth)}
  </Provider>,
document.getElementById('app'))
