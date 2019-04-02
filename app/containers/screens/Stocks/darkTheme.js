import { WINDOW } from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';

export default style = ({

    topTabStyle: {
        backgroundColor: colors.darkThemeTabBackGround
    },

    stockDetailRelatedNewsAgo: {
        color: colors.white
    },
    statuBarBackGround: {
        backgroundColor: colors.blackThemeColor,
        // backgroundColor: 'rgb(26,56,136)',

    },
    topNewsTitleColor: {
        color: colors.white
    },

    // Watchlist style
    buttonText: {
        color: colors.blackColor,
    },
    mainView: {
        backgroundColor: colors.blackThemeColor
    },
    noStockText: {
        color: colors.lightWhiteStock,
    },
    emptyText: {
        color: colors.darkWatchlistMessage
    },
    buttonStyles: {
        backgroundColor: colors.white,
        borderColor: colors.white,
    },

    // Stock screen style
    mainRenderView: {
        backgroundColor: colors.blackThemeColor,
    },
    stockListMain: {
        backgroundColor: colors.blackThemeColor
    },
    trendingFooterText: {
        color: colors.white
    },
    trendingFooterMain: {
        backgroundColor: colors.blackThemeColor
    },
    trendingSection: {
        backgroundColor: colors.blackThemeColor,
    },
    renderHeader: {
        backgroundColor: colors.blackThemeColor,
    },
    trendingTitle: {
        color: colors.white
    },
    trendingTabChild: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    listItemMainView: {
        backgroundColor: colors.blackThemeColor
    },
    listItemTitle: {
        color: colors.white,
    },
    listItemPrice: {
        color: colors.white
    },
    listHeaderTagText: {
        color: colors.bottomButtonColor,
    },
    listItemSmallText: {
        color: colors.greythemeColor,
    },
    horizontalSeprator: {
        // borderBottomColor: colors.blackThemeColor,
        borderBottomColor : colors.watchlistSep,
        opacity:0.1,
    },
    horizontalSepratorListItem: {
        backgroundColor: colors.dividingLineDarkTheme,
    },
    headerStockTitle: {
        color: colors.white,
    },
    rectangleTrending: {
        backgroundColor: 'transparent',
    },
    headerStockTabTrendingTitle: {
        color: colors.greythemeColor,
    },
    headerStockPrice: {
        color: colors.white,
    },
    lastUpdated: {
        color: colors.greythemeColor,
    },
    stockMainView: {
        backgroundColor: colors.blackThemeColor
    },
    listViewMain: {
        backgroundColor: colors.blackThemeColor
    },

    // Stock Details Screen
    stockDetailLoaderBG: {
        backgroundColor: 'transparent'
    },
    topBackgroundView: {
        backgroundColor: colors.blackThemeColor,
    },
    priceTopTitle: {
        color: colors.greythemeColor,
    },
    daysFilterView: {
        // backgroundColor: colors.darkThemeSiteDetailTabBG,
        backgroundColor: colors.blackThemeColor,
    },
    bottomBackgroundView: {
        backgroundColor: 'transparent',
    },
    tabOptionBGColor: {
        // backgroundColor: colors.blackColor,
    },
    tabOptionColor: {
        color: colors.darkThemeSiteDetailTabUnSelectColor,
    },
    companyInfoBackground: {
        // backgroundColor: colors.blackColor,
    },
    companyInfoButton: {
        color: colors.white,
    },
    stockRelatedNewsTitleColor: {
        color: colors.white,
    },
    stockRelatedNewsColor: {
        color: colors.relatedNewsTitleGray,
    },
    stockBottomTabBg: {
        backgroundColor: colors.stockTabBG,
    },
    relatedNewsSeparator: {
        borderBottomColor: colors.relatedNewsTitleGray,
    },
    marketDataSepratorNew: {
        // borderBottomColor: colors.newsGNSepratorMain,
        borderBottomColor: colors.relatedNewsTitleGray,
     },
    topViewSeparator: {
        borderBottomColor: colors.relatedNewsTitleGray,
    },
    stockDetailTextNoChartData: {
        color: colors.white
    },

    // Stock detail Header black 
    backfaceBackground: {
        position: 'absolute',
        backgroundColor: colors.blackThemeColor,
        width: '100%',
        height: '50%',
        top: 0,
    },
    stockDetailHeaderTitleColor: {
        color: colors.white,
    },
    stockDetailHeaderSubTitleColor: {
        color: colors.relatedNews,
    },
    lastUpdated: {
        color: colors.greythemeColor,
    },

    // Tabbar Style Treindin Screen

    tabOptionView: {
        backgroundColor: colors.blackThemeColor
    },
    labelFont: {
        color: colors.white
    },
    tabbar: {
        backgroundColor: colors.blackThemeColor,
        borderBottomColor: colors.greythemeColor,
        borderBottomWidth: 1,
    },
    tab: {
        width: WINDOW.width / 3
    },
    tabCompany: {
        width: WINDOW.width / 2
    },
    indicator: {
        backgroundColor: colors.white,
        height: 3
    },
    indicatorCompany: {
        backgroundColor: colors.white,
        height: 3
    },
    label: {
        color: colors.white,
        fontWeight: '600',
    },


    // Company Info screen
    companyInfoHeadingText: {
        color: colors.relatedNewsTitleGray,
    },
    companyInfoSubtitleText: {
        color: colors.white,
    },

    // market data screen 
    marketLableView: {
        color: colors.white,
    },
    marketDataSeprator: {
        color: colors.relatedNewsTitleGray
    },
    learnMoreView: {
        borderColor: colors.white,
    },
    learnMoreText: {
        color: colors.white,
    },
    advertizmentBG: {
        backgroundColor: colors.newsADVDarkBG
    },
    stockDetailRelatedNewsAdvertizmnetSmall: {
        color: colors.white
    },
    stockGeneralNewsTitleColor: {
        color: colors.white,
    },
    headerBG: {
        backgroundColor: colors.blackThemeColor
    },
    stockGeneralNewsADVName: {
        color: colors.white
    },
    articleText: {
        color: colors.white
    },
    loadmoreTextView: {
        color: colors.white
    },
    loadmoreView: {
        backgroundColor: colors.blackThemeColor
    },
    loadMoreTextColor: {
        color: colors.redLineColor
    },
    showMoreTextColor: {
        color: colors.redLineColor
    },
    showMore: {
        backgroundColor: colors.blackThemeColor,
    },
    backButtonColor: {
        color: colors.white,
    },
    stockNewsDetailTitle: {
        color: colors.white,
    },
    newsDetailDate: {
        color: colors.white,
    },
    newsDetailSwipMore: {
        color: colors.white,
    },
    newsDetailSepView: {
        backgroundColor: colors.tabbarDarkTheme,
    },
    newsDetailShare: {
        backgroundColor: colors.tabbarDarkTheme,
    },
    topNewsMetadata: {
        color: colors.white
    },
    generalNewsArticleTitle: {
        color: colors.white
    },
    generalArticleSmall: {
        color: colors.articleNewsSMallDark
    },
    generalNewsShowMore:{
        color:colors.redLineColor
    },
    generalNewsDetailSummary:{
        color: colors.white
    },
    generalNewsFeedShowMore:{
        color:colors.articleNewsSMall
    },
    statusBarColor:{
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    tagBG: {
        backgroundColor: colors.darkThemeTabBackGround
    },
    tagTextView:{
        color:colors.white
    },
    headertitleText:{
        color:colors.white
    },
    addedWatchList:{
        color: colors.darkAddedWatchListTextColor
    },
    topBackgroundViewNew:{
        backgroundColor: colors.blackThemeColor
    }
})
