import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import branch, { BranchEvent } from 'react-native-branch'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { changeTheme } from '../../../redux/actions/changeTheme';
import { HeaderBackButton } from 'react-navigation';

import Markets from './markets';
import { NavigationActions, StackActions } from 'react-navigation';
import Indices from './indices';
import styles from './style';
import globalStyles from '../../../assets/styles/globalStyles';
import SearchBarScreen from '../Stocks/searchBarScreen';
import { getShowModalSearchBar } from '../../../redux/actions/showModalSearchBar';
import { getShowModalNewsSearchBar } from '../../../redux/actions/showModalNewsSearchBar';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';
import { API } from '../../../lib/api';
import { RemoteMessage } from 'react-native-firebase';
import phoneOTP from '../Authentication/phoneOTP';
import SafariView from 'react-native-safari-view';

_unsubscribeFromBranch = null
var _this = null;
let width = Dimensions.get('window');
const initialLayout = {
  height: 0,
  width: globals.WINDOW.width,
};
this.marketStatus = null
class StockTabs extends Component {

  static navigationOptions = ({ navigation, screenProps, }) => {
    const { state } = navigation;
    console.log("navigation --> " + JSON.stringify(navigation));

    return {
      headerTitle: globals.screenTitle_market,

      headerTitleStyle:[globalStyles.headerTitleStyle, { color: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.titleColor : colors.blackColor}],

      headerStyle: { backgroundColor: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.bgColor : colors.white, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 , tintColor: colors.blackColor},
      // header:null,
      headerRight:
        <TouchableOpacity onPress={() => _this.props.getShowModalSearchBar(true, globals.screenTitle_market)}>
          <Ionicons name="ios-search" size={30} color={(navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.iconColor : colors.backLight} style={{ marginRight: 10 }} />
        </TouchableOpacity>,
      headerLeft: <View style={{ flexDirection: 'row' }}>
        <HeaderBackButton onPress={() => _this.goBackToPreviousScreen()} title='' tintColor={(navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.iconColor : colors.backLight} />
      </View>,
     
     }
  }

  goBackToPreviousScreen() {
    this.props.navigation.goBack(null)
    StatusBar.setBarStyle("light-content");
  }

  constructor(props) {
    super(props);
    console.log('============THEME MARKET========================' + JSON.stringify(this.props))
    _this = this
  }
 

    componentDidMount() {
    AsyncStorage.getItem(globals.currentNavigator).then((value) => {
      globals.currentNavigatorValue = value;
    });
    console.log("globals.currentNavigatorValue DIDmount " + globals.currentNavigatorValue);
    StatusBar.setBarStyle((this.props.marketStatus) ? "dark-content" : 'light-content');
    // firebase.messaging().hasPermission()
    //   .then(enabled => {
    //     if (enabled) {
    //       this.getFcmToken()
    //     } else {
    //       //If the user has not already granted permissions, then you can prompt them to do so, as follows
    //       firebase.messaging().requestPermission()
    //         .then(() => {
    //           this.getFcmToken()
    //           firebase.messaging().sendMessage(message);
    //         })
    //         .catch(error => {
    //           // alert("You have to give permission for Notification from App setting")
    //         });
    //     }
    //   });
    
   
    // this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
    //   this.setState({
    //     Message: notification.body
    //   }, () => console.log("Slience Notification" + notification))
    // });
    

    this.setState({ themeStyle: this.props.theme })
    this.marketStatus = this.props.marketStatus
    this.props.navigation.setParams({ bgColor: (this.props.marketStatus) ? colors.white : colors.blackThemeColor, titleColor: (this.props.marketStatus) ? colors.blackColor : colors.white, iconColor: (this.props.marketStatus) ? colors.blue : colors.white })
    
    if (Platform.OS === 'android') {
    
      if (this.props.marketStatus) {
        StatusBar.setBackgroundColor(colors.blue, true);
      } else {
        StatusBar.setBackgroundColor(colors.blackThemeColor, true);
      }

    }
    
    // if (globals.isInternetConnected) {
    //   if (Platform.OS== 'ios') {
    //     branch.initSessionTtl = 5000;
    //  }
    //   _unsubscribeFromBranch = branch.subscribe(({ error, params }) => {
    //     try {
    //       console.log("PARAMS:--- : ----", JSON.stringify(params))

    //       if (params) {
    //         console.log("PARAMS:---", JSON.stringify(params))
    //         if ((params['+clicked_branch_link']) == true) {
    //           if ((params['$og_title']) == 'News Sharing') {
    //             // alert('News link')
    //             if (Platform.OS=='ios') {
    //                SafariView.isAvailable()
    //             .then(SafariView.show({
    //                 url: (params['$ios_url']),
    //                 barTintColor: colors.white,
    //                 readerMode: true,
    //             }))
    //             .catch(error => {
    //                 // Fallback WebView code for iOS 8 and earlier
    //             });
    //             }else{
    //               _this.props.navigation.navigate("NewsAndroidWebview", {screen_name:'DeepView', open_url: (params['$android_url']), title: (params['$og_description'])})
    //             }
               
    //           }
    //           else{
    //             var stockdata = _this.parseQueryString(params.$ios_url)
    //             if (stockdata.key == "stock") {
    //               _this.props.navigation.navigate("StockDetails", { stock_id: stockdata.stock_id || "", symbol: stockdata.symbol || "" })
    //             }
    //             else {
    //               // no data
    //               console.log("else _unsubscribeFromBranch : ", JSON.stringify(params))
    //             }
    //           }
              
    //         }
    //       }
    //     } catch (error) {
    //       console.log(error);
          
    //     }
        
    //   })
    //  }
   }
    

  // async getFcmToken() {
  //   firebase.messaging().getToken()
  //     .then(fcmToken => {
  //       if (fcmToken) {
  //         console.log("TOKEN" + fcmToken)
  //         AsyncStorage.setItem(globals.fcm_token, fcmToken);
  //       } else {
  //         console.log("NO--TOKEN")
  //       }
  //     });

  //   this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
  //     // Process your message as required
  //     console.log("DATAAAA", message);
  //     console.log("DATA SECret " + message._data.secret);
  //     globals.Pushsecret = message._data.secret;
  //     firebase.analytics().logEvent(globals.event_ReceivedOTP, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
  //     firebase.analytics().logEvent(globals.event_PushNotificationofstocksinwatchlist, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));

  //   });

  //   //A notification will trigger one of two listeners depending on the state of your application
  //   //onNotificationDisplayed - Triggered when a particular notification has been displayed
  //   this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
  //     // Process your notification as required
  //     // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
  //     console.log("Notification display Listener Message ====>>>>", notification)
  //   });

  //   //onNotification - Triggered when a particular notification has been received
  //   this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
  //     // Process your notification as required
  //     this.setState({
  //       Message: notification.body
  //     }, () => console.log(notification))
  //     console.log("Notification Listener Message ====>>>>", notification)
  //   });

  //   // If your app is in the foreground, or background, you can listen for when a notification is clicked / tapped / opened as follows
  //   this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {

  //     // Get the action triggered by the notification being opened
  //     const action = notificationOpen.action;

  //     // Get information about the notification that was opened
  //     const notification: Notification = notificationOpen.notification;
  //     this.setState({
  //       Message: notification.body
  //     })      
         
  //     console.log("Notification opened Message ====>>>>",notification._data.target)
  //     console.log("Notif TItle>>>>> "+JSON.stringify(this.props));
  //      //this.reset();
  //     this.props.getShowModalSearchBar(false)
  //     this.props.getShowModalNewsSearchBar(false)

  //     AsyncStorage.getItem(globals.currentNavigator).then((value) => {
  //       globals.currentNavigatorValue = value;
  //     });

  //     setTimeout(() => {
  //       console.log("globals.currentNavigatorValue " + globals.currentNavigatorValue);
  //       if (notification._data.target == 'watchlist') {
  //         if (globals.currentNavigatorValue == "WatchList") {
  //           const resetAction = StackActions.reset({
  //             index: 0,
  //             actions: [NavigationActions.navigate({ routeName: 'WatchList' })],
  //           });
  //           this.props.navigation.dispatch(resetAction);
  //         }
  //         else {
  //           this.props.navigation.navigate('Watchlist')
  //         }
  //       }
  //     }, 100);
  //   });

  //   //If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows
  //   const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
  //   if (notificationOpen) {
  //     // App was opened by a notification
  //     // Get the action triggered by the notification being opened
  //     const action = notificationOpen.action;

  //     // Get information about the notification that was opened
  //     const notification: Notification = notificationOpen.notification;
  //     this.setState({
  //       Message: notification.body
  //     })

  //     console.log("Notification notificationOpen  Message ====>>>>", notification._data.target)
  //     AsyncStorage.getItem(globals.currentNavigator).then((value) => {
  //       globals.currentNavigatorValue = value;
  //     });

  //     setTimeout(() => {
  //       console.log("globals.currentNavigatorValue " + globals.currentNavigatorValue);
  //       if (notification._data.target == 'watchlist') {
  //         if (globals.currentNavigatorValue == "WatchList") {
  //           const resetAction = StackActions.reset({
  //             index: 0,
  //             actions: [NavigationActions.navigate({ routeName: 'WatchList' })],
  //           });
  //           this.props.navigation.dispatch(resetAction);
  //         }
  //         else {
  //           this.props.navigation.navigate('Watchlist')
  //         }
  //       }
  //     }, 100);
  //   }

  //   // Build a channel
  //   const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
  //     .setDescription('My apps test channel');

  //   // Create the channel
  //   firebase.notifications().android.createChannel(channel);

  //   // Build a channel group
  //   const channelGroup = new firebase.notifications.Android.ChannelGroup('test-group', 'Test Channel Group');

  //   // Create the channel group
  //   firebase.notifications().android.createChannelGroup(channelGroup);

  //   // Set up your listener
  //   firebase.notifications().onNotificationOpened((notificationOpen) => {
  //     // notificationOpen.action will equal 'test_action'
  //     this.setState({
  //       Message: notificationOpen.notification.body
  //     })
  //   });

  //   async (notificationOpen: NotificationOpen) => {
  //     if (notificationOpen.action === 'snooze') {
  //       // handle the action
  //     }
  //     return Promise.resolve();
  //   }
  // }


  // reset() {
  //   return this.props
  //     .navigation
  //     .dispatch(NavigationActions.reset(
  //       {
  //         index: 0,
  //         actions: [
  //           NavigationActions.navigate({ routeName: 'Watchlist' })
  //         ]
  //       }));
  // }


  // async firebasePushNotificationConfiguration() {

  //   firebase.messaging().hasPermission()
  //     .then(enabled => {
  //       if (enabled) {
  //         this.getFcmToken()
  //       } else {
  //         //If the user has not already granted permissions, then you can prompt them to do so, as follows
  //         firebase.messaging().requestPermission()
  //           .then(() => {
  //             this.getFcmToken()
  //             firebase.messaging().sendMessage(message);
  //           })
  //           .catch(error => {
  //             Alert.alert(globals.APP_NAME,"You have to give permission for Notification from App setting")
  //           });
  //       }
  //     });
  // }

  // fireBaseToken() {
  //   firebase.messaging().getToken()
  //   .then(fcmToken => {
  //     if (fcmToken) {
         
  //     } else {
  //       // user doesn't have a device token yet
  //     } 
  //   });
  // }

  componentWillUnmount() {
    StatusBar.setBarStyle("light-content");
  }

  // parseQueryString(query) {
  //   var obj = {},
  //     qPos = query.indexOf("?"),
  //     tokens = query.substr(qPos + 1).split('&'),
  //     i = tokens.length - 1;
  //   if (qPos !== -1 || query.indexOf("=") !== -1) {
  //     for (; i >= 0; i--) {
  //       var s = tokens[i].split('=');
  //       obj[unescape(s[0])] = s.hasOwnProperty(1) ? unescape(s[1]) : null;
  //     };
  //   }
  //   return obj;
  // }

  // handleOpenURL(event) {
  //   if (event.url != undefined) {
  //     const route = event.url.replace(/.*?:\/\//g, '');
  //     var stockdata = route.split("/")

  //     if (stockdata[0] == "stock") {
  //       _this.props.navigation.navigate("StockDetails", { stock_id: stockdata[1], symbol: stockdata[2] })
  //     }
  //   }
  // }

  componentWillReceiveProps(newProps) {
    this.setState({ modalVisible: newProps.searchbar_modal })
    if (newProps.theme != undefined) {
      this.setState({ themeStyle: newProps.theme })
    }
    if (newProps.marketStatus != undefined) {
      console.log("this.marketStatus " + this.marketStatus);
      console.log("newProps.marketStatus " + newProps.marketStatus);

      if (this.marketStatus !== newProps.marketStatus) {
        StatusBar.setBarStyle((newProps.marketStatus) ? "dark-content" : 'light-content');
        this.marketStatus = newProps.marketStatus
        this.props.navigation.setParams({ bgColor: (newProps.marketStatus) ? colors.blue : colors.blackThemeColor, titleColor: (newProps.marketStatus) ? colors.blackColor : colors.white, iconColor: (newProps.marketStatus) ? colors.blue : colors.white })
        if (newProps.marketStatus) {
          StatusBar.setBackgroundColor(colors.blue, true);
        } else {
          StatusBar.setBackgroundColor(colors.blackThemeColor, true);
        }
      }
    }
  }

  static _goToStockDetaill(data) {
    globals.currentNavigatorValue = "Market";
    AsyncStorage.setItem(globals.currentNavigator, "Market");
    _this.props.navigation.navigate('StockDetails', data)
  }

  static _goToIndicesDetail(data) {
    _this.props.navigation.navigate('IndicesDetail', data)
  }

  state = {
    index: 0,
    themeStyle: null,
    modalVisible: this.props.searchbar_modal,
    routes: [
      { key: 'markets', title: 'Trending', navigation: this.props.navigation },
      { key: 'indices', title: 'Indices', navigation: this.props.navigation }
      // 
    ],
  };

  _handleIndexChange = index =>
    this.setState({ index, });

  _renderHeader = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={(this.state.themeStyle != null) ? this.state.themeStyle.indicator : ""}
      style={[(this.state.themeStyle != null) ? this.state.themeStyle.tabbar : "",]}
      tabStyle={[(this.state.themeStyle != null) ? this.state.themeStyle.tab : "", { width: globals.WINDOW.width / 2 }]}
      labelStyle={(this.state.themeStyle != null) ? this.state.themeStyle.label : ""}
    />
  );

  _renderScene = SceneMap({
    markets: Markets,
    indices: Indices,
  });

  handleCloseModal() {
    this.props.getShowModalSearchBar(false)
  }

  searchModal() {
    return (
      <Modal animationType='fade' visible={this.state.modalVisible} onRequestClose={() => { this.handleCloseModal() }}>
        <SearchBarScreen data={StockTabs._goToStockDetaill.bind(this)} />
      </Modal>
    )
  }

  render() {
    return (

      <View style={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
        <TabViewAnimated
          keyboardShouldPersistTaps='handled'
          style={styles.topBackgroundView}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onIndexChange={this._handleIndexChange}
          initialLayout={initialLayout}
        />
        {this.searchModal()}
      </View>
    );
  }
}

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
  return {
    theme: state.changeTheme_red.theme,
    searchbar_modal: state.showModalSearchBar_red.searchbar_modal,
    marketStatus: state.checkMarketStatus_red.marketStatus,
    screen_name: state.showModalSearchBar_red.screen_name,
  }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
  changeTheme,
  getShowModalSearchBar,
  getShowModalNewsSearchBar,
  checkMarketStatus
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(StockTabs);