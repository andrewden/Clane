import React from 'react';
import { AppRegistry, NetInfo, AsyncStorage, StatusBar, Text, Platform, Dimensions,AppState } from 'react-native';
import { Provider } from 'react-redux';
import Countly from 'countly-sdk-react-native';
import RootNav from "./containers/navigators/_RootNavigator";
import * as globals from '../app/lib/globals';
import store from './store';
import DeviceInfo from 'react-native-device-info';
import { API } from './lib/api';
import firebase from 'react-native-firebase';
import bgMessaging from "../bgMessaging";
let deviceId = DeviceInfo.getUniqueID();
var oldDevice_ID = null;
var str_user_ID = null;
let _this = null;
import CategoryNewsArticle from './containers/screens/Stocks/categoryNewsArticle';
import Instabug from 'instabug-reactnative';
import Intercom from 'react-native-intercom';

Countly.isDebug = true; // Set to true to see the logs
class claneapp extends React.Component {

  constructor(props) {
    super(props);
    this.trace = null;
    _this = this;
    // Instabug.startWithToken('33e6c52c8b06b4e5fe0249fd8d132471', [Instabug.invocationEvent.shake]);
    this.state = {
      appState: AppState.currentState,
    };
  }


  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    // Intercom.registerIdentifiedUser({ userId: 'Bob' });
    // Intercom.logEvent('viewed_screen', { extra: 'metadata' });
    // console.log("clane - After logevent - Before message composer")
    // Intercom.displayMessageComposer();
    // Intercom.displayMessageComposerWithInitialMessage('Initial Message');
    // console.log("clane - After message composer")



    firebase.analytics().logEvent(globals.event_AppOpen,
      globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
      
    AsyncStorage.getItem(globals.user_authsecret).then((value) => {
      if (value !== null) {
        globals.Authsecret = value;
      }
    });

    console.disableYellowBox = true;

    //countly start, begin
    Countly.begin("https://try.count.ly", "f91c9360f765725f56e5a3ae8ebf29a9279ca5f4", deviceId)
      .then((result) => {
        console.log("=====Begining Of Countly, result=> " + result);
      })
      .catch((err) => {
        console.log("=====Returns Error => " + err);
      });

    // From second session and further start session
    Countly.start()
      .then((result) => {
        console.log("=====Starting Of Countly session, result=> " + result);
      })
      .catch((err) => {
        console.log("=====Returns Error => " + err);
      });


    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    const channel = new firebase.notifications.Android.Channel('clane-channel', 'Clane Channel', firebase.notifications.Android.Importance.Max)
      .setDescription('Clane apps test channel');

    // Create the channel
    firebase.notifications().android.createChannel(channel);

    StatusBar.setBarStyle("light-content");

    console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];

    NetInfo.isConnected.fetch().then(isConnected => {
      globals.isInternetConnected = isConnected;
      console.log("Internet Check-->", globals.isInternetConnected)
    });

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );


    AsyncStorage.getItem(globals.user_Id).then((user_Id) => {
      if (user_Id !== null) {
        str_user_ID = user_Id;
        if (globals.isInternetConnected) {
            API.getNewRefreshedToken(this.refreshTokenResponseData);
        }
       
      }
    });



    AsyncStorage.getItem(globals.currentNavigator).then((value) => {
      globals.currentNavigatorValue = value;
    }, () => console.log("Change value" + globals.currentNavigatorValue));

    StatusBar.setHidden(false, null);
  }

  async setFirebaseEvents() {
    AsyncStorage.getItem(globals.aysnc_firstAppOpen).then((result) => {
      if (result == 'true') {
        var event = { "key": globals.event_FirstLaunch, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
        Countly.recordEvent(event);
        console.log("=====segmentation record event globals.event_FirstLaunch, result=> ");

        firebase.analytics().logEvent(globals.event_FirstLaunch,
          globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
        // AsyncStorage.setItem(globals.aysnc_firstAppOpen, 'true');
      }
    });

   
    firebase.analytics().setAnalyticsCollectionEnabled(true)
    firebase.perf().setPerformanceCollectionEnabled(true)
    this.trace = firebase.perf().newTrace('cache_trace');
    await this.trace.start();
    await this.trace.putAttribute(globals.event_OSType, Platform.OS);
    await this.trace.putAttribute(globals.event_OSVersion, DeviceInfo.getSystemVersion());
    let resolution = Math.floor(Dimensions.get('window').width) + 'x' + Math.floor(Dimensions.get('window').height)
    await this.trace.putAttribute(globals.event_DeviceResolution, resolution);
    await this.trace.putAttribute(globals.event_DeviceLanguage, DeviceInfo.getDeviceLocale());
    await this.trace.putAttribute(globals.event_CarrierName, DeviceInfo.getCarrier());

    console.log('====================================');
    console.log('firebase performance' + JSON.stringify(firebase.perf()));
    console.log('====================================');

    // AsyncStorage.getItem(globals.aysnc_firstAppOpen).then((result) => {
    //   alert(result)
    //   if (result == null) {
    //     var event = { "key": globals.event_FirstLaunch, "count": 1 };
    //     event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
    //     Countly.recordEvent(event);
    //     console.log("=====segmentation record event globals.event_FirstLaunch, result=> ");

    //     firebase.analytics().logEvent(globals.event_FirstLaunch,
    //       globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
    //     // AsyncStorage.setItem(globals.aysnc_firstAppOpen, 'true');
    //   }
    // });


    // firebase.analytics().logEvent(globals.event_AppOpen,
    //   globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));

  }

  handleFirstConnectivityChange(isConnected) {
    globals.isInternetConnected = isConnected;
    console.log("Internet Check 1-->", isConnected)

    NetInfo.getConnectionInfo().then((connectionInfo) => {
      console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
      networkInfo = connectionInfo.type + '_' + connectionInfo.effectiveType
      globals.carrierNetworkStr = connectionInfo.type
      globals.carrierNetworkTypeStr = connectionInfo.effectiveType

      _this.setFirebaseEvents();
    });
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      globals.globalVars.appForgroundCome = true ;
      CategoryNewsArticle.callBackgroundAPICall();
    }
    this.setState({appState: nextAppState});
  };
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    AppState.removeEventListener('change', this._handleAppStateChange);

  }

  /** 
   * Method to handle response of update device method
  */
  responseData = {
    success: (response) => {
      console.log("response-->" + response);
      try {
        AsyncStorage.setItem(globals.user_deviceId, deviceId);
      } catch (error) {
        console.log("Error-->" + error);
      }
    },
    error: (err) => {
      console.log('Update device error ==== ' + JSON.stringify(err));
    },
    complete: () => {
    }
  }

  /** 
   * Method to handle response of refresh token method
  */
  refreshTokenResponseData = {
    success: () => {
      try {
        AsyncStorage.getItem(globals.user_deviceId).then((oldDeviceId) => {
          if (oldDeviceId !== null) {
            oldDevice_ID = oldDeviceId;
            if (deviceId != oldDeviceId) {
              globals.globalVars.userId_Global = str_user_ID;
              if (globals.isInternetConnected) {
                API.updateDeviceID(this.responseData, deviceId, oldDevice_ID, true);
              }
            }
          }
        });
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

  render() {
    return (
      <Provider store={store}>
        <RootNav />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('claneapp', () => claneapp);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);