import { WINDOW } from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';

export default style = ({

    // Watchlist style
    topTabStyle: {
        backgroundColor: colors.blue
    },
    statuBarBackGround:{
        backgroundColor: colors.blue,
    },
    stockDetailRelatedNewsAgo: {
        color: colors.newsSmallLight
    },
    stockDetailRelatedNewsAdvertizmnetSmall: {
        color: colors.newsAdvSmall
    },
    buttonText: {
        color: colors.white,
    },
    mainView: {
        backgroundColor: colors.white
    },
    noStockText: {
        color: colors.blackColor
    },
    emptyText: {
        color: colors.blackColor
    },
    buttonStyles: {
        borderColor: colors.blue,
        backgroundColor: colors.blue,
    },

    // Stock screen style
    mainRenderView: {
        backgroundColor: colors.white,
    },
    stockListMain: {
        backgroundColor: colors.white
    },
    trendingFooterText: {
        color: colors.blackThemeColor
    },
    trendingFooterMain: {
        backgroundColor: colors.white
    },
    trendingSection: {
        backgroundColor: colors.white,
    },
    renderHeader: {
        backgroundColor: colors.blue,
    },
    trendingTitle: {
        color: colors.lavenderlight
    },
    listItemMainView: {
        backgroundColor: colors.white
    },
    listItemTitle: {
        color: colors.blackColor,
    },
    listItemPrice: {
        color: colors.blackColor
    },
    listItemSmallText: {
        color: colors.greythemeColor,
    },
    listHeaderTagText: {
        color: colors.bottomButtonColor,
    },
    horizontalSeprator: {
        borderBottomColor: colors.watchlistSep,
        opacity:0.1
    },
    horizontalSepratorListItem: {
        backgroundColor: colors.listSeprator
    },
    headerStockTitle: {
        color: colors.white,
    },
    rectangleTrending: {
        backgroundColor: 'transparent',
    },
    headerStockTabTrendingTitle: {
        color: colors.articleSeprator,
    },
    headerStockPrice: {
        color: colors.white,
    },
    navigationHeader: {
        color: colors.blue,
    },
    lastUpdated: {
        color: colors.articleSeprator,
    },
    stockMainView: {
        backgroundColor: colors.white
    },
    listViewMain: {
        backgroundColor: colors.white
    },

    // Stock Details Screen
    stockDetailLoaderBG: {
        backgroundColor: 'transparent'
    },
    topBackgroundView: {
        backgroundColor: colors.blue,
    },
    topBackgroundViewNew: {
        backgroundColor: colors.white,
    },
    priceTopTitle: {
        color: colors.purpleDark,
    },
    daysFilterView: {
        // backgroundColor: colors.lightThemeHeaderBackground,
        backgroundColor: colors.tabBg,

    },
    bottomBackgroundView: {
        backgroundColor: colors.white,
    },
    tabOptionBGColor: {
        // backgroundColor: colors.lightThemeSiteDetailTabSelect,
        backgroundColor: colors.tabBg,

    },
    tabOptionColor: {
        color: colors.blackColor,
    },
    companyInfoBackground: {
        // backgroundColor: colors.blue,
        backgroundColor: colors.tabBg,
    },
    companyInfoButton: {
        color: colors.companyInfoText,
    },
    stockRelatedNewsTitleColor: {
        color: colors.relatedNewsTitle,
    },
    stockGeneralNewsTitleColor: {
        color: colors.newsGNTitle,
    },
    stockRelatedNewsColor: {
        // color: colors.relatedNewsSubTitle,
        color: colors.relatedNewsTitleLight

    },
    stockBottomTabBg: {
        backgroundColor: colors.stockDetailBottomTabBackground,
    },
    relatedNewsSeparator: {
        // borderBottomColor: colors.newsGNSepratorMain,
        borderBottomColor: colors.stockDetailSubHeader,
        opacity: 0.1
    },
    marketDataSepratorNew: {
        // borderBottomColor: colors.newsGNSepratorMain,
        borderBottomColor: colors.stockDetailSubHeader,
     },
    topViewSeparator: {
        borderBottomColor: colors.stockDetailSubHeader,
        opacity: .2
    },
    stockDetailTextNoChartData: {
       color: colors.watchlistSep 
    },

    // Stock detail Header black 
    backfaceBackground: {
        position: 'absolute',
        backgroundColor: colors.blue,
        width: '100%',
        height: '50%',
        top: 0
    },
    stockDetailHeaderTitleColor: {
        color: colors.white,
    },
    stockDetailHeaderSubTitleColor: {
        color: colors.stockDetailSubHeader,
        // color: colors.white,

    },

    // Tabbar Style Treindin Screen
    tabOptionView: {
        backgroundColor: colors.white
    },
    labelFont: {
        color: colors.blackColor
    },
    tabbar: {
        backgroundColor: colors.white,
        borderBottomWidth: 0.5,
        borderColor: colors.tabIndicatorLightTheme,
    },
    tab: {
        width: WINDOW.width / 3
    },
    tabCompany: {
        width: WINDOW.width / 2
    },
    indicator: {
        backgroundColor: colors.tabIndicatorLightTheme,
        // opacity: .30,
        height: 4
    },
    indicatorCompany: {
        backgroundColor: colors.tabActiveIndicatorCompanyScreenLightTheme,
        opacity: .70,
        height: 5
    },
    label: {
        color: colors.blackColor,
        fontWeight: '600',
    },

    // Company Info screen
    companyInfoHeadingText: {
        color: colors.relatedNewsSubTitle,
    }, 
    companyInfoSubtitleText: {
        color: colors.relatedNewsTitle,
    },

    // market data screen
    marketLableView:{
        color:colors.relatedNewsSubTitle,
    },
    marketDataSeprator:{
        color:colors.marketDataSepratoreLight
    },
    learnMoreView: {
        borderColor: colors.blue,
    },
    learnMoreText: {
        color: colors.blue,
    },
    advertizmentBG:{
        backgroundColor: colors.newsBGLight 
    },
    headerBG:{
        backgroundColor: colors.white 
    },
    stockGeneralNewsADVName:{
        color:colors.newsSmallLight
    },
    articleText:{
        color:colors.blackColor
    },
    loadmoreTextView:{
        color:colors.stockLoadMoreTextLight
    },
    loadmoreView:{
        backgroundColor: colors.white
    },
    loadMoreTextColor:{
        color:colors.headerTextColor
    },
    showMoreTextColor:{
        color:colors.showMoreLight
    },
    showMore:{
        backgroundColor: colors.showMoreLightView
    },
    backButtonColor:{
        color: colors.white, 
    },
    stockNewsDetailTitle:{
        color: colors.relatedNewsTitle, 
    },
    newsDetailDate:{
        color: colors.newsDetailDate, 
    },
    newsDetailSwipMore:{
        color: colors.newsDetailSwipeMore, 
    },
    newsDetailSepView:{
        backgroundColor : colors.newsDetailSepViewLight,
    },
    newsDetailShare:{
        backgroundColor : colors.newsDetailShareBGLight,
    },
    topNewsTitleColor:{
        color:colors.topNewsLightColor
    },
    topNewsMetadata:{
        color :colors.topNewsLightColor
    },
    generalNewsArticleTitle: {
        color: colors.articleNewsTitle
    },
    generalArticleSmall:{
        color:colors.articleNewsSMall
    },
    generalNewsShowMore:{
        color:colors.showMoreNewsLight
    },
    generalNewsDetailSummary:{
        color: colors.newsDetailSummaryLight
    },
    generalNewsFeedShowMore:{
        color:colors.showMoreNewsLight
    },
    statusBarColor:{
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    tagBG: {
        backgroundColor: colors.blue
    },
    tagTextView:{
        color:colors.white
    },
    headertitleText:{
        color:colors.blackColor
    },
    addedWatchList:{
        color: colors.LightAddedWatchListTextColor
    }
})
