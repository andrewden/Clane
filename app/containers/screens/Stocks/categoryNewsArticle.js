import React, { Component, Fragment } from 'react';
import { Text, SafeAreaView, Image, TouchableOpacity, View, Animated, PanResponder, FlatList, Modal, TouchableWithoutFeedback, Platform, StatusBar, Dimensions, ActivityIndicator, AsyncStorage, ScrollView, RefreshControl } from 'react-native';
import Button from '../../../components/Button';
import Emojicon from '../InitialStock/react-native-emojicon';
import Ionicons from 'react-native-vector-icons/Ionicons';
import YouTube, { YouTubeStandaloneAndroid } from 'react-native-youtube';
import { Thumbnail } from '../Stocks/react-native-thumbnail-video/src'
import { NavigationEvents } from 'react-navigation';

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
import LottieView from 'lottie-react-native';
import ClaneBlueLoader from '../InitialStock/claneBlueLoader';
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
import NewsArticleWebView from '../InitialStock/NewsArticleWebView';
import Countly from 'countly-sdk-react-native';
import { API } from '../../../lib/api';

import GalleryImage from '../InitialStock/galleryImage';
import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import { getShowAndroidModal } from '../../../redux/actions/showAndroidWebViewModal';

import firebase from 'react-native-firebase';
import branch, { BranchEvent } from 'react-native-branch';
const SCREEN_HEIGHT = Dimensions.get("window").height
const SCREEN_WIDTH = Dimensions.get("window").width
import dashboardNewsArticleData from '../InitialStock/dashboardArticleDetailData';

var TAG = "DashboardNewsArticleDetail"
var _this = null;
var shareOptionObj = {
  title: "Clane",
  subject: "Clane"
}
let maxInitialAdded = 3;
let likeData = [];
let bookmarkData = [];

var selectedItemForAction = null;
var selectedItemType = '';

let startTime;

let fullDataArray = [];
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
let ARTICLES = [];
const CacheableImage = imageCacheHoc(Image, {
  validProtocols: ['http', 'https'],
  defaultPlaceholder: propOverridePlaceholderObject
});


