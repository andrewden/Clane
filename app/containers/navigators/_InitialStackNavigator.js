import { createSwitchNavigator } from "react-navigation";
import InitalStock from "../screens/InitialStock/index";
import StockStackTabNavigtor from "./_StockStackTabNav";
import StockNewsShowMore from "../screens/Stocks/newsArticleShowMore";
import DashboardNavigator from "./_DashboardNavigator"
import mainStyles from "../../assets/styles/app";
const InitalRootStack = createSwitchNavigator({
  
    
    
    InitalStock: {
        screen: InitalStock,
    },
    DashboardNavigator: {
        screen: DashboardNavigator,
    },
    // StocksTabNav: {
    //     screen: StockStackTabNavigtor,
    // },
    StockNewsShowMore:{
        screen: StockNewsShowMore,
        navigationOptions: {tabBarVisible: false}
    },
   
},

{
    initialRouteName : 'InitalStock',
    navigationOptions :{
        header: null,
        gesturesEnabled: false,
    },
    headerMode: 'none'
});


export default InitalRootStack;