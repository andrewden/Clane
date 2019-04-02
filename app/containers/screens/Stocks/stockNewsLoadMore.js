import React, { Component } from 'react';
import {
    StatusBar,
    View,
    TouchableOpacity,
    Text,
    Platform,
    AsyncStorage,
    ActivityIndicator,
    SafeAreaView,
    Image,
    FlatList, Modal
} from 'react-native';
import Countly from 'countly-sdk-react-native';
import Button from '../../../components/Button';
import { HeaderBackButton } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import globalStyles from '../../../assets/styles/globalStyles';
import { changeTheme } from '../../../redux/actions/changeTheme';
import { changeTabColor } from '../../../redux/actions/changeTabColorModel';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import { getshowLoader } from "../../../redux/actions/showLoaderModal";
import { stock } from '../../../assets/images/map'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import { getShowAndroidModal } from '../../../redux/actions/showAndroidWebViewModal';

// import NewsAndroidWebview from './newsAndroidWebview';
import NewsArticleWebView from '../InitialStock/NewsArticleWebView';

import styles from './style';
import { API } from '../../../lib/api';
import moment from 'moment';
import { getshowModal } from '../../../redux/actions/showModal';
import firebase from 'react-native-firebase';
import SafariView from 'react-native-safari-view';

var themeStyle = null;
var _this = null;
var str_stockID = '';
var symbol = null;

this.marketStatus = null
class StockNewsLoadMore extends Component {

    static navigationOptions = ({ navigation, screenProps, }) => {
        const { state } = navigation;
        return {
            headerLeft: null,
            header:
                <View style={[styles.headerStyle, { backgroundColor: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.bgColor : colors.white }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <HeaderBackButton onPress={() => navigation.goBack(null)} title='' tintColor={(navigation.state.params != undefined && navigation.state.params != null)  ? navigation.state.params.backIconColor : colors.backLight} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleView}>
                         
                        <Text style={[styles.headertitleText,{color:(navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.titleColor : colors.blackColor}]}>{navigation.state.params.headerTitle}</Text>
                        {(navigation.state.params.changeValue != null && (navigation.state.params.changeValue != 0)) ?
                            <FontAwesomeIcon size={15} name={(navigation.state.params.changeValue < 0) ? "caret-down" : "caret-up"} color={(navigation.state.params.changeValue < 0) ? colors.redColor : colors.greenColor} style={{ marginTop: 3, marginLeft: 3 }} />
                            : null}
                    </View>
                    <View style={{ flex: 0.2 }} />
                </View>
        }
    }

    constructor(props) {
        super(props);

        console.log("themeStyle-->", JSON.stringify(themeStyle))
        this.state = {
            data: null,
            footerLoading: false,
            isInternetAvailable: true,
            isWatch: false,
            page: 1,
            newsdata: [],
            totalItem: 0,
            isPaginationEnd: false,
            enableScrollViewScroll: true,
            isStockCached: false,
            isDragFirstTime: false,
            themeStyle: props.theme,
            modalVisible: false,
            isTimeout: false,
            loading: true
        };
        _this = this
    }

    getInitialize() {
        str_stockID = _this.props.navigation.state.params.stock_id;
        symbol = _this.props.navigation.state.params.symbol;
        console.log("SYMBOL DEATIL " + str_stockID);

        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(globals.globalVars.statusBarColor, true);
        }else{
            let showSubscription = SafariView.addEventListener(
                "onShow",
                () => {
                    StatusBar.setBarStyle("dark-content");
                }
            );
            let dismissSubscription = SafariView.addEventListener(
                "onDismiss",
                () => {
                    if (this.props.marketStatus) {
                        StatusBar.setBarStyle("dark-content");
                    }else{
                        StatusBar.setBarStyle("light-content");
                    }
                   
                }
            );
        }
        this.getTimeIntervalForStockNews();
    }

    componentDidMount() {
        var event = { "key": globals.event_StockNewsShowMore, "count": 1 };
        event.segmentation =  globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
        Countly.recordEvent(event);
        console.log("=====segmentation record event globals.event_StockNewsShowMore, result=> ");

        firebase.analytics().logEvent(globals.event_StockNewsShowMore, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
        console.log('====================================');
        console.log("globals.marketStatusClose " + globals.marketStatusClose);
        console.log('====================================');
        // if (Platform.OS == 'ios') {
        //     globals.setStatusBarForSafariView();
        // }
        this.getInitialize()
        this.marketStatus = this.props.marketStatus
        this.props.navigation.setParams({ bgColor: (this.props.marketStatus) ? colors.white : colors.blackThemeColor , titleColor:(this.props.marketStatus) ? colors.blackThemeColor : colors.white, backIconColor: (this.props.marketStatus) ? colors.backLight : colors.white,
        titleColor:(this.props.marketStatus)? colors.blackColor : colors.white})
    }

    componentWillReceiveProps(newProps) {
        if (newProps.theme != undefined) {
            this.setState({
                themeStyle: newProps.theme
            })
        }
        if (newProps.marketStatus != undefined) {
            console.log("this.marketStatus " + this.marketStatus);
            console.log("newProps.marketStatus " + newProps.marketStatus);

            if (this.marketStatus !== newProps.marketStatus) {
                this.marketStatus = newProps.marketStatus
                console.log("newProps.marketStatus " + newProps.marketStatus);
                this.props.navigation.setParams({ bgColor: (newProps.marketStatus) ? colors.white : colors.blackThemeColor,titleColor:(this.props.marketStatus) ? colors.blackThemeColor : colors.white, backIconColor: (this.props.marketStatus) ? colors.backLight : colors.white,titleColor:(this.props.marketStatus)? colors.blackColor : colors.white })
            }
        }
    }

    componentWillUnmount() {
        isMounted = false;
    }

    stockNews() {
        this.setState({ loading: true })
        var query = "?symbol=" + symbol
        API.marketNews(this.responseNewsData, query, this.state.page, false);
    }

    responseNewsData = {
        success: (response) => {

            console.log("NEWS RESPONSE " + JSON.stringify(response));
            total = response.total;
            this.setState({
                newsdata: this.state.page === 1 ? response.articles : [...this.state.newsdata, ...response.articles],
                error: response.error || null,
                loading: false,
                refreshing: false,
                mainLoader: false
            },()=>{
                try {
                AsyncStorage.setItem(globals.market_news_timeStamp + str_stockID, new Date());
                AsyncStorage.setItem(globals.market_async_news + str_stockID, JSON.stringify(allData));
            } catch (error) {
            }
            });

            // this.setState({ totalItem: response.total, loading: false })
            // var oldData = this.state.newsdata
            // var newData = response.articles
            // var allData = [...oldData, ...newData]
            // if (response.articles.length <= 0) {
            //     _this.setState({ isPaginationEnd: true, footerLoading: false })
            // }
            // else {
            //     allData = [...this.state.newsdata, ...response.articles],
            //         this.setState({ newsdata: allData, })
            // }
            // try {
            //     AsyncStorage.setItem(globals.market_news_timeStamp + str_stockID, new Date());
            //     AsyncStorage.setItem(globals.market_async_news + str_stockID, JSON.stringify(allData));
            // } catch (error) {
            // }
        },
        error: (err) => {
            _this.setState({ footerLoading: false, isTimeout: true, }, () => {
                this.getTimeIntervalForStockNews()
            })

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
                    this.setState({ isStockCached: false })
                    this.stockNews();
                    console.log("newss >15");

                } else {
                    AsyncStorage.getItem(globals.market_async_news + str_stockID, (err, result) => {
                        if (result !== null) {
                            console.log("newss market_async_news");
                            var responseData = JSON.parse(result);
                            console.log("responseData NewsLOCAL " + JSON.stringify(responseData));
                            this.setState({ isStockCached: true, loading: false })

                            var allData = responseData;
                            console.log("responseData allData " + allData);
                            this.setState({ newsdata: allData, })
                        }
                    });
                }
            } else {
                if (globals.isInternetConnected) {
                    this.setState({ isInternetAvailable: true, isStockCached: false, loading: true, isTimeout: false });
                    this.stockNews();
                } else {
                    this.setState({
                        dataSourceGainer: [],
                        footerString: globals.networkNotAvailable,
                        isInternetAvailable: false,
                    });
                    console.log("isInternetAvailable " + this.state.isInternetAvailable);
                }
            }
        });
    }

    renderFooter = () => {
        return (
            (this.state.newsdata.length > 0 && !this.state.isPaginationEnd) ?
                <View style={styles.loadmoreView}>
                    <Image source={stock.load_more} style={[styles.loadmore]} />
                    <Text style={[styles.loadmoreTextView, this.state.themeStyle.loadmoreTextView]}>{globals.swipeLoadMore}</Text>
                </View> : null
        )
    };


    handleLoadMore = () => {
        if (this.state.newsdata.length != total && !this.state.isStockCached ) {
            this.setState(
                {
                    page: this.state.page + 1
                },
                () => {
                    // this.makeRemoteRequest()
                    this.setState({loading : true})
                    API.marketNews(this.responseNewsData, query, this.state.page, false);
                }
            );
        }

        // console.log("handleLoadMore");
        // console.log("Data Length : " + this.state.page);
        // if (_this.state.isPaginationEnd == false) {
        //     var query = "?symbol=" + symbol
        //     this.setState({
        //         page: this.state.page + 1,
        //     }, () => API.marketNews(this.responseNewsData, query, this.state.page, false));
        // }
    };

    callArticleAPI(id, symbol, link, title) {

        var payload = {
            articleId: id,
            symbol: symbol
        };
        API.marketSavePersonalizationData(this.responseRedirectData, payload, true);
        this._pressHandler(link, title)
    }
    _pressHandler(url = "https://www.google.com", title) {
        if (Platform.OS === 'android') {
            this.setState({ modalVisible: true })
            this.props.getShowAndroidModal(true, globals.screenTitle_news_load_more, url, title)
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
            <TouchableOpacity onPress={() => this.callArticleAPI(item.id, symbol, item.linkToArticle, item.title)}>
                <View style={[{ padding: 10 }, this.state.themeStyle.mainView]}>
                    <Text style={[styles.stockDetailRelatedNewsTitle, this.state.themeStyle.stockRelatedNewsTitleColor]}>{item.title}</Text>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ width: '70%', borderColor: 'red', }}>
                            {this.renderDateTime(item)}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    separator = () => {
        return (
            <View style={[styles.horizontalSepratorStockDetail, this.state.themeStyle.relatedNewsSeparator]} />
        );
    };

    /**
     * Method for open modal
     */
    openModal() {
        return (
            <Modal animationType='slide' visible={this.state.modalVisible} onRequestClose={() => { StockNewsLoadMore.handleCloseModalWebview() }}>
                <NewsArticleWebView setParentState={newState => this.setState(newState)} />
            </Modal>
        )
    }
    /**
     * Method for handle close modal webview
     */
    static handleCloseModalWebview() {
        _this.props.getShowAndroidModal(false)
        _this.setState({
            modalVisible: false
        })
    }

    renderStockFooter = () => {
        if (this.state.loading) {
            return (
                <View style={[styles.generalNewsFooter, this.state.themeStyle.trendingFooterMain]}>
                    <ActivityIndicator size="large" color={(this.state.tredingStatus ? colors.blackThemeColor : colors.white)} />
                </View>
            )
        } else {
            return null
        }
    }

    render() {
        let lastUpdate = <Text />;
        if (_this.state.data != null && _this.state.data.date != null) {
            lastUpdate = <Text style={[styles.priceTopTitle, this.state.themeStyle.stockDetailHeaderSubTitleColor]}>{moment.unix(_this.state.data.date).format('D MMM, h:mm A')}</Text>
        }
        var line = <View style={[styles.topViewSeparators, this.state.themeStyle.topViewSeparator]}></View>
        // if (this.state.loading) {
        //     return (
        //         <View style={[styles.trendingFooterMain, this.state.themeStyle.trendingFooterMain]}>
        //             <ActivityIndicator size="large" color={(this.state.tredingStatus ? colors.blackThemeColor : colors.white)} />
        //         </View>
        //     )
        // }
        // else {
            if (_this.state.isInternetAvailable == false) {
                return (
                    <SafeAreaView style={[globalStyles.safeviewStyle, this.state.themeStyle.mainRenderView]}>
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
            else if (_this.state.isTimeout && !this.state.isStockCached) {
                return (
                    <SafeAreaView style={[globalStyles.safeviewStyle, this.state.themeStyle.mainRenderView]}>
                        <View style={[styles.watchlistFooterMain, { marginBottom: 44 }, this.state.themeStyle.mainRenderView]}>
                            <View style={styles.noInternetTextView}>
                                <Text style={[styles.trendingFooterText, { textAlign: 'center' }, this.state.themeStyle.trendingFooterText]}>{globals.timeoutMessage}
                                </Text>
                            </View>

                        </View>
                    </SafeAreaView>
                )
            }
            else {
                return (
                    <SafeAreaView style={[globalStyles.safeviewStyle, this.state.themeStyle.mainRenderView]}>
                        <View style={[styles.mainRenderView, this.state.themeStyle.mainRenderView]}>

                            {this.openModal()}
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    ref={"myFlatList"}
                                    data={this.state.newsdata}
                                    style={this.state.themeStyle.mainRenderView}
                                    renderItem={({ item }) => this.renderRow(item)}
                                    keyExtractor={(item, index) => index.toString()}
                                    ListFooterComponent={this.renderStockFooter}
                                    ItemSeparatorComponent={this.separator}
                                    extraData={this.state}
                                />
                            </View>
                        </View>
                    </SafeAreaView>
                )
            }
        // }

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
    getShowAndroidModal,
    getShowModalSelectBankAccount
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(StockNewsLoadMore);
