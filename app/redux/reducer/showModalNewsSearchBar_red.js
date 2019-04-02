const defaultState = {
    searchbar_modal: false, 
 };
 
 export default function showModalNewsSearchBar_red(state = defaultState, action) {
 
     switch (action.type) {
         case 'GET_SHOWMODALNEWSSEARCHBAR':
             return Object.assign({}, state, {
                 searchbar_modal: action.searchbar_modal, 
             });
         default:
             return state;
     }
 }