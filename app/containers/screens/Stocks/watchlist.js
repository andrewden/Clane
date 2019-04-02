import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Platform,
    FlatList,
    AsyncStorage,
    ActivityIndicator,
    Image,
    Modal,
    LayoutAnimation,
    SafeAreaView,
    Alert
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import Button from '../../../components/Button';
import styles from './style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colors from '../../../assets/styles/color';
import * as globals from '../../../lib/globals';
import globalStyles from '../../../assets/styles/globalStyles';
import { API } from '../../../lib/api';
import { getshowLoader } from '../../../redux/actions/showLoaderModal';
import { changeTheme } from '../../../redux/actions/changeTheme';
import { changeTabColor } from '../../../redux/actions/changeTabColorModel';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import moment from 'moment';
import { getShowModalSearchBar } from '../../../redux/actions/showModalSearchBar';
import Entypo from 'react-native-vector-icons/Entypo';
import { NavigationEvents } from 'react-navigation';
import * as images from '../../../assets/images/map';
import { getshowModal } from '../../../redux/actions/showModal';
import StockDetail from '../Stocks/stockDetails';
import SwipableRows from '../Stocks/_SwipableRows';
import SearchBarScreen from '../Stocks/searchBarScreen';
import OpenSettings from 'react-native-open-settings';
import firebase from 'react-native-firebase';
import { RemoteMessage } from 'react-native-firebase';
import phoneOTP from '../Authentication/phoneOTP';

var themeStyle = null;
var _this = null;
let processing = false;

class WatchList extends Component {

    static navigationOptions = ({ navigation, screenProps, }) => {
        return {
            headerTitle: 'Portfolio',

            headerTitleStyle: [globalStyles.headerTitleStyle, { color: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.titleColor : colors.blackColor }],

            headerStyle: { backgroundColor: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.bgColor : colors.white, elevation: 0, shadowOpacity: 0, borderBottomWidth: 2, borderBottomColor: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.bottomSeprator : colors.categorySepViewLight, tintColor: colors.blackColor },

            gesturesEnabled: false,
            headerRight:
                (navigation.state.params != undefined && navigation.state.params != null && navigation.state.params.dataSource != null) ?
                    <TouchableOpacity onPress={() => _this.props.getShowModalSearchBar(true, globals.screenTitle_watchlist)}>
                        <Entypo name="plus" size={30} color={(navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.iconColor : colors.backLight} style={{ marginRight: 10 }} />
                    </TouchableOpacity> : null,
            headerLeft: null,
        }
    }

    constructor(props) {
        super(props);
        themeStyle = this.props.theme;
        _this = this
        this.state = {
            dataSource: [],
            footerString: '',
            tredingStatus: true,
            loading: true,
            isInternetAvailable: true,
            last_update: '',
            damping: 1 - 0.6,
            tension: 300,
            isAsyncDataGot: false,
            modalVisible: false,
            tabBarColor: props.color,
            isTimeout: false,
            isCached: false,
            sortingTypeCompany: 0,  // 0 - descending , 1 - accending
            sortingTypePrice: 0, // 0 - descending , 1 - accending
            sortingTypeChange: 0, // 0 - descending , 1 - accending
            sortingTypePercentange: 0 // 0 - descending, 1 - accending
        };
    }


    componentDidMount() {
        AsyncStorage.getItem(globals.fcm_token).then((value) => {
            globals.getFCMToken = value;
        });
        console.log("componentDidMount--> "+DeviceInfo.getModel());
        
        this.props.navigation.setParams({ bgColor: (this.props.marketStatus) ? colors.white : colors.blackThemeColor, titleColor: (this.props.marketStatus) ? colors.blackColor : colors.white, iconColor: (this.props.marketStatus) ? colors.blue : colors.white, dataSource: (this.state.dataSource != null) ? this.state.dataSource : [], bottomSeprator:(this.props.marketStatus) ? colors.categorySepViewLight : colors.darkThemeHeaderSeprator })
        this.setState({ tredingStatus: this.props.marketStatus, isInternetAvailable: globals.isInternetConnected })

        if (!globals.isInternetConnected) {
            var bools = globals.checkThemeInOfflineMode();
            this.setState({ tredingStatus: bools });
            if (bools) {
                globals.globalVars.statusBarColor = colors.blue
            } else {
                globals.globalVars.statusBarColor = colors.blackThemeColor
            }
        }

        if (globals.isWatchlistLoadedFirstTime && globals.isInternetConnected) {
            globals.isWatchlistLoadedFirstTime = false;
            processing = true;
            this.callWSToGetWatchlist(true);

        } else {
            processing = true;
            this.getTimeIntervalForWatchlist();
        }
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.marketStatus == false) {
            this.setState({ tredingStatus: false })
        } else {
            this.setState({ tredingStatus: true })
        }

        if (nextProps.color != undefined) {
            this.setState({
                tabBarColor: nextProps.color
            })
        }

        themeStyle = this.props.theme;
        this.setState({ modalVisible: nextProps.searchbar_modal })

        if (this.marketStatus !== nextProps.marketStatus) {
            this.marketStatus = nextProps.marketStatus
            this.props.navigation.setParams({ bgColor: (this.props.marketStatus) ? colors.white : colors.blackThemeColor, titleColor: (this.props.marketStatus) ? colors.blackColor : colors.white, iconColor: (this.props.marketStatus) ? colors.blue : colors.white, bottomSeprator:(this.props.marketStatus) ? colors.categorySepViewLight : colors.darkThemeHeaderSeprator })
        }

    }

