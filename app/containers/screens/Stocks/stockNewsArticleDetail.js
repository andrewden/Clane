import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
  Modal
} from 'react-native';
import Countly from 'countly-sdk-react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import branch, { BranchEvent } from 'react-native-branch';
import { WINDOW } from '../../../lib/globals';
import globalStyles from '../../../assets/styles/globalStyles';
import { HeaderBackButton } from 'react-navigation';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import { stock } from '../../../assets/images/map'
import styles from './style';
import Button from '../../../components/Button';
import moment from 'moment';
import Share from 'react-native-share';
import imageCacheHoc from 'react-native-image-cache-hoc';
import News from './news';
import DeviceInfo from 'react-native-device-info';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import SafariView from 'react-native-safari-view';
// import NewsAndroidWebview from './newsAndroidWebview';
import NewsArticleWebView from '../InitialStock/NewsArticleWebView';
import { getShowAndroidModal } from '../../../redux/actions/showAndroidWebViewModal';

import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import firebase from 'react-native-firebase';

var _this = null;
var shareOptionObj = {
  title: "Clane",
  subject: "Clane"
}

const ANIMATION_DURATION = 300

const propOverridePlaceholderObject = {
  component: Image,
  props: {
    style: styles.topHeaderImage,
    source: stock.news_placeholder
  }
};

const propOverridePlaceholderObjectDark = {
  component: Image,
  props: {
    style: styles.topHeaderImage,
    source: stock.news_placeholder_dark
  }
};

const CacheableImage = imageCacheHoc(Image, {
  validProtocols: ['http', 'https'],
  defaultPlaceholder: propOverridePlaceholderObject
});

const CacheableImageDark = imageCacheHoc(Image, {
  validProtocols: ['http', 'https'],
  defaultPlaceholder: propOverridePlaceholderObjectDark
});

class stockNewsArticleDetail extends Component {

