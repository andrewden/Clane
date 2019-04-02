
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  AsyncStorage,
  StatusBar,
  Image,
  PermissionsAndroid,
  SafeAreaView
} from 'react-native';
import Countly from 'countly-sdk-react-native';
import styles from './style';
import { auth } from '../../../assets/images/map'
import TimerCountdown from "react-native-timer-countdown";

import Button from '../../../components/Button';
import { bindActionCreators } from 'redux';
import { getshowModal } from '../../../redux/actions/showModal';
import { getshowLoader } from '../../../redux/actions/showLoaderModal';
import DeviceInfo from 'react-native-device-info';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import globalStyles from '../../../assets/styles/globalStyles';
import { API } from '../../../lib/api';
import { HeaderBackButton } from 'react-navigation';
import firebase from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

var validators = require('../../../lib/validators').validators();

let deviceId = DeviceInfo.getUniqueID();
const os = DeviceInfo.getSystemName();
var validators = require('../../../lib/validators').validators();

class ResetPassword extends Component {


  hideKeyBoard(navigation) {
    this.refs.textInput.setNativeProps({ 'editable': false });
    navigation.dismiss();
  }

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: globals.screenTitle_reset_password,
      headerTintColor: colors.white,
      headerStyle: globalStyles.navigationHeaderStyle,
      gesturesEnabled: false,
      header: (navigation.state.params != null) ? navigation.state.params.header : null,
      headerRight: null,
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title='Back' tintColor='white' />,

    };
  }

  constructor(props) {
    super(props);
     
    this.state = {
      six_digit_code: '',
      new_password: '',
      confirm_password: '',
      hidePassword: true,
      hideConfirmPassword: true,
      isResendClick: false,
      // isAlertViewVisible: false,
      hideButtons: true,
      isShowTimer: false,
      otpMode : this.props.navigation.state.params.otpMode

    };
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


  /**
   * Method for close resend alert view
   */
  // closeAlertView() {
  //   this.setState({ isAlertViewVisible: false }, () => {
  //     this.props.navigation.setParams({ header: undefined })
  //     StatusBar.setHidden(false)

  //   })
  // }

  /**
   * Method for validate input field for call API
   */
  ValidateField() {

    if (this.state.six_digit_code == '') {
      Alert.alert(globals.APP_NAME, globals.forgotPasswordSixDigit, [{ text: 'OK', onPress: () => this.refs.textInputDigit.focus() }])
    }
    else if (this.state.six_digit_code.length < 7) {
      Alert.alert(globals.APP_NAME, globals.forgotPasswordSixDigitValid, [{ text: 'OK', onPress: () => this.refs.textInputDigit.focus() }])
    }
    else if (this.state.new_password == '') {
      Alert.alert(globals.APP_NAME, globals.forgotPasswordNewPassword, [{ text: 'OK', onPress: () => this.refs.textInputNewPassword.focus() }])
    }
    else if (!validators.RegularExpressionPassword(this.state.new_password)) {
      setTimeout(() => {
        Alert.alert(globals.APP_NAME, globals.passwordValidation);
      }, 100);
    }
    else if (this.state.confirm_password == '') {
      Alert.alert(globals.APP_NAME, globals.passwordEnterConfirm, [{ text: 'OK', onPress: () => this.refs.textInputConfirmPassword.focus() }])
    }
    else if (this.state.confirm_password != this.state.new_password) {
      setTimeout(() => {
        Alert.alert(globals.APP_NAME, globals.passwordDoesntMatch);
      }, 100);
    }
    else {
      var data = {
        newPassword: this.state.new_password,
        resetCode: this.state.six_digit_code
      };
      API.update_password(this.responseUpdatePasswordData, data, this.props.navigation.state.params.userId, true);
    }
  }

  /**
   * Method for get update password respose
   */
  responseUpdatePasswordData = {
    success: (response) => {
      try {

        var event = { "key": globals.event_ForgotPassword, "count": 1 };
        event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        console.log("=====segmentation record event globals.event_ForgotPassword, result=> ");

        firebase.analytics().logEvent(globals.event_ForgotPassword, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));

        this.props.navigation.navigate('ResetPasswordSuccess', { userId: this.props.navigation.state.params.userId, password: this.state.new_password, mobile: this.props.navigation.state.params.mobile,real_mobile:this.props.navigation.state.params.real_mobile, country_code:this.props.navigation.state.params.country_code });

      } catch (error) {
        console.log("responseUpdatePasswordData " + JSON.stringify(error));
        Alert.alert(globals.APP_NAME, response.message);
      }
    },
    error: (err) => {
      console.log("File Error " + JSON.stringify(err));
      alert(globals.timeoutMessage)
    },
    complete: () => {
    }
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
          style={[styles.timerCountdown,{fontSize: 14, marginTop: 2,}]}
        />
         <Text style={styles.timerCountdown}>{' seconds'}</Text>
    </View>)
    } else{
        return null
    }
}

  /**
   * Method for render resend button
   */
  renderResendButton(resend) {
    if (this.state.hideButtons) {
      return (
        <TouchableOpacity onPress={() => { this.callResendButton() }} >
          <Text style={styles.touchableFont}>{globals.resendBtn}</Text>
        </TouchableOpacity>
      )
    }else{
      return null
    }
    // if (!resend) {
    //     return (
    //         <TouchableOpacity onPress={() => { this.callResendButton() }} >
    //             <Text style={styles.touchableFont}>{globals.resendBtn}</Text>
    //         </TouchableOpacity>
    //     )
    // } else {
    //     return (
    //         <Text style={styles.touchableFontOpacity}>{globals.resendBtn}</Text>
    //     )
    // }
  }

  /**
   * Method for call resend button
   */
  callResendButton() {
    this.setState({ isResendClick: true, hideButtons: false })
    // setTimeout(() => {
    //     this.setState({ isResendClick: false })
    // }, 5000);
    this.props.navigation.setParams({ header: undefined })
    StatusBar.setHidden(false)
    // this.setState({ isAlertViewVisible: false })
   // API.reset_password(this.responseResetData, this.props.navigation.state.params.userId, this.props.navigation.state.params.otpMode, true);

  }


  resetPasswordApiCall(otpMode){
    API.reset_password(this.responseResetData, this.props.navigation.state.params.userId, otpMode, true);
  }

  /**
   * Method for get reset response
   */
  responseResetData = {
    success: (response) => {
      try {

        this.props.navigation.setParams({ header: undefined })
        StatusBar.setHidden(false)
        // this.setState({ isAlertViewVisible: false })

      } catch (error) {
        console.log(" responseResetData " + JSON.stringify(error));

        this.props.navigation.setParams({ header: null })
        StatusBar.setHidden(true)
        // this.setState({ isAlertViewVisible: true })
      }
    },
    error: (err) => {
      console.log("File Error " + JSON.stringify(err));
      this.props.navigation.setParams({ header: null })
      StatusBar.setHidden(true)
      // this.setState({ isAlertViewVisible: true })
    },
    complete: () => {
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
        globals.globalVars.userIdTemp_Global = response.data.userId;

      } catch (error) {
        console.log(" responseData " + JSON.stringify(error));
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

  /**
   * Method of Text Me button click
   */
  txtMePress= () =>{
    this.setState({hideButtons : false, isShowTimer: true, otpMode : "sms"},() => this.resetPasswordApiCall(this.state.otpMode))
  }

  /**
   * Method of Call Me button click
   */
  callMePress = () => {
    this.setState({hideButtons : false, isShowTimer: true, otpMode : "voice"},() => this.resetPasswordApiCall(this.state.otpMode))
  }

  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }

  manageConfirmPasswordVisibility = () => {
    this.setState({ hideConfirmPassword: !this.state.hideConfirmPassword });
  }

  render() {

    return (
      <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: colors.blue }]}>
        <View style={styles.MainContainer}>
          {/* {(this.state.isAlertViewVisible) ? <View style={styles.otpValidation}>
            <TouchableOpacity onPress={() => this.closeAlertView()}>
              <Image source={auth.cross_icon} style={[styles.crossIcon]} />
            </TouchableOpacity>

            <Text style={styles.otpValidationBoldText}>
              {'Unable to send RESET CODE at the moment,'}
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
          <View style={[styles.pageContainerPassword]}>
            <View style={[styles.headingText, { marginTop: 20 }]}>
              <Text style={globalStyles.heading}>{"You should receive a six digit code shortly on your phone"}</Text>
            </View>
            <View style={[globalStyles.textInputView, globalStyles.underline]}>
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor={colors.purplePlaceholder}
                style={styles.textInputForgotPassword}
                autoFocus
                // keyboardType='numeric'
                maxLength={7}
                placeholder="Enter seven digit code"
                ref={'textInputDigit'}
                onChangeText={(text) => this.setState({ six_digit_code: text })}
                value={this.state.six_digit_code} />

            </View>
            <View style={[globalStyles.textInputView, globalStyles.underline, { marginTop: 20 }]}>
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor={colors.purplePlaceholder}
                style={styles.textInputForgotPassword}
                //autoFocus
                placeholder="New Password"
                ref={'textInputNewPassword'}
                secureTextEntry={this.state.hidePassword}
                onChangeText={(text) => this.setState({ new_password: text })}
                value={this.state.new_password} />
                <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn} onPress={this.managePasswordVisibility}>
                    <Ionicons name={(this.state.hidePassword) ? "md-eye" : "md-eye-off"} style={styles.btnImage} size={25} color={colors.white} />
                </TouchableOpacity>
            </View>
            <View style={[globalStyles.textInputView, globalStyles.underline, { marginTop: 20 }]}>
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor={colors.purplePlaceholder}
                style={styles.textInputForgotPassword}
                //autoFocus
                placeholder="Confirm Password"
                ref={'textInputConfirmPassword'}
                secureTextEntry={this.state.hideConfirmPassword}
                onChangeText={(text) => this.setState({ confirm_password: text })}
                value={this.state.confirm_password} />
                  <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn} onPress={this.manageConfirmPasswordVisibility}>
                    <Ionicons name={(this.state.hidePassword) ? "md-eye" : "md-eye-off"} style={styles.btnImage} size={25} color={colors.white} />
                  </TouchableOpacity>
            </View>
            {
              (this.state.hideButtons != false ) ? <Button
              onPress={() => this.ValidateField()}
              textStyle={styles.buttonTextForgot}
              buttonStyles={[styles.buttonStylesForgot, { marginTop: 30, }]}
              text={"Reset Password"}></Button> : null
            }
         
            <View style={styles.resetPasswodFooterView}>
              {(!this.state.hideButtons) ? null : <Text style={styles.resetPasswodNotReceive}>{"I did not receive a code!"}</Text>}
              
              <View style={{ alignSelf: 'center' }}>
                {this.renderResendButton(this.state.isResendClick)}
                {this.renderTimerView(this.state.isShowTimer)}

              </View>
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
                </View> : null
                
            }

          </View>
        </View>
      </SafeAreaView>
    );
  }
}

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
  return { register: state.showModal_red.register, Otp: state.showModal_red.Otp, loader: state.claneLoader_red.loader }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
  getshowModal,
  getshowLoader
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);

