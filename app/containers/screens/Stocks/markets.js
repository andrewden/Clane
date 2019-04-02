import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Text,
    View,
    TouchableOpacity,
    AsyncStorage,
    StatusBar,
    Platform,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Animated,
    SafeAreaView
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Countly from 'countly-sdk-react-native';
import styles from './style';
import Button from '../../../components/Button';
import { bindActionCreators } from 'redux';
import { getshowModal } from '../../../redux/actions/showModal';
import * as colors from '../../../assets/styles/color';
import * as globals from '../../../lib/globals';
import globalStyles from '../../../assets/styles/globalStyles';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { getshowLoader } from '../../../redux/actions/showLoaderModal';
import { changeTheme } from '../../../redux/actions/changeTheme';
import { changeTabColor } from '../../../redux/actions/changeTabColorModel';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import moment from 'moment';
import { API } from '../../../lib/api';
import StockTabs from './stockTab';
import BackgroundTimer from 'react-native-background-timer';
import firebase from 'react-native-firebase';

var endUrl;
var responseMarketList = [];
var isMounted = true;
var stockDetail = [];
var blueHeaderTop = 80;
var themeStyle = null;

class Markets extends Component {

    static navigationOptions = ({ navigation, screenProps, }) => {
        const { state } = navigation;
        return {
            // headerTitle: globals.screenTitle_market,

            headerStyle: { backgroundColor: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.bgColor : colors.blue, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
        }
    }

    constructor(props) {
        super(props);
        // themeStyle = this.props.theme;
        this.state = {
            fadeAnim: new Animated.Value(0),
            alpha: 0,
            zindex: 1,
            listView_contentoffset_y: 0,
            tabId: 1,
            dataSourceGainer: [],
            footerString: '',
            tredingStatus: true,
            loading: false,
            last_update: '',
            isInternetAvailable: true,
            isDataLoaded: false,
            // tabBarColor : colors.white,
            tabBarColor: props.color,
            tryNowClicked: false,
            themeStyle: props.theme,
            sortingTypeCompany: 0,  // 0 - descending , 1 - accending
            sortingTypePrice: 0, // 0 - descending , 1 - accending
            sortingTypeChange: 0, // 0 - descending , 1 - accending
            sortingTypePercentange: 0 // 0 - descending, 1 - accending
        };
    }

    componentDidMount() {
        console.log("this.props.marketStatus  " + this.props.marketStatus);

        var event = { "key": globals.event_Marketpagenavigation, "count": 1 };
        event.segmentation = Object.assign({}, { EventDetails: globals.topGainers }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
        Countly.recordEvent(event);
        console.log("=====segmentation record event globals.event_Marketpagenavigation, result=> ");

        firebase.analytics().logEvent(globals.event_Marketpagenavigation,
            Object.assign({}, { EventDetails: globals.topGainers }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
            ));

        this.setState({ tredingStatus: this.props.marketStatus })

        if (!globals.isInternetConnected) {

            this.checkTimeintervalForMarketListData(globals.market_topgainers);
            // this.checkTimeintervalForMarketListData(globals.market_toplosers);
            // this.checkTimeintervalForMarketListData(globals.market_mostactives);
            var bools = globals.checkThemeInOfflineMode();
            setTimeout(() => {
                this.setState({
                    tredingStatus: bools,
                    // dataSourceGainer: [],
                    footerString: globals.networkNotAvailable,
                    isInternetAvailable: false,
                    // loading : false
                });
                if (bools) {
                    globals.globalVars.statusBarColor = colors.blue
                } else {
                    globals.globalVars.statusBarColor = colors.blackThemeColor

                }
            }, 1000);
            // SplashScreen.hide();
        }
        else {
            this.checkTimeintervalForMarketListData(globals.market_topgainers);
            API.marketlist(this.responseMarketListTopLoserData, globals.market_toplosers, false)
            API.marketlist(this.responseMarketListMostActiveData, globals.market_mostactives, false)
        }

        BackgroundTimer.runBackgroundTimer(() => {
            // this.checkTimeintervalForMarketListData(globals.market_topgainers);
            if (globals.isInternetConnected) {
                API.marketlist(this.responseMarketListTopLoserData, globals.market_toplosers, false)
                API.marketlist(this.responseMarketListMostActiveData, globals.market_mostactives, false)
            }

            if (this.state.tabId == 1) {
                this.checkTimeintervalForMarketListData(globals.market_topgainers);
            } else if (this.state.tabId == 2) {
                this.checkTimeintervalForMarketListData(globals.market_toplosers);
            } else if (this.state.tabId == 3) {
                this.checkTimeintervalForMarketListData(globals.market_mostactives);
            }
        }, 900000); //900000


    }

    componentWillUnmount() {
        isMounted = false;
    }

    componentWillReceiveProps(newProps) {
        // console.log("newProps " + JSON.stringify(newProps));

        if (newProps.color != undefined) {
            this.setState({
                tabBarColor: newProps.color,
                tredingStatus: newProps.marketStatus,
                themeStyle: newProps.theme,
            })

            if (Platform.OS === 'android') {
                if (newProps.marketStatus) {
                    StatusBar.setBackgroundColor(colors.blue, true);
                }
                else {
                    StatusBar.setBackgroundColor(colors.blackThemeColor, true);
                }
            }
        }

    }


    /**
     * Method for check time interval for market list display
     * @param {*} market_type 
     */
    checkTimeintervalForMarketListData(market_type) {

        AsyncStorage.getItem(market_type, (err, result) => {
            if (result !== null) {

                console.log("market_type " + market_type);

                console.log("TOP LOSERS CACHE DATA");

                var diffMins = globals.getTimeDifference(result);
                if (diffMins >= 14 && globals.isInternetConnected) {
                    console.log("TOP LOSERS API CALL AFTER 15 MINS");
                    this.callWSForListData(market_type);
                } else {
                    AsyncStorage.getItem(globals.key_datasource + market_type, (err, result) => {
                        if (result !== null) {
                            console.log("TOP LOSERS CACHE DATA RENDER");
                            var responseData = JSON.parse(result);
                            isMounted = true;
                            this.formatListArrayData(responseData);
                        }
                    });
                }
            } else {
                if (globals.isInternetConnected) {
                    console.log("MARKET STATUS ELSE 1");
                    this.setState({ isInternetAvailable: true, });
                    this.callWSForListData(market_type);
                } else {
                    console.log("MARKET STATUS ELSE 2");
                    // SplashScreen.hide();
                    this.setState({
                        // dataSourceGainer: [],
                        footerString: globals.networkNotAvailable,
                        isInternetAvailable: false,
                        loading: false
                    });
                }
            }
        });
    }

    /**
     * Method for top gainer, top losers, most active API call
     */
    callWSToGetTopGainersAPI(endPoint) {
        endUrl = globals.market_topgainers;
        if (this.state.tabId == 1) {
            endUrl = globals.market_topgainers;
        } else if (this.state.tabId == 2) {
            endUrl = globals.market_toplosers;
        } else if (this.state.tabId == 3) {
            endUrl = globals.market_mostactives;
        }
        if (endPoint != undefined) {
            this.checkTimeintervalForMarketListData(endUrl);
        }
    }

    /**
     * Method for call API for list items 
     */
    callWSForListData(end_Url) {
        endUrl = end_Url;
        isMounted = true
        if (end_Url == globals.market_topgainers) {
            this.setState({ loading: false, }, () => API.marketlist(this.responseMarketListData, end_Url, false));
            // API.marketlist(this.responseMarketListData, end_Url, false);
        } else if (end_Url == globals.market_toplosers) {
            this.setState({ loading: false, }, () => API.marketlist(this.responseMarketListTopLoserData, end_Url, false));
            // API.marketlist(this.responseMarketListTopLoserData, end_Url, false)
        } else if (end_Url == globals.market_mostactives) {
            this.setState({ loading: false, }, () => API.marketlist(this.responseMarketListMostActiveData, end_Url, false));
            // API.marketlist(this.responseMarketListMostActiveData, end_Url, false)
        }
        // this.setState({ loading: false, dataSourceGainer: [] }, () => API.marketlist(this.responseMarketListData, end_Url, false));
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
      * Method for get response of market list API
      */
    responseMarketListData = {
        success: (response) => {
            console.log("Response of Stokcs Data " + JSON.stringify(response))
            responseMarketList = response.sData.data;
            AsyncStorage.setItem(globals.market_topgainers, new Date());
            AsyncStorage.setItem(globals.key_datasource + globals.market_topgainers, JSON.stringify(response));
            this.setState({ loading: false })

            try {
                console.log("Success Call");
                if (this.state.tabId == 1) {
                    this.formatListArrayData(response);
                }

                // SplashScreen.hide();
            } catch (error) {
            }
        },
        error: (err) => {
            this.props.getshowLoader(false);
            AsyncStorage.getItem(globals.key_datasource + globals.market_topgainers, (error, result) => {
                if (result !== null) {
                    var responseData = JSON.parse(result);
                    isMounted = true;
                    if (this.state.tabId == 1) {
                        this.formatListArrayData(responseData);
                    }
                } else {
                    this.setState({
                        dataSourceGainer: [],
                        last_update: '',
                        footerString: globals.timeoutMessage,
                        // isInternetAvailable: false,
                        loading: false
                    });
                }
            });

            //this.formatListArrayData(err);
        },
        complete: () => {
            // SplashScreen.hide();
            console.log("Complete Call + " + JSON.stringify(responseMarketList));
            for (let index = 0; index < responseMarketList.length; index++) {
                API.stockInfo(this.responseStockInfoData, responseMarketList[index].stock_id, false);
            }
            this.props.getshowLoader(false);
        }
    }


    /**
      * Method for get response of market list API
      */
    responseMarketListTopLoserData = {
        success: (response) => {
            console.log("Response of Stokcs Data " + JSON.stringify(response))
            responseMarketList = response.sData.data;
            AsyncStorage.setItem(globals.market_toplosers, new Date());
            AsyncStorage.setItem(globals.key_datasource + globals.market_toplosers, JSON.stringify(response));
            try {
                console.log("Success Call");
                if (this.state.tryNowClicked && this.state.tabId == 2) {
                    this.formatListArrayData(response);
                }
                //this.formatListArrayData(response);
            } catch (error) {
            }
        },
        error: (err) => {
            AsyncStorage.getItem(globals.key_datasource + globals.market_toplosers, (error, result) => {
                if (result !== null) {
                    var responseData = JSON.parse(result);
                    isMounted = true;
                    if (this.state.tabId == 2) {
                        this.formatListArrayData(responseData);
                    }
                } else {
                    this.setState({
                        dataSourceGainer: [],
                        last_update: '',
                        footerString: globals.timeoutMessage,
                        // isInternetAvailable: false,
                        loading: false
                    });
                }
            });
        },
        complete: () => {
            console.log("Complete Call + " + JSON.stringify(responseMarketList));
            for (let index = 0; index < responseMarketList.length; index++) {
                API.stockInfo(this.responseStockInfoData, responseMarketList[index].stock_id, false);
            }
            this.props.getshowLoader(false);
        }
    }

    /**
      * Method for get response of market list API
      */
    responseMarketListMostActiveData = {
        success: (response) => {
            console.log("Response of Stokcs Data MOST ACTIVE " + JSON.stringify(response))
            responseMarketList = response.sData.data;
            AsyncStorage.setItem(globals.market_mostactives, new Date());
            AsyncStorage.setItem(globals.key_datasource + globals.market_mostactives, JSON.stringify(response));
            try {
                console.log("Success Call");
                if (this.state.tryNowClicked && this.state.tabId == 3) {
                    this.formatListArrayData(response);
                }
                // this.formatListArrayData(response);
            } catch (error) {
            }
        },
        error: (err) => {
            AsyncStorage.getItem(globals.key_datasource + globals.market_mostactives, (error, result) => {
                if (result !== null) {
                    var responseData = JSON.parse(result);
                    isMounted = true;
                    if (this.state.tabId == 3) {
                        this.formatListArrayData(responseData);
                    }
                } else {
                    this.setState({
                        dataSourceGainer: [],
                        last_update: '',
                        footerString: globals.timeoutMessage,
                        // isInternetAvailable: false,
                        loading: false
                    });
                }
            });
        },
        complete: () => {
            console.log("Complete Call + " + JSON.stringify(responseMarketList));
            for (let index = 0; index < responseMarketList.length; index++) {
                API.stockInfo(this.responseStockInfoData, responseMarketList[index].stock_id, false);
            }
            this.props.getshowLoader(false);
        }
    }

    /**
     * Method for render data in listing
     * @param {*} responseData 
     */
    formatListArrayData(responseData) {
        this.setState({ dataSourceGainer: [] })
        Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        if (isMounted) {
            if (responseData.sStatus == 1) {
                console.log("STATUS 1");
                var sectionArray = [...responseData.sData.data]
                if (sectionArray != null && sectionArray != undefined) {
                    this.setState({
                        dataSourceGainer: sectionArray,
                        loading: false,
                        last_update: responseData.sData.last_updated_date
                    }, () => { this.forceUpdate() })
                }
            } else if (responseData.sStatus == 0) {
                console.log("STATUS 0");
                this.setState({
                    dataSourceGainer: [...responseData.sData.data],
                    loading: false,
                    footerString: responseData.sMessage,
                    last_update: responseData.sData.last_updated_date
                }, () => { this.forceUpdate() });
            }
        }
        console.log("datasource gainer :---> " + JSON.stringify(this.state.dataSourceGainer))
    }


    /**
     * change state of sorting type for all fields
     * @param {*} id 
     */
    sortData(id) {
        if (id == '1') {
            this.setState({ sortingTypeCompany: (this.state.sortingTypeCompany == 0) ? 1 : 0 }, () => {
                this.sortDataAccordingField(id)
            })
        }
        else if (id == '2') {
            this.setState({ sortingTypePrice: (this.state.sortingTypePrice == 0) ? 1 : 0 }, () => {
                this.sortDataAccordingField(id)
            })
        }
        else if (id == '3') {
            this.setState({ sortingTypeChange: (this.state.sortingTypeChange == 0) ? 1 : 0 }, () => {
                this.sortDataAccordingField(id)
            })
        }
        else if (id == '4') {
            this.setState({ sortingTypePercentange: (this.state.sortingTypePercentange == 0) ? 1 : 0 }, () => {
                this.sortDataAccordingField(id)
            })
        }
        else { }
    }


    /**
     * Sorting data according to sorting field and type and update datasource
     */
    sortDataAccordingField(id) {
        if (id == '1') {
            if (this.state.sortingTypeCompany == 0) {
                this.state.dataSourceGainer.sort((a, b) => b.symbol.localeCompare(a.symbol))
                this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
            }
            else {
                this.state.dataSourceGainer.sort((a, b) => a.symbol.localeCompare(b.symbol))
                this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
            }
        }
        else if (id == '2') {
            if (this.state.sortingTypePrice == 0) {
                this.state.dataSourceGainer.sort((a, b) => b.last - a.last);
                this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
            }
            else {
                this.state.dataSourceGainer.sort((a, b) => a.last - b.last);
                this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
            }
        }
        else if (id == '3') {
            if (this.state.sortingTypeChange == 0) {
                this.state.dataSourceGainer.sort((a, b) => b.change - a.change)
                this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
            }
            else {
                this.state.dataSourceGainer.sort((a, b) => a.change - b.change)
                this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
            }
        }
        else if (id == '4') {
            if (this.state.sortingTypePercentange == 0) {
                this.state.dataSourceGainer.sort((a, b) => b.per_change - a.per_change)
                this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
            }
            else {
                this.state.dataSourceGainer.sort((a, b) => a.per_change - b.per_change)
                this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
            }
        }
        else { }
    }

    /**
     * Method for render section header 
     */
    renderStockSectionHeader() {
        let lastUpdate = <Text />;
        if (this.state.last_update != '') {
            lastUpdate = <Text style={[styles.lastUpdated, this.state.themeStyle.lastUpdated]}>Last updated:{"\n"}{moment.unix(this.state.last_update).format('D MMM, h:mm A')}</Text>
        }
        return (
            <View>
                <View style={[styles.trendingSection, this.state.themeStyle.trendingSection]}>
                    <View style={styles.headingContainer}>
                        <Text style={[styles.trendingTitle, this.state.themeStyle.trendingTitle]}>Trending Today</Text>
                        {lastUpdate}
                    </View>
                    <View style={styles.trendingTabMain}>
                        <View style={styles.trendingTabChild}>
                            <TouchableOpacity onPress={() => { this.renderTabTheme(1) }} disabled={this.state.loading}>
                                {this.setCommonTabStyle(this.state.tredingStatus, 1, globals.topGainers, 'caret-up', colors.greenColor)}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.trendingTabChild}>
                            <TouchableOpacity onPress={() => { this.renderTabTheme(2) }} disabled={this.state.loading}>
                                {this.setCommonTabStyle(this.state.tredingStatus, 2, globals.topLosers, 'caret-down', colors.redColor)}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.trendingTabChild}>
                            <TouchableOpacity onPress={() => { this.renderTabTheme(3) }} disabled={this.state.loading}>
                                {this.setCommonTabStyle(this.state.tredingStatus, 3, globals.mostActive, 'flash', 'yellow')}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={[styles.stockListMain, { height: 25 }, this.state.themeStyle.trendingSection]}>
                    <View style={[styles.listItemMainView, { paddingTop: 0, paddingBottom: 0 }]}>
                        <TouchableOpacity style={[styles.stockListNameMainBlock, { alignItems: 'flex-start' }]} onPress={() => this.sortData('1')}>
                            <View style={[styles.stockListNameMainBlock, { alignItems: 'flex-start' }]}>
                                <Text numberOfLines={1} style={[styles.listHeaderTagText, this.state.themeStyle.listHeaderTagText]}>Company</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={() => this.sortData('2')}>
                            <View style={[styles.stockListPriceBlock, { flex: 1, marginTop:0,  }]}>
                                <Text numberOfLines={1} style={[styles.listHeaderTagText, this.state.themeStyle.listHeaderTagText, ]}>Price</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.stockListPercentageBlockGreenHeader, { backgroundColor: colors.transparent, margingHorizontal: 0, padding: 0 }]} onPress={() => this.sortData('4')}>
                            <View style={[styles.stockListPercentageBlockGreenHeader, {marginLeft :10, backgroundColor: colors.transparent, flex: 1, margingHorizontal: 0, }]}>
                                <Text numberOfLines={1} style={[styles.listHeaderTagText, this.state.themeStyle.listHeaderTagText]}>Rate %</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.horizontalSeprator, this.state.themeStyle.horizontalSeprator]} />
            </View>
        )
    }

    /**
     * Method for set common style for tab component with dark and light
     * @param {*} status 
     * @param {*} tabid 
     * @param {*} label 
     * @param {*} icon 
     * @param {*} activeColor 
     */
    setCommonTabStyle(status, tabId, label, icon, activeColor) {

        return (
            <View style={[styles.rectangleTrending, this.state.themeStyle.rectangleTrending, { backgroundColor: (this.state.tabId == tabId) ? (status == true ? colors.blue : colors.darkThemeTabBackGround) : 'transparent' }]}>
                <FontAwesomeIcon name={icon} color={(this.state.tabId == tabId) ? activeColor : colors.greythemeColor} />
                <Text style={[styles.headerStockTabTrendingTitle, this.state.themeStyle.headerStockTabTrendingTitle, { color: (this.state.tabId == tabId) ? colors.white : colors.greythemeColor }]}>
                    {label}
                </Text>
            </View>
        )
    }

    /**
     * Method for scrolling list to top on tap press
     */
    scrollListToTop() {
        setTimeout(() => {
            this.refs.stockListView.scrollToOffset({ animated: false, viewOffset: 100 });
        }, 100);
    }

    /**
     * Method for render footer 
     */
    renderStockFooter = () => {
        if (this.state.loading == true) {
            return (
                <View style={[styles.trendingFooterMain, this.state.themeStyle.trendingFooterMain]}>
                    <ActivityIndicator size="large" color={(this.state.tredingStatus == globals.marketStatusClose ? colors.white : colors.blackThemeColor)} />
                </View>
            )
        } else if (this.state.dataSourceGainer.length == 0) {
            return (
                <View style={[styles.trendingFooterMain, this.state.themeStyle.trendingFooterMain]}>
                    <View style={styles.noInternetTextView}>
                        <Text style={[styles.trendingFooterText, this.state.themeStyle.trendingFooterText, { textAlign: 'center' }]}>{this.state.footerString}
                        </Text>
                    </View>
                    {
                        (!this.state.loading && this.state.isInternetAvailable == false) ?
                            <View style={styles.tryAgainButtonView}>
                                <Button
                                    onPress={() => this.tryAgainButtonClick()}
                                    textStyle={[styles.buttonText, this.state.themeStyle.buttonText]}
                                    buttonStyles={[styles.buttonStyles, this.state.themeStyle.buttonStyles]}
                                    text={globals.tryAgain}></Button>
                            </View>
                            : null
                    }
                </View>
            )
        } else {
            return (
                null
            )
        }
    }

    /**
     * Method for try again button click
     */
    tryAgainButtonClick() {
        // if(!this.state.loading){
        if (globals.isInternetConnected) {
            this.setState({ tryNowClicked: true, loading: true }); this.checkTimeintervalForMarketListData(globals.market_topgainers);
            API.marketlist(this.responseMarketListTopLoserData, globals.market_toplosers, false)
            API.marketlist(this.responseMarketListMostActiveData, globals.market_mostactives, false)
        }
    }

    /**
     * Method for listview scroll
     * @param {*} event 
     */
    listViewScroll(event) {
        this.state.listView_contentoffset_y = event.nativeEvent.contentOffset.y;
        var currentOffset = event.nativeEvent.contentOffset.y;
        var direction = currentOffset > this.offset ? 'down' : 'up';
        this.offset = currentOffset;
        if (event.nativeEvent.contentOffset.y > 0) {
            this.setState({ zindex: 0 })
        } else {
            this.setState({ zindex: 1 })
        }
        if (event.nativeEvent.contentOffset.y <= 60) {
            var alpha = event.nativeEvent.contentOffset.y / blueHeaderTop
            this.setState({ alpha: alpha })
        }
    }

    /**
     * Method for render Stock listview
     * @param {*} tabid 
     */
    renderStockListView(tabid) {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    style={styles.marketFlatlistView}
                    ref={"stockListView"}
                    renderItem={(rowData, rowID) => this.renderStockList(rowData, rowID)}
                    data={this.state.dataSourceGainer}
                    ListFooterComponent={this.renderStockFooter}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={this.renderSeparator}
                    extraData={this.state}
                />
            </View>
        )
    }

    /**
     * Method for call trending list API
     * @param {*} tabId 
     */
    renderTabTheme(tabId) {
        this.setState({ tabId: tabId, });
        this.scrollListToTop();
        if (tabId == 1) {

            var event = { "key": globals.event_Marketpagenavigation, "count": 1 };
            event.segmentation = Object.assign({}, { EventDetails: globals.topGainers }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_Marketpagenavigation, result=> ");

            firebase.analytics().logEvent(globals.event_Marketpagenavigation,
                Object.assign({}, { EventDetails: globals.topGainers }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
                ));
            this.checkTimeintervalForMarketListData(globals.market_topgainers);
        } else if (tabId == 2) {
            console.log("TOP LOSERS BUTTON CLICK");

            var event = { "key": globals.event_Marketpagenavigation, "count": 1 };
            event.segmentation = Object.assign({}, { EventDetails: globals.topLosers }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_Marketpagenavigation, result=> ");

            firebase.analytics().logEvent(globals.event_Marketpagenavigation,
                Object.assign({}, { EventDetails: globals.topLosers }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
            this.checkTimeintervalForMarketListData(globals.market_toplosers);
        } else if (tabId == 3) {
            console.log("MOST ACTIVE BUTTON CLICK");

            var event = { "key": globals.event_Marketpagenavigation, "count": 1 };
            event.segmentation = Object.assign({}, { EventDetails: globals.mostActive }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_Marketpagenavigation, result=> ");

            firebase.analytics().logEvent(globals.event_Marketpagenavigation,
                Object.assign({}, { EventDetails: globals.mostActive }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
                ));
            this.checkTimeintervalForMarketListData(globals.market_mostactives);
        }

    }

    renderSeparator() {
        return <View style={[{ height: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1, marginHorizontal: 15 }]}></View>
    }

    goToStockDetail(data) {
        var event = { "key": globals.event_stockName, "count": 1 };
        event.segmentation = Object.assign({}, { EventDetails: data.symbol }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
        Countly.recordEvent(event);
        console.log("=====segmentation record event globals.event_Marketpagenavigation, result=> ");

        firebase.analytics().logEvent(globals.event_stockName,
            Object.assign({}, { EventDetails: data.symbol }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
            ));

        StockTabs._goToStockDetaill({ theme: this.state.themeStyle, stock_id: data.stock_id, symbol: data.symbol })
    }

    renderRateValue(data) {
        if (this.props.marketStatus) {
            return (<View style={[styles.stockListPercentageBlockGreen,  {
            }]}>
                <View style={[styles.marketRateValuesBGView, {
                    backgroundColor: (data.per_change < 0) ? colors.lightRed : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.transparent : colors.transparent) : colors.lightGreen,  
                }]}>
                    <Text style={[styles.listItemPriceRatePercentage, {
                        color: (data.per_change < 0) ? colors.redColor : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.white : colors.blackColor) : colors.greenColor,
                    }]}>{globals.checkForFloatAndRound(data.per_change) ? '' + globals.checkForFloatAndRound(data.per_change) + '%' : ''}</Text>
                </View>
                 
            </View>)
        } else {
            return (<View style={[styles.stockListPercentageBlockGreen, {
            }]}>
                <View style={[styles.marketRateValuesBGView, {
                    backgroundColor: (data.per_change < 0) ? colors.darkRed : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.transparent : colors.transparent) : colors.darkGreen,   
                }]}>
                    <Text style={[styles.listItemPriceRatePercentage, {
                        color: (data.per_change < 0) ? colors.darkDownStockTextColor : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.white : colors.white) : colors.darkUpStockTextColor,
                    }]}>{globals.checkForFloatAndRound(data.per_change) ? '' + globals.checkForFloatAndRound(data.per_change) + '%' : ''}</Text>
                </View>
            </View>)
        }
    }

    /**
     * Method for render Stock list item 
     * @param {*} data 
     * @param {*} index 
     */
    renderStockList(resData, index) {
        var data = resData.item;
        let { fadeAnim } = this.state;
        return (
            <Animated.View style={[styles.stockListMain, this.state.themeStyle.stockListMain, { opacity: fadeAnim }]}>
                <TouchableOpacity onPress={() => this.goToStockDetail(data)}>
                    <View style={[styles.listItemMainView, this.state.themeStyle.listItemMainView]}>
                        <View style={styles.stockListNameMainBlock}>
                            <View style={styles.column}>
                                <View style={styles.stockListNameMainBlockOrientationChild}>
                                    <Text numberOfLines={1} style={[styles.listItemTitle, this.state.themeStyle.listItemTitle]}>{data.symbol}</Text>
                                </View>
                                <Text numberOfLines={1} style={[styles.listItemSmallText, this.state.themeStyle.listItemSmallText]}>{data.company_name}</Text>
                            </View>
                        </View>
                        <View style={styles.stockListPriceBlock}>
                            <Text style={[styles.listItemPrice, this.state.themeStyle.listItemPrice,{marginRight:10,  }]} numberOfLines={1}>{globals.checkForFloatAndRound(data.last)}</Text>
                        </View>
                        {/* <View style={[styles.stockListChangeBlock,]}>
                            <Text style={[styles.listItemPriceRatePercentage, {
                                color: (data.change < 0) ? colors.redColor :
                                    (data.change == 0) ? ((this.state.tredingStatus == false) ? colors.white : colors.blackColor) : colors.greenColor
                            }]}>{globals.checkForFloatAndRound(data.change)}</Text>
                        </View> */}
                        {this.renderRateValue(data)}
                        {/* <View style={[styles.stockListPercentageBlockGreen, {
                            }]}>
                            <View style={[styles.marketRateValuesBGView, { 
                                backgroundColor: (data.per_change < 0) ? colors.lightRed : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.transparent : colors.transparent) : colors.lightGreen, 
                                }]}>
                            <Text style={[styles.listItemPriceRatePercentage, {
                                color: (data.per_change < 0) ? colors.redColor : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.white : colors.blackColor) : colors.greenColor,
                            }]}>{globals.checkForFloatAndRound(data.per_change) ? '' + globals.checkForFloatAndRound(data.per_change) + '%' : ''}</Text>
                            </View>
                        </View> */}
                    </View>
                </TouchableOpacity>
                <View style={[styles.horizontalSepratorListItem, this.state.themeStyle.horizontalSepratorListItem, styles.listItemSeprator]} />
            </Animated.View>
        );
    }

    // ********************** Render View method **********************
    render() {
        return (
            <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: this.state.tabBarColor }]}>
                <NavigationEvents
                    onDidFocus={payload => {
                        AsyncStorage.setItem(globals.currentNavigator, "Market");
                        globals.currentNavigatorValue = 'Market';
                    }}
                />
                <View style={[styles.mainRenderView, this.state.themeStyle.mainRenderView]}>
                    {this.renderStockSectionHeader()}
                    <View style={[styles.listViewMain]}>
                        {this.renderStockListView(this.state.tabId)}
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

// ********************** Model mapping method **********************
const mapStateToProps = (state, ownProps) => {
    return {
        register: state.showModal_red.register, Otp: state.showModal_red.Otp,
        loader: state.claneLoader_red.loader, theme: state.changeTheme_red.theme,
        color: state.changeTabColor_red.color, marketStatus: state.checkMarketStatus_red.marketStatus
    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    getshowModal,
    getshowLoader,
    changeTheme,
    changeTabColor,
    checkMarketStatus
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Markets);