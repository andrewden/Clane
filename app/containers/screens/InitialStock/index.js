import React, { Component } from 'react';
import { SafeAreaView, Text, AsyncStorage, Image } from 'react-native';
import globalStyles from '../../../assets/styles/globalStyles';
import SplashScreen from 'react-native-splash-screen'
import * as globals from '../../../lib/globals';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getshowModal } from '../../../redux/actions/showModal';
import { getshowLoader } from "../../../redux/actions/showLoaderModal";
import { API } from '../../../lib/api';
import dark_theme from '../Stocks/darkTheme';
import light_theme from '../Stocks/lightTheme';
import { changeTheme } from '../../../redux/actions/changeTheme';
import { changeTabColor } from '../../../redux/actions/changeTabColorModel';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import * as colors from '../../../assets/styles/color';
import BackgroundTimer from 'react-native-background-timer';
import RNFetchBlob from 'rn-fetch-blob'
import moment from 'moment';
var responseMarketList = [];
var stockDetail = [];

class InitalStock extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        console.log("componentWillReceiveProps");
    }

    componentDidMount() {
        console.log("Document dir-->",RNFetchBlob.fs.dirs)
        // this.props.navigation.navigate("StocksTabNav")
        // SplashScreen.hide();
        // SplashScreen.hide();
        // this.props.navigation.navigate("DashboardNavigator")
        // SplashScreen.hide();
        // this.props.navigation.navigate("DashboardNavigator")
        setTimeout(() => {
           
            console.log("globals.isInternetConnected " + globals.isInternetConnected);
            if (globals.isInternetConnected == true) {
                console.log("Internet av++++++++ailable");
                API.marketlist(this.responseMarketListData, globals.market_topgainers, false)
                this.checkTimeintervalForMarketStatus();
                API.marketGeneralNewsFeed(this.responseNewsData, false);
                this.callWSToGetWatchlist();
            } else {
                console.log("Internet not available");
                var bools = globals.checkThemeInOfflineMode();
                globals.marketStatusClose = bools;
                this.setTheme(bools);
            }

            BackgroundTimer.runBackgroundTimer(() => {
                if (globals.isInternetConnected == true) {
                    console.log("Internet available");
                    this.checkTimeintervalForMarketStatus();
                } else {
                    console.log("Internet not available");
                    var bools = globals.checkThemeInOfflineMode();
                    this.setTheme(bools);
                }
            }, 900000);//900000 
        }, 100);

        try {
            AsyncStorage.getItem('@AuthenticateAccessToken:key').then((value) => {
                globals.globalVars.AuthAccessToken = value;
            });
            AsyncStorage.getItem('@AuthenticateRefreshToken:key').then((value) => {
                globals.globalVars.AuthRefreshToken = value;
            });
            AsyncStorage.getItem('@UserID:key').then((value) => {
                globals.globalVars.userId_Global = value;
                globals.globalVars.userIdTemp_Global = value;
            });
            AsyncStorage.getItem('@Profile:key').then((value) => {
                if (value != null) {
                    var profile = JSON.parse(value);
                    globals.globalVars.isBVNVerified = profile.bvnVerified;
                }
            });
            AsyncStorage.getItem(globals.aysnc_isLoggedIn).then((value) => {
                if (value != null) {
                    globals.isLoggedIn = value;
                }
            });

        } catch (error) {
            console.log("error " + error);
        }
    }

    /**
      * Method for get response of market list API
      */
     responseMarketListData = {
        success: (response) => {
            console.log("Response of Stokcs Data " + JSON.stringify(response))
            responseMarketList = response.sData.data;
            AsyncStorage.setItem(globals.market_topgainers, new Date());
            AsyncStorage.setItem(globals.key_datasource + globals.market_topgainers, JSON.stringify(response));
           // SplashScreen.hide();
            try {
                console.log("Success Call");
            } catch (error) {
                SplashScreen.hide();
            }
        },
        error: (err) => {
            this.props.getshowLoader(false);
            SplashScreen.hide();
        },
        complete: () => {
            for (let index = 0; index < responseMarketList.length; index++) {
                API.stockInfo(this.responseStockInfoData, responseMarketList[index].stock_id, false);
            }
            this.props.getshowLoader(false);
        }
    }

     /**
     * Method for get response of stock info API
     */
    responseStockInfoData = {
        success: (response) => {
            try {
                var temData = stockDetail
                temData.push(response.sData)
                stockDetail = temData
                AsyncStorage.setItem(globals.key_wholestockInfoWithId, JSON.stringify(stockDetail));
                console.log("StockDetail-->" + JSON.stringify(stockDetail))
                AsyncStorage.setItem(globals.key_wholestockInfoWithId, JSON.stringify(stockDetail));

            } catch (error) {
            }
        },
        error: (err) => {
        },
        complete: () => {
        }
    }

     /**
     * Method for get response of general stock
     */
    responseNewsData = {
        success: (response) => {
            console.log("GENERAL NEWS RESPONSE " + JSON.stringify(response));
            try {
                AsyncStorage.setItem(globals.market_general_news_timeStamp, new Date());
                AsyncStorage.setItem(globals.market_async_general_news, JSON.stringify(response));
                response.topNews && response.topNews.map((news)=>{
                    news.article && news.article.image && globals.imageStore(news.article.image)
                }) 
                response.trendingNews && response.trendingNews.map((news)=>{
                    news.article && news.article.image && globals.imageStore(news.article.image)
                })

            } catch (error) {
                console.log("Error-->",error)
            }
        },
        error: (err) => {
            _this.setState({ footerLoading: false })

        },
        complete: () => {
        }
    }

    /**
      * Method for check time interval for market status
      */
    checkTimeintervalForMarketStatus() {
        this.callWSToGetMarketStatusAPI();
    }

    /**
     * Method for market status API call
    */
    callWSToGetMarketStatusAPI() {
        if (globals.isInternetConnected) {
            API.market_status(this.responseData, false);
        }
    }

    /**
     * Method for get time interval for watchlist
     */
    getTimeIntervalForWatchlist() {
        AsyncStorage.getItem(globals.watchlist_added, (err, result) => {
            if (result !== null && result != undefined) {
                globals.watchlist_added_ary = JSON.parse(result);
            }
            this.props.navigation.navigate("StocksTabNav")
        });
    }

    /**
     * Method for get response of market status API
     */
    responseData = {
        success: (response) => {
            // alert(moment(new Date().now).format('h:mm A') + " " + response.sData.open)
            console.log("response Market Status " + JSON.stringify(response));

            try {
                if (response.sStatus == 1) {
                    globals.marketStatusClose = response.sData.open;
                    this.setTheme(response.sData.open);
                }
            } catch (error) {
                console.log("Error-->" + error);
            }
        },
        error: (err) => {
            this.props.getshowLoader(false);
            console.log("File Error " + JSON.stringify(err));
            var bools = globals.checkThemeInOfflineMode();
            this.setTheme(bools);
        },
        complete: () => {
            
        }
    }

    /**
     * Method for get watchlist
     */
    callWSToGetWatchlist() {
        // if (globals.globalVars.userId_Global != null) {
            if (globals.isLoggedIn == 'true') {

            console.log('callWSToGetWatchlist ====================================');
            API.watchlistData(this.responseDataForWatchlist, false);
        }
    }

    /**
      * Method for get response of market status API
      */
    responseDataForWatchlist = {
        success: (response) => {
            try {
                AsyncStorage.setItem(globals.watchlist_timeStamp, new Date());
                AsyncStorage.setItem(globals.watchlist_datasource, JSON.stringify(response));
                var ary = [];
                var tempArray = [];
                if (response.sData.length != 0) {
                    let watchlist_data = response.sData.watchlist_data;
                    ary = watchlist_data;
                    if (ary.length > 0) {
                        ary.map((item) => {
                            tempArray.push(item.stock_id);
                        });
                    }
                }
                console.log('tempArray ========== ' + JSON.stringify(tempArray));
                AsyncStorage.setItem(globals.watchlist_added, JSON.stringify(tempArray));
                globals.watchlist_added_ary = tempArray;
            } catch (error) {
                this.props.getshowLoader(false);
            }
        },
        error: (err) => {
            console.log("responseDataForWatchlist Error-->" + err);
            this.props.getshowLoader(false);
        },
        complete: () => {
        }
    }

    GetFormattedDate(timestamp) {
        var d = new Date(timestamp*1000);
        let ad = moment(d).format("DD/MM/YYYY")
        console.log("ACTIV "+ad);
    }
    /**
      * Method for set Theme 
      */
    setTheme(status) {
        console.log("++++++++++++++++++++ " + status + this.GetFormattedDate(1553177406));

        // this.props.changeTheme(light_theme);
        // this.props.changeTabColor(colors.white);
        // this.props.checkMarketStatus(true);
        // globals.globalVars.statusBarColor = colors.blue;
        // globals.marketStatusClose = true
           
        // this.props.changeTheme(dark_theme);
        // this.props.changeTabColor(colors.tabbarDarkTheme);
        // this.props.checkMarketStatus(false);
        // globals.globalVars.statusBarColor = colors.blackThemeColor;
        // globals.marketStatusClose = false

        if (status) {
            console.log("MStatus 7");
            this.props.changeTheme(light_theme);
            this.props.changeTabColor(colors.white);
            this.props.checkMarketStatus(true);
            globals.globalVars.statusBarColor = colors.blue;
            globals.marketStatusClose = true
        } else {
            console.log("MStatus 8");
            this.props.changeTheme(dark_theme);
            this.props.changeTabColor(colors.tabbarDarkTheme);
            this.props.checkMarketStatus(false);
            globals.globalVars.statusBarColor = colors.blackThemeColor;
            globals.marketStatusClose = false
        }
        
        
        
        this.props.navigation.navigate("DashboardNavigator")
         SplashScreen.hide();



    }

    render() {
        return (
            <SafeAreaView style={[globalStyles.safeviewStyle]}>
                <Text></Text>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        register: state.showModal_red.register,
        Otp: state.showModal_red.Otp,
        loader: state.claneLoader_red.loader,
        color: state.changeTabColor_red.color,
        marketStatus: state.checkMarketStatus_red.marketStatus
    };
};

const mapDispatchToProps = dispatch => (bindActionCreators({
    getshowLoader,
    getshowModal,
    changeTheme,
    changeTabColor,
    checkMarketStatus
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(InitalStock);