  static navigationOptions = ({ navigation, screenProps, }) => {
    const { state } = navigation;
    return {
      header: null,
      HtmlCode: '',
      headerImageHeight: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ themeStyle: nextProps.theme })
  }

  constructor(props) {
    super(props);
    this.state = {
      themeStyle: this.props.navigation.state.params.theme,
      articleData: this.props.navigation.state.params.articleData,
      modalVisibleWebView: false,
      isHeaderDisplay: false,
      image_url: '',
    }
 
    this.tabbarTop = (globals.iPhoneX) ? new Animated.Value(-88) : new Animated.Value(-64)
    this.shareBottom = new Animated.Value(-64)

    // StatusBar.setHidden(true, "slide")
    _this = this

    console.log("articleData articledetail" + JSON.stringify(this.state.articleData))
    console.log("themeStyle At News Detail" + JSON.stringify(this.props));
  }

  async shareMsg() {
    console.log("__-----__---_-  " + JSON.stringify(_this.state.articleData) + (_this != null && _this.state.articleData != null));
    if (globals.isInternetConnected) {
      if (_this.state.articleData.article ? _this.state.articleData.article.title : _this.state.articleData.title) {
        var customlink = ((_this.state.articleData.linkToArticle ? _this.state.articleData.linkToArticle : _this.state.articleData.linkToArticle))
        console.log('====================================')
        console.log('customlink stocknewsarticledetail : ' + customlink)
        console.log('====================================')
      }
      if (_this.state.articleData.image != null && _this.state.articleData.image != undefined && _this.state.articleData.image != '') {
        let branchUniversalObject = await branch.createBranchUniversalObject('news', {
          locallyIndex: true,
          title: this.state.articleData.title,
          contentDescription: this.state.articleData.summary,
          contentImageUrl: _this.state.articleData.image,
          // contentMetadata: {
          //   ratingAverage: 4.2,
          //   customMetadata: {
          //     prop1: 'test',
          //     prop2: 'abc'
          //   }
          // }
        })

        let shareOptions = { messageHeader: '', messageBody: _this.state.articleData.title + "\n\n" + "- via Clane App:" + "\n" }
        let linkProperties = { feature: 'share', channel: 'ClaneApp' }
        let controlParams = { $desktop_url: customlink, $ios_url: customlink, $android_url: customlink }
        console.log("controlParams-------->" + JSON.stringify(controlParams))
        let { channel, completed, error } = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)

        var event = { "key": globals.event_Sharedanewsarticle, "count": 1 };
        event.segmentation = Object.assign({}, { EventDetails: _this.state.articleData ? _this.state.articleData.title : _this.state.articleData.title }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
        Countly.recordEvent(event);
        console.log("=====segmentation record event globals.event_Sharedanewsarticle, result=> ");
      }
      else {
        let branchUniversalObject = await branch.createBranchUniversalObject('news', {
          locallyIndex: true,
          title: this.state.articleData.title,
          contentDescription: this.state.articleData.summary,
          // contentMetadata: {
          //   ratingAverage: 4.2,
          //   customMetadata: {
          //     prop1: 'test',
          //     prop2: 'abc'
          //   }
          // }
        })

        let shareOptions = { messageHeader: '', messageBody: _this.state.articleData.title + "\n\n" + "- via Clane App:" + "\n" }
        let linkProperties = { feature: 'share', channel: 'ClaneApp' }
        let controlParams = { $desktop_url: customlink, $ios_url: customlink, $android_url: customlink }
        console.log("controlParams-------->" + JSON.stringify(controlParams))
        let { channel, completed, error } = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)

        var event = { "key": globals.event_Sharedanewsarticle, "count": 1 };
        event.segmentation = Object.assign({}, { EventDetails: _this.state.articleData ? _this.state.articleData.title : _this.state.articleData.title }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
        Countly.recordEvent(event);
        console.log("=====segmentation record event globals.event_Sharedanewsarticle, result=> ");
      }
      firebase.analytics().logEvent(globals.event_Sharedanewsarticle,
        Object.assign({}, { EventDetails: _this.state.articleData ? _this.state.articleData.title : _this.state.articleData.title }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
    }
    else {
      Alert.alert(globals.APP_NAME, globals.networkNotAvailable)
    }


  }

  componentWillUnmount() {
    StatusBar.setHidden(false, 'slide');
    // News.showStatusBar();
  }

  componentDidMount() {
    StatusBar.setHidden(false, 'slide');

    let imageUrl = this.state.articleData.article ? (this.state.articleData.article.image) : this.state.articleData.image
    this.setState({ image_url: imageUrl })
    var event = { "key": globals.event_Generalnewspagenavigation, "count": 1 };
    event.segmentation = Object.assign({}, { EventDetails: 'General news article details' }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
    Countly.recordEvent(event);
    console.log("=====segmentation record event globals.event_Generalnewspagenavigation, result=> ");

    firebase.analytics().logEvent(globals.event_Generalnewspagenavigation,
      Object.assign({}, { EventDetails: 'General news article details' }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

    firebase.analytics().logEvent(globals.event_TrendingNews,
      Object.assign({}, { EventDetails: 'Trending article details' }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

    let imagURL = this.state.articleData.article ? encodeURI(this.state.articleData.article.image) : encodeURI(this.state.articleData.image)
    Image.getSize(imagURL, (width, height) => {
      var imageHeight = (globals.iPhoneX) ? height * (globals.WINDOW.width / width) : height * (globals.WINDOW.width / width)
      this.setState({ headerImageHeight: imageHeight })
    })

    console.log("Article Data ::::: " + globals.checkTimeStamp(this.state.articleData.publishedDate));
    if (Platform.OS == 'ios') {
      SafariView.addEventListener(
        "onDismiss",
        () => {
          if (this.state.isHeaderDisplay) {
            StatusBar.setHidden(false, "slide")
          } else {
            // StatusBar.setHidden(true, "slide")
            StatusBar.setHidden(false, "slide")

          }
        }
      );
    }

  }

  _onPressButton() {
    if (this.state.isHeaderDisplay) {
      StatusBar.setHidden(false, "slide")
      this.setState({
        isHeaderDisplay: !this.state.isHeaderDisplay
      }, () => {
        Animated.parallel([
          Animated.timing(this.tabbarTop, {
            toValue: (globals.iPhoneX) ? -88 : -64,
            duration: ANIMATION_DURATION
          }),
          Animated.timing(this.shareBottom, {
            toValue: -64,
            duration: ANIMATION_DURATION
          }),
        ]).start();
      });
    } else {
      StatusBar.setHidden(false, "slide")
      this.setState({ isHeaderDisplay: !this.state.isHeaderDisplay }, () => {
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

  onResponderReleaseHandler() {
  }

  _pressHandler(url = "https://www.google.com", title) {
    if (Platform.OS === 'android') {
      console.log("this.state.image_url " + this.state.image_url);

      this.setState({ modalVisibleWebView: true })
      StatusBar.setHidden(false, "slide")
      this.props.getShowAndroidModal(true, globals.screenTitle_stock_news_article_detail, url, title, this.state.image_url)
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

  /**
  * Method for handle close modal webview
  */
  static handleCloseModalWebview() {
    _this.props.getShowAndroidModal(false)
    StatusBar.setHidden(true, "slide")
    _this.setState({
      modalVisibleWebView: false
    })
  }

  openModal() {
    return (
      <Modal animationType='slide' visible={this.state.modalVisibleWebView} onRequestClose={() => { stockNewsArticleDetail.handleCloseModalWebview() }}>
        <NewsArticleWebView setParentState={newState => this.setState(newState)} imagePath={this.state.image_url} />
        {/* themeStyle={this.state.themeStyle} */}
      </Modal>
    )
  }

  setTextData() {
    var data = globals.checkTimeStamp(this.state.articleData.publishedDate);

    if (data == '1') {
      return (<Text style={[styles.newsArticleDetailDate, this.state.themeStyle.newsDetailDate]}>
        {"Swipe left to read more at "}
        {this.state.articleData.article ? this.state.articleData.article.source : this.state.articleData.source} - {"Today"} </Text>)
    }
    else if (data == '0') {
      return (<Text style={[styles.newsArticleDetailDate, this.state.themeStyle.newsDetailDate]}>
        {"Swipe left to read more at "}
        {this.state.articleData.article ? this.state.articleData.article.source : this.state.articleData.source} - {'Yesterday'} </Text>)

    }
    else if (data == '2') {
      return (<Text style={[styles.newsArticleDetailDate, this.state.themeStyle.newsDetailDate]}>
        {"Swipe left to read more at "}
        {this.state.articleData.article ? this.state.articleData.article.source : this.state.articleData.source} - {moment(this.state.articleData.article ? this.state.articleData.article.publishedDate : this.state.articleData.publishedDate).format('MM/DD/YY')} </Text>)

    }

  }

  renderTopImage(data){

  }
  render() {
    return (
      <GestureRecognizer onSwipeLeft={(state) => this._pressHandler(this.state.articleData.linkToArticle, this.state.articleData.title)} style={[globalStyles.safeviewStyle, this.state.themeStyle.mainView]}>

        <View style={[globalStyles.safeviewStyle, this.state.themeStyle.mainView]}>
          {this.openModal()}
          <View style={[styles.searchScreenItemLeftView]}>
            {/* <ScrollView style={{ flex: 1 }} bounces={false} contentContainerStyle={{ flex: 1 }}> */}

              <TouchableWithoutFeedback onPress={() => this._onPressButton()}>
                <View style={[styles.rescentSeachTextView, this.state.themeStyle.mainRenderView]}>
                  <View style={[styles.newsDetailTopImage]}>
                    {/* {this.renderTopImage(this.state.articleData)} */}
                    {this.state.articleData && this.state.articleData.image && (this.props.marketStatus) ? <CacheableImage style={[styles.newsDetailTopImageView,]} source={{ uri: this.state.articleData.article ? encodeURI(this.state.articleData.article.image) : encodeURI(this.state.articleData.image) }} permanent={true} /> : <CacheableImageDark style={[styles.newsDetailTopImageView,]} source={{ uri: this.state.articleData.article ? encodeURI(this.state.articleData.article.image) : encodeURI(this.state.articleData.image) }} permanent={true} />}

                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.newsArticleDetailTitle, this.state.themeStyle.generalNewsArticleTitle]}>{this.state.articleData.article ? this.state.articleData.article.title : this.state.articleData.title}</Text>
                    {(this.state.articleData.summary != null) ?
                      <Text style={[styles.summaryText, { lineHeight: (globals.iPhoneX) ? WINDOW.height * 0.028 : WINDOW.height * 0.0315 }, this.state.themeStyle.generalNewsDetailSummary]}>{this.state.articleData.summary} </Text>
                      : null}

                    {this.setTextData()}
                  </View>
                </View>
              </TouchableWithoutFeedback>


            {/* </ScrollView> */}

            <Animated.View style={[styles.newsDetailHeader, { transform: [{ translateY: this.tabbarTop }] }]}>
              <View style={styles.customStatusBar} />
              <HeaderBackButton onPress={() => this.props.navigation.goBack()} title='' tintColor='white' />
            </Animated.View>


             <TouchableOpacity onPress={() => this._pressHandler(this.state.articleData.linkToArticle, this.state.articleData.title)}>
              <View style={{ height: (Platform.OS == 'android') ? 60 : (globals.iPhoneX) ? 65 : 50, backgroundColor: 'rgba(24,24,24,1)', }}>
                {(this.state.articleData != null) ? <Image style={{
                  opacity: 0.1,
                  height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 78 : 50,
                  width: globals.screenWidth,
                }} source={{ uri: this.state.articleData.article ? encodeURI(this.state.articleData.article.image) : encodeURI(this.state.articleData.image) }} permanent={true}
                  blurRadius={1}
                /> :
                  <Image style={{
                    opacity: 0.1,
                    height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 78 : 50,
                    width: globals.screenWidth,
                  }} source={stock.news_placeholder} permanent={true}
                    blurRadius={1}
                  />
                }
                <View style={{ position: 'absolute', padding: 5, flex: 1, }}>

                  <Text numberOfLines={1} style={[styles.bannerTitle, { marginTop: 2 }]}>{this.state.articleData.article ? this.state.articleData.article.title : this.state.articleData.title}</Text>
                  <Text style={[styles.bannerTitle]}>{'Tap to know more'}</Text>

                </View>
              </View>
            </TouchableOpacity> 
            <Animated.View style={[{ position: 'absolute', display:"flex" ,bottom: this.tabbarTop, width: globals.WINDOW.width, backgroundColor: colors.newsDetailShareBGLight }]}>            
              <TouchableOpacity onPress={() => _this.shareMsg()}>
                <View style={[styles.newsDetailShare, this.state.themeStyle.newsDetailShare]}>
                  <Image source={stock.share_icon} style={[styles.footerIconView]} />
                  <Text style={styles.bottomButtonText}>{"Share"}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

          </View>
        </View>
      </GestureRecognizer>
    
    )
  }
}

// ********************** Model mapping method **********************
const mapStateToProps = (state, ownProps) => {
  return {
    theme: state.changeTheme_red.theme,
  }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
  getShowAndroidModal
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(stockNewsArticleDetail);