import { createStackNavigator } from 'react-navigation';
import mainStyles from '../../assets/styles/app';
import News from '../screens/Stocks/news';
import StockDetails from '../screens/Stocks/stockDetails';
import StockDetailSearch from '../screens/Stocks/stockDetailSearch';

import CompanyInfo from '../screens/Stocks/companyInfo';
import StockNewsShowMore from '../screens/Stocks/newsArticleShowMore';

import stockNewsArticleDetail from '../screens/Stocks/stockNewsArticleDetail';

const NotificationsNavigator = createStackNavigator({
    News: {
        screen: News,
        navigationOptions: {
            headerTitleStyle: mainStyles.tabTitle
          }
    },
    StockDetails: {
        screen: StockDetails,        
        navigationOptions: {
            tabBarVisible: false,
            headerTitleStyle: mainStyles.tabTitle
        }
    },
    // StockDetailSearch: {
    //     screen: StockDetailSearch,        
    //     navigationOptions: {
    //         tabBarVisible: false,
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
    CompanyInfo: {
        screen: CompanyInfo,
        navigationOptions: {
            headerTitleStyle: mainStyles.tabTitle
        }
    },
    StockNewsShowMore: {
        screen: StockNewsShowMore,
        navigationOptions: {
            headerTitleStyle: mainStyles.tabTitle
        }
    }
},{
    initialRouteName : 'News'
});

NotificationsNavigator.navigationOptions = ({
    navigation
}) => {    
    let tabBarVisible = true;
    if (navigation.state.index > 0) {        
        if (navigation.state.routes[navigation.state.index] != null && navigation.state.routes[navigation.state.index] != undefined) {            
            if (navigation.state.routes[navigation.state.index].routeName == "StockDetails" || navigation.state.routes[navigation.state.index].routeName == "StockNewsLoadMore" || 
            navigation.state.routes[navigation.state.index].routeName == "stockNewsArticleDetail") 
            {                
                tabBarVisible = false;            
            }        
        }    
    }
        
    return {        
        tabBarVisible,
            
    };
};

export default NotificationsNavigator;