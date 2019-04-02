import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import showModal_red from './redux/reducer/showModal_red';
import claneLoader_red from './redux/reducer/claneLoader_red';
import changeTheme_red from './redux/reducer/changeTheme_red';
import changeTabColor_red from './redux/reducer/changeTabColor_red';
import checkMarketStatus_red from './redux/reducer/checkMarketStatus_red';
import showModalSearchBar_red from './redux/reducer/showModalSearchBar_red';
import showModalSelectBankAccount_red from './redux/reducer/showModalSelectBankAccount_red';
import showModalNewsSearchBar_red from './redux/reducer/showModalNewsSearchBar_red';
import showAndroidWebViewModal_red from './redux/reducer/showAndroidWebViewModal_red';

const appReducer = combineReducers({
    showModal_red: showModal_red,
    claneLoader_red: claneLoader_red,
    changeTheme_red: changeTheme_red,
    changeTabColor_red: changeTabColor_red,
    checkMarketStatus_red: checkMarketStatus_red,
    showModalSearchBar_red: showModalSearchBar_red,
    showModalSelectBankAccount_red: showModalSelectBankAccount_red,
    showModalNewsSearchBar_red: showModalNewsSearchBar_red,
    showAndroidWebViewModal_red: showAndroidWebViewModal_red,

});

const middleware = applyMiddleware(thunk);

const store = createStore(
    appReducer,
    compose(middleware, window.devToolsExtension ? window.devToolsExtension() : f => f),
);

export default store;
