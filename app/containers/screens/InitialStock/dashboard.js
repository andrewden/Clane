import React, { Component } from 'react';
import { SafeAreaView, Text, AsyncStorage, Image, ActivityIndicator, TouchableOpacity, View, ImageBackground, Modal, TouchableWithoutFeedback, Platform, StatusBar, Dimensions } from 'react-native';
import globalStyles from '../../../assets/styles/globalStyles';
import bgMakretImg from '../../../assets/images/dashboard/bg-market.png'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions, StackActions } from 'react-navigation';
import Countly from 'countly-sdk-react-native';
import DeviceInfo from 'react-native-device-info';
import * as globals from '../../../lib/globals';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getshowModal } from '../../../redux/actions/showModal';
import { getshowLoader } from "../../../redux/actions/showLoaderModal";
import { dashboard, stock, register, bvn_verification } from '../../../assets/images/map'
import Feather from 'react-native-vector-icons/Feather';
import { API } from '../../../lib/api';
import dark_theme from '../Stocks/darkTheme';
import light_theme from '../Stocks/lightTheme';
import { changeTheme } from '../../../redux/actions/changeTheme';
import { changeTabColor } from '../../../redux/actions/changeTabColorModel';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import ClaneLoader from '../../../components/ClaneLoader/index'
import dashboardMarketRes from './dashboardMarketRes';
import dashboardNewsRes from './dashboardNewsRes';
import * as colors from '../../../assets/styles/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackgroundTimer from 'react-native-background-timer';
import imageCacheHoc from 'react-native-image-cache-hoc';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob'
import firebase from 'react-native-firebase';
import branch, { BranchEvent } from 'react-native-branch'
import SafariView from 'react-native-safari-view';
import { RemoteMessage } from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';
import ClaneBlueLoader from './claneBlueLoader'
import styles from './style';
import NewsStockSearchModal from './newsStockSearchModal';
import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import Button from '../../../components/Button';
import indexIos from 'react-native-ios-notification-actions';
var TAG = "Dashboard"
var responseMarketList = [];
var stockDetail = [];
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
var _this = null;
_unsubscribeFromBranch = null

let currentTime = new Date()
let resolution = Dimensions.get('window').width + 'X' + Dimensions.get('window').height

let msg = '';
let greetingMsg = '';
const propOverridePlaceholderObject = {
  component: Image,
  props: {
    style: styles.dashboardSecThirdImg,
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

const aa = '';
let tempData = [];

const CacheableImage = imageCacheHoc(Image, {
  validProtocols: ['http', 'https'],
  // fileDirName : "news",
  defaultPlaceholder: propOverridePlaceholderObject
});


class Dashboard extends Component {

  constructor(props) {
    super(props);
    _this = this;
    this.state = {
      dashboardNewsData: [],
      dashboardMarketData: null,
      themeStyle: props.theme,
      isSearchViewVisible: false,
      modalVisible: false,
      isCacheData: false,
      isNetworkAvailable: false,
      tryAgainLoader: true,
      oldTopNewsData: [],
      topNewsLength : 3,
      secondGreetingMsg : '',
      morningQuotes: [
        {
          "id": 1,
          "msg": "News briefing for you to get your day started"
        },
        {
          "id": 2,
          "msg": "Get your day started with these news updates"
        },
        {
          "id": 3,
          "msg": "News stories specially selected for you"
        },
        {
          "id": 4,
          "msg": "Here is what is trending in the news today"
        }
      ],
      middayQuotes: [
        {
          "id": 1,
          "msg": "Welcome back, here is what you missed"
        },
        {
          "id": 2,
          "msg": "Midday News"
        },
        {
          "id": 3,
          "msg": "Here is what is trending in the news today"
        }
      ],
        afterNoonQuotes: [
          {
            "id": 1,
            "msg": "Daily News                                                                                                                                        "
          },
          {
            "id": 2,
            "msg": "Its News o clock"
          },
          {
            "id": 3,
            "msg": "Get busy read Todays news"
          }
        ],
        eveningQuotes : [
          {
            "id": 1,
            "msg": "Evening News Roundup"
          },
          {
            "id": 2,
            "msg": "Evening News Roundup"
          }
        ],
        nightQuotes : [
          {
            "id": 1,
            "msg": "Late Night News!"
          },
          {
            "id": 2,
            "msg": "You are awake? Here is what’s trending"
          }
        ],
        weekendQuotes : [
          {
            "id": 1,
            "msg": "It’s the weekend don’t miss out on what’s happening "
          },
          {
            "id": 2,
            "msg": "We’ve got everything you need to keep you this weekend "
          },
          {
            "id": 3,
            "msg": " Get busy this weekend with our News updates"     
          }
        ],
        fridayQuotes : [
          {
            "id": 1,
            "msg": "TGIF!"
          },
          {
            "id": 2,
            "msg": "Wind up your week with these News Stories"
          }
        ]
      
    }
  }

  async getFcmToken() {
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          console.log("TOKEN" + fcmToken)
          AsyncStorage.setItem(globals.fcm_token, fcmToken);
        } else {
          console.log("NO--TOKEN")
        }
      });

    this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
      // Process your message as required
      console.log("DATAAAA", message);
      console.log("DATA SECret " + message._data.secret);
      globals.Pushsecret = message._data.secret;

      var event = { "key": globals.event_ReceivedOTP, "count": 1 };
      event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
      Countly.recordEvent(event);
      console.log("=====segmentation record event globals.event_ForgotPassword, result=> ");

      var event = { "key": globals.event_PushNotificationofstocksinwatchlist, "count": 1 };
      event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
      Countly.recordEvent(event);
      console.log("=====segmentation record event globals.event_PushNotificationofstocksinwatchlist, result=> ");

      firebase.analytics().logEvent(globals.event_ReceivedOTP, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
      firebase.analytics().logEvent(globals.event_PushNotificationofstocksinwatchlist, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));

    });

    //A notification will trigger one of two listeners depending on the state of your application
    //onNotificationDisplayed - Triggered when a particular notification has been displayed
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      console.log("Notification display Listener Message ====>>>>", notification)
    });

    //onNotification - Triggered when a particular notification has been received
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      // Process your notification as required
      this.setState({
        Message: notification.body
      }, () => console.log(notification))
      console.log("Notification Listener Message ====>>>>", notification)
    });

    // If your app is in the foreground, or background, you can listen for when a notification is clicked / tapped / opened as follows
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {

      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;

      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      this.setState({
        Message: notification.body
      })

      console.log("Notification opened Message ====>>>>", notification._data.target)
      console.log("Notif TItle>>>>> " + JSON.stringify(this.props));
      //this.reset();
      this.props.getShowModalSearchBar(false)
      this.props.getShowModalNewsSearchBar(false)

      AsyncStorage.getItem(globals.currentNavigator).then((value) => {
        globals.currentNavigatorValue = value;
      });

      setTimeout(() => {
        console.log("globals.currentNavigatorValue " + globals.currentNavigatorValue);
        if (notification._data.target == 'watchlist') {
          if (globals.currentNavigatorValue == "WatchList") {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'WatchList' })],
            });
            this.props.navigation.dispatch(resetAction);
          }
          else {
            this.props.navigation.navigate('Watchlist')
          }
        }
      }, 100);
    });

    //If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows
    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      // App was opened by a notification
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;

      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      this.setState({
        Message: notification.body
      })

      console.log("Notification notificationOpen  Message ====>>>>", notification._data.target)
      AsyncStorage.getItem(globals.currentNavigator).then((value) => {
        globals.currentNavigatorValue = value;
      });

      setTimeout(() => {
        console.log("globals.currentNavigatorValue " + globals.currentNavigatorValue);
        if (notification._data.target == 'watchlist') {
          if (globals.currentNavigatorValue == "WatchList") {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'WatchList' })],
            });
            this.props.navigation.dispatch(resetAction);
          }
          else {
            this.props.navigation.navigate('Watchlist')
          }
        }
      }, 100);
    }

    // Build a channel
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
      .setDescription('My apps test channel');

    // Create the channel
    firebase.notifications().android.createChannel(channel);

    // Build a channel group
    const channelGroup = new firebase.notifications.Android.ChannelGroup('test-group', 'Test Channel Group');

    // Create the channel group
    firebase.notifications().android.createChannelGroup(channelGroup);

    // Set up your listener
    firebase.notifications().onNotificationOpened((notificationOpen) => {
      // notificationOpen.action will equal 'test_action'
      this.setState({
        Message: notificationOpen.notification.body
      })
    });

    async (notificationOpen: NotificationOpen) => {
      if (notificationOpen.action === 'snooze') {
        // handle the action
      }
      return Promise.resolve();
    }
  }


  reset() {
    return this.props
      .navigation
      .dispatch(NavigationActions.reset(
        {
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Watchlist' })
          ]
        }));
  }


  async firebasePushNotificationConfiguration() {

    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          globals.globalVars.isPushTokenPermissionDone = true;
          this.getFcmToken()
        } else {
          //If the user has not already granted permissions, then you can prompt them to do so, as follows
          firebase.messaging().requestPermission()
            .then(() => {
              this.getFcmToken()
              globals.globalVars.isPushTokenPermissionDone = true;
              firebase.messaging().sendMessage(message);
            })
            .catch(error => {
              Alert.alert(globals.APP_NAME, "You have to give permission for Notification from App setting")
            });
        }
      });
  }

  fireBaseToken() {
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {

        } else {
          // user doesn't have a device token yet
        }
      });
  }

  componentWillUnmount() {
    if (_unsubscribeFromBranch) {
      _unsubscribeFromBranch()
      _unsubscribeFromBranch = null
    }
    this.unsubscribe();
    this.messageListener();
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
  }

  parseQueryString(query) {
    var obj = {},
      qPos = query.indexOf("?"),
      tokens = query.substr(qPos + 1).split('&'),
      i = tokens.length - 1;
    if (qPos !== -1 || query.indexOf("=") !== -1) {
      for (; i >= 0; i--) {
        var s = tokens[i].split('=');
        obj[unescape(s[0])] = s.hasOwnProperty(1) ? unescape(s[1]) : null;
      };
    }
    return obj;
  }

  handleOpenURL(event) {
    if (event.url != undefined) {
      const route = event.url.replace(/.*?:\/\//g, '');
      var stockdata = route.split("/")

      if (stockdata[0] == "stock") {
        _this.props.navigation.navigate("StockDetails", { stock_id: stockdata[1], symbol: stockdata[2] })
      }
    }
  }



  responseTopNews = {
    success: (response) => {
      console.log(TAG, "Dashboard TOP news -->" + JSON.stringify(response));
      try {
        this.sortDataDateWise(response.data)

      }
      catch (error) {
        this.setState({ tryAgainLoader: false })
      }

      // this.setState({ dashboardNewsData: response.data,  },()=>{
      //   this.sortDataDateWise(response.data)          

      // })
    },
    error: (err) => {
      console.log("error:---> " + JSON.stringify(err))
      this.setState({ tryAgainLoader: false })
      AsyncStorage.getItem(globals.dashboard_topnews_async, (err, result) => {
        if (result !== null) {
          var responseData = JSON.parse(result);
          this.setState({ dashboardNewsData: responseData }, () => this.forceUpdate())
        }
      });
    },
    complete: () => {
    }
  }

  responseMarketData = {
    success: (response) => {
      console.log(TAG, "Dashboard Market  -->" + JSON.stringify(response));
      this.setState({ dashboardMarketData: response.sData, });//tryAgainLoader: false 
      AsyncStorage.setItem(globals.dashboard_marketdata_timeStamp, new Date());
      AsyncStorage.setItem(globals.dashboard_market_async, JSON.stringify(response));

    },
    error: (err) => {
      this.setState({ tryAgainLoader: false })
      AsyncStorage.getItem(globals.dashboard_market_async, (err, result) => {
        if (result !== null) {
          var responseData = JSON.parse(result);
          this.setState({ dashboardMarketData: responseData.sData, }, () => this.forceUpdate())
        }
      });
    },
    complete: () => {
    }
  }

  responseDataCategories = {
    success: (response) => {
      console.log("response get all categories: " + JSON.stringify(response));
      try {
        this.setState({ categoryData: response.data, })
        AsyncStorage.setItem(globals.category_timeStamp, new Date());
        AsyncStorage.setItem(globals.categoryData, JSON.stringify(response.data));

      } catch (error) {
        this.setState({ tryAgainLoader: false })
        // AsyncStorage.setItem(globals.categoryData,JSON.stringify(this.state.categoryData))
      }
    },
    error: (err) => {
      this.setState({ tryAgainLoader: false })
    },
    complete: () => {

    }
  }

  sortDataDateWise(responseData) {
    let response = [
      {
        id: 6,
        title: "FTC creates antitrust task force to monitor tech industry",
        author: "Devin Coldewey",
        summary: "The field of technology and the business practices within it tend to advance faster than regulators can keep up. But the FTC is making a concerted effort with a new 17-lawyer tech task force dedicated to ensuring free and fair competition and watching for a…",
        content: "The field of technology and the business practices within it tend to advance faster than regulators can keep up. But the FTC is making a concerted effort with a new 17-lawyer tech task force dedicated to ensuring “free and fair competition” and watching for a… [+2603 chars]",
        news_source_id: 1,
        aggregator: "News API",
        url: "https://techcrunch.com/2019/02/26/ftc-creates-antitrust-task-force-to-monitor-tech-industry/",
        status_id: 3,
        published_date: "2019-02-26 18:59:23",
        created_at: "2019-03-25 08:32:09",
        updated_at: "2019-03-25 10:59:57",
        additional_data: {
        banner: {
        title: "FTC creates antitrust task force to monitor tech industry",
        url: "https://logo.clearbit.com/techcrunch.com"
        }
        },
        media: [
        {
        id: 1,
        url: "https://techcrunch.com/wp-content/uploads/2018/09/ftc_building.jpg?w=1390&crop=1",
        media_type: {
        id: 1,
        type: "image"
        }
        }
        ],
        tags: [
        {
        id: 1,
        name: "topnews",
        hidden: false
        }
        ],
        interactions: [ ]
        },
        {
        id: 7,
        title: "FTC creates antitrust task force to monitor tech industry",
        author: "Devin Coldewey",
        summary: "The field of technology and the business practices within it tend to advance faster than regulators can keep up. But the FTC is making a concerted effort with a new 17-lawyer tech task force dedicated to ensuring free and fair competition and watching for a…",
        content: "The field of technology and the business practices within it tend to advance faster than regulators can keep up. But the FTC is making a concerted effort with a new 17-lawyer tech task force dedicated to ensuring “free and fair competition” and watching for a… [+2603 chars]",
        news_source_id: 1,
        aggregator: "News API",
        url: "https://techcrunch.com/2019/02/26/ftc-creates-antitrust-task-force-to-monitor-tech-industry/",
        status_id: 3,
        published_date: "2019-02-26 18:59:23",
        created_at: "2019-03-25 08:32:09",
        updated_at: "2019-03-25 10:59:57",
        additional_data: {
        banner: {
        title: "FTC creates antitrust task force to monitor tech industry",
        url: "https://logo.clearbit.com/techcrunch.com"
        }
        },
        media: [
        {
        id: 1,
        url: "https://techcrunch.com/wp-content/uploads/2018/09/ftc_building.jpg?w=1390&crop=1",
        media_type: {
        id: 1,
        type: "image"
        }
        }
        ],
        tags: [
        {
        id: 1,
        name: "topnews",
        hidden: false
        }
        ],
        interactions: [ ]
        },
        {
          id: 7,
          title: "FTC creates antitrust task force to monitor tech industry",
          author: "Devin Coldewey",
          summary: "The field of technology and the business practices within it tend to advance faster than regulators can keep up. But the FTC is making a concerted effort with a new 17-lawyer tech task force dedicated to ensuring free and fair competition and watching for a…",
          content: "The field of technology and the business practices within it tend to advance faster than regulators can keep up. But the FTC is making a concerted effort with a new 17-lawyer tech task force dedicated to ensuring “free and fair competition” and watching for a… [+2603 chars]",
          news_source_id: 1,
          aggregator: "News API",
          url: "https://techcrunch.com/2019/02/26/ftc-creates-antitrust-task-force-to-monitor-tech-industry/",
          status_id: 3,
          published_date: "2019-02-26 18:59:23",
          created_at: "2019-03-25 08:32:09",
          updated_at: "2019-03-25 10:59:57",
          additional_data: {
          banner: {
          title: "FTC creates antitrust task force to monitor tech industry",
          url: "https://logo.clearbit.com/techcrunch.com"
          }
          },
          media: [
          {
          id: 1,
          url: "https://techcrunch.com/wp-content/uploads/2018/09/ftc_building.jpg?w=1390&crop=1",
          media_type: {
          id: 1,
          type: "image"
          }
          }
          ],
          tags: [
          {
          id: 1,
          name: "topnews",
          hidden: false
          }
          ],
          interactions: [ ]
          }
    ]
    this.forceUpdate()
    console.log("Top news : " + JSON.stringify(responseData))
    responseData.sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    this.setState({ dashboardNewsData: responseData }, () => {
      let length = this.state.dashboardNewsData.length;
      this.setState({topNewsLength : length},()=>console.log("top news length : " + this.state.topNewsLength))
      AsyncStorage.setItem(globals.dashboard_topnews_timeStamp, new Date());
      AsyncStorage.setItem(globals.dashboard_topnews_async, JSON.stringify(this.state.dashboardNewsData));
      console.log("sortDataDateWise after save" + JSON.stringify(this.state.dashboardNewsData))
      tempData = this.state.dashboardNewsData
    })
  }

  renderSecondMessageTimeInterval(){
    AsyncStorage.getItem(globals.greetingMsgTimeInterval, (err, result) => {
      if (result !== null) {
          AsyncStorage.getItem(globals.greetingSecondMessage, (err, result) => {
            if (result !== null) {
             this.setState({secondGreetingMsg : result})
            }
          });
      } else {
       this.renderGreetingMsg() 
      }
    });
  }

  getTimeIntervalOfDashboardTopNewsData() {
   
    AsyncStorage.getItem(globals.dashboard_topnews_timeStamp, (err, result) => {
      if (result !== null) {
        this.setState({ isCacheData: true })
        var diffMins = globals.getTimeDifference(result);
        if (diffMins >= 1 && globals.isInternetConnected) {
          this.setState({ isNetworkAvailable: true, })
          API.dashboardTopNews(this.responseTopNews, false);
        } else {
          AsyncStorage.getItem(globals.dashboard_topnews_async, (err, result) => {
            if (result !== null) {
              var responseData = JSON.parse(result);
              this.setState({ dashboardNewsData: responseData }, () => {
                console.log("get from async" + JSON.stringify(this.state.dashboardNewsData))
                tempData = this.state.dashboardNewsData
                let length = this.state.dashboardNewsData.length
                this.setState({topNewsLength : length},()=>console.log("top news length from async : " + this.state.topNewsLength))
                //this.sortDataDateWise()     
                //  this.state.dashboardNewsData.sort((a, b) => b.updated_at.localeCompare(a.updated_at))
                //  this.forceUpdate()     
              })
            }
          });
        }
      } else {
        if (globals.isInternetConnected) {
          this.setState({ isNetworkAvailable: true })
          API.dashboardTopNews(this.responseTopNews, false);
        } else {
          console.log("handleImageLoaded 1")
          this.setState({ isNetworkAvailable: false, tryAgainLoader: false })
        }
      }
    });
  }

  getTimeIntervalOfDashboardMarketData() {
    AsyncStorage.getItem(globals.dashboard_marketdata_timeStamp, (err, result) => {
      if (result !== null) {
        var diffMins = globals.getTimeDifference(result);
        if (diffMins >= 1 && globals.isInternetConnected) {
          this.setState({ isNetworkAvailable: true })
          API.dashboardMarketTrending(this.responseMarketData, false);
        } else {
          AsyncStorage.getItem(globals.dashboard_market_async, (err, result) => {
            if (result !== null) {
              var responseData = JSON.parse(result);
              this.setState({ dashboardMarketData: responseData.sData, }, () => this.forceUpdate())
            }
          });
        }
      } else {
        if (globals.isInternetConnected) {
          this.setState({ isNetworkAvailable: true })
          API.dashboardMarketTrending(this.responseMarketData, false);
        } else {
          console.log("handleImageLoaded 2")
          this.setState({ isNetworkAvailable: false, tryAgainLoader: false })
        }
      }
    });
  }

  getTimeIntervalOfCategoryData() {
    AsyncStorage.getItem(globals.category_timeStamp, (err, result) => {
      if (result !== null) {
        var diffMins = globals.getTimeDifference(result);
        if (diffMins >= 1 && globals.isInternetConnected) {
          this.setState({ isNetworkAvailable: true })
          API.getAllCategories(this.responseDataCategories, false);
        } else {
          AsyncStorage.getItem(globals.categoryData, (err, result) => {
            if (result !== null) {
              var responseData = JSON.parse(result);
              this.setState({ categoryData: responseData.data, }, () => {
                this.forceUpdate()
                console.log("getTimeIntervalOfCategoryData async")
              })//, tryAgainLoader: false
            }
          });
        }
      } else {
        if (globals.isInternetConnected) {
          this.setState({ isNetworkAvailable: true })
          API.getAllCategories(this.responseDataCategories, false);
        } else {
          console.log("handleImageLoaded 3")
          this.setState({ isNetworkAvailable: false, tryAgainLoader: false })
        }
      }
    });
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

  async removeLikeStorage() {
    try {
      await AsyncStorage.removeItem(globals.local_like_async);
      // this._appendMessage('Selection removed from disk.');
    } catch (error) {
      // this._appendMessage('AsyncStorage error: ' + error.message);
    }
  }

  async removeBookMarkStorage() {
    try {
      await AsyncStorage.removeItem(globals.local_bookmark_async);
      // this._appendMessage('Selection removed from disk.');
    } catch (error) {
      // this._appendMessage('AsyncStorage error: ' + error.message);
    }
  }

  async componentDidMount() {
    console.log(TAG, "componentDidMount")
    
    // if(!globals.isInternetConnected){
    //   this.setState({tryAgainLoader : false})
    // }
    AsyncStorage.getItem(globals.user_authsecret).then((value) => {
      if (value !== null) {
        globals.Authsecret = value;
      }
    });

    var event = { "key": globals.event_AppOpen, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
    Countly.recordEvent(event);
    console.log("=====segmentation record event globals.event_AppOpen, result=> ");

    AsyncStorage.setItem(globals.aysnc_firstAppOpen, 'true');

    AsyncStorage.getItem(globals.local_like_async, (err, result) => {
      if (result !== null) {
        var responseData = JSON.parse(result);
        if (globals.isInternetConnected) {
          for (let index = 0; index < responseData.length; index++) {
            console.log("ACTION PERFORM LIKE");
            API.newsArticlesAction(this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, responseData[index].id, 'like', true);

          }
          this.removeLikeStorage();
        }
        console.log("LOCAL LIKE DATA::: " + JSON.stringify(responseData));
      }
    });

    AsyncStorage.getItem(globals.local_bookmark_async, (err, result) => {
      if (result !== null) {
        var responseData = JSON.parse(result);
        if (globals.isInternetConnected) {
          for (let index = 0; index < responseData.length; index++) {
            console.log("ACTION PERFORM BOOKMARK");
            API.newsArticlesAction(this.responseLikeUnlike, globals.globalVars.userIdTemp_Global, responseData[index].id, 'bookmark', true);
          }
          this.removeBookMarkStorage();
        }
        console.log("LOCAL BOOMARK DATA::: " + JSON.stringify(responseData));
      }
    });

    // BackgroundTimer.runBackgroundTimer(() => {
    //   this.renderGreetingMsg()
    // }, 60000);//900000 
    // this.renderSecondMessageTimeInterval()
    setTimeout(() => {
      this.renderGreetingPerDay()
      BackgroundTimer.runBackgroundTimer(() => {
        this.renderGreetingPerDay()
      }, 300000);//900000 
    }, 100);
   

    this.getTimeIntervalOfDashboardTopNewsData();
    this.getTimeIntervalOfDashboardMarketData();
    this.getTimeIntervalOfCategoryData();
    // API.dashboardTopNews(this.responseTopNews, false);
    // API.dashboardMarketTrending(this.responseMarketData, false);
    // API.getAllCategories(this.responseDataCategories, false);
    // this.setState({
    //     dashboardNewsData: dashboardNewsRes.RESPONSE.data[0],
    //     dashboardMarketData: dashboardMarketRes.RESPONSE.sData
    // })
    if (Platform.OS == 'ios') {
      globals.setStatusBarForSafariView();
    } else {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(colors.blue, true);
      }
    }

    AsyncStorage.getItem(globals.currentNavigator).then((value) => {
      globals.currentNavigatorValue = value;
    });
    console.log("globals.currentNavigatorValue DIDmount " + globals.currentNavigatorValue);

    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          this.getFcmToken()
        } else {
          //If the user has not already granted permissions, then you can prompt them to do so, as follows
          firebase.messaging().requestPermission()
            .then(() => {
              this.getFcmToken()
              firebase.messaging().sendMessage(message);
            })
            .catch(error => {
              // alert("You have to give permission for Notification from App setting")
            });
        }
      });


    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      this.setState({
        Message: notification.body
      }, () => console.log("Slience Notification" + notification))
    });


    //   this.setState({ themeStyle: this.props.theme })
    //   this.marketStatus = this.props.marketStatus
    //   this.props.navigation.setParams({ bgColor: (this.props.marketStatus) ? colors.blue : colors.blackThemeColor })



    if (globals.isInternetConnected) {
      if (Platform.OS == 'ios') {
        branch.initSessionTtl = 5000;
      }
      _unsubscribeFromBranch = branch.subscribe(({ error, params }) => {
        try {
          console.log("PARAMS:--- : ----", JSON.stringify(params))

          if (params) {
            console.log("PARAMS:---", JSON.stringify(params))
            if ((params['+clicked_branch_link']) == true) {
              if ((params['$canonical_identifier']) == 'news') {
                // alert('News link')
                if (Platform.OS == 'ios') {
                  SafariView.isAvailable()
                    .then(SafariView.show({
                      url: (params['$ios_url']),
                      barTintColor: colors.white,
                      readerMode: true,
                    }))
                    .catch(error => {
                      // Fallback WebView code for iOS 8 and earlier
                    });
                } else {
                  _this.props.navigation.navigate("NewsArticleWebView", { screen_name: 'DeepView', open_url: (params['$android_url']), title: (params['$og_description']) })
                }

              }
              else {
                var stockdata = _this.parseQueryString(params.$ios_url)
                if (stockdata.key == "stock") {
                  _this.props.navigation.navigate("StockDetails", { stock_id: stockdata.stock_id || "", symbol: stockdata.symbol || "" })
                }
                else {
                  // no data
                  console.log("else _unsubscribeFromBranch : ", JSON.stringify(params))
                }
              }

            }
          }
        } catch (error) {
          console.log(error);

        }

      })
    }
  }

  renderGreetingPerDay(){
    var now = new Date()
    moment(now).format('d MMM YYYY')
    console.log("now :--- " + moment(now).format('d MMM YYYY'))

    AsyncStorage.getItem(globals.greetingMsgTimeInterval, (err, result) => {
      console.log("result now :::--> " + result)
      if (result != null && result === moment(now).format('d MMM YYYY')) {
          this.getSecondMsgOfSameDate()
      } else {
       this.renderGreetingMsg() 
      }
    });
  }

  getSecondMsgOfSameDate(){
    let secGreetingMsg = ''
    let morningQuotes = this.state.morningQuotes
    let middayQuotes = this.state.middayQuotes
    let afternoonQuotes = this.state.afterNoonQuotes
    let eveningQuotes = this.state.eveningQuotes
    let nightQuotes = this.state.nightQuotes
    let weekendQuotes = this.state.weekendQuotes
    let fridayQuotes = this.state.fridayQuotes
    var now = new Date()
    var hrs = now.getHours();

    //weekend-https://stackoverflow.com/questions/3551795/how-to-determine-if-date-is-weekend-in-javascript
    var day = now.getDay();
    var isWeekend = (day === 6) || (day === 0);    // 6 = Saturday, 0 = Sunday
    var friday = (day === 5); //Friday

    if (isWeekend) {
      AsyncStorage.getItem(globals.weekendKey, (err, result) => {
        if (result != null) {
          this.setState({ secondGreetingMsg: result })
        }
        else {
          let greetingWeekendMsgObj = weekendQuotes[Math.floor(Math.random() * weekendQuotes.length)];
          secGreetingMsg = greetingWeekendMsgObj.msg
          this.setState({secondGreetingMsg : secGreetingMsg},()=>{
            AsyncStorage.setItem(globals.weekendKey, this.state.secondGreetingMsg);
          })
        }
      })
    }
    else if(friday) {
      AsyncStorage.getItem(globals.fridayKey, (err, result) => {
        if (result != null) {
          this.setState({ secondGreetingMsg: result })
        }
        else {
          let greetingFridaydMsgObj = fridayQuotes[Math.floor(Math.random() * fridayQuotes.length)];
          secGreetingMsg = greetingFridaydMsgObj.msg
          this.setState({secondGreetingMsg : secGreetingMsg},()=>{
            AsyncStorage.setItem(globals.fridayKey, this.state.secondGreetingMsg);
          })
        }
      })
    }
    else{
      if (hrs >= 0) {
        AsyncStorage.getItem(globals.earlymorningKey, (err, result) => {
          if (result != null) {
            this.setState({ secondGreetingMsg: result })
          }
          else {
            secGreetingMsg = "Early hour news!";
            this.setState({secondGreetingMsg : secGreetingMsg},()=>{
              AsyncStorage.setItem(globals.earlymorningKey, this.state.secondGreetingMsg);
            })
          }
        })
      }
      if (hrs >= 6) {
        AsyncStorage.getItem(globals.morningKey, (err, result) => {
          if (result != null) {
            this.setState({ secondGreetingMsg: result })
          }
          else {
            let greetingMorningMsgObj = morningQuotes[Math.floor(Math.random() * morningQuotes.length)];
            secGreetingMsg = greetingMorningMsgObj.msg
            this.setState({secondGreetingMsg : secGreetingMsg},()=>{
              AsyncStorage.setItem(globals.morningKey, this.state.secondGreetingMsg);
            })
          }
        })
      }
      if(hrs == 12){
        console.log("getSecondMsgOfSameDate ")
        AsyncStorage.getItem(globals.middayKey, (err, result) => {
          if (result != null) {
            console.log("getSecondMsgOfSameDate IF")
            this.setState({ secondGreetingMsg: result })
          }
          else {
            console.log("getSecondMsgOfSameDate else")
            let greetingMiddayMsgObj = middayQuotes[Math.floor(Math.random() * middayQuotes.length)];
            secGreetingMsg = greetingMiddayMsgObj.msg
            this.setState({secondGreetingMsg : secGreetingMsg},()=>{
              AsyncStorage.setItem(globals.middayKey, this.state.secondGreetingMsg);
            })
          }
        })
      }
      if(hrs >= 13){
        console.log("getSecondMsgOfSameDate noon")
        AsyncStorage.getItem(globals.noonKey, (err, result) => {
          if (result != null) {
            console.log("getSecondMsgOfSameDate noon IF")
            this.setState({ secondGreetingMsg: result })
          }
          else {
            console.log("getSecondMsgOfSameDate noon else")
            let greetingNoonMsgObj = afternoonQuotes[Math.floor(Math.random() * afternoonQuotes.length)];
            secGreetingMsg = greetingNoonMsgObj.msg
            this.setState({secondGreetingMsg : secGreetingMsg},()=>{
              AsyncStorage.setItem(globals.noonKey, this.state.secondGreetingMsg);
            })
          }
        })
       
      }
      if(hrs >= 17){
        AsyncStorage.getItem(globals.eveningKey, (err, result) => {
          if (result != null) {
            this.setState({ secondGreetingMsg: result })
          }
          else {
            let greetingEveningMsgObj = eveningQuotes[Math.floor(Math.random() * eveningQuotes.length)];
            secGreetingMsg = greetingEveningMsgObj.msg
            this.setState({secondGreetingMsg : secGreetingMsg},()=>{
              AsyncStorage.setItem(globals.eveningKey, this.state.secondGreetingMsg);
            })
          }
        })
      }
      if(hrs >= 22){
        AsyncStorage.getItem(globals.nightKey, (err, result) => {
          if (result != null) {
            this.setState({ secondGreetingMsg: result })
          }
          else {
            let greetingNightMsgObj = nightQuotes[Math.floor(Math.random() * nightQuotes.length)];
            secGreetingMsg = greetingNightMsgObj.msg
            this.setState({secondGreetingMsg : secGreetingMsg},()=>{
              AsyncStorage.setItem(globals.nightKey, this.state.secondGreetingMsg);
            })
          }
        })

      }

    }
  }


  /**
   * Method for on focus 
   */
  onFocus() {

    firebase.analytics().logEvent(globals.event_DashboardSearch,
      Object.assign({}, { EventDetails: 'dashboard search' }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
    var event = { "key": globals.event_DashboardSearch, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
    Countly.recordEvent(event);
    this.props.getShowModalSelectBankAccount(true, '', '', '')
    this.setState({ modalVisible: true })
    this.props.navigation.navigate('NewsStockSearchModal')
  }

  openModal() {

    var event = { "key": globals.event_DashboardSearch, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
    Countly.recordEvent(event);

    return (
      <Modal animationType='slide' visible={this.state.modalVisible} onRequestClose={() => { Dashboard.handleCloseModal('dashboard') }}>
        <NewsStockSearchModal isFrom='Dashboard' setParentState={newState => this.setState(newState)} />
      </Modal>
    )
  }

  /**
   * Method for handle close modal webview
   */
  static handleCloseModal() {
    _this.props.getShowModalSelectBankAccount(false)
    _this.setState({
      modalVisible: false
    })
  }


  static handleCloseModalNavigateStockDetail(data) {
    _this.props.getShowModalSelectBankAccount(false)
    _this.setState({
      modalVisible: false
    }, () => _this.props.navigation.navigate('StockDetailSearch', data)
    )
  }

  static openNewsModal() {
    _this.props.getShowModalSelectBankAccount(true)
    _this.setState({ modalVisible: true })
  }

  /**navigae to stock martket from dashboard */
  static handleCloseModalNavigateNewsSearchDetail(data) {
    _this.props.getShowModalSelectBankAccount(false)
    _this.setState({
      modalVisible: false
    }, () => _this.props.navigation.navigate('NewsSearchDetail', data)
    )
  }

  tryAgainButtonClick() {
    if (globals.isInternetConnected) {
      console.log("handleImageLoaded 4")
      this.setState({ tryAgainLoader: true }, () => {
        this.getTimeIntervalOfDashboardTopNewsData();
        this.getTimeIntervalOfDashboardMarketData();
        this.getTimeIntervalOfCategoryData();
      })
    }
  }

  /**navigae to stock martket from dashboard */
  navigateToStockMarket() {
    firebase.analytics().logEvent(globals.event_dashboardMarketSrock,
      Object.assign({}, { EventDetails: 'stock market navigate' }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
    var event = { "key": globals.event_dashboardMarketSrock, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
    Countly.recordEvent(event);
    console.log("=====segmentation record event globals.event_dashboardMarketSrock, result=> ");
    this.props.navigation.navigate("StocksTabNav")

  }

  /**navigate to topnews from dashboard with countly data */
  navigateTopNews() {

    firebase.analytics().logEvent(globals.event_TopNews,
      Object.assign({}, { EventDetails: 'Top news article details' }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

    var event = { "key": globals.event_TopNews, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
    Countly.recordEvent(event);
    console.log("=====segmentation record event dashboardtopnews, result=> ");
    globals.globalVars.sortedTopNewsData = this.state.dashboardNewsData;
    this.props.navigation.navigate("DashboardNewsArticleDetail", { title: 'Top News', dashboardNewsDetailData: this.state.dashboardNewsData, theme: this.props.theme })
  }

  goToProfileScreen() {
    firebase.analytics().logEvent(globals.event_DashboardPreferenace,
      Object.assign({}, { EventDetails: 'Preference screen' }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

    var event = { "key": globals.event_DashboardPreferenace, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
    Countly.recordEvent(event);
    _this.props.navigation.navigate('Preferences')
  }


  handleImageLoaded() {
    console.log("handleImageLoaded")
    setTimeout(() => { this.setState({ tryAgainLoader: false }) }, 1000)
  }



  /**
   * Method of render good wishes messages
   */
  renderDayWishMessage() {
    var now = new Date();
    var hrs = now.getHours();
    console.log("hours --> " + hrs)
    if (hrs >= 0) {
      msg = "Morning Sunshine!";
    }// REALLY early
    if (hrs >= 6) {
      msg = "Good Morning";
    } // After 6am
    if (hrs == 12) {
      msg = "Good Afternoon";
    } // After 12pm
    if (hrs >= 13) {
      msg = "Good afternoon";
    }// After 1pm
    if (hrs >= 17) {
      msg = "Good Evening";
    } // After 5pm
    if (hrs >= 22) {
      msg = "Curtain Falls!";
    }     // After 10pm
  }



  renderGreetingMsg() {
    let morningQuotes = this.state.morningQuotes
    let middayQuotes = this.state.middayQuotes
    let afternoonQuotes = this.state.afterNoonQuotes
    let eveningQuotes = this.state.eveningQuotes
    let nightQuotes = this.state.nightQuotes
    let weekendQuotes = this.state.weekendQuotes
    let fridayQuotes = this.state.fridayQuotes

    var now = new Date();
    moment(now).format('d MMM YYYY')
    var hrs = now.getHours();

    //weekend-https://stackoverflow.com/questions/3551795/how-to-determine-if-date-is-weekend-in-javascript
    var day = now.getDay();
    var isWeekend = (day === 6) || (day === 0);    // 6 = Saturday, 0 = Sunday
    var friday = (day === 5); //Friday
    
    if(isWeekend){
      let greetingWeekendMsgObj = weekendQuotes[Math.floor(Math.random() * weekendQuotes.length)];
      greetingMsg = greetingWeekendMsgObj.msg
      this.setState({secondGreetingMsg : greetingMsg},()=>{
        AsyncStorage.setItem(globals.weekendKey, this.state.secondGreetingMsg);
      })
    }
    else if(friday){
      let greetingFridayMsgObj = fridayQuotes[Math.floor(Math.random() * fridayQuotes.length)];
      greetingMsg = greetingFridayMsgObj.msg
      this.setState({secondGreetingMsg : greetingMsg},()=>{
        AsyncStorage.setItem(globals.fridayKey, this.state.secondGreetingMsg);
      })
    }
    else{
      if (hrs >= 0) {
        greetingMsg = "Early hour news!";
        this.setState({secondGreetingMsg : greetingMsg},()=>{
          AsyncStorage.setItem(globals.earlymorningKey, this.state.secondGreetingMsg);
        })
      }
      if (hrs >= 6) {
        let greetingMorningMsgObj = morningQuotes[Math.floor(Math.random() * morningQuotes.length)];
        greetingMsg = greetingMorningMsgObj.msg
        this.setState({secondGreetingMsg : greetingMsg},()=>{
          AsyncStorage.setItem(globals.morningKey, this.state.secondGreetingMsg);
        })
      }
      if(hrs == 12){
        console.log("renderGreetingMsg midday key")
        let greetingMiddayMsgObj = middayQuotes[Math.floor(Math.random() * middayQuotes.length)];
        greetingMsg = greetingMiddayMsgObj.msg
        this.setState({secondGreetingMsg : greetingMsg},()=>{
          AsyncStorage.setItem(globals.middayKey, this.state.secondGreetingMsg);
        })
      }
      if(hrs >= 13){
        console.log("renderGreetingMsg noon key")
        let greetingNoonMsgObj = afternoonQuotes[Math.floor(Math.random() * afternoonQuotes.length)];
        greetingMsg = greetingNoonMsgObj.msg
        this.setState({secondGreetingMsg : greetingMsg},()=>{
          AsyncStorage.setItem(globals.noonKey, this.state.secondGreetingMsg);
        })
      }
      if(hrs >= 17){
        let greetingEveningMsgObj = eveningQuotes[Math.floor(Math.random() * eveningQuotes.length)];
        greetingMsg = greetingEveningMsgObj.msg
        this.setState({secondGreetingMsg : greetingMsg},()=>{
          AsyncStorage.setItem(globals.eveningKey, this.state.secondGreetingMsg);
        })
      }
      if(hrs >= 22){
        let greetingNightMsgObj = nightQuotes[Math.floor(Math.random() * nightQuotes.length)];
        greetingMsg = greetingNightMsgObj.msg
        this.setState({secondGreetingMsg : greetingMsg},()=>{
          AsyncStorage.setItem(globals.nightKey, this.state.secondGreetingMsg);
        })
      }
    }
    AsyncStorage.setItem(globals.greetingMsgTimeInterval,moment(now).format('d MMM YYYY'));
    // this.setState({secondGreetingMsg : greetingMsg},() => {
    //   AsyncStorage.setItem(globals.greetingMsgTimeInterval, new Date());
    //   AsyncStorage.setItem(globals.greetingSecondMessage, this.state.secondGreetingMsg);  
    // })
  }



  navigateToArticleDetail(id) {
    AsyncStorage.getItem(globals.dashboard_topnews_async, (err, result) => {
      if (result !== null) {
        var responseData = JSON.parse(result);
        this.setState({ dashboardNewsData: responseData }, () => {
          console.log("get from async" + JSON.stringify(this.state.dashboardNewsData))
          tempData = this.state.dashboardNewsData

          let oldTopNewsData = []
          oldTopNewsData = tempData

          console.log("old data-----> " + JSON.stringify(oldTopNewsData))
          var event = { "key": globals.event_TopNews, "count": 1 };
          event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
          Countly.recordEvent(event);
          console.log("=====segmentation record event dashboardtopnews, result=> ");

          if (id == '1') {
            let firstClickNews = oldTopNewsData[0]
            oldTopNewsData.splice(0, 1)
            oldTopNewsData.unshift(firstClickNews);
            console.log("1st data click - " + JSON.stringify(oldTopNewsData))
          }
          else if (id == '2') {
            let secClickNews = oldTopNewsData[1]
            oldTopNewsData.splice(1, 1)
            oldTopNewsData.unshift(secClickNews);
            console.log("2nd data click - " + JSON.stringify(oldTopNewsData))

          }
          else if (id == '3') {
            let thirdClickNews = oldTopNewsData[2]
            oldTopNewsData.splice(2, 1)
            oldTopNewsData.unshift(thirdClickNews);
            console.log("3rd data click - " + JSON.stringify(oldTopNewsData))
          }
          else { }
          // var updatedNewsDataThree = oldTopNewsData.slice(0, 3);

          globals.globalVars.sortedTopNewsData = oldTopNewsData;
          firebase.analytics().logEvent(globals.event_TopNews,
            Object.assign({}, { EventDetails: 'Top news article details' }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
      
          var event = { "key": globals.event_TopNews, "count": 1 };
          event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
          Countly.recordEvent(event);

          this.props.navigation.navigate("DashboardNewsArticleDetail", { title: 'Top News', dashboardNewsDetailData: oldTopNewsData, theme: this.props.theme })
          AsyncStorage.getItem(globals.dashboard_topnews_async, (err, result) => {
            if (result !== null) {
              var responseData = JSON.parse(result);
              this.setState({ dashboardNewsData: responseData })
            }
          })

        })
      }
    });
  }

  renderGreetingMsgOld() {
    
    let morningQuotes = this.state.morningQuotes
    let middayQuotes = this.state.middayQuotes
    let afternoonQuotes = this.state.afterNoonQuotes
    let eveningQuotes = this.state.eveningQuotes
    let nightQuotes = this.state.nightQuotes
    let weekendQuotes = this.state.weekendQuotes
    let fridayQuotes = this.state.fridayQuotes

    var now = new Date();
    var hrs = now.getHours();

    //weekend-https://stackoverflow.com/questions/3551795/how-to-determine-if-date-is-weekend-in-javascript
    var day = now.getDay();
    var isWeekend = (day === 6) || (day === 0);    // 6 = Saturday, 0 = Sunday
    var friday = (day === 5); //Friday
    
    if(isWeekend){
      let greetingWeekendMsgObj = weekendQuotes[Math.floor(Math.random() * weekendQuotes.length)];
      greetingMsg = greetingWeekendMsgObj.msg
    }
    else if(friday){
      let greetingFridayMsgObj = fridayQuotes[Math.floor(Math.random() * fridayQuotes.length)];
      greetingMsg = greetingFridayMsgObj.msg
    }
    else{
      if (hrs >= 0) {
        greetingMsg = "Early hour news!";
      }
      if (hrs >= 6) {
        let greetingMorningMsgObj = morningQuotes[Math.floor(Math.random() * morningQuotes.length)];
        greetingMsg = greetingMorningMsgObj.msg
      }
      if(hrs == 12){
        let greetingMiddayMsgObj = middayQuotes[Math.floor(Math.random() * middayQuotes.length)];
        greetingMsg = greetingMiddayMsgObj.msg
      }
      if(hrs >= 13){
        let greetingNoonMsgObj = afternoonQuotes[Math.floor(Math.random() * afternoonQuotes.length)];
        greetingMsg = greetingNoonMsgObj.msg
      }
      if(hrs >= 17){
        let greetingEveningMsgObj = eveningQuotes[Math.floor(Math.random() * eveningQuotes.length)];
        greetingMsg = greetingEveningMsgObj.msg
      }
      if(hrs >= 22){
        let greetingNightMsgObj = nightQuotes[Math.floor(Math.random() * nightQuotes.length)];
        greetingMsg = greetingNightMsgObj.msg
      }
    }
  }

  renderTopNewsViewAccoringLength() {
    // alert(this.state.topNewsLength)
    if(this.state.topNewsLength == 0){
      return(
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate("DashboardNewsArticleDetail", { title: 'Top News', dashboardNewsDetailData: [], theme: this.props.theme })}>
          <View style={{ width: '100%' }}>
                <Image style={[styles.dashboardFirstImgOnlyOneNews,]} resizeMode = 'cover' source={stock.news_placeholder} permanent={true} /> 
          </View>
        </TouchableWithoutFeedback>
      </View>
      )
    }
    else if(this.state.topNewsLength == 1){
      console.log("top news length IF : ")
      return(
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TouchableWithoutFeedback onPress={() => this.navigateToArticleDetail('1')}>
          <View style={{ width: '100%' }}>
            {
              (this.state.dashboardNewsData.length > 0) ? (this.state.dashboardNewsData[0].media != null && this.state.dashboardNewsData[0].media != undefined && this.state.dashboardNewsData[0].media.length > 0) ?
                <CacheableImage style={[styles.dashboardFirstImgOnlyOneNews]} resizeMode='cover' source={{ uri: this.state.dashboardNewsData[0].media[0].url }} permanent={true} /> :
                <Image style={[styles.dashboardFirstImgOnlyOneNews,]} source={stock.news_placeholder} permanent={true} /> : null
            }
          </View>
        </TouchableWithoutFeedback>
        <View style={{ position: 'absolute', flex: 1, alignSelf: 'flex-end', justifyContent: 'flex-end', width: width * 0.6, paddingHorizontal: 10, paddingBottom: 10 }}>{
          (this.state.dashboardNewsData.length > 0 && this.state.dashboardNewsData[0].media.length > 0 && this.state.dashboardNewsData != null && this.state.dashboardNewsData != undefined) ? (this.state.dashboardNewsData[0].title != undefined && this.state.dashboardNewsData[0].title != '') ? <Text style={styles.firstNewsBottomText}>{this.state.dashboardNewsData[0].title}</Text> : null : null
        }
        </View>
          <View style={[{ position: 'absolute', bottom: 0, right: 0 }]}>
            <TouchableOpacity onPress={() => this.navigateToArticleDetail('4')}>
              <View style={styles.viewAllView}>
                <Text style={styles.viewAllStyle}>View All</Text>
                <Image source={dashboard.rightArrow} style={{ height: 14, width: 14, marginLeft: 5 }} />
              </View>
            </TouchableOpacity>
          </View>
      </View>
      )
    }
    else if(this.state.dashboardNewsData.length == 2){
      console.log("top news length else : ")

    return (
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TouchableWithoutFeedback onPress={() => this.navigateToArticleDetail('1')}>
          <View style={{ width: width * 0.6 }}>
            {
              (this.state.dashboardNewsData.length > 0) ? (this.state.dashboardNewsData[0].media != null && this.state.dashboardNewsData[0].media != undefined && this.state.dashboardNewsData[0].media.length > 0) ?
                <CacheableImage style={[styles.dashboardFirstImg]} resizeMode='cover' source={{ uri: this.state.dashboardNewsData[0].media[0].url }} permanent={true} /> :
                <Image style={[styles.dashboardFirstImg,]} source={stock.news_placeholder} permanent={true} /> : null
            }
          </View>
        </TouchableWithoutFeedback>
        <View style={{ position: 'absolute', flex: 1, alignSelf: 'flex-end', justifyContent: 'flex-end', width: width * 0.6, paddingHorizontal: 10, paddingBottom: 10 }}>{
          (this.state.dashboardNewsData.length > 0 && this.state.dashboardNewsData[0].media.length > 0 && this.state.dashboardNewsData != null && this.state.dashboardNewsData != undefined) ? (this.state.dashboardNewsData[0].title != undefined && this.state.dashboardNewsData[0].title != '') ? <Text style={styles.firstNewsBottomText}>{this.state.dashboardNewsData[0].title}</Text> : null : null
        }
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <TouchableWithoutFeedback onPress={() => this.navigateToArticleDetail('2')}>
            <View>
              {
                (this.state.dashboardNewsData.length > 1 && this.state.dashboardNewsData != null && this.state.dashboardNewsData != undefined) ? (this.state.dashboardNewsData[1].media != null && this.state.dashboardNewsData[1].media != undefined && this.state.dashboardNewsData[1].media.length > 0) ?
                  <CacheableImage style={[styles.dashboardOnlySecImg]} resizeMode='cover' source={{ uri: this.state.dashboardNewsData[1].media[0].url }} permanent={true} /> :
                  <Image style={[styles.dashboardOnlySecImg,]} source={stock.news_placeholder} permanent={true} /> : null
              }
            </View>
          </TouchableWithoutFeedback>
          <View style={[{ position: 'absolute', bottom: 0, right: 0 }]}>
            <TouchableOpacity onPress={() => this.navigateToArticleDetail('4')}>
              <View style={styles.viewAllView}>
                <Text style={styles.viewAllStyle}>View All</Text>
                <Image source={dashboard.rightArrow} style={{ height: 14, width: 14, marginLeft: 5 }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
  else{
    return (
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TouchableWithoutFeedback onPress={() => this.navigateToArticleDetail('1')}>
          <View style={{ width: width * 0.6 }}>
            {
              (this.state.dashboardNewsData.length > 0) ? (this.state.dashboardNewsData[0].media != null && this.state.dashboardNewsData[0].media != undefined && this.state.dashboardNewsData[0].media.length > 0) ?
                <CacheableImage style={[styles.dashboardFirstImg]} resizeMode='cover' source={{ uri: this.state.dashboardNewsData[0].media[0].url }} permanent={true} /> :
                <Image style={[styles.dashboardFirstImg,]} resizeMode='cover' source={stock.news_placeholder} permanent={true} /> : null
            }
          </View>
        </TouchableWithoutFeedback>
        <View style={{ position: 'absolute', flex: 1, alignSelf: 'flex-end', justifyContent: 'flex-end', width: width * 0.6, paddingHorizontal: 10, paddingBottom: 10 }}>{
          (this.state.dashboardNewsData.length > 0 && this.state.dashboardNewsData[0].media.length > 0 && this.state.dashboardNewsData != null && this.state.dashboardNewsData != undefined) ? (this.state.dashboardNewsData[0].title != undefined && this.state.dashboardNewsData[0].title != '') ? <Text style={styles.firstNewsBottomText}>{this.state.dashboardNewsData[0].title}</Text> : null : null
        }
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <TouchableWithoutFeedback onPress={() => this.navigateToArticleDetail('2')}>
            <View>
              {
                (this.state.dashboardNewsData.length > 1 && this.state.dashboardNewsData != null && this.state.dashboardNewsData != undefined) ? (this.state.dashboardNewsData[1].media != null && this.state.dashboardNewsData[1].media != undefined && this.state.dashboardNewsData[1].media.length > 0) ?
                  <CacheableImage style={[styles.dashboardSecThirdImg]} resizeMode='cover' source={{ uri: this.state.dashboardNewsData[1].media[0].url }} permanent={true} /> :
                  <Image style={[styles.dashboardSecThirdImg,]} source={stock.news_placeholder} permanent={true} /> : null
              }
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.navigateToArticleDetail('3')}>
            <View style={{ marginTop: 10 }}>
              {
                (this.state.dashboardNewsData.length > 2 && this.state.dashboardNewsData != null && this.state.dashboardNewsData != undefined) ? (this.state.dashboardNewsData[2].media != null && this.state.dashboardNewsData[2].media != undefined && this.state.dashboardNewsData[2].media.length > 0) ?
                  <CacheableImage style={[styles.dashboardSecThirdImg]} resizeMode='cover' source={{ uri: this.state.dashboardNewsData[2].media[0].url }} permanent={true} /> :
                  <Image style={[styles.dashboardSecThirdImg,]} source={stock.news_placeholder} permanent={true} /> : null
              }
            </View>
          </TouchableWithoutFeedback>
          <View style={[{ position: 'absolute', bottom: 0, right: 0 }]}>
            <TouchableOpacity onPress={() => this.navigateToArticleDetail('4')}>
              <View style={styles.viewAllView}>
                <Text style={styles.viewAllStyle}>View All</Text>
                <Image source={dashboard.rightArrow} style={{ height: 14, width: 14, marginLeft: 5 }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

  // <ClaneLoader loading={this.state.tryAgainLoader} />   
  render() {
    console.log("this.state.dashboardTopnews data : " + JSON.stringify(this.state.dashboardNewsData))
    // this.renderDayWishMessage();
      return (
      (!this.state.isCacheData && !this.state.isNetworkAvailable) ? <SafeAreaView style={globalStyles.safeviewStyle}>
        <ClaneLoader loading={this.state.tryAgainLoader} />
        <View style={styles.noInternetTextView}>
          <Text style={[styles.trendingFooterText, { color: colors.blackThemeColor }]}>{globals.networkNotAvailable}
          </Text>
          <View style={{ marginTop: 20 }}>
            <Button
              onPress={() => this.tryAgainButtonClick()}
              textStyle={[styles.buttonText, { color: colors.white }]}
              buttonStyles={[styles.buttonStyles, { borderColor: colors.blue, backgroundColor: colors.blue }]}
              text={globals.tryAgain}>
            </Button>
          </View>
        </View>
      </SafeAreaView> : <View style={globalStyles.mainViewSearchBar} removeClippedSubviews={false}>
          <ClaneLoader loading={this.state.tryAgainLoader} />
          {/* {this.openModal()} */}
          <View style={styles.mainTopNewsStyle}>
            <View style={globalStyles.categorySearchbarTopView}>
              <View style={styles.headerViewVisibility}>
                <View style={styles.rectangle}>
                  <TouchableOpacity style={styles.headerSideBtn} onPress={() => this.goToProfileScreen()}>
                    <Image style={styles.headerProfileImg} source={dashboard.profileDefault} resizeMode='center' />
                  </TouchableOpacity>
                  <Image style={[styles.claneLogo, { display: 'flex' }]} source={register.clane_logo_blue} resizeMode='contain' />
                  <TouchableOpacity style={styles.headerSearch} onPress={() => this.onFocus()} >

                  </TouchableOpacity>
                  <TouchableOpacity style={styles.headerSideBtn} onPress={() => this.onFocus()}>
                    <Feather name="search" style={styles.headerIconsearch} size={20} />
                  </TouchableOpacity>
                </View>
                {/* <TouchableOpacity style={[styles.headerSideBtn, { marginLeft: globals.screenWidth * 0.05 }]} onPress={() => alert('Notification')}>
                                      <Image style={styles.notificationIcon} source={dashboard.notification} resizeMode='contain' />
                                  </TouchableOpacity> */}
              </View>
            </View>


            {/* <TouchableWithoutFeedback onPress={() => this.navigateTopNews()}>
                  <View>
                    {(this.state.dashboardNewsData != null && this.state.dashboardNewsData != undefined) ? (this.state.dashboardNewsData.media != null && this.state.dashboardNewsData.url != undefined) && this.state.dashboardNewsData.media.length > 0 ?
                      <CacheableImage onLoad={this.handleImageLoaded.bind(this)} style={[styles.dashboardTopHeaderImage]} resizeMode='cover' source={{ uri: this.state.dashboardNewsData.media[0].url }} permanent={true} /> : <Image onLoad={this.handleImageLoaded.bind(this)} style={[styles.dashboardTopHeaderImage,]} source={stock.news_placeholder} permanent={true} /> : null}
                    <View style={[styles.dashboardTopHeaderTransparent]}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={[styles.leftTopView, { width: width * 0.85, marginTop: -10 }]}>
                          <Text style={styles.dashboardNewsTitle}>News</Text>
                          <Text style={[styles.dashboardNewsTitle, { fontSize: globals.font_10, fontWeight: '200' }]}>View trending news and updates</Text>
                        </View>
                        <View style={{ flex: 1, }}>
                          <Image source={dashboard.news} resizeMode={'contain'} style={styles.rightTopImageStyle} />
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate("DashboardNewsArticleDetail", { title: 'Top News', dashboardNewsDetailData: this.state.dashboardNewsData, theme: this.props.theme })}>
                  <View style={{ padding: 5, marginLeft: 5 }}>
                    <Text ellipsizeMode ={'tail'} numberOfLines = {2} style={[styles.dashboardTopNewsTitle]}>{this.state.dashboardNewsData.title}</Text>
                    <Text style={[styles.dashboardTopNewsHours, { marginBottom: 100 }]}>{moment(this.state.dashboardNewsData.published_date).fromNow()}</Text>
                  </View>
                </TouchableWithoutFeedback> */}

            <View style={{ flex: 1 }}>
              <View style={styles.dashboardMainTopView} />
              <View style={{ margin: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 0.6 }}>
                    <Text style={styles.dashboardDayWishText}>{'News'}</Text>
                  </View>
                  <View style={{ flex: 0.4, alignItems: 'flex-end', alignSelf: 'flex-end' }}>
                  <Image source={dashboard.news}  resizeMode={'contain'} style={{ height: 27, width: 36, tintColor : colors.tagNormalColor }} />
                    {/* <Text style={styles.dashboardTimeAgoText}>{(this.state.dashboardNewsData.length > 0) ? (this.state.dashboardNewsData[0].published_date != undefined && this.state.dashboardNewsData[0].published_date != '') ? moment(this.state.dashboardNewsData[0].published_date).fromNow() : null : null}</Text> */}
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 0.6}}>
                    <Text style={styles.dashboardRandomText}>{this.state.secondGreetingMsg}</Text>
                  </View>
                  <View style={{ flex: 0.4, alignItems: 'flex-end', alignSelf: 'flex-end'}}>
                    <Text style={styles.dashboardTimeAgoText}>{(this.state.dashboardNewsData.length > 0) ? (this.state.dashboardNewsData[0].published_date != undefined && this.state.dashboardNewsData[0].published_date != '') ? moment(this.state.dashboardNewsData[0].published_date).fromNow() : null : null}</Text>
                  </View>
                </View>
                {
                  this.renderTopNewsViewAccoringLength()

                }

              </View>
              {/* <View style={styles.dashboardMainTopView} /> */}
            </View>

          </View>
          <TouchableWithoutFeedback onPress={() => this.navigateToStockMarket()}>
            <View style={styles.mainMarketDataStyle}>
              <Image onLoad={this.handleImageLoaded.bind(this)} source={bgMakretImg} style={styles.marketBgStyle} resizeMode={'cover'} />
              {/* <Image source={bgMakretImg} style={styles.marketBgStyle} resizeMode={'cover'} key={1} defaultSource={stock.news_placeholder}/> */}
              <View style={[styles.dashboardTopHeaderTransparent, { marginTop: 0, flexDirection: 'column' }]}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={[styles.leftTopView, { marginTop: -8 }]}>
                    <Text style={[styles.dashboardNewsTitle]}>Market</Text>
                    <Text style={[styles.dashboardNewsTitle, { fontSize: globals.font_10, fontWeight: '200' }]}>View stocks and market news</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image source={dashboard.whiteStock} resizeMode={'contain'} style={[styles.rightTopImageStyle, { height: 27, width: 36 }]} />
                  </View>
                </View>
                <View style={styles.bottomMarketView}>
                  <Text style={styles.dashboardMarketTrendingTitle}>Trending Today</Text>
                </View>
                <View style={styles.dashboardMarketMainView}>
                  <View style={styles.dashboardBottomMarketViewStyle}>
                    <Text style={styles.txtMarketType}>Top Gainer</Text>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                      <View style={[styles.bottomSeprateLine, { backgroundColor: colors.greenMarketLine }]} />{
                        (this.state.dashboardMarketData != null && this.state.dashboardMarketData != undefined) ?
                          <View style={{ flexDirection: 'column', marginLeft: 5, marginBottom: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={styles.marketSymbolNameStyle}>{this.state.dashboardMarketData.topgainers.symbol}</Text>
                              <FontAwesomeIcon size={12} name="caret-up" color={colors.greenColor} style={{ marginLeft: 3 }} />
                            </View>
                            <Text style={[styles.marketSymbolNameStyle, { fontSize: 16, letterSpacing: 0.19 }]}>{this.state.dashboardMarketData.topgainers.last}</Text>
                            <Text style={[styles.marketSymbolNameStyle, { fontSize: 10, letterSpacing: 0.12, color: colors.greenColor }]}> +{this.state.dashboardMarketData.topgainers.change} ( {this.state.dashboardMarketData.topgainers.per_change}%)</Text>
                          </View> : null
                      }
                    </View>
                  </View>
                  <View style={styles.dashboardBottomMarketViewStyle}>
                    <Text style={styles.txtMarketType}>Top Loser</Text>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                      <View style={[styles.bottomSeprateLine, { backgroundColor: colors.redMarketLine }]} />{
                        (this.state.dashboardMarketData != null && this.state.dashboardMarketData != undefined) ?
                          <View style={{ flexDirection: 'column', marginLeft: 5, marginBottom: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={styles.marketSymbolNameStyle}>{this.state.dashboardMarketData.toplosers.symbol}</Text>
                              <FontAwesomeIcon size={12} name="caret-down" color={colors.redColor} style={{ marginLeft: 3 }} />
                            </View>
                            <Text style={[styles.marketSymbolNameStyle, { fontSize: 16, letterSpacing: 0.19 }]}>{this.state.dashboardMarketData.toplosers.last}</Text>
                            <Text style={[styles.marketSymbolNameStyle, { fontSize: 10, letterSpacing: 0.12, color: colors.redMarketLine }]}> +{this.state.dashboardMarketData.toplosers.change} ( {this.state.dashboardMarketData.topgainers.per_change}%)</Text>
                          </View> : null
                      }
                    </View>
                  </View>
                  <View style={styles.dashboardBottomMarketViewStyle}>
                    <Text style={styles.txtMarketType}>Most Active</Text>
                    <View style={{ flexDirection: 'row', marginTop: 15, paddingBottom: 15 }}>
                      <View style={[styles.bottomSeprateLine, { backgroundColor: colors.yellowMarketLine }]} />{
                        (this.state.dashboardMarketData != null && this.state.dashboardMarketData != undefined) ?
                          <View style={{ flexDirection: 'column', marginLeft: 5, marginBottom: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={styles.marketSymbolNameStyle}>{this.state.dashboardMarketData.mostactives.symbol}</Text>
                              <FontAwesomeIcon size={12} name='flash' color={colors.flashYellow} style={{ marginLeft: 3 }} />
                            </View>
                            <Text style={[styles.marketSymbolNameStyle, { fontSize: 16, letterSpacing: 0.19 }]}>{this.state.dashboardMarketData.mostactives.last}</Text>
                            <Text style={[styles.marketSymbolNameStyle, { fontSize: 10, letterSpacing: 0.12, color: colors.redMarketLine }]}> +{this.state.dashboardMarketData.mostactives.change} ( {this.state.dashboardMarketData.topgainers.per_change}%)</Text>
                          </View> : null
                      }
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* </View> */}
          </TouchableWithoutFeedback>
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
  getShowModalSelectBankAccount
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

