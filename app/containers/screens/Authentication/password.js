
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  Alert,
  AsyncStorage,
  Image,
  Platform,
  SafeAreaView,
  Animated
} from 'react-native';
import styles from './style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from '../../../assets/images/map'
import Button from '../../../components/Button';
import { bindActionCreators } from 'redux';
import { getshowModal } from '../../../redux/actions/showModal';
import { getshowLoader } from '../../../redux/actions/showLoaderModal';
import DeviceInfo from 'react-native-device-info';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import globalStyles from '../../../assets/styles/globalStyles';
import { API } from '../../../lib/api';

import CryptoJS from "crypto-js";
let deviceId = DeviceInfo.getUniqueID();
const os = DeviceInfo.getSystemName();
var validators = require('../../../lib/validators').validators();
var _this = null;
const ANIMATION_DURATION = 1000

class Password extends Component {


  hideKeyBoard(navigation) {
    this.refs.textInput.setNativeProps({ 'editable': false });
    navigation.dismiss();
  }

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: globals.screenTitle_password,
      headerTintColor: colors.white,
      headerStyle: globalStyles.navigationHeaderStyle,
      headerLeft: null,
      gesturesEnabled: false,
      headerRight:
        <TouchableOpacity style={{ paddingRight: 15 }} underlayColor='transparent' onPress={() => _this.hideKeyBoard(navigation)}>
          <Text style={globalStyles.cancelButton}>{globals.cancel}</Text>
        </TouchableOpacity>,

    };
  }

  constructor(props) {
    super(props);
    _this = this;
    this.state = {
      confirm_password: '',
      password: '',
      mobile: '',
      flow: '',
      otp: '1234',
      hidePassword: true,
      hideConfirmPassword: true,
      animating: false,
      isHintVisible: false,
      userId: props.navigation.state.params.userId,
      flowtoFollow: props.navigation.state.params.flow,
      country_code:props.navigation.state.params.country_code,
      real_mobile:props.navigation.state.params.real_mobile,

    };
    this.tabbarTop = (globals.iPhoneX) ? new Animated.Value(-10) : new Animated.Value(-5)
  }

  componentDidMount() {
    this.setState({ mobile: this.props.navigation.state.params.mobile });
  }

  /**
   * Manage password visibiity on/off
   */
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }


  // ********************** Validation and Webservice calling method **********************

  ValidateField = () => {
    Keyboard.dismiss();

    if (this.state.flowtoFollow == "registration" && this.state.password === '') {
      Alert.alert(globals.APP_NAME, globals.passwordEnter);
    }
    else if (this.state.flowtoFollow == "registration" && !validators.RegularExpressionPassword(this.state.password)) {
      setTimeout(() => {
        Alert.alert(globals.APP_NAME, globals.passwordValidation);
      }, 100);
    }
    else {
      if (this.state.flowtoFollow == "registration") {
        this.registrationAPICall();
      } else {
        if (this.state.password == '') {
          Alert.alert(globals.APP_NAME, globals.passwordEnter);
        }
        else {
          this.loginWSAPICall();
        }
      }
    }
  }

  // ********************** Call WS for Registration method **********************

  registrationAPICall() {
    if (globals.isInternetConnected) {
      var data = {
        deviceId: deviceId,
        deviceOS: os,
        password: this.state.password,
        phone: this.state.mobile,
        otpMode : "sms"
      };
      this.props.getshowLoader(true);
      API.register(this.responseData, data, true);
    } else {
      this.props.getshowLoader(false);
      alert(globals.networkNotAvailable);
    }
  }

  // ********************** Call WS for Login Authentication method **********************

  loginAPIAuthenticationWSCall() {
    if (globals.isInternetConnected) {
      try {
        AsyncStorage
          .getItem('@UserID:key')
          .then((value) => {
            globals.globalVars.userId_Global = value;
            var data = {
              deviceId: deviceId,
              pwd: this.hashPassword(this.state.password, globals.globalVars.userSalt)
            };
            API.login_with_authentication(this.responseDataLoginAuthentication, data, true);
          });
      } catch (error) {
        console.log("error ttt" + error);
      }
    } else {
      alert(globals.networkNotAvailable);
    }
  }

  /**
   * Method for get response of profile user API
   */
  responseProfileData = {
    success: (response) => {
      try {
        AsyncStorage.setItem('@Profile:key', JSON.stringify(response));
        setTimeout(() => {
          AsyncStorage.getItem('@Profile:key').then((value) => {
            var profile = JSON.parse(value);
            globals.globalVars.isBVNVerified = profile.bvnVerified;
            if (globals.globalVars.isBVNVerified == true) {
              this.props.navigation.dismiss();
            } else {
              this.props.navigation.navigate('BVNSetup');
            }
          });
        }, 100);
      } catch (error) {
        Alert.alert(globals.APP_NAME, error);
      }
    },
    error: (err) => {
      console.log("File Error " + JSON.stringify(err));
    },
    complete: () => {
      this.props.getshowLoader(false);
    }
  }

  /**
   * Method for get response of authentication user API
   */
  responseDataLoginAuthentication = {
    success: (response) => {
      try {
        AsyncStorage.setItem('@AuthenticateAccessToken:key', response.token.accessToken);
        AsyncStorage.setItem('@AuthenticateRefreshToken:key', response.token.refreshToken);
        AsyncStorage.setItem('@RegistrationType:key', '1');
        AsyncStorage.setItem(globals.user_deviceId, deviceId);

        globals.globalVars.AuthAccessToken = response.token.accessToken;
        globals.globalVars.AuthRefreshToken = response.token.refreshToken;

        if (Platform.OS == 'ios') {
          this.props.navigation.navigate('IOSPhoneOTP', { country_code: this.state.country_code,real_mobile: this.state.real_mobile, mobile: this.state.mobile, title: 'Register', flow: this.state.flowtoFollow, userId: response.userId, password: this.state.password });
        }
        else {
          this.props.navigation.navigate('PhoneOTP', { country_code: this.state.country_code,real_mobile: this.state.real_mobile, mobile: this.state.mobile, title: 'Register', flow: this.state.flowtoFollow, userId: response.userId, password: this.state.password });
        }

      } catch (error) {
        Alert.alert(globals.APP_NAME, response.message);
      }
    },
    error: (err) => {
      console.log("File Error " + JSON.stringify(err));
    },
    complete: () => {
      this.props.getshowLoader(false);
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
        globals.globalVars.userSalt = response.data.salt;
        console.log("globals.globalVars.userSalt "+globals.globalVars.userSalt);
        
        this.props.getshowLoader(false);
        if (Platform.OS == 'ios') {
          this.props.navigation.navigate('IOSPhoneOTP', { country_code: this.state.country_code,real_mobile: this.state.real_mobile, mobile: this.state.mobile, title: 'Register', flow: this.state.flowtoFollow, userId: response.data.userId, password: this.state.password });
        }
        else {
          this.props.navigation.navigate('PhoneOTP', { country_code: this.state.country_code, real_mobile: this.state.real_mobile,mobile: this.state.mobile, title: 'Register', flow: this.state.flowtoFollow, userId: response.data.userId, password: this.state.password });
        }

      } catch (error) {
        console.log(" Error in login " + JSON.stringify(error));
        Alert.alert(globals.APP_NAME, response.message);
        this.props.getshowLoader(false);
      }
    },
    error: (err) => {
      console.log("File Error " + JSON.stringify(err.message));
      this.props.getshowLoader(false);
      if (err == globals.timeoutErrorCheck) {
        alert(globals.timeoutMessage)
      }

      else {
        Alert.alert(globals.APP_NAME, err.message);
      }
    },
    complete: () => {
      this.props.getshowLoader(false);
    }
  }

  // ********************** Call WS for Login method **********************

  loginWSAPICall() {
    if (globals.isInternetConnected) {
      var data = {
        deviceId: deviceId,
        deviceOS: os,
        password: this.state.password,
        userId: this.state.userId, 
        otpMode : "sms"
      };
      this.props.getshowLoader(true);
      API.login(this.responseData, data, true);
    } else {
      this.props.getshowLoader(false);
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

  // ********************** Close model method **********************

  closeAll() {
    this.props.navigation.goBack();
  }

  /**
   * Method for forgot password screen
   * @param {*} mobile_no 
   * @param {*} user_id 
   */
  callForgotPasswordScreen(mobile_no, user_id) {
    this.props.navigation.navigate('ForgotPassword', { country_code: this.state.country_code,real_mobile: this.state.real_mobile, mobile: mobile_no, userId: user_id, title: globals.screenTitle_forgot_password }); 
  }


  clickTextField() {
    console.log("FOCOCOC");
    Animated.timing(this.tabbarTop, {
      toValue: (globals.iPhoneX) ? 70 : 65,
      duration: ANIMATION_DURATION
    }).start();

    this.setState({ isHintVisible: true })
  }

  unClickTextField() {
    Animated.timing(this.tabbarTop, {
      toValue: (globals.iPhoneX) ? -10 : -5,
      duration: ANIMATION_DURATION
    }).start();
    this.setState({ isHintVisible: false })
  }

  // ********************** Render View method **********************

  render() {
    const message = this.state.flowtoFollow == 'registration' ? globals.passwordSetPasswordClaneAccount : globals.passwordEnterPasswordClaneAccount;
    const btnText = this.state.flowtoFollow == 'registration' ? globals.passwordSingUp : globals.passwordLogin;
    return (
      <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: colors.blue }]}>
        <View style={styles.MainContainer}>
          <View style={styles.pageContainerPassword}>
            <View style={styles.headingText}>
              <Text style={globalStyles.heading}>{message}</Text>
            </View>
            <View>
              {(this.state.isHintVisible && this.state.flowtoFollow == 'registration') ?
                <Animated.View style={[{ position: 'absolute', }, { transform: [{ translateY: this.tabbarTop }] }]}>

                  <Text style={[styles.txtPasswordHintTitle, { color: (this.state.password.length > 0) ? colors.white : colors.passwordHintDisable }]}>Password Help</Text>
                  <View style={styles.row}>
                    <Image source={auth.check_icon} style={[styles.checkIcon, { tintColor: (this.state.password.length > 0) ? colors.white : colors.passwordHintDisable }]} />
                    <Text style={[styles.txtPasswordHintRule, { color: (this.state.password.length > 0) ? colors.white : colors.passwordHintDisable }]}>Must contain a numerical digit</Text>
                  </View>
                  <View style={[styles.row]}>
                    <Image source={auth.check_icon} style={[styles.checkIcon, { tintColor: (this.state.password.length >= 7) ? colors.white : colors.passwordHintDisable }]} />
                    <Text style={[styles.txtPasswordHintRule, { color: (this.state.password.length >= 7) ? colors.white : colors.passwordHintDisable }]}>Have at least 7 characters</Text>
                  </View>



                </Animated.View> : null}
              <View style={{ backgroundColor: colors.blue, marginBottom: 10 }} >
                <View style={[globalStyles.textInputView, globalStyles.underline, { backgroundColor: colors.blue }]}>

                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholderTextColor={colors.purplePlaceholder}
                    style={[styles.textInputPassword, { paddingRight: 45, }]}
                    autoFocus={false}
                    placeholder="Password"
                    ref={'textInput'}
                    onTouchStart={() => this.clickTextField()}
                    onEndEditing={() => this.unClickTextField()}
                    secureTextEntry={this.state.hidePassword}
                    onChangeText={(text) => this.setState({ password: text })}
                    value={this.state.password} />
                  <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn} onPress={this.managePasswordVisibility}>
                    <Ionicons name={(this.state.hidePassword) ? "md-eye" : "md-eye-off"} style={styles.btnImage} size={25} color={colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {(this.state.flowtoFollow
              != 'login') ?
              <Animated.View style={[{ marginTop: 5 }, { transform: [{ translateY: this.tabbarTop }] }]}>

                <Button
                  onPress={() => this.ValidateField()}
                  textStyle={globalStyles.buttonText}
                  buttonStyles={globalStyles.buttonStyles}
                  text={btnText}>
                </Button>
              </Animated.View>

              :

              <Button
                onPress={() => this.ValidateField()}
                textStyle={globalStyles.buttonText}
                buttonStyles={globalStyles.buttonStyles}
                text={btnText}>
              </Button>
            }

            {(this.state.flowtoFollow == 'login') ? <TouchableOpacity onPress={() => this.callForgotPasswordScreen(this.props.navigation.state.params.mobile, this.props.navigation.state.params.userId)}>
              <Text style={styles.txtForgotPassword}> {"Forgot Password?"}</Text>
            </TouchableOpacity> : null}

          </View>
        </View>
      </SafeAreaView>
    );
  }
}
// ** Model mapping method **
const mapStateToProps = (state, ownProps) => {
  return { register: state.showModal_red.register, Otp: state.showModal_red.Otp, loader: state.claneLoader_red.loader }
}
const mapDispatchToProps = dispatch => (bindActionCreators({
  getshowModal,
  getshowLoader
}, dispatch));
export default connect(mapStateToProps, mapDispatchToProps)(Password);