    static _goToStockDetaill(data) {
        _this.props.navigation.navigate('StockDetails', data)
    }
    static renderWatchListData() {
        processing = true;
        _this.getTimeIntervalForWatchlist();
        globals.userAuthenticates = false;
    }

    static reloadData() {
        _this.callWSToGetWatchlist(true);
        globals.userAuthenticates = false;
    }

    static changeLoaderState() {
        _this.setState({ loading: true });
    }

    static openSearchModal() {
        _this.props.getShowModalSearchBar(true, globals.screenTitle_watchlist)
    }

    /**
     * Method for get time interval watchlist
     */
    getTimeIntervalForWatchlist() {
        this.setState({ loading: true }, () => {
            AsyncStorage.getItem(globals.watchlist_timeStamp, (err, result) => {
                this.setState({ loading: false }, () => {
                    if (result !== null) {
                        var diffMins = globals.getTimeDifference(result);
                        if (diffMins >= 15 && globals.isInternetConnected) {
                            this.callWSToGetWatchlist(true);
                        } else {
                            AsyncStorage.getItem(globals.watchlist_datasource, (err, result) => {
                                console.log('====================================')
                                console.log('watchlist ' + JSON.stringify(result))
                                console.log('====================================')
                                if (result !== null) {
                                    var responseData = JSON.parse(result);
                                    this.setState({isCached: true})
                                    if (responseData.sStatus == 1) {
                                        if (!globals.isInternetConnected) {
                                            this.setState({ tredingStatus: globals.checkThemeInOfflineMode() }, () => {
                                                this.formatListArrayData(responseData);
                                            });
                                        } else {
                                            this.formatListArrayData(responseData);
                                        }
                                    }

                                    AsyncStorage.getItem(globals.watchlist_added, (err, result) => {
                                        if (result !== null) {
                                            globals.watchlist_added_ary = JSON.parse(result);
                                        }
                                    });
                                } else {
                                    this.setState({ loading: false })
                                }
                            });
                        }
                    } else {
                        if (globals.isInternetConnected) {
                            this.setState({ isInternetAvailable: true, });
                            this.callWSToGetWatchlist(true);
                        } else {
                            this.setState({
                                dataSource: [],
                                loading: false,
                                footerString: globals.networkNotAvailable,
                                isInternetAvailable: false,
                            });
                            console.log("isInternetAvailable " + this.state.isInternetAvailable);
                        }
                    }
                });
            });
        });

    }

    /**
     * Method for get watchlist
     */
    callWSToGetWatchlist(loading) {
        console.log("callWSToGetWatchlist")
        if (globals.isLoggedIn == 'true') {
            this.setState({ loading: loading }, () => {
                API.watchlistData(this.responseData, false);
            });
        } else {
            processing = false;
            this.setState({ loading: false });
        }
    }

    /**
    * Method for get response of market status API
    */
    responseData = {
        success: (response) => {
            console.log("success ==")
            this.props.getshowLoader(false);
            try {
                AsyncStorage.setItem(globals.watchlist_timeStamp, new Date());
                AsyncStorage.setItem(globals.watchlist_datasource, JSON.stringify(response));
                this.formatListArrayData(response);
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
            } catch (error) {
                console.log('error ========== ' + error);
                this.props.getshowLoader(false);
            }
            processing = false;
        },
        error: (err) => {
            console.log("error ==")
            this.props.getshowLoader(false);
            AsyncStorage.getItem(globals.watchlist_datasource, (err, result) => {
                this.setState({ loading: false, isCached: true }, () => {
                    // alert('23424')
                    if (result !== null) {
                        var responseData = JSON.parse(result);
                        if (responseData.sStatus == 1) {
                            if (!globals.isInternetConnected) {
                                this.setState({ tredingStatus: globals.checkThemeInOfflineMode() });
                            }
                            this.formatListArrayData(responseData);
                        }
                        AsyncStorage.getItem(globals.watchlist_added, (err, result) => {
                            if (result !== null) {
                                globals.watchlist_added_ary = JSON.parse(result);
                            }
                        });
                    } else {
                        this.setState({
                            dataSource: [],
                            loading: false,
                            footerString: globals.timeoutMessage,
                        });
                    }
                })
            });
        },
        complete: () => {
            console.log("complete ==")
            this.props.getshowLoader(false);
        }
    }

