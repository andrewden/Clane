const defaultState = {
   loader: false, 
};

export default function claneLoader_red(state = defaultState, action) {

    switch (action.type) {
        case 'GET_SHOWLOADER':
            return Object.assign({}, state, {
                loader: action.loader, 
            });

        default:
            return state;
    }
}

