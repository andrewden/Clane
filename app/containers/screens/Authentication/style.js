import { StyleSheet,Platform } from 'react-native';
import baseStyles from '../../../assets/styles';
import * as colors from '../../../assets/styles/color';
import * as globals from '../../../lib/globals';

export default StyleSheet.create({

    // Register Screen component style
    row:{
        flexDirection:'row',
    },
    pageContainer: {
        backgroundColor: colors.blue,
        padding: 20,
        justifyContent: 'space-between',
        flex: 1,
    },
    pageContainertxtMeCallMe:{
        backgroundColor: colors.blue,
        paddingTop: 20,
        justifyContent: 'space-between',
    },
    MainContainer: {
        height: '100%',
        width: '100%',
        flex: 1,
        justifyContent: 'center',
    },
    txtMeCallMeButtonView:{
        flexDirection: 'row', marginTop: 20, height: 50, width: '100%'
    },
    logoWrapper: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    logo: {
        width: 100,
        height: 29,
        marginBottom: 30
    },
    msgVW: {
        paddingBottom: 25,
        alignItems: 'center',
        flexDirection: 'column'
    },
    touchableFont: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.white,
        fontFamily: globals.fontSFProTextRegular
    },
    touchableFontOpacity: {
        fontSize: 15,
        opacity: 0.6,
        fontWeight: '600',
        color: colors.white,
        fontFamily: globals.fontSFProTextRegular
    },
    agreement: {
        alignSelf: 'center',
        fontSize: 15,
        color: colors.lightwhite,
        fontWeight: '600',
        fontFamily: globals.fontSFProTextRegular
    },

    agreementClane: {
        alignSelf: 'center',
        fontSize: 15,
        color: colors.white,
        fontWeight: '800',
        fontFamily: globals.fontClaneLetteraTextTTBold
    },

    agreementView: {
        alignItems: 'center',
        ...baseStyles.font.h1Margin,
        paddingTop: 10,
        
    },
    countryCode: {
        ...baseStyles.font.regular,
        fontSize: 17,
        color: colors.white,
        fontFamily: globals.fontSFProTextRegular,
        padding: baseStyles.measurement.units.gutter.small
    },
    textInput: {
        ...baseStyles.font.regular,
        ...baseStyles.font.h2Default,
        color: colors.white,
        left: 20,
        flex: 1,
        marginRight: 20,
        height: 40,
        paddingBottom: 7,
        borderBottomColor: colors.lightwhite_55,
        borderBottomWidth: 1,
        fontSize: 17,
        lineHeight: 20
    },

    // OTP Screen component style

    headingText: {
        paddingBottom: 30,
        alignItems: 'center',
        flexDirection: 'column'
    },

    textInputView1: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop : 10
    },

    txtIP: {
        textAlign: 'center',
        ...baseStyles.font.h2Default,
        color: colors.white,
        fontSize: 30,
        lineHeight: 48
    },
    textInputView2: {
        borderColor: colors.blue,
        borderRadius: 8,
        width: '14%',
        height: 50,
        alignItems: 'center',
    },
    textInputView: {
        marginLeft: 15,
        borderColor: colors.blue,
        borderRadius: 8,
        width: '14%',
        height: 50,
        alignItems: 'center',
    },
    mobileNo: {
        paddingTop: 15,
        fontWeight: '400',
        fontSize: 17,
        fontFamily: globals.fontSFProTextRegular,
        color: colors.lightPurpleText,
    },

    // Password Screen component style
    pageContainerPassword: {
        flex: 1,
        backgroundColor: colors.blue,
       padding: 20,

    },
     // Password Screen component style
     pageContainerPasswordScreenStyle: {
        flex: 1,
        backgroundColor: colors.blue,
        paddingTop : 20
       // padding: 20,

    },

    pageContainerForgotPassword: {
        backgroundColor: colors.blue,
        padding: 20,
        justifyContent: 'center',
        alignSelf: 'center'

    },

    textInputPassword: {
        fontSize: 17,
        fontWeight: '400',
        color: colors.white,
        height: 40,
        width: "100%",
    },

    // Registration Successful
    regSuccesslogo: {
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    regSuccessMsgVW: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    txtForgotPassword: {
        color: colors.white,
        fontFamily: globals.fontSFProTextRegular,
        fontSize: globals.font_16,
        marginTop: 20,
        alignSelf: 'center'
    },
    txtForgotPasswordMobileNumber: {
        color: colors.white,
        fontFamily: globals.fontSFProTextRegular,
        fontSize: globals.font_16,

    },
    buttonStylesForgot: {
        marginTop: 20,
        height: 50,
        justifyContent: 'center',
        backgroundColor: colors.lightblue_2,
        borderRadius: 7,
        borderColor: colors.blue,
    },
    buttonStylesTextCallMe : {
        backgroundColor: colors.lightblue_2,
        borderRadius: 7,
        borderColor: colors.blue,
      


    },

    buttonTextForgot: {
        color: colors.white,
        textAlign: 'center',
        // fontWeight: '800',
        fontFamily: globals.fontSFProTextRegular,
        fontSize: 17,
        lineHeight: 17 * 1.5,
        height: '100%',
    },
    textInputForgotPassword: {
        fontSize: 17,
        fontWeight: '400',
        color: colors.white,
        height: (Platform.OS == 'ios') ? 30: 40,
        width: "100%",
    },
    btnImage:
    {
        resizeMode: 'contain',
        height: '100%',
        width: '100%'
    },
    visibilityBtn:
    {
        position: 'absolute',
        right: 3,
        height: 40,
        width: 35,
        padding: 5
    },
    txtPasswordHintTitle: {
        color: colors.white,
        fontFamily: globals.fontSFProTextLight,
        fontSize: globals.font_14,
        marginTop: 10,
    },
    txtPasswordHintRule: {
        color: colors.white,
        fontFamily: globals.fontSFProTextLight,
        fontSize: globals.font_13,
        marginTop: 10,
        marginLeft:15,
    },
    checkIcon: {
        height:20,
        width:20,
        marginTop:10,
        resizeMode:'contain'
    },
    crossIcon: {
        height:10,
        width:10,
        padding:5,
        alignSelf:'flex-end',
        resizeMode:'contain'
    },
    otpValidation: {
        flex:0.1,
        backgroundColor:colors.white,
        padding:10,
        height:500
    },
    otpValidationBoldText: {
        fontSize: globals.font_15,
        alignSelf:'center',
        justifyContent: 'center',
        fontFamily: globals.fontClaneLetteraTextTTBold,
        color: colors.otpValidationColor,
    },
    otpValidationExtraBoldText: {
        fontSize: globals.font_15,
        fontFamily: globals.fontClaneLetteraTextTTExtraBold,
        color: colors.otpValidationColor,
    },

    //Preferences
    prefMainView: {
        flex: 1,
    },
    prefTopBlue: {
        height: '30%', 
        backgroundColor: colors.blue, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    prefPhoneText: {
        color: colors.white,
        fontFamily: globals.fontSFProTextRegular,
        fontSize: globals.font_16,
        marginTop: 18,
    },
    prefRowView: {
        flexDirection: 'row',
    },
    prefLineView: {
        backgroundColor: colors.lightWhiteStock,
        width: globals.WINDOW.width,
        height: 0.5,
        marginLeft: 20
    },
    prefRowText: {
        color: colors.darkGrayTextColor,
        fontFamily: globals.fontSFProTextRegular,
        fontSize: globals.font_14,
    },
    prefRowTextView: {
        justifyContent: 'center', 
        marginLeft: 8, 
        height: 60,
    },
    prefRowIcon: {
        justifyContent: 'center', 
        marginLeft: 20, 
        height: 60, 
        width: 30, 
        alignItems: 'center',
    },
    prefArrowIcon: {
        alignSelf: 'flex-end', 
        marginRight: 20
    },
    prefAppVersion: {
        color: colors.greythemeColor,
        fontFamily: globals.fontSFProTextRegular,
        fontSize: globals.font_12,
    },

    resetPasswodNotReceive: {
        fontSize: globals.font_14,
        fontFamily: globals.fontSFProTextRegular,
        color: colors.white,
    },
    resetPasswodResend: {
        fontSize: globals.font_14,
        fontFamily: globals.fontSFProTextBold,
        color: colors.white,
    },
    resetPasswodFooterView: {
        marginTop:10,
        alignSelf: 'center'
    },
    headingIOSOTP: {
        textAlign: 'center',
        fontSize: 17,
        lineHeight: 17 * 1.5,
        color: colors.white,
        fontWeight: '600',
        fontFamily: globals.fontSFProTextSemibold
    },
    textInputIOSOTPCODE: {
        fontSize: 32,
        fontFamily: globals.fontSFProTextSemibold,
        fontWeight: '600',
        color: colors.white,
        textAlign: 'center',
        height: (Platform.OS == 'ios') ? 30: 40,
        width: "35%",
    },
    textInputViewIOSOTP: {
        marginTop: 50,
        paddingRight: 5,
        borderColor: colors.white,
        flexDirection: 'row',
    },
    agreementViewIOSOTP: {
        alignItems: 'center',
        ...baseStyles.font.h1Margin,
        marginTop: 40
    },
    touchableFontIOSOTP: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.white,
        fontFamily: globals.fontSFProTextRegular
    },
    touchableFontOpacityIOSOTP: {
        fontSize: 14,
        opacity: 0.6,
        fontWeight: '600',
        color: colors.white,
        fontFamily: globals.fontSFProTextRegular
    },

    timerCountdown:{
        fontSize: 15,
        color: colors.white,
        fontFamily: globals.fontSFProTextRegular
    },
    headerTitle:{
        alignSelf:'center', 
        fontSize: globals.font_16, 
        color: colors.white,
        fontWeight:'500',
        marginLeft:-15,
        fontFamily: globals.fontSFProTextRegular
    }
})