import { createStackNavigator, } from 'react-navigation';
import mainStyles from '../../assets/styles/app';
import WatchList from '../screens/Stocks/watchlist';
import StockDetails from '../screens/Stocks/stockDetails';
import StockDetailSearch from '../screens/Stocks/stockDetailSearch';

import SearchBarScreen from '../screens/Stocks/searchBarScreen';
import CompanyInfo from '../screens/Stocks/companyInfo';
import StockNewsLoadMore from '../screens/Stocks/stockNewsLoadMore';
import CompanyTabs from '../screens/Stocks/companyTab';
import StockNewsShowMore from '../screens/Stocks/newsArticleShowMore';
import stockNewsArticleDetail from '../screens/Stocks/stockNewsArticleDetail';

const WatchListNavigator = createStackNavigator({
    WatchList: {
        screen: WatchList,
        navigationOptions: {
            //   headerTitleStyle: mainStyles.tabTitle
        }
    },
    StockDetails: {
        screen: StockDetails,        
        navigationOptions: {
            headerTitleStyle: mainStyles.tabTitle
        }
    },
    // StockDetailSearch: {
    //     screen: StockDetailSearch,        
    //     navigationOptions: {
    //         headerTitleStyle: mainStyles.tabTitle
    //     }
    // },
    stockNewsArticleDetail: {
        screen: stockNewsArticleDetail,        
        navigationOptions: {
            tabBarVisible: false,
            headerTitleStyle: mainStyles.tabTitle
        }
    },

    SearchBarScreen: {
        screen: SearchBarScreen,
        navigationOptions: {
            headerTitleStyle: mainStyles.tabTitle
        }
    },
    CompanyInfo: {
        screen: CompanyInfo,
        navigationOptions: {
            headerTitleStyle: mainStyles.tabTitle
        }
    },
    CompanyTabs: {
        screen: CompanyTabs,
        navigationOptions: {
            headerTitleStyle: mainStyles.tabTitle
        }
    },
    StockNewsLoadMore:{
        screen: StockNewsLoadMore,
        navigationOptions: {tabBarVisible: false}
    },
    StockNewsShowMore:{
        screen: StockNewsShowMore,
        navigationOptions: {tabBarVisible: false}
    }, 
},{
    initialRouteName : 'WatchList'
});

WatchListNavigator.navigationOptions = ({
    navigation
}) => {    
    let tabBarVisible = true;
    if (navigation.state.index > 0) {        
        if (navigation.state.routes[navigation.state.index] != null && navigation.state.routes[navigation.state.index] != undefined) {            
            if (navigation.state.routes[navigation.state.index].routeName == "StockDetails" || navigation.state.routes[navigation.state.index].routeName == "StockNewsLoadMore") {                
                tabBarVisible = false;            
            }        
        }    
    }
        
    return {        
        tabBarVisible,
            
    };
};

export default WatchListNavigator;