import React, { Component, Fragment } from 'react';
import { Text, SafeAreaView, Image, TouchableOpacity, View, Animated, PanResponder, FlatList, Modal, TouchableWithoutFeedback, Platform, AsyncStorage, StatusBar, Dimensions, ActivityIndicator } from 'react-native';
import globalStyles from '../../../assets/styles/globalStyles';
import * as globals from '../../../lib/globals';
import { WINDOW } from '../../../lib/globals';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getshowModal } from '../../../redux/actions/showModal';
import { getshowLoader } from "../../../redux/actions/showLoaderModal";
import LottieView from 'lottie-react-native';
import Button from '../../../components/Button';
import Emojicon from '../InitialStock/react-native-emojicon';
import Ionicons from 'react-native-vector-icons/Ionicons';
import YouTube, { YouTubeStandaloneAndroid } from 'react-native-youtube';
import { Thumbnail } from '../Stocks/react-native-thumbnail-video/src'
import ClaneLoader from '../../../components/ClaneLoader/index'
import { dashboard, stock } from '../../../assets/images/map'
import { changeTheme } from '../../../redux/actions/changeTheme';
import { changeTabColor } from '../../../redux/actions/changeTabColorModel';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import DeviceInfo from 'react-native-device-info';
import * as colors from '../../../assets/styles/color';
import GestureRecognizer from 'react-native-swipe-gestures';
import Share from 'react-native-share';
import moment from 'moment';
import imageCacheHoc from 'react-native-image-cache-hoc';
import { HeaderBackButton } from 'react-navigation';
import SafariView from 'react-native-safari-view';
import styles from './style';
import NewsAndroidWebview from '../Stocks/newsAndroidWebview'
import NewsArticleWebView from './NewsArticleWebView'
import ClaneBlueLoader from './claneBlueLoader'
import GalleryImage from './galleryImage';
import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import { getShowAndroidModal } from '../../../redux/actions/showAndroidWebViewModal';
import Countly from 'countly-sdk-react-native';

import dashboardNewsArticleData from './dashboardArticleDetailData';
import firebase from 'react-native-firebase';
import branch, { BranchEvent } from 'react-native-branch';
const SCREEN_HEIGHT = Dimensions.get("window").height
const SCREEN_WIDTH = Dimensions.get("window").width
import { API } from '../../../lib/api';

var TAG = "DashboardNewsArticleDetail"
var _this = null;
var shareOptionObj = {
  title: "Clane",
  subject: "Clane"
}

let maxInitialAdded = 3;

let likeData = [];
let bookmarkData = [];
let ARTICLES= [];

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
let startTime;

class DashboardNewsArticleDetail extends Component {

  static navigationOptions = ({ navigation, screenProps, }) => {
    const { state } = navigation;
    return {
      header: null,
      HtmlCode: '',
      headerImageHeight: 0,
      renderHoldText: false
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
      isBookmarked: false,
      isLiked: false,
      totalLikes: 32,
      dashboardNewsDetailData: [],
      // dashboardNewsDetailData: this.props.navigation.state.params.dashboardNewsDetailData,
      currentIndex: 0,
      isReverse: false,
      bottomVisible: false,
      isGalleryVisible: false,
      loading: false,
      isServerError: false,
      isCached: true,
      isNetwork: true,
      topNewsTempData: this.props.navigation.state.params.dashboardNewsDetailData,
      isTextShow: false,
      fadeAnim: new Animated.Value(0),

    }
    this.tabbarTop = (globals.iPhoneX) ? new Animated.Value(-88) : new Animated.Value(-64)
    this.shareBottom = new Animated.Value(-64)
    _this = this
    console.log("starting data :----->  " + JSON.stringify(this.state.dashboardNewsDetailData))
  }

  startAnimation() {
    Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
    }).start();
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0 && (this.state.currentIndex > 0)) {
          console.log("onPanResponderMove IF")
          this.swipedCardPosition.setValue({
            x: 0, y: -SCREEN_HEIGHT + gestureState.dy
          })
        }
        else if (this.state.currentIndex == 0) {
          // this.setState({ isReverse: false })
          if (gestureState.dy > 0) {
            this.setState({ isReverse: false })
          }
          else {
            this.position.setValue({ y: gestureState.dy })
          }
        }

        else {
          console.log("onPanResponderMove else")
          this.position.setValue({ y: gestureState.dy })
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        this.setState({
          isHeaderDisplay: false,
          bottomVisible: false
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
        console.log("Gesture state dy : :: " + gestureState.dy)
        console.log("Gesture state dx : :: " + gestureState.dx)
        console.log("Gesture state vy : :: " + gestureState.vy)
        console.log("Gesture state vx : :: " + gestureState.vx)
        console.log("CuurentIndex : :: " + this.state.currentIndex + " this.state.dashboardNewsDetailData" +this.state.dashboardNewsDetailData.length)


        if (this.state.currentIndex > 0 && gestureState.dy > 50 && gestureState.vy < 10) {
          console.log("onPanResponderRelease IF first")

          let timeDiff = globals.getTimeDifferenceSecond(startTime);
          if (timeDiff > 10) {
            firebase.analytics().logEvent(globals.event_ArticleRead,
            globals.getAnalyticBasicDataCategoryType(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global, timeDiff,ARTICLES[this.state.currentIndex].title ));
           }

           startTime = new Date().getTime();

          Animated.timing(this.swipedCardPosition, {
            toValue: ({ x: 0, y: 0 }),
            duration: 400
          }).start(() => {

            this.setState({ currentIndex: this.state.currentIndex - 1 })
            this.swipedCardPosition.setValue({ x: 0, y: -SCREEN_HEIGHT })
            if (this.state.currentIndex == 0) {
              this.setState({ isReverse: true, })
            }
          })
        }
        else if (-gestureState.dy > 1 && -gestureState.vy > 0.1) {
          console.log("onPanResponderRelease else IF first")
          let timeDiff = globals.getTimeDifferenceSecond(startTime);
          console.log("onPanResponderRelease TITLE "+ ARTICLES[this.state.currentIndex].title);
          
          if (timeDiff > 10) {
              firebase.analytics().logEvent(globals.event_ArticleRead,
              globals.getAnalyticBasicDataCategoryType(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global, timeDiff,ARTICLES[this.state.currentIndex].title ));
          }
          startTime = new Date().getTime();

          Animated.timing(this.position, {
            toValue: ({ x: 0, y: -SCREEN_HEIGHT }),
            duration: 400
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 })
            console.log("currentIndex ERLEASE" + this.state.currentIndex);

            this.position.setValue({ x: 0, y: 0 })
          })
        }
        else if (gestureState.dx == 0 && gestureState.dy == 0 && gestureState.vx == 0 && gestureState.vy == 0) {
          this._onPressButton();
        }
        else {
          console.log("onPanResponderRelease else first")


          Animated.parallel([
            Animated.spring(this.position, {
              toValue: ({ x: 0, y: 0 })
            }),
            Animated.spring(this.swipedCardPosition, {
              toValue: ({ x: 0, y: -SCREEN_HEIGHT })
            })

          ]).start()


          if (this.state.currentIndex == 0) {
            this.setState({ isReverse: true })
          }
        }
        if (Platform.OS == 'ios') {
          if (gestureState.dx < -25 && gestureState.dx > -350) {
            if (gestureState.dy > -50 && gestureState.dy < 50) {
              this._pressHandler(this.state.dashboardNewsDetailData[this.state.currentIndex].url, this.state.dashboardNewsDetailData.title)
            }
          }
          else if (gestureState.dx > 100 && gestureState.dx < 500) {
            this.props.navigation.goBack();
          }
        }
        else {
          if (gestureState.dx < -25 && gestureState.dx > -500) {
            if (gestureState.dy > -40 && gestureState.dy < 50) {
              this._pressHandler(this.state.dashboardNewsDetailData[this.state.currentIndex].url, this.state.dashboardNewsDetailData.title)
            }
          }
          else if (gestureState.dx > 100 && gestureState.dx < 500) {
            this.props.navigation.goBack();
          }
        }
      }
    })
  }

  responseUserArticle = {
    success: (response) => {
      console.log("USER WISE AAA " + JSON.stringify(response));
      let tempdata=[];
      this.setState({ dashboardNewsDetailData: [...this.state.topNewsTempData, ...response.data], loading: false },()=>{
      // this.setState({ dashboardNewsDetailData: response.data, loading: false })
      for (let index = 0; index < this.state.dashboardNewsDetailData.length; index++) {
        tempdata = this.getUnique(this.state.dashboardNewsDetailData, 'id')
        
      }
      this.setState({dashboardNewsDetailData: tempdata},()=>{
        console.log("FINAL RESPONSE " + JSON.stringify(this.state.dashboardNewsDetailData));
        // this.forceUpdate()
        AsyncStorage.setItem(globals.article_user_timeStamp, new Date());
        AsyncStorage.setItem(globals.user_article_async, JSON.stringify(this.state.dashboardNewsDetailData));
      })
      this.startAnimation();
      // for (let index = 0; index < this.state.dashboardNewsDetailData.length; index++) {
      //   tempdata = this.getUnique(this.state.dashboardNewsDetailData, 'id')

      // }

    })},
    error: (err) => {
      AsyncStorage.getItem(globals.user_article_async, (err, result) => {
        if (result !== null) {
          this.setState({ isCached: true })
          var responseData = JSON.parse(result);
          // this.setState({ categoryData: responseData.data })
          this.setState({ dashboardNewsDetailData: responseData, loading: false }, () => console.log("user wise dashboard aricle : " + this.state.dashboardNewsDetailData))
          this.startAnimation();
        } else {
          this.setState({ loading: false, isServerError: true });
        }
      });
    },
    complete: () => {
    }
  }

  removeDuplicatesFromArray(arr) {

    var obj = {};
    var uniqueArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (!obj.hasOwnProperty(arr[i])) {
        obj[arr[i]] = arr[i];
        uniqueArr.push(arr[i]);
      }
    }

    return uniqueArr;

  }

  responseArticle = {
    success: (response) => {
      //var updatedData = [...response.data]
      // this.setState({ dashboardNewsDetailData: response.data, loading: false },()=>{
      let tempdata=[];
      let margeData = [...this.state.topNewsTempData, ...response.data]
      let responseData = response.data;
      // this.setState({ dashboardNewsDetailData: [...this.state.dashboardNewsDetailData, ...response.data], loading: false },()=>{
        this.setState({ loading: false },()=>{
        console.log("updated detail data : " + JSON.stringify(this.state.dashboardNewsDetailData))
        // let jOb = response;
        for (let index = 0; index < margeData.length; index++) {
          margeData[index].isLiked = false;
          margeData[index].isBookmarked = false;
        }
        for (let index = 0; index < margeData.length; index++) {
          tempdata = this.getUnique(margeData, 'id')
          
        }
        this.setState({ dashboardNewsDetailData: tempdata }, () => {
          console.log("FINAL RESPONSE " + JSON.stringify(this.state.dashboardNewsDetailData));
          // this.forceUpdate()
          AsyncStorage.setItem(globals.general_article_timeStamp, new Date());
          AsyncStorage.setItem(globals.general_article_async, JSON.stringify(this.state.dashboardNewsDetailData));
        })
        this.startAnimation();
      })


    },
    error: (err) => {

      AsyncStorage.getItem(globals.general_article_async, (err, result) => {
        if (result !== null) {
          this.setState({ isCached: true })
          var responseData = JSON.parse(result);
          this.setState({ dashboardNewsDetailData: responseData, loading: false })
          // this.setState({ categoryData: responseData.data })
          this.startAnimation();
        } else { this.setState({ loading: false, isServerError: true }); }
      });
    },
    complete: () => {
    }
  }

  static callUserAllArtilceAPI() {
    console.log("Article Selected Item ==> " + JSON.stringify(selectedItemForAction));
    if (selectedItemType == 'like') {

      API.newsArticlesAction(this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, selectedItemForAction.id, 'like', true);

      if (selectedItemForAction.isLiked) {
        console.log("selectedItemForAction ==> true");

        firebase.analytics().logEvent(globals.event_Unlike,
          Object.assign({}, { EventDetails: "Unlike" }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

        var event = { "key": globals.event_Unlike, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        _this.state.dashboardNewsDetailData.find(v => v.id == selectedItemForAction.id).isLiked = false;
        let like = selectedItemForAction.like - 1;
        if (like != 0) {
          _this.state.dashboardNewsDetailData.find(v => v.id == selectedItemForAction.id).like = like--;
        } else {
          _this.state.dashboardNewsDetailData.find(v => v.id == selectedItemForAction.id).like = '';
        }
      } else {
        console.log("selectedItemForAction ==> false" + selectedItemForAction.isLiked);

        firebase.analytics().logEvent(globals.event_Like,
          Object.assign({}, { EventDetails: "Like" }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

        var event = { "key": globals.event_Like, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        let like = 0
        if (selectedItemForAction.like != null) {
          like = selectedItemForAction.like + 1
        } else {
          like++;
        }
        _this.state.dashboardNewsDetailData.find(v => v.id == selectedItemForAction.id).isLiked = true;
        _this.state.dashboardNewsDetailData.find(v => v.id == selectedItemForAction.id).like = like;
      }
      AsyncStorage.setItem(globals.user_article_async, JSON.stringify(_this.state.dashboardNewsDetailData), () => {
        _this.forceUpdate()
      });
      console.log("this.state.dashboardNewsDetailData===> " + JSON.stringify(_this.state.dashboardNewsDetailData));



    }
    else if (selectedItemType == 'bookmark') {
      API.newsArticlesAction(this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, selectedItemForAction.id, 'bookmark', true);
      if (selectedItemForAction.isBookmarked) {

        firebase.analytics().logEvent(globals.event_Bookmark,
          Object.assign({}, { EventDetails: "Bookmark" }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

        var event = { "key": globals.event_Bookmark, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        console.log("electedItemForAction ===> true");

        _this.state.dashboardNewsDetailData.find(v => v.id == selectedItemForAction.id).isBookmarked = false;
      } else {
        console.log("electedItemForAction ===> false" + selectedItemForAction.isBookmarked);

        firebase.analytics().logEvent(globals.event_Bookmarked,
          Object.assign({}, { EventDetails: "Bookmark" }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
        var event = { "key": globals.event_Bookmarked, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);

        _this.state.dashboardNewsDetailData.find(v => v.id == selectedItemForAction.id).isBookmarked = true;
      }
      // AsyncStorage.setItem(globals.article_user_timeStamp, new Date());
      console.log("this.state.dashboardNewsDetailData Bookmark ===> " + JSON.stringify(_this.state.dashboardNewsDetailData));

      AsyncStorage.setItem(globals.user_article_async, JSON.stringify(_this.state.dashboardNewsDetailData));
      // console.log("AFTER LIKE ARRAY "+ JSON.stringify(this.state.dashboardNewsDetailData));
    }
    // if (globals.isInternetConnected) {
    //   this.setState({ loading: true })
    //   API.newsUserAllArticles(this.responseUserArticle, globals.globalVars.userIdTemp_Global, true);

    // }
  }

  getTimeIntervalForGeneralArtilce() {
    console.log("isCached " + this.state.isCached);

    AsyncStorage.getItem(globals.general_article_timeStamp, (err, result) => {
      if (result !== null) {
        var diffMins = globals.getTimeDifference(result);
        if (diffMins >= 1 && globals.isInternetConnected) {
          this.setState({ loading: true }, () => {
            if (this.animation != undefined) {
              this.animation.play();
            }

          })
          // API.getAllCategories(this.responseDataCategories, false);
          API.newsAllArticles(this.responseArticle, true);
        } else {
          AsyncStorage.getItem(globals.general_article_async, (err, result) => {
            if (result !== null) {
              this.setState({ loading: true, isCached: true },()=>{
                if (this.animation != undefined) {
                  this.animation.play();
                }
              })
              setTimeout(() => {
                var responseData = JSON.parse(result);
              let tempdata = [];
              this.startAnimation();
              this.setState({ dashboardNewsDetailData: [...this.state.topNewsTempData, ...responseData], loading: false },()=>{
                for (let index = 0; index < this.state.dashboardNewsDetailData.length; index++) {
                  tempdata = this.getUnique(this.state.dashboardNewsDetailData, 'id')
                }
                this.setState({ dashboardNewsDetailData: tempdata }, () => {
                  console.log("dashboard detail data : " + JSON.stringify(this.state.dashboardNewsDetailData))
                })
              })
              }, 1000);
              // this.setState({ categoryData: responseData.data })
            } 
            else {
               this.setState({ loading: false })
               }
          });
        }
      } else {
        if (globals.isInternetConnected) {
          // API.getAllCategories(this.responseDataCategories, false);
          this.setState({ loading: true, isNetwork: true }, () => {
            if (this.animation != undefined) {
              this.animation.play();
            }
          })
          API.newsAllArticles(this.responseArticle, true);
        } else {
          this.setState({ isCached: false, loading: false,isNetwork: false })
        }
      }
    });
  }
  getTimeIntervalForUserArtilce() {
    AsyncStorage.getItem(globals.article_user_timeStamp, (err, result) => {
      if (result !== null) {
        var diffMins = globals.getTimeDifference(result);
        if (diffMins >= 1 && globals.isInternetConnected) {
          this.setState({ loading: true }, () => {
            if (this.animation != undefined) {
              this.animation.play();
            }
          })
          // API.newsUserAllArticles(this.responseUserArticle, globals.globalVars.userIdTemp_Global, true);
          API.getNewRefreshedToken(_this.refreshTokenResponseData);
        } else {
          AsyncStorage.getItem(globals.user_article_async, (err, result) => {
            if (result !== null) {
              console.log("DSDS");
              
              this.setState({ loader:true, isCached: true },()=>{
                if (this.animation != undefined) {
                  this.animation.play();
                  
                }
              })
              
              // setTimeout(() => {
                let responseData = JSON.parse(result);
                let tempdata = [];
              this.setState({ dashboardNewsDetailData: [...this.state.topNewsTempData, ...responseData], }, () => {
                for (let index = 0; index < this.state.dashboardNewsDetailData.length; index++) {
                  tempdata = this.getUnique(this.state.dashboardNewsDetailData, 'id')
                }
                setTimeout(() => {
                  this.startAnimation();
                  this.setState({ dashboardNewsDetailData: tempdata }, () => {
                    console.log("dashboard detail data async: " + JSON.stringify(this.state.dashboardNewsDetailData))
                  })
                }, 1000);
               
              })
             
              // }, 1000);
            }
            else {
              this.setState({ loading: false })
              }
          });
        }
      } else {
        if (globals.isInternetConnected) {
          this.setState({ loading: true, isNetwork: true, isCached: false }, () => {
            if (this.animation != undefined) {
              this.animation.play();
            }
          })
          // API.newsUserAllArticles(this.responseUserArticle, globals.globalVars.userIdTemp_Global, true);
          API.getNewRefreshedToken(_this.refreshTokenResponseData);
        } else {
          this.setState({ isCached: false, isNetwork: false })
        }
      }
    });
  }

  componentDidUpdate() {
    if (this.state.loading) {
      if (this.animation != undefined) {
        this.animation.play();
      }

    }

  }
  toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
  }
  componentDidMount() {
    startTime = new Date().getTime();
    StatusBar.setHidden(false, 'slide');
    // this.setState({ dashboardNewsDetailData: dashboardNewsArticleData.RESPONSE.data, loading: false })
    setTimeout(() => {
      this.setState({isTextShow: true})
    }, 2000);
    if (globals.globalVars.userIdTemp_Global != null) {
      if (globals.isLoggedIn === "true") {
        if (globals.Authsecret != '') {
          this.getTimeIntervalForUserArtilce()
        }
        else {
          if (globals.isInternetConnected) {
            this.checkLogin()
            globals.globalVars.dashboardTitle = globals.screenTitle_NewsSummary
          }
          else {
            this.setState({ isNetwork: false })
            this.getTimeIntervalForUserArtilce()
          }
        }
      }else{
        this.getTimeIntervalForGeneralArtilce()
      }
     
    } else {
      this.getTimeIntervalForGeneralArtilce()
    }

    if (Platform.OS == 'ios') {
      let showSubscription = SafariView.addEventListener(
        "onShow",
        () => {
           
            startTime = new Date().getTime();
            console.log("SAFARI OPEN --> " + startTime); 
        }
      );
      let dismissSubscription = SafariView.addEventListener(
        "onDismiss",
        () => {
          let timeDiff = globals.getTimeDifferenceSecond(startTime);
          console.log("SAFARI CLOSE--->" +timeDiff);
          if (timeDiff > 10) {
            firebase.analytics().logEvent(globals.event_ArticleRead,
            globals.getAnalyticBasicDataCategoryType(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global, timeDiff,ARTICLES[this.state.currentIndex].title ));
          }
        }
     );
    }

  }

  componentWillReceiveProps(nextProps) {
    this.setState({ themeStyle: nextProps.theme })
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

        API.newsUserAllArticles(this.responseUserArticle, globals.globalVars.userIdTemp_Global, true);
      } catch (error) {
        console.log('refreshTokenResponseData catch error ' + JSON.stringify(error));
        this.setState({loading : false})
      }
    },
    error: (err) => {
      this.setState({loading : false})
      console.log('refreshTokenResponseData error ' + JSON.stringify(err));
    },
    complete: () => {
    }
  }

  _pressHandler(url = "https://www.google.com", title) {
    if (Platform.OS === 'android') {
      // console.log("Load URL " + image);

      this.setState({ modalVisibleWebView: true })
      StatusBar.setHidden(false, "slide")
      this.props.getShowAndroidModal(true, globals.screenTitle_dashboardNewsArticleDetail, url, title, "")
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

  openModal(id) {
    if (id == '1') { }
    else if (id == '2') {
      return (
        <Modal animationType='slide' visible={this.state.modalVisibleWebView} onRequestClose={() => { DashboardNewsArticleDetail.handleCloseModalWebview() }}>
          <NewsArticleWebView setParentState={newState => this.setState(newState)} imagePath={this.state.dashboardNewsDetailData[this.state.currentIndex].media[0] && this.state.dashboardNewsDetailData[this.state.currentIndex].media[0].url} />
          {/* themeStyle={this.state.themeStyle} */}
        </Modal>
      )
    }
    else { }
  }

  callGalleryView(item) {
    if (Platform.OS == 'android') {
      StatusBar.setHidden(false, 'slide')
    }

    this.setState({ isGalleryVisible: true }, () => {
      this.openGalleryModal(item)
    })
  }

  openGalleryModal(item) {
    let gallery = JSON.stringify(item)
    this.props.getShowModalSelectBankAccount(true, globals.screenTitle_dashboardNewsArticleDetail, "", "", item)
    return (
      <Modal animationType='slide' visible={this.state.isGalleryVisible} onRequestClose={() => { DashboardNewsArticleDetail.handleCloseModalWebview() }}>
        <GalleryImage setParentState={newState => this.setState(newState)} />
      </Modal>
    )
  }

  static hideStatusBar() {
    StatusBar.setHidden(false, 'slide')
  }
  /**
  * Method for handle close modal webview
  */
  static handleCloseModalWebview() {
    _this.props.getShowModalSelectBankAccount(false)
    // StatusBar.setHidden(true, "slide")
    _this.setState({
      modalVisibleWebView: false,
      isGalleryVisible: false,
      loading: false
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
      console.log("shareMsg : " + item.media.length)

      if (item.media.length > 0) {
        let branchUniversalObject = await branch.createBranchUniversalObject('news', {
          locallyIndex: true,
          title: item.title,
          contentDescription: item.summary,
          contentImageUrl: (item.media[0].url != undefined) ? item.media[0].url : '',
          // custom_data:'news'
          // contentMetadata: {
          //   "target": "news",

          // }
        })

        let shareOptions = { messageHeader: '', messageBody: item.title + "\n\n" + "- via Clane App:" + "\n" }
        let linkProperties = { feature: 'share', channel: 'ClaneApp' }
        let controlParams = { $desktop_url: customlink, $ios_url: customlink, $android_url: customlink }
        // let via = {messageBody :' -via Clane'}
        let finalString = JSON.stringify(shareOptions) + JSON.stringify(linkProperties) + JSON.stringify(controlParams);
        console.log("finalString " + finalString);

        let { channel, completed, error } = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
      }
      else {
        let branchUniversalObject = await branch.createBranchUniversalObject('news', {
          locallyIndex: true,
          title: item.title,
          contentDescription: item.summary,
          // custom_data:'news'
          // contentMetadata: {
          //   "target": "news",

          // }
        })

        let shareOptions = { messageHeader: '', messageBody: item.title + "\n\n" + "- via Clane App:" + "\n" }
        let linkProperties = { feature: 'share', channel: 'ClaneApp' }
        let controlParams = { $desktop_url: customlink, $ios_url: customlink, $android_url: customlink }
        // let via = {messageBody :' -via Clane'}
        let finalString = JSON.stringify(shareOptions) + JSON.stringify(linkProperties) + JSON.stringify(controlParams);
        console.log("finalString " + finalString);

        let { channel, completed, error } = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
      }


    }
    firebase.analytics().logEvent(globals.event_Sharedanewsarticle,
      Object.assign({}, { EventDetails: item ? item.title : item.title }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

  }

  btnBookmarkPressed(item) {
    selectedItemType = 'bookmark'
    selectedItemForAction = item;
    if (globals.isLoggedIn == 'false') {
      this.checkLogin();
      globals.globalVars.dashboardTitle = globals.screenTitle_NewsSummary
    }
    else {
      if (globals.isInternetConnected) {
        API.newsArticlesAction(this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, item.id, 'bookmark', true);
      } else {
        bookmarkData.push({ id: item.id, action: 'bookmark', userId: globals.globalVars.userId_Global });
        AsyncStorage.setItem(globals.local_bookmark_async, JSON.stringify(bookmarkData));
      }
      if (item.isBookmarked) {
        firebase.analytics().logEvent(globals.event_Bookmark,
          Object.assign({}, { EventDetails: "Bookmark" }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
        var event = { "key": globals.event_Bookmark, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);

        this.state.dashboardNewsDetailData.find(v => v.id == item.id).isBookmarked = false;
      } else {

        firebase.analytics().logEvent(globals.event_Bookmarked,
          Object.assign({}, { EventDetails: "Bookmarked" }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

        var event = { "key": globals.event_Bookmarked, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);

        this.state.dashboardNewsDetailData.find(v => v.id == item.id).isBookmarked = true;
      }
      // AsyncStorage.setItem(globals.article_user_timeStamp, new Date());
      AsyncStorage.setItem(globals.user_article_async, JSON.stringify(this.state.dashboardNewsDetailData));
      // console.log("AFTER LIKE ARRAY "+ JSON.stringify(this.state.dashboardNewsDetailData));

      this.forceUpdate()
    }
  }

  /**
  * Method for check user already login or not
  */
  checkLogin() {
    this.props.navigation.navigate("ModalNavigator")
    this.setState({ loading: false })
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

  containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }
    return false;
  }

  userExists(username) {
    return globals.globalVars.offlineArticleData.some(function (el) {
      return el.id === username;
    });
  }

  btnLikePressed(item) {
    console.log("LIKE ITEM " + JSON.stringify(item));
    selectedItemType = 'like';
    selectedItemForAction = item;
    if (globals.isLoggedIn == 'false') {
      this.checkLogin();
      globals.globalVars.dashboardTitle = globals.screenTitle_NewsSummary
    }
    else {
      if (globals.isInternetConnected) {
        API.newsArticlesAction(this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, item.id, 'like', true);
      }
      else {
        likeData.push({ id: item.id, action: 'like', userId: globals.globalVars.userId_Global });
        AsyncStorage.setItem(globals.local_like_async, JSON.stringify(likeData));
      }

      if (item.isLiked) {
        firebase.analytics().logEvent(globals.event_Bookmarked,
          Object.assign({}, { EventDetails: "Bookmarked" }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

        var event = { "key": globals.event_Unlike, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        this.state.dashboardNewsDetailData.find(v => v.id == item.id).isLiked = false;
        let like = item.like - 1;
        if (like != 0) {
          this.state.dashboardNewsDetailData.find(v => v.id == item.id).like = like--;
        } else {
          this.state.dashboardNewsDetailData.find(v => v.id == item.id).like = '';
        }
      } else {
        firebase.analytics().logEvent(globals.event_Like,
          Object.assign({}, { EventDetails: "Like" }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

        var event = { "key": globals.event_Like, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        let like = 0
        if (item.like != null) {
          like = item.like + 1
        } else {
          like++;
        }
        this.state.dashboardNewsDetailData.find(v => v.id == item.id).isLiked = true;
        this.state.dashboardNewsDetailData.find(v => v.id == item.id).like = like;
      }
      AsyncStorage.setItem(globals.user_article_async, JSON.stringify(this.state.dashboardNewsDetailData));

      this.forceUpdate()
    }
  }

  setTextData() {
    var data = globals.checkTimeStamp(this.state.dashboardNewsDetailData.published_date);

    if (data == '1') {
      return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>
        {"Swipe left to read more at "}
        {this.state.dashboardNewsDetailData ? this.state.dashboardNewsDetailData.source : this.state.dashboardNewsDetailData.source} - {"Today"} </Text>)

    }
    else if (data == '0') {
      return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>
        {"Swipe left to read more at "}
        {this.state.dashboardNewsDetailData ? this.state.dashboardNewsDetailData.source : this.state.dashboardNewsDetailData.source} - {'Yesterday'} </Text>)

    }
    else if (data == '2') {
      return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>
        {"Swipe left to read more at "}
        {this.state.dashboardNewsDetailData ? this.state.dashboardNewsDetailData.source : this.state.dashboardNewsDetailData.source} - {moment(this.state.dashboardNewsDetailData ? this.state.dashboardNewsDetailData.published_date : this.state.dashboardNewsDetailData.published_date).format('MM/DD/YY')} </Text>)

    }
  }

  goToCategoryNewsArticleDetailScreen(item) {
    firebase.analytics().logEvent(globals.event_tagsCategories,
      Object.assign({}, { EventDetails: item.name }, globals.getAnalyticBasicDataCategoryType(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global, item.name)));

    var event = { "key": globals.event_tagsCategories, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
    Countly.recordEvent(event);
    console.log("=====segmentation record event category wise detail for tags, result=> ");

    this.props.navigation.navigate('CategoryNewsArticle', { tagValue: item.name, title: item.name, categoryNewsDetail: this.state.dashboardNewsDetailData, theme: this.props.theme, isFrom: 'tags' })
  }

  

  renderTags(item) {
    return (
      <TouchableWithoutFeedback onPress={() => this.goToCategoryNewsArticleDetailScreen(item)}>
        <View style={[styles.tagBG, { flexDirection: 'row', backgroundColor: colors.tagColor }]}>
          <Text style={[styles.tagTextView, { color: colors.white }]}>
            <Text>{'# ' + item.name}
            </Text>
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  onSwipeDown(gestureState) {
    this.setState({ currentIndex: this.state.dashboardNewsDetailData.length - 1 }, () => { (Platform.OS == 'ios') ? this.renderArticleDetails() : this.renderArticleDetails() })
  }

  setTextData(item) {
    var data = globals.convertTimestamp(item.published_date);

    if (data == '1') {
      return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate, }]}>
        {"Swipe left to read more at "}
        {item.news_source.name} - {"Today"} </Text>)
    }
    else if (data == '0') {
      return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate, }]}>
        {"Swipe left to read more at "}
        {item.news_source.name} - {'Yesterday'} </Text>)

    }
    else if (data == '2') {
      return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate, }]}>
        {"Swipe left to read more at "}
        {item.news_source.name} - {moment(item.published_date).format('MM/DD/YY')} </Text>)
    }
  }

  youtubeChangeState(e, item) {
    this.setState({ status: e.state })
    // if (e.state == 'playing') {

    //     var event = { "key": globals.event_Watchedastockvideo, "count": 1 };
    //     event.segmentation = Object.assign({}, { EventDetails: item.title }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
    //     Countly.recordEvent(event);
    //     console.log("=====segmentation record event globals.event_Watchedastockvideo, result=> ");

    //     firebase.analytics().logEvent(globals.event_Watchedastockvideo,Object.assign({}, { EventDetails: item.title }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
    // }
  }

  renderBannerLogo(item) {
    if (!this.state.isHeaderDisplay) {
      if (item.additional_data && item.additional_data.banner.url != null && item.additional_data.banner.url != '') {
        return (
          <View style={{ position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.2)', marginLeft: 10, paddingLeft: 10, paddingRight: 10, marginTop: (globals.iPhoneX) ? 60 : 40 }}>
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

  renderImageOrVideo(item) {
    let {fadeAnim} = this.state;
    if (item.media.length > 0) {
      if (item.media[0].media_type.type == 'image') {
        if (item.media[0].url != '' && item.media[0].url != null && item.media[0].url != undefined) {
          return (
            <Animated.Image style={[styles.newsDetailTopImageView, { opacity: fadeAnim,  }]}
            source={{ uri: encodeURI(item.media[0].url) }}
            >
            {/* <Image style={[styles.newsDetailTopImageView,]} source={{ uri: encodeURI(item.media[0].url) }} permanent={true} /> */}
          </Animated.Image>
          )
        } else {
          return (<Image style={[styles.newsDetailTopImageView,]} source={stock.news_placeholder} permanent={true} />)
        }
      } else if (item.media[0].media_type.type == 'video') {
        var youtubeID = item.media[0].url && item.media[0].url.split("=")[1]
        if (Platform.OS == 'ios') {
          return (
            <YouTube
              videoId={youtubeID}   // The YouTube video ID
              play={false}             // control playback of video with true/false
              fullscreen={true}       // control whether the video should play in fullscreen or inline
              modestbranding={false}
              showinfo={false}
              playsInline={true}
              controls={1}
              color={"White"}
              origin={"https://www.youtube.com"}
              onReady={e => this.setState({ isReady: true })}
              // onChangeState={e => this.youtubeChangeState(e, item)}
              onChangeQuality={e => this.setState({ quality: e.quality })}
              onError={e => console.log("Video Error-->", JSON.stringify(e))}
              style={{ alignSelf: 'stretch', width: '100%', height: Math.round(globals.WINDOW.height / 2.3) }}
            />
          )

        } else {
          return (<Thumbnail url={item.media[0].url} imageHeight={Math.round(globals.WINDOW.height / 2.3)} isFrom={'article'} />)
        }
      }
    } else {
      return (<Image style={[styles.newsDetailTopImageView,]} source={stock.news_placeholder} permanent={true} />)
    }
  }

  getUnique(arr, comp) {

    const unique = arr
      .map(e => e[comp])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e]);

    return unique;
  }
   
  renderNoDataText(isTextShow){
    if (isTextShow) {
      return(
        <Text style={[styles.noMoreArticles, { paddingHorizontal: 5, textAlign: 'center' }]}>{'There are no any articles available for ' + this.state.headerTitle + ' category'}</Text>
      )
    }else {
      return null
    }
   
  }

  goToCategoryArticleDetail(articles,name, id){
    this.props.navigation.navigate('CategoryNewsArticle', { isFrom: 'category', title: name, categoryNewsDetail: articles, theme: this.props.theme, cat_id:id })
  }

  renderCategoryView(articles){
    let categories = articles.categories;
    if(articles && articles.categories && articles.categories.length > 0){
      return(
        // <TouchableWithoutFeedback onPress={() => this.goToCategoryArticleDetail(articles,categories[0].name, categories[0].id)}    
        // >
         <TouchableWithoutFeedback>
          <View style={styles.categoryView} >
            <Text style={styles.categoryText}>{categories[0].name ? categories[0].name != '' && categories[0].name != undefined && categories[0].name != null ? categories[0].name : null : null}</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
  }

  renderArticleDetails = () => {
    ARTICLES = this.state.dashboardNewsDetailData;
   //console.log(TAG, "this.state.currentIndex : " + this.state.currentIndex);
   if (ARTICLES.length == 0) {
     return (
       <Fragment>
         <SafeAreaView style={{ flex: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
         <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', paddingLeft: 15, paddingBottom: 10, paddingTop: 10, flexDirection: 'row' }}>
           <TouchableOpacity style={{ justifyContent: 'flex-start' }} onPress={() => this.props.navigation.goBack(null)}>
             <Ionicons name="ios-arrow-back" size={30} color={colors.white} />
           </TouchableOpacity>
           {/* <View style={{flex:1,justifyContent:'center'}}>
                       <Text style={[styles.headerTitle, {color: colors.blue}]}>{'Top News'}</Text>
                 </View> */}
         </View>
         <View style={{ flex: 1, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', }}>
            {this.renderNoDataText(this.state.isTextShow)}
            
            {/* <Text style={styles.noMoreArticles}>Please swipe right for previous screen </Text> */}
          </View>
       </Fragment>
     )
   }
   else {
     return ARTICLES.map((item, i) => {
       //console.log(TAG, "i : " + i);

       if (i == this.state.currentIndex - 1) {
         //console.log("if" + this.state.currentIndex)
         if (this.state.currentIndex == ARTICLES.length) {
           return (
            <GestureRecognizer
            style={{ flex: 1, }}
            onSwipeDown={(state) => this.onSwipeDown(state)}>
            <Fragment>
              <SafeAreaView style={{ flex: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
              <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', paddingLeft: 15, paddingBottom: 10, paddingTop: 10, flexDirection: 'row' }}>
                <TouchableOpacity style={{ justifyContent: 'flex-start' }} onPress={() => this.props.navigation.goBack(null)}>
                  <Ionicons name="ios-arrow-back" size={30} color={colors.white} />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.headerTitle, { color: colors.white }]}>{'Top News'}</Text>
                </View>
              </View>
              <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.noMoreArticles, { fontSize: 25 }]}>Great! </Text>
                  <Emojicon name={'blush'} size={20} style={{ marginTop: 2 }} />
                </View>
                <Text style={styles.noMoreArticles}>You have caught up with some news.  </Text>
                <Text style={styles.noMoreArticles}>Swipe down to go to previous articles </Text>
              </View>
            </Fragment>
          </GestureRecognizer>
           )
         }
         else {
           return (
             <Animated.View key={item.id} style={this.swipedCardPosition.getLayout()}
               {...this.PanResponder.panHandlers}
             >
              
               <View style={[globalStyles.safeviewStyle, { backgroundColor: colors.white, height: SCREEN_HEIGHT, width: SCREEN_WIDTH, position: 'absolute' }]}>
                 {this.openModal('1')}
                 {/* {this.openGalleryModal()} */}

                 <View style={[styles.searchScreenItemLeftView]}>
                   {/* <ScrollView style={{ flex: 1 }} bounces={false} contentContainerStyle={{ flex: 1 }}> */}

                   {/* <TouchableWithoutFeedback> */}
                   {/* <View> */}
                   <View style={[styles.rescentSeachTextView, { backgroundColor: colors.white }]}>
                     {/* <TouchableWithoutFeedback onLongPress={() => this.callGalleryView(ARTICLES[i])}> */}
                     <View style={[styles.newsDetailTopImage]}>

                       {/* {(ARTICLES[i].media.length > 0) ? <CacheableImage style={[styles.newsDetailTopImageView,]} source={{ uri: encodeURI(ARTICLES[i].media[0].url) }} permanent={true} /> :
                         <Image style={[styles.newsDetailTopImageView,]} source={stock.news_placeholder} permanent={true} />
                       } */}
                       {
                         this.renderImageOrVideo(ARTICLES[i])
                       }

                     </View>
                     {this.renderBannerLogo(ARTICLES[i])}
                     {/* <View style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.2)', paddingLeft:10, paddingRight:10, marginTop: (globals.iPhoneX) ? 60 : 40}}>
                      {(ARTICLES[i].additional_data && ARTICLES[i].additional_data.banner.url != null && ARTICLES[i].additional_data.banner.url !=''  ) ?
                      <Image style={{
                       height: 30,
                       width: 50,
                     }} source={{ uri: encodeURI(ARTICLES[i].additional_data.banner.url) }} permanent={true} resizeMode={'contain'}
                     /> : null}
                    </View>   */}
                     {/* </TouchableWithoutFeedback> */}
                     {
                        ARTICLES ? ARTICLES[i].categories ? ARTICLES[i].categories.length > 0 ? <View style={styles.blueHorizontal} /> : null : null : null
                      }
                      <View style={{ flex: 1, backgroundColor: colors.white }}>

                      {this.renderCategoryView(ARTICLES[i])}
                       <Text style={[styles.newsArticleDetailTitle, { color: colors.articleNewsTitle }]}>{ARTICLES ? ARTICLES[i].title : ARTICLES[i].title}</Text>
                       {(ARTICLES != null) ?
                         <Text style={[styles.summaryText, { lineHeight: (globals.iPhoneX) ? WINDOW.height * 0.028 : WINDOW.height * 0.0315 }, { color: colors.newsDetailSummaryLight }]}>{ARTICLES[i].summary} </Text>
                         : null}

                       {this.setTextData(ARTICLES[i])}
                       {/* <Text style={[styles.newsArticleDetailDate, {color: colors.selectedFontColor}]}>{'swipe left for more read'}</Text>

                       <Text style={[styles.newsArticleDetailDate, { color: colors.selectedFontColor }]}>{ARTICLES[i].source + " - " + moment(ARTICLES[i].published_date).format('MMM DD, YYYY')}</Text> */}


                       {/* <View style={{ flex: 1, marginLeft: 15, marginTop: 10, flexDirection: 'row' }}>
                                                     <FlatList
                                                         ref={"myFlatList"}
                                                         data={ARTICLES[this.state.currentIndex].tags}
                                                         style={{ height: 20, marginBottom: 10 }}
                                                         renderItem={({ item }) => this.renderTags(item)}
                                                         keyExtractor={(item, index) => index.toString()}
                                                         horizontal={true}
                                                         showsHorizontalScrollIndicator={false}
                                                     />
                                                 </View> */}

                     </View>

                     {/* </View> */}
                     {/* </TouchableOpacity> */}
                   </View>

                   {/* </ScrollView> */}

                   <Animated.View style={[styles.newsDetailHeader, { transform: [{ translateY: this.tabbarTop }] }]}>
                     <View style={styles.customStatusBar} />
                     <View style={{ flexDirection: 'row', flex: 1 }}>
                       <View style={styles.headerbackButtonView}>
                         <HeaderBackButton onPress={() => this.props.navigation.goBack()} title='' tintColor='white' />
                       </View>
                       <View style={styles.headerTitleView}>
                         <Text  numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitleText}>{this.state.headerTitle}</Text>
                       </View>
                       <TouchableOpacity style={styles.headerRightImageView} onPress={() => this.goToCategoryScreen()}>
                         <Image style={[styles.headerRightIcon]} resizeMode={'contain'} source={dashboard.searchmenu} />
                       </TouchableOpacity>

                     </View>
                   </Animated.View>

                   <TouchableOpacity onPress={() => this._pressHandler(this.state.dashboardNewsDetailData[this.state.currentIndex].url, this.state.dashboardNewsDetailData.title)}>
                     <View style={{ height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 50, backgroundColor: 'rgba(24,24,24,1)' }}>
                       {(ARTICLES[i].media.length > 0) ? <Image style={{
                         opacity: 0.05,
                         height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 45,
                         width: globals.screenWidth,
                       }} source={{ uri: encodeURI(ARTICLES[i].media[0].url) }} permanent={true} blurRadius={1} />  :
                         <Image style={{
                           opacity: 0.05,
                           height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 45,
                           width: globals.screenWidth,
                         }} source={stock.news_placeholder} permanent={true} blurRadius={1}/>
                       }
                       <View style={{ position: 'absolute', padding: 5, flex: 1, }}>

                         <Text style={[styles.bannerTitle, { marginTop: 2 }]}>{ARTICLES[i].additional_data && ARTICLES[i].additional_data.banner.title}</Text>
                         <Text style={[styles.bannerTitle]}>{'Tap to know more'}</Text>

                       </View>
                     </View>
                   </TouchableOpacity>


                   {/* <Animated.View style={[{ position: 'absolute', display: (this.state.bottomVisible) ? "flex" : "none", paddingBottom: (Platform.OS == 'android') ? 30 : (DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'iPhone') ? 20 : 5, bottom: 0, width: globals.WINDOW.width, backgroundColor: colors.newsDetailShareBGLight }]}>
                     <View style={[styles.newsDetailSepView, { backgroundColor: colors.newsDetailSepViewLight }]} ></View>
                     <View style={{ width: '100%', flexDirection: 'row' }}>

                       <View style={styles.footermainView}>
                         <TouchableOpacity onPress={() => this.btnLikePressed(item)}>
                           {
                             <View style={styles.footerInnterView}>
                               <View style={[styles.footerInnterView, { flexDirection: 'row' }]}>
                                 <Image source={(ARTICLES[i].isLiked) ? dashboard.liked : dashboard.whiteLike} style={[styles.footerIconView, { marginRight: 2 }]} />
                                 {
                                   // (this.state.totalLikes != 0) ? 
                                   <Text style={styles.bottomButtonText} numberOfLines={1}>{(ARTICLES[i].like != null) ? ARTICLES[i].like : null}</Text>
                                   // : null
                                 }
                               </View>
                               <Text style={styles.bottomButtonText}>{(ARTICLES[i].isLiked) ? "Unlike" : "Like"}</Text>
                             </View>
                           }
                         </TouchableOpacity>
                       </View>
                       <View style={styles.footermainView}>
                         <TouchableOpacity onPress={() => this.btnBookmarkPressed(item)}>
                           {
                             <View style={styles.footerInnterView}>
                               <Image source={(ARTICLES[i].isBookmarked) ? dashboard.bookmark : dashboard.whiteBookmark} style={[styles.footerIconView]} />
                               <Text style={styles.bottomButtonText}>{(ARTICLES[i].isBookmarked) ? "Bookmarked" : "Bookmark"}</Text>
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

                   </Animated.View> */}

                 </View>
               </View>

             </Animated.View>
           )
         }

       }
       else if (i < this.state.currentIndex) {
         //console.log(TAG, "deep lower")
         return null
       }
       if (i == this.state.currentIndex) {
         //console.log(TAG, "current")
         return (

           <Animated.View key={item.id} style={this.position.getLayout()}
             {...this.PanResponder.panHandlers}
           >
           
             <View style={[globalStyles.safeviewStyle, { position: 'absolute', backgroundColor: colors.white, height: SCREEN_HEIGHT, width: SCREEN_WIDTH }]}>
               {this.openModal('2')}
               {/* {this.openGalleryModal()} */}

               <View style={[styles.searchScreenItemLeftView]}>
                 {/* <ScrollView style={{ flex: 1 }} bounces={false} contentContainerStyle={{ flex: 1 }}> */}

                 {/* <View> */}
                 {/* <TouchableOpacity> */}
                 <View style={[styles.rescentSeachTextView, { backgroundColor: colors.white }]}>
                   {/* <TouchableWithoutFeedback onLongPress={() => this.callGalleryView(ARTICLES[i])}> */}
                   <View style={[styles.newsDetailTopImage]}>

                     {/* {(ARTICLES[i].media.length > 0) ? <CacheableImage style={[styles.newsDetailTopImageView,]} source={{ uri: encodeURI(ARTICLES[i].media[0].url) }} permanent={true} /> :
                       <Image style={[styles.newsDetailTopImageView,]} source={stock.news_placeholder} permanent={true} />

                     } */}
                     {
                       this.renderImageOrVideo(ARTICLES[i])
                     }
                   </View>
                   {this.renderBannerLogo(ARTICLES[i])}
                   {/* <View style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.2)', paddingLeft:10, paddingRight:10, marginTop: (globals.iPhoneX) ? 60 : 40}}>
                      {(ARTICLES[i].additional_data && ARTICLES[i].additional_data.banner.url != null && ARTICLES[i].additional_data.banner.url !=''  ) ?
                      <Image style={{
                       height: 30,
                       width: 50,
                     }} source={{ uri: encodeURI(ARTICLES[i].additional_data.banner.url) }} permanent={true} resizeMode={'contain'}
                     /> : null}
                    </View>    */}
                   {/* </TouchableWithoutFeedback> */}
                   {
                        ARTICLES ? ARTICLES[i].categories ? ARTICLES[i].categories.length > 0 ? <View style={styles.blueHorizontal} /> : null : null : null
                      }
                      <View style={{ flex: 1, backgroundColor: colors.white }}>

                      {this.renderCategoryView(ARTICLES[i])}
                     <Text style={[styles.newsArticleDetailTitle, { color: colors.articleNewsTitle }]}>{ARTICLES ? ARTICLES[i].title : ARTICLES[i].title}</Text>
                     {(ARTICLES != null) ?
                       <Text style={[styles.summaryText, { lineHeight: (globals.iPhoneX) ? WINDOW.height * 0.028 : WINDOW.height * 0.0315 }, { color: colors.newsDetailSummaryLight }]}>{ARTICLES[i].summary} </Text>
                       : null}

                     {this.setTextData(ARTICLES[i])}
                     {/* <Text style={[styles.newsArticleDetailDate, {color: colors.selectedFontColor}]}>{'swipe left for more read'}</Text>

                     <Text style={[styles.newsArticleDetailDate, { color: colors.selectedFontColor }]}>{ARTICLES[i].source + " - " + moment(ARTICLES[i].published_date).format('MMM DD, YYYY')}</Text> */}
                     {/* <View style={{ flex: 1, marginLeft: 15, marginTop: 10, flexDirection: 'row' }}>
                                                 <FlatList
                                                     ref={"myFlatList"}
                                                     data={ARTICLES[this.state.currentIndex].tags}
                                                     style={{ height: 20, marginBottom: 10 }}
                                                     renderItem={({ item }) => this.renderTags(item)}
                                                     keyExtractor={(item, index) => index.toString()}
                                                     horizontal={true}
                                                     showsHorizontalScrollIndicator={false}
                                                 />
                                             </View> */}

                   </View>

                   {/* </View> */}
                   {/* </TouchableOpacity> */}

                 </View>

                 {/* </ScrollView> */}

                 <Animated.View style={[styles.newsDetailHeader, { transform: [{ translateY: this.tabbarTop }] }]}>
                   <View style={styles.customStatusBar} />
                   <View style={{ flexDirection: 'row', flex: 1 }}>
                     <View style={styles.headerbackButtonView}>
                       <HeaderBackButton onPress={() => this.props.navigation.goBack()} title='' tintColor='white' />
                     </View>
                     <View style={styles.headerTitleView}>
                       <Text  numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitleText}>{this.state.headerTitle}</Text>
                     </View>
                     <TouchableOpacity style={styles.headerRightImageView} onPress={() => this.goToCategoryScreen()}>
                       <Image style={[styles.headerRightIcon]} resizeMode={'contain'} source={dashboard.searchmenu} />
                     </TouchableOpacity>

                   </View>
                 </Animated.View>

                 <TouchableOpacity onPress={() => this._pressHandler(this.state.dashboardNewsDetailData[this.state.currentIndex].url, this.state.dashboardNewsDetailData.title)}>
                   <View style={{ height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 50, backgroundColor: 'rgba(24,24,24,1)' }}>
                     {(ARTICLES[i].media.length > 0) ? <Image style={{
                       opacity: 0.05,
                       height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 45,
                       width: globals.screenWidth,
                     }} source={{ uri: encodeURI(ARTICLES[i].media[0].url) }} permanent={true} blurRadius={1} /> :
                       <Image style={{
                         opacity: 0.05,
                         height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 45,
                         width: globals.screenWidth,
                       }} source={stock.news_placeholder} permanent={true} blurRadius={1} />
                     }
                     <View style={{ position: 'absolute', padding: 5, flex: 1, }}>

                       <Text style={[styles.bannerTitle, { marginTop: 2 }]}>{ARTICLES[i].additional_data && ARTICLES[i].additional_data.banner.title}</Text>
                       <Text style={[styles.bannerTitle]}>{'Tap to know more'}</Text>

                     </View>
                   </View>
                 </TouchableOpacity>

                 {(this.state.bottomVisible) ? <Animated.View style={[{ position: 'absolute', display: (this.state.bottomVisible) ? "flex" : "none", paddingBottom: (Platform.OS == 'android') ? 30 : (DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'iPhone') ? 20 : 5, bottom: this.tabbarTop, width: globals.WINDOW.width, backgroundColor: colors.newsDetailShareBGLight }]}>
                   <View style={[styles.newsDetailSepView, { backgroundColor: colors.newsDetailSepViewLight }]} ></View>
                   <View style={{ width: '100%', flexDirection: 'row' }}>

                     <View style={styles.footermainView}>
                       <TouchableOpacity onPress={() => this.btnLikePressed(item)}>
                         {
                           <View style={styles.footerInnterView}>
                             <View style={[styles.footerInnterView, { flexDirection: 'row' }]}>
                               <Image source={(ARTICLES[i].isLiked) ? dashboard.liked : dashboard.whiteLike} style={[styles.footerIconView, { marginRight: 2 }]} />
                               {
                                 // (this.state.totalLikes != 0) ? 
                                 <Text style={styles.bottomButtonText} numberOfLines={1}>{(ARTICLES[i].like != null) ? ARTICLES[i].like : null}</Text>
                                 // : null
                               }
                             </View>
                             <Text style={styles.bottomButtonText}>{(ARTICLES[i].isLiked) ? "Unlike" : "Like"}</Text>
                           </View>
                         }
                       </TouchableOpacity>
                     </View>
                     <View style={styles.footermainView}>
                       <TouchableOpacity onPress={() => this.btnBookmarkPressed(item)}>
                         {

                           <View style={styles.footerInnterView}>
                             <Image source={(ARTICLES[i].isBookmarked) ? dashboard.bookmark : dashboard.whiteBookmark} style={[styles.footerIconView]} />
                             <Text style={styles.bottomButtonText}>{(ARTICLES[i].isBookmarked) ? "Bookmarked" : "Bookmark"}</Text>
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

                 </Animated.View> : null}

               </View>
             </View>



           </Animated.View>

         )
       }
       else {
         ////console.log(TAG,"next")
         let nextVal = this.state.currentIndex + 1;
         if (nextVal < ARTICLES.length) {
           if (i == nextVal) {
             //console.log(TAG, "imm next")
             return (
               <Animated.View key={item.id}
               >
                 <View style={[globalStyles.safeviewStyle, { position: 'absolute', backgroundColor: colors.white, height: SCREEN_HEIGHT, width: SCREEN_WIDTH }]}>
                   {this.openModal('3')}
                   {/* {this.openGalleryModal()} */}

                   <View style={[styles.searchScreenItemLeftView]}>
                     {/* <ScrollView style={{ flex: 1 }} bounces={false} contentContainerStyle={{ flex: 1 }}> */}

                     {/* <View> */}
                     {/* <TouchableOpacity> */}
                     <View style={[styles.rescentSeachTextView, { backgroundColor: colors.white }]}>
                       {/* <TouchableWithoutFeedback onLongPress={() => this.callGalleryView(ARTICLES[i])}> */}
                       <View style={[styles.newsDetailTopImage]}>

                         {/* {(ARTICLES[i].media.length > 0) ? <CacheableImage style={[styles.newsDetailTopImageView,]} source={{ uri: encodeURI(ARTICLES[i].media[0].url) }} permanent={true} /> :
                           <Image style={[styles.newsDetailTopImageView,]} source={stock.news_placeholder} permanent={true} />
                         } */}
                         {
                           this.renderImageOrVideo(ARTICLES[i])
                         }
                       </View>
                       {this.renderBannerLogo(ARTICLES[i])}
                       {/* <View style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.2)', paddingLeft:10, paddingRight:10, marginTop: (globals.iPhoneX) ? 60 : 40}}>
                      {(ARTICLES[i].additional_data && ARTICLES[i].additional_data.banner.url != null && ARTICLES[i].additional_data.banner.url !=''  ) ?
                      <Image style={{
                       height: 30,
                       width: 50,
                     }} source={{ uri: encodeURI(ARTICLES[i].additional_data.banner.url) }} permanent={true} resizeMode={'contain'}
                     /> : null}
                    </View>   */}
                       {/* </TouchableWithoutFeedback> */}
                       {
                        ARTICLES ? ARTICLES[i].categories ? ARTICLES[i].categories.length > 0 ? <View style={styles.blueHorizontal} /> : null : null : null
                      }
                      <View style={{ flex: 1, backgroundColor: colors.white }}>

                      {this.renderCategoryView(ARTICLES[i])}
                         <Text style={[styles.newsArticleDetailTitle, { color: colors.articleNewsTitle }]}>{ARTICLES ? ARTICLES[i].title : ARTICLES[i].title}</Text>
                         {(ARTICLES != null) ?
                           <Text style={[styles.summaryText, { lineHeight: (globals.iPhoneX) ? WINDOW.height * 0.028 : WINDOW.height * 0.0315 }, { color: colors.newsDetailSummaryLight }]}>{ARTICLES[i].summary} </Text>
                           : null}

                         {this.setTextData(ARTICLES[i])}
                         {/* <Text style={[styles.newsArticleDetailDate, {color: colors.selectedFontColor}]}>{'swipe left for more read'}</Text>

                         <Text style={[styles.newsArticleDetailDate, { color: colors.selectedFontColor }]}>{ARTICLES[i].source + " - " + moment(ARTICLES[i].published_date).format('MMM DD, YYYY')}</Text> */}
                         {/* <View style={{ flex: 1, marginLeft: 15, marginTop: 10, flexDirection: 'row' }}>
                                                         <FlatList
                                                             ref={"myFlatList"}
                                                             data={ARTICLES[this.state.currentIndex].tags}
                                                             style={{ height: 20, marginBottom: 10 }}
                                                             renderItem={({ item }) => this.renderTags(item)}
                                                             keyExtractor={(item, index) => index.toString()}
                                                             horizontal={true}
                                                             showsHorizontalScrollIndicator={false}
                                                         />
                                                     </View> */}

                       </View>

                       {/* </View> */}
                       {/* </TouchableOpacity> */}

                     </View>

                     {/* </ScrollView> */}

                     <Animated.View style={[styles.newsDetailHeader, { transform: [{ translateY: this.tabbarTop }] }]}>
                       <View style={styles.customStatusBar} />
                       <View style={{ flexDirection: 'row', flex: 1 }}>
                         <View style={styles.headerbackButtonView}>
                           <HeaderBackButton onPress={() => this.props.navigation.goBack()} title='' tintColor='white' />
                         </View>
                         <View style={styles.headerTitleView}>
                           <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitleText}>{this.state.headerTitle}</Text>
                         </View>
                         <TouchableOpacity style={styles.headerRightImageView} onPress={() => this.goToCategoryScreen()}>
                           <Image style={[styles.headerRightIcon]} resizeMode={'contain'} source={dashboard.searchmenu} />
                         </TouchableOpacity>

                       </View>
                     </Animated.View>

                     <TouchableOpacity onPress={() => this._pressHandler(this.state.dashboardNewsDetailData[this.state.currentIndex].url, this.state.dashboardNewsDetailData.title)}>
                       <View style={{ height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 50, backgroundColor: 'rgba(24,24,24,1)' }}>
                         {(ARTICLES[i].media.length > 0) ? <Image style={{
                           opacity: 0.05,
                           height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 45,
                           width: globals.screenWidth,
                         }} source={{ uri: encodeURI(ARTICLES[i].media[0].url) }} permanent={true}  blurRadius={1}/> :
                           <Image style={{
                             opacity: 0.05,
                             height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 45,
                             width: globals.screenWidth,
                           }} source={stock.news_placeholder} permanent={true}  blurRadius={1}/>
                         }
                         <View style={{ position: 'absolute', padding: 5, flex: 1, }}>

                           <Text style={[styles.bannerTitle, { marginTop: 2 }]}>{ARTICLES[i].additional_data && ARTICLES[i].additional_data.banner.title}</Text>
                           <Text style={[styles.bannerTitle]}>{'Tap to know more'}</Text>

                         </View>
                       </View>
                     </TouchableOpacity>
                     {/* 
                     {(this.state.bottomVisible) ? <Animated.View style={[{ position: 'absolute', display: (this.state.bottomVisible) ? "flex" : "none", paddingBottom: (Platform.OS == 'android') ? 5 : (DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'iPhone') ? 20 : 5, bottom: this.tabbarTop, width: globals.WINDOW.width, backgroundColor: colors.newsDetailShareBGLight }]}>
                       <View style={[styles.newsDetailSepView, { backgroundColor: colors.newsDetailSepViewLight }]} ></View>
                       <View style={{ width: '100%', flexDirection: 'row' }}>

                         <View style={styles.footermainView}>
                           <TouchableOpacity onPress={() => this.btnLikePressed(item)}>
                             {
                               <View style={styles.footerInnterView}>
                                 <View style={[styles.footerInnterView, { flexDirection: 'row' }]}>
                                   <Image source={(ARTICLES[i].isLiked) ? dashboard.liked : dashboard.whiteLike} style={[styles.footerIconView, { marginRight: 2 }]} />
                                   {
                                     // (this.state.totalLikes != 0) ? 
                                     <Text style={styles.bottomButtonText} numberOfLines={1}>{(ARTICLES[i].like != null) ? ARTICLES[i].like : null}</Text>
                                     // : null
                                   }
                                 </View>
                                 <Text style={styles.bottomButtonText}>{(ARTICLES[i].isLiked) ? "Unlike" : "Like"}</Text>
                               </View>
                             }
                           </TouchableOpacity>
                         </View>
                         <View style={styles.footermainView}>
                           <TouchableOpacity onPress={() => this.btnBookmarkPressed(item)}>
                             {

                               <View style={styles.footerInnterView}>
                                 <Image source={(ARTICLES[i].isBookmarked) ? dashboard.bookmark : dashboard.whiteBookmark} style={[styles.footerIconView]} />
                                 <Text style={styles.bottomButtonText}>{(ARTICLES[i].isBookmarked) ? "Bookmarked" : "Bookmark"}</Text>
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

                     </Animated.View> : null} */}

                   </View>
                 </View>

               </Animated.View>
             )
           } else {
             //console.log(TAG, "deep next")
             return null
           }
         } else {
           return null;
         }
       }
     }).reverse()
   }

 }



  renderArticleDetailsOld = () => {
    // let ARTICLES = [];
    // if (this.state.dashboardNewsDetailData != null) {
    //   ARTICLES = this.state.dashboardNewsDetailData;
    // }

    let ARTICLES = this.state.dashboardNewsDetailData;

    if (ARTICLES.length == 0) {
      console.log("user wise dashboard aricle render")
      return (
        <Fragment>
          <SafeAreaView style={{ flex: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
          <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', paddingLeft: 15, paddingBottom: 10, paddingTop: 10, flexDirection: 'row' }}>
            <TouchableOpacity style={{ justifyContent: 'flex-start' }} onPress={() => this.props.navigation.goBack(null)}>
              <Ionicons name="ios-arrow-back" size={30} color={colors.white} />
            </TouchableOpacity>
            {/* <View style={{flex:1,justifyContent:'center'}}>
                        <Text style={[styles.headerTitle, {color: colors.white}]}>{'Top News'}</Text>
                </View> */}
          </View>
          <View style={{ flex: 1, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', }}>
            {this.renderNoDataText(this.state.isTextShow)}
            
            {/* <Text style={styles.noMoreArticles}>Please swipe right for previous screen </Text> */}
          </View>
        </Fragment>
      )
    }
    else {
      return ARTICLES.map((item, i) => {

        if (i == this.state.currentIndex - 1) {
          if (this.state.currentIndex   == ARTICLES.length ) {
            return (
              <GestureRecognizer
                style={{ flex: 1, }}
                onSwipeDown={(state) => this.onSwipeDown(state)}>
                <Fragment>
                  <SafeAreaView style={{ flex: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
                  <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', paddingLeft: 15, paddingBottom: 10, paddingTop: 10, flexDirection: 'row' }}>
                    <TouchableOpacity style={{ justifyContent: 'flex-start' }} onPress={() => this.props.navigation.goBack(null)}>
                      <Ionicons name="ios-arrow-back" size={30} color={colors.white} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.headerTitle, { color: colors.white }]}>{'Top News'}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.noMoreArticles, { fontSize: 25 }]}>Great! </Text>
                      <Emojicon name={'blush'} size={20} style={{ marginTop: 2 }} />
                    </View>
                    <Text style={styles.noMoreArticles}>You have caught up with some news.  </Text>
                    <Text style={styles.noMoreArticles}>Swipe down to go to previous articles </Text>
                  </View>
                </Fragment>
              </GestureRecognizer>
            )
          }
          else {
            return (
              <Animated.View key={item.id} style={this.swipedCardPosition.getLayout()}
                {...this.PanResponder.panHandlers}
              >
                <View style={[globalStyles.safeviewStyle, { backgroundColor: colors.white, height: SCREEN_HEIGHT, width: SCREEN_WIDTH, position: 'absolute' }]}>
                  {this.openModal('1')}
                  <View style={[styles.searchScreenItemLeftView]}>
                    <View style={[styles.rescentSeachTextView, { backgroundColor: colors.white }]}>
                      <View style={[styles.newsDetailTopImage]}>
                        {
                          this.renderImageOrVideo(ARTICLES[i])
                        }
                      </View>
                      {this.renderBannerLogo(ARTICLES[i])}

                      {
                        ARTICLES ? ARTICLES[i].categories ? ARTICLES[i].categories.length > 0 ? <View style={styles.blueHorizontal} /> : null : null : null
                      }
                      <View style={{ flex: 1, backgroundColor: colors.white }}>

                      {this.renderCategoryView(ARTICLES[i])}
                     
                        <Text style={[styles.newsArticleDetailTitle, { color: colors.articleNewsTitle }]}>{ARTICLES ? ARTICLES[i].title : ARTICLES[i].title}</Text>
                        {(ARTICLES != null) ?
                          <Text style={[styles.summaryText, { lineHeight: (globals.iPhoneX) ? WINDOW.height * 0.028 : WINDOW.height * 0.0315 }, { color: colors.newsDetailSummaryLight }]}>{ARTICLES[i].summary} </Text>
                          : null}

                        {/* <Text style={[styles.newsArticleDetailDate, {color: colors.selectedFontColor}]}>{'swipe left for more read'}</Text>
                        <Text style={[styles.newsArticleDetailDate, { color: colors.selectedFontColor }]}>{ARTICLES[i].source + " - " + moment(ARTICLES[i].published_date).format('MMM DD, YYYY')}</Text> */}
                        {this.setTextData(ARTICLES[i])}

                        {/* <View style={{ flex: 1, marginLeft: 15, marginTop: 10, flexDirection: 'row' }}>
                          <FlatList
                            ref={"myFlatList"}
                            data={ARTICLES[i].tags}
                            style={{ height: 20, marginBottom: 10 }}
                            renderItem={({ item }) => this.renderTags(item)}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                          />
                        </View> */}
                      </View>
                    </View>

                    <Animated.View style={[styles.newsDetailHeader, { transform: [{ translateY: this.tabbarTop }] }]}>
                      <View style={styles.customStatusBar} />
                      <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={styles.headerbackButtonView}>
                          <HeaderBackButton onPress={() => this.props.navigation.goBack()} title='' tintColor='white' />
                        </View>
                        <View style={styles.headerTitleView}>
                          <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitleText}>{this.state.headerTitle}</Text>
                        </View>
                        <TouchableOpacity style={styles.headerRightImageView} onPress={() => this.goToCategoryScreen()}>
                          <Image style={[styles.headerRightIcon]} resizeMode={'contain'} source={dashboard.searchmenu} />
                        </TouchableOpacity>

                      </View>
                    </Animated.View>

                    <TouchableOpacity onPress={() => this._pressHandler(this.state.dashboardNewsDetailData[this.state.currentIndex].url, this.state.dashboardNewsDetailData.title)}>
                      <View style={{ height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 50, backgroundColor: 'rgba(24,24,24,1)' }}>
                        {(ARTICLES[i].media.length > 0) ? <Image style={{
                          opacity: 0.3,
                          height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 45,
                          width: globals.screenWidth,
                        }} source={{ uri: encodeURI(ARTICLES[i].media[0].url) }} permanent={true}
                          blurRadius={1}
                        /> :
                          <Image style={{
                            opacity: 0.3,
                            height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 45,
                            width: globals.screenWidth,
                          }} source={stock.news_placeholder} permanent={true}
                            blurRadius={1}
                          />
                        }
                        <View style={{ position: 'absolute', padding: 5, flex: 1, }}>

                          <Text style={[styles.bannerTitle, { marginTop: 2 }]}>{ARTICLES[i].additional_data && ARTICLES[i].additional_data.banner.title}</Text>
                          <Text style={[styles.bannerTitle]}>{'Tap to know more'}</Text>

                        </View>
                      </View>
                    </TouchableOpacity>


                  </View>
                </View>
              </Animated.View>
            )
          }
        }
        else if (i < this.state.currentIndex) {
          return null
        }
        if (i == this.state.currentIndex) {
          return (
            // <Fragment>
            //   <SafeAreaView style={{ flex: 0,  backgroundColor:'transparent' }} />
            // <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(24,24,24,0.43)' }}>
            <Animated.View key={item.id} style={this.position.getLayout()}
              {...this.PanResponder.panHandlers}
            >
              <View style={[globalStyles.safeviewStyle, { position: 'absolute', backgroundColor: colors.white, height: SCREEN_HEIGHT, width: SCREEN_WIDTH }]}>
                {this.openModal('2')}
                <View style={[styles.searchScreenItemLeftView]}>
                  <View style={[styles.rescentSeachTextView,{backgroundColor : colors.white}]}>

                    <View style={[styles.newsDetailTopImage]}>
                      {
                        this.renderImageOrVideo(ARTICLES[i])
                      }
                    </View>
                    {this.renderBannerLogo(ARTICLES[i])}


                    {
                      ARTICLES ? ARTICLES[i].categories ? ARTICLES[i].categories.length > 0 ? <View style={styles.blueHorizontal} /> : null : null : null

                    }

                    <View style={{ flex: 3, backgroundColor: colors.white }}>
                    {this.renderCategoryView(ARTICLES[i])}

                      <Text style={[styles.newsArticleDetailTitle, { color: colors.articleNewsTitle }]}>{ARTICLES ? ARTICLES[i].title : ARTICLES[i].title}</Text>
                      {(ARTICLES != null) ?
                        <Text style={[styles.summaryText, { lineHeight: (globals.iPhoneX) ? WINDOW.height * 0.028 : WINDOW.height * 0.0315 }, { color: colors.newsDetailSummaryLight }]}>{ARTICLES[i].summary} </Text>
                        : null}

                      {this.setTextData(ARTICLES[i])}
                      {/* <Text style={[styles.newsArticleDetailDate, {color: colors.selectedFontColor}]}>{'swipe left for more read'}</Text>
                      <Text style={[styles.newsArticleDetailDate, { color: colors.selectedFontColor }]}>{ARTICLES[i].source + " - " + moment(ARTICLES[i].published_date).format('MMM DD, YYYY')}</Text> */}
                      {/* <View style={{ flex: 1, marginLeft: 15, marginTop: 10, flexDirection: 'row' }}>
                        <FlatList
                          ref={"myFlatList"}
                          data={ARTICLES[i].tags}
                          style={{ height: 20, marginBottom: 10 }}
                          renderItem={({ item }) => this.renderTags(item)}
                          keyExtractor={(item, index) => index.toString()}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                        />
                      </View> */}

                    </View>
                  </View>
                  <Animated.View style={[styles.newsDetailHeader, { transform: [{ translateY: this.tabbarTop }] }]}>
                    <View style={styles.customStatusBar} />
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <View style={styles.headerbackButtonView}>
                        <HeaderBackButton onPress={() => this.props.navigation.goBack()} title='' tintColor='white' />
                      </View>
                      <View style={styles.headerTitleView}>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitleText}>{this.state.headerTitle}</Text>
                      </View>
                      <TouchableOpacity style={styles.headerRightImageView} onPress={() => this.goToCategoryScreen()}>
                        <Image style={[styles.headerRightIcon]} resizeMode={'contain'} source={dashboard.searchmenu} />
                      </TouchableOpacity>

                    </View>
                  </Animated.View>

                  <TouchableOpacity onPress={() => this._pressHandler(this.state.dashboardNewsDetailData[this.state.currentIndex].url, this.state.dashboardNewsDetailData.title)}>
                    <View style={{ height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 50, backgroundColor: 'rgba(24,24,24,1)' }}>
                      {(ARTICLES[i].media.length > 0) ? <Image style={{
                        opacity: 0.3,
                        height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 45,
                        width: globals.screenWidth,
                      }} source={{ uri: encodeURI(ARTICLES[i].media[0].url) }} permanent={true}
                        blurRadius={1}
                      /> :
                        <Image style={{
                          opacity: 0.3,
                          height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 45,
                          width: globals.screenWidth,
                        }} source={stock.news_placeholder} permanent={true}
                          blurRadius={1}
                        />
                      }
                      <View style={{ position: 'absolute', padding: 5, flex: 1, }}>

                        <Text style={[styles.bannerTitle, { marginTop: 2 }]}>{ARTICLES[i].additional_data && ARTICLES[i].additional_data.banner.title}</Text>
                        <Text style={[styles.bannerTitle]}>{'Tap to know more'}</Text>

                      </View>
                    </View>
                  </TouchableOpacity>


                  {(this.state.bottomVisible) ?
                    <Animated.View style={[{ flex: 1, position: 'absolute', display: (this.state.bottomVisible) ? "flex" : "none", paddingBottom: (Platform.OS == 'android') ? 30 : (DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'iPhone') ? 20 : 5, bottom: this.tabbarTop, width: globals.WINDOW.width, backgroundColor: colors.newsDetailShareBGLight }]}>
                      <View style={[styles.newsDetailSepView, { backgroundColor: colors.newsDetailSepViewLight }]} ></View>
                      <View style={{ width: '100%', flexDirection: 'row' }}>

                        <View style={styles.footermainView}>
                          <TouchableOpacity onPress={() => this.btnLikePressed(item)}>
                            {
                              <View style={styles.footerInnterView}>
                                <View style={[styles.footerInnterView, { flexDirection: 'row' }]}>
                                  <Image source={(ARTICLES[i].isLiked) ? dashboard.liked : dashboard.whiteLike} style={[styles.footerIconView, { marginRight: 2 }]} />

                                  <Text style={styles.bottomButtonText} numberOfLines={1}>{(ARTICLES[i].like != null) ? ARTICLES[i].like : null}</Text>

                                </View>
                                <Text style={styles.bottomButtonText}>{(ARTICLES[i].isLiked) ? "Unlike" : "Like"}</Text>
                              </View>
                            }
                          </TouchableOpacity>
                        </View>
                        <View style={styles.footermainView}>
                          <TouchableOpacity onPress={() => this.btnBookmarkPressed(item)}>
                            {

                              <View style={styles.footerInnterView}>
                                <Image source={(ARTICLES[i].isBookmarked) ? dashboard.bookmark : dashboard.whiteBookmark} style={[styles.footerIconView]} />
                                <Text style={styles.bottomButtonText}>{(ARTICLES[i].isBookmarked) ? "Bookmarked" : "Bookmark"}</Text>
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
                    </Animated.View> : null}
                </View>
              </View>
            </Animated.View>
            // </SafeAreaView>
            // </Fragment>                
          )
        }
        else {
          let nextVal = this.state.currentIndex + 1;
          if (nextVal < ARTICLES.length) {
            if (i == nextVal) {
              return (
                <Animated.View key={item.id}
                >
                  <View style={[globalStyles.safeviewStyle, { position: 'absolute', backgroundColor: colors.white, height: SCREEN_HEIGHT, width: SCREEN_WIDTH }]}>
                    {this.openModal('3')}
                    <View style={[styles.searchScreenItemLeftView]}>
                      <View style={[styles.rescentSeachTextView, { backgroundColor: colors.white }]}>
                        <View style={[styles.newsDetailTopImage]}>
                          {
                            this.renderImageOrVideo(ARTICLES[i])
                          }
                        </View>
                        {this.renderBannerLogo(ARTICLES[i])}

                        {
                          ARTICLES ? ARTICLES[i].categories ? ARTICLES[i].categories.length > 0 ? <View style={styles.blueHorizontal} /> : null : null : null

                        }
                        <View style={{ flex: 1, backgroundColor: colors.white }}>
                        {this.renderCategoryView(ARTICLES[i])}
                       
                          <Text style={[styles.newsArticleDetailTitle, { color: colors.articleNewsTitle }]}>{ARTICLES ? ARTICLES[i].title : ARTICLES[i].title}</Text>
                          {(ARTICLES != null) ?
                            <Text style={[styles.summaryText, { lineHeight: (globals.iPhoneX) ? WINDOW.height * 0.028 : WINDOW.height * 0.0315 }, { color: colors.newsDetailSummaryLight }]}>{ARTICLES[i].summary} </Text>
                            : null}
                          {this.setTextData(ARTICLES[i])}
                          {/* <Text style={[styles.newsArticleDetailDate, {color: colors.selectedFontColor}]}>{'swipe left for more read'}</Text>
                          <Text style={[styles.newsArticleDetailDate, { color: colors.selectedFontColor }]}>{ARTICLES[i].source + " - " + moment(ARTICLES[i].published_date).format('MMM DD, YYYY')}</Text> */}
                          {/* <View style={{ flex: 1, marginLeft: 15, marginTop: 10, flexDirection: 'row' }}>
                            <FlatList
                              ref={"myFlatList"}
                              data={ARTICLES[i].tags}
                              style={{ height: 20, marginBottom: 10 }}
                              renderItem={({ item }) => this.renderTags(item)}
                              keyExtractor={(item, index) => index.toString()}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                            />
                          </View> */}
                        </View>
                      </View>
                      </View>

                      <Animated.View style={[styles.newsDetailHeader, { transform: [{ translateY: this.tabbarTop }] }]}>
                        <View style={styles.customStatusBar} />
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          <View style={styles.headerbackButtonView}>
                            <HeaderBackButton onPress={() => this.props.navigation.goBack()} title='' tintColor='white' />
                          </View>
                          <View style={styles.headerTitleView}>
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitleText}>{this.state.headerTitle}</Text>
                          </View>
                          <TouchableOpacity style={styles.headerRightImageView} onPress={() => this.goToCategoryScreen()}>
                            <Image style={[styles.headerRightIcon]} resizeMode={'contain'} source={dashboard.searchmenu} />
                          </TouchableOpacity>
                        </View>
                      </Animated.View>

                      <TouchableOpacity onPress={() => this._pressHandler(this.state.dashboardNewsDetailData[this.state.currentIndex].url, this.state.dashboardNewsDetailData.title)}>
                        <View style={{ height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 50, backgroundColor: 'rgba(24,24,24,1)' }}>
                          {(ARTICLES[i].media.length > 0) ? <Image style={{
                            opacity: 0.3,
                            height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 45,
                            width: globals.screenWidth,
                          }} source={{ uri: encodeURI(ARTICLES[i].media[0].url) }} permanent={true}
                            blurRadius={1}
                          /> :
                            <Image style={{
                              opacity: 0.3,
                              height: (Platform.OS == 'android') ? 78 : (globals.iPhoneX) ? 68 : 45,
                              width: globals.screenWidth,
                            }} source={stock.news_placeholder} permanent={true}
                              blurRadius={1}
                            />
                          }
                          <View style={{ position: 'absolute', padding: 5, flex: 1, }}>

                            <Text style={[styles.bannerTitle, { marginTop: 2 }]}>{ARTICLES[i].additional_data && ARTICLES[i].additional_data.banner.title}</Text>
                            <Text style={[styles.bannerTitle]}>{'Tap to know more'}</Text>

                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                </Animated.View>
              )
            } else {
              return null
            }
          } else {
            return null;
          }
        }
      }).reverse()
    }

  }

  goToCategoryScreen() {

    firebase.analytics().logEvent(globals.event_CategoryScreen,
      Object.assign({}, { EventDetails: 'Navigate to Category screen' }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

    var event = { "key": globals.event_CategoryScreen, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
    Countly.recordEvent(event);
    this.props.navigation.navigate('Category')
  }

  /**
   * Method for render articles on swipe up and down using react native animated
   */



  /**
   *  method for render hold messsage view
   */
  renderHoldTextView() {
    return (
      <View>
        <Text style={{ marginTop: 10 }}>{globals.holdMessage}</Text>
      </View>
    )
  }

  /**
   * method for set timeout for hold text for 3 seconds
   */
  timeOutHoldTextStatusChange() {
    setTimeout(() => { this.setState({ renderHoldText: true }) }, 500)
  }

  btnTryAgainPressed() {
    if (globals.isInternetConnected) {
      if (globals.globalVars.userIdTemp_Global != null) {
        if (globals.Authsecret != '') {
          this.getTimeIntervalForUserArtilce()
        }
        else {
          this.setState({ loading: true })
          this.animation.play();
          this.checkLogin()
          globals.globalVars.dashboardTitle = globals.screenTitle_NewsSummary
        }

      } else {
        this.getTimeIntervalForGeneralArtilce()
        // API.newsAllArticles(this.responseArticle, true);
      }
      // let imagURL = this.state.dashboardNewsDetailData ? encodeURI(this.state.dashboardNewsDetailData.imageUrl) : encodeURI(this.state.dashboardNewsDetailData.imageUrl)
      // Image.getSize(imagURL, (width, height) => {
      //   var imageHeight = (globals.iPhoneX) ? height * (globals.WINDOW.width / width) : height * (globals.WINDOW.width / width)
      //   this.setState({ headerImageHeight: imageHeight })
      // })
    }
  }

 
  static callUserArticleList(){
    _this.setState({ loading: true, dashboardNewsDetailData: [], currentIndex: 0 }, () => {
      if (_this.animation != undefined) {
        _this.animation.play();
      }
    })
    // API.newsUserAllArticles(this.responseUserArticle, globals.globalVars.userIdTemp_Global, true);
    API.getNewRefreshedToken(_this.refreshTokenResponseData);
  }

  openClaneModal() {
    return (

      <Modal animationType='none' visible={this.state.loading} onRequestClose={() => { DashboardNewsArticleDetail.handleCloseModalWebview() }}>
        <ClaneBlueLoader setParentState={newState => this.setState(newState)} />
      </Modal>
    )
  }
  render() {
    // let { fadeAnim } = this.state;

    if (this.state.isNetwork && this.state.isServerError) {
      return (
        <Fragment>
          <SafeAreaView style={{ flex: 0, backgroundColor: colors.blue }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} >
            <View style={{ backgroundColor: colors.blue, padding: 10, flexDirection: 'row' }}>
              <TouchableOpacity style={{ justifyContent: 'flex-start' }} onPress={() => this.props.navigation.goBack(null)}>
                <Ionicons name="ios-arrow-back" size={30} color={colors.white} />
              </TouchableOpacity>
              {/* <View style={{flex:1,justifyContent:'center'}}>
                        <Text style={[styles.headerTitle, {color: colors.blue}]}>{'Top News'}</Text>
                  </View> */}
            </View>
            <View style={[styles.watchlistFooterMain, { marginBottom: 44 }, { backgroundColor: colors.white }]}>
              <View style={styles.noInternetTextView}>
                <Text style={[styles.trendingFooterText, { textAlign: 'center', color: colors.blackThemeColor }]}>{globals.timeoutMessage}
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </Fragment>
      )
    }
    else if (!this.state.isNetwork && !this.state.isCached) {
      return (
        <Fragment>
         <SafeAreaView style={{ flex: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
         <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} >
        <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', paddingLeft: 15, paddingBottom: 10, paddingTop: 10, flexDirection: 'row' }}>
           <TouchableOpacity style={{ justifyContent: 'flex-start' }} onPress={() => this.props.navigation.goBack(null)}>
             <Ionicons name="ios-arrow-back" size={30} color={colors.white} />
           </TouchableOpacity>
           <View style={{flex:1,justifyContent:'center'}}>
               <Text style={[styles.headerTitle, {color: colors.white}]}>{'Top News'}</Text>
           </View>
         </View>

          <View style={[styles.watchlistFooterMain, { marginBottom: 44, backgroundColor: colors.white },]}>
            <View style={styles.noInternetTextView}>
              <Text style={[styles.trendingFooterText, { color: colors.blackThemeColor }]}>{globals.networkNotAvailable}
              </Text>
            </View>
            <View style={styles.tryAgainButtonView}>
              <Button
                onPress={() => this.btnTryAgainPressed()}
                textStyle={[styles.buttonText, { color: colors.white, }]}
                buttonStyles={[styles.buttonStyles, { borderColor: colors.blue, backgroundColor: colors.blue, }]}
                text={globals.tryAgain}></Button>
            </View>
          </View>
        </SafeAreaView>
        </Fragment>
      )
    }

    else {
      return (
        <View style={{ flex: 1 }}>
          {(this.state.loading) ? this.openClaneModal() : this.renderArticleDetails()}
        </View>
      )
    }

  }


  // }
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
    // android_modal: state.android_modal
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardNewsArticleDetail);

