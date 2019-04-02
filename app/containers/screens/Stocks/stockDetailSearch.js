import React, { Component, Fragment } from 'react';
import {
    StatusBar,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Text,
    ScrollView,
    Platform,
    AsyncStorage,
    Alert,
    Animated,
    ActivityIndicator,
    SafeAreaView,
    Image,
    FlatList,
    Modal,
    RefreshControl
} from 'react-native';
import Button from '../../../components/Button';
import { HeaderBackButton, NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import globalStyles from '../../../assets/styles/globalStyles';
import branch, { BranchEvent } from 'react-native-branch';
import { changeTheme } from '../../../redux/actions/changeTheme';
import { changeTabColor } from '../../../redux/actions/changeTabColorModel';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import { getshowLoader } from "../../../redux/actions/showLoaderModal";
import { stock } from '../../../assets/images/map'
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import styles from './style';
import { API } from '../../../lib/api';
import { RemoteMessage } from 'react-native-firebase';
import OpenSettings from 'react-native-open-settings';
import moment from 'moment';
import {
    VictoryLine,
    VictoryChart,
    VictoryAxis,
} from "victory-native";
import { VictoryTheme } from "victory-core";
import WatchList from '../Stocks/watchlist';
import { getshowModal } from '../../../redux/actions/showModal';
import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import NewsAndroidWebview from './newsAndroidWebview';
import Share from 'react-native-share';
import SafariView from 'react-native-safari-view';
import Ionicons from 'react-native-vector-icons/Ionicons';

var _this = null;
var str_stockID = '';
var isAlreadyAddedInWatchlist = false;
var isMounted = true
var symbol = null;
var shareOptionObj = {
    title: "Clane",
    subject: "Clane"
}
const BOUNCE_MARGIN = globals.WINDOW.height
const mergeProp = (shouldEnrich = true, prop = {}, enrichment) => {
    return shouldEnrich ? Object.assign({}, prop, enrichment) : prop
}

const contentProps = (props, bottom, top) => ({
    // contentContainerStyle: mergeProp(!!top, props.contentContainerStyle),
    contentInset: { bottom: -BOUNCE_MARGIN },
    contentOffset: { y: BOUNCE_MARGIN },
})

this.marketStatus = null
class StockDetailSearch extends Component {

    static navigationOptions = ({ navigation, screenProps, }) => {
        const { state } = navigation;
        return {
            headerLeft: null,
            header: null,
            // header: <View
            //     style={[styles.headerStyle, { backgroundColor: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.bgColor : colors.blue, height: (globals.iPhoneX) ? 88 : 64, }]}>
            //     <TouchableOpacity onPress={() => navigation.goBack()}>
            //         <HeaderBackButton onPress={() => navigation.goBack(null)} title='' tintColor='white' />
            //     </TouchableOpacity>
            //     <View style={styles.headerTitleView}>
            //         <Text style={styles.headertitleText}>{navigation.state.params.headerTitle}</Text>
            //         {(navigation.state.params.changeValue != null && (navigation.state.params.changeValue != 0)) ?
            //             <FontAwesomeIcon size={15} name={(navigation.state.params.changeValue < 0) ? "caret-down" : "caret-up"} color={(navigation.state.params.changeValue < 0) ? colors.redColor : colors.greenColor} style={{ marginTop: 3, marginLeft: 3 }} />
            //             : null}
            //     </View>
            //     <View style={{ flex: 0.2 }} />
            // </View>,


        }
    }

    constructor(props) {
        super(props);
        this.state = {
            tabId: 1,
            tabTitleValue: '1D',
            data: null,
            temp_chart_data: [],
            chart_data: [],
            isChartUpdated: false,
            chart_line_color: null,
            loading: true,
            footerLoading: false,
            tredingStatus: null,
            isInternetAvailable: true,
            isTabDataAvailable: false,
            tabBarColor: colors.stockFooterTabBGLight,
            fadeAnim: new Animated.Value(0),
            fadeAnimChart: new Animated.Value(0),
            isWatch: false,
            page: 1,
            newsdata: [],
            totalItem: 0,
            isPaginationEnd: false,
            enableScrollViewScroll: true,
            isStockCached: false,
            isDragFirstTime: false,
            isAlreadyCached: false,
            themeStyle: props.theme,
            modalVisible: false,
            refreshing: false,
            isTimeout: false,
        };
        _this = this
    }

    getInitialize() {

        str_stockID = _this.props.navigation.state.params.stock_id;
        symbol = _this.props.navigation.state.params.symbol;
        console.log("SYMBOL DEATIL " + str_stockID);

        AsyncStorage.getItem(globals.key_stockInfoWithId + str_stockID, (err, result) => {
            console.log("USER CACHED " + JSON.stringify(result));
            if (result != null) {
                let sdata = JSON.parse(result);
                _this.setState({ data: sdata, isAlreadyCached: true });
                this.props.navigation.setParams({ headerTitle: (_this != null && _this.state.data != null) ? _this.state.data.symbol : "", changeValue: (_this.state.data != null) ? _this.state.data.change : "" })

                if (_this.state.data != null) {
                    if (_this.state.data.change > 0) {
                        _this.setState({ chart_line_color: colors.greenColor })
                    }
                    else if (_this.state.data.change < 0) {
                        _this.setState({ chart_line_color: colors.red })
                    }
                    else if (_this.state.data.change == 0) {
                        // _this.setState({ chart_line_color: colors.white })
                        if (this.props.marketStatus) {
                            _this.setState({ chart_line_color: colors.lightGrayTextColor })
                        }else {
                            _this.setState({ chart_line_color: colors.white })
                        }
                    }
                }
                else {
                    // _this.setState({ chart_line_color: colors.white })
                    if (this.props.marketStatus) {
                        _this.setState({ chart_line_color: colors.lightGrayTextColor })
                    }else {
                        _this.setState({ chart_line_color: colors.white })
                    }
                }
                console.log("Stock Detail Data-->" + JSON.stringify(sdata))

                // _this.checkTimeintervalForStockInfo();
                this.startAnimation();
            } else {
                console.log("element doesn't exist");


                _this.checkTimeintervalForStockInfo();
            }


        });

        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(globals.globalVars.statusBarColor, true);
        } else {
            let showSubscription = SafariView.addEventListener(
                "onShow",
                () => {
                    StatusBar.setBarStyle("dark-content");
                }
            );
            let dismissSubscription = SafariView.addEventListener(
                "onDismiss",
                () => {
                    StatusBar.setBarStyle("light-content");
                }
            );
        }
        this.checkForAddedWishlist();
        this.checkTimeintervalForStockMarketData();
        this.checkTimeintervalForStockCompanyData();
        this.getTimeIntervalForStockNews();
        this.checkTimeintervalForStockChart();
    }

    componentDidMount() {
        firebase.analytics().logEvent(globals.event_Stockdetail, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));

        if (Platform.OS == 'ios') {
            globals.setStatusBarForSafariView();
        }
        this.getInitialize()
        this.marketStatus = this.props.marketStatus
        this.props.navigation.setParams({ bgColor: (this.props.marketStatus) ? colors.blue : colors.blackThemeColor })
    }

    componentWillReceiveProps(newProps) {

        if (newProps.theme != undefined) {
            this.setState({
                themeStyle: newProps.theme
            })
        }
        if (newProps.marketStatus != undefined) {
            console.log("Stock Details this.marketStatus " + this.marketStatus);
            console.log("Stock Details newProps.marketStatus " + newProps.marketStatus);

            if (this.marketStatus !== newProps.marketStatus) {
                this.marketStatus = newProps.marketStatus
                console.log("Stock Details newProps.marketStatus " + newProps.marketStatus);
                this.props.navigation.setParams({ bgColor: (newProps.marketStatus) ? colors.blue : colors.blackThemeColor })
            }
        }
    }

    componentWillUnmount() {
        console.log("componentWillUnmount stockdetails" + globals.userAuthenticates)
        isMounted = false;
        // if (globals.userAuthenticates) {
        //     this.messageListener();
        // }
        // if ( !globals.globalVars.isPushTokenPermissionDone) {
        //     this.messageListener();
        // }
    }

    /**
     * Method for call chart data of stock
     * @param {*} title 
     */
    getChartData(title) {
        isMounted = true;
        console.log("CHART 0");

        this.setState({ loader: true })

        API.chartData(this.responseDataChart, _this.props.navigation.state.params.stock_id, title, true);
    }

    /**
     * Method for check added wishlist item
     */
    checkForAddedWishlist() {
        if (globals.watchlist_added_ary.length > 0) {
            var tempArray = [];
            tempArray = globals.watchlist_added_ary;
            console.log('str_stockID ========== ' + str_stockID);
            isAlreadyAddedInWatchlist = false;
            tempArray.map((item, index) => {
                if (item == str_stockID) {
                    isAlreadyAddedInWatchlist = true;
                    return;
                }
            });
            console.log('isAlreadyAddedInWatchlist ' + isAlreadyAddedInWatchlist);
            if (isAlreadyAddedInWatchlist) {
                _this.setHeaderWatch(true)
            } else {
                _this.setHeaderWatch(false)
            }
        } else {
            _this.setHeaderWatch(false)
        }
    }

    /**
     * Method for set header wathc icon
     */
    setHeaderWatch(isWatch) {
        this.setState({ isWatch: isWatch })
        if (isWatch) {
            isAlreadyAddedInWatchlist = true;
            this.props.navigation.setParams({ headerWatchText: '', headerWatchImage: 'bookmark' })
        } else {
            isAlreadyAddedInWatchlist = false;
            this.props.navigation.setParams({ headerWatchText: '', headerWatchImage: 'bookmark-border' })
        }
    }

    SearchFilterFunction(ary) {
        return ary.filter(item => item.stock_id);
    }

    /**
     * Method for stock news API calling
     */
    stockNews() {
        var query = "?symbol=" + symbol + "&count=20"
        API.marketNews(this.responseNewsData, query, this.state.page, false);
    }

    responseBitlyData = {
        success: (response) => {
            console.log("BITLY RESPONSE " + JSON.stringify(response));

        },
        error: (err) => {
            _this.setState({ footerLoading: false })

        },
        complete: () => {
        }
    }

    /**
     * Method for news API resposne
     */
    responseNewsData = {
        success: (response) => {
            console.log("NEWS RESPONSE " + JSON.stringify(response));
            this.setState({ totalItem: response.total })
            var oldData = this.state.newsdata
            var newData = response.articles
            var allData = [...oldData, ...newData]
            if (response.articles.length <= 0) {
                _this.setState({ isPaginationEnd: true, footerLoading: false })
            }
            else {
                allData = [...this.state.newsdata, ...response.articles],
                    this.setState({ newsdata: allData, })
            }
            try {
                AsyncStorage.setItem(globals.market_news_timeStamp + str_stockID, new Date());
                AsyncStorage.setItem(globals.market_async_news + str_stockID, JSON.stringify(allData));
            } catch (error) {
            }
        },
        error: (err) => {
            _this.setState({ footerLoading: false })

        },
        complete: () => {
        }
    }

    /**
    * Method for get time interval stock news
    */
    getTimeIntervalForStockNews() {
        AsyncStorage.getItem(globals.market_news_timeStamp + str_stockID, (err, result) => {
            if (result !== null) {
                console.log("newss result");

                var diffMins = globals.getTimeDifference(result);
                if (diffMins >= 15 && globals.isInternetConnected) {
                    _this.stockNews();
                    console.log("newss >15");

                } else {
                    AsyncStorage.getItem(globals.market_async_news + str_stockID, (err, result) => {
                        if (result !== null) {
                            console.log("newss market_async_news");
                            var responseData = JSON.parse(result);
                            console.log("responseData NewsLOCAL " + JSON.stringify(responseData));

                            var allData = responseData;
                            console.log("responseData allData " + allData);
                            this.setState({ newsdata: allData, })
                        } else {
                            this.setState({ loading: false })
                        }
                    });
                }
            } else {
                if (globals.isInternetConnected) {
                    this.setState({ isInternetAvailable: true, });
                    this.stockNews();
                } else {
                    this.setState({
                        dataSourceGainer: [],
                        footerString: globals.networkNotAvailable,
                        isInternetAvailable: false,
                        loading: false
                    });
                    console.log("isInternetAvailable " + this.state.isInternetAvailable);
                }
            }
        });
    }

    /**
      * Method for get response of stock info API
      */
    responseStockCompanyData = {
        success: (response) => {
            try {
                AsyncStorage.setItem(globals.market_stock_companydata_timeStamp + str_stockID, new Date());
                AsyncStorage.setItem(globals.key_stockCompanyData + str_stockID, JSON.stringify(response));

            } catch (error) {
            }
        },
        error: (err) => {
            // alert(err.sMessage);
        },
        complete: () => {
        }
    }

    /**
     * Method for check time interval stock company data
     */
    checkTimeintervalForStockCompanyData() {
        AsyncStorage.getItem(globals.market_stock_companydata_timeStamp + str_stockID, (err, result) => {
            if (result !== null) {
                console.log("company Data result");

                var diffMins = globals.getTimeDifference(result);
                if (diffMins >= 15 && globals.isInternetConnected) {
                    API.stockInfoWithCompanyInfo(_this.responseStockCompanyData, str_stockID, false);
                    console.log("company datas >15");
                }
            } else {
                if (globals.isInternetConnected) {
                    API.stockInfoWithCompanyInfo(_this.responseStockCompanyData, str_stockID, false);
                } else {

                    console.log("isInternetAvailable " + this.state.isInternetAvailable);
                }
            }
        });
    }

    /**
    * Method for check time interval stock market data
    */
    checkTimeintervalForStockMarketData() {
        AsyncStorage.getItem(globals.market_stock_marketdata_timeStamp + str_stockID, (err, result) => {
            if (result !== null) {
                console.log("market Data result");

                var diffMins = globals.getTimeDifference(result);
                if (diffMins >= 15 && globals.isInternetConnected) {
                    API.stockInfoWithMarketData(_this.responseMarketData, str_stockID, false);
                    console.log("market datas >15");
                }

            } else {
                if (globals.isInternetConnected) {
                    API.stockInfoWithMarketData(_this.responseMarketData, str_stockID, false);
                } else {

                    console.log("isInternetAvailable " + this.state.isInternetAvailable);
                }
            }
        });
    }

    /**
   * Method for get response of stock market data API
   */
    responseMarketData = {
        success: (response) => {
            console.log("RESPONSE Market DATA " + JSON.stringify(response));
            try {
                AsyncStorage.setItem(globals.market_stock_marketdata_timeStamp + str_stockID, new Date());
                AsyncStorage.setItem(globals.key_stockMarketData + str_stockID, JSON.stringify(response));
            } catch (error) {
            }
        },
        error: (err) => {
            if (err == globals.timeoutErrorCheck) {
                this.setState({
                    loading: false
                })
            }

        },
        complete: () => {
        }
    }


    /**
     * Method for check time intervl
     */
    checkTimeintervalForStockInfo() {
        this.setState({ isInternetAvailable: true, loading: true });

        AsyncStorage.getItem(globals.key_stockInfoWithId + str_stockID, (err, result) => {
            console.log("REsult data " + JSON.stringify(result));
            this.setState({ loading: false })
            if (result !== null) {
                var data = JSON.parse(result);

                var diffMins = globals.getTimeDifference(data.current_timestamp);
                console.log("Element in local" + diffMins);

                if (diffMins >= 15 && globals.isInternetConnected && !this.state.isTimeout) {
                    console.log("15 mins time done");
                    isMounted = true
                    API.stockInfo(_this.responseStockInfoData, str_stockID, false);
                }

                else {
                    console.log("Enter in ELse part");
                    this.setState({ isTimeout: false })
                    _this.setState({ data: JSON.parse(result) });
                    this.props.navigation.setParams({ headerTitle: (_this != null && _this.state.data != null) ? _this.state.data.symbol : "", changeValue: (_this.state.data != null) ? _this.state.data.change : "" })

                    if (_this.state.data != null) {
                        if (_this.state.data.change > 0) {
                            _this.setState({ chart_line_color: colors.greenColor })
                        }
                        else if (_this.state.data.change < 0) {
                            _this.setState({ chart_line_color: colors.red })
                        }
                        else if (_this.state.data.change == 0) {
                            // _this.setState({ chart_line_color: colors.white })
                            if (this.props.marketStatus) {
                                _this.setState({ chart_line_color: colors.lightGrayTextColor })
                            }else {
                                _this.setState({ chart_line_color: colors.white })
                            }
                        }
                    }
                    else {
                        // _this.setState({ chart_line_color: colors.white })
                        if (this.props.marketStatus) {
                            _this.setState({ chart_line_color: colors.lightGrayTextColor })
                        }else {
                            _this.setState({ chart_line_color: colors.white })
                        }
                    }

                    _this.stockNews();
                    this.startAnimation()
                }
            } else {
                if (globals.isInternetConnected && this.state.isTimeout == false) {
                    isMounted = true
                    console.log("-----------------------------------StockInfo Api Call-----------------------------------")
                    API.stockInfo(_this.responseStockInfoData, str_stockID, false);
                } else {
                    if (this.state.isAlreadyCached) {
                        this.setState({ isTimeout: false, fadeAnim: new Animated.Value(0) }, () => this.startAnimation())
                        this.forceUpdate();

                        console.log("DATA value " + this.state.data.change);

                    } else {
                        if (globals.isInternetConnected) {
                            this.setState({ isTimeout: true })
                        } else {
                            this.setState({ isInternetAvailable: false, isAlreadyCached: false })
                        }

                    }

                    console.log("str_stockID " + str_stockID);
                }
            }
        });
    }

    /**
     * Method for check time interval for stock chart
     */
    checkTimeintervalForStockChart() {
        // this.setState({ isInternetAvailable: true });
        AsyncStorage.getItem(globals.chart_timestamp + str_stockID + this.state.tabTitleValue, (err, result) => {
            console.log("call result " + JSON.stringify(result));
            if (result !== null) {
                var diffMins = globals.getTimeDifference(result);
                if (diffMins >= 15) {
                    console.log("15 min > ");
                    _this.setState({ isTabDataAvailable: true });
                    _this.getChartData(this.state.tabTitleValue);
                } else {
                    AsyncStorage.getItem(globals.key_stockInfoWithId + str_stockID + this.state.tabTitleValue, (err, result) => {
                        if (result != null) {
                            console.log("else stock detail cachee " + JSON.stringify(result));
                            _this.setState({ loading: false, loader: false });
                            var data = [];
                            var cacheData = JSON.parse(result);
                            if (cacheData.length > 1) {
                                for (let index = 0; index < cacheData.length; index++) {
                                    var timestamp = moment.unix(cacheData[index].timestamp);
                                    data.push({ x: timestamp, y: cacheData[index].price });
                                }
                                data.sort(this.compare);
                                _this.setState({ isChartUpdated: true, chart_data: data, loading: false, isStockCached: true });
                                console.log("CHAR DATA BLANK 1");

                                this.startChartAnimation()
                            } else {
                                this.startChartAnimation();
                                _this.setState({ isChartUpdated: true, chart_data: data, loading: false });
                                console.log("CHAR DATA BLANK 2");
                            }
                        } else {
                            console.log("ELSE LOG");
                            console.log("CHAR DATA BLANK 3");
                            _this.setState({ isTabDataAvailable: true, loader: false });
                            _this.getChartData(this.state.tabTitleValue);
                        }
                    });
                }
            } else {
                if (globals.isInternetConnected) {
                    console.log("else stock chart API call");
                    _this.getChartData(this.state.tabTitleValue);
                } else {
                    console.log("else stock chart data null");
                    _this.setState({ chart_data: [] });
                }
            }
        });
    }

    /**
    * Method for get response of stock chart data API
    */
    responseDataChart = {
        success: (response) => {
            if (isMounted) {

                var data = [];
                var localStorageData = [];
                localStorageData = response.sData.chart_data;
                if (response.sData.chart_data.length != null && response.sData.chart_data.length > 1) {
                    for (let index = 0; index < response.sData.chart_data.length; index++) {
                        var timestamp = moment.unix(response.sData.chart_data[index].timestamp);
                        data.push({ x: timestamp, y: response.sData.chart_data[index].price });
                    }

                }
                data.sort(this.compare);
                AsyncStorage.setItem(globals.chart_timestamp + str_stockID + this.state.tabTitleValue, new Date());
                AsyncStorage.setItem(globals.key_stockInfoWithId + str_stockID + this.state.tabTitleValue, JSON.stringify(localStorageData));
                _this.setState({ loading: false, loader: false, chart_data: data, isTabDataAvailable: false, isChartUpdated: true })
                this.startChartAnimation();
                console.log("isChartUpdated -->" + this.state.isChartUpdated);

            }
        },
        error: (err) => {
            if (isMounted) {
                this.setState({ loading: false, loader: false, chart_data: [], isTabDataAvailable: false, isChartUpdated: true })
                this.startChartAnimation();
                if (err != globals.timeoutErrorCheck) {
                    Alert.alert(globals.APP_NAME, err.message);
                }
            }
        },
        complete: () => {
            if (isMounted) {
                this.setState({ loading: false })
            }
        }
    }

    /**
     * Method for sort x axis data
     * @param {*} a 
     * @param {*} b 
     */
    compare(a, b) {
        if (a.x < b.x)
            return -1;
        if (a.x > b.x)
            return 1;
        return 0;
    }

    /**
      * Method for get response of stock info API
      */
    responseStockInfoData = {
        success: (response) => {
            this.setState({ refreshing: false })
            try {
                if (isMounted) {
                    console.log("STOCK DETAIL RESPONSE " + response.sData[str_stockID]);

                    _this.setState({ data: response.sData[str_stockID] });
                    this.props.navigation.setParams({ headerTitle: (_this != null && _this.state.data != null) ? _this.state.data.symbol : "", changeValue: (_this.state.data != null) ? _this.state.data.change : "" })
                    _this.stockNews();
                    if (_this.state.data != null) {
                        if (_this.state.data.change > 0) {
                            _this.setState({ chart_line_color: colors.greenColor })
                        }
                        else if (_this.state.data.change < 0) {
                            _this.setState({ chart_line_color: colors.red })
                        }
                        else if (_this.state.data.change == 0) {
                            // _this.setState({ chart_line_color: colors.white })
                            if (this.props.marketStatus) {
                                _this.setState({ chart_line_color: colors.lightGrayTextColor })
                            }else {
                                _this.setState({ chart_line_color: colors.white })
                            }
                        }
                    }
                    else {
                        // _this.setState({ chart_line_color: colors.white })
                        if (this.props.marketStatus) {
                            _this.setState({ chart_line_color: colors.lightGrayTextColor })
                        }else {
                            _this.setState({ chart_line_color: colors.white })
                        }
                    }
                    response[globals.current_timestamp] = new Date();
                    AsyncStorage.setItem(globals.key_stockInfoWithId + str_stockID, JSON.stringify(response.sData[str_stockID]));

                    this.startAnimation();
                }

            } catch (error) {
                this.setState({ refreshing: false })
            }
        },
        error: (err) => {
            if (err == globals.timeoutErrorCheck) {
                this.setState({ isTimeout: true, loading: true }, () => {
                    this.checkTimeintervalForStockInfo()
                    this.checkTimeintervalForStockChart();
                })

            } else {
            }
            this.setState({ refreshing: false })
        },
        complete: () => {
            this.setState({ refreshing: false })
        }
    }

    openPushSettings() {
        OpenSettings.openSettings();
    }

    /**
     * Method for bookmark click and add stock to watchlist
     */
    btnWatchPressed() {
        if (globals.isInternetConnected) {

            if (globals.globalVars.isPushTokenPermissionDone) {
                if (globals.isLoggedIn == 'true') {

                    var data = {
                        stock_id: str_stockID
                    };
                    console.log('====================================')
                    console.log('beforeeeeeeeeee')
                    console.log('====================================')
                    if (isAlreadyAddedInWatchlist) {
                        if (!globals.isWatchlistLoadedFirstTime) {
                            WatchList.changeLoaderState()
                            WatchList.reloadData()
                        }
                        _this.setHeaderWatch(false)
                        API.watchlistDeleteItem(_this.responseDataDeleteWatch, data, false);
                    } else {
                        if (!globals.isWatchlistLoadedFirstTime) {
                            WatchList.changeLoaderState()
                            WatchList.reloadData()
                        }
                        _this.setHeaderWatch(true)
                        API.watchlistAddItem(_this.responseDataAddWatch, data, false);
                    }
                    console.log('====================================')
                    console.log('afterrrrrrrrrrrrrrr')
                    console.log('====================================')
                    globals.userAuthenticates = false
                } else {
                    globals.globalVars.dashboardTitle = globals.screenTitle_stockdetail
                    this.checkLogin();
                }
            } else {
                Alert.alert(
                    globals.APP_NAME,
                    'Please go to your device settings and allow push notifications in order to register.',
                    [
                        { text: 'OK', onPress: () => this.openPushSettings() },
                    ],
                    { cancelable: true }
                )

            }


            // firebase.messaging().hasPermission()
            //     .then(enabled => {
            //         if (enabled) {
            //             globals.getFCMTokens()
            //             globals.globalVars.isPushTokenPermissionDone = true;
            //             this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
            //                 console.log("DATAAAA", message);
            //                 console.log("DATA SECret " + message._data.secret);
            //                 globals.Pushsecret = message._data.secret;

            //             });
            //             if (globals.isLoggedIn == 'true') {

            //                 var data = {
            //                     stock_id: str_stockID
            //                 };
            //                 console.log('====================================')
            //                 console.log('beforeeeeeeeeee')
            //                 console.log('====================================')
            //                 if (isAlreadyAddedInWatchlist) {
            //                     if (!globals.isWatchlistLoadedFirstTime) {
            //                         WatchList.changeLoaderState()
            //                         WatchList.reloadData()
            //                     }
            //                     _this.setHeaderWatch(false)
            //                     API.watchlistDeleteItem(_this.responseDataDeleteWatch, data, false);
            //                 } else {
            //                     if (!globals.isWatchlistLoadedFirstTime) {
            //                         WatchList.changeLoaderState()
            //                         WatchList.reloadData()
            //                     }
            //                     _this.setHeaderWatch(true)
            //                     API.watchlistAddItem(_this.responseDataAddWatch, data, false);
            //                 }
            //                 console.log('====================================')
            //                 console.log('afterrrrrrrrrrrrrrr')
            //                 console.log('====================================')
            //                 globals.userAuthenticates = false
            //             } else {
            //                 globals.globalVars.dashboardTitle = globals.screenTitle_stockdetail
            //                 this.checkLogin();
            //             }

            //         } else {
            //             Alert.alert(
            //                 globals.APP_NAME,
            //                 'Please go to your device settings and allow push notifications in order to register.',
            //                 [

            //                     { text: 'OK', onPress: () => this.openPushSettings() },
            //                 ],
            //                 { cancelable: true }
            //             )
            //         }
            //     });


        } else {
            Alert.alert(globals.APP_NAME, globals.networkNotAvailable)
        }
    }

    btnTryAgainPressed() {
        _this.checkTimeintervalForStockInfo()
        _this.callWSToGetWatchlist()
    }

    /**
   * Method for check user already login or not
   */
    checkLogin() {
        _this.props.navigation.navigate("ModalNavigator")
    }

    /**
    * Method for get response of market status API
    */
    responseDataAddWatch = {
        success: (response) => {
            _this.props.getshowLoader(false);
            try {
                _this.setHeaderWatch(true)
                WatchList.reloadData();
                firebase.analytics().logEvent(globals.event_Addstocktowatchlist,
                    Object.assign({}, { EventDetails: _this.state.data.symbol }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
            } catch (error) {
                _this.props.getshowLoader(false);
            }
        },
        error: (err) => {
            _this.props.getshowLoader(false);
            _this.setHeaderWatch(false)
        },
        complete: () => {
            _this.props.getshowLoader(false);
        }
    }

    /**
    * Method for get response of market status API
    */
    responseDataDeleteWatch = {
        success: (response) => {
            _this.props.getshowLoader(false);
            try {
                _this.setHeaderWatch(false)
                WatchList.reloadData();
                firebase.analytics().logEvent(globals.event_Removestockfromwatchlist,
                    Object.assign({}, { EventDetails: _this.state.data.symbol }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
            } catch (error) {
                _this.props.getshowLoader(false);
            }
        },
        error: (err) => {
            _this.props.getshowLoader(false);
            _this.setHeaderWatch(true)
        },
        complete: () => {
            _this.props.getshowLoader(false);
        }
    }

    /**
     * Method for get watchlist
     */
    callWSToGetWatchlist() {
        if (globals.isInternetConnected) {
            if (globals.isLoggedIn == 'true') {
                API.watchlistData(this.responseDataForWatchlist, false);
            }
        } else {
            this.setState({
                isInternetAvailable: false, loading: false
            })
        }
    }

    /**
      * Method for get response of market status API
      */
    responseDataForWatchlist = {
        success: (response) => {
            try {
                console.log('responseDataForWatchlist ========== ' + JSON.stringify(response));

                AsyncStorage.setItem(globals.watchlist_timeStamp, new Date());
                AsyncStorage.setItem(globals.watchlist_datasource, JSON.stringify(response));
                var ary = []
                var tempArray = []
                if (response.sData.length != 0) {
                    let watchlist_data = response.sData.watchlist_data;
                    ary = watchlist_data
                    if (ary.length > 0) {
                        ary.map((item, index) => {
                            tempArray.push(item.stock_id)
                        });
                    }
                }

                AsyncStorage.setItem(globals.watchlist_added, JSON.stringify(tempArray));
                globals.watchlist_added_ary = tempArray
                tempArray.map((item, index) => {
                    if (item == str_stockID) {
                        isAlreadyAddedInWatchlist = true;
                    }
                });

                if (isAlreadyAddedInWatchlist) {
                    _this.setHeaderWatch(true)
                } else {
                    this.btnWatchPressed()
                }
                WatchList.reloadData();
            } catch (error) {
                this.props.getshowLoader(false);
            }
        },
        error: (err) => {
            this.props.getshowLoader(false);
        },
        complete: () => {
            this.props.getshowLoader(false);
        }
    }

    /**
     * Method for call web API for add watchlist after login
     */
    static callWSToAddWatchlistAfterLogin() {
        _this.callWSToGetWatchlist()
        globals.userAuthenticates = false;
    }

    /**
     * Method for change bookmark icon at header
     */
    static changeHaderAfterWishlistLoaded() {
        _this.checkForAddedWishlist()
    }

    /**
     * Method for start animation top view
     */
    startAnimation() {
        Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }

    /**
     * Method for start chart animation
     */
    startChartAnimation() {
        Animated.timing(this.state.fadeAnimChart, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }

    /**
     * Method for set Tabstyle 
     * @param {*} tabId 
     * @param {*} title 
     */
    setTabOption(tabId, title) {

        return (<Text style={{ color: (_this.state.tabId == tabId ? (this.props.marketStatus) ? colors.blue : colors.white : this.state.themeStyle.tabOptionColor.color), fontFamily: (_this.state.tabId == tabId) ? globals.fontSFProTextSemibold : globals.fontSFProTextRegular, fontSize: globals.font_10 }}>{title}</Text>)
    }

    /**
     * Method for tap click tab option for fetch chart data
     * @param {*} tabID 
     * @param {*} tabTitleValue 
     */
    clickTabOption(tabID, tabTitleValue) {
        console.log("tabTitleValue " + tabTitleValue);
        console.log("CHECK VALUE ---->--------> " + JSON.stringify(this.state.chart_data));
        if (this.state.isTabDataAvailable == false) {
            _this.setState({ tabId: tabID, tabTitleValue: tabTitleValue, fadeAnimChart: new Animated.Value(0), isChartUpdated: false, }, () => {
                _this.checkTimeintervalForStockChart();
            })
        }
    }

    /**
     * Method for check value for victory axis tick count
     * @param {*} data 
     */
    checkValues(data) {
        let check = data[0].y;
        for (var i = 1; i < data.length - 1; i++) {
            if (data[i].y != check) {
                return 3;
            }
        }
        return 1;
    }


    onStartShouldSetResponderCapture = () => {
        this.setState({ enableScrollViewScroll: false });
        if (this.refs.myFlatList.scrollProperties.offset === 0 && this.state.enableScrollViewScroll === false) {
            this.setState({ enableScrollViewScroll: true });
        }
    }

    renderFooter = () => {
        return (
            <View style={this.state.themeStyle.mainRenderView}>
                {(this.state.newsdata.length > 0) ?
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("StockNewsLoadMore", { stock_id: str_stockID, symbol: symbol, headerTitle: this.props.navigation.state.params.headerTitle, changeValue: this.props.navigation.state.params.changeValue })}>
                        <View style={{ paddingVertical: 5, marginLeft: 10, marginTop: 10, marginBottom: 10 }}>
                            <Text style={[this.state.themeStyle.loadMoreTextColor, styles.showMoreText]}>{"SHOW MORE"}</Text>
                        </View>
                    </TouchableOpacity> :
                    <View />}
            </View>
        )
    };

    renderChartLoader() {
        // alert('dsfdsd')

        if (this.state.loader && globals.isInternetConnected) {
            return (<ActivityIndicator size="large" color={(this.props.marketStatus == globals.marketStatusClose ? colors.white : colors.white)} />
            )
        }
    }

    renderNoChartData() {
        return (
            <View style={{ height: 130, justifyContent: 'center' }}>
                <Text style={[styles.stockDetailTextNoChartData, this.state.themeStyle.stockDetailTextNoChartData]}>{globals.stockDetailNoChartDataFound}</Text>
            </View>)
    }

    renderHeader = () => {

        let { fadeAnim } = this.state;
        let { fadeAnimChart } = this.state;
        let lastUpdate = <Text />;
        if (_this.state.data != null && _this.state.data.date != null) {
            lastUpdate = <Text style={[styles.priceTopTitle, this.state.themeStyle.stockDetailHeaderSubTitleColor]}>{moment.unix(_this.state.data.date).format('D MMM, h:mm A')}</Text>
        }
        console.log("HEADER DATA: " + JSON.stringify(_this.state.data));

        var line = <View style={[styles.topViewSeparators, this.state.themeStyle.topViewSeparator]}></View>;
        return (
            <View >

                <View style={[styles.mainRenderView, this.state.themeStyle.mainRenderView]}>
                    <View style={[styles.topBackgroundViewNew, this.state.themeStyle.topBackgroundViewNew,]}>
                        <Animated.View style={[styles.topBackgroundViewNew, this.state.themeStyle.topBackgroundViewNew, { opacity: fadeAnim, }]}>
                            <View style={[styles.topViewPriceBackground, {padding:10}]}>
                                <View style={styles.stockDetailTopRowViews}>
                                    <View style={[styles.topViewtextStyles, { flex: 1 }]}>
                                        <Text numberOfLines={1} style={[styles.stockDetailHeaderSubTitle, this.state.themeStyle.stockDetailHeaderSubTitleColor]}>{(_this.state.data != null) ? _this.state.data.company_name : ''}</Text>
                                    </View>
                                </View>{line}
                                <View style={styles.stockDetailTopRowViews}>
                                    <View style={styles.topViewSecondRowLeft}>
                                        <View style={styles.topViewtextStyles}>
                                            <View style={styles.topViewSecondRowCyrrency}>
                                                <Text style={[styles.priceWhiteCurrency, {
                                                    color:
                                                        (_this.state.data != null && _this.state.data.change && _this.state.data.change < 0) ? colors.redColor : colors.greenColor
                                                }]}>₦</Text>
                                            </View>
                                            <Text style={[styles.priceWhite, { color: (_this.state.data != null && _this.state.data.change && _this.state.data.change < 0) ? colors.redColor : colors.greenColor }]}>{(_this.state.data != null) ? (_this.state.data.last ? _this.state.data.last.toFixed(2)
                                                :
                                                null)
                                                :
                                                '...'}</Text>
                                        </View>
                                        {
                                            (_this.state.data != null && (_this.state.data.change != 0)) ?
                                                <FontAwesomeIcon size={15}
                                                    name={(_this.state.data.change < 0) ? "caret-down" : "caret-up"} color={(_this.state.data.change < 0) ? colors.redColor : colors.greenColor} />
                                                :
                                                null
                                        }
                                        <View style={styles.topViewtextStyles}>
                                            {
                                                (_this.state.data != null) ?
                                                    <Text style={[styles.priceBottomTextGreen, {
                                                        color: (_this.state.data.change < 0) ? colors.redColor :
                                                            (_this.state.data.change == 0) ? colors.white : colors.greenColor
                                                    }]}> {(_this.state.data.change > 0) ? "+" : ""}{_this.state.data.change ? _this.state.data.change.toFixed(2) + ' ' : null}
                                                        {_this.state.data.per_change ? '(' + _this.state.data.per_change.toFixed(2) + '%)' : null}</Text>
                                                    :
                                                    null
                                            }
                                        </View>
                                    </View>
                                    <View style={styles.topViewSecondRowRight}>
                                        <View style={styles.topViewtextStyles}>
                                            {
                                                lastUpdate
                                            }
                                        </View>
                                    </View>
                                </View>
                                {line}
                                <View style={styles.stockDetailTopRowViews}>
                                    <View style={styles.topViewtextStyles}>
                                        {
                                            (_this.state.data != null) ?
                                                <Text style={[styles.priceTopTitle, this.state.themeStyle.stockDetailHeaderSubTitleColor]}>{'Opening price: ₦'}{_this.state.data.opening_price ? _this.state.data.opening_price.toFixed(2) : null} {(_this.state.data.change > 0) ? " +" : " "}{_this.state.data.opening_absolute_change ? _this.state.data.opening_absolute_change.toFixed(2) : null} {'('}{_this.state.data.opening_percentage_change ? _this.state.data.opening_percentage_change.toFixed(2) : null}{'%)'}</Text>
                                                :
                                                <Text style={[styles.priceTopTitle, this.state.themeStyle.stockDetailHeaderSubTitleColor]}> </Text>
                                        }
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                        {/* Graph main view */}
                        <View style={{ height: 150, alignItems: 'center', justifyContent: 'center' }}>
                            {(this.state.loader) ?
                                <View style={[{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', overflow: 'hidden', backgroundColor: 'transparent', alignContent: 'center', position: 'absolute' }, this.state.themeStyle.stockDetailLoaderBG]}>
                                    {this.renderChartLoader()}

                                </View> :
                                <Animated.View style={{ flex: 1, marginHorizontal: 0, opacity: fadeAnimChart }}>
                                    {
                                        (this.state.chart_data != null && this.state.isChartUpdated && this.state.chart_data.length > 1 && this.state.data != null) ? <VictoryChart height={150}
                                            margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
                                            padding={{ left: 25, right: 25, top: 10, bottom: 50 }}
                                            domainPadding={{ x: 0, y: 10 }}
                                        >

                                            {this.state.isChartUpdated && this.state.chart_data.length > 0 ?
                                                <VictoryLine
                                                    interpolation={'catmullRom'}
                                                    data={this.state.chart_data}
                                                    style={{
                                                        data: {
                                                            stroke: (_this.state.chart_line_color != null) ? _this.state.chart_line_color : (this.props.marketStatus) ? colors.lightGrayTextColor : colors.white, strokeWidth: 3
                                                        }
                                                    }}
                                                /> : null}
                                            {this.state.isChartUpdated && this.state.chart_data.length > 0 ?
                                                <VictoryAxis dependentAxis
                                                    tickCount={this.checkValues(this.state.chart_data)}
                                                    fixLabelOverlap={true}
                                                    tickFormat={(t) => parseFloat(t).toFixed(2)}
                                                    orientation="right"
                                                    height={30}
                                                    style={{
                                                        axis: { stroke: '' },
                                                        grid: {
                                                            stroke: 'rgb(151, 151, 151)',
                                                            opacity: .2,
                                                            strokeWidth: 1
                                                        },
                                                        tickLabels: { fontSize: 12, padding: 0, fill: 'rgb(185, 181,195)', fontFamily: 'inherit', opacity: 0.7, textAnchor: 'end' },
                                                    }} />
                                                : null}
                                            {this.state.isChartUpdated && this.state.chart_data.length > 0 ?
                                                <VictoryAxis crossAxis
                                                    fixLabelOverlap={true}
                                                    theme={VictoryTheme.material}
                                                    scale={{ x: "time" }}
                                                    standalone={false}
                                                    style={{
                                                        axis: { stroke: 'rgb(151, 151, 151)', opacity: .5 },
                                                        ticks: { stroke: 'rgb(151, 151, 151)', opacity: .5, size: 5, padding: 0 },
                                                        tickLabels: { fontSize: 12, padding: 5, fill: 'rgb(151, 151, 151)', fontFamily: 'inherit', opacity: .5, },
                                                    }} />
                                                : null}
                                        </VictoryChart> : (_this.state.chart_data.length == 0 && this.state.isChartUpdated) ? <View style={{ height: 130, justifyContent: 'center' }}>
                                            <Text style={[styles.stockDetailTextNoChartData, this.state.themeStyle.stockDetailTextNoChartData]}>{globals.stockDetailNoChartDataFound}</Text>
                                        </View> : null
                                    }
                                </Animated.View>
                            }
                        </View>
                    </View>
                    <View style={[styles.topViewSeparatorsNew, this.state.themeStyle.topViewSeparator]}></View>
                    <View style={[styles.daysFilterView, this.state.themeStyle.daysFilterView]}>
                        <TouchableOpacity style={[styles.tabOptionMainView, { backgroundColor: _this.state.tabId == 1 ? this.state.themeStyle.tabOptionBGColor.backgroundColor : 'transparent' }]} onPress={() => _this.clickTabOption(1, '1D')}>
                            {_this.setTabOption(1, 'Today')}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tabOptionMainView, { backgroundColor: _this.state.tabId == 2 ? this.state.themeStyle.tabOptionBGColor.backgroundColor : 'transparent' }]} onPress={() => _this.clickTabOption(2, '5D')}>
                            {_this.setTabOption(2, '5D')}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tabOptionMainView, { backgroundColor: _this.state.tabId == 3 ? this.state.themeStyle.tabOptionBGColor.backgroundColor : 'transparent' }]} onPress={() => _this.clickTabOption(3, '3M')}>
                            {_this.setTabOption(3, '3M')}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tabOptionMainView, { backgroundColor: _this.state.tabId == 4 ? this.state.themeStyle.tabOptionBGColor.backgroundColor : 'transparent' }]} onPress={() => _this.clickTabOption(4, '6M')}>
                            {_this.setTabOption(4, '6M')}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tabOptionMainView, { backgroundColor: _this.state.tabId == 5 ? this.state.themeStyle.tabOptionBGColor.backgroundColor : 'transparent' }]} onPress={() => _this.clickTabOption(5, '1Y')}>
                            {_this.setTabOption(5, '1Y')}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tabOptionMainView, { backgroundColor: _this.state.tabId == 6 ? this.state.themeStyle.tabOptionBGColor.backgroundColor : 'transparent' }]} onPress={() => _this.clickTabOption(6, '3Y')}>
                            {_this.setTabOption(6, '3Y')}
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.topViewSeparatorsNew, this.state.themeStyle.topViewSeparator]}></View>
                    {(_this.state.data != null) ?
                        <TouchableOpacity onPress={() => _this.props.navigation.navigate('CompanyTabs', { str_stockID: str_stockID, theme: this.state.themeStyle, title: _this.state.data.symbol })}>
                            <View style={[styles.btnCompanyInfo, this.state.themeStyle.companyInfoBackground]}>
                                <Text style={[styles.buttonTextStockDetailCompanyInfo, this.state.themeStyle.companyInfoButton]}>{globals.stockDetailviewCompanyInfo}</Text>
                                <FontAwesomeIcon style={{ marginLeft: 10 }} name='caret-right' color={(this.props.marketStatus) ? colors.companyInfoText : colors.white} />
                            </View>
                        </TouchableOpacity> : null}
                    <View style={[styles.topViewSeparatorsNew, this.state.themeStyle.topViewSeparator]}></View>
                    {(_this.state.newsdata.length > 0) ? <View style={{ padding: 10,   }}>
                        <Text style={[styles.stockDetailRelatedNews, this.state.themeStyle.stockRelatedNewsColor, {paddingLeft: 10}]}>{globals.stockDetailRelatedNews}</Text>
                        <View style={[styles.horizontalSepratorStockDetailReleatedNews, this.state.themeStyle.relatedNewsSeparator,{marginLeft:10, marginRight: 10}]} />
                    </View> : null}
                    {/* {(_this.state.newsdata.length > 0) ? <View style={{ padding: 10, }}>
                        <Text style={[styles.stockDetailRelatedNews, this.state.themeStyle.stockRelatedNewsColor]}>{globals.stockDetailRelatedNews}</Text>
                        <View style={[styles.horizontalSepratorStockDetailReleatedNews, this.state.themeStyle.relatedNewsSeparator]} />
                    </View> : null} */}
                </View>
            </View>
        )
    }

    // renderHeader = () => {

    //     let { fadeAnim } = this.state;
    //     let { fadeAnimChart } = this.state;
    //     let lastUpdate = <Text />;
    //     if (_this.state.data != null && _this.state.data.date != null) {
    //         lastUpdate = <Text style={[styles.priceTopTitle, this.state.themeStyle.stockDetailHeaderSubTitleColor]}>{moment.unix(_this.state.data.date).format('D MMM, h:mm A')}</Text>
    //     }
    //     console.log("HEADER DATA: " + JSON.stringify(_this.state.data));

    //     var line = <View style={[styles.topViewSeparators, this.state.themeStyle.topViewSeparator]}></View>;
    //     return (
    //         <View >
    //             <View style={[styles.mainRenderView, this.state.themeStyle.mainRenderView]}>
    //                 <View style={[styles.topBackgroundViewNew, this.state.themeStyle.topBackgroundViewNew,]}>
    //                     <Animated.View style={[styles.topBackgroundViewNew, this.state.themeStyle.topBackgroundViewNew, { opacity: fadeAnim, }]}>
    //                         <View style={styles.topViewPriceBackground}>
    //                             <View style={styles.stockDetailTopRowViews}>
    //                                 <View style={[styles.topViewtextStyles, { flex: 1 }]}>
    //                                     <Text numberOfLines={1} style={[styles.stockDetailHeaderSubTitle, this.state.themeStyle.stockDetailHeaderSubTitleColor]}>{(_this.state.data != null) ? _this.state.data.company_name : ''}</Text>
    //                                 </View>
    //                             </View>{line}
    //                             <View style={styles.stockDetailTopRowViews}>
    //                                 <View style={styles.topViewSecondRowLeft}>
    //                                     <View style={styles.topViewtextStyles}>
    //                                         <View style={styles.topViewSecondRowCyrrency}>
    //                                             <Text style={styles.priceWhiteCurrency}>₦</Text>
    //                                         </View>
    //                                         <Text style={styles.priceWhite}>{(_this.state.data != null) ? (_this.state.data.last ? _this.state.data.last.toFixed(2)
    //                                             :
    //                                             null)
    //                                             :
    //                                             '...'}</Text>
    //                                     </View>
    //                                     {
    //                                         (_this.state.data != null && (_this.state.data.change != 0)) ?
    //                                             <FontAwesomeIcon size={15}
    //                                                 name={(_this.state.data.change < 0) ? "caret-down" : "caret-up"} color={(_this.state.data.change < 0) ? colors.redColor : colors.greenColor} />
    //                                             :
    //                                             null
    //                                     }
    //                                     <View style={styles.topViewtextStyles}>
    //                                         {
    //                                             (_this.state.data != null) ?
    //                                                 <Text style={[styles.priceBottomTextGreen, {
    //                                                     color: (_this.state.data.change < 0) ? colors.redColor :
    //                                                         (_this.state.data.change == 0) ? colors.white : colors.greenColor
    //                                                 }]}> {(_this.state.data.change > 0) ? "+" : ""}{_this.state.data.change ? _this.state.data.change.toFixed(2) + ' ' : null}
    //                                                     {_this.state.data.per_change ? '(' + _this.state.data.per_change.toFixed(2) + '%)' : null}</Text>
    //                                                 :
    //                                                 null
    //                                         }
    //                                     </View>
    //                                 </View>
    //                                 <View style={styles.topViewSecondRowRight}>
    //                                     <View style={styles.topViewtextStyles}>
    //                                         {
    //                                             lastUpdate
    //                                         }
    //                                     </View>
    //                                 </View>
    //                             </View>
    //                             {line}
    //                             <View style={styles.stockDetailTopRowViews}>
    //                                 <View style={styles.topViewtextStyles}>
    //                                     {
    //                                         (_this.state.data != null) ?
    //                                             <Text style={[styles.priceTopTitle, this.state.themeStyle.stockDetailHeaderSubTitleColor]}>{'Opening price: ₦'}{_this.state.data.opening_price ? _this.state.data.opening_price.toFixed(2) : null} {(_this.state.data.change > 0) ? " +" : " "}{_this.state.data.opening_absolute_change ? _this.state.data.opening_absolute_change.toFixed(2) : null} {'('}{_this.state.data.opening_percentage_change ? _this.state.data.opening_percentage_change.toFixed(2) : null}{'%)'}</Text>
    //                                             :
    //                                             <Text style={[styles.priceTopTitle, this.state.themeStyle.stockDetailHeaderSubTitleColor]}> </Text>
    //                                     }
    //                                 </View>
    //                             </View>
    //                         </View>
    //                     </Animated.View>
    //                     {/* Graph main view */}
    //                     <View style={{ height: 150, alignItems: 'center', justifyContent: 'center' }}>
    //                         {(this.state.loader) ?
    //                             <View style={[{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', overflow: 'hidden', backgroundColor: 'transparent', alignContent: 'center', position: 'absolute' }, this.state.themeStyle.stockDetailLoaderBG]}>
    //                                 {this.renderChartLoader()}

    //                             </View> :
    //                             <Animated.View style={{ flex: 1, marginHorizontal: 0, opacity: fadeAnimChart }}>
    //                                 {
    //                                     (this.state.chart_data != null && this.state.isChartUpdated && this.state.chart_data.length > 1 && this.state.data != null) ? <VictoryChart height={150}
    //                                         margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
    //                                         padding={{ left: 25, right: 25, top: 10, bottom: 50 }}
    //                                         domainPadding={{ x: 0, y: 10 }}
    //                                     >

    //                                         {this.state.isChartUpdated && this.state.chart_data.length > 0 ?
    //                                             <VictoryLine
    //                                                 interpolation={'catmullRom'}
    //                                                 data={this.state.chart_data}
    //                                                 style={{
    //                                                     data: {
    //                                                         stroke: (_this.state.chart_line_color != null) ? _this.state.chart_line_color : colors.white, strokeWidth: 3
    //                                                     }
    //                                                 }}
    //                                             /> : null}
    //                                         {this.state.isChartUpdated && this.state.chart_data.length > 0 ?
    //                                             <VictoryAxis dependentAxis
    //                                                 tickCount={this.checkValues(this.state.chart_data)}
    //                                                 fixLabelOverlap={true}
    //                                                 tickFormat={(t) => parseFloat(t).toFixed(2)}
    //                                                 orientation="right"
    //                                                 height={30}
    //                                                 style={{
    //                                                     axis: { stroke: '' },
    //                                                     grid: {
    //                                                         stroke: 'white',
    //                                                         opacity: .2,
    //                                                         strokeWidth: 1
    //                                                     },
    //                                                     tickLabels: { fontSize: 12, padding: 0, fill: '#FFF', fontFamily: 'inherit', opacity: 0.7, textAnchor: 'end' },
    //                                                 }} />
    //                                             : null}
    //                                         {this.state.isChartUpdated && this.state.chart_data.length > 0 ?
    //                                             <VictoryAxis crossAxis
    //                                                 fixLabelOverlap={true}
    //                                                 theme={VictoryTheme.material}
    //                                                 scale={{ x: "time" }}
    //                                                 standalone={false}
    //                                                 style={{
    //                                                     axis: { stroke: 'white', opacity: .5 },
    //                                                     ticks: { stroke: 'white', opacity: .5, size: 5, padding: 0 },
    //                                                     tickLabels: { fontSize: 12, padding: 5, fill: '#FFF', fontFamily: 'inherit', opacity: .5, },
    //                                                 }} />
    //                                             : null}
    //                                     </VictoryChart> : (_this.state.chart_data.length == 0 && this.state.isChartUpdated) ? <View style={{ height: 130, justifyContent: 'center' }}>
    //                                         <Text style={[styles.stockDetailTextNoChartData, this.state.themeStyle.stockDetailTextNoChartData]}>{globals.stockDetailNoChartDataFound}</Text>
    //                                     </View> : null
    //                                 }
    //                             </Animated.View>
    //                         }
    //                     </View>
    //                 </View>

    //                 <View style={[styles.daysFilterView, this.state.themeStyle.daysFilterView]}>
    //                     <TouchableOpacity style={[styles.tabOptionMainView, { backgroundColor: _this.state.tabId == 1 ? this.state.themeStyle.tabOptionBGColor.backgroundColor : 'transparent' }]} onPress={() => _this.clickTabOption(1, '1D')}>
    //                         {_this.setTabOption(1, 'Today')}
    //                     </TouchableOpacity>
    //                     <TouchableOpacity style={[styles.tabOptionMainView, { backgroundColor: _this.state.tabId == 2 ? this.state.themeStyle.tabOptionBGColor.backgroundColor : 'transparent' }]} onPress={() => _this.clickTabOption(2, '5D')}>
    //                         {_this.setTabOption(2, '5D')}
    //                     </TouchableOpacity>
    //                     <TouchableOpacity style={[styles.tabOptionMainView, { backgroundColor: _this.state.tabId == 3 ? this.state.themeStyle.tabOptionBGColor.backgroundColor : 'transparent' }]} onPress={() => _this.clickTabOption(3, '3M')}>
    //                         {_this.setTabOption(3, '3M')}
    //                     </TouchableOpacity>
    //                     <TouchableOpacity style={[styles.tabOptionMainView, { backgroundColor: _this.state.tabId == 4 ? this.state.themeStyle.tabOptionBGColor.backgroundColor : 'transparent' }]} onPress={() => _this.clickTabOption(4, '6M')}>
    //                         {_this.setTabOption(4, '6M')}
    //                     </TouchableOpacity>
    //                     <TouchableOpacity style={[styles.tabOptionMainView, { backgroundColor: _this.state.tabId == 5 ? this.state.themeStyle.tabOptionBGColor.backgroundColor : 'transparent' }]} onPress={() => _this.clickTabOption(5, '1Y')}>
    //                         {_this.setTabOption(5, '1Y')}
    //                     </TouchableOpacity>
    //                     <TouchableOpacity style={[styles.tabOptionMainView, { backgroundColor: _this.state.tabId == 6 ? this.state.themeStyle.tabOptionBGColor.backgroundColor : 'transparent' }]} onPress={() => _this.clickTabOption(6, '3Y')}>
    //                         {_this.setTabOption(6, '3Y')}
    //                     </TouchableOpacity>
    //                 </View>
    //                 {(_this.state.data != null) ?
    //                     <TouchableOpacity onPress={() => _this.props.navigation.navigate('CompanyTabs', { str_stockID: str_stockID, theme: this.state.themeStyle, title: _this.state.data.symbol })}>
    //                         <View style={[styles.btnCompanyInfo, this.state.themeStyle.companyInfoBackground]}>
    //                             <Text style={[styles.buttonTextStockDetailCompanyInfo, this.state.themeStyle.companyInfoButton]}>{globals.stockDetailviewCompanyInfo}</Text>
    //                             <FontAwesomeIcon style={{ marginLeft: 10 }} name='caret-right' color={colors.white} />
    //                         </View>
    //                     </TouchableOpacity> : null}

    //                 {(_this.state.newsdata.length > 0) ? <View style={{ padding: 10, marginTop: 20, }}>
    //                     <Text style={[styles.stockDetailRelatedNews, this.state.themeStyle.stockRelatedNewsColor]}>{globals.stockDetailRelatedNews}</Text>
    //                     <View style={[styles.horizontalSepratorStockDetailReleatedNews, this.state.themeStyle.relatedNewsSeparator]} />
    //                 </View> : null}
    //             </View>
    //         </View>
    //     )
    // }

    makeRemoteRequest() {
        this.setState({ footerLoading: true });
        var query = "?symbol=" + symbol + "&count=20"
        API.marketNews(this.responseNewsData, query, this.state.page, false);
    }

    handleLoadMore = () => {
        console.log("handleLoadMore");
        console.log("Data Length : " + this.state.page);
        if (_this.state.isPaginationEnd == false) {
            var query = "?symbol=" + symbol + "&count=20"
            this.setState({
                page: this.state.page + 1,
            }, () => API.marketNews(this.responseNewsData, query, this.state.page, false));
        }
    };

    GetFormattedDate(timeValue) {
        var month = format(timeValue.getMonth() + 1);
        var day = format(timeValue.getDate());
        var year = format(timeValue.getFullYear());
        return month + "/" + day + "/" + year;
    }


    callArticleAPI(id, symbol, link, title) {
        var payload = {
            articleId: id,
            symbol: symbol
        };
        API.marketSavePersonalizationData(this.responseRedirectData, payload, true);
        this._pressHandler(link, title)

    }

    responseRedirectData = {
        success: (response) => {
        },
        error: (err) => {
        },
        complete: () => {
        }
    }

    _pressHandler(url = "https://www.google.com", title) {
        if (Platform.OS === 'android') {
            this.setState({ modalVisible: true })
            this.props.getShowModalSelectBankAccount(true, globals.screenTitle_stockdetail, url, title)
        }
        else {
            SafariView.isAvailable()
                .then(SafariView.show({
                    url: url,
                    barTintColor: colors.white,
                    readerMode: true,
                }))
                .catch(error => {
                });
        }

    }

    renderDateTime(item) {
        var dd = globals.checkTimeStamp(item.publishedDate);
        if (dd == '1') {
            return (
                <Text style={[styles.generalArticleSmall, this.state.themeStyle.stockRelatedNewsColor]}>{'Today'}
                </Text>
            )
        }
        else if (dd == '0') {
            return (
                <Text style={[styles.generalArticleSmall, this.state.themeStyle.stockRelatedNewsColor]}>{'Yesterday'}
                </Text>
            )
        }
        else if (dd == '2') {
            return (
                <Text style={[styles.generalArticleSmall, this.state.themeStyle.stockRelatedNewsColor]}>{moment(item.publishedDate).format('MM/DD/YY')}
                </Text>
            )
        }


    }

    renderRow(item) {

        return (
            <TouchableWithoutFeedback onPress={() => this.callArticleAPI(item.id, _this.state.data.symbol, item.linkToArticle, item.title)}>
                <View style={[{ padding: 5 ,marginLeft:15, marginRight:15, paddingBottom:5}, this.state.themeStyle.mainView]}>
                    <Text style={[styles.stockDetailRelatedNewsTitleClane, this.state.themeStyle.stockRelatedNewsTitleColor]}>{item.title}</Text>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ width: '70%', borderColor: 'red', }}>

                            {this.renderDateTime(item)}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )

    }

    separator = () => {
        return (
            <View style={this.state.themeStyle.mainRenderView}>
                <View style={[styles.horizontalSepratorStockDetail, this.state.themeStyle.relatedNewsSeparator]} />
            </View>

        );
    };

    // shareMsg() {
    //     console.log("________-----______---_____-  " + (_this != null && _this.state.data != null));
    //     // shareOptionObj['message'] = "I just checked the current price of " + _this.state.data.symbol + "- ₦" + _this.state.data.last + ". Download Clane from here: http://bit.ly/ClaneApp"
    //     if (globals.isInternetConnected) {
    //         if (_this != null && _this.state.data != null && _this.state.data.symbol != null && _this.state.data.last != null) {
    //             var changeValue = "";
    //             if (_this.state.data.change > 0) {
    //                 changeValue = " (+" + this.state.data.change + "%)";
    //             }
    //             else {
    //                 changeValue = " (" + this.state.data.change + "%)";
    //             }
    //             // var customlink = "https://li1097-203.members.linode.com/#/page1?&stock_id=" + _this.state.data.stock_id + "&date_range=" + _this.state.tabTitleValue + "&symbol=" + _this.state.data.symbol + "&key=stock" + "&efr=1"
    //             var customlink = "https://stocks.clane.com/#/?&stock_id=" + _this.state.data.stock_id + "&date_range=" + _this.state.tabTitleValue + "&symbol=" + _this.state.data.symbol + "&key=stock" + "&efr=1"
    //             console.log('====================================')
    //             console.log('customlink ' + customlink)
    //             console.log('====================================')
    //             //var customlink = "https://itunes.apple.com/us/app/clane/id1436475431?ls=1&mt=8";
    //             //https://stocks.clane.com/?&stock_id=08b4159b-9306-410c-850a-ec4596953d82&date_range=1D&symbol=TRANSCORP&key=stock&efr=1

    //             // let query = "access_token="+globals.BitlyGenericAccessToken+
    //             // "&longUrl="+customlink+"&format=json";
    //             // API.generate_bitly_url(this.responseBitlyData,query,false);

    //             const link = new firebase.links.DynamicLink(customlink, 'claneappdev.page.link')
    //                 .android.setPackageName('com.clanedev.app')
    //                 .ios.setBundleId('com.clanedev.app')
    //                 .android.setFallbackUrl(customlink)
    //                 .navigation.setForcedRedirectEnabled(true);

    //             firebase.links().createShortDynamicLink(link, "SHORT").then((url) => {
    //                 console.log("customlink--->" + url);

    //                 shareOptionObj['message'] = _this.state.data.symbol + " - ₦" + _this.state.data.last + changeValue + " on Clane. "+ "\n" + url
    //                 var tempObj = Object.assign({}, shareOptionObj)
    //                 Share.open(tempObj).catch(err => console.log(err))

    //                 firebase.analytics().logEvent(globals.event_Sharedastockpage, 
    //                     Object.assign({}, { EventDetails: _this.state.data.symbol}, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
    //             });
    //         }


    //         // var url = "http://192.168.100.96/test.html?p=stock/"+_this.state.data.stock_id+"/"+_this.state.data.symbol

    //         // shareOptionObj['message'] = "I just checked the current price of " + _this.state.data.symbol + "- ₦" + _this.state.data.last + ". Download Clane from here: "+url
    //     }
    //     else {
    //         Alert.alert(globals.APP_NAME, globals.networkNotAvailable)

    //     }

    //     // Share.open(shareOptionObj).catch(err => console.log(err))
    // }

    async shareMsg() {

        console.log("________-----______---_____-  " + (_this != null && _this.state.data != null));
        if (globals.isInternetConnected) {
            if (_this != null && _this.state.data != null && _this.state.data.symbol != null && _this.state.data.last != null) {
                var changeValue = "";
                if (_this.state.data.change > 0) {
                    changeValue = " (+" + this.state.data.change + "%)";
                }
                else {
                    changeValue = " (" + this.state.data.change + "%)";
                }
                var customlink = "https://stocks.clane.com/#/?&stock_id=" + _this.state.data.stock_id + "&date_range=" + _this.state.tabTitleValue + "&symbol=" + _this.state.data.symbol + "&key=stock" + "&efr=1"
                console.log('====================================')
                console.log('customlink ' + customlink)
                console.log('====================================')
                //var customlink = "https://itunes.apple.com/us/app/clane/id1436475431?ls=1&mt=8";
                //https://stocks.clane.com/?&stock_id=08b4159b-9306-410c-850a-ec4596953d82&date_range=1D&symbol=TRANSCORP&key=stock&efr=1

                // const link = new firebase.links.DynamicLink(customlink, 'claneappdev.page.link')
                //     .android.setPackageName('com.clanedev.app')
                //     .ios.setBundleId('com.clanedev.app')
                //     .android.setFallbackUrl(customlink)
                //     .navigation.setForcedRedirectEnabled(true);

                // firebase.links().createShortDynamicLink(link, "SHORT").then((url) => {
                //     console.log("customlink--->" + url);

                //     shareOptionObj['message'] = _this.state.data.symbol + " - ₦" + _this.state.data.last + changeValue + " on Clane. "+ "\n" + url
                //     var tempObj = Object.assign({}, shareOptionObj)
                //     Share.open(tempObj).catch(err => console.log(err))

                //     firebase.analytics().logEvent(globals.event_Sharedastockpage, { SymbolName: _this.state.data.symbol});

                // });
            }

            let branchUniversalObject = await branch.createBranchUniversalObject('stock', {
                locallyIndex: true,
                title: 'clane stock',
                contentDescription: 'test description',
                // contentMetadata: {
                //   ratingAverage: 4.2,
                //   customMetadata: {
                //     prop1: 'test',
                //     prop2: 'abc'
                //   }
                // }
            })

            //   let linkProperties = {
            //     feature: 'share',
            //     channel: 'facebook'
            // }

            // let controlParams = {
            //      //$desktop_url: customlink,
            //      $ios_url: customlink
            // }

            // let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)

            // console.log("branch io url" +url)

            let shareOptions = { messageHeader: '', messageBody: this.state.data.symbol + " - ₦" + _this.state.data.last + changeValue + " on Clane. " + "\n" }
            let linkProperties = { feature: 'share', channel: 'ClaneApp' }
            let controlParams = { $desktop_url: customlink, $ios_url: customlink, $android_url: customlink }
            let { channel, completed, error } = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)


            // let shareOptions = { messageHeader: 'Check this out', messageBody: _this.state.data.symbol + " - ₦" + _this.state.data.last + changeValue + " on Clane. "+ "\n" + url }

            // let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)

            // shareOptionObj['message'] = _this.state.data.symbol + " - ₦" + _this.state.data.last + changeValue + " on Clane. "+ "\n" + url
            // var tempObj = Object.assign({}, shareOptionObj)
            // Share.open(tempObj).catch(err => console.log(err))
            firebase.analytics().logEvent(globals.event_Sharedastockpage, { SymbolName: _this.state.data.symbol });

        }
        else {
            Alert.alert(globals.APP_NAME, globals.networkNotAvailable)

        }

        // Share.open(shareOptionObj).catch(err => console.log(err))
    }

    startFlatListDrag() {
        this.setState({ isDragFirstTime: true })

    }

    getBounceCorrection = (color) => {

        return Platform.OS == "android" ? null : <View style={[color, { height: BOUNCE_MARGIN }]} />
    }



    /**
     * Method for open modal
     */
    openModal() {
        return (
            <Modal animationType='slide' visible={this.state.modalVisible} onRequestClose={() => { StockDetails.handleCloseModalWebview() }}>
                <NewsAndroidWebview setParentState={newState => this.setState(newState)} />
            </Modal>
        )
    }

    /**
     * Method for handle close modal webview
     */
    static handleCloseModalWebview() {
        _this.props.getShowModalSelectBankAccount(false)
        _this.setState({
            modalVisible: false
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true }, () => {
            API.stockInfo(_this.responseStockInfoData, str_stockID, false);
        });
    }

    displayText(isError) {
        if (isError) {
            return (
                <Text style={[styles.trendingFooterText, { textAlign: 'center' }, this.state.themeStyle.trendingFooterText]}>{globals.timeoutMessage}
                </Text>
            )
        } else {
            return (
                <Text />
            )
        }
    }

    render() {
        if (_this.state.data != null && _this.state.data.date != null) {
            console.log("sdfsdfdsf");
            lastUpdate = <Text style={[styles.priceTopTitle, this.state.themeStyle.stockDetailHeaderSubTitleColor]}>{moment.unix(_this.state.data.date).format('D MMM, h:mm A')}</Text>
        }
        var line = <View style={[styles.topViewSeparators, this.state.themeStyle.topViewSeparator]}></View>
        var data = []
        if (this.state.newsdata.length > 0) {
            data = this.state.newsdata.slice(0, 3)
        }

        if (!this.state.loading) {
            if (this.state.isTimeout) {
                return (
                    <SafeAreaView style={[globalStyles.safeviewStyle, this.state.themeStyle.mainRenderView]}>
                        <NavigationEvents
                            onDidFocus={payload => {
                                AsyncStorage.setItem(globals.currentNavigator, globals.currentNavigatorValue);
                            }}
                        />
                        <View style={[styles.watchlistFooterMain, { marginBottom: 44 }, this.state.themeStyle.mainRenderView]}>
                            <View style={[styles.noInternetTextView,]}>
                                {this.displayText(this.state.isTimeout)}
                            </View>
                        </View>
                    </SafeAreaView>
                )
            }
            else if (!this.state.isInternetAvailable && this.state.isAlreadyCached == false) {
                return (
                    <SafeAreaView style={[globalStyles.safeviewStyle, this.state.themeStyle.mainRenderView]}>
                        <NavigationEvents
                            onDidFocus={payload => {
                                AsyncStorage.setItem(globals.currentNavigator, globals.currentNavigatorValue);
                            }}
                        />
                        <View style={[styles.watchlistFooterMain, { marginBottom: 44 }, this.state.themeStyle.mainRenderView]}>
                            <View style={styles.noInternetTextView}>
                                <Text style={[styles.trendingFooterText, this.state.themeStyle.trendingFooterText]}>{globals.networkNotAvailable}
                                </Text>
                            </View>
                            <View style={styles.tryAgainButtonView}>
                                <Button
                                    onPress={() => _this.btnTryAgainPressed()}
                                    textStyle={[styles.buttonText, this.state.themeStyle.buttonText]}
                                    buttonStyles={[styles.buttonStyles, this.state.themeStyle.buttonStyles]}
                                    text={globals.tryAgain}></Button>
                            </View>
                        </View>
                    </SafeAreaView>
                )
            }
            else {

                return (///this.state.themeStyle.mainRenderView,
                    <Fragment>
                        <SafeAreaView style={[{ flex: 0, }, this.state.themeStyle.topBackgroundViewNew]}></SafeAreaView>
                        <SafeAreaView style={[globalStyles.safeviewStyle, this.state.themeStyle.topBackgroundViewNew]}>
                            <NavigationEvents
                                onDidFocus={payload => {
                                    AsyncStorage.setItem(globals.currentNavigator, globals.currentNavigatorValue);
                                }}
                            />
                            {/* <View style={{ backgroundColor: colors.blue }}> */}
                            <View style={[styles.headerStyle, this.state.themeStyle.topBackgroundViewNew, { paddingTop: 5, paddingLeft: 10 }]}>
                                <TouchableOpacity style={{ justifyContent: 'flex-start', marginLeft: 15, }} onPress={() => this.props.navigation.goBack()}>
                                    {/* <HeaderBackButton onPress={() =>  this.props.navigation.goBack(null)} title='' tintColor='white' /> */}
                                    <Ionicons name="ios-arrow-back" size={30} color={(this.props.marketStatus) ? colors.backLight : colors.white} />
                                </TouchableOpacity>
                                <View style={styles.headerTitleView}>
                                    <Text style={[styles.headertitleText, { color: (this.props.marketStatus) ? colors.blackColor : colors.white }]}>{this.state.data && this.state.data.symbol}</Text>
                                    {(_this.state.data && (_this.state.data.change != 0)) ?
                                        <FontAwesomeIcon size={15} name={(_this.state.data.change < 0) ? "caret-down" : "caret-up"} color={(_this.state.data.change < 0) ? colors.redColor : colors.greenColor} style={{ marginTop: 3, marginLeft: 3 }} />
                                        : null}
                                </View>
                                <View style={{ flex: 0.2 }} />
                            </View>
                            <View style={[styles.topViewSeparatorsNew, this.state.themeStyle.topViewSeparator]}></View>
                            {/* </View> */}
                            <View style={[styles.mainRenderView, this.state.themeStyle.mainRenderView,]}>

                                {this.openModal()}
                                <View style={[{ flex: 1, }, this.state.themeStyle.mainRenderView,]}>
                                    {(_this.state.data != null && this.state.newsdata.length > 0) ? <View style={{ position: 'absolute', }}>
                                        <View style={[{ height: globals.WINDOW.height / 2.5, width: globals.WINDOW.width }, this.state.themeStyle.topBackgroundViewNew]} />
                                        <View style={[{ height: globals.WINDOW.height / 2.5, width: globals.WINDOW.width }, this.state.themeStyle.mainRenderView]} />
                                    </View> : null}


                                    <FlatList
                                        ref={"myFlatList"}
                                        data={data}
                                        renderItem={({ item }) => this.renderRow(item)}
                                        keyExtractor={(item, index) => index.toString()}
                                        ItemSeparatorComponent={this.separator}
                                        extraData={this.state}
                                        ListHeaderComponent={this.renderHeader}
                                        ListFooterComponent={this.renderFooter}
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={this.state.refreshing}
                                                onRefresh={this.onRefresh}
                                                tintColor={'#fff'}
                                            />
                                        }
                                    />
                                </View>
                            </View>

                            <View style={[styles.mainBottomView, this.state.themeStyle.mainRenderView]}>

                                <TouchableOpacity style={styles.buttonView} onPress={() => {
                                    this.shareMsg()
                                }}>
                                    <View style={styles.buttonView}>
                                        <Image source={stock.share_icon} style={[styles.footerIconView]} />
                                        <Text style={styles.bottomButtonText}>{"Share"}</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.buttonView} onPress={() => _this.btnWatchPressed()} >
                                    <View style={styles.buttonView}>
                                        <Image source={(this.state.isWatch) ? stock.unwatch : stock.watch} style={[styles.footerIconView]} />
                                        <Text style={styles.bottomButtonText}>{(this.state.isWatch) ? "Unwatch" : "Watch"}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Fragment>
                )
            }
        } else {
            return <SafeAreaView style={[globalStyles.safeviewStyle, this.state.themeStyle.mainRenderView]}>
                <NavigationEvents
                    onDidFocus={payload => {
                        AsyncStorage.setItem(globals.currentNavigator, globals.currentNavigatorValue);
                    }}
                />
                <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={(this.props.marketStatus ? colors.blackColor : colors.white)} />
                </View>
            </SafeAreaView>
        }
    }
}

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
    return {
        loader: state.claneLoader_red.loader,
        theme: state.changeTheme_red.theme,
        color: state.changeTabColor_red.color,
        marketStatus: state.checkMarketStatus_red.marketStatus,
        selectBankAccount_modal: state.showModalSelectBankAccount_red.selectBankAccount_modal,
        screen_name: state.showModalSelectBankAccount_red.screen_name,
    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    getshowLoader,
    changeTheme,
    checkMarketStatus,
    changeTabColor,
    getshowModal,
    getShowModalSelectBankAccount
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(StockDetailSearch);