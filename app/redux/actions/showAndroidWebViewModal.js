export const GET_SHOWMODALANDROID = 'GET_SHOWMODALANDROID';

export const getShowAndroidModal = (android_modal,screen_name,open_url,article_title, image_url) => ({
                type: GET_SHOWMODALANDROID,
                android_modal: android_modal,
                screen_name: screen_name,
                open_url: open_url,
                article_title : article_title,
                image_url : image_url

    }); 
// export const getShowModalSelectBankAccount = (searchbar_modal) => ({
//             type: GET_SHOWMODALSELECTBANKACCOUNT,
//             selectBankAccount_modal: selectBankAccount_modal,
//             screen_name: screen_name,
//             open_url: open_url,
//             article_title : article_title,
//             gallery_data: JSON.stringify(gallery_data)
// }); 

 