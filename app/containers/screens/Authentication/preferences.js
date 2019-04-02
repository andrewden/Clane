import React, { Component, Fragment } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    AsyncStorage,
    TouchableOpacity,
    Platform,
    Linking,
    Image,
    Modal
} from 'react-native';
import styles from './style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeTheme } from '../../../redux/actions/changeTheme';
import globalStyles from '../../../assets/styles/globalStyles';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import { HeaderBackButton } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import DeviceInfo from 'react-native-device-info';
import { preference } from '../../../assets/images/map'
import Agreement from './agreement'
var _this = null;
class Preferences extends Component {

    constructor(props) {
        super(props);
        _this= this;
        this.state = {
            mobile: '',
            openAgreement: false,
            openTermsCondtions : false,
            country_code: ''
        }
        
    }

    componentDidMount() {
        AsyncStorage.getItem(globals.aysnc_loggedInNumber, (err, result) => {
            if (result !== null) {
                this.setState({ mobile: result })
            }
        })
        AsyncStorage.getItem(globals.aysnc_loggedInCountryCode, (err, result) => {
            if (result !== null) {
                this.setState({ country_code: result })
            }
        })
    }

  

    static navigationOptions = ({ navigation, screenProps, }) => {
        const { state } = navigation;
        return {
            header: null,
            headerTitle: globals.screenTitle_Preferences,
            headerStyle: globalStyles.navigationHeaderStyle,
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title='' tintColor='white' />,
            navBarTranslucent: true,
        }
    }

    static closeAgreement(){
        _this.setState({openAgreement: false})
      }

      static closeTermsCondtions(){
        _this.setState({openTermsCondtions : false})
      }

    openAgreement(){
        return(
          <Modal animationType='slide' visible={this.state.openAgreement} onRequestClose={() => Preferences.closeAgreement()}>
          <Agreement setParentState={newState => this.setState(newState)} isFrom ={'setting'} isCategory={'PrivacyPolicy'}/>
         </Modal>
        )
      }

  openTermsAndConditions() {
    return(
      <Modal animationType='slide' visible={this.state.openTermsCondtions} onRequestClose={() => Preferences.closeTermsCondtions()}>
        <Agreement setParentState={newState => this.setState(newState)} isFrom={'setting'} isCategory={'TermsConditions'} />
      </Modal>
    )
    
  }

    /**
     * Method for change password navigation
     */
    goToChangePassword() {
        console.log('goToChangePassword ' + globals.globalVars.userId_Global + ' ' + this.state.mobile);
        globals.globalVars.dashboardTitle = globals.screenTitle_Preferences
        // this.props.navigation.navigate('ResetPasswordModalNavigator', { userId: globals.globalVars.userId_Global, mobile: '234' + this.state.mobile, title: globals.screenTitle_ChangePassword });
        this.props.navigation.navigate('ResetPasswordModalNavigator', { userId: globals.globalVars.userId_Global, mobile: this.state.country_code + this.state.mobile, title: globals.screenTitle_ChangePassword, real_mobile: this.state.mobile, country_code: this.state.country_code});
    }

    /**
     * Method for invite friend click
     */
    btnInviteFirends() {
        console.log('btnInviteFirends');
        if (Platform.OS == 'ios') {
            const shareOptions = {
                title: globals.APP_NAME,
                url: globals.iosItunesAppUrl,
            };
            Share.open(shareOptions).catch(err => console.log(err))
        } else {
            const shareOptions = {
                title: globals.APP_NAME,
                url: globals.androidPlayStoreAppUrl,
            };
            Share.open(shareOptions).catch(err => console.log(err))
        }
    }

    btnHavingIssueClick(url) {
        Linking.openURL(url)
    }
    render() {
        return (
            <Fragment>
                <SafeAreaView style={{ flex: 0, backgroundColor: colors.blue }} />
                <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: colors.white }]}>
                    {this.openAgreement()}
                    {this.openTermsAndConditions()}
                    <View style={{ padding: 15, backgroundColor: colors.blue, flexDirection: 'row',   }}>
                        <View style={{marginLeft:0}} ></View>
                        {/* <HeaderBackButton  style={{alignSelf: 'flex-start',}}onPress={() => this.props.navigation.goBack(null)} title='' tintColor='white' /> */}
                        <TouchableOpacity style={{justifyContent:'flex-start', }} onPress={() =>this.props.navigation.goBack(null)}>
                            <View style={{padding:10}}>
                            <Ionicons name="ios-arrow-back" size={30} color={colors.white} />
                            </View>
                        </TouchableOpacity>
                        <View style={{flex:1,justifyContent:'center'}}>
                        <Text style={styles.headerTitle}>{globals.screenTitle_Preferences}</Text>
                        </View>
                        
                    </View>
                    <View style={[styles.prefMainView ]}>

                        <View style={styles.prefMainView}>

                            {
                                (globals.isLoggedIn == 'true') ?
                                    <View style={styles.prefTopBlue}>
                                        <FontAwesome name="user-circle-o" size={globals.WINDOW.width / 4} color={colors.purplePlaceholder} />
                                        <View style={styles.prefRowView}>
                                            <Text style={[styles.prefPhoneText, { marginRight: 8 }]}>+{this.state.country_code}</Text>
                                            <Text style={styles.prefPhoneText}>{this.state.mobile}</Text>
                                        </View>
                                    </View>
                                    :
                                    null
                            }

                            {
                                (globals.isLoggedIn == 'true') ?
                                    <TouchableOpacity onPress={() => this.goToChangePassword()}>
                                        <View style={[styles.prefRowView, { height: 60 }]}>
                                            <View style={styles.prefRowIcon}>
                                                <EvilIcons name="lock" size={30} color={colors.blackColor} />
                                            </View>
                                            <View style={styles.prefRowTextView}>
                                                <Text style={styles.prefRowText}>Change Password</Text>
                                            </View>
                                            <View style={[styles.prefRowTextView, { flex: 1, }]}>
                                                <Ionicons name="ios-arrow-forward" size={30} color={colors.rightArrow} style={styles.prefArrowIcon} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    null
                            }

                            {
                                (globals.isLoggedIn == 'true') ?
                                    <View style={styles.prefLineView}></View>
                                    :
                                    null
                            }

                            <TouchableOpacity onPress={() => this.btnInviteFirends()}>
                                <View style={[styles.prefRowView, { height: 60 }]}>
                                    <View style={styles.prefRowIcon}>
                                        <SimpleLineIcons name="user-follow" size={20} color={colors.blackColor} />
                                    </View>
                                    <View style={styles.prefRowTextView}>
                                        <Text style={styles.prefRowText}>Invite Friends</Text>
                                    </View>
                                    <View style={[styles.prefRowTextView, { flex: 1 }]}>
                                        <Ionicons name="ios-arrow-forward" size={30} color={colors.rightArrow} style={styles.prefArrowIcon} />
                                    </View>
                                </View>
                                <View style={styles.prefLineView}></View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.btnHavingIssueClick(globals.claneSupportLink)}>
                                <View style={[styles.prefRowView, { height: 60 }]}>
                                    <View style={styles.prefRowIcon}>
                                        <SimpleLineIcons name="earphones-alt" size={20} color={colors.blackColor} />
                                    </View>
                                    <View style={styles.prefRowTextView}>
                                        <Text style={styles.prefRowText}>Having Issues?</Text>
                                    </View>
                                    <View style={[styles.prefRowTextView, { flex: 1 }]}>
                                        <Ionicons name="ios-arrow-forward" size={30} color={colors.rightArrow} style={styles.prefArrowIcon} />
                                    </View>
                                </View>
                                <View style={styles.prefLineView}></View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setState({openAgreement: true})}>
                                <View style={[styles.prefRowView, { height: 60 }]}>
                                    <View style={styles.prefRowIcon}>
                                        <Image source={preference.termsConditions} style={{height: 23, width: 23, tintColor: colors.blackColor}}   resizeMode ={'contain'}/>
                                    </View>
                                    <View style={styles.prefRowTextView}>
                                        <Text style={styles.prefRowText}>Privacy Policy</Text>
                                    </View>
                                    <View style={[styles.prefRowTextView, { flex: 1 }]}>
                                        <Ionicons name="ios-arrow-forward" size={30} color={colors.rightArrow} style={styles.prefArrowIcon} />
                                    </View>
                                </View>
                                <View style={styles.prefLineView}></View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setState({openTermsCondtions: true})}>
                                <View style={[styles.prefRowView, { height: 60 }]}>
                                    <View style={styles.prefRowIcon}>
                                        <Image source={preference.policy} style={{height: 28, width: 28, tintColor: colors.blackColor}}   resizeMode ={'contain'}/>
                                    </View>
                                    <View style={styles.prefRowTextView}>
                                        <Text style={styles.prefRowText}>Terms And Conditions</Text>
                                    </View>
                                    <View style={[styles.prefRowTextView, { flex: 1 }]}>
                                        <Ionicons name="ios-arrow-forward" size={30} color={colors.rightArrow} style={styles.prefArrowIcon} />
                                    </View>
                                </View>
                                <View style={styles.prefLineView}></View>
                            </TouchableOpacity>

                        </View>
                        <View style={[styles.prefRowView, { height: 60, alignItems: 'center', marginBottom: (globals.iPhoneX)? -30 : -10, justifyContent: 'center',   },]}>
                            {/* <Text style={styles.prefAppVersion}>{"Clane v" + DeviceInfo.getVersion()}</Text> */}
                            <Text style={styles.prefAppVersion}>{"Clane v1.1"}</Text>

                        </View>
                    </View>
                </SafeAreaView>
            </Fragment>

        )
    }
}

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
    return {
        theme: state.changeTheme_red.theme,
    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    changeTheme,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);