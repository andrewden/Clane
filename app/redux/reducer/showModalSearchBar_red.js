const defaultState = {
   searchbar_modal: false, 
};

export default function showModalSearchBar_red(state = defaultState, action) {

    switch (action.type) {
        case 'GET_SHOWMODALSEARCHBAR':
            return Object.assign({}, state, {
                searchbar_modal: action.searchbar_modal, 
                screen_name: action.screen_name,
            });
        default:
            return state;
    }
}