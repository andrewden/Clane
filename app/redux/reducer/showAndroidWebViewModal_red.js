const defaultState = {
    android_modal: false, 
    screen_name:'',
    open_url: 'https://www.google.com',
    article_title: '',
    image_url:''
 };
 
 export default function showAndroidWebViewModal_red(state = defaultState, action) {
 
     switch (action.type) {
         case 'GET_SHOWMODALANDROID':
             return Object.assign({}, state, {
                android_modal: action.android_modal, 
                 screen_name: action.screen_name,
                 open_url: action.open_url,
                 article_title : action.article_title,
                 image_url:  action.image_url
             });
         default:
             return state;
     }
 }