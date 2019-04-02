
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Text,
    View,
    Alert,
    SafeAreaView
} from 'react-native';
import styles from './style';
import Button from '../../../components/Button';
import { bindActionCreators } from 'redux';
import { getshowModal } from '../../../redux/actions/showModal';
import { getshowLoader } from '../../../redux/actions/showLoaderModal';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import globalStyles from '../../../assets/styles/globalStyles';
import { API } from '../../../lib/api';
import { HeaderBackButton } from 'react-navigation';
var _this = null;

class ForgotPassword extends Component {


    hideKeyBoard(navigation) {
        this.refs.textInput.setNativeProps({ 'editable': false });
        navigation.dismiss();
    }

    static navigationOptions = ({ navigation, screenProps }) => {
        return {
            title: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.title : "",
            headerTintColor: colors.white,
            headerStyle: globalStyles.navigationHeaderStyle,
            gesturesEnabled: false,
            headerRight: null,
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title='Back' tintColor='white' />,

        };
    }

    constructor(props) {
        super(props);
        _this = this;
        this.state={
            otpMode : "sms"
        }

    }

    componentDidMount() {
        _this.props.navigation.setParams({ title: _this.props.navigation.state.params.title })
    }


    ValidateField(otpMode) {
        this.setState({otpMode : otpMode},() => this.apiCallResetPassword())
    }

    apiCallResetPassword(){
        API.reset_password(this.responseResetData, this.props.navigation.state.params.userId,this.state.otpMode, true);
    }

    /**
     * Method for get response of Reset passwrod method
     */
    responseResetData = {
        success: (response) => {
            try {

                this.props.navigation.navigate('ResetPassword', { userId: this.props.navigation.state.params.userId, mobile: this.props.navigation.state.params.mobile, otpMode : this.state.otpMode, real_mobile:this.props.navigation.state.params.real_mobile, country_code:this.props.navigation.state.params.country_code });

            } catch (error) {
                console.log(" Error in login " + JSON.stringify(error));
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

    render() {
        return (
            <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: colors.blue }]}>
                <View style={styles.MainContainer}>
                    <View style={[styles.pageContainerPasswordScreenStyle, {}]}>
                        <View style={[styles.headingText, { height: '20%', justifyContent: 'center', alignSelf: 'center', }]}>
                            <Text style={globalStyles.heading}>{"This will reset the current password registered with your phone number"}</Text>

                        </View>
                        <View style={[{ justifyContent: 'center', alignSelf: 'center', height: '10%', marginTop: 30 }]}>
                            <Text style={styles.txtForgotPasswordMobileNumber}>+{this.props.navigation.state.params.country_code} {this.props.navigation.state.params.real_mobile}</Text>
                        </View>
                        <View style={styles.txtMeCallMeButtonView}>
                            <View style={{flex : 1}}>
                                <Button
                                    onPress={() => this.ValidateField("sms")}
                                    textStyle={styles.buttonTextForgot}
                                    buttonStyles={[styles.buttonStylesTextCallMe,{marginLeft : 15}]}
                                    text={"Text Me"}></Button>
                            </View>
                            <View style={{flex : 1}}>
                                <Button
                                    onPress={() => this.ValidateField("voice")}
                                    textStyle={styles.buttonTextForgot}
                                    buttonStyles={[styles.buttonStylesTextCallMe,{marginRight : 15, marginLeft : 10,}]}
                                    text={"Call Me"}></Button>
                            </View>
                        </View>

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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

