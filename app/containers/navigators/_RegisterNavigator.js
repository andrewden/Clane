import { createStackNavigator } from 'react-navigation';
import Register from '../screens/Authentication/register';
import PhoneOTP from '../screens/Authentication/phoneOTP';
import Password from '../screens/Authentication/password';
import ForgotPassword from '../screens/Authentication/forgotPassword';
import ResetPassword from '../screens/Authentication/resetPassword';
import ResetPasswordSuccess from '../screens/Authentication/resetPasswordSuccess';
import IOSPhoneOTP from '../screens/Authentication/iosphoneOTP';
 
const ModalNavigator = createStackNavigator({
    Register: {
        screen: Register
    },
    PhoneOTP: {
        screen: PhoneOTP
    },
    Password: {
        screen: Password
    },
    ForgotPassword: {
        screen: ForgotPassword
    },
    ResetPassword: {
        screen: ResetPassword
    },
    ResetPasswordSuccess: {
        screen: ResetPasswordSuccess
    },
    IOSPhoneOTP: {
        screen: IOSPhoneOTP
    },
     
     
}, { 
    initialRouteName: 'Register',
});

export default ModalNavigator;