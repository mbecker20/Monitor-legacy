import ReactDOM from 'react-dom'
import App from './App'
import configureBackend from './configureBackend/configureBackend'
import { createRouter } from 'kbin-router'
import { createStaticStore } from 'kbin-state'
import rootReducer from './state/rootReducer'
import initializer from './state/initializer'
import { effects } from './state/effects'
import './index.css'
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import addBaseRoutes from './addRoutes'
import { HotkeysProvider } from '@blueprintjs/core'

export const IS_MOBILE = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
export const IS_IPAD = /iPad/i.test(navigator.userAgent)
export const IS_SAFARI = navigator.userAgent.indexOf("Safari") !== -1

export const {
  deploymentManager, buildManager, serverManager, updateManager, collectionManager,
  changeUsernamePassword, jwtLogin, createLocalUser, getUser, 
  localLogin, logout, githubLogin
} = configureBackend()

export const {
  navigate, initialize, Router, addRoute, removeRoute,
  addRoutes, getPath, useRouter, softNavigate,
  replaceNavigate, softReplaceNavigate, 
  removeAllRoutes, addObjectRoutesByName
} = createRouter('Monitor')

export const {
  dispatch, useSelector, useFullSelector, useIsInitialized, select,
  resetState, reInitialize
} = createStaticStore(rootReducer, initializer, effects)

addBaseRoutes()

ReactDOM.render(
  <HotkeysProvider>
    <App />
  </HotkeysProvider>,
  document.getElementById('root')
);
