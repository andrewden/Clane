import React, { Component } from 'react';
import { Text, SafeAreaView, Image, TouchableOpacity, View, Animated, PanResponder, FlatList, Modal, TouchableWithoutFeedback, Platform, StatusBar, Dimensions, ActivityIndicator } from 'react-native';
import globalStyles from '../../../assets/styles/globalStyles';
import * as globals from '../../../lib/globals';
import { WINDOW } from '../../../lib/globals';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getshowModal } from '../../../redux/actions/showModal';
import { getshowLoader } from "../../../redux/actions/showLoaderModal";
import { dashboard, stock } from '../../../assets/images/map'
import { changeTheme } from '../../../redux/actions/changeTheme';
import { changeTabColor } from '../../../redux/actions/changeTabColorModel';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import DeviceInfo from 'react-native-device-info';
import * as colors from '../../../assets/styles/color';
import GestureRecognizer from 'react-native-swipe-gestures';
import LottieView from 'lottie-react-native';
import Dashboard from './dashboard';
import Share from 'react-native-share';
import moment from 'moment';
import imageCacheHoc from 'react-native-image-cache-hoc';
import { HeaderBackButton } from 'react-navigation';
import SafariView from 'react-native-safari-view';
import styles from './style';
import NewsAndroidWebview from '../Stocks/newsAndroidWebview'
import NewsArticleWebView from './NewsArticleWebView'
import GalleryImage from './galleryImage';
import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import { getShowAndroidModal } from '../../../redux/actions/showAndroidWebViewModal';
import Countly from 'countly-sdk-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import dashboardNewsArticleData from './dashboardArticleDetailData';
import firebase from 'react-native-firebase';
import branch, { BranchEvent } from 'react-native-branch';
const SCREEN_HEIGHT = Dimensions.get("window").height
const SCREEN_WIDTH = Dimensions.get("window").width
import { API } from '../../../lib/api';

var TAG = "News search detail screen : "
var _this = null;
var shareOptionObj = {
  title: "Clane",
  subject: "Clane"
}

let maxInitialAdded = 3;


const ANIMATION_DURATION = 300

const propOverridePlaceholderObject = {
  component: Image,
  props: {
    style: styles.newsDetailTopImageView,
    source: stock.news_placeholder
  }
};

const propOverridePlaceholderObjectTrendingNews = {
  component: Image,
  props: {
    style: styles.dashboardTopTrendingHeaderPlaceHolderImage,
    source: stock.news_placeholder_trending_news
  }
};

const CacheableImage = imageCacheHoc(Image, {
  validProtocols: ['http', 'https'],
  defaultPlaceholder: propOverridePlaceholderObject
});

var selectedItemForAction = null;
var selectedItemType = '';


class NewsSearchDetail extends Component {

  static navigationOptions = ({ navigation, screenProps, }) => {
    const { state } = navigation;
    return {
      header: null,
      HtmlCode: '',
      headerImageHeight: 0,

    }
  }

  constructor(props) {
    super(props);
    this.position = new Animated.ValueXY()
    this.swipedCardPosition = new Animated.ValueXY({ x: 0, y: -SCREEN_HEIGHT })
    this.state = {
      themeStyle: this.props.navigation.state.params.theme,
      modalVisibleWebView: false,
      isHeaderDisplay: false,
      tags: [],
      headerTitle: this.props.navigation.state.params.title,
      dashboardNewsDetailData: [],
      currentIndex: 0,
      isReverse: false,
      bottomVisible: false,
      loading: false,
      isServerError: false,
      likeCount: 0,
      isLiked: false,
      isBookmarked: false,
      newsId: this.props.navigation.state.params.artilceId,
      newsSearchDetailData: null,
      renderHoldText : false
    }
    this.tabbarTop = (globals.iPhoneX) ? new Animated.Value(-88) : new Animated.Value(-74)
    this.shareBottom = new Animated.Value(-74)
    _this = this
  }