class CategoryNewsArticle extends Component {

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
      headerTitle: '',
      isBookmarked: false,
      isLiked: false,
      totalLikes: 32,
      // categoryNewsDetail: dashboardNewsArticleData.RESPONSE.data,
      categoryNewsDetail: [],
      isCached: true,
      currentIndex: 0,
      isReverse: false,
      bottomVisible: false,
      isGalleryVisible: false,
      loading: true,
      isSeverError: false,
      renderHoldText: false,
      page: 1,
      foreGroundAPICall: false,
      newStoryCount: 0,
      callRefreshAPI: false,
      isFrom: this.props.navigation.state.params.isFrom,
      fadeAnim: new Animated.Value(0),
       
    }


    this.tabbarTop = (globals.iPhoneX) ? new Animated.Value(-88) : new Animated.Value(-64)
    this.shareBottom = new Animated.Value(-64)
    // StatusBar.setHidden(true, "slide")
    _this = this

    //  let ss = globals.capitalizeFirstLetter(this.props.navigation.state.params.title.substring(1));
    // //console.log(TAG, "categoryNewsDetail data ---->" + ss)

  }

  startAnimation() {
    Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
    }).start();
  }

  _onRefresh = () => {
    // alert('sdsd')

    // this.setState({refreshing: true});
    // fetchData().then(() => {
    //   this.setState({refreshing: false});
    // });
  }

  renderAPI() {
    let responseData = null;
    if (globals.globalVars.headerTitle != '') {
      AsyncStorage.getItem(globals.globalVars.headerTitle, (err, result) => {
        if (result !== null) {

          responseData = JSON.parse(result);
          console.log("callBackgroundAPICall-->  " + responseData +" "+ this.props.navigation.state.params.title);
          _this.setState({ foreGroundAPICall: true }, () => {
            // _this.forceUpdate()
          })
          if (_this.props.navigation.state.params.isFrom == 'tags') {
            if (_this.props.navigation.state.params.title == 'All News') {
              console.log("callBackgroundAPICall--> All news ");
              _this.setState({ page: responseData + 1 }, () => {
                API.getAllNewsArticles(_this.responseAllArticle, true, _this.state.page);
              })

            }
            else if (this.props.navigation.state.params.title == 'Bookmarks') {
              API.getNewRefreshedToken(_this.refreshTokenResponseData);
            }
            else {
              console.log("callBackgroundAPICall--> All tags ");
            }
          } else {
            _this.setState({ page: responseData + 1 }, () => {
              API.getArticalCategoryWise(_this.responseTagWiseArticle, _this.props.navigation.state.params.cat_id, globals.globalVars.userIdTemp_Global, true, _this.state.page);
            })

            // _this.getTimeIntervalTagWise("category", _this.props.navigation.state.params.title)
            console.log("callBackgroundAPICall--> All category ");
          }
        }

      });


    }
  }

  componentWillMount() {
    //console.log(TAG + " componentWillMount")
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        console.log("onPanResponderMove " + this.state.currentIndex)
        if (gestureState.dy > 0 && (this.state.currentIndex > 0)) {

          this.swipedCardPosition.setValue({
            x: 0, y: -SCREEN_HEIGHT + gestureState.dy
          })
        }
        else if (this.state.currentIndex == 0) {
          // this.setState({ isReverse: false })
          if (gestureState.dy > 0) {
            console.log("this.state.headerTitleText" + this.state.headerTitle);

            if (this.state.headerTitle == 'Trending' || this.state.headerTitle == 'Top Feeds' || this.state.headerTitle == 'Top news') {
              this.setState({ isReverse: false, refreshing: false })
            } else {
              this.setState({ isReverse: false, refreshing: true }, () => {
                this.setState({ callRefreshAPI: true })
              })
            }

          }
          else {
            this.position.setValue({ y: gestureState.dy })
          }
        }

        else {
          // if (this.state.isReverse) {
          //     this.setState({isReverse: false})
          // }

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
        // console.log("onPanResponderRelease "+this.state.currentIndex + " "+ARTICLES.length)
        if (this.state.currentIndex == ARTICLES.length - 1) {
          this.setState({ foreGroundAPICall: false })
        }
        // this.tabbarTop = (globals.iPhoneX) ? new Animated.Value(-88) : new Animated.Value(-64)

        // if (this.state.currentIndex == 0) {
        //   this.renderAPI()
        // }else {
        if (this.state.callRefreshAPI) {
          console.log("callRefreshAPI");
          this.setState({ callRefreshAPI: false })
          this.renderAPI()

        }
        if (this.state.currentIndex > 0 && gestureState.dy > 1 && gestureState.vy < 10) {
          console.log("onPanResponderRelease 1")
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
            //console.log("RELEASE ONE " + this.state.currentIndex);
            if (this.state.currentIndex == 0) {
              this.setState({ isReverse: true })
            }
          })
        }

        else if (-gestureState.dy > 1 && -gestureState.vy > 0.1) {
          console.log("onPanResponderRelease 2")
          let timeDiff = globals.getTimeDifferenceSecond(startTime);
          console.log("onPanResponderRelease TITLE "+ ARTICLES[this.state.currentIndex].title);
          
          if (timeDiff > 10) {
              firebase.analytics().logEvent(globals.event_ArticleRead,
              globals.getAnalyticBasicDataCategoryType(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global, timeDiff,ARTICLES[this.state.currentIndex].title ));
          }
          startTime = new Date().getTime();
          let tempCurrentIndex = this.state.currentIndex;
          let totalIndex = this.state.categoryNewsDetail.length;
          let nextCallIndex = totalIndex - 4;
          console.log("tempCurrentIndex --> " + tempCurrentIndex + " totalIndex  -->" + totalIndex + " nextCallIndex --> " + nextCallIndex);
          if (this.state.currentIndex == nextCallIndex) {
            this.setState({ page: this.state.page + 1 }, () => {
              if (this.props.navigation.state.params.isFrom == 'tags') {
                if (this.props.navigation.state.params.title == 'All News') {

                  API.getAllNewsArticles(this.responseAllArticle, true, this.state.page);
                  // this.getTimeIntervalAllNews()
                  // this.setState({ headerTitle: globals.capitalizeFirstLetter(this.props.navigation.state.params.title) })
                }

                else {
                  console.log("this.state.headerTitle " + this.state.headerTitle);

                  if (this.state.headerTitle !== 'Trending' && this.state.headerTitle !== 'Topfeeds' && this.state.headerTitle !== 'Topnews') {
                    API.getArticalTagWise(this.responseTagWiseArticle, this.props.navigation.state.params.tagValue, globals.globalVars.userIdTemp_Global, true, this.state.page);
                  }


                  // this.getTimeIntervalTagWise("tags", this.props.navigation.state.params.title)
                  // this.setState({ headerTitle: globals.capitalizeFirstLetter(this.props.navigation.state.params.title) })
                }
              } else {
                API.getArticalCategoryWise(this.responseTagWiseArticle, this.props.navigation.state.params.cat_id, globals.globalVars.userIdTemp_Global, true, this.state.page);
                // this.getTimeIntervalTagWise("category", this.props.navigation.state.params.title)
                // this.setState({ headerTitle: globals.capitalizeFirstLetter(this.props.navigation.state.params.title) })
              }
            })

          }

          Animated.timing(this.position, {
            toValue: ({ x: 0, y: -SCREEN_HEIGHT }),
            duration: 400
          }).start(() => {

            this.setState({ currentIndex: this.state.currentIndex + 1 })
            this.position.setValue({ x: 0, y: 0 })
            //console.log("RELEASE TWO " + this.state.currentIndex);


          })
        }
        else if (gestureState.dx == 0 && gestureState.dy == 0 && gestureState.vx == 0 && gestureState.vy == 0) {
          // this.tabbarTop = (globals.iPhoneX) ? new Animated.Value(-88) : new Animated.Value(-64)
          this._onPressButton();
        }
        else {
          console.log("onPanResponderRelease 3")

          // console.log("RELEASE THREE " + this.state.currentIndex);

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
        // }

        if (Platform.OS == 'ios') {
          if (gestureState.dx < -25 && gestureState.dx > -350) {
            if (gestureState.dy > -50 && gestureState.dy < 50) {
              this._pressHandler(this.state.categoryNewsDetail[this.state.currentIndex].url, this.state.categoryNewsDetail.title)
            }
          }
          else if (gestureState.dx > 100 && gestureState.dx < 500) {
            this.props.navigation.goBack();
          }
        }
        else {
          if (gestureState.dx < -25 && gestureState.dx > -500) {
            if (gestureState.dy > -40 && gestureState.dy < 50) {
              this._pressHandler(this.state.categoryNewsDetail[this.state.currentIndex].url, this.state.categoryNewsDetail.title)
            }
          }
          else if (gestureState.dx > 100 && gestureState.dx < 500) {
            this.props.navigation.goBack();
          }
        }
      }
    })

  }

  responseAllArticle = {
    success: (response) => {
      this.setState({ refreshing: false })
      if (this.state.foreGroundAPICall) {
        this.setState({ newStoryCount: response.data.length })
        let tempData = response.data;
        // this.state.categoryNewsDetail.unshift(tempData);
        console.log("FINALE DATA " + JSON.stringify(this.state.categoryNewsDetail));
        fullDataArray = [...tempData, ...fullDataArray];
        for (let index = 0; index < fullDataArray.length; index++) {
          fullDataArray = this.getUnique(fullDataArray, 'id')
        }
        AsyncStorage.setItem(globals.article_allnews_timeStamp, new Date());
        AsyncStorage.setItem(globals.all_news_async, JSON.stringify(fullDataArray));
        AsyncStorage.setItem(globals.globalVars.headerTitle, this.state.page.toString());


      } else {
        // this.setState({ categoryNewsDetail: response.data, loading: false })
        this.setState({ categoryNewsDetail: this.state.page === 1 ? response.data : [...this.state.categoryNewsDetail, ...response.data], loading: false })

        for (let index = 0; index < response.data.length; index++) {
          response.data[index].isLiked = false;
          response.data[index].isBookmarked = false;
        }
        console.log(TAG, "CATE ARTICLE S" + JSON.stringify(response));
        var dataApped = (this.state.page === 1) ? response.data : [...this.state.categoryNewsDetail, ...response.data]
        fullDataArray = dataApped;
        for (let index = 0; index < fullDataArray.length; index++) {
          fullDataArray = this.getUnique(fullDataArray, 'id')

        }

        AsyncStorage.setItem(globals.article_allnews_timeStamp, new Date());
        AsyncStorage.setItem(globals.all_news_async, JSON.stringify(fullDataArray));
        AsyncStorage.setItem(globals.globalVars.headerTitle, this.state.page.toString());

        // AsyncStorage.setItem(globals.article_tagwise_async + this.props.navigation.state.params.title, JSON.stringify(fullDataArray));

      }
      this.startAnimation()


    },
    error: (err) => {
      this.setState({ refreshing: false })
      AsyncStorage.getItem(globals.all_news_async, (err, result) => {
        if (result !== null) {
          this.setState({ isCached: true, loading: false })
          var responseData = JSON.parse(result);
          this.setState({ categoryNewsDetail: responseData, loading: false })
          this.startAnimation()
        }
        else {
          this.setState({ loading: false, isSeverError: true });
        }
      });
    },
    complete: () => {

    }
  }
  responseTagWiseArticle = {
    success: (response) => {
      this.setState({ refreshing: false })
      if (this.state.foreGroundAPICall) {
        this.setState({ newStoryCount: response.data.length })
        let tempData = response.data;
        // this.state.categoryNewsDetail.unshift(tempData);
        console.log("FINALE DATA " + JSON.stringify(this.state.categoryNewsDetail));
        fullDataArray = [...tempData, ...fullDataArray];
        for (let index = 0; index < fullDataArray.length; index++) {
          fullDataArray = this.getUnique(fullDataArray, 'id')

        }
        AsyncStorage.setItem(globals.article_tagwise_timeStamp + this.props.navigation.state.params.title, new Date());
        AsyncStorage.setItem(globals.article_tagwise_async + this.props.navigation.state.params.title, JSON.stringify(fullDataArray));
        AsyncStorage.setItem(globals.globalVars.headerTitle, this.state.page.toString());

      }
      else {
        this.setState({ categoryNewsDetail: this.state.page === 1 ? response.data : [...this.state.categoryNewsDetail, ...response.data], loading: false })
        for (let index = 0; index < response.data.length; index++) {
          response.data[index].isLiked = false;
          response.data[index].isBookmarked = false;
        }
        console.log(TAG, "CATE ARTICLE S" + JSON.stringify(response));
        var dataApped = (this.state.page === 1) ? response.data : [...this.state.categoryNewsDetail, ...response.data]
        fullDataArray = dataApped;
        for (let index = 0; index < fullDataArray.length; index++) {
          fullDataArray = this.getUnique(fullDataArray, 'id')
        }
        AsyncStorage.setItem(globals.article_tagwise_timeStamp + this.props.navigation.state.params.title, new Date());
        AsyncStorage.setItem(globals.globalVars.headerTitle, this.state.page.toString());
        AsyncStorage.setItem(globals.article_tagwise_async + this.props.navigation.state.params.title, JSON.stringify(fullDataArray));

      }
      this.startAnimation()
      // this.setState({ categoryNewsDetail: this.state.page === 1 ? response.data : [...this.state.categoryNewsDetail, ...response.data], loading: false })

      // for (let index = 0; index < response.data.length; index++) {
      //   response.data[index].isLiked = false;
      //   response.data[index].isBookmarked = false;
      // }
      // console.log(TAG, "CATE ARTICLE S" + JSON.stringify(response));
      // var dataApped = (this.state.page ===1) ? response.data : [...this.state.categoryNewsDetail, ...response.data]

      // AsyncStorage.setItem(globals.article_tagwise_timeStamp + this.props.navigation.state.params.title, new Date());
      // AsyncStorage.setItem(globals.globalVars.headerTitle, this.state.page.toString());

      // AsyncStorage.setItem(globals.article_tagwise_async + this.props.navigation.state.params.title, JSON.stringify(dataApped));

    },
    error: (err) => {
      this.setState({ refreshing: false })
      AsyncStorage.getItem(globals.article_tagwise_async + this.props.navigation.state.params.title, (err, result) => {
        if (result !== null) {
          this.setState({ isCached: true, loading: false })
          var responseData = JSON.parse(result);
          this.setState({ categoryNewsDetail: responseData, loading: false })
          this.startAnimation()
        } else {
          this.setState({ loading: false, isSeverError: true });
        }
      });
    },
    complete: () => {

    }
  }
  responseArticle = {
    success: (response) => {
      //console.log(TAG, "All Artilce" + JSON.stringify(response));
      this.setState({ categoryNewsDetail: response.data, loading: false })
    },
    error: (err) => {
      this.setState({ loading: false, isSeverError: true });
    },
    complete: () => {

    }
  }

  responseBookmarkArticle = {
    success: (response) => {
      this.setState({ refreshing: false })
      if (this.state.foreGroundAPICall) {
        // this.setState({newStoryCount: response.data.length})
        let tempData = response.data;
        // this.state.categoryNewsDetail.unshift(tempData);
        console.log("FINALE DATA " + JSON.stringify(this.state.categoryNewsDetail));
        fullDataArray = [...tempData, ...fullDataArray];
        for (let index = 0; index < fullDataArray.length; index++) {
          fullDataArray = this.getUnique(fullDataArray, 'id')
        }
        AsyncStorage.setItem(globals.article_bookmark_timeStamp, new Date());
        AsyncStorage.setItem(globals.bookmark_news_async, JSON.stringify(fullDataArray));
        AsyncStorage.setItem(globals.globalVars.headerTitle, '0');


      } else {
        this.setState({ refreshing: false })
        this.setState({ categoryNewsDetail: response.data, loading: false })
        AsyncStorage.setItem(globals.article_bookmark_timeStamp, new Date());
        AsyncStorage.setItem(globals.bookmark_news_async, JSON.stringify(response.data));
        AsyncStorage.setItem(globals.globalVars.headerTitle, '0');

      }

      this.startAnimation()

    },
    error: (err) => {
      this.setState({ refreshing: false })
      AsyncStorage.getItem(globals.bookmark_news_async, (err, result) => {
        if (result !== null) {
          console.log("Bookmark Async call 2");
          this.setState({ isCached: true, loading: false })
          var responseData = JSON.parse(result);
          this.setState({ categoryNewsDetail: responseData, loading: false })
          this.startAnimation()
        } else {
          this.setState({ loading: false, isSeverError: true });
        }
      });
    },
    complete: () => {

    }
  }

  refreshTokenResponseData = {
    success: () => {
      try {
        API.newsBookmarkArticles(this.responseBookmarkArticle, true);
      } catch (error) {
        //console.log('refreshTokenResponseData catch error ' + JSON.stringify(error));
      }
    },
    error: (err) => {
      //console.log('refreshTokenResponseData error ' + JSON.stringify(err));
    },
    complete: () => {
    }
  }

  getTimeIntervalAllNews() {
    AsyncStorage.getItem(globals.article_allnews_timeStamp, (err, result) => {
      if (result !== null) {
        var diffMins = globals.getTimeDifference(result);
        if (diffMins >= 1 && globals.isInternetConnected) {
          this.setState({ loading: true }, () => {
            if (this.animation != undefined) {
              this.animation.play();
            }
          })
          API.getAllNewsArticles(this.responseAllArticle, true, this.state.page);
        } else {
          AsyncStorage.getItem(globals.all_news_async, (err, result) => {
            if (result !== null) {
              // this.setState({ isCached: true })
              this.setState({ loading: true, isCached: true }, () => {
                if (this.animation != undefined) {
                  this.animation.play();
                }
              })
              setTimeout(() => {
                var responseData = JSON.parse(result);
                this.setState({ categoryNewsDetail: responseData, loading: false })
                this.startAnimation()
              }, 1000);
              
            }
          });
        }
      } else {
        if (globals.isInternetConnected) {
          this.setState({ loading: true }, () => {
            if (this.animation != undefined) {
              this.animation.play();
            }
          })
          API.getAllNewsArticles(this.responseAllArticle, true, this.state.page);
        } else {
          this.setState({ isCached: false })
        }
      }
    });
  }

  getTimeIntervalBookmark() {
    AsyncStorage.getItem(globals.article_bookmark_timeStamp, (err, result) => {
      if (result !== null) {
        console.log("Bookmark Async call");

        // var diffMins = globals.getTimeDifference(result);
        // if (diffMins >= 1 && globals.isInternetConnected) {
        this.setState({ loading: true }, () => {
          if (this.animation != undefined) {
            this.animation.play();
          }
        })
        //   API.getNewRefreshedToken(this.refreshTokenResponseData);
        // } else {
        AsyncStorage.getItem(globals.bookmark_news_async, (err, result) => {
          if (result !== null) {
            console.log("Bookmark Async call 2");
            this.setState({ isCached: true })
            var responseData = JSON.parse(result);
            this.setState({ categoryNewsDetail: responseData, loading: false })
          }
        });
        // }
      }
      else {
        console.log("Bookmark Async call not");
        this.setState({ isCached: false, loading: false })

        // if (globals.isInternetConnected) {
        //   this.setState({ loading: true },()=>{
        //     if (this.animation!=undefined) {
        //       this.animation.play();
        //     }
        //   })
        //   API.getNewRefreshedToken(this.refreshTokenResponseData);
        // } else {
        //   this.setState({isCached: false})
        // }
      }
    });
  }

  // getTimeIntervalBookmark() {
  //   AsyncStorage.getItem(globals.article_bookmark_timeStamp, (err, result) => {
  //     if (result !== null) {
  //       var diffMins = globals.getTimeDifference(result);
  //       if (diffMins >= 1 && globals.isInternetConnected) {
  //         this.setState({ loading: true },()=>{
  //           if (this.animation!=undefined) {
  //             this.animation.play();
  //           }
  //         })
  //         API.getNewRefreshedToken(this.refreshTokenResponseData);
  //       } else {
  //         AsyncStorage.getItem(globals.bookmark_news_async, (err, result) => {
  //           if (result !== null) {
  //             this.setState({ loading: false, isCached: true })
  //             var responseData = JSON.parse(result);
  //             this.setState({ categoryNewsDetail: responseData, loading: false })
  //           }
  //         });
  //       }
  //     } else {
  //       if (globals.isInternetConnected) {
  //         this.setState({ loading: true },()=>{
  //           if (this.animation!=undefined) {
  //             this.animation.play();
  //           }
  //         })
  //         API.getNewRefreshedToken(this.refreshTokenResponseData);
  //       } else {
  //         this.setState({isCached: false})
  //       }
  //     }
  //   });
  // }
  getTimeIntervalTagWise(isFrom, name) {
    AsyncStorage.getItem(globals.article_tagwise_timeStamp + name, (err, result) => {
      if (result !== null) {
        var diffMins = globals.getTimeDifference(result);
        if (diffMins >= 1 && globals.isInternetConnected) {
          this.setState({ loading: true }, () => {
            if (this.animation != undefined) {
              this.animation.play();
            }
          })
          // API.getNewRefreshedToken(this.refreshTokenResponseData);
          if (isFrom == 'category') {
            API.getArticalCategoryWise(this.responseTagWiseArticle, this.props.navigation.state.params.cat_id, globals.globalVars.userIdTemp_Global, true, this.state.page);
          } else {
             
            API.getArticalTagWise(this.responseTagWiseArticle, this.props.navigation.state.params.tagValue, globals.globalVars.userIdTemp_Global, true, this.state.page);
          }


        } else {
          AsyncStorage.getItem(globals.article_tagwise_async + name, (err, result) => {
            if (result !== null) {
              // this.setState({ isCached: true })
              this.setState({ loading: true, isCached: true }, () => {
                if (this.animation != undefined) {
                  this.animation.play();
                }
              })
              setTimeout(() => {
                var responseData = JSON.parse(result);
                this.startAnimation()
                this.setState({ categoryNewsDetail: responseData, loading: false })
              }, 1000);
              
            }
          });
        }
      } else {
        if (globals.isInternetConnected) {
          this.setState({ loading: true }, () => {
            if (this.animation != undefined) {
              this.animation.play();
            }
          })
          // API.getNewRefreshedToken(this.refreshTokenResponseData);
          if (isFrom == 'category') {
            API.getArticalCategoryWise(this.responseTagWiseArticle, this.props.navigation.state.params.cat_id, globals.globalVars.userIdTemp_Global, true, this.state.page);
          } else {
            API.getArticalTagWise(this.responseTagWiseArticle, this.props.navigation.state.params.tagValue, globals.globalVars.userIdTemp_Global, true, this.state.page);
          }


        } else {
          this.setState({ isCached: false })
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

  componentDidMount() {
    // this.setState({ categoryNewsDetail: dashboardNewsArticleData.RESPONSE.data, loading: false })
    startTime = new Date().getTime();
    console.log("TIMER startTime "+startTime);
    
    if (this.props.navigation.state.params.isFrom == 'tags') {
      if (this.props.navigation.state.params.title == 'All News') {
        this.getTimeIntervalAllNews()
        globals.globalVars.headerTitle = globals.capitalizeFirstLetter(this.props.navigation.state.params.title);
        this.setState({ headerTitle: globals.capitalizeFirstLetter(this.props.navigation.state.params.title) })
      }
      else if (this.props.navigation.state.params.title == 'Bookmarks') {
        if (globals.isInternetConnected) {
          console.log('CategoryBookmark net');
          this.setState({ loading: true }, () => {
            if (this.animation != undefined) {
              this.animation.play();
            }
          })
          API.getNewRefreshedToken(this.refreshTokenResponseData);
        }
        else {
          console.log('CategoryBookmark not net');
          AsyncStorage.getItem(globals.bookmark_news_async, (err, result) => {
            if (result !== null) {
              console.log("Bookmark Async call 2");
              // this.setState({ isCached: true })
              this.setState({ loading: true,isCached: true }, () => {
                if (this.animation != undefined) {
                  this.animation.play();
                }
              })
              setTimeout(() => {
                var responseData = JSON.parse(result);
                this.setState({ categoryNewsDetail: responseData, loading: false })
              }, 1000);
            }
          });
        }
        this.setState({ headerTitle: globals.capitalizeFirstLetter(this.props.navigation.state.params.title) })
        globals.globalVars.headerTitle = globals.capitalizeFirstLetter(this.props.navigation.state.params.title)
      }
      else {
        this.getTimeIntervalTagWise("tags", this.props.navigation.state.params.title)
        this.setState({ headerTitle: globals.capitalizeFirstLetter(this.props.navigation.state.params.title) })
        globals.globalVars.headerTitle = globals.capitalizeFirstLetter(this.props.navigation.state.params.title)

      }
    } else {
      this.getTimeIntervalTagWise("category", this.props.navigation.state.params.title)
      this.setState({ headerTitle: globals.capitalizeFirstLetter(this.props.navigation.state.params.title) })
      globals.globalVars.headerTitle = globals.capitalizeFirstLetter(this.props.navigation.state.params.title)

    }

    StatusBar.setHidden(false, "slide")

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

  static hideStatusBar() {
    if (Platform.OS == 'android') {
      StatusBar.setHidden(false, "slide")
    }

  }

  componentWillReceiveProps(nextProps) {
    this.setState({ themeStyle: nextProps.theme })
    //console.log("nextProps " + JSON.stringify(nextProps));

    if (nextProps.navigation.state.params.isFrom == 'tags') {
      this.setState({ headerTitle: globals.capitalizeFirstLetter(nextProps.navigation.state.params.title.substring(1)) })
    } else {
      this.setState({ headerTitle: globals.capitalizeFirstLetter(nextProps.navigation.state.params.title) })
    }
  }

  componentWillUnmount() {
    StatusBar.setHidden(false, 'none');

  }

  _pressHandler(url = "https://www.google.com", title) {
    if (Platform.OS === 'android') {
      this.setState({ modalVisibleWebView: true })
      StatusBar.setHidden(false, "slide")
      this.props.getShowAndroidModal(true, globals.screenTitle_CategoryNewsArticle, url, title)
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
        <Modal animationType='slide' visible={this.state.modalVisibleWebView} onRequestClose={() => { CategoryNewsArticle.handleCloseModalWebview() }}>
          <NewsArticleWebView setParentState={newState => this.setState(newState)} themeStyle={this.state.themeStyle} />
        </Modal>
      )
    }
    else {
    }

  }

  /**
  * Method for handle close modal webview
  */
  static handleCloseModalWebview() {
    _this.props.getShowModalSelectBankAccount(false)
    StatusBar.setHidden(true, "slide")
    _this.setState({
      modalVisibleWebView: false,
      isGalleryVisible: false,
      loading: false,
    })
  }

  _onPressButton() {
    if (this.state.isHeaderDisplay) {
      //console.log("PRESSS ONE");

      // StatusBar.setHidden(true, "slide")
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
      //console.log("PRESSS TWO");

      // StatusBar.setHidden(true, "slide")
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
    // //console.log("________-----______---_____-  " + JSON.stringify(_this.state.categoryNewsDetail) + (_this != null && _this.state.categoryNewsDetail != null));
    if (_this != null && item != null) {
      let customlink = ((item.url ? item.url : item.url))
      if (item.media.length > 0) {
        let branchUniversalObject = await branch.createBranchUniversalObject('news', {
          locallyIndex: true,
          title: this.state.categoryNewsDetail.title,
          contentDescription: this.state.categoryNewsDetail.summary,
          contentImageUrl: item.media[0].url,
          // contentMetadata: {
          //   ratingAverage: 4.2,
          //   customMetadata: {
          //     prop1: 'test',
          //     prop2: 'abc'
          //   }
          // }
        })

        let shareOptions = { messageHeader: '', messageBody: item.title + "\n\n" + "- via Clane App:" + "\n" }
        let linkProperties = { feature: 'share', channel: 'ClaneApp' }
        let controlParams = { $desktop_url: customlink, $ios_url: customlink, $android_url: customlink }
        //console.log("controlParams-------->" + JSON.stringify(controlParams))
        let { channel, completed, error } = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
      }
      else {
        let branchUniversalObject = await branch.createBranchUniversalObject('news', {
          locallyIndex: true,
          title: this.state.categoryNewsDetail.title,
          contentDescription: this.state.categoryNewsDetail.summary,
          // contentMetadata: {
          //   ratingAverage: 4.2,
          //   customMetadata: {
          //     prop1: 'test',
          //     prop2: 'abc'
          //   }
          // }
        })

        let shareOptions = { messageHeader: '', messageBody: item.title + "\n\n" + "- via Clane App:" + "\n" }
        let linkProperties = { feature: 'share', channel: 'ClaneApp' }
        let controlParams = { $desktop_url: customlink, $ios_url: customlink, $android_url: customlink }
        //console.log("controlParams-------->" + JSON.stringify(controlParams))
        let { channel, completed, error } = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
      }

    }
    firebase.analytics().logEvent(globals.event_Sharedanewsarticle,
      Object.assign({}, { EventDetails: item ? item.title : item.title }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

  }

  static callUserActionAPI() {
    console.log("callUserActionAPI ==> " + selectedItemType);

    if (selectedItemType == 'like') {
      API.newsArticlesAction(_this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, selectedItemForAction.id, 'like', true);

      if (selectedItemForAction.isLiked) {
        var event = { "key": globals.event_Unlike, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        _this.state.categoryNewsDetail.find(v => v.id == selectedItemForAction.id).isLiked = false;
        let like = selectedItemForAction.like - 1;
        if (like != 0) {
          _this.state.categoryNewsDetail.find(v => v.id == selectedItemForAction.id).like = like--;
        } else {
          _this.state.categoryNewsDetail.find(v => v.id == selectedItemForAction.id).like = '';
        }
      } else {
        var event = { "key": globals.event_Like, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        let like = 0
        if (selectedItemForAction.like != null) {
          like = selectedItemForAction.like + 1
        } else {
          like++;
        }

        _this.state.categoryNewsDetail.find(v => v.id == selectedItemForAction.id).isLiked = true;
        _this.state.categoryNewsDetail.find(v => v.id == selectedItemForAction.id).like = like;

      }
      if (_this.props.navigation.state.params.isFrom == 'tags') {
        if (_this.props.navigation.state.params.title == 'All News') {
          AsyncStorage.setItem(globals.all_news_async, JSON.stringify(_this.state.categoryNewsDetail), () => {
            _this.forceUpdate()
          });

        }
        else if (_this.props.navigation.state.params.title == 'Bookmarks') {
          AsyncStorage.setItem(globals.bookmark_news_async, JSON.stringify(_this.state.categoryNewsDetail), () => {
            _this.forceUpdate()
          });

        }
        else {
          AsyncStorage.setItem(globals.article_tagwise_async + _this.props.navigation.state.params.title, JSON.stringify(_this.state.categoryNewsDetail), () => {
            _this.forceUpdate()
          });

        }
      } else {
        AsyncStorage.setItem(globals.article_tagwise_async + _this.props.navigation.state.params.title, JSON.stringify(_this.state.categoryNewsDetail), () => {
          _this.forceUpdate()
        });
      }

      //console.log("btnLikePressed After" + JSON.stringify(item))


    } else if (selectedItemType == 'bookmark') {
      API.newsArticlesAction(_this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, selectedItemForAction.id, 'bookmark', true);
      if (selectedItemForAction.isBookmarked) {
        var event = { "key": globals.event_Bookmark, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);

        _this.state.categoryNewsDetail.find(v => v.id == selectedItemForAction.id).isBookmarked = false;
      }
      else {
        console.log("CATE BOOKMARK ==> " + selectedItemForAction.isBookmarked);

        var event = { "key": globals.event_Bookmarked, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        _this.state.categoryNewsDetail.find(v => v.id == selectedItemForAction.id).isBookmarked = true;
      }

      if (_this.props.navigation.state.params.isFrom == 'tags') {
        if (_this.props.navigation.state.params.title == 'All News') {
          AsyncStorage.setItem(globals.all_news_async, JSON.stringify(_this.state.categoryNewsDetail), () => {
            _this.forceUpdate()
          });

        }
        else if (_this.props.navigation.state.params.title == 'Bookmarks') {
          AsyncStorage.setItem(globals.bookmark_news_async, JSON.stringify(_this.state.categoryNewsDetail), () => {
            _this.forceUpdate()
          });

        }
        else {
          AsyncStorage.setItem(globals.article_tagwise_async + _this.props.navigation.state.params.title, JSON.stringify(_this.state.categoryNewsDetail), () => {
            _this.forceUpdate()
          });

        }
      } else {
        AsyncStorage.setItem(globals.article_tagwise_async + _this.props.navigation.state.params.title, JSON.stringify(_this.state.categoryNewsDetail), () => {
          _this.forceUpdate()
        });
      }



    }
  }

  btnBookmarkPressed(item) {
    selectedItemForAction = item;
    selectedItemType = 'bookmark';

    if (globals.isLoggedIn == 'false') {
      this.checkLogin();
      globals.globalVars.dashboardTitle = globals.screenTitle_CategoryNewsArticle
    }
    else {
      if (globals.isInternetConnected) {
        API.newsArticlesAction(this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, item.id, 'bookmark', true);
      } else {
        bookmarkData.push({ id: item.id, action: 'bookmark', userId: globals.globalVars.userId_Global });
        AsyncStorage.setItem(globals.local_bookmark_async, JSON.stringify(bookmarkData));

      }
      if (item.isBookmarked) {
        var event = { "key": globals.event_Bookmark, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);

        this.state.categoryNewsDetail.find(v => v.id == item.id).isBookmarked = false;
      } else {
        var event = { "key": globals.event_Bookmarked, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        this.state.categoryNewsDetail.find(v => v.id == item.id).isBookmarked = true;
      }

      if (this.props.navigation.state.params.isFrom == 'tags') {
        if (this.props.navigation.state.params.title == 'All News') {
          AsyncStorage.setItem(globals.all_news_async, JSON.stringify(this.state.categoryNewsDetail));

        }
        else if (this.props.navigation.state.params.title == 'Bookmarks') {
          AsyncStorage.setItem(globals.bookmark_news_async, JSON.stringify(this.state.categoryNewsDetail));

        }
        else {
          AsyncStorage.setItem(globals.article_tagwise_async + this.props.navigation.state.params.title, JSON.stringify(this.state.categoryNewsDetail));

        }
      } else {
        AsyncStorage.setItem(globals.article_tagwise_async + this.props.navigation.state.params.title, JSON.stringify(this.state.categoryNewsDetail));
      }

      this.forceUpdate()
      //  (this.state.isBookmarked) ? this.setState({ isBookmarked: false }) : this.setState({ isBookmarked: true })
    }
  }

  btnLikePressed(item) {

    selectedItemForAction = item;
    selectedItemType = 'like';

    if (globals.isLoggedIn == 'false') {
      this.checkLogin();
      globals.globalVars.dashboardTitle = globals.screenTitle_CategoryNewsArticle
    }
    else {
      //console.log("btnLikePressed Before" + JSON.stringify(item))
      if (globals.isInternetConnected) {
        API.newsArticlesAction(this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, item.id, 'like', true);
      } else {
        likeData.push({ id: item.id, action: 'like', userId: globals.globalVars.userId_Global });
        AsyncStorage.setItem(globals.local_like_async, JSON.stringify(likeData));

      }
      if (item.isLiked) {
        var event = { "key": globals.event_Unlike, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        this.state.categoryNewsDetail.find(v => v.id == item.id).isLiked = false;
        let like = item.like - 1;
        if (like != 0) {
          this.state.categoryNewsDetail.find(v => v.id == item.id).like = like--;
        } else {
          this.state.categoryNewsDetail.find(v => v.id == item.id).like = '';
        }
      } else {
        var event = { "key": globals.event_Like, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        let like = 0
        if (item.like != null) {
          like = item.like + 1
        } else {
          like++;
        }

        this.state.categoryNewsDetail.find(v => v.id == item.id).isLiked = true;
        this.state.categoryNewsDetail.find(v => v.id == item.id).like = like;

      }
      if (this.props.navigation.state.params.isFrom == 'tags') {
        if (this.props.navigation.state.params.title == 'All News') {
          AsyncStorage.setItem(globals.all_news_async, JSON.stringify(this.state.categoryNewsDetail));

        }
        else if (this.props.navigation.state.params.title == 'Bookmarks') {
          AsyncStorage.setItem(globals.bookmark_news_async, JSON.stringify(this.state.categoryNewsDetail));

        }
        else {
          AsyncStorage.setItem(globals.article_tagwise_async + this.props.navigation.state.params.title, JSON.stringify(this.state.categoryNewsDetail));

        }
      } else {
        AsyncStorage.setItem(globals.article_tagwise_async + this.props.navigation.state.params.title, JSON.stringify(this.state.categoryNewsDetail));
      }

      //console.log("btnLikePressed After" + JSON.stringify(item))
      this.forceUpdate()
      //(this.state.isLiked) ? this.setState({ isLiked: false }) : this.setState({ isLiked: true })
    }
  }

  /**
  * Method for check user already login or not
  */
  checkLogin() {
    this.props.navigation.navigate("ModalNavigator")
  }


  setTextData() {
    var data = globals.checkTimeStamp(this.state.categoryNewsDetail.published_date);

    if (data == '1') {
      return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>
        {"Swipe left to read more at "}
        {this.state.categoryNewsDetail ? this.state.categoryNewsDetail.news_source.name : this.state.categoryNewsDetail.news_source.name} - {"Today"} </Text>)

    }
    else if (data == '0') {
      return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>
        {"Swipe left to read more at "}
        {this.state.categoryNewsDetail ? this.state.categoryNewsDetail.news_source.name : this.state.categoryNewsDetail.news_source.name} - {'Yesterday'} </Text>)

    }
    else if (data == '2') {
      return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>
        {"Swipe left to read more at "}
        {this.state.categoryNewsDetail ? this.state.categoryNewsDetail.news_source.name : this.state.categoryNewsDetail.news_source.name} - {moment(this.state.categoryNewsDetail ? this.state.categoryNewsDetail.published_date : this.state.categoryNewsDetail.published_date).format('MM/DD/YY')} </Text>)

    }
  }

  goToCategoryNewsArticleDetailScreen(item) {
    this.props.navigation.navigate('CategoryNewsArticle', { title: item.name, categoryNewsDetail: this.state.categoryNewsDetail, theme: this.props.theme })
  }

  renderTags(item) {
    return (
      <TouchableWithoutFeedback onPress={() => this.goToCategoryNewsArticleDetailScreen(item)}>
        <View style={[styles.tagBG, { flexDirection: 'row', backgroundColor: colors.blue }]}>
          <Text style={[styles.toastText, { color: colors.white }]}>
            <Text  >{item.name}
            </Text>
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  onSwipeDown(gestureState) {
    this.setState({ currentIndex: this.state.categoryNewsDetail.length - 1 }, () => { (Platform.OS == 'ios') ? this.renderArticleDetails() : this.renderArticleDetails() })
  }

  goToCategoryScreen() {
    firebase.analytics().logEvent(globals.event_CategoryScreen,
      Object.assign({}, { EventDetails: 'Navigate to Category screen' }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
    var event = { "key": globals.event_CategoryScreen, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
    Countly.recordEvent(event);
    this.props.navigation.navigate('Category')
  }

  // onSwipeDown(gestureState) {
  //     this.setState({ currentIndex: this.state.dashboardNewsDetailData.length - 1 }, () => this.renderArticlesDummy())
  // }

  callGalleryView(item) {
    if (Platform.OS == 'android') {
      StatusBar.setHidden(false, 'slide')
    }

    this.setState({ isGalleryVisible: true }, () => {
      this.openGalleryModal(item)
    })
  }

  openGalleryModal(item) {
    // //console.log("CLICK DATA "+JSON.stringify(item));
    let gallery = JSON.stringify(item)
    this.props.getShowModalSelectBankAccount(true, globals.screenTitle_CategoryNewsArticle, "", "", item)
    return (
      <Modal animationType='slide' visible={this.state.isGalleryVisible} onRequestClose={() => { CategoryNewsArticle.handleCloseModalWebview() }}>
        <GalleryImage setParentState={newState => this.setState(newState)} />
      </Modal>
    )
  }

  setTextData(item) {
    var data = globals.convertTimestamp(item.published_date);

    if (data == '1') {
      return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>
        {"Swipe left to read more at "}
        {item.source} - {"Today"} </Text>)
    }
    else if (data == '0') {
      return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>
        {"Swipe left to read more at "}
        {item.source} - {'Yesterday'} </Text>)

    }
    else if (data == '2') {
      return (<Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>
        {"Swipe left to read more at "}
        {item.source} - {moment(item.published_date).format('MM/DD/YY')} </Text>)
    }
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
  callFirstArticle() {
    this.setState({ foreGroundAPICall: false }, () => {
      this.setState({ categoryNewsDetail: fullDataArray }, () => {
        this.setState({ currentIndex: 0 }, () => {
          this.forceUpdate()
        })
      })

    })

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

  renderToast() {
    return (

      <View style={[styles.tagBG,]}>
        <TouchableOpacity onPress={() => this.callFirstArticle()}>
          <Text style={{ color: colors.white, alignSelf: 'center' }}> &uarr; {this.state.newStoryCount}{' new stories'}</Text>
        </TouchableOpacity>
      </View>

    )
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

          // <CacheableImage style={[styles.newsDetailTopImageView,]} source={{ uri: encodeURI(item.media[0].url) }} permanent={true} />
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

  renderCategoryView(articles){
    let categories = articles.categories;
    if(articles && articles.categories && articles.categories.length > 0){
      return(
        <TouchableWithoutFeedback>
          <View style={styles.categoryView}>
            <Text style={styles.categoryTextName}>{categories[0].name ? categories[0].name != '' && categories[0].name != undefined && categories[0].name != null ? categories[0].name : null : null}</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
  }

  static callBackgroundAPICall() {
    // console.log("callBackgroundAPICall--> "+_this.state.page + " "+ _this.props.navigation.state.params.title );
    let responseData = null;
    if (globals.globalVars.headerTitle != '') {
      AsyncStorage.getItem(globals.globalVars.headerTitle, (err, result) => {
        if (result !== null) {

          responseData = JSON.parse(result);
          console.log("callBackgroundAPICall-->  " + responseData);
          _this.setState({ foreGroundAPICall: true }, () => {
            // _this.forceUpdate()
          })
          if (_this.state.isFrom == 'tags') {
            if (_this.state.headerTitle == 'All News') {
              console.log("callBackgroundAPICall--> All news ");
              _this.setState({ page: responseData + 1 }, () => {
                API.getAllNewsArticles(_this.responseAllArticle, true, _this.state.page);
              })
            } else if (_this.state.headerTitle == 'Bookmarks') {
              API.getNewRefreshedToken(_this.refreshTokenResponseData);
            }
            else {
              console.log("callBackgroundAPICall--> All tags ");
              // this.getTimeIntervalTagWise("tags", this.props.navigation.state.params.title)
              // this.setState({ headerTitle: globals.capitalizeFirstLetter(this.props.navigation.state.params.title) })
              // globals.globalVars.headerTitle = globals.capitalizeFirstLetter(this.props.navigation.state.params.title)
      
            }
          } else {
            _this.setState({ page: responseData + 1 }, () => {
              API.getArticalCategoryWise(_this.responseTagWiseArticle, _this.props.navigation.state.params.cat_id, globals.globalVars.userIdTemp_Global, true, _this.state.page);
            })

            // _this.getTimeIntervalTagWise("category", _this.props.navigation.state.params.title)
            console.log("callBackgroundAPICall--> All category ");
          }
        }

      });


    }

  }

  renderArticleDetails = () => {
    ARTICLES = this.state.categoryNewsDetail;
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
          <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', }}>
            {/* <Text style={[styles.noMoreArticles, { fontSize: 25 }]}>Great!!! </Text> */}
            <Text style={[styles.noMoreArticles, { paddingHorizontal: 5, textAlign: 'center' }]}>{'There are no any articles available for ' + this.state.headerTitle + ' category'}</Text>
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
                      <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitle}>{this.state.headerTitle}</Text>
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
                          <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitleText}>{this.state.headerTitle}</Text>
                        </View>
                        <TouchableOpacity style={styles.headerRightImageView} onPress={() => this.goToCategoryScreen()}>
                          <Image style={[styles.headerRightIcon]} resizeMode={'contain'} source={dashboard.searchmenu} />
                        </TouchableOpacity>

                      </View>
                    </Animated.View>

                    <TouchableOpacity onPress={() => this._pressHandler(this.state.categoryNewsDetail[this.state.currentIndex].url, this.state.categoryNewsDetail.title)}>
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
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitleText}>{this.state.headerTitle}</Text>
                      </View>
                      <TouchableOpacity style={styles.headerRightImageView} onPress={() => this.goToCategoryScreen()}>
                        <Image style={[styles.headerRightIcon]} resizeMode={'contain'} source={dashboard.searchmenu} />
                      </TouchableOpacity>

                    </View>
                  </Animated.View>

                  <TouchableOpacity onPress={() => this._pressHandler(this.state.categoryNewsDetail[this.state.currentIndex].url, this.state.categoryNewsDetail.title)}>
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

                      <TouchableOpacity onPress={() => this._pressHandler(this.state.categoryNewsDetail[this.state.currentIndex].url, this.state.categoryNewsDetail.title)}>
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



  /**
   * Method for render articles on swipe up and down using react native animated
   */
  renderArticles = () => {
    //let ARTICLES = this.state.dashboardNewsDetailData
    return this.state.categoryNewsDetail.map((item, i) => {

      if (i == this.state.currentIndex - 1) {
        //console.log("if" + this.state.currentIndex)
        if (this.state.currentIndex == this.state.categoryNewsDetail.length) {
          return (
            <GestureRecognizer
              style={{ flex: 1, }}
              onSwipeDown={(state) => this.onSwipeDown(state)}>
              <View style={{ backgroundColor: colors.blue, padding: 10, flexDirection: 'row' }}>
                <TouchableOpacity style={{ justifyContent: 'flex-start' }} onPress={() => this.props.navigation.goBack(null)}>
                  <Ionicons name="ios-arrow-back" size={30} color={colors.white} />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitle}>{this.state.headerTitle}</Text>
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
            </GestureRecognizer>
          )
        }
        else {
          return (
            <Animated.View key={item.id} style={this.swipedCardPosition.getLayout()}
              {...this.PanResponder.panHandlers}
            >
              <View style={[globalStyles.safeviewStyle, { backgroundColor: colors.white, height: SCREEN_HEIGHT, width: SCREEN_WIDTH, position: 'absolute' }]}>
                {this.openModal()}
                {/* {this.openGalleryModal()} */}

                <View style={[styles.searchScreenItemLeftView]}>
                  {/* <ScrollView style={{ flex: 1 }} bounces={false} contentContainerStyle={{ flex: 1 }}> */}

                  {/* <TouchableWithoutFeedback> */}
                  {/* <View> */}
                  <View style={[styles.rescentSeachTextView, { backgroundColor: colors.white }]}>
                    {/* <TouchableWithoutFeedback onLongPress={() => this.callGalleryView(this.state.categoryNewsDetail[i])}> */}
                    <View style={[styles.newsDetailTopImage]}>
                      {this.state.categoryNewsDetail && <CacheableImage style={[styles.newsDetailTopImageView,]} source={{ uri: this.state.categoryNewsDetail ? encodeURI(this.state.categoryNewsDetail[i].media[0].url) : encodeURI(this.state.categoryNewsDetail[i].media[0].url) }} permanent={true} />}

                    </View>
                    {/* </TouchableWithoutFeedback> */}
                    <View style={{ flex: 1, backgroundColor: colors.white }}>
                      <Text style={[styles.newsArticleDetailTitle, { color: colors.articleNewsTitle }]}>{this.state.categoryNewsDetail ? this.state.categoryNewsDetail[i].title : this.state.categoryNewsDetail[i].title}</Text>
                      {(this.state.categoryNewsDetail != null) ?
                        <Text style={[styles.summaryText, { lineHeight: (globals.iPhoneX) ? WINDOW.height * 0.028 : WINDOW.height * 0.0315 }, { color: colors.newsDetailSummaryLight }]}>{this.state.categoryNewsDetail[i].summary} </Text>
                        : null}

                      <Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>{this.state.categoryNewsDetail[i].source + " - " + moment(this.state.categoryNewsDetail[i].published_date).format('MMM DD, YYYY')}</Text>

                      {/* <View style={{ flex: 1, marginLeft: 15, marginTop: 10, flexDirection: 'row' }}>
                                                <FlatList
                                                    ref={"myFlatList"}
                                                    data={this.state.categoryNewsDetail[this.state.currentIndex].tags}
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

                  <Animated.View style={[{ position: 'absolute', display: (this.state.bottomVisible) ? "flex" : "none", paddingBottom: (Platform.OS == 'android') ? 5 : (DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'iPhone') ? 20 : 5, bottom: 0, width: globals.WINDOW.width, backgroundColor: colors.newsDetailShareBGLight }]}>
                    <View style={[styles.newsDetailSepView, { backgroundColor: colors.newsDetailSepViewLight }]} ></View>
                    <View style={{ width: '100%', flexDirection: 'row' }}>

                      <View style={styles.footermainView}>
                        <TouchableOpacity onPress={() => this.btnLikePressed(item)}>
                          {
                            <View style={styles.footerInnterView}>
                              <View style={[styles.footerInnterView, { flexDirection: 'row' }]}>
                                <Image source={(this.state.categoryNewsDetail[i].isLiked) ? dashboard.liked : dashboard.whiteLike} style={[styles.footerIconView, { marginRight: 2 }]} />
                                {
                                  // (this.state.totalLikes != 0) ? 
                                  <Text style={styles.bottomButtonText} numberOfLines={1}>{(this.state.categoryNewsDetail[i].isLiked) ? this.state.categoryNewsDetail[i].like : null}</Text>
                                  // : null
                                }
                              </View>
                              <Text style={styles.bottomButtonText}>{(this.state.categoryNewsDetail[i].isLiked) ? "Unlike" : "Like"}</Text>
                            </View>

                          }
                        </TouchableOpacity>
                      </View>
                      <View style={styles.footermainView}>
                        <TouchableOpacity onPress={() => this.btnBookmarkPressed(item)}>
                          {
                            <View style={styles.footerInnterView}>
                              <Image source={(this.state.categoryNewsDetail[i].isBookmarked) ? dashboard.bookmark : dashboard.whiteBookmark} style={[styles.footerIconView]} />
                              <Text style={styles.bottomButtonText}>{(this.state.categoryNewsDetail[i].isBookmarked) ? "Bookmarked" : "Bookmark"}</Text>
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

            </Animated.View>
          )
        }

      }
      else if (i < this.state.currentIndex) {
        //console.log("else if")
        return null
      }
      if (i == this.state.currentIndex) {
        //console.log("else if - if")

        return (

          <Animated.View key={item.id} style={this.position.getLayout()}
            {...this.PanResponder.panHandlers}
          >
            <View style={[globalStyles.safeviewStyle, { position: 'absolute', backgroundColor: colors.white, height: SCREEN_HEIGHT, width: SCREEN_WIDTH }]}>
              {this.openModal()}
              {/* {this.openGalleryModal()} */}


              <View style={[styles.searchScreenItemLeftView]}>
                {/* <ScrollView style={{ flex: 1 }} bounces={false} contentContainerStyle={{ flex: 1 }}> */}

                {/* <View> */}
                {/* <TouchableOpacity> */}
                <View style={[styles.rescentSeachTextView, { backgroundColor: colors.white }]}>
                  {/* <TouchableWithoutFeedback onLongPress={() => this.callGalleryView(this.state.categoryNewsDetail[i])}> */}

                  <View style={[styles.newsDetailTopImage]}>
                    {this.state.categoryNewsDetail && <CacheableImage style={[styles.newsDetailTopImageView,]} source={{ uri: this.state.categoryNewsDetail ? encodeURI(this.state.categoryNewsDetail[i].media[0].url) : encodeURI(this.state.categoryNewsDetail[i].media[0].url) }} permanent={true} />}

                  </View>
                  {/* </TouchableWithoutFeedback> */}
                  <View style={{ flex: 1, backgroundColor: colors.white }}>
                    <Text style={[styles.newsArticleDetailTitle, { color: colors.articleNewsTitle }]}>{this.state.categoryNewsDetail ? this.state.categoryNewsDetail[i].title : this.state.categoryNewsDetail[i].title}</Text>
                    {(this.state.categoryNewsDetail != null) ?
                      <Text style={[styles.summaryText, { lineHeight: (globals.iPhoneX) ? WINDOW.height * 0.028 : WINDOW.height * 0.0315 }, { color: colors.newsDetailSummaryLight }]}>{this.state.categoryNewsDetail[i].summary} </Text>
                      : null}

                    <Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>{this.state.categoryNewsDetail[i].source + " - " + moment(this.state.categoryNewsDetail[i].published_date).format('MMM DD, YYYY')}</Text>
                    {/* <View style={{ flex: 1, marginLeft: 15, marginTop: 10, flexDirection: 'row' }}>
                                            <FlatList
                                                ref={"myFlatList"}
                                                data={this.state.categoryNewsDetail[this.state.currentIndex].tags}
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

                {(this.state.bottomVisible) ? <Animated.View style={[{ position: 'absolute', display: (this.state.bottomVisible) ? "flex" : "none", paddingBottom: (Platform.OS == 'android') ? 5 : (DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'iPhone') ? 20 : 5, bottom: this.tabbarTop, width: globals.WINDOW.width, backgroundColor: colors.newsDetailShareBGLight }]}>
                  <View style={[styles.newsDetailSepView, { backgroundColor: colors.newsDetailSepViewLight }]} ></View>
                  <View style={{ width: '100%', flexDirection: 'row' }}>

                    <View style={styles.footermainView}>
                      <TouchableOpacity onPress={() => this.btnLikePressed(item)}>
                        {
                          <View style={styles.footerInnterView}>
                            <View style={[styles.footerInnterView, { flexDirection: 'row' }]}>
                              <Image source={(this.state.categoryNewsDetail[i].isLiked) ? dashboard.liked : dashboard.whiteLike} style={[styles.footerIconView, { marginRight: 2 }]} />
                              {
                                // (this.state.totalLikes != 0) ? 
                                <Text style={styles.bottomButtonText} numberOfLines={1}>{(this.state.categoryNewsDetail[i].isLiked) ? this.state.categoryNewsDetail[i].like : null}</Text>
                                // : null
                              }
                            </View>
                            <Text style={styles.bottomButtonText}>{(this.state.categoryNewsDetail[i].isLiked) ? "Unlike" : "Like"}</Text>
                          </View>

                        }
                      </TouchableOpacity>
                    </View>
                    <View style={styles.footermainView}>
                      <TouchableOpacity onPress={() => this.btnBookmarkPressed(item)}>
                        {
                          <View style={styles.footerInnterView}>
                            <Image source={(this.state.categoryNewsDetail[i].isBookmarked) ? dashboard.bookmark : dashboard.whiteBookmark} style={[styles.footerIconView]} />
                            <Text style={styles.bottomButtonText}>{(this.state.categoryNewsDetail[i].isBookmarked) ? "Bookmarked" : "Bookmark"}</Text>
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
        //console.log("else if -else : " + this.state.currentIndex + "i--> : " + i)
        if (this.state.currentIndex == 0 && this.state.isReverse) {
          return null
        }
        else {
          return (
            <Animated.View key={item.id}>
              <View style={[globalStyles.safeviewStyle, { position: 'absolute', backgroundColor: colors.white, height: SCREEN_HEIGHT, width: SCREEN_WIDTH }]}>
                {this.openModal()}
                {/* {this.openGalleryModal()} */}


                <View style={[styles.searchScreenItemLeftView]}>
                  {/* <ScrollView style={{ flex: 1 }} bounces={false} contentContainerStyle={{ flex: 1 }}> */}

                  {/* <View> */}
                  {/* <TouchableOpacity> */}
                  <View style={[styles.rescentSeachTextView, { backgroundColor: colors.white }]}>
                    {/* <TouchableWithoutFeedback onLongPress={() => this.callGalleryView(this.state.categoryNewsDetail[i])}> */}

                    <View style={[styles.newsDetailTopImage]}>
                      {this.state.categoryNewsDetail && <CacheableImage style={[styles.newsDetailTopImageView,]} source={{ uri: this.state.categoryNewsDetail ? encodeURI(this.state.categoryNewsDetail[i].media[0].url) : encodeURI(this.state.categoryNewsDetail[i].media[0].url) }} permanent={true} />}

                    </View>
                    {/* </TouchableWithoutFeedback> */}
                    <View style={{ flex: 1, backgroundColor: colors.white }}>
                      <Text style={[styles.newsArticleDetailTitle, { color: colors.articleNewsTitle }]}>{this.state.categoryNewsDetail ? this.state.categoryNewsDetail[i].title : this.state.categoryNewsDetail[i].title}</Text>
                      {(this.state.categoryNewsDetail != null) ?
                        <Text style={[styles.summaryText, { lineHeight: (globals.iPhoneX) ? WINDOW.height * 0.028 : WINDOW.height * 0.0315 }, { color: colors.newsDetailSummaryLight }]}>{this.state.categoryNewsDetail[i].summary} </Text>
                        : null}

                      <Text style={[styles.newsArticleDetailDate, { color: colors.newsDetailDate }]}>{this.state.categoryNewsDetail[i].source + " - " + moment(this.state.categoryNewsDetail[i].published_date).format('MMM DD, YYYY')}</Text>
                      {/* <View style={{ flex: 1, marginLeft: 15, marginTop: 10, flexDirection: 'row' }}>
                                                <FlatList
                                                    ref={"myFlatList"}
                                                    data={this.state.categoryNewsDetail[this.state.currentIndex].tags}
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
                        <Image style={styles.headerRightIcon} resizeMode={'contain'} source={dashboard.searchmenu} />
                      </TouchableOpacity>

                    </View>
                  </Animated.View>

                  <Animated.View style={[{ position: 'absolute', display: (this.state.bottomVisible) ? "flex" : "none", paddingBottom: (Platform.OS == 'android') ? 5 : (DeviceInfo.getModel() == 'iPhone X' || DeviceInfo.getModel() == 'iPhone') ? 20 : 5, bottom: this.tabbarTop, width: globals.WINDOW.width, backgroundColor: colors.newsDetailShareBGLight }]}>
                    <View style={[styles.newsDetailSepView, { backgroundColor: colors.newsDetailSepViewLight }]} ></View>
                    <View style={{ width: '100%', flexDirection: 'row' }}>

                      <View style={styles.footermainView}>
                        <TouchableOpacity onPress={() => this.btnLikePressed(item)}>
                          {
                            <View style={styles.footerInnterView}>
                              <View style={[styles.footerInnterView, { flexDirection: 'row' }]}>
                                <Image source={(this.state.categoryNewsDetail[i].isLiked) ? dashboard.liked : dashboard.whiteLike} style={[styles.footerIconView, { marginRight: 2 }]} />
                                {
                                  // (this.state.totalLikes != 0) ? 
                                  <Text style={styles.bottomButtonText} numberOfLines={1}>{(this.state.categoryNewsDetail[i].isLiked) ? this.state.categoryNewsDetail[i].like : null}</Text>
                                  // : null
                                }
                              </View>
                              <Text style={styles.bottomButtonText}>{(this.state.categoryNewsDetail[i].isLiked) ? "Unlike" : "Like"}</Text>
                            </View>

                          }
                        </TouchableOpacity>
                      </View>
                      <View style={styles.footermainView}>
                        <TouchableOpacity onPress={() => this.btnBookmarkPressed(item)}>
                          {
                            <View style={styles.footerInnterView}>
                              <Image source={(this.state.categoryNewsDetail[i].isBookmarked) ? dashboard.bookmark : dashboard.whiteBookmark} style={[styles.footerIconView]} />
                              <Text style={styles.bottomButtonText}>{(this.state.categoryNewsDetail[i].isBookmarked) ? "Bookmarked" : "Bookmark"}</Text>
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
            </Animated.View>
          )
        }


      }
    }).reverse()
  }

  btnTryAgainPressed() {

    if (globals.isInternetConnected) {
      this.setState({ loading: true })
      if (this.state.loading) {
        this.animation.play();
      }
      if (this.props.navigation.state.params.isFrom == 'tags') {

        if (this.props.navigation.state.params.title == 'All News') {
          this.getTimeIntervalAllNews()
          // API.getAllNewsArticles(this.responseArticle, true);
          this.setState({ headerTitle: globals.capitalizeFirstLetter(this.props.navigation.state.params.title) })
        }
        else if (this.props.navigation.state.params.title == 'Bookmarks') {
          // API.newsBookmarkArticles(this.responseArticle, true);
          this.getTimeIntervalBookmark()
          // API.getNewRefreshedToken(this.refreshTokenResponseData);
          this.setState({ headerTitle: globals.capitalizeFirstLetter(this.props.navigation.state.params.title) })
        }
        else {
          this.getTimeIntervalTagWise("tags", this.props.navigation.state.params.title)
          // API.getArticalTagWise(this.responseArticle, this.props.navigation.state.params.tagValue, globals.globalVars.userIdTemp_Global, true);
          this.setState({ headerTitle: globals.capitalizeFirstLetter(this.props.navigation.state.params.title) })
        }
      } else {
        this.getTimeIntervalTagWise("category", this.props.navigation.state.params.title)
        // API.getArticalCategoryWise(this.responseArticle, this.props.navigation.state.params.cat_id, globals.globalVars.userIdTemp_Global, true);
        this.setState({ headerTitle: globals.capitalizeFirstLetter(this.props.navigation.state.params.title) })
      }
    }
  }

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

  openClaneModal() {
    return (
      <Modal animationType='none' visible={this.state.loading} onRequestClose={() => { CategoryNewsArticle.handleCloseModalWebview() }}>
        <ClaneBlueLoader setParentState={newState => this.setState(newState)} />
      </Modal>
    )
  }

  /**
  * method for set timeout for hold text for 3 seconds
  */
  timeOutHoldTextStatusChange() {
    setTimeout(() => { this.setState({ renderHoldText: true }) }, 500)
  }

  render() {

    if (globals.isInternetConnected && this.state.isSeverError) {
      return (
        <Fragment>
          <SafeAreaView style={{ flex: 0, backgroundColor: colors.blue }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} >
            <View style={{ backgroundColor: colors.blue, padding: 10, flexDirection: 'row' }}>
              <TouchableOpacity style={{ justifyContent: 'flex-start' }} onPress={() => this.props.navigation.goBack(null)}>
                <Ionicons name="ios-arrow-back" size={30} color={colors.white} />
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitle}>{this.state.headerTitle}</Text>
              </View>
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
    else if (!globals.isInternetConnected && !this.state.isCached) {
      return (
        <Fragment>
          <SafeAreaView style={{ flex: 0, backgroundColor: colors.blue }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} >
            <View style={{ backgroundColor: colors.blue, padding: 10, flexDirection: 'row' }}>
              <TouchableOpacity style={{ justifyContent: 'flex-start' }} onPress={() => this.props.navigation.goBack(null)}>
                <Ionicons name="ios-arrow-back" size={30} color={colors.white} />
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitle}>{this.state.headerTitle}</Text>
              </View>

            </View>
            <View style={[styles.watchlistFooterMain, { marginBottom: 44, backgroundColor: colors.white }]}>
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



    return (
      <View style={{ flex: 1 }}>
        {(this.state.loading) ? this.openClaneModal() : this.renderArticleDetails()}
        {(this.state.foreGroundAPICall && this.state.newStoryCount > 0) ? this.renderToast() : null}
        {(this.state.refreshing) ?  <ScrollView style={{paddingTop: 30}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
              tintColor={colors.blue}
            // tintColor= {(this.props.marketStatus) ? colors.blue : colors.white}
            // titleColor ={'blue'}
            // title={'Loading new stories'}
            />
          }
        /> : null}
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
  getShowAndroidModal,
  getShowModalSelectBankAccount
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(CategoryNewsArticle);

