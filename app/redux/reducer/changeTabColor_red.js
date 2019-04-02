import * as colors from '../../assets/styles/color';
import * as globals from '../../lib/globals';

const defaultState = {
    // color: (globals.checkThemeInOfflineMode()) ? colors.white : colors.tabbarDarkTheme, 
    color: colors.white, 
};

export default function changeTabColor_red(state = defaultState, action) {

    switch (action.type) {
        case 'CHANGE_COLOR':
            return Object.assign({}, state, {
                color: action.color, 
            });
        default:
            return state;
    }
}