  static callUserActionAPI() {
    if (selectedItemType == 'like') {

      API.newsArticlesAction(_this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, selectedItemForAction.id, 'like', true);
      if (selectedItemForAction.isLiked) {

        var event = { "key": globals.event_Unlike, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        _this.setState({ isLiked: false }, () => console.log("isLiked status If: " + _this.state.isLiked))
        let like = ((_this.state.likeCount) - 1);
        if (like != 0) {
          _this.setState({ likeCount: (_this.state.likeCount - 1) })
        }
        else {
          _this.setState({ likeCount: 0 })
        }
      } else {

        var event = { "key": globals.event_Like, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);

        _this.setState({ isLiked: true }, () => console.log("isLiked status else: " + _this.state.isLiked))
        let like = _this.state.likeCount
        if (_this.state.likeCount != null && _this.state.likeCount != 0) {
          like = like + 1
        }
        else {
          like++
        }
        _this.setState({ likeCount: like })

      }
      _this.forceUpdate()

    }
    else if (selectedItemType == 'bookmark') {
      API.newsArticlesAction(_this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, selectedItemForAction.id, 'bookmark', true);
      if (selectedItemForAction.isBookmarked) {
        var event = { "key": globals.event_Bookmark, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);

        _this.setState({ isBookmarked: false })
        // this.state.newsSearchDetailData.find(v => v.id == item.id).isBookmarked = false;
      } else {

        var event = { "key": globals.event_Bookmarked, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        _this.setState({ isBookmarked: true })
        //this.state.newsSearchDetailData.find(v => v.id == item.id).isBookmarked = true;
      }
      _this.forceUpdate()
    }
  }
  responseNewsSearchDetail = {
    success: (response) => {
      try {
        console.log("responseNewsSearchDetail data : ---> " + JSON.stringify(response))
        this.setState({ newsSearchDetailData: response.data, loading: false, likeCount: (response.data.like) ? response.data.like : '', isLiked: response.data.isLiked, isBookmarked: response.data.isBookmarked })
        // this.setState({newsSearchDetailData :})
        response.data.isLiked = false;
        response.data.isBookmarked = false;

      } catch (error) {
        this.setState({ loading: false })
        console.log('responseNewsSearchDetail catch error ' + JSON.stringify(error));
      }
    },
    error: (err) => {
      this.setState({ loading: false })
      console.log('responseNewsSearchDetail error ' + JSON.stringify(err));
    },
    complete: () => {
    }
  }


  componentDidMount() {
    var titleThreeWords = this.state.headerTitle.split(' ').slice(0,3).join(' ')
    this.setState({headerTitle : titleThreeWords})

    this.setState({ loading: true })
    if (this.state.loading) {
      this.animation.play();
    }
    API.getNewsDetail(this.responseNewsSearchDetail, this.state.newsId, globals.globalVars.userIdTemp_Global, true);
    //API.getNewRefreshedToken(this.refreshTokenResponseData);
    // let imagURL = this.state.newsSearchDetailData ? encodeURI(this.state.newsSearchDetailData.imageUrl) : encodeURI(this.state.newsSearchDetailData.imageUrl)
    // Image.getSize(imagURL, (width, height) => {
    //   var imageHeight = (globals.iPhoneX) ? height * (globals.WINDOW.width / width) : height * (globals.WINDOW.width / width)
    //   this.setState({ headerImageHeight: imageHeight })
    // })
    StatusBar.setHidden(false, "slide")
  }


  componentWillUnmount() {
    StatusBar.setHidden(false, 'none');

  }

  /** 
     * Method to handle response of refresh token method
    */
  refreshTokenResponseData = {
    success: () => {
      try {
        API.getNewsDetail(this.responseNewsSearchDetail, this.state.newsId, globals.globalVars.userIdTemp_Global, true);
      } catch (error) {
        console.log('refreshTokenResponseData catch error ' + JSON.stringify(error));
      }
    },
    error: (err) => {
      console.log('refreshTokenResponseData error ' + JSON.stringify(err));
    },
    complete: () => {
    }
  }

  _pressHandler(url = "https://www.google.com", title) {
    if (Platform.OS === 'android') {
      this.setState({ modalVisibleWebView: true })
      StatusBar.setHidden(false, "slide")
      this.props.getShowAndroidModal(true, globals.screenTitle_newsSearchDetail, url, title)
    }
    else {
      StatusBar.setHidden(false, "slide")
      SafariView.isAvailable()
        .then(SafariView.show({
          url: url,
          barTintColor: colors.white,
          readerMode: true,
        }))
        .catch(error => {
        });
    }
  }

  openModal() {
    return (
      <Modal animationType='slide' visible={this.state.modalVisibleWebView} onRequestClose={() => { NewsSearchDetail.handleCloseModalWebview() }}>
        <NewsArticleWebView setParentState={newState => this.setState(newState)} themeStyle={this.state.themeStyle} />
      </Modal>
    )
  }


  static hideStatusBar() {
    StatusBar.setHidden(true, 'slide')
  }
  /**
  * Method for handle close modal webview
  */
  static handleCloseModalWebview() {
    _this.props.getShowModalSelectBankAccount(false)
    StatusBar.setHidden(true, "slide")
    _this.setState({
      modalVisibleWebView: false,
    })
  }

  _onPressButton() {
    if (this.state.isHeaderDisplay) {
      this.setState({
        isHeaderDisplay: !this.state.isHeaderDisplay,
        bottomVisible: !this.state.bottomVisible
      }, () => {
        Animated.parallel([
          Animated.timing(this.tabbarTop, {
            toValue: (globals.iPhoneX) ? -88 : -74,
            duration: ANIMATION_DURATION
          }),
          Animated.timing(this.shareBottom, {
            toValue: -74,
            duration: ANIMATION_DURATION
          }),
        ]).start();
      });
    } else {
      this.setState({ isHeaderDisplay: !this.state.isHeaderDisplay, bottomVisible: !this.state.bottomVisible }, () => {
        Animated.parallel([
          Animated.timing(this.tabbarTop, {
            toValue: 0,
            duration: ANIMATION_DURATION
          }),
          Animated.timing(this.shareBottom, {
            toValue: 0,
            duration: ANIMATION_DURATION
          }),
        ]).start();
      });
    }
  }

  async shareMsg(item) {
    if (_this != null && item != null) {

      let customlink = ((item.url ? item.url : item.url))
      if (item.media.length > 0) {
      let branchUniversalObject = await branch.createBranchUniversalObject('news', {
        locallyIndex: true,
        title: item.title,
        contentDescription: item.summary,
        contentImageUrl: item.media[0].url,
        // contentMetadata: {
        //   ratingAverage: 4.2,
        //   customMetadata: {
        //     prop1: 'test',
        //     prop2: 'abc'
        //   }
        // }
      })

      let shareOptions = { messageHeader: '', messageBody: item.title + "\n\n" + "- via Clane App:" + "\n"  }
      let linkProperties = { feature: 'share', channel: 'ClaneApp' }
      let controlParams = { $desktop_url: customlink, $ios_url: customlink, $android_url: customlink }
      let { channel, completed, error } = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
    }
    else{
      let branchUniversalObject = await branch.createBranchUniversalObject('news', {
        locallyIndex: true,
        title: item.title,
        contentDescription: item.summary,
        // contentMetadata: {
        //   ratingAverage: 4.2,
        //   customMetadata: {
        //     prop1: 'test',
        //     prop2: 'abc'
        //   }
        // }
      })
  
      let shareOptions = { messageHeader: '', messageBody: item.title + "\n\n" + "- via Clane App:" + "\n"  }
      let linkProperties = { feature: 'share', channel: 'ClaneApp' }
      let controlParams = { $desktop_url: customlink, $ios_url: customlink, $android_url: customlink }
      let { channel, completed, error } = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
    }
    firebase.analytics().logEvent(globals.event_Sharedanewsarticle,
      Object.assign({}, { EventDetails: item ? item.title : item.title }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

  } 
  }

  /**
   * Method of bookmark pressed 
   * @param {*} item 
   */
  btnBookmarkPressed(item) {
    selectedItemForAction = item;
    selectedItemType = 'bookmark';

    if (globals.isLoggedIn == 'false') {
      this.checkLogin();
      globals.globalVars.dashboardTitle = globals.screenTitle_NewsStockSearchModal
    }
    else {
      API.newsArticlesAction(this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, item.id, 'bookmark', true);
      if (this.state.isBookmarked) {
        var event = { "key": globals.event_Bookmark, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);

        this.setState({ isBookmarked: false })
        // this.state.newsSearchDetailData.find(v => v.id == item.id).isBookmarked = false;
      } else {

        var event = { "key": globals.event_Bookmarked, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);

        this.setState({ isBookmarked: true })
        //this.state.newsSearchDetailData.find(v => v.id == item.id).isBookmarked = true;
      }
      this.forceUpdate()
    }
  }

  /**
  * Method for check user already login or not
  */
  checkLogin() {
    this.props.navigation.navigate("ModalNavigator")
  }

  responseLikeUnlike = {
    success: (response) => {
    },
    error: (err) => {
      this.setState({ loading: false });
    },
    complete: () => {
    }
  }

  /**
   * Method for like button press
   * @param {*} item 
   */
  btnLikePressed(item) {

    selectedItemForAction = item;
    selectedItemType = 'like';

    if (globals.isLoggedIn == 'false') {
      this.checkLogin();
      globals.globalVars.dashboardTitle = globals.screenTitle_NewsStockSearchModal
    }
    else {
      API.newsArticlesAction(this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, item.id, 'like', true);
      if (this.state.isLiked) {
        var event = { "key": globals.event_Unlike, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        this.setState({ isLiked: false }, () => console.log("isLiked status If: " + this.state.isLiked))
        let like = ((this.state.likeCount) - 1);
        if (like != 0) {
          this.setState({ likeCount: (this.state.likeCount - 1) })
        }
        else {
          this.setState({ likeCount: 0 })
        }
      } else {
        var event = { "key": globals.event_Like, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);

        this.setState({ isLiked: true }, () => console.log("isLiked status else: " + this.state.isLiked))
        let like = this.state.likeCount
        if (this.state.likeCount != null && this.state.likeCount != 0) {
          like = like + 1
        }
        else {
          like++
        }
        this.setState({ likeCount: like })

      }
      this.forceUpdate()
    }
  }


  // setTextData() {
  //   var data = globals.checkTimeStamp(this.state.newsSearchDetailData.published_date);

  //   if (data == '1') {
  //     return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>
  //       {"Swipe left to read more at "}
  //       {this.state.newsSearchDetailData ? this.state.newsSearchDetailData.source : this.state.newsSearchDetailData.source} - {"Today"} </Text>)

  //   }
  //   else if (data == '0') {
  //     return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>
  //       {"Swipe left to read more at "}
  //       {this.state.newsSearchDetailData ? this.state.newsSearchDetailData.source : this.state.newsSearchDetailData.source} - {'Yesterday'} </Text>)

  //   }
  //   else if (data == '2') {
  //     return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>
  //       {"Swipe left to read more at "}
  //       {this.state.newsSearchDetailData ? this.state.newsSearchDetailData.source : this.state.newsSearchDetailData.source} - {moment(this.state.newsSearchDetailData ? this.state.newsSearchDetailData.published_date : this.state.newsSearchDetailData.published_date).format('MM/DD/YY')} </Text>)

  //   }
  // }

  goToCategoryNewsArticleDetailScreen(item) {
    firebase.analytics().logEvent(globals.event_tagsCategories, 
    Object.assign({}, { EventDetails: item.name }, globals.getAnalyticBasicDataCategoryType(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global,item.name)));

    var event = { "key": globals.event_tagsCategories, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
    Countly.recordEvent(event);
    console.log("=====segmentation record event category wise detail for tags, result=> ");
    
    this.props.navigation.navigate('CategoryNewsArticle', { tagValue: item.name, title: item.name, categoryNewsDetail: this.state.newsSearchDetailData, theme: this.props.theme, isFrom: 'tags' })
  }

  /**
   * Method for render tags
   * @param {*} item 
   */
  renderTags(item) {
    return (
      <TouchableWithoutFeedback onPress={() => this.goToCategoryNewsArticleDetailScreen(item)}>
        <View style={[styles.tagBG, { flexDirection: 'row', backgroundColor: colors.tagColor }]}>
          <Text style={[styles.tagTextView, { color: colors.white }]}>
            <Text  >{item.name}
            </Text>
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  goToCategoryScreen() {
    var event = { "key": globals.event_CategoryScreen, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
    Countly.recordEvent(event);
    this.props.navigation.navigate('Category')
  }

  gotoBack(){
    this.props.navigation.goBack();
    // Dashboard.openNewsModal();
  }

 isRealValue(obj)
{
 return obj && obj !== 'null' && obj !== 'undefined';
}

  setTextData (item){
    console.log("item.published_date "+JSON.stringify(this.state.newsSearchDetailData));
    if (this.state.newsSearchDetailData != null) {
      var data = globals.convertTimestamp(item.published_date);

    if (data == '1') {
        return(<Text style={[styles.newsArticleDetailDate, {color: colors.newsDetailDate}]}>
            {"Swipe left to read more at "}
            { item.source } - {"Today"} </Text>)
    }
   else if (data == '0') {
       return(<Text style={[styles.newsArticleDetailDate, {color: colors.newsDetailDate}]}>
        {"Swipe left to read more at "}
        {  item.source  } - {'Yesterday'} </Text>)
    
    }
    else if (data == '2') {
        return( <Text style={[styles.newsArticleDetailDate, {color: colors.newsDetailDate}]}>
            {"Swipe left to read more at "}
            {  item.source } - {moment(item.published_date).format('MM/DD/YY')} </Text>)
    }
    }
    
}

renderBannerLogo(item) {
  console.log("SEARCH DATA  "+JSON.stringify(item));
  
  if (!this.state.isHeaderDisplay) {
    if (item && item.additional_data && item.additional_data.banner.url != null && item.additional_data.banner.url != '') {
      return (
        <View style={{ position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.2)', marginLeft:10, paddingLeft: 10, paddingRight: 10, marginTop: (globals.iPhoneX) ? 60 : 40 }}>
          {(item.additional_data && item.additional_data.banner.url != null && item.additional_data.banner.url != '') ?
            <Image style={{
              height: 30,
              width: 50,
            }} source={{ uri: encodeURI(item.additional_data.banner.url) }} permanent={true} resizeMode={'contain'}
            /> : null}

        </View>)
    }
    else {
      return null
    }

  } else {
    return null
  }

}

  /**
   * Method for render articles on swipe up and down using react native animated
   */
  renderNewsSearchDetail = () => {
    let item = this.state.newsSearchDetailData
    return (
      <GestureRecognizer onSwipeLeft={(state) => this._pressHandler(this.state.newsSearchDetailData.url, this.state.newsSearchDetailData.title)} style={[globalStyles.safeviewStyle]}>
        <View style={{ flex: 1 }}>
          {this.openModal()}
          <View style={[styles.searchScreenItemLeftView]}>
            <TouchableWithoutFeedback onPress={() => this._onPressButton()}>

              <View style={[styles.rescentSeachTextView, { backgroundColor: colors.white }]}>
                <View style={[styles.newsDetailTopImage]}>
                  {(this.state.newsSearchDetailData !=null ) ? (this.state.newsSearchDetailData.media.url) ? <CacheableImage style={[styles.newsDetailTopImageView,]} source={{ uri: encodeURI(this.state.newsSearchDetailData.media.url) }} permanent={true} /> :
                    <Image style={[styles.newsDetailTopImageView,]} source={stock.news_placeholder} permanent={true} /> :
                    <Image style={[styles.newsDetailTopImageView,]} source={stock.news_placeholder} permanent={true} />
                  }
                  {this.renderBannerLogo(this.state.newsSearchDetailData)}
                </View>
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                  <Text style={[styles.newsArticleDetailTitle, { color: colors.articleNewsTitle }]}>{this.state.newsSearchDetailData != null ? this.state.newsSearchDetailData.title : null}</Text>
                  {(this.state.newsSearchDetailData != null) ?
                    <Text style={[styles.summaryText, { lineHeight: (globals.iPhoneX) ? WINDOW.height * 0.028 : WINDOW.height * 0.0315 }, { color: colors.newsDetailSummaryLight }]}>{this.state.newsSearchDetailData.summary} </Text>
                    : null}

                  {/* <Text style={[styles.newsArticleDetailDate, { color: colors.selectedFontColor }]}>{'swipe left for more read'}</Text>
                  <Text style={[styles.newsArticleDetailDate, { color: colors.selectedFontColor }]}>{this.state.newsSearchDetailData.source + " - " + moment(this.state.newsSearchDetailData.published_date).format('MMM DD, YYYY')}</Text> */}
                  {this.setTextData(this.state.newsSearchDetailData)}
                  
                  {/* <View style={{ flex: 1, marginLeft: 15, marginTop: 10, flexDirection: 'row' }}>
                  {(this.state.newsSearchDetailData != null) ? <FlatList
                      ref={"myFlatList"}
                      data={this.state.newsSearchDetailData.tags}
                      style={{ height: 20, marginBottom: 10 }}
                      renderItem={({ item }) => this.renderTags(item)}
                      keyExtractor={(item, index) => index.toString()}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    /> : null}
                    
                  </View> */}
                </View>
              </View>
            </TouchableWithoutFeedback>


            <Animated.View style={[styles.newsDetailHeader, { transform: [{ translateY: this.tabbarTop }] }]}>
              <View style={styles.customStatusBar} />
              <View style={{ flexDirection: 'row', flex: 1 }}>
                {/* <View style={[styles.headerbackButtonView, {flex:0.1}]}>
                  <HeaderBackButton onPress={() => this.gotoBack()} title='' tintColor='white' />
                </View> */}
                <TouchableOpacity style={{ flex:0.1, justifyContent: 'flex-start', marginLeft:15 }} onPress={() => this.props.navigation.goBack(null)}>
                      <Ionicons name="ios-arrow-back" size={30} color={colors.white} />
                    </TouchableOpacity>
                <View style={[styles.headerTitleView, {flex: 0.8}]}>
                  <Text style={styles.headerTitleText}>{this.state.headerTitle}...</Text>
                </View>
                 
              </View>
            </Animated.View>

            <TouchableOpacity onPress={()=>this._pressHandler(this.state.newsSearchDetailData.url, this.state.newsSearchDetailData.title)}>
                  <View style={{ height: (Platform.OS == 'android') ? 55 : (globals.iPhoneX) ? 68 : 50, backgroundColor:'rgba(24,24,24,1)' }}>
                    {(this.state.newsSearchDetailData != null) ? <Image style={{  opacity: 0.1,
                      height: (Platform.OS == 'android') ? 55 : (globals.iPhoneX) ? 68 : 45,
                      width: globals.screenWidth, }} source={{ uri: encodeURI(this.state.newsSearchDetailData.media.url) }} permanent={true} blurRadius ={1}/> :
                          <Image style={{ opacity: 0.1,
                            height: (Platform.OS == 'android') ? 55 : (globals.iPhoneX) ? 68 : 45,
                            width: globals.screenWidth,}} source={stock.news_placeholder} permanent={true} blurRadius ={1} />
                        }
                    
                    <View style={{position:'absolute', padding:5,flex:1,  }}>
                    {(this.state.newsSearchDetailData != null)? <Text style={[styles.bannerTitle, {marginTop:2}]}>{this.state.newsSearchDetailData.additional_data && this.state.newsSearchDetailData.additional_data.banner.title}</Text>: null}
                    
                    <Text style={[styles.bannerTitle]}>{'Tap to know more'}</Text>

                    </View>
                  </View>
                  </TouchableOpacity>


            <Animated.View style={[{ position: 'absolute', display: (this.state.bottomVisible) ? "flex" : "none", paddingBottom: (Platform.OS == 'android') ? 10 : (DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'iPhone') ? 20 : 5, bottom: this.tabbarTop, width: globals.WINDOW.width, backgroundColor: colors.newsDetailShareBGLight }]}>
              <View style={[styles.newsDetailSepView, { backgroundColor: colors.newsDetailSepViewLight }]} ></View>
              <View style={{ width: '100%', flexDirection: 'row' }}>

                <View style={styles.footermainView}>
                  <TouchableOpacity onPress={() => this.btnLikePressed(item)}>
                    {
                      <View style={styles.footerInnterView}>
                        <View style={[styles.footerInnterView, { flexDirection: 'row' }]}>
                          <Image source={(this.state.isLiked) ? dashboard.liked : dashboard.whiteLike} style={[styles.footerIconView, { marginRight: 2 }]} />
                          {
                            // (this.state.totalLikes != 0) ? 
                            <Text style={styles.bottomButtonText} numberOfLines={1}>{(this.state.likeCount != null && this.state.likeCount != 0) ? this.state.likeCount : null}</Text>
                            // : null
                          }
                        </View>
                        <Text style={styles.bottomButtonText}>{(this.state.isLiked) ? "Unlike" : "Like"}</Text>
                      </View>
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.footermainView}>
                  <TouchableOpacity onPress={() => this.btnBookmarkPressed(item)}>
                    {
                      <View style={styles.footerInnterView}>
                        <Image source={(this.state.isBookmarked) ? dashboard.bookmark : dashboard.whiteBookmark} style={[styles.footerIconView]} />
                        <Text style={styles.bottomButtonText}>{(this.state.isBookmarked) ? "Bookmarked" : "Bookmark"}</Text>
                      </View>

                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.footermainView}>
                  <TouchableOpacity onPress={() => this.shareMsg(item)}>
                    <View style={styles.footerInnterView}>
                      <Image source={stock.share_icon} style={[styles.footerIconView]} />
                      <Text style={styles.bottomButtonText}>{"Share"}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>
        </View>
      </GestureRecognizer>
    )
  }

  componentDidUpdate() {
    if (this.state.loading) {
      this.animation.play();
    }
  }

  /**
   *  method for render hold messsage view
   */
  renderHoldTextView() {
    return (
      <View>
        <Text>{globals.holdMessage}</Text>
      </View>
    )
  }

  /**
  * method for set timeout for hold text for 3 seconds
  */
  timeOutHoldTextStatusChange() {
    setTimeout(() => { this.setState({ renderHoldText: true }) }, 3000)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          (this.state.loading) ?
            <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', backgroundColor : 'white' }}>
              <LottieView
               style={[{height: 500, width: 100,  alignSelf: 'center' }]}
               source={require('../../../animations/lf20_SUxRm5.json')}
                ref={animation => {
                  this.animation = animation;
                }}
                loop={true} />
              {
              this.timeOutHoldTextStatusChange()
            }
            <View>
              {
                //this.renderHoldTextView()
                (this.state.renderHoldText) ? this.renderHoldTextView() : null

              }
            </View>
            </View>
            :
            this.renderNewsSearchDetail()
        }
      </View>
    )
  }

}


const mapStateToProps = (state, ownProps) => {
  return {
    register: state.showModal_red.register,
    Otp: state.showModal_red.Otp,
    loader: state.claneLoader_red.loader,
    color: state.changeTabColor_red.color,
    marketStatus: state.checkMarketStatus_red.marketStatus,
    selectBankAccount_modal: state.showModalSelectBankAccount_red.selectBankAccount_modal,
    theme: state.changeTheme_red.theme,
  };
};

const mapDispatchToProps = dispatch => (bindActionCreators({
  getshowLoader,
  getshowModal,
  changeTheme,
  changeTabColor,
  checkMarketStatus,
  getShowModalSelectBankAccount,
  getShowAndroidModal
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(NewsSearchDetail);

