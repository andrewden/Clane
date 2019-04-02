import * as globals from '../../lib/globals';

const defaultState = {
    // marketStatus: globals.checkThemeInOfflineMode(), 
    marketStatus: true, 
};

export default function changeMarketStatus_red(state = defaultState, action) {

    switch (action.type) {
        case 'CHANGE_MARKET':
            return Object.assign({}, state, {
                marketStatus: action.marketStatus, 
            });
        default:
            return state;
    }
}

