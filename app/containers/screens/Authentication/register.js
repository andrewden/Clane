import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  AsyncStorage,
  Modal
} from 'react-native';
import { Header } from 'react-navigation';
import DeviceInfo from 'react-native-device-info'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import CountryPicker, {
  getAllCountries
} from './react-native-country-picker-modal'
import { bindActionCreators } from 'redux';
import { register } from '../../../assets/images/map';
import styles from './style';
import Button from '../../../components/Button';
import { getshowModal } from '../../../redux/actions/showModal';
import { getshowLoader } from '../../../redux/actions/showLoaderModal';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import globalStyles from '../../../assets/styles/globalStyles';
import { API } from '../../../lib/api';
import { ScrollView } from 'react-native-gesture-handler';
import { sha256 } from 'react-native-sha256';
import Agreement from './agreement';
var validators = require('../../../lib/validators').validators();

var _this = null
var actualMobileNo = null;
const NORTH_AMERICA = ['AF', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE',
  'BZ', 'BJ', 'BM', 'BT', 'BO', 'BA', 'BW', 'BV', 'BR', 'IO', 'VG', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX',
  'CC', 'CO', 'KM', 'CK', 'CR', 'HR', 'CU', 'CW', 'CY', 'CZ', 'CD', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ',
  'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'HN', 'HK', 'HU',
  'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'CI', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'XK', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY',
  'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM',
  'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'KP', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR',
  'QA', 'CG', 'RO', 'RU', 'RW', 'RE', 'BL', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS',
  'KR', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'ST', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG',
  'UA', 'AE', 'GB', 'US', 'UM', 'VI', 'UY', 'UZ', 'VU', 'VA', 'VE', 'VN', 'WF', 'EH', 'YE', 'ZM', 'ZW', 'AX']
//const NORTH_AMERICA = ['CA', 'MX', 'US']

class Register extends Component {

  hideKeyBoard(navigation) {
    this.refs.textInput.setNativeProps({ 'editable': false });
    navigation.dismiss();
  }

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      headerTintColor: 'white',
      headerStyle: globalStyles.navigationHeaderStyle,
      headerBackTitle: globals.back,
      gesturesEnabled: false,
      headerRight: <TouchableOpacity style={{ paddingRight: 15 }} underlayColor='transparent' onPress={() => _this.hideKeyBoard(navigation)}><Text style={globalStyles.cancelButton}>{globals.cancel}</Text></TouchableOpacity>
    }
  }

  constructor(props) {
    super(props);
    let userLocaleCountryCode = DeviceInfo.getDeviceCountry()
    const userCountryData = getAllCountries()
      .filter(country => NORTH_AMERICA.includes(country.cca2))
      .filter(country => country.cca2 === userLocaleCountryCode)
      .pop()
    let callingCode = null
    let cca2 = userLocaleCountryCode
    if (!cca2 || !userCountryData) {
      cca2 = 'US'
      callingCode = '1'
    } else {
      cca2 = 'NG'
      callingCode = '234'
      // callingCode = userCountryData.callingCode
    }

    _this = this,
      this.state = {
        cca2,
        callingCode,
        mobileNo: '',
        countryCode: '234',
        PhoneOTPmodalVisible: this.props.Otp,
        userId: '',
        mobile_maxlength: 10,
        animating: false,
        openAgreement: false,
      };
  }

  /**
   * Receive new props for register screen
   * @param {*} newProps 
   */
  componentWillReceiveProps(newProps) {
    this.setState({
      modalVisible: newProps.register
    })
  }

  static closeAgreement() {
    _this.setState({ openAgreement: false })
  }
  componentDidMount() {
    if (this.refs.textInput.focus() != null && this.refs.textInput.focus() != undefined) {
      this.refs.textInput.focus();
    }
  }

  /**
   * For close model
   */
  _closeModal() {
    Keyboard.dismiss();
    this.props.navigation.dismiss()
  }

  static handleCloseModalWebview() {
    _this.setState({ openAgreement: false })
  }

  openAgreement() {
    return (
      <Modal animationType='slide' visible={this.state.openAgreement} onRequestClose={() => { Register.handleCloseModalWebview() }}>
        <Agreement setParentState={newState => this.setState(newState)} isFrom={'register'} />
      </Modal>
    )
  }

  /**
   * Method for check mobile no start with
   * @param {*} number 
   */
  checkMobileNumberStartWith(number) {
    this.setState({ mobileNo: number }, () => {
      this.checkMobileNumberLength(number)
    })
  }

  /**
   * Method for check mobil no length
   */
  checkMobileNumberLength(number) {
    if (number.charAt(0) == 0) {
      this.setState({ mobile_maxlength: 11 })
    } else {
      this.setState({ mobile_maxlength: 10 })
    }
  }
  /**
   * For Validation of mobile number
   */
  ValidateField = () => {
    Keyboard.dismiss();
    actualMobileNo = this.state.mobileNo;

    if (this.state.mobileNo.length == 0) {
      Alert.alert(globals.APP_NAME, globals.registerMobileNumberEnter, [{ text: 'OK', onPress: () => this.refs.textInput.focus() }])
      this.props.getshowLoader(false);
    }

    else if (validators.RegularExpressionMobileNumberInput(this.state.mobileNo)) {
      Alert.alert(globals.APP_NAME, globals.registerMobileNumberProperFormat, [{ text: 'OK', onPress: () => this.refs.textInput.focus() }])
    }

    else if (this.state.mobileNo.length == 11) {
      if (this.state.mobileNo.charAt(0) == 0) {

        var number = this.state.mobileNo.substr(1)
        this.setState({ mobileNo: number }, () => {
          this.callRegisterAPI(this.state.mobileNo);
        })
        this.props.getshowLoader(true);
      } else {
        this.props.getshowLoader(false);
        Alert.alert(globals.APP_NAME, 'Please enter valid mobile number')
      }
    }
    else if (this.state.mobileNo.length == 10) {

      if (this.state.mobileNo.charAt(0) == 0) {
        Alert.alert(globals.APP_NAME, 'Please enter valid mobile number')

      } else {
        this.props.getshowLoader(true);
        this.callRegisterAPI(this.state.mobileNo);
      }
    }

    else {
      setTimeout(() => {
        Alert.alert(globals.APP_NAME, globals.registerMobileNumberWrongLength, [{ text: 'OK', onPress: () => this.refs.textInput.focus() }])
      }, 600);
      this.props.getshowLoader(false);
    }
  }

  /**
   * Method for get response of check user authentication API
   */
  responseData = {
    success: (response) => {
      console.log("REGISTER LOGIN "+JSON.stringify(response));
      // if (response.code == 404) {
      //   alert('News user')
      // }else {
      //   alert('Old user')
      // }
      if (response.code === 404) {

        this.props.navigation.navigate('Password', { country_code: this.state.countryCode, real_mobile: this.state.mobileNo, mobile: this.state.countryCode + this.state.mobileNo, title: 'Register', flow: 'registration', userId: '' });

      } else {

        this.props.navigation.navigate('Password', { country_code: this.state.countryCode, real_mobile: this.state.mobileNo, mobile: this.state.countryCode + this.state.mobileNo, title: 'Register', flow: 'login', userId: response.data.user.id });

      }
      AsyncStorage.getItem(globals.fcm_token).then((value) => {
        globals.getFCMToken = value;
        console.log("VVVVVVVVVVVVVVVV " + value);

      });

      sha256(this.state.countryCode + this.state.mobileNo).then(hash => {
        console.log("Mobile Number Hash>>>>" + hash);
        console.log("FCM TOKEN AYNS " + globals.getFCMToken);
        globals.getMobileHash = hash;
        var data = {
          topics: [
            "stocks"
          ],
          pushToken: globals.getFCMToken,
          userId: hash
        };

        API.push_register(this.responsePushRegisterData, data, true);
      })

    },
    error: (err) => {
      this.props.getshowLoader(false);
      console.log("File Error " + JSON.stringify(err));
      this.setState({ mobileNo: actualMobileNo })
      Alert.alert(globals.APP_NAME, globals.timeoutMessage)
    },
    complete: () => {
      this.props.getshowLoader(false);
    }
  }

  responsePushRegisterData = {
    success: (response) => {
      console.log("Mobile Number Hash Success >>>>> " + JSON.stringify(response));

    },
    error: (err) => {
      console.log("File Error " + JSON.stringify(err));
    },
    complete: () => {
    }
  }

  callRegisterAPI(mobile_no) {

    this.refs.textInput.setNativeProps({ 'editable': false });
    if (globals.isInternetConnected) {
      API.user_check_registration(this.responseData, this.state.countryCode, mobile_no, false);
    } else {
      this.refs.textInput.setNativeProps({ 'editable': true });
      this.props.getshowLoader(false);
      this.setState({ mobileNo: actualMobileNo })
      Alert.alert(globals.APP_NAME, globals.networkNotAvailable, [{ text: 'OK', onPress: () => this.refs.textInput.focus() }])

    }
  }

  render() {
    const message = globals.registerWhichMobileNumberUse;
    return (
      <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: colors.blue }]}>
        {this.openAgreement()}
        <ScrollView scrollEnabled={false} contentContainerStyle={styles.MainContainer} keyboardShouldPersistTaps='handled'  >
          <View style={[styles.MainContainer, styles.pageContainer]} >
            <View style={{ width: globals.WINDOW.width, height: Header.HEIGHT + (globals.iPhoneX ? 24 : 0), backgroundColor: colors.blue, position: 'absolute', left: 0, top: (-Header.HEIGHT - (globals.iPhoneX ? 24 : 0)) }}></View>
            <KeyboardAvoidingView behavior={globals.keyboardBehaviour} keyboardVerticalOffset={globals.keyboardOffsetScreenReg} keyboardShouldPersistTaps='handled'>
              <View style={[styles.logoWrapper]}>
                <Image source={register.clane_logo_white} style={[styles.logo]} />
              </View>
              <View style={styles.msgVW}>
                <Text style={globalStyles.heading}>{message}</Text>
              </View>
              <View style={globalStyles.textInputView}>
                <CountryPicker
                  countryList={NORTH_AMERICA}
                  onChange={value => {
                    this.setState({ cca2: value.cca2, callingCode: value.callingCode }, () => {
                      console.log("Country code " + value.callingCode);
                      this.setState({ countryCode: value.callingCode })
                    });

                  }}
                  cca2={this.state.cca2}
                  translation="eng"
                />

                {this.state.callingCode && (
                  <TouchableOpacity onPress={() => CountryPicker.registerModalOpen()}>
                    <Text style={styles.countryCode}>
                      {"+" + (this.state.callingCode)}
                    </Text>
                  </TouchableOpacity>

                )}
                <TouchableOpacity onPress={() => CountryPicker.registerModalOpen()}>
                  <FontAwesomeIcon name={"caret-down"} color={colors.white} size={20} style={{ marginTop: 4 }} />
                </TouchableOpacity>
                {/* {this.state.country && (
                  <Text style={styles.data}>
                    {JSON.stringify(this.state.country, null, 2)}
                  </Text>
                )} */}
                {/* <Text style={styles.countryCode}>{ "+"  + this.state.countryCode}</Text> */}
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholderTextColor={colors.purplePlaceholder}
                  keyboardType='phone-pad'
                  ref={'textInput'}
                  maxLength={this.state.mobile_maxlength}
                  style={styles.textInput}
                  placeholder={globals.passwordMobilePlaceHolder}
                  onChangeText={(text) => this.checkMobileNumberStartWith(text)}
                  value={this.state.mobileNo} />
              </View>
              <Button
                onPress={() => this.ValidateField()}
                textStyle={globalStyles.buttonText}
                buttonStyles={globalStyles.buttonStyles}
                text={globals.btnContinue}></Button>
              <View style={styles.agreementView}>
                <Text style={styles.agreement}>{globals.registerBySigningUp}</Text>
                <TouchableWithoutFeedback onPress={() => this.setState({ openAgreement: true })}>
                  <Text style={styles.agreementClane}>{globals.registerClaneServiceAgreement}</Text>
                </TouchableWithoutFeedback>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

// ********************** Model mapping method **********************

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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
