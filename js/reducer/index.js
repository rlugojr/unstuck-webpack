import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import PersistLocal from 'reducer/persist'

import html from 'reducer/html'
import js   from 'reducer/js'
import css  from 'reducer/css'
import fw   from 'reducer/fw'
import tabs from 'reducer/tabs'
import config from 'reducer/config'

import defaultState from 'reducer/initialState'
const {read, write} = PersistLocal('unstuck-webpack')
const localState = read()
const initialState = localState === null ? Object.assign({}, defaultState) : localState

const store = createStore(
  combineReducers({
    html,
    js,
    css,
    fw,
    tabs,
    config
  }),
  initialState,
  compose(
    applyMiddleware(write),
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

export default store
