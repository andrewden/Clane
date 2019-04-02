const defaultState = {
   selectBankAccount_modal: false, 
   screen_name:'',
   open_url: 'https://www.google.com',
   article_title: '',
   gallery_data: null

};

export default function showModalSelectBankAccount_red(state = defaultState, action) {

    switch (action.type) {
        case 'GET_SHOWMODALSELECTBANKACCOUNT':
            return Object.assign({}, state, {
                selectBankAccount_modal: action.selectBankAccount_modal, 
                screen_name: action.screen_name,
                open_url: action.open_url,
                article_title : action.article_title,
                gallery_data : action.gallery_data
            });
        default:
            return state;
    }
}