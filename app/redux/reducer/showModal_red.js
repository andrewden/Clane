const defaultState = {
   register: false, 
    Otp : false,
    ProfileSetup:false,
   
};

export default function showModal_red(state = defaultState, action) {

    switch (action.type) {
        case 'GET_SHOWMODAL':
            return Object.assign({}, state, {
                register: action.register, 
                 Otp : action.Otp,  
                 ProfileSetup:action.ProfileSetup,
            });
        default:
            return state;
    }
}

