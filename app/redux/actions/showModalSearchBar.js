export const GET_SHOWMODALSEARCHBAR = 'GET_SHOWMODALSEARCHBAR';

export const getShowModalSearchBar = (searchbar_modal, screen_name) => ({
    type: GET_SHOWMODALSEARCHBAR,
    searchbar_modal: searchbar_modal, 
    screen_name: screen_name,
}); 