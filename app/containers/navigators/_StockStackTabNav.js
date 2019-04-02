import { createStackNavigator } from 'react-navigation';
import StockNewsShowMore from '../screens/Stocks/newsArticleShowMore';
import ModalNavigator from './_RegisterNavigator';
import StocksTabNav from './_StockTabNavigator';
import ResetPasswordModalNavigator from './_ChangePasswordNavigator';
import DashboardNavigator from './_DashboardNavigator';

const StockStackTabNavigtor = createStackNavigator({
    
    StocksTabNav: {
        screen: StocksTabNav,
    },
    StockNewsShowMore:{
        screen: StockNewsShowMore,
        navigationOptions: {tabBarVisible: false}
    },
    ModalNavigator:{
        screen:ModalNavigator,
    },
    // DashboardNavigator:{
    //     screen:DashboardNavigator,
    // },
    ResetPasswordModalNavigator:{
        screen: ResetPasswordModalNavigator,
        navigationOptions: {tabBarVisible: false}
    },
     
    
},{
    initialRouteName : 'StocksTabNav',
    navigationOptions :{
        header: null,
        gesturesEnabled: false,
         cardStyle: {
              opacity: 1,
            }
       
    },
    
        
    mode: 'modal',
    headerMode: 'none'
});


export default StockStackTabNavigtor;