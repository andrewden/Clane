
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Text,
    View,
    Alert,
    AsyncStorage,
    SafeAreaView,
    Platform,Image
} from 'react-native';
import styles from './style';
import Button from '../../../components/Button';
import { auth } from '../../../assets/images/map'
import { bindActionCreators } from 'redux';
import { getshowModal } from '../../../redux/actions/showModal';
import { getshowLoader } from '../../../redux/actions/showLoaderModal';
import DeviceInfo from 'react-native-device-info';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import globalStyles from '../../../assets/styles/globalStyles';
import { API } from '../../../lib/api';
let deviceId = DeviceInfo.getUniqueID();
const os = DeviceInfo.getSystemName();

class ResetPasswordSuccess extends Component {


    static navigationOptions = ({ navigation, screenProps }) => {
        return {
            title: '',
            headerTintColor: colors.white,
            headerStyle: globalStyles.navigationHeaderStyle,
            gesturesEnabled: false,
            headerRight: null,
            headerLeft: null,

        };
    }

    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            six_digit_code: '',
            new_password: '',
            confirm_password: '',
            mobile:this.props.navigation.state.params.mobile,
            password:this.props.navigation.state.params.password,
            userId:this.props.navigation.state.params.userId,
             
        };
    }

    /**
     * Method for validate call login API 
     */
    ValidateField() {
        this.loginWSAPICall();
    }

    /**
     * Method for login API call
     */
  loginWSAPICall() {
    if (globals.isInternetConnected) {
      var data = {
        deviceId: deviceId,
        deviceOS: os,
        password: this.state.password,
        userId: this.state.userId
      };
      this.props.getshowLoader(true);
      API.login(this.responseData, data, true);
    } else {
      this.props.getshowLoader(false);
      alert(globals.networkNotAvailable);
    }
  }

  /**
   * Method for get respose login API
   */
  responseData = {
    success: (response) => {
        console.log('====================================')
        console.log('Reset password success responseData ' +  JSON.stringify(response))
        console.log('====================================')
      try {
        AsyncStorage.setItem('@UserID:key', response.data.userId);
        AsyncStorage.setItem('@UserSalt:key', response.data.salt);
        AsyncStorage.setItem('@RegistrationType:key', '1');
        AsyncStorage.setItem(globals.user_deviceId, deviceId);
        globals.globalVars.userSalt = response.data.salt;
        this.props.getshowLoader(false);
        if (Platform.OS =='ios') {
            this.props.navigation.navigate('IOSPhoneOTP', { mobile: this.state.mobile , title: 'Register', flow: 'login', userId: response.data.userId, password: this.state.password, real_mobile:this.props.navigation.state.params.real_mobile, country_code:this.props.navigation.state.params.country_code });
          }
          else {
            this.props.navigation.navigate('PhoneOTP', { mobile: this.state.mobile , title: 'Register', flow: 'login', userId: response.data.userId, password: this.state.password ,real_mobile:this.props.navigation.state.params.real_mobile, country_code:this.props.navigation.state.params.country_code});
          }

      } catch (error) {
        Alert.alert(globals.APP_NAME, JSON.stringify(error));
        this.props.getshowLoader(false);
      }
    },
    error: (err) => {
      console.log("File Error " + JSON.stringify(err));
      this.props.getshowLoader(false);
      Alert.alert(globals.APP_NAME, err.message);      
    },
    complete: () => {
      this.props.getshowLoader(false);
    }
  }
  
    render() {
        return (
            <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: colors.blue }]}>
                <View style={[styles.MainContainer,]}>
                    <View style={[styles.pageContainerPassword,{marginTop : '5%'}]}>
                    <View style={{alignItems : 'center',paddingBottom: 30,}}>
                        <Image source={auth.verified_icon} resizeMode = {'contain'} style={{height : 120, width : 120}} />
                    </View>
                        <View style={[styles.headingText,{ } ]}>
                            <Text style={globalStyles.heading}>{"Your password has been reset successfully"}</Text>
                        </View>
                        <View style={[{  justifyContent: 'center', alignSelf:'center', marginTop : 5 }]}>
                            <Text style={styles.txtForgotPasswordMobileNumber}>{'Now login with your new password'}</Text>
                        </View>
                        <Button
                            onPress={() => this.ValidateField()}
                            textStyle={styles.buttonTextForgot}
                            buttonStyles={[styles.buttonStylesForgot ]}
                            text={"Login"}></Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordSuccess);

