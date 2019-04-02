import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  PermissionsAndroid,
  Image,
  Platform
} from 'react-native';
import Countly from 'countly-sdk-react-native';
import styles from './style';
import { auth } from '../../../assets/images/map'
import { bindActionCreators } from 'redux';
import { getshowModal } from '../../../redux/actions/showModal';
import Button from '../../../components/Button';
import NumericKeyboard from '../../../components/NumericKeyboard';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import globalStyles from '../../../assets/styles/globalStyles';
import WatchList from '../Stocks/watchlist';
import StockDetail from '../Stocks/stockDetails';
import DeviceInfo from 'react-native-device-info';
import CryptoJS from "crypto-js";
import { API } from '../../../lib/api';
import { getshowLoader } from '../../../redux/actions/showLoaderModal';
import firebase from 'react-native-firebase';
import CategoryNewsArticle from '../Stocks/categoryNewsArticle'
import TimerCountdown from "react-native-timer-countdown";
import NewsSearchDetail from '../InitialStock/newsSearchDetail'

let deviceId = DeviceInfo.getUniqueID();
const os = DeviceInfo.getSystemName();

var arr = [];
var _this = null;
var password = null;
var userId = null;


class PhoneOTP extends Component {

  cancelCloseModel(navigation) {
    navigation.dismiss();
    arr = [];
  }

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: globals.screenTitle_otp,
      // header: (navigation.state.params != null) ? navigation.state.params.header : null,
      headerTintColor: colors.white,
      headerStyle: globalStyles.navigationHeaderStyle,
      gesturesEnabled: false,
      headerRight: <TouchableOpacity style={{ paddingRight: 15 }} underlayColor='transparent' onPress={() => _this.cancelCloseModel(navigation)}><Text style={globalStyles.cancelButton}>{globals.cancel}</Text></TouchableOpacity>,
    }
  }

  constructor(props) {
    super(props);
    _this = this;
    this.state = {
      PasswordmodalVisible: false,
      isResendClick: false,
      isTimeOut: false,
      // isAlertViewVisible: false,
      mobile: '',
      flow: '',
      userId: '',
      text1: '',
      text2: '',
      text3: '',
      text4: '',
      password: '',
      pushSecret: '',
      background1: colors.purpleLight,
      background2: colors.purpleDark,
      background3: colors.purpleDark,
      background4: colors.purpleDark,
      hideButtons : true,
      otpMode : "sms",
      isShowTimer: false,
      real_mobile: this.props.navigation.state.params.real_mobile,
      country_code: this.props.navigation.state.params.country_code

    };
  }

  componentDidMount() {
    this.requestReadSmsPermission();
    this.setState({ mobile: this.props.navigation.state.params.mobile });
    this.setState({ flow: this.props.navigation.state.params.flow });
    this.setState({ userId: this.props.navigation.state.params.userId });
    this.setState({ title: this.props.navigation.state.params.title });
    this.setState({ password: this.props.navigation.state.params.password });
    password = this.props.navigation.state.params.password;
    userId = this.props.navigation.state.params.userId;
    console.log("PUSH OATH " + this.props.navigation.state.params.password);
     

  }

  /**
   * Method for generate secret
   * @param {*} push_secrat 
   */
  static generateSecret(push_secrat) {
    console.log("generateSecret psuh>>>>" + push_secrat);
    push_secrat && _this.setState({ pushSecret: push_secrat });
    console.log("generateSecret " + globals.Authsecret);
  }

  /**
   * Method for press key in keyboard
   * @param {*} number 
   */
  on_KeyboardPress(number) {
    if (Number.isSafeInteger(number) === true) {
      if (arr.length < 4) {
        arr.push(number);
        switch (arr.length) {
          case 1:
            this.setState({
              text1: arr[0].toString(),
              background1: colors.purpleDark,
              background2: colors.purpleLight
            });
            break;

          case 2:
            this.setState({
              text2: arr[1].toString(),
              background2: colors.purpleDark,
              background3: colors.purpleLight
            });
            break;

          case 3:
            this.setState({
              text3: arr[2].toString(),
              background3: colors.purpleDark,
              background4: colors.purpleLight
            });
            break;

          case 4:
            this.setState({
              text4: arr[3].toString(),
              background4: colors.purpleDark
            });
            this.ValidateField();
            break;

          default:
            break;
        }
      }
    } else if (number === 'del') {
      switch (arr.length) {
        case 1:
          this.setState({ text1: '', background1: colors.purpleLight, background2: colors.purpleDark, background3: colors.purpleDark, background4: colors.purpleDark });
          break;

        case 2:
          this.setState({
            text1: arr[0].toString(),
            text2: '',
            background1: colors.purpleDark,
            background2: colors.purpleLight,
            background3: colors.purpleDark,
            background4: colors.purpleDark
          });
          break;

        case 3:
          this.setState({
            text1: arr[0].toString(),
            text2: arr[1].toString(),
            text3: '',
            background1: colors.purpleDark,
            background2: colors.purpleDark,
            background3: colors.purpleLight,
            background4: colors.purpleDark
          });
          break;

        case 4:
          this.setState({
            text1: arr[0].toString(),
            text2: arr[1].toString(),
            text3: arr[2].toString(),
            text4: '',
            background1: colors.purpleDark,
            background2: colors.purpleDark,
            background3: colors.purpleDark,
            background4: colors.purpleLight
          });
          break;

        default:
          break;
      }
      arr.pop();
    }
  }

  loginAPIAuthenticationWSCall() {
    if (globals.isInternetConnected) {
      this.props.getshowLoader(true);
      try {
        AsyncStorage
          .getItem('@UserID:key')
          .then((value) => {
            globals.globalVars.userIdTemp_Global = value;
            var data = {
              deviceId: deviceId,
              pwd: _this.hashPassword(password, globals.globalVars.userSalt)
            };
            API.login_with_authentication(_this.responseDataLoginAuthentication, data, true);
          });
      } catch (error) {
        console.log("error ttt" + error);
      }
    } else {
      alert(globals.networkNotAvailable);
    }
  }

  // ********************** Generate encrypted password method **********************

  hashPassword(password, returned_salt) {
    return CryptoJS
      .PBKDF2(password, returned_salt, {
        keySize: 256 / 32,
        iterations: 1000
      })
      .toString().toLowerCase();
  }

  responseDataLoginAuthentication = {
    success: (response) => {
      try {
        AsyncStorage.setItem('@UserID:key', this.props.navigation.state.params.userId);
        AsyncStorage.setItem('@AuthenticateAccessToken:key', response.data.token.accessToken);
        AsyncStorage.setItem('@AuthenticateRefreshToken:key', response.data.token.refreshToken);
        AsyncStorage.setItem(globals.user_authsecret, globals.Authsecret);
        AsyncStorage.setItem('@RegistrationType:key', '1');
        AsyncStorage.setItem(globals.user_deviceId, deviceId);

        globals.globalVars.userIdTemp_Global = this.props.navigation.state.params.userId;
        globals.globalVars.AuthAccessToken = response.data.token.accessToken;
        globals.globalVars.AuthRefreshToken = response.data.token.refreshToken;
        globals.userAuthenticates = true;

        globals.globalVars.userId_Global = globals.globalVars.userIdTemp_Global;

        console.log('====================================')
        console.log('globals.userIdTemp_Global ' + globals.globalVars.userIdTemp_Global)
        console.log('====================================')
        if (globals.globalVars.dashboardTitle === globals.screenTitle_watchlist) {
          globals.isLoggedIn = "true";
          this.props.navigation.dismiss()
          _this.props.getshowLoader(false);
          API.watchlistData(this.responseWatchListData, false);
          AsyncStorage.setItem(globals.aysnc_isLoggedIn, "true");
          AsyncStorage.setItem(globals.aysnc_loggedInNumber, this.props.navigation.state.params.real_mobile);
          AsyncStorage.setItem(globals.aysnc_loggedInCountryCode, this.props.navigation.state.params.country_code);

          firebase.analytics().setUserId(globals.globalVars.userId_Global);

          if (this.state.flow == 'registration') {

            var event = { "key": globals.event_Registration, "count": 1 };
            event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_Registration, result=> ");

            var event = { "key": globals.event_PhoneNumber, "count": 1 };
            event.segmentation = Object.assign({}, { PhoneNumber: this.state.mobile }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, this.props.navigation.state.params.mobile));
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_PhoneNumber, result=> ");

            firebase.analytics().logEvent(globals.event_Registration, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
            firebase.analytics().logEvent(globals.event_PhoneNumber, Object.assign({}, { PhoneNumber: this.state.mobile }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
          } else {

            var event = { "key": globals.event_Login, "count": 1 };
            event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_Registration, result=> ");

            var event = { "key": globals.event_PhoneNumber, "count": 1 };
            event.segmentation = Object.assign({}, { PhoneNumber: this.state.mobile }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, this.props.navigation.state.params.mobile));
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_PhoneNumber, result=> ");

            firebase.analytics().logEvent(globals.event_Login, Object.assign({}, { EventDetails: globals.globalVars.userIdTemp_Global }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
            firebase.analytics().logEvent(globals.event_PhoneNumber, Object.assign({}, { PhoneNumber: this.state.mobile }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
          }
        }
        else if (globals.globalVars.dashboardTitle === globals.screenTitle_stockdetail) {
          _this.props.navigation.dismiss();
          _this.props.getshowLoader(false);
          globals.isLoggedIn = "true";
          AsyncStorage.setItem(globals.aysnc_isLoggedIn, "true");
          AsyncStorage.setItem(globals.aysnc_loggedInNumber, this.props.navigation.state.params.real_mobile);
          AsyncStorage.setItem(globals.aysnc_loggedInCountryCode, this.props.navigation.state.params.country_code);

          firebase.analytics().setUserId(globals.globalVars.userId_Global);

          StockDetail.callWSToAddWatchlistAfterLogin();
          if (this.state.flow == 'registration') {

            var event = { "key": globals.event_Registration, "count": 1 };
            event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_Registration, result=> ");

            var event = { "key": globals.event_PhoneNumber, "count": 1 };
            event.segmentation = Object.assign({}, { PhoneNumber: this.state.mobile }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, this.props.navigation.state.params.mobile));
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_PhoneNumber, result=> ");

            firebase.analytics().logEvent(globals.event_Registration, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
            firebase.analytics().logEvent(globals.event_PhoneNumber, Object.assign({}, { PhoneNumber: this.state.mobile }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
          } else {

            var event = { "key": globals.event_Login, "count": 1 };
            event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_Registration, result=> ");

            var event = { "key": globals.event_PhoneNumber, "count": 1 };
            event.segmentation = Object.assign({}, { PhoneNumber: this.state.mobile }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, this.props.navigation.state.params.mobile));
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_PhoneNumber, result=> ");

            firebase.analytics().logEvent(globals.event_Login, Object.assign({}, { EventDetails: globals.globalVars.userIdTemp_Global }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
            firebase.analytics().logEvent(globals.event_PhoneNumber, Object.assign({}, { PhoneNumber: this.state.mobile }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
          }
        }
        
        else if (globals.globalVars.dashboardTitle === globals.screenTitle_Preferences) {
          _this.props.navigation.dismiss();
          _this.props.getshowLoader(false);
          globals.isLoggedIn = "true";
          AsyncStorage.setItem(globals.aysnc_isLoggedIn, "true");
          AsyncStorage.setItem(globals.aysnc_loggedInNumber, this.props.navigation.state.params.real_mobile);
          AsyncStorage.setItem(globals.aysnc_loggedInCountryCode, this.props.navigation.state.params.country_code);

          var event = { "key": globals.event_ChangePassword, "count": 1 };
          event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, this.props.navigation.state.params.mobile);
          Countly.recordEvent(event);
          console.log("=====segmentation record event globals.event_ChangePassword, result=> ");

          firebase.analytics().logEvent(globals.event_ChangePassword, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
        }
        else if (globals.globalVars.dashboardTitle === globals.screenTitle_NewsSummary || globals.globalVars.dashboardTitle === globals.screenTitle_TagPrefrence || globals.globalVars.dashboardTitle === globals.screenTitle_newsPreference || globals.globalVars.dashboardTitle === globals.screenTitle_Category) {
          //   NewsPreferences.callApi()
          if (Platform.OS =='android') {
            StatusBar.setHidden(false)
          }
            _this.props.navigation.dismiss();
              _this.props.getshowLoader(false);
              globals.isLoggedIn = "true";
              AsyncStorage.setItem(globals.aysnc_isLoggedIn, "true");
              AsyncStorage.setItem(globals.aysnc_loggedInNumber, this.props.navigation.state.params.real_mobile);
              AsyncStorage.setItem(globals.aysnc_loggedInCountryCode, this.props.navigation.state.params.country_code);

              AsyncStorage.getItem(globals.user_authsecret).then((value) => {
                  globals.Authsecret = value;
                  console.log("globals.Authsecret -->"+value);
                  DashboardNewsArticleDetail.callUserAllArtilceAPI();
                 });
              // firebase.analytics().logEvent(globals.event_ChangePassword, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
          }

            else if (globals.globalVars.dashboardTitle === globals.screenTitle_CategoryNewsArticle) {
            //   NewsPreferences.callApi()
              _this.props.navigation.dismiss();
                _this.props.getshowLoader(false);
                globals.isLoggedIn = "true";
                AsyncStorage.setItem(globals.aysnc_isLoggedIn, "true");
                AsyncStorage.setItem(globals.aysnc_loggedInNumber, this.props.navigation.state.params.real_mobile);
                AsyncStorage.setItem(globals.aysnc_loggedInCountryCode, this.props.navigation.state.params.country_code);

                AsyncStorage.getItem(globals.user_authsecret).then((value) => {
                    globals.Authsecret = value;
                    console.log("globals.Authsecret -->"+value);
                    CategoryNewsArticle.callUserActionAPI();
                   });
                // firebase.analytics().logEvent(globals.event_ChangePassword, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
            }
            else if (globals.globalVars.dashboardTitle === globals.screenTitle_NewsStockSearchModal) {
               //   NewsPreferences.callApi()
              _this.props.navigation.dismiss();
                _this.props.getshowLoader(false);
                globals.isLoggedIn = "true";
                AsyncStorage.setItem(globals.aysnc_isLoggedIn, "true");
                AsyncStorage.setItem(globals.aysnc_loggedInNumber, this.props.navigation.state.params.real_mobile);
                AsyncStorage.setItem(globals.aysnc_loggedInCountryCode, this.props.navigation.state.params.country_code);

                AsyncStorage.getItem(globals.user_authsecret).then((value) => {
                    globals.Authsecret = value;
                    console.log("globals.Authsecret -->"+value);
                    NewsSearchDetail.callUserActionAPI();
                   });
                // firebase.analytics().logEvent(globals.event_ChangePassword, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
            }

          else if (  globals.globalVars.dashboardTitle === globals.screenTitle_TagPrefrence || globals.globalVars.dashboardTitle === globals.screenTitle_newsPreference  ) {
                NewsPreferences.callApi()
                _this.props.navigation.dismiss();
                  _this.props.getshowLoader(false);
                  globals.isLoggedIn = "true";
                  AsyncStorage.setItem(globals.aysnc_isLoggedIn, "true");
                  AsyncStorage.setItem(globals.aysnc_loggedInNumber, this.props.navigation.state.params.real_mobile);
                  AsyncStorage.setItem(globals.aysnc_loggedInCountryCode, this.props.navigation.state.params.country_code);

                  AsyncStorage.getItem(globals.user_authsecret).then((value) => {
                      globals.Authsecret = value;
                      console.log("globals.Authsecret -->"+value);
                      
                     },()=>{
                      DashboardNewsArticleDetail.callUserAllArtilceAPI();
                     });
                  // firebase.analytics().logEvent(globals.event_ChangePassword, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
              }
         
        arr = [];
      } catch (error) {
        _this.props.getshowLoader(false);
        globals.isLoggedIn = "false";
        AsyncStorage.setItem(globals.aysnc_isLoggedIn, "false");

        // this.setState({ isAlertViewVisible: true })
        // this.props.navigation.setParams({ header: null })
        StatusBar.setHidden(false)

        this.setState({ text1: '', text2: '', text3: '', text4: '' })
        arr = [];
        if (this.state.flow == 'registration') {

          var event = { "key": globals.event_Registrationfailure, "count": 1 };
          event.segmentation =  Object.assign({}, { EventDetails: response.message }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
          Countly.recordEvent(event);
          console.log("=====segmentation record event globals.event_Registrationfailure, result=> ");

          firebase.analytics().logEvent(globals.event_Registrationfailure,
            Object.assign({}, { EventDetails: response.message }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
        } else {

          var event = { "key": globals.event_Loginfailure, "count": 1 };
          event.segmentation =  Object.assign({}, { EventDetails: response.message }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
          Countly.recordEvent(event);
          console.log("=====segmentation record event globals.event_Loginfailure, result=> ");


          firebase.analytics().logEvent(globals.event_Loginfailure,
            Object.assign({}, { EventDetails: response.message }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
            ));
        }
      }
    },
    error: (err) => {
      _this.props.getshowLoader(false);
      console.log("File Error " + JSON.stringify(err));
      if (err.code === 500 || err.code == 401 || err.code == 400) {
        globals.isLoggedIn = "false";
        alert(err.message)
      } else {
        globals.isLoggedIn = "false";
        AsyncStorage.setItem(globals.aysnc_isLoggedIn, "false");
        // this.setState({ isAlertViewVisible: true })
        // this.props.navigation.setParams({ header: null })
        StatusBar.setHidden(false)
        this.setState({ text1: '', text2: '', text3: '', text4: '' })
        arr = [];
        if (this.state.flow == 'registration') {
          var event = { "key": globals.event_Registrationfailure, "count": 1 };
          event.segmentation =  Object.assign({}, { EventDetails: JSON.stringify(err) }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
          Countly.recordEvent(event);
          console.log("=====segmentation record event globals.event_Registrationfailure, result=> ");
          firebase.analytics().logEvent(globals.event_Registrationfailure,
            Object.assign({}, { EventDetails: JSON.stringify(err) }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
          } else {
          var event = { "key": globals.event_Loginfailure, "count": 1 };
          event.segmentation =  Object.assign({}, { EventDetails: JSON.stringify(err) }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
          Countly.recordEvent(event);
          console.log("=====segmentation record event globals.event_Loginfailure, result=> ");
          firebase.analytics().logEvent(globals.event_Loginfailure,
            Object.assign({}, { EventDetails: JSON.stringify(err) }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
            ));
        }
      }
      
    },
    complete: () => {
      _this.props.getshowLoader(false);
    }
  }

  /**
    * Method for get response of market status API
    */
  responseWatchListData = {
    success: (response) => {
      _this.props.getshowLoader(false);
      try {
        AsyncStorage.setItem(globals.watchlist_timeStamp, new Date());
        AsyncStorage.setItem(globals.watchlist_datasource, JSON.stringify(response));
        var ary = []
        var tempArray = []
        if (response.sData.length != 0) {
          let watchlist_data = response.sData.watchlist_data;
          if (response.sData.watchlist_data.length > 0) {
            ary = watchlist_data
            if (ary.length > 0) {
              ary.map((item, index) => {
                tempArray.push(item.stock_id)
              });
            }
            AsyncStorage.setItem(globals.watchlist_added, JSON.stringify(tempArray));
            // _this.props.navigation.dismiss();
            globals.watchlist_added_ary = tempArray
            WatchList.renderWatchListData();

          } else {
            WatchList.openSearchModal();
            _this.props.navigation.dismiss();
          }
        }
        else {
          WatchList.openSearchModal();
          _this.props.navigation.dismiss();
        }
      } catch (error) {
        console.log('error ========== ' + error);
        this.props.getshowLoader(false);
      }
    },
    error: (err) => {
      this.props.getshowLoader(false);
      alert(globals.timeoutMessage)
    },
    complete: () => {
      this.props.getshowLoader(false);
    }
  }

  ValidateField = () => {
    // this.props.navigation.setParams({ header: undefined })
    // this.setState({ isAlertViewVisible: false })
    StatusBar.setHidden(false)
    globals.Authsecret = globals.generateSecret(globals.Pushsecret, arr.join(""));
    console.log("globals.Authsecret " + globals.Authsecret);

    _this.props.getshowLoader(true);
    this.setState({ isTimeOut: true })

    if (globals.Authsecret != '' && arr.length == 4) {
      _this.loginAPIAuthenticationWSCall();
    }
    else {
      console.log("Not get push token");
      _this.props.getshowLoader(true);
      this.setState({ isTimeOut: true })
      setTimeout(() => {
        _this.props.getshowLoader(false);

        var event = { "key": globals.event_OTPfailure, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        console.log("=====segmentation record event globals.event_OTPfailure, result=> ");

        firebase.analytics().logEvent(globals.event_OTPfailure, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
        this.setState({ text1: '', text2: '', text3: '', text4: '' })
        arr = [];
        // this.setState({ isAlertViewVisible: true })
        // this.props.navigation.setParams({ header: null })
        StatusBar.setHidden(false)
      }, 60000);
    }

    // else{
    //   globals.Authsecret = globals.generateSecret(globals.Pushsecret, arr.join(""));
    //   console.log("globals.Authsecret " + globals.Authsecret);

    //   if (globals.Authsecret != '' && arr.length == 4) {
    //     _this.loginAPIAuthenticationWSCall();
    //   }
    //   else {
    //     console.log("Not get push token");
    //     _this.props.getshowLoader(true);
    //     this.setState({ isTimeOut: true })
    //     setTimeout(() => {
    //       _this.props.getshowLoader(false);
    //       firebase.analytics().logEvent(globals.event_OTPfailure);
    //       this.setState({ text1: '', text2: '', text3: '', text4: '' })
    //       arr = [];
    //       Alert.alert(globals.APP_NAME, "Your request timed out. Kindly click the resend button to try again.");
    //     }, 60000);
    //   }
    // }
  }


 

  /**
   * Method for read SMS permission
   */
  async  requestReadSmsPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "Auto Verification OTP",
          message: "need access to read sms, to verify OTP"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("sms read permissions granted", granted);
      } else {
        console.log("sms read permissions denied", denied);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  closeAll() {
    this.props.navigation.dismiss();
    this.setState({
      mobile: '123456789',

      text1: '',
      text2: '',
      text3: '',
      text4: '',
      background1: colors.purpleLight,
      background2: colors.purpleDark,
      background3: colors.purpleDark,
      background4: colors.purpleDark
    });
    arr = [];
  }

  /**
   * Method for click resend button and API call
   */
  clickResend() {
    this.setState({ isResendClick: true,hideButtons : false})
    // setTimeout(() => {
    //   this.setState({ isResendClick: false })
    // }, 5000);
    // this.props.navigation.setParams({ header: undefined })
    StatusBar.setHidden(false)
    // this.setState({ isAlertViewVisible: false })
   // this.loginWSAPICall();


  }

  /**
   * Method for login API call 
   */
  loginWSAPICall(otpMode) {
    if (globals.isInternetConnected) {
      var data = {
        deviceId: deviceId,
        deviceOS: os,
        password: password,
        userId: userId,
        otpMode : otpMode
      };
      API.login(this.responseData, data, true);
    } else {
      alert(globals.networkNotAvailable);
    }
  }

  /**
  * Method for get response of Login and Register API
  */
  responseData = {
    success: (response) => {
      try {
        AsyncStorage.setItem('@UserID:key', response.data.userId);
        AsyncStorage.setItem('@UserSalt:key', response.data.salt);
        AsyncStorage.setItem('@RegistrationType:key', '1');
        AsyncStorage.setItem(globals.user_deviceId, deviceId);
        globals.globalVars.userSalt = response.salt;
        globals.globalVars.userIdTemp_Global = response.data.userId;

      } catch (error) {
        console.log(" Error in login " + JSON.stringify(error));
        Alert.alert(globals.APP_NAME, response.message);
      }
    },
    error: (err) => {
      console.log("File Error " + JSON.stringify(err));

      Alert.alert(globals.APP_NAME, err.message);
    },
    complete: () => {
    }
  }

  // closeAlertView() {
  //   this.setState({ isAlertViewVisible: false }, () => {
  //     this.props.navigation.setParams({ header: undefined })
  //     StatusBar.setHidden(false)

  //   })
  // }

  /**
   * Method of Text Me button click
   */
  txtMePress= () =>{
    this.setState({hideButtons : false,isShowTimer: true, otpMode : "sms"},() => this.loginWSAPICall(this.state.otpMode))
  }

  /**
   * Method of Call Me button click
   */
  callMePress = () => {
    this.setState({hideButtons : false, isShowTimer: true, otpMode : "voice"},() => this.loginWSAPICall(this.state.otpMode))
  }

  onCompleteTick(){
    this.setState({hideButtons:true, isShowTimer: false})
  }

  renderTimerView(isTimerView){
    if (isTimerView) {
        return( <View style={{flexDirection:'row', marginTop:5, alignSelf:'center'}}>
      
        <Text style={styles.timerCountdown}>{'Resend SMS in '}</Text>
        <TimerCountdown
          initialSecondsRemaining={1000 * 60}
          onTick={secondsRemaining => console.log("tick", secondsRemaining)}
          onTimeElapsed={() => this.onCompleteTick()}
          allowFontScaling={true}
          style={[styles.timerCountdown,{ fontSize: 14, marginTop: 2,}]}
        />
         <Text style={styles.timerCountdown}>{' seconds'}</Text>
    </View>)
    } else{
        return null
    }
  }

  render() {
    const message = globals.phoneOTPEnterCodeTextMessage;
    return (
      <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: colors.blue }]}>

        <View style={{ height: '100%', width: '100%' }}>
          {/* {(this.state.isAlertViewVisible) ? <View style={styles.otpValidation}>
            <TouchableOpacity onPress={() => this.closeAlertView()}>
              <Image source={auth.cross_icon} style={[styles.crossIcon]} />
            </TouchableOpacity>

            <Text style={styles.otpValidationBoldText}>
              {'Unable to send OTP at the moment,'}
            </Text>
            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
              <Text style={styles.otpValidationBoldText}>
                {'please hit '}
              </Text>
              <Text style={styles.otpValidationExtraBoldText}>
                {'Resend'}
              </Text>

            </View>
          </View> : null} */}

          <View style={[styles.pageContainertxtMeCallMe,{flex :(this.state.hideButtons == true) ? 1 : 0}]}>
            <View style={styles.headingText}>

              <Text style={globalStyles.heading}>{message}</Text>
              <Text style={styles.mobileNo}>{globals.sentTo} {this.state.country_code} {this.state.real_mobile}
               </Text>
            </View>
            <View style={styles.textInputView1}>
              <View style={[styles.textInputView2, { backgroundColor: this.state.background1 }]}>
                <Text style={styles.txtIP}>{this.state.text1}</Text>
              </View>
              <View style={[styles.textInputView, { backgroundColor: this.state.background2 }]}>
                <Text style={styles.txtIP}>{this.state.text2}</Text>
              </View>
              <View style={[styles.textInputView, { backgroundColor: this.state.background3 }]}>
                <Text style={styles.txtIP}>{this.state.text3}</Text>
              </View>
              <View style={[styles.textInputView, { backgroundColor: this.state.background4 }]}>
                <Text style={styles.txtIP}>{this.state.text4}</Text>
              </View>
            </View>
            <View style={[styles.agreementView]}>
            {(!this.state.hideButtons) ? null :  <Text style={[styles.touchableFont, { fontWeight: '400' },{marginTop : (this.state.hideButtons == false) ? 10 : 0},{marginBottom : (this.state.hideButtons == false) ? 15 : 0}]}>{globals.didNotReceive}</Text> }
              {this.renderResendButton(this.state.isResendClick)}
              {this.renderTimerView(this.state.isShowTimer)}
            </View>
            {
              (this.state.hideButtons == false && !this.state.isShowTimer) ? 
              <View style={styles.txtMeCallMeButtonView}>
              <View style={{ flex: 1 }}>
                <Button
                  onPress={() => this.txtMePress()}
                  textStyle={styles.buttonTextForgot}
                  buttonStyles={[styles.buttonStylesTextCallMe, { marginLeft: 15 }]}
                  text={"Text Me"}></Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  onPress={() => this.callMePress()}
                  textStyle={styles.buttonTextForgot}
                  buttonStyles={[styles.buttonStylesTextCallMe, { marginRight: 15, marginLeft: 10, }]}
                  text={"Call Me"}></Button>
              </View>
            </View> : 
            <NumericKeyboard onPress={(value) => this.on_KeyboardPress(value)} />
            }
            
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Method for render resend button
   */
  renderResendButton(resend) {
    if(this.state.hideButtons){
      return (
          <TouchableOpacity onPress={() => { this.clickResend() }} >
            <Text style={styles.touchableFont}>{globals.resendBtn}</Text>
          </TouchableOpacity>
        )
    }
    else{
      return null
  }
  }


}

const mapStateToProps = (state, ownProps) => {
  return {
    register: state.showModal_red.register,
    Otp: state.showModal_red.Otp,
    loader: state.claneLoader_red.loader
  }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
  getshowModal,
  getshowLoader
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(PhoneOTP);