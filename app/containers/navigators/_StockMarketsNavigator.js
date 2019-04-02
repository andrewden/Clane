import { createStackNavigator } from 'react-navigation';
import mainStyles from '../../assets/styles/app';
import StockDetails from '../screens/Stocks/stockDetails';
import StockDetailSearch from '../screens/Stocks/stockDetailSearch';

import StockTabs from '../screens/Stocks/stockTab';
import SearchBarScreen from '../screens/Stocks/searchBarScreen';
import NewsSearchScreen from '../screens/Stocks/NewsSearchScreen';
import IndicesDetail from '../screens/Stocks/indicesDetail';
import CompanyInfo from '../screens/Stocks/companyInfo';
import CompanyTabs from '../screens/Stocks/companyTab';
import StockNewsArticle from '../screens/Stocks/stockNewsArticle';
import StockNewsLoadMore from '../screens/Stocks/stockNewsLoadMore';
import StockNewsShowMore from '../screens/Stocks/newsArticleShowMore';
import stockNewsArticleDetail from '../screens/Stocks/stockNewsArticleDetail';
import Preferences from '../screens/Authentication/preferences';
import NewsAndroidWebview from '../screens/Stocks/newsAndroidWebview';
import NewsArticleWebView from '../screens/InitialStock/NewsArticleWebView';
 const MarketsNavigator = createStackNavigator(
    {
        StockTabs: {
            screen: StockTabs,
        },
        
        StockDetails: {
            screen: StockDetails,
            navigationOptions: {tabBarVisible: false}
        },
        // StockDetailSearch: {
        //     screen: StockDetailSearch,
        //     navigationOptions: {tabBarVisible: false}
        // },
        stockNewsArticleDetail: {
            screen: stockNewsArticleDetail,        
            navigationOptions: {
                tabBarVisible: false,
                headerTitleStyle: mainStyles.tabTitle
            }
        },
        IndicesDetail: {
            screen: IndicesDetail,
            navigationOptions: {
                tabBarVisible: true,
            }
        },
        SearchBarScreen: {
            screen: SearchBarScreen,
        },
        NewsSearchScreen: {
            screen: NewsSearchScreen,
            navigationOptions: {
              tabBarVisible: false,
              header:null
          }
        },
        CompanyInfo: {
            screen: CompanyInfo,
            navigationOptions: {
                headerTitleStyle: mainStyles.tabTitle
            }
        },
        StockNewsArticle: {
            screen: StockNewsArticle,
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
        Preferences:{
            screen: Preferences,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        NewsAndroidWebview:{
            screen: NewsAndroidWebview,
            navigationOptions: {
                tabBarVisible: false,
                header:null
            }
        },
        NewsArticleWebView:{
            screen: NewsArticleWebView,
            navigationOptions: {
                tabBarVisible: false,
                header:null
            }
        },

    },{
        initialRouteName: 'StockTabs',
        navigationOptions: {
            headerTitleStyle: mainStyles.tabTitle    
        },
    }
);

MarketsNavigator.navigationOptions = ({
    navigation
}) => {    
    let tabBarVisible = true;
    if (navigation.state.index > 0) {        
        if (navigation.state.routes[navigation.state.index] != null && navigation.state.routes[navigation.state.index] != undefined) {            
            if (navigation.state.routes[navigation.state.index].routeName == "StockDetails" || navigation.state.routes[navigation.state.index].routeName == "StockNewsLoadMore" || 
            navigation.state.routes[navigation.state.index].routeName == "stockNewsArticleDetail" ||
            navigation.state.routes[navigation.state.index].routeName == "Preferences" ||
            navigation.state.routes[navigation.state.index].routeName == "NewsAndroidWebview" ||
            navigation.state.routes[navigation.state.index].routeName == "NewsArticleWebView" ||
            navigation.state.routes[navigation.state.index].routeName == "NewsSearchScreen")

            {                
                tabBarVisible = false;            
            }        
        }    
    }
        
    return {        
        tabBarVisible,
            
    };
};
export default MarketsNavigator;