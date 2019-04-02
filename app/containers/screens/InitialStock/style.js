import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { iPhoneX, headerHeight } from '../../../lib/globals';
import { WINDOW } from '../../../lib/globals';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import DeviceInfo from 'react-native-device-info';
let device = DeviceInfo.getModel();
const os = DeviceInfo.getSystemName();
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

var blueHeaderTop = 80;
var trendingHeaderTop = 100;

export default StyleSheet.create({

    //dashboard Style , dashboard news stock search modal 

    mainTopNewsStyle: {
        // backgroundColor : colors.blue,
        height: height * 0.52,
        //paddingTop : 20
    },

    headerViewVisibility: {
        flexDirection: 'row',
        backgroundColor: colors.blue,
        //paddingLeft : 10
    },

    headerWrapper: {
        zIndex: 10,
        backgroundColor: colors.blue,
        //height: headerHeight,
        height: (Platform.OS == 'ios') ? (globals.iPhoneX) ? 125 : 110 : 100,
        width: '100%',
    },
    headerTop: {
        height: iPhoneX ? 80 : 60,
        paddingTop: (Platform.OS == 'ios') ? iPhoneX ? 50 : 30 : 0,
        paddingRight: 10,
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    rectangle: {
        flex: 1,
        marginRight: 10,
        height: 35,
        padding: 5,
        backgroundColor: colors.white,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 10,
        alignItems: 'center',
    },

    headerSideBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerProfileImg: {
        height: 20,
        width: 20,
        borderColor: colors.white
    },

    claneLogo: {
        height: 30,
        width: 50,
        left: globals.screenWidth * 0.12,
        position: 'absolute',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    headerSearch: {
        borderBottomWidth: 0,
        height: 40,
        flex: 5,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 5,
        // color: 'white',
        // textAlign: 'left',
    },
    row: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        paddingTop: 15
    },
    tabView: {
        paddingHorizontal: 10,
        // marginTop: 10,

    },
    tabOptionTextStyle: {
        fontSize: 14,
        color: colors.white,
        fontFamily: globals.fontSFProTextRegular

    },
    badgeView: {
        width: 18,
        height: 13,
        borderRadius: 10,
        backgroundColor: colors.white,
        //alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        //marginTop: 10
    },
    badgeTextStyle: {
        color: colors.blue,
        fontSize: 10,
        textAlign: 'center'
    },
    tabContainer: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        marginLeft:6
    },


    indicatorLine: {
        borderBottomColor: colors.tabActiveIndicatorCompanyScreenLightTheme,
        borderBottomWidth: 5,

    },

    headerIconsearch: {
        color: colors.dashBoradSearch,
    },
    closeIconModal: {
        color: 'white',
    },
    searchViewCancel: {
        color: colors.white,
        fontSize: iPhoneX ? 19 : 17,
        marginLeft: 5,
        fontFamily: globals.fontSFProTextRegular
    },
    headerSearchView: {
        backgroundColor: colors.lightGray,
        borderBottomWidth: 0,
        height: 35,
        flex: 5,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 5,
        color: colors.blackColor,
        textAlign: 'left',
    },
    notificationIcon: {
        height: 20,
        width: 20,
    },

    topNewsImageStyle: {
        height: height * 0.45,
        width: width
    },
    mainMarketDataStyle: {
        flex: 1,
        backgroundColor: colors.white,
        marginTop: 10,
    },
    dashboardTopHeaderImage: {
        //height: globals.getNewsTopHeaderHeight(),
        height: (DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') ? globals.WINDOW.height * 0.300 : globals.WINDOW.height * 0.335,
        //height: (iPhoneX) ? globals.WINDOW.height * 0.335 : globals.WINDOW.height * 0.335,
        width: globals.WINDOW.width,
        //height: globals.getNewsTopHeaderHeight()
    },
    dashboardTopSearch: {
        flex: 0.4,
        alignSelf: 'flex-end',
        alignItems: 'flex-end'
    },
    dashboardTopHeaderTransparent: {
        position: 'absolute',
        flexDirection: 'row',
        width: '100%',
        flex: 1,
        paddingTop: iPhoneX ? 15 : 10,
        marginTop: (iPhoneX ? 5 : (DeviceInfo.getModel() == 'iPhone 6s') ? 15 : 5),
    },
    dashboardNewsTitle: {
        marginTop: 5,
        fontSize: globals.font_18,
        color: colors.white,
        fontWeight: '800',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
        marginLeft: 10,
        fontFamily: globals.fontClaneLetteraTextTTExtraBold
    },

    dashboardTopTrendingHeaderPlaceHolderImage: {
        width: 100,
        height: 100,
        marginTop: -10,
        resizeMode: 'cover'
    },
    leftTopView: {
        width: width * 0.83,
    },
    rightTopImageStyle: {
        height: 28,
        width: 27,
        // marginLeft:(globals.iPhoneX) ? globals.screenWidth*0.045 : globals.screenWidth*0.03,
        marginLeft: (Platform.OS == 'ios') ? (globals.iPhoneX) ? globals.screenWidth * 0.045 : globals.screenWidth * 0.03 : globals.screenWidth * 0.05
        // marginTop : 10,
    },
    dashboardTopNewsTitle: {
        fontWeight: '700',
        fontSize: globals.font_16,
        fontFamily: globals.fontClaneLetteraTextTTBold,
        color: colors.dashboardNewsTitleColor
    },
    dashboardTopNewsHours: {
        fontSize: globals.font_9,
        marginTop: 5,
        color: colors.topNewsHours,
        fontFamily: globals.fontClaneAkkuratTTLight,
    },

    //new dashboard topnews view style : 

    dashboardMainTopView :{
      backgroundColor: colors.categorySepViewLight, height: 4
    },
    dashboardDayWishText:{
      fontSize: globals.font_17,
      fontFamily: globals.fontClaneLetteraTextTTExtraBold,
      color : colors.tagNormalColor,
    },
    dashboardRandomText:{
      fontSize: globals.font_12,
      fontFamily: globals.fontSFProTextRegular,
      color : colors.tagNormalColor,
    },
    dashboardTimeAgoText :{
      fontSize: globals.font_9,
      fontFamily: globals.fontClaneAkkuratTTLight,
      color : colors.tagNormalColor,
    },
    leftImageView:{
      width : '100%',     
       height : '100%',
      backgroundColor : 'red'
    },

    dashboardFirstImgOnlyOneNews :{
      height: (DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') ? globals.WINDOW.height * 0.295 : (iPhoneX) ? globals.WINDOW.height * 0.32 : globals.WINDOW.height * 0.33,
      width: '100%',
    },

    dashboardFirstImg:{
      height: (DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') ? globals.WINDOW.height * 0.295 : (iPhoneX) ? globals.WINDOW.height * 0.32 : globals.WINDOW.height * 0.33,
      width: width * 0.6,
    },
    dashboardSecThirdImg:{
      height: (DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') ? globals.WINDOW.height * 0.139 : (iPhoneX) ? globals.WINDOW.height * 0.154 : globals.WINDOW.height * 0.16,
       width:(DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') ? width * 0.31 : (iPhoneX) ? width * 0.32 : width * 0.327,
    },
    dashboardOnlySecImg :{
      height: (DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') ? globals.WINDOW.height * 0.295 : (iPhoneX) ? globals.WINDOW.height * 0.32 : globals.WINDOW.height * 0.33,
      width:(DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') ? width * 0.31 : (iPhoneX) ? width * 0.32 : width * 0.33,
    },
  absolulteViewAll: {
    flex: 1, marginLeft: 10, position: 'absolute', flex: 1, alignSelf: 'flex-end', alignItems: 'flex-end', width: width * 0.6, paddingLeft: 10,
    paddingTop: (DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') ? height * 0.234 : (iPhoneX) ? height * 0.275 : height * 0.282
  },
    viewAllView :{
      height : 36, width : 84, backgroundColor : colors.dashboardViewAll, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'
    },

    viewAllStyle:{
      fontSize : globals.font_12,
      color : colors.dashboardNewsTitleColor
    },


    marketBgStyle: {
        height: '100%',
        width: '100%'
    },
    dashboardMarketMainView: {
        flexDirection: 'row', paddingTop: 10, marginTop: 10, justifyContent: 'center',
    },
    bottomMarketView: {
        marginTop: (Platform.OS == 'ios') ? (iPhoneX) ? height * 0.15 : (DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') ? height * 0.08 : height * 0.125 : height * 0.10,
        flex: 1,

        //justifyContent : 'flex-start',
        //alignItems : 'flex-start',
        //marginLeft :(DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE')?width * 0.20 : width * 0.359,
        paddingHorizontal: 10,

    },
    dashboardMarketTrendingTitle: {
        paddingTop: 10,
        alignSelf: 'flex-end',
        color: colors.white,
        fontSize: globals.getFontSizeDashboardTrendingTitle(),
        lineHeight: 22,
        marginRight: globals.screenWidth * 0.01,
        fontFamily: globals.fontSFProTextBold
    },
    dashboardBottomMarketViewStyle: {
        flexDirection: 'column', margin: 10, height: 100, width: width * 0.270, paddingBottom: 10,
        marginLeft: globals.screenWidth * 0.05,

    },
    txtMarketType: {
        color: colors.white,
        fontSize: globals.font_10,
        fontFamily: globals.fontClaneLetteraTextTTBold
    },
    bottomSeprateLine: {
        height: 60, width: 3
    },
    marketSymbolNameStyle: {
        color: colors.white,
        fontSize: globals.font_12,
        fontFamily: globals.fontSFProTextSemibold,
        letterSpacing: 0.14, marginBottom: 4
    },

    //dashboard news article detail style
    headerbackButtonView: {
        alignSelf: 'flex-start', justifyContent: 'flex-start', flex: 1
    },
    headerRightImageView: {
        marginRight: 10,
        justifyContent: 'center',
        flex: 1,
    },
    headerTitleView: {
        alignSelf: 'center', justifyContent: 'center', flex: 1
    },
    headerTitleText: {
        fontSize: 17, letterSpacing: -0.41, fontFamily: globals.fontSFProTextSemibold, color: colors.white, alignSelf: 'center',
    },
    headerRightIcon: {
        width: 27,
        height: 25,
        alignSelf: 'flex-end',
        marginHorizontal: 10
    },
    firstNewsBottomText:{
      fontSize : globals.font_11,
      fontFamily: globals.fontClaneLetteraTextTTBold,
      color : colors.white

    },
    searchScreenItemLeftView: {
        flex: 1,
    },
    rescentSeachTextView: {
        flex: 1,
        flexDirection: 'column',
    },
    blueHorizontal:{
      height : 2,
      backgroundColor : colors.tabIndicatorLightTheme
    },
    categoryView:{
      marginLeft : 15,
      backgroundColor : colors.tabIndicatorLightTheme,
      width : width * 0.5,
      height: 16
    },
    categoryText:{
      fontSize : globals.font_10,
      fontFamily : globals.fontClaneLetteraTextTTBold,
      color : colors.white,
      paddingLeft : 10
    },
    newsDetailTopImage: {
        // height: 260
        // height: globals.WINDOW.height / 2.3,
    },
    newsDetailTopImageView: {
        height: Math.round(globals.WINDOW.height / 2.3),
        width: '100%',
        // resizeMode:'cover'
    },
    newsArticleDetailTitle: {
        marginHorizontal: 15,
        marginTop: 10,
        fontSize: globals.getFontSizeNewsTitle(),
        fontWeight: '600',
        fontFamily: globals.fontClaneLetteraTextTTBold
    },
    summaryText: {
        marginHorizontal: 15,
        fontSize: globals.getFontSizeSummary(),
        marginTop: 5,
        fontFamily: globals.fontSFProTextLight,
    },
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
    newsArticleDetailDate: {
        marginHorizontal: 15,
        marginTop: 10,
        fontSize: globals.getFontSizeNewsDate(),
        fontFamily: globals.fontSFProTextRegular,
        // color: colors.darkHeartSelect, 
        fontWeight: '500'
    },
    customStatusBar: {
        // backgroundColor: 'red',
        width: '100%',
        height: (Platform.OS == 'android') ? 0 : (iPhoneX) ? 44 : 20,
    },
    newsDetailSepView: {
       height: 1,
        marginBottom: 10
    },
    newsDetailShare: {
        padding: 10,
        paddingBottom: (globals.iPhoneX) ? 20 : 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerIconView: {
        width: 20,
        height: 20,
        alignItems: 'center',
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    bottomButtonText: {
        fontSize: globals.font_10,
        color: colors.bottomButtonColor,
        marginTop: 4,
        letterSpacing: 0.12,
        fontFamily: globals.fontSFProTextRegular,
        // letterSpacing: 2
    },
    bottomButtonCountText: {
        fontSize: globals.font_10,
        color: colors.bottomButtonColor,
        fontFamily: globals.fontSFProTextRegular,
        paddingLeft: 5
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


    //newsstock search modal - (After header)
    searchScreenItem: {
        paddingVertical: 8,
        marginHorizontal: 10,
        paddingBottom: 15
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
    noRecordFoundView: {
        alignItems: 'center', 
        justifyContent: 'center', 
        alignSelf:'center',
        paddingTop: 140,
        marginHorizontal: 20,
       
    },
    noRecordFoundText: {
        fontSize: 12, color: colors.articleNewsSMall, marginTop: 18, textAlign: 'center', fontFamily: globals.fontSFProTextLight
    },

    // News Detail screen 
    tagBG: {
        paddingLeft:10,
        paddingRight:10,
        borderRadius:10,
        marginHorizontal:3,
        height : 20,
    },
    tagTextView:{
        fontFamily:globals.fontClaneLetteraTextTTRegular,
        fontSize: globals.font_14,
    },
    noMoreArticles : {
        fontFamily: globals.fontSFProTextRegular,
        fontSize: globals.font_10

    },
    noInternetTextView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trendingFooterText: {
        fontSize: globals.font_20,
        fontWeight: '400',
        fontFamily: globals.fontSFProTextRegular
    },
    watchlistFooterMain: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: WINDOW.height - (iPhoneX ? 260 : 186),
        flexDirection: 'column',
    },
    fetchArticle : {
        fontFamily: globals.fontSFProTextRegular,
        fontSize: globals.font_15,
        marginTop:10

    },
    tryAgainButtonView: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: globals.font_17,
        lineHeight: 17 * 1.5,
        height: '100%',
    },
    buttonStyles: {
        marginBottom: 20,
        height: 50,
        borderRadius: 10,
        width: WINDOW.width - 30,
        borderColor: colors.blue,
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
    recentSearchMainView: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: colors.lightThemeHeaderBackground
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
    noInternetView:{
      flex : 1, 
      justifyContent : 'center',
       alignItems : 'center',
     
    },
    noInternetText :{
      fontFamily: globals.fontSFProTextRegular,
      fontSize: globals.font_16,
      color : colors.blackColor
    }
})

