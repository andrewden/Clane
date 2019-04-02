import { createStackNavigator } from "react-navigation";
import TabNav from "./_TabNavigator";
import StocksTabNav from "./_StockTabNavigator";
import TransferNav from "./_TransferNavigator";
import More from "../screens/More/index";
import PaymentNav from '../navigators/_PaymentNavigator';
import CollectNav from '../navigators/_CollectNavigator';

const RootSubStack = createStackNavigator({
    TabNav: {
        screen: TabNav,
    },
    StocksTabNav: {
        screen: StocksTabNav,
    },
    TransferNav: {
        screen: TransferNav,
    },
    PaymentNav: {
        screen: PaymentNav,
    },
    CollectNav: {
        screen: CollectNav,
    },
    More: {
        screen: More,
    },
},{
    initialRouteName : 'TabNav',
    navigationOptions :{
        header: null,
        gesturesEnabled: false,
    },
});

export default RootSubStack;