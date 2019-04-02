import defaultTheme from '../../containers/screens/Stocks/lightTheme';
import dark_theme from '../../containers/screens/Stocks/darkTheme';
import light_theme from '../../containers/screens/Stocks/lightTheme';
import * as globals from '../../lib/globals';

const defaultState = {
    // theme: (globals.checkThemeInOfflineMode()) ? light_theme : dark_theme, 
    theme: light_theme, 
};

export default function changeTheme_red(state = defaultState, action) {

    switch (action.type) {
        case 'CHANGE_THEME':
            return Object.assign({}, state, {
                theme: action.theme, 
            });
        default:
            return state;
    }
}