    /**
     * Method for render data in listing
     * @param {*} responseData 
     */
    formatListArrayData(responseData) {
        if (responseData.sStatus == 1) {
            if (responseData.sData.length == 0) {
                this.setState({
                    dataSource: [],
                    loading: false,
                    footerString: '',
                }, () => {
                    this.props.navigation.setParams({ dataSource: [] })
                    processing = false;
                })

            } else {
                this.setState({
                    dataSource: [...responseData.sData.watchlist_data],
                    loading: false,
                    footerString: '',
                    last_update: responseData.sData.last_updated_date
                }, () => {
                    this.props.navigation.setParams({ dataSource: this.state.dataSource })
                    processing = false;
                })
            }
        }
        else if (responseData.sStatus == 0) {
            this.setState({
                dataSource: [...responseData.sData.watchlist_data],
                loading: false,
                last_update: responseData.sData.last_updated_date
            }, () => {
                this.props.navigation.setParams({ dataSource: this.state.dataSource })
            });
        }
    }


    componentWillUnmount() {
        if (globals.userAuthenticates) {
            this.messageListener();
        }
    }

    /**
     * Method for open setting of mobile app
     */
    openPushSettings() {
        OpenSettings.openSettings();
    }


    /**
     * Method for add button press for wathclist
     */
    btnAddStockPressed() {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    globals.getFCMTokens()
                    globals.globalVars.isPushTokenPermissionDone = true;
                    this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
                        console.log("DATAAAA", message);
                        console.log("DATA SECret " + message._data.secret);
                        globals.Pushsecret = message._data.secret;
                    });
                    if (globals.isLoggedIn == 'false') {
                        if (globals.isInternetConnected) {
                            globals.globalVars.dashboardTitle = globals.screenTitle_watchlist
                            this.checkLogin();
                        } else {
                            Alert.alert(globals.APP_NAME, globals.networkNotAvailable);
                        }

                    }
                    else {
                        _this.props.getShowModalSearchBar(true, globals.screenTitle_watchlist)
                    }
                    globals.userAuthenticates = false


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
            });
    }

    /**
     * Method for delete wathclist
     */
    btnDeletePressed(str_stockID, rowIndex) {
        if (globals.isInternetConnected) {
            if (globals.isLoggedIn == 'true') {

                let ary = []
                if (this.state.dataSource != null) {
                    ary = this.state.dataSource
                    if (ary.length > 0) {
                        ary.map((item, index) => {
                            if (str_stockID == item.stock_id) {
                                ary.splice(index, 1);
                            }
                        });
                    }
                }
                console.log('ary == ' + JSON.stringify(ary));
                LayoutAnimation.configureNext({
                    duration: 150,
                    create: {
                        type: LayoutAnimation.Types.easeInEaseOut,
                        property: LayoutAnimation.Properties.opacity
                    },
                    update: {
                        type: LayoutAnimation.Types.easeInEaseOut,
                    },
                    delete: {
                        type: LayoutAnimation.Types.easeInEaseOut,
                        property: LayoutAnimation.Properties.opacity,
                    },
                });
                this.setState({ dataSource: ary, loading: false, footerString: '', }, () => {
                    this.props.navigation.setParams({ dataSource: this.state.dataSource })
                })
                var data = {
                    stock_id: str_stockID
                };
                API.watchlistDeleteItem(_this.responseDataDeleteWatch, data, false);
            }
        } else {
            Alert.alert(globals.APP_NAME, globals.networkNotAvailable);
        }
    }

    /**
    * Method for get response of market status API
    */
    responseDataDeleteWatch = {
        success: (response) => {
            console.log('responseDataDeleteWatch ====================================');
            console.log(JSON.stringify(response));
            console.log('====================================');
            try {
                var ary = []
                var tempArray = []
                if (this.state.dataSource != null) {
                    let watchlist_data = this.state.dataSource;
                    ary = watchlist_data
                    if (ary.length > 0) {
                        ary.map((item, index) => {
                            tempArray.push(item.stock_id)
                        });
                    }
                }
                AsyncStorage.setItem(globals.watchlist_added, JSON.stringify(tempArray));
                globals.watchlist_added_ary = tempArray
                StockDetail.changeHaderAfterWishlistLoaded()
                AsyncStorage.getItem(globals.watchlist_datasource, (err, result) => {
                    if (result !== null) {
                        var responseData = JSON.parse(result);
                        if (Object.keys(responseData.sData).length != 0) {
                            responseData.sData['watchlist_data'] = this.state.dataSource
                            AsyncStorage.setItem(globals.watchlist_datasource, JSON.stringify(responseData));
                        }
                    }
                });
            } catch (error) {
                _this.props.getshowLoader(false);
            }
        },
        error: (err) => {
            _this.props.getshowLoader(false);
            if (err == globals.timeoutErrorCheck) {
                Alert.alert(globals.APP_NAME, globals.timeoutMessage)
            } else {
                Alert.alert(globals.APP_NAME, err.sMessage);
            }
            AsyncStorage.getItem(globals.watchlist_datasource, (err, result) => {
                if (result !== null) {
                    var responseData = JSON.parse(result);
                    if (responseData.sStatus == 1) {
                        if (!globals.isInternetConnected) {
                            this.setState({ tredingStatus: globals.checkThemeInOfflineMode() });
                        }
                        this.formatListArrayData(responseData);
                    }
                    AsyncStorage.getItem(globals.watchlist_added, (err, result) => {
                        if (result !== null) {
                            globals.watchlist_added_ary = JSON.parse(result);
                        }
                    });
                } else {
                    this.setState({
                        dataSource: [],
                        loading: false,
                        footerString: globals.timeoutMessage,
                        // isInternetAvailable: false,
                    });
                }
            });
        },
        complete: () => {
            _this.props.getshowLoader(false);
        }
    }

    /**
    * Method for check user already login or not
    */
    checkLogin() {
        this.props.navigation.navigate("ModalNavigator")
    }

    /**
     * Method for render footer 
     */
    renderWatchlistFooter = () => {
        if (this.state.loading == true) {
            return (
                <View style={[styles.watchlistFooterMain, themeStyle.trendingFooterMain]}>
                    <ActivityIndicator size="large" color={(this.state.tredingStatus == globals.marketStatusClose ? colors.white : colors.blackThemeColor)} />
                </View>
            )
        } else if (this.state.dataSource == null) {
            return (
                <View style={[styles.watchlistFooterMain, themeStyle.trendingFooterMain]}>
                    <View style={styles.noInternetTextView}>
                        <Text style={[styles.trendingFooterText, themeStyle.trendingFooterText, { marginTop: 45 }]}>{this.state.footerString}
                        </Text>
                    </View>
                    {
                        (this.state.isInternetAvailable == false) ?
                            <View style={styles.tryAgainButtonView}>
                                <Button
                                    onPress={() => this.getTimeIntervalForWatchlist()}
                                    textStyle={[styles.buttonText, themeStyle.buttonText]}
                                    buttonStyles={[styles.buttonStyles, themeStyle.buttonStyles]}
                                    text={globals.tryAgain}></Button>
                            </View>
                            : null
                    }
                </View>
            )
        }
        else {
            return (
                null
            )
        }
    }

    /**
     * Method for render seprator
     */
    renderSeparator() {
        return <View style={[{ height: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1, marginHorizontal: 15 }, themeStyle.horizontalSepratorListItem]}></View>
    }

    onRowClicked(data) {
        SwipableRows.onRowClicked();
        globals.currentNavigatorValue = "WatchList";
        AsyncStorage.setItem(globals.currentNavigator, "Watchlist");
        _this.props.navigation.navigate('StockDetails', { theme: themeStyle, stock_id: data.stock_id, symbol: data.symbol })
    }

    convert(timestamp) {
        var date = new Date(                          // Convert to date
            parseInt(                                   // Convert to integer
                timestamp                   // Take only the part right of the "("
            )
        );
        return [
            ("0" + date.getDate()).slice(-2),           // Get day and pad it with zeroes
            ("0" + (date.getMonth() + 1)).slice(-2),      // Get month and pad it with zeroes
            date.getFullYear()                          // Get full year
        ].join('/');                                  // Glue the pieces together
    }


    getFormattedDate(timestamp) {
        let formatDate = null;
        var d = new Date(timestamp * 1000);
        formatDate = moment(d).format("DD/MM/YYYY")
        return formatDate;
    }

    renderRateValue(data) {
        console.log("data.date ==> " + data.date);

        if (this.props.marketStatus) {
            return (
                <View>
                    <View style={[styles.stockListPercentageBlockGreen, { width: "100%" }, {
                    }]}>
                        <View style={{
                            width: '85%', flex: 1, justifyContent: 'center', alignItems: 'center',
                            backgroundColor: (data.per_change < 0) ? colors.lightRed : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.transparent : colors.transparent) : colors.lightGreen, marginHorizontal: 5,
                        }}>
                            <Text style={[styles.listItemPriceRatePercentage, {
                                color: (data.per_change < 0) ? colors.redColor : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.white : colors.blackColor) : colors.greenColor,
                                // backgroundColor: (data.per_change < 0) ? colors.lightRed : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.transparent : colors.transparent) : colors.lightGreen, marginHorizontal: 5,
                            }]}>{globals.checkForFloatAndRound(data.per_change) ? '' + globals.checkForFloatAndRound(data.per_change) + '%' : ''}</Text>
                        </View>

                    </View>
                    <Text style={[styles.addedWatchList, themeStyle.addedWatchList]}>{'Added'} {this.getFormattedDate(data.created_at)}</Text>

                </View>)
        } else {
            return (
                <View>
                    <View style={[styles.stockListPercentageBlockGreen, {
                    }]}>
                        <View style={{
                            width: '85%', flex: 1, justifyContent: 'center', alignItems: 'center',
                            backgroundColor: (data.per_change < 0) ? colors.darkRed : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.transparent : colors.transparent) : colors.darkGreen, marginHorizontal: 5,
                        }}>
                            <Text style={[styles.listItemPriceRatePercentage, {
                                color: (data.per_change < 0) ? colors.darkDownStockTextColor : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.white : colors.blackColor) : colors.darkUpStockTextColor,
                                // backgroundColor: (data.per_change < 0) ? colors.lightRed : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.transparent : colors.transparent) : colors.lightGreen, marginHorizontal: 5,
                            }]}>{globals.checkForFloatAndRound(data.per_change) ? '' + globals.checkForFloatAndRound(data.per_change) + '%' : ''}</Text>

                        </View>
                        {/* <Text style={[styles.addedWatchList,  themeStyle.addedWatchList]}>{'Added'} {moment(data.date).format("DD/MM/YYYY")}</Text> */}

                    </View>
                    <Text style={[styles.addedWatchList, themeStyle.addedWatchList]}>{'Added'} {this.getFormattedDate(data.created_at)}</Text>

                    {/* <Text style={[styles.addedWatchList,  themeStyle.addedWatchList]}>{'Added'} {moment(data.date).format("DD/MM/YYYY")}</Text> */}
                </View>)
        }
    }

    /**
     * Method for render Watchlist list
     * @param {*} resData 
     * @param {*} index 
     */
    renderWatchlistList(resData, index) {
        var data = resData.item;

        return (
            <View style={[styles.stockListMain, { paddingLeft: 0, paddingRight: 0 }, themeStyle.stockListMain]}>
                <SwipableRows damping={this.state.damping} tension={this.state.tension} btnDeletePressed={this.btnDeletePressed.bind(this)} stock_id={data.stock_id} rowIndex={index} themeColor={(this.props.marketStatus) ? colors.white : colors.blackThemeColor}>
                    <TouchableOpacity onPress={() => _this.onRowClicked(data)}>
                        <View style={[{ flex: 1, paddingLeft: 10, paddingRight: 15 }, themeStyle.listItemMainView]}>
                            <View style={[styles.listItemMainView, themeStyle.listItemMainView]}>
                                <View style={styles.stockListNameMainBlock}>
                                    <View style={styles.column}>
                                        <View style={styles.stockListNameMainBlockOrientationChild}>
                                            <Text numberOfLines={1} style={[styles.listItemTitle, themeStyle.listItemTitle]}>{data.symbol}</Text>
                                        </View>
                                        <Text numberOfLines={1} style={[styles.listItemSmallText, themeStyle.listItemSmallText]}>{data.company_name}</Text>
                                    </View>
                                </View>
                                <View style={[styles.stockListPriceBlock, { marginTop: 0 }]}>
                                    <Text numberOfLines={1} style={[styles.listItemPrice, themeStyle.listItemPrice, { marginRight: (globals.iPhoneX) ? 8 : (DeviceInfo.getModel() == 'iPhone SE') ? 0 : 10, }]}>{globals.checkForFloatAndRound(data.last)}</Text>
                                </View>
                                {/* <View style={styles.stockListChangeBlock}>
                                    <Text style={[styles.listItemPriceRatePercentage, {
                                        color: (data.change < 0) ? colors.redColor :
                                            (data.change == 0) ? ((this.props.marketStatus == true) ? colors.blackColor : colors.white) : colors.greenColor
                                    }]}>{globals.checkForFloatAndRound(data.change)} </Text>
                                </View> */}
                                {/* <View style={styles.stockListPercentageBlock}>
                                    <Text style={[styles.listItemPriceRatePercentage, {
                                        color: (data.per_change < 0) ? colors.redColor : (data.per_change == 0) ? ((this.props.marketStatus == true) ? colors.blackColor : colors.white) : colors.greenColor
                                    }]}>{globals.checkForFloatAndRound(data.per_change) ? '(' + globals.checkForFloatAndRound(data.per_change) + '%)' : ''}</Text>
                                </View> */}
                                {this.renderRateValue(data)}
                                {/* <View style={[styles.stockListPercentageBlockGreen, {
                                }]}>
                                    <View style={{
                                        width: '85%', flex: 1, justifyContent: 'center', alignItems: 'center',
                                        backgroundColor: (data.per_change < 0) ? colors.lightRed : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.transparent : colors.transparent) : colors.lightGreen, marginHorizontal: 5,
                                    }}>
                                        <Text style={[styles.listItemPriceRatePercentage, {
                                            color: (data.per_change < 0) ? colors.redColor : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.white : colors.blackColor) : colors.greenColor,
                                            // backgroundColor: (data.per_change < 0) ? colors.lightRed : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.transparent : colors.transparent) : colors.lightGreen, marginHorizontal: 5,
                                        }]}>{globals.checkForFloatAndRound(data.per_change) ? '' + globals.checkForFloatAndRound(data.per_change) + '%' : ''}</Text>
                                    </View>
                                </View> */}
                            </View>
                        </View>
                    </TouchableOpacity>
                </SwipableRows>
                <View style={[styles.horizontalSepratorListItem, themeStyle.horizontalSepratorListItem, styles.listItemSeprator]} />
            </View>
        )
    }

    handleCloseModal() {
        _this.props.getShowModalSearchBar(false, globals.screenTitle_watchlist)
        this.setState({ modalVisible: false })
    }
    searchModal() {
        return (
            <Modal animationType='fade' visible={this.state.modalVisible} onRequestClose={() => { this.handleCloseModal() }}>
                <SearchBarScreen />
            </Modal>
        )
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
                this.state.dataSource.sort((a, b) => b.symbol.localeCompare(a.symbol))
                this.setState({ dataSource: this.state.dataSource }, () => this.forceUpdate())
            }
            else {
                this.state.dataSource.sort((a, b) => a.symbol.localeCompare(b.symbol))
                this.setState({ dataSource: this.state.dataSource }, () => this.forceUpdate())
            }
        }
        else if (id == '2') {
            if (this.state.sortingTypePrice == 0) {
                this.state.dataSource.sort((a, b) => b.last - a.last);
                this.setState({ dataSource: this.state.dataSource }, () => this.forceUpdate())
            }
            else {
                this.state.dataSource.sort((a, b) => a.last - b.last);
                this.setState({ dataSource: this.state.dataSource }, () => this.forceUpdate())
            }
        }
        else if (id == '3') {
            if (this.state.sortingTypeChange == 0) {
                this.state.dataSource.sort((a, b) => b.change - a.change)
                this.setState({ dataSource: this.state.dataSource }, () => this.forceUpdate())
            }
            else {
                this.state.dataSource.sort((a, b) => a.change - b.change)
                this.setState({ dataSource: this.state.dataSource }, () => this.forceUpdate())
            }
        }
        else if (id == '4') {
            if (this.state.sortingTypePercentange == 0) {
                this.state.dataSource.sort((a, b) => b.per_change - a.per_change)
                this.setState({ dataSource: this.state.dataSource }, () => this.forceUpdate())
            }
            else {
                this.state.dataSource.sort((a, b) => a.per_change - b.per_change)
                this.setState({ dataSource: this.state.dataSource }, () => this.forceUpdate())
            }
        }
        else { }
    }

    btnTryAgainPressed(){
        if (globals.isInternetConnected) {
            processing = true;
            _this.getTimeIntervalForWatchlist();
        // globals.userAuthenticates = false;
        }
    }
    /**
     * Method for render main
     */

    render() {
        console.log("render")
        if (!globals.isInternetConnected && !this.state.isCached) {
            return(
            <View style={[styles.watchlistFooterMain, { marginBottom: 44, backgroundColor: colors.white },]}>
            <View style={styles.noInternetTextView}>
              <Text style={[styles.trendingFooterText, { color: colors.blackThemeColor }]}>{globals.networkNotAvailable}
              </Text>
            </View>
            <View style={styles.tryAgainButtonView}>
              <Button
                onPress={() => this.btnTryAgainPressed()}
                textStyle={[styles.buttonText, { color: colors.white, }]}
                buttonStyles={[styles.buttonStyles, { borderColor: colors.blue, backgroundColor: colors.blue, }]}
                text={globals.tryAgain}></Button>
            </View>
          </View>)
        }else {
            if (!this.state.loading) {
                let lastUpdate = <Text />;
                if (this.state.last_update != '') {
                    lastUpdate = <Text style={[styles.lastUpdated, themeStyle.lastUpdated]}>Last updated:{"\n"}{moment.unix(this.state.last_update).format('D MMM, h:mm A')}</Text>
                }
    
                console.log("processing : " + processing);
                console.log("this.state.dataSource =>" + JSON.stringify(this.state.dataSource));
    
                return (
                    <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: this.state.tabBarColor }]}>
                        <NavigationEvents
                            onDidFocus={payload => {
                                AsyncStorage.setItem(globals.currentNavigator, "Watchlist");
                            }}
                        />
    
                        <View style={[styles.searchScreenItemLeftView, themeStyle.mainView]}>
                            {this.searchModal()}
    
                            {(this.state.dataSource != null) ? (this.state.dataSource.length > 0) ? <View style={[styles.headingContainer, themeStyle.trendingSection]}>
                                <Text style={[styles.trendingTitle, themeStyle.trendingTitle]}>Watchlist</Text>
                                {lastUpdate}
                            </View> : null : null}
    
                            {(this.state.dataSource != null) ? (this.state.dataSource.length > 0) ? <View style={[styles.stockListMain, { height: 25 }, themeStyle.trendingSection]}>
                                <View style={[styles.listItemMainView, { paddingTop: 0, paddingBottom: 0 }]}>
                                    <View style={[styles.listItemMainView, { paddingTop: 0, paddingBottom: 0 }]}>
                                    <TouchableOpacity style={[styles.stockListNameMainBlock, { alignItems: 'flex-start' }]} onPress={() => this.sortData('1')}>
                                <View style={[styles.stockListNameMainBlock, {  alignItems: 'flex-start', }]}>
                                    <Text numberOfLines={1} style={[styles.listHeaderTagText, {marginLeft:-5},themeStyle.listHeaderTagText]}>Company</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={() => this.sortData('2')}>
                                <View style={[styles.stockListPriceBlock, { flex: 1,  marginTop:0, marginRight:2  }]}>
                                    <Text numberOfLines={1} style={[styles.listHeaderTagText, {marginRight: (Platform.OS) == 'android'? 0 : (DeviceInfo.getModel() == 'iPhone 6 Plus')? -12 :  (DeviceInfo.getModel() == 'iPhone 5s')?15:0},themeStyle.listHeaderTagText, ]}>Price</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.stockListPercentageBlockGreenHeader, { backgroundColor: colors.transparent, margingHorizontal: 0, padding: 0 }]} onPress={() => this.sortData('4')}>
                                <View style={[styles.stockListPercentageBlockGreenHeader, {marginLeft :10, backgroundColor: colors.transparent, flex: 1, margingHorizontal: 0, }]}>
                                    <Text numberOfLines={1} style={[styles.listHeaderTagText, {marginRight: (Platform.OS == 'android') ? 0 :(DeviceInfo.getModel() == 'iPhone 6 Plus') ? -15 : 0},themeStyle.listHeaderTagText]}>Rate %</Text>
                                </View>
                            </TouchableOpacity>
                                    </View>
    
                                </View>
                            </View> : null : null}
                            <View style={[styles.horizontalSeprator, themeStyle.horizontalSeprator]} />
    
                            {(this.state.dataSource != null) ? (this.state.dataSource.length > 0) ? <View style={[{ borderBottomWidth: 0.2, borderBottomColor: colors.watchlistSep },]} /> : null : null}
    
                            {(this.state.dataSource != null) ? (this.state.dataSource.length > 0) ? <FlatList
                                style={[styles.indicesDetailFlatlistView, { backgroundColor: (this.state.tredingStatus) ? colors.white : colors.blackThemeColor }]}
                                ref={"watchlistFlatListView"}
                                renderItem={(rowData, rowID) => this.renderWatchlistList(rowData, rowID)}
                                data={this.state.dataSource}
                                ListFooterComponent={this.renderWatchlistFooter}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}
                            // ItemSeparatorComponent={this.renderSeparator}
                            /> : null : null}
    
                            {(this.state.dataSource != null) ? (this.state.dataSource.length == 0 && !processing) ? <View style={styles.upperArea}>
                                <Image source={images.stock.chart_line} style={styles.chartLogo}></Image>
                                <Text style={[styles.noStockText, themeStyle.noStockText]}>{globals.noStocks}</Text>
                                <Text style={[styles.emptyText, themeStyle.emptyText]}>{globals.watchlistEmpty}</Text>
                            </View > : null : null}
                            {(this.state.dataSource != null) ? (this.state.dataSource.length == 0 && !processing) ? <View style={styles.bottomArea}>
                                <Button
                                    onPress={() => this.btnAddStockPressed()}
                                    textStyle={[styles.buttonText, themeStyle.buttonText]}
                                    buttonStyles={[styles.buttonStyles, styles.bottomButtonStyles, themeStyle.buttonStyles]}
                                    text={globals.addStock}></Button>
                            </View> : null : null}
    
                        </View>
                    </SafeAreaView>
    
                )
    
                // if (this.state.dataSource.length == 0 && this.state.loading == false) {
                //     return (
                //         <SafeAreaView style={globalStyles.safeviewStyle}>
                //         <NavigationEvents
                //                     onDidFocus={payload => {
                //                         AsyncStorage.setItem(globals.currentNavigator,"Watchlist");
                //                         globals.currentNavigatorValue = 'Watchlist';
                //                     }}
                //                 />
                //             <View style={[styles.mainView, themeStyle.mainView]}>
    
                //                 {this.searchModal()}
                //                 <View style={styles.upperArea}>
                //                     <Image source={images.stock.chart_line} style={styles.chartLogo}></Image>
                //                     <Text style={[styles.noStockText, themeStyle.noStockText]}>{globals.noStocks}</Text>
                //                     <Text style={[styles.emptyText, themeStyle.emptyText]}>{globals.watchlistEmpty}</Text>
                //                 </View >
                //                 <View style={styles.bottomArea}>
                //                     <Button
                //                         onPress={() => this.btnAddStockPressed()}
                //                         textStyle={[styles.buttonText, themeStyle.buttonText]}
                //                         buttonStyles={[styles.buttonStyles, styles.bottomButtonStyles, themeStyle.buttonStyles]}
                //                         text={globals.addStock}></Button>
                //                 </View>
                //             </View >
                //         </SafeAreaView>
                //     )
                // } else {
                //     return (
                //         <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: this.state.tabBarColor }]}>
                //         <NavigationEvents
                //                     onDidFocus={payload => {
                //                         AsyncStorage.setItem(globals.currentNavigator,"Watchlist");
                //                     }}
                //                 />
                //             <View style={[styles.searchScreenItemLeftView, themeStyle.mainView]}>
                //                 {this.searchModal()}
                //                 <View style={[styles.headingContainer, themeStyle.trendingSection]}>
                //                     <Text style={[styles.trendingTitle, themeStyle.trendingTitle]}>Watchlist</Text>
                //                     {lastUpdate}
                //                 </View>
    
                //                 <View style={[styles.stockListMain, { height: 25 }, themeStyle.trendingSection]}>
                //                     <View style={[styles.listItemMainView, { paddingTop: 0, paddingBottom: 0 }]}>
                //                         <View style={[styles.stockListNameMainBlock, { alignItems: 'flex-start' }]}>
                //                             <Text numberOfLines={1} style={[styles.listHeaderTagText, themeStyle.listHeaderTagText]}>Company</Text>
                //                         </View>
                //                         <View style={[styles.stockListPriceBlock,]}>
                //                             <Text numberOfLines={1} style={[styles.listHeaderTagText, themeStyle.listHeaderTagText]}>Price</Text>
                //                         </View>
                //                         <View style={styles.stockListChangeBlock}>
                //                             <Text numberOfLines={1} style={[styles.listHeaderTagText, themeStyle.listHeaderTagText]}>Change</Text>
                //                         </View>
                //                         <View style={styles.stockListPercentageBlock}>
                //                             <Text numberOfLines={1} style={[styles.listHeaderTagText, themeStyle.listHeaderTagText]}>%</Text>
                //                         </View>
                //                     </View>
                //                 </View>
    
                //                 <View style={[styles.horizontalSeprator, themeStyle.horizontalSeprator]} />
    
                //                 <FlatList
                //                     style={[styles.indicesDetailFlatlistView, {backgroundColor:'white'}]}
                //                     ref={"watchlistFlatListView"}
                //                     renderItem={(rowData, rowID) => this.renderWatchlistList(rowData, rowID)}
                //                     data={this.state.dataSource}
                //                     ListFooterComponent={this.renderWatchlistFooter}
                //                     keyExtractor={(item, index) => index.toString()}
                //                     extraData={this.state}
                //                     ItemSeparatorComponent={this.renderSeparator}
                //                 />
                //             </View>
                //         </SafeAreaView>
                //     )
                // }
            } else {
                return <View style={[styles.watchlistFooterMain, themeStyle.trendingFooterMain]}>
                    <ActivityIndicator size="large" color={(this.state.tredingStatus == globals.marketStatusClose ? colors.white : colors.blackThemeColor)} />
                </View>
            }
        }
        
    }
}

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
    return {
        register: state.showModal_red.register,
        Otp: state.showModal_red.Otp,
        loader: state.claneLoader_red.loader,
        theme: state.changeTheme_red.theme,
        marketStatus: state.checkMarketStatus_red.marketStatus,
        searchbar_modal: state.showModalSearchBar_red.searchbar_modal,
        color: state.changeTabColor_red.color,
    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    getshowLoader,
    changeTheme,
    changeTabColor,
    checkMarketStatus,
    getShowModalSearchBar,
    getshowModal,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(WatchList);