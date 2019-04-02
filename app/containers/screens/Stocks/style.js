import { StyleSheet, Platform, StatusBar } from 'react-native';
import { iPhoneX } from '../../../lib/globals';
import { WINDOW } from '../../../lib/globals';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import DeviceInfo from 'react-native-device-info';

var blueHeaderTop = 80;
var trendingHeaderTop = 100;

export default StyleSheet.create({

    newsDetailHeader: {
        position: 'absolute',
        // backgroundColor : 'rgba(0 0 0, 0.2)', 
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: '100%',
        flex: 1,
        padding: 0,
        marginTop: 0,
    },
    newsDetailHeaderView: {
        // position: 'absolute',
        // backgroundColor : 'rgba(0 0 0, 0.2)', 
        // backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        width: '100%',
        flex: 1,
        padding: 0,
        marginTop: 0,
        height: 44,
        alignItems: 'center',
        paddingLeft: 15,
    },
    customStatusBar: {
        // backgroundColor: 'red',
        width: '100%',
        height: (Platform.OS == 'android') ? 0 : (iPhoneX) ? 44 : 20,
    },

    headerbackButtonView: {
        alignSelf: 'flex-start', justifyContent: 'flex-start', flex: 1
    },
    headerTitleText: {
        fontSize: 17, letterSpacing: -0.41, fontFamily: globals.fontSFProTextSemibold, color: colors.white, alignSelf: 'center',
    },
    headerRightImageView: {
        marginRight: 10,
        justifyContent: 'center',
        flex: 1,
    },
    headerRightIcon: {
        width: 27,
        height: 25,
        alignSelf: 'flex-end',
        marginHorizontal: 10
    },

    //Header Style
    borderIndicator: {
        borderLeftWidth: 3,
        borderRadius: 5,
    },
    indicator: {
        marginLeft: 2
    },
    column: {
        flexDirection: 'column'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerMainView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        width: WINDOW.width,
        alignItems: 'center'
    },

    // Watchlist style
    buttonText: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: globals.font_17,
        lineHeight: 17 * 1.5,
        height: '100%',
    },
    mainView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    upperArea: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        alignContent: 'center',
    },
    bottomArea: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 220,
        alignContent: 'center',
    },
    chartLogo: {
        width: 60,
        height: 60,
        resizeMode: 'contain'
    },
    noStockText: {
        fontSize: 30,
        fontWeight: '800',
        marginTop: 5,
        fontFamily: globals.fontSFProTextSemibold
    },
    emptyText: {
        fontSize: globals.font_19,
        width: 150,
        marginTop: 5,
        fontFamily: globals.fontSFProTextRegular
    },
    buttonStyles: {
        marginBottom: 20,
        height: 50,
        borderRadius: 10,
        width: WINDOW.width - 30,
        borderColor: colors.blue,
    },

    // Stock screen style
    listViewMain: {
        flex: 1
    },
    mainRenderView: {
        flex: 1,
    },
    stockListPriceBlock: {
        paddingRight:2,
        flex: 0.7,
        alignItems: 'flex-end',
        // marginTop:8,
        // alignSelf:'center'
        // backgroundColor: 'red',
    },
    listItemSeprator: {
        paddingLeft: 10,
        paddingRight: 10
    },
    stockListChangeBlock: {
        flex: 1,
        alignItems: 'center'
    },
    stockListChangeBlockWatchlist: {
        flex: 1,
        alignItems: 'flex-end'
    },
    stockListPercentageBlock: {
        flex: 0.6,
        alignItems: 'flex-end',
        // backgroundColor: 'green'
    },
    stockListPercentageBlockGreen: {
        flex: 0.7,
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '65%',
        // alignSelf:'center'
        //height: '65%',
        // marginHorizontal: 5,
    },

    stockListPercentageBlockGreenHeader: {
        flex: 0.7,
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '70%',
        // alignSelf:'center'
        //height: '65%',
        // marginHorizontal: 5,
    },

    stockListNameMainBlock: {
        flex: 1.8,
        paddingHorizontal: 4,
    },
    stockListNameMainBlockOrientationChild: {
        flexDirection: 'row'
    },
    listHeaderTagText: {
        fontSize: globals.font_12,
        // fontWeight: '500',
        fontFamily: globals.fontSFProTextMedium
    },
    stockListMain: {
        flexDirection: 'column',
        paddingLeft: 15,
        paddingRight: 15,
    },
    trendingFooterText: {
        fontSize: globals.font_20,
        fontWeight: '400',
        fontFamily: globals.fontSFProTextRegular
    },
    incidesNotAbleToFetch: {
        fontSize: globals.font_15,
        fontWeight: '400',
        marginLeft: 10,
        marginRight: 10,
        fontFamily: globals.fontSFProTextRegular
    },
    trendingFooterMain: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: WINDOW.height - trendingHeaderTop - (iPhoneX ? 260 : 200),
        flexDirection: 'column',
    },
    generalNewsFooter: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'column',
    },
    trendingSection: {
        width: '100%',
        height: 100,
    },
    renderHeader: {
        height: blueHeaderTop
    },
    trendingTitle: {
        fontSize: 23,
        fontWeight: '700',
        letterSpacing: -0.4,
        fontFamily: globals.fontSFProTextBold
    },
    trendingSubTitle: {
        fontSize: globals.font_14,
        fontWeight: '300',
        letterSpacing: -0.4,
        fontFamily: globals.fontSFProTextRegular
    },
    trendingTabMain: {
        flex: 1,
        flexDirection: 'row',
    },
    trendingTabChild: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 10
    },
    listItemMainView: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        width: '100%'
    },
    listItemTitle: {
        fontSize: globals.font_14,
        // fontWeight: '700',
        fontFamily: globals.fontSFProTextSemibold,
    },
    listItemPrice: {
        marginVertical: 2,
        fontSize: globals.font_14,
        // fontWeight: '700',
        fontFamily: globals.fontSFProTextRegular,
    },
    listItemPriceRatePercentage: {
        fontSize: globals.font_12,
        fontFamily: globals.fontSFProTextRegular,
        // paddingHorizontal: 5,
        // paddingVertical: 2
    },
    listItemSmallText: {
        fontSize: globals.font_12,
        // fontWeight: '400',
        marginTop: 2,
        fontFamily: globals.fontSFProTextRegular
    },
    horizontalSeprator: {
        borderBottomWidth: 0.5,
    },
    horizontalSepratorNews: {
        borderBottomWidth: 3,
        marginTop: 5,
    },
    horizontalSepratorListItem: {
    },
    headerMainBlock: {
        height: (Platform.OS === 'android') ? 70 : 60,
        flexDirection: 'row',
    },
    headerStockTitle: {
        marginLeft: 5,
        fontSize: globals.font_13,
        fontWeight: '500'
    },
    rectangleTrending: {
        padding: 5,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        flex: 1
    },
    headerStockTabTrendingTitle: {
        marginLeft: 5,
        fontSize: globals.font_10,
        // fontWeight: '700',
        fontFamily: globals.fontSFProTextSemibold
    },
    headerStockPrice: {
        marginLeft: 5,
        fontSize: globals.font_18,
        marginTop: 3,
        fontWeight: '800'
    },
    headerStockPercentage: {
        marginLeft: 5,
        fontSize: globals.font_10,
        marginTop: 3
    },
    marketRateValuesBGView: {
        width: '85%', 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        // marginHorizontal: 5,
    },

    // Stock detail header style
    headingContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: 15
    },
    headerStyle: {
        elevation: 0, shadowOpacity: 0, borderBottomWidth: 0,
        flexDirection: "row",
        alignItems: 'center',
        paddingTop: Platform.OS == "ios" ? (globals.iPhoneX) ? 44 : 20 : 0 // only for IOS to give StatusBar Space
    },
    headerTitleView: {
        flex: 1, justifyContent: 'center', flexDirection: 'row'
    },
    headertitleText: {
        fontSize: 17, 
        letterSpacing: -0.41, 
        fontFamily: globals.fontSFProTextSemibold, 
        color: colors.white, 
        alignSelf: 'center',
    },


    lastUpdated: {
        fontSize: globals.font_12,
        // fontWeight: '700',
        paddingBottom: 2,
        fontFamily: globals.fontSFProTextBold
    },

    // Stock Details Screen
    tabOptionView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelFont: {
        fontSize: 30,
    },
    topBackgroundView: {
        flex: 1,
    },
    topViewPriceBackground: {
        marginBottom: 15,
    },
    priceTopTitle: {
        fontSize: globals.font_10,
        fontWeight: '400',
        fontFamily: globals.fontSFProTextRegular
    },
    priceBottomTextGreen: {
        fontSize: globals.font_14,
        fontWeight: '400',
        color: colors.greenColor,
        alignSelf: 'flex-end',
        fontFamily: globals.fontSFProTextRegular
    },
    priceBottomTextRed: {
        fontSize: globals.font_14,
        fontWeight: '400',
        color: colors.redColor,
    },
    daysFilterView: {
        marginLeft: 10,
        marginRight: 10,
        // marginTop: 10,
        // marginBottom: 10,
        height: 30,
        flexDirection: 'row',
    },
    bottomBackgroundView: {
        flex: 1,
    },
    tabOptionMainView: {
        flex: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnCompanyInfo: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        height: 40,
        width: WINDOW.width  ,
        // borderRadius: 5,
        flexDirection: 'row',
        // marginTop: 10
    },
    buttonTextStockDetailCompanyInfo: {
        textAlign: 'center',
        // fontWeight: '400',   
        fontFamily: globals.fontSFProTextSemibold,
        fontSize: globals.font_10,
        lineHeight: 13 * 1.5
    },
    articleSeprator: {
        opacity: 0.05,
        borderStyle: "solid",
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        borderColor: colors.articleSeprator

    },
    horizontalSepratorStockDetail: {
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    blueHorizontal:{
      height : 2,
      backgroundColor : colors.tabIndicatorLightTheme
    },
    categoryView:{
      marginLeft : 15,
      backgroundColor : colors.tabIndicatorLightTheme,
      width : WINDOW.width  * 0.5,
      height: 16
    },
    categoryTextName:{
      fontSize : globals.font_10,
      fontFamily : globals.fontClaneLetteraTextTTBold,
      color : colors.white,
      paddingLeft : 10
    },
    horizontalSepratorGeneralNews: {
        borderBottomWidth: 1,
        marginTop: 5,
        marginBottom: 5,
    },
    horizontalSepratorGeneralNewsMain2: {
        borderBottomWidth: 3,
        marginTop: 1,
    },
    horizontalSepratorGeneralNewsMain: {
        borderBottomWidth: 3,
    },
    horizontalSepratorStockDetailReleatedNews: {
        borderBottomWidth: 0.5,
        opacity: 0.5,
        marginTop: 2

    },
    stockDetailRelatedNews: {
        fontSize: globals.font_13,
        fontWeight: '800',
        fontFamily: globals.fontSFProTextSemibold
    },
    stockDetailRelatedNewsTitle: {
        fontSize: globals.font_14,
        fontWeight: '600',
        marginTop: 5,
        fontFamily: globals.fontClaneLetteraTextTTBold
    },
    stockDetailRelatedNewsTitleClane: {
        fontSize: globals.font_14,
        fontWeight: '600',
        marginTop: 5,
        fontFamily: globals.fontClaneLetteraTextTTBold
    },
    stockGeneralNewsTitle: {
        fontSize: globals.font_17,
        fontWeight: '800',
    },
    stockDetailRelatedGeneralNewsTitle: {
        fontSize: globals.font_15,
        marginTop: 5,
        fontWeight: '600',
    },
    newsVideoTitle: {
        fontSize: globals.font_14,
        marginTop: 5,
        fontWeight: '600',
        fontFamily: globals.fontSFProTextSemibold
    },
    generalNewsArticleTitle: {
        fontSize: globals.font_15,
        marginTop: 5,
        fontWeight: '600',
        fontFamily: globals.fontClaneLetteraTextTTBold
    },

    stockGeneralNewsADVTitle: {
        fontSize: globals.font_15,
        width: '80%',
        fontWeight: '600',
    },
    stockGeneralNewsADVName: {
        fontSize: globals.font_10,
        width: '20%',
    },
    stockDetailRelatedNewsSubTitle: {
        fontSize: globals.font_12,
        marginTop: 5,
        fontWeight: '600',
    },
    stockDetailRelatedNewsAddress: {
        fontSize: globals.font_10,
        marginTop: 10,
        fontWeight: '500',
        fontFamily: globals.fontSFProTextRegular,
    },
    stockDetailRelatedNewsViewLikeText: {
        fontSize: globals.font_12,
        marginLeft: 5,
        fontWeight: '500',
    },
    stockDetailRelatedNewsAgo: {
        fontSize: globals.font_10,
        marginTop: 5,
        fontWeight: '500',
        fontFamily: globals.fontClaneAkkuratTTLight
    },

    generalArticleSmall: {
        fontSize: globals.font_10,
        marginTop: 5,
        fontFamily: globals.fontSFProTextRegular
    },

    stockGeneralAdvDmall: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: '500',
    },
    stockDetailTopRowViews: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 7
    },
    priceWhite: {
        fontSize: globals.font_17,
        fontWeight: '400',
        color: colors.white,
        alignSelf: 'flex-end',
        fontFamily: globals.fontSFProTextRegular
    },
    priceWhiteCurrency: {
        fontSize: globals.font_14,
        fontWeight: '500',
        color: colors.white
    },
    topViewtextStyles: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 5
    },
    topViewtextRightStyles: {
        textAlign: 'right',
        fontSize: 14,
        fontWeight: '400'
    },
    topViewSeparators: {
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10
    },
    topViewSeparatorsNew: {
        borderBottomWidth: 4,
     },
    topViewSecondRowLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: '100%'
    },
    topViewSecondRowCyrrency: {
        marginBottom: 2,
    },
    topViewSecondRowRight: {
        justifyContent: 'flex-end'
    },
    marketFlatlistView: {
        flex: 1,
        marginBottom: 46
    },
    indicesFlatlistView: {
        flex: 1,
        marginBottom: (iPhoneX ? 78.5 : 46)
    },
    indicesDetailFlatlistView: {
        flex: 1,
        marginBottom: 46
    },
    indicesFooterMain: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: WINDOW.height - (iPhoneX ? 315 : 255),
        flexDirection: 'column',
    },
    indicesFooterDetailMain: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: WINDOW.height - (iPhoneX ? 215 : 155),
        flexDirection: 'column',
    },
    indicesFetchNoAbleToFetchMain: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginBottom: 30,
        flexDirection: 'column',
    },
    watchlistFooterMain: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: WINDOW.height - (iPhoneX ? 260 : 186),
        flexDirection: 'column',
    },
    mainBottomView: {
        flexDirection: 'row',
        height: 50,
        width: WINDOW.width,
        borderTopWidth: 1,
        borderTopColor: colors.bottomButtonColor,
    },
    buttonView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomButtonIcon: {
        color: colors.bottomButtonColor
    },
    bottomButtonText: {
        fontSize: globals.font_10,
        color: colors.bottomButtonColor,
        marginTop: 4,
        letterSpacing: 0.12,
        fontFamily: globals.fontSFProTextRegular,
    },

    // Stock detail header style
    stockDetailHeaderTitle: {
        fontSize: 17,
        fontWeight: '700',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    stockDetailHeaderSubTitle: {
        fontSize: globals.font_12,
        fontFamily: globals.fontSFProTextRegular
    },
    stockDetailTextNoChartData: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 14,
        fontWeight: '400',
    },

    showMoreText: {
        fontSize: 14,
        fontWeight: 'normal',
        fontFamily: globals.fontSFProTextRegular
    },

    //Stock SearchBar Screen Style
    searchbarBottomView: {
        flex: 1
    },
    recentSearchMainView: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: colors.lightThemeHeaderBackground
    },
    rescentSeachTextView: {
        flex: 1,
        flexDirection: 'column',
    },
    recentSearchText: {
        color: 'gray',
        fontSize: globals.font_13,
        fontFamily: globals.fontSFProTextRegular
    },
    clearTextView: {
        flex: 0.2,
        alignItems: 'flex-end'
    },
    clearText: {
        color: colors.clearColor,
        fontSize: globals.font_13,
        fontWeight: '700',
        fontFamily: globals.fontSFProTextRegular
    },
    searchScreenflatList: {
        flex: 1,
    },
    searchScreenItem: {
        paddingVertical: 8,
        marginHorizontal: 10,
    },
    searchScreenItemView: {
        flex: 1,
        flexDirection: 'row'
    },
    searchScreenItemLeftView: {
        flex: 1,
    },
    searchScreenItemTitleText: {
        fontSize: globals.font_16,
        color: 'black',
        fontFamily: globals.fontSFProTextRegular
    },
    searchScreenItemTopRightView: {
        flex: 0.5,
        alignItems: 'flex-end'
    },
    searchScreemItemBottomRightView: {
        flex: 0.5,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    searchScreenItemSubtitleText: {
        fontSize: globals.font_12,
        color: 'gray',
        fontFamily: globals.fontSFProTextRegular
    },

    noInternetTextView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tryAgainButtonView: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
    },

    tryAgainButtonViewNotification: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
        marginBottom: 40,
    },

    // Company Info screen
    companyInfoViewText: {
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
    companyInfoHeadingText: {
        fontSize: globals.font_14,
        marginBottom: 5,
        fontWeight: '700',
        fontFamily: globals.fontSFProTextRegular
    },
    companyInfoSubtitleText: {
        fontSize: globals.font_15,
        fontWeight: '600',
        fontFamily: globals.fontSFProTextRegular
    },
    horizontalSepratorCompanyInfo: {
        borderBottomWidth: 1,
        marginTop: 10,
    },

    // market data screen
    marketMainView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 15,
        marginRight: 15,
        borderBottomWidth: 1
    },
    marketLableView: {
        fontWeight: '700',
        fontSize: globals.font_14,
        paddingTop: 10,
        paddingBottom: 10,
        alignSelf: 'flex-start',
        fontFamily: globals.fontSFProTextRegular,
    },
    marketValueView: {
        fontSize: globals.font_15,
        alignSelf: 'flex-end',
        paddingTop: 10,
        paddingBottom: 10,
        fontFamily: globals.fontSFProTextRegular,
    },
    learnMoreText: {
        color: colors.white,
        margin: 5,
        fontSize: 10
    },
    learnMoreView: {
        marginTop: 10,
        paddingHorizontal: 5,
        borderColor: colors.white,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end'
    },
    articleViewMain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    articleText: {
        fontSize: 13,
        fontWeight: '700',
        margin: 5
    },
    activityLoaderCiew: {
        position: 'absolute',
        height: '100%',
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadmore: {
        width: 30,
        height: 30,
        alignItems: 'center',
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    footerIconView: {
        width: 20,
        height: 20,
        alignItems: 'center',
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    loadmoreView: {
        alignSelf: 'center',
        width: '100%',
        padding: 10
    },
    loadmoreTextView: {
        marginTop: 5,
        fontSize: 10,
        alignSelf: 'center',
    },
    topHeaderImage: {
        width: globals.WINDOW.width,
        height: globals.getNewsTopHeaderHeight()
    },

    topTrendingHeaderPlaceHolderImage: {
        width: 100,
        height: 100,
        marginTop: -10,
        resizeMode: 'cover'
    },

    trendingHeaderImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },

    topHeaderTransparentView: {
        marginTop: (iPhoneX ? -50 : -20)
    },

    topHeaderTransparent: {
        position: 'absolute',
        flexDirection: 'row',
        width: '100%',
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: iPhoneX ? 15 : 10,
        marginTop: (iPhoneX ? 40 : (DeviceInfo.getModel() == 'iPhone 6s') ? 35 : 20)

    },
    marketNewsTitle: {
        marginTop: 5,
        fontSize: globals.font_17,
        color: colors.white,
        fontWeight: '700',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5
    },
    topSearch: {
        flex: 0.4,
        alignSelf: 'flex-end',
        alignItems: 'flex-end'
    },
    topNewsTitle: {
        fontWeight: '700',
        fontSize: globals.font_16,
        fontFamily: globals.fontClaneLetteraTextTTBold
    },
    topNewsHours: {
        fontSize: 9,
        marginTop: 5,
        color: colors.topNewsHours,
        fontFamily: globals.fontClaneAkkuratTTLight,
    },
    topCaption: {
        fontSize: globals.font_12,
        marginTop: 2,
        fontFamily: globals.fontSFProTextRegular
    },

    newsAdvetizment: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
    },
    advetizment: {
        padding: 0,
        paddingBottom: (iPhoneX) ? 15 : 0,
    },

    advetizmentNewsDetail: {
        paddingTop: 15,
        paddingLeft: 30,
        paddingRight: 30,
    },

    advetizmentImage: {
        width: "100%",
        height: 200
    },
    advetizmentSallImage: {
        width: "80%",
        height: 70,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    showMore: {
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
    },
    newsDetailTopImage: {
      
    },
    newsDetailTopImageView: {
        height: Math.round(globals.WINDOW.height / 2.3),
        width: '100%',
    },
    customStatusBar: {
        width: '100%',
        height: (Platform.OS == 'android') ? 0 : (iPhoneX) ? 44 : 20,
    },
    newsDetailHeader: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: '100%',
        flex: 1,
        padding: 0,
        marginTop: 0,
    },
    newsDetailHeaderView: {
        flexDirection: 'row',
        width: '100%',
        flex: 1,
        padding: 0,
        marginTop: 0,
        height: 44,
        alignItems: 'center',
        paddingLeft: 15,
    },
    newsDetailBack: {
        flex: 0.1,
        alignSelf: 'flex-start'
    },
    backButtonColor: {
        marginTop: 3,
        fontSize: 15,
        fontWeight: '900'
    },
    stockNewsDetailTitle: {
        marginHorizontal: 15,
        marginTop: 15,
        fontSize: 15,
        color: colors.relatedNewsTitle,
        fontWeight: 'bold'
    },
    stockNewsWebView: {
        marginTop: 15,
        height: 190,
        marginHorizontal: 15
    },
    newsDetailDate: {
        marginHorizontal: 15,
        marginTop: 5,
        fontSize: 9,
        fontWeight: '500'
    },
    newsArticleDetailDate: {
        marginHorizontal: 15,
        marginTop: 10,
        fontSize: globals.getFontSizeNewsDate(),
        fontFamily: globals.fontSFProTextRegular,
        fontWeight: '500'
    },
    summaryText: {
        marginHorizontal: 15,
        fontSize: globals.getFontSizeSummary(),
        marginTop: 5,
        fontFamily: globals.fontSFProTextLight,
    },

    newsArticleDetailTitle: {
        marginHorizontal: 15,
        marginTop: 10,
        fontSize: globals.getFontSizeNewsTitle(),
        fontWeight: '600',
        fontFamily: globals.fontClaneLetteraTextTTBold
    },

    generalNewsDetailSummary: {
        fontSize: 12,
        fontWeight: "300",
        marginLeft: 10,

    },
    newsDetailSwipMore: {
        marginHorizontal: 15,
        marginTop: 10,
        fontSize: globals.font_12,
        fontWeight: '300',
        fontFamily: globals.fontClaneAkkuratTTLight
    },
    newsDetailSepView: {
        height: 1,
        marginBottom: 10

    },
    categorySepView: {
        height: 4,

    },
    newsDetailShare: {
        padding: 10,
        paddingBottom: (globals.iPhoneX) ? 20 : 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    showMoreTextGeneralNews: {
        fontSize: 14,
        fontWeight: '500'
    },
    statusBar: {
        height: (Platform.OS === 'ios') ? 20 : StatusBar.currentHeight,
    },
    appBar: {
        backgroundColor: '#79B45D',
        height: (Platform.OS === 'ios') ? 44 : 56,
    },

    topNewsHeaderText: {
        fontWeight: '800',
        fontSize: globals.font_18,
        fontFamily: globals.fontClaneLetteraTextTTExtraBold
    },

    noRecordFoundView: {
        alignItems: 'center', justifyContent: 'center', paddingTop: 140,
        marginHorizontal: 20,
    },
    noRecordFoundText: {
        fontSize: 12, color: colors.articleNewsSMall, marginTop: 18, textAlign: 'center', fontFamily: globals.fontSFProTextLight
    },
    statusBarStyle: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        height: (globals.iPhoneX) ? 44 : 20,
        width: globals.WINDOW.width,
        position: 'absolute',
        top: 0,
        zIndex: 1
    },
    statusBarStyleNoTopNews: {
        backgroundColor: 'white',
    },

    /**
    * Category Screen Style
    */
    categoryScreenMainView: {
        height: globals.screenWidth * 0.33,
        backgroundColor: colors.white,
        marginTop: globals.screenWidth * 0.01,
    },
    categoryText: {
        color: colors.newsGNTitle,
        marginRight: globals.screenWidth * 0.03,
        fontSize: globals.font_17,
        alignSelf: 'flex-end',
        marginTop: globals.screenWidth * 0.02,
        fontFamily: globals.fontClaneLetteraTextTTExtraBold
    },
    categoryIconView: {
        flexDirection: "row",
        flex: 1,
        height: globals.screenWidth * 0.30,
        marginTop: globals.screenWidth * 0.04,
    },
    iconView: {
        flex: 1,
    },
    touchableView: {
        flex: 1,
        flexDirection: 'column'
    },
    topicView: {
        backgroundColor: colors.white, 
        flex: 1, 
        marginTop: globals.screenWidth * 0.012
    },
    flatlistStyle: {
        marginRight: globals.screenWidth * 0.05,
        marginTop: globals.screenWidth * 0.04
    },
    topicImageMainView: {
        justifyContent: 'center',
        borderRadius: 10,
        width: globals.screenWidth * 0.265 ,
        height: globals.screenHeight / 6 ,
        // width: globals.WINDOW.width / 4,
        // height: globals.WINDOW.height /2,
        marginLeft: globals.screenWidth * 0.05,
        marginBottom: globals.screenWidth * 0.07
    },
    
    topicImage: {
        position: 'absolute',
        borderRadius: 5,
        height: globals.screenHeight /6,
        width: '100%',
    },

    iconText: {
        fontSize: globals.font_10,
        color: colors.newsGNTitle,
        fontFamily: globals.fontSFProTextRegular,
        alignSelf: 'center',
        marginTop: globals.screenWidth * 0.02
    },
    iconSize: {
        width: globals.screenWidth * 0.12, height: globals.screenWidth * 0.12, alignSelf: 'center'
    },
    topicText: {
        color: colors.newsGNTitle,
        marginRight: globals.screenWidth * 0.05,
        fontSize: globals.font_17,
        alignSelf: 'flex-end',
        marginTop: globals.screenWidth * 0.01,
        fontFamily: globals.fontClaneLetteraTextTTExtraBold
    },
    topicImageText: {
        alignSelf: 'center',
        fontFamily: globals.fontClaneLetteraTextTTBold,
        color: colors.white,
        fontSize: globals.font_12
    },

    // News Preference screen
    roundedTagView: {
        color: colors.dashboardNewsTitleColor,
        backgroundColor: colors.gray,
        borderRadius: 30,
    },
    tagLableView: {
        color: colors.tagNormalColor,
        fontSize: globals.font_16,
        paddingRight: 10,
        fontFamily: globals.fontClaneLetteraTextTTRegular
    },
    tagItemSelected: {
        backgroundColor: colors.blue,
    },
    tagLabelSelected: {
        color: colors.white,
        fontSize: globals.font_17,
        fontFamily: globals.fontClaneLetteraTextTTRegular
    },

    notificationMainView: {
        justifyContent: "space-between",
        flexDirection: 'row',
        backgroundColor: colors.white,
        marginTop: globals.screenWidth * 0.01,
        height: globals.screenWidth * 0.2
    },
    notificationText: {
        marginTop: globals.screenWidth * 0.06,
        marginLeft: globals.screenWidth * 0.05,
        fontSize: globals.font_15,
        fontFamily: globals.fontSFProTextRegular
    },
    switchView: {
        marginTop: globals.screenWidth * 0.03,
        marginRight: globals.screenWidth * 0.05
    },
    preferenceSecondView: {
        marginTop: globals.screenWidth * 0.01,
        height: globals.screenWidth * 0.8,
        backgroundColor: colors.white
    },
    selectPrefView: {
        marginTop: globals.screenWidth * 0.03,
        marginLeft: globals.screenWidth * 0.05,
        fontSize: globals.font_17,
        color: colors.tagNormalColor,
        fontFamily: globals.fontSFProTextSemibold
    },
    prefDoneView: {
        marginTop: globals.screenWidth * 0.03,
        marginRight: globals.screenWidth * 0.05,
        fontSize: globals.font_17,
        fontFamily: globals.fontSFProTextRegular,
        color: colors.blue
    },
    prefEditView: {
        marginTop: globals.screenWidth * 0.03,
        fontSize: globals.font_17,
        fontFamily: globals.fontSFProTextRegular,
        color: colors.blue
    },
    tagMainView: {
        flex: 1,
        marginTop: globals.screenWidth * 0.05,
        marginLeft: globals.screenWidth * 0.02,
        marginRight: globals.screenWidth * 0.02
    },
    editIcon: {
        width: 14,
        height: 14,
        marginTop: globals.screenWidth * 0.02,
        marginLeft: 10,
        alignContent: 'center',
        marginRight: globals.screenWidth * 0.05,
    },
    footermainView: {
        width: globals.WINDOW.width / 3,
    },
    footerInnterView: {
        alignItems: 'center', alignSelf: 'center'
    },
    IconTextRowView: {
        flexDirection: 'row'
    },
    
    noMoreArticles : {
        fontFamily: globals.fontSFProTextRegular,
        fontSize: globals.font_12

    },
    fetchArticle : {
        fontFamily: globals.fontSFProTextRegular,
        fontSize: globals.font_15,
        marginTop:10
    },
    headerTitle:{
        alignSelf:'center', 
        fontSize: globals.font_16, 
        color: colors.white,
        fontWeight:'500',
        marginLeft:-15,
        fontFamily: globals.fontSFProTextRegular
    },
    bannerTitle:{
        color: colors.white,
        fontSize:globals.font_13,
        fontFamily: globals.fontClaneLetteraTextTTRegular,
        marginLeft: 10
    },
    tagBG: {
        backgroundColor: colors.watchlistSep ,
        borderRadius: 20 ,
        padding: 5,
        marginTop: (Platform.OS == 'ios') ? (globals.iPhoneX) ? globals.screenHeight -110 : globals.screenHeight -85 :  globals.screenHeight -120,
        width : 125,
        // width: (DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') ? globals.screenWidth - 200 : globals.screenWidth - 290,
        alignSelf:'center',
    },
    toastText:{
        color:'white', 
        fontSize: globals.font_9, 
    },
    addedWatchList:{
        fontSize: 7, 
        marginTop:3,
        paddingLeft:5,
        paddingRight:5
    }
})
    