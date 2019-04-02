export const GET_SHOWMODALSELECTBANKACCOUNT = 'GET_SHOWMODALSELECTBANKACCOUNT';

export const getShowModalSelectBankAccount = (selectBankAccount_modal, screen_name, open_url,article_title,gallery_data) => {
    console.log("gallery_data "+gallery_data);
    
    return (dispatch, getState) => {
        dispatch({ type: GET_SHOWMODALSELECTBANKACCOUNT,
            selectBankAccount_modal: selectBankAccount_modal,
            screen_name: screen_name,
            open_url: open_url,
            article_title : article_title,
            gallery_data: JSON.stringify(gallery_data)});
        }   
}
// export const getShowModalSelectBankAccount = (searchbar_modal) => ({
//     type: GET_SHOWMODALSELECTBANKACCOUNT,
//             selectBankAccount_modal: selectBankAccount_modal,
//             screen_name: screen_name,
//             open_url: open_url,
//             article_title : article_title,
//             gallery_data: JSON.stringify(gallery_data)
// }); 

 