import { createStackNavigator } from 'react-navigation';
import Dashboard from '../screens/InitialStock/dashboard';
import Dummy from '../screens/InitialStock/dummy';

import DashboardNewsArticleDetail from '../screens/InitialStock/dashboardNewsArticleDetail'
import Category from '../screens/Stocks/category';
import NewsPreferences from '../screens/Stocks/newsPreferences'
import StockDetails from '../screens/Stocks/stockDetails';
import StockDetailSearch from '../screens/Stocks/stockDetailSearch';

import Preferences from '../screens/Authentication/preferences';
import CategoryNewsArticle from '../screens/Stocks/categoryNewsArticle'
import ModalNavigator from './_RegisterNavigator';
import StocksTabNav from './_StockTabNavigator';
import ResetPasswordModalNavigator from './_ChangePasswordNavigator';
import NewsSearchScreen from '../screens/Stocks/NewsSearchScreen'
import NewsSearchDetail from '../screens/InitialStock/newsSearchDetail'
import mainStyles from '../../assets/styles/app';
import NewsStockSearchModal from '../screens/InitialStock/newsStockSearchModal'


const DashboardNavigator = createStackNavigator({

    Dashboard: {
        screen: Dashboard,
        navigationOptions: {
            header: null,
        }
    },

    Dummy: {
        screen: Dummy,
        navigationOptions: {
            header: null,
        }
    },
    
    
    DashboardNewsArticleDetail: {
        screen: DashboardNewsArticleDetail,
    },

    NewsStockSearchModal: {
        screen: NewsStockSearchModal,
    },

    ModalNavigator:{
        screen:ModalNavigator,
        navigationOptions: {
            header: null,
        }
    },
    Category: {
        screen: Category,
        navigationOptions: {
            header: null,
        }
    },
    NewsSearchScreen: {
      screen: NewsSearchScreen,
      navigationOptions: {
        tabBarVisible: false,
        header:null
    }
  },

    NewsPreferences: {
        screen: NewsPreferences,
        navigationOptions: {
            header: null,
        }
    },
    NewsSearchDetail : {
      screen: NewsSearchDetail,
        navigationOptions: {
            header: null,
        }
    },
    StockDetails: {
        screen: StockDetails,
        navigationOptions: {
            tabBarVisible: false,
            // header:null
        }
    },

    StockDetailSearch: {
        screen: StockDetailSearch,
        navigationOptions: {
            tabBarVisible: false,
            // header:null
        }
    },
   
   
    CategoryNewsArticle: {
        screen: CategoryNewsArticle,
        navigationOptions: {
            tabBarVisible: false,
        }
    },
    Preferences:{
        screen: Preferences,
        navigationOptions: {
            tabBarVisible: false,
            headerTitleStyle: mainStyles.tabTitle

        }
    },
    
    StocksTabNav: {
        screen: StocksTabNav,
        navigationOptions: {
            header: null

        }
    },
    ResetPasswordModalNavigator:{
        screen: ResetPasswordModalNavigator,
        navigationOptions: {
            tabBarVisible: false,
            header: null
        }
    },

    // StockNewsShowMore:{
    //     screen: StockNewsShowMore,
    //     navigationOptions: {tabBarVisible: false}
    // },
    // ModalNavigator:{
    //     screen:ModalNavigator,
    // },
    
}, {
        initialRouteName: 'Dashboard',
        navigationOptions: {
            //header: null,
            // header: {
            //     visible: true,
            //   },
            gesturesEnabled: true,
        },
        // mode: 'modal',
        //headerMode: 'none'
    });


export default DashboardNavigator;