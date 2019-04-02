import React, { Component } from 'react';
import {
    StatusBar,
    View,
    TouchableOpacity,
    Text,
    Platform,
    AsyncStorage,
    SafeAreaView,
    Image,
    Modal,
    ActivityIndicator,
    FlatList
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
import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import { getShowAndroidModal } from '../../../redux/actions/showAndroidWebViewModal';

import { getshowLoader } from "../../../redux/actions/showLoaderModal";
import { stock } from '../../../assets/images/map'
import DeviceInfo from 'react-native-device-info';
import styles from './style';
import { API } from '../../../lib/api';
import RSSFeed from './rssfeed';

import moment from 'moment';
import {
    VictoryLine,
    VictoryChart,
    VictoryAxis,
} from "victory-native";
import { getshowModal } from '../../../redux/actions/showModal';
// import NewsAndroidWebview from './newsAndroidWebview';
import NewsArticleWebView from '../InitialStock/NewsArticleWebView';

import SafariView from 'react-native-safari-view';
import firebase from 'react-native-firebase';

var _this = null;
var symbol = null;
var i = 0
const BOUNCE_MARGIN = globals.WINDOW.height
const mergeProp = (shouldEnrich = true, prop = {}, enrichment) => {
    return shouldEnrich ? Object.assign({}, prop, enrichment) : prop
}
let total;

const contentProps = (props, bottom, top) => ({
    contentInset: { top: -BOUNCE_MARGIN },
    contentOffset: { y: BOUNCE_MARGIN },
})
this.marketStatus = null
class StockNewsShowMore extends Component {

    static navigationOptions = ({ navigation, screenProps, }) => {
        const { state } = navigation;
        return {
            headerLeft: null,
            header:
                <View style={[styles.headerStyle, { backgroundColor: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.bgColor : colors.white }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <HeaderBackButton onPress={() => navigation.goBack(null)} title='' tintColor={(navigation.state.params != undefined && navigation.state.params != null)  ? navigation.state.params.backIconColor : colors.backLight} />
                    </TouchableOpacity>
                </View>
        }
    }

    constructor(props) {
        super(props);

        // console.log("themeStyle-->",JSON.stringify(themeStyle))
        this.state = {
            data: null,
            footerLoading: false,
            mainLoader: false,
            isInternetAvailable: true,
            loading: false,
            page: 1,
            tredingStatus: true,
            newsdata: [],
            totalItem: 0,
            isPaginationEnd: false,
            themeStyle: props.theme,
            isTimeout: false,
            modalVisible: false
        };
        _this = this
    }

    getInitialize() {
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(globals.globalVars.statusBarColor, true);
        }
        this.setState({ tredingStatus: this.props.marketStatus })
        this.getTimeIntervalForStockNews();
        // this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
        const { page, seed } = this.state;
        // https://api.clane.com/api/v1/stock-news/rssfeeds?count=20&page=1
        const url = `https://api.clane.com/api/v1/stock-news/rssfeeds?&page=${page}&count=10`;
        this.setState({ loading: true });

        fetch(url)
            .then(res => res.json())
            .then(res => {
                console.log("RESPONSE PAGINATION " + JSON.stringify(res));
                total = res.total;
                    this.setState({
                        newsdata: page === 1 ? res.articles : [...this.state.newsdata, ...res.articles],
                        error: res.error || null,
                        loading: false,
                        refreshing: false
                    });
                    try {
                            AsyncStorage.setItem(globals.market_general_news_load_more_timeStamp , new Date());
                            AsyncStorage.setItem(globals.market_async_news_show_more , JSON.stringify(this.state.newsdata));
                            // this.setState({footerLoading: false})
                        } catch (error) {
                        }

            })
            .catch(error => {
                this.setState({ error, loading: false  });
            });
    };

    componentDidMount() {
        var event = { "key": globals.event_Generalnewspagenavigation, "count": 1 };
        event.segmentation = Object.assign({}, { EventDetails: 'General news show more' }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
        Countly.recordEvent(event);
        console.log("=====segmentation record event globals.event_Generalnewspagenavigation, result=> ");

        firebase.analytics().logEvent(globals.event_Generalnewspagenavigation,
            Object.assign({}, { EventDetails: 'General news show more' }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
        if (Platform.OS == 'ios') {
            globals.setStatusBarForSafariView();
        }
        this.getInitialize()
        this.marketStatus = this.props.marketStatus
        this.props.navigation.setParams({ bgColor: (this.props.marketStatus) ? colors.white : colors.blackThemeColor ,titleColor:(this.props.marketStatus) ? colors.blackThemeColor : colors.white, backIconColor: (this.props.marketStatus) ? colors.backLight : colors.white})
    }

    componentWillReceiveProps(newProps) {
        if (newProps.theme != undefined) {
            this.setState({
                themeStyle: newProps.theme
            })
        }
        if (newProps.marketStatus != undefined) {
            if (this.marketStatus !== newProps.marketStatus) {
                this.marketStatus = newProps.marketStatus
                this.props.navigation.setParams({ bgColor: (newProps.marketStatus) ? colors.white : colors.blackThemeColor,titleColor:(this.props.marketStatus) ? colors.blackThemeColor : colors.white, backIconColor: (this.props.marketStatus) ? colors.backLight : colors.white })
            }
        }
    }

    componentWillUnmount() {
        isMounted = false;
    }

    /**
     * Method for call news feed API
     */
    generalNewsFeed() {
        var query = "?count=10"
        this.setState({ loading: true, mainLoader:true, isInternetAvailable: true })

        API.marketGeneralNews(this.responseNewsData, this.state.page, false);
    }

    /**
     * Method for get response data of news feed
     */
    responseNewsData = {
        success: (response) => {
            // this.setState({ totalItem: response.total, loading: false })
            // const { page, seed } = this.state;
            total = response.total;
            this.setState({
                newsdata: this.state.page === 1 ? response.articles : [...this.state.newsdata, ...response.articles],
                error: response.error || null,
                loading: false,
                refreshing: false,
                mainLoader: false
            },()=>{
                try {
                    AsyncStorage.setItem(globals.market_general_news_load_more_timeStamp , new Date());
                    AsyncStorage.setItem(globals.market_async_news_show_more , JSON.stringify(this.state.newsdata));
                    this.setState({footerLoading: false})
                } catch (error) {
                }
            });
            // let oldData = this.state.newsdata
            // let newData = response.articles
            // let allData = [...oldData, ...newData]
            // if (response.articles.length <= 0) {
            //     _this.setState({ isPaginationEnd: true, footerLoading: false })
            // }
            // else {
            //     allData = [...this.state.newsdata, ...response.articles],
            //         this.setState({ newsdata: allData, footerLoading: true })
            //         // this.setState({ newsdata: RSSFeed.articles, })

            // }
            
        },
        error: (err) => {
            console.log("GOT ERROR");
            
            _this.setState({ footerLoading: false, loading: false, mainLoader:false, isTimeout: true }, () => {
                this.getTimeIntervalForStockNews()
            })
            //alert(JSON.stringify(err))
        },
        complete: () => {
        }
    }

    /**
    * Method for get time interval stock news
    */
    getTimeIntervalForStockNews() {

        AsyncStorage.getItem(globals.market_general_news_load_more_timeStamp, (err, result) => {
            if (result !== null) {
                this.setState({ isTimeout: false })
                var diffMins = globals.getTimeDifference(result);
                if (diffMins >= 15 && globals.isInternetConnected) {
                    // this.makeRemoteRequest();
                    this.generalNewsFeed()
                    console.log("AsyncStorage CALL 15 MIN");
                    
                    this.setState({ isFromCache: false, isTimeout: false })
                } else {
                    this.setState({ isFromCache: true, isTimeout: false })
                    AsyncStorage.getItem(globals.market_async_news_show_more, (err, result) => {
                        if (result !== null) {
                            var responseData = JSON.parse(result);
                            total = result.total;
                            var allData = responseData;
                            this.setState({ newsdata: allData, footerLoading: true })
                            console.log("AsyncStorage CALL LOCAL");

                            // this.setState({ newsdata: RSSFeed.articles, loading:false })

                        }
                    });
                }
            } else {
                if (globals.isInternetConnected && !this.state.isTimeout) {
                    this.setState({ isInternetAvailable: true, isFromCache: false, loading: true, isTimeout: false });
                    // this.makeRemoteRequest();
                    this.generalNewsFeed()
                    console.log("AsyncStorage CALL NEW DATA");

                } else {

                    if (!this.state.isTimeout && !this.state.isFromCache) {
                        this.setState({ isInternetAvailable: false, });
                    } else {
                        this.setState({ isTimeout: true, });
                    }

                    // this.setState({
                    //     dataSourceGainer: [],
                    //     footerString: globals.networkNotAvailable,
                    //     isInternetAvailable: false,
                    // });
                }
            }
        });
    }

    /**
     * Method for render footer  
     */
    renderFooter = () => {
        return (
            (this.state.newsdata.length > 0 && !this.state.isPaginationEnd) ?
                <View style={styles.loadmoreView}>
                    <Image source={stock.load_more} style={[styles.loadmore]} />
                    <Text style={[styles.loadmoreTextView, this.state.themeStyle.loadmoreTextView]}>{globals.swipeLoadMore}</Text>
                </View> : null
        )
    };


    /**
     * Method for show load more with pagination news articles
     */
    handleLoadMore = () => {
        if (this.state.newsdata.length != total && !this.state.isFromCache ) {
            this.setState(
                {
                    page: this.state.page + 1
                },
                () => {
                    // this.makeRemoteRequest()
                    this.setState({loading : true})
                    API.marketGeneralNews(this.responseNewsData, this.state.page, false);
                }
            );
        }
       
        // if (_this.state.isPaginationEnd == false) {
        //     var query = "?count=10"
        //     if (globals.isInternetConnected) {
        //         this.setState({
        //             page: this.state.page + 1,
        //         }, () => API.marketGeneralNews(this.responseNewsData, query, this.state.page, false));
        //     }else{
        //         this.setState({footerLoading: false})
        //     }

        // }
    };

    /**
     * Method for call API of save user information of article click
     */
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
            this.props.getShowAndroidModal(true, globals.screenTitle_news_show_more, url, title)
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
        var data = globals.checkTimeStamp(item.publishedDate);
        if (data == '1') {
            return (
                <Text style={[styles.generalArticleSmall, this.state.themeStyle.generalArticleSmall]}>{item.source} - {'Today'} - {item.author}
                </Text>
            )
        }
        else if (data == '0') {
            return (
                <Text style={[styles.generalArticleSmall, this.state.themeStyle.generalArticleSmall]}>{item.source} - {'Yesterday'} - {item.author}
                </Text>
            )
        }
        else if (data == '2') {
            return (
                <Text style={[styles.generalArticleSmall, this.state.themeStyle.generalArticleSmall]}>{item.source} - {moment(item.publishedDate).format('MM/DD/YY')} - {item.author}
                </Text>
            )
        }
    }

    renderRow(item) {

        // console.log('== ' + i + ' ==')
        return (
            <TouchableOpacity onPress={() => this.callArticleAPI(item.id, symbol, item.linkToArticle, item.title)}>
                <View style={[{ padding: 10 }, this.state.themeStyle.mainView]}>
                    <Text style={[styles.generalNewsArticleTitle, this.state.themeStyle.generalNewsArticleTitle]}>{item.title}</Text>
                    <View style={{ flexDirection: 'row', }}>
                        <View>
                            {this.renderDateTime(item)}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    /**
     * Method for seprator
     */
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
            <Modal animationType='slide' visible={this.state.modalVisible} onRequestClose={() => { StockNewsShowMore.handleCloseModalWebview() }}>
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

    btnTryAgainPressed() {
        if (globals.isInternetConnected) {
            this.generalNewsFeed()
        }
    }
    render() {
        let lastUpdate = <Text />;
        if (_this.state.data != null && _this.state.data.date != null) {
            lastUpdate = <Text style={[styles.priceTopTitle, this.state.themeStyle.stockDetailHeaderSubTitleColor]}>{moment.unix(_this.state.data.date).format('D MMM, h:mm A')}</Text>
        }
        var line = <View style={[styles.topViewSeparators, this.state.themeStyle.topViewSeparator]}></View>

        if (!this.state.isInternetAvailable && !this.state.isFromCache) {
            return (
                <SafeAreaView style={[globalStyles.safeviewStyle, this.state.themeStyle.mainRenderView]}>
                    <View style={[styles.watchlistFooterMain, { marginBottom: 44 }, this.state.themeStyle.mainRenderView]}>
                        <View style={styles.noInternetTextView}>
                            <Text style={[styles.trendingFooterText, this.state.themeStyle.trendingFooterText, { textAlign: 'center' }]}>{globals.networkNotAvailable}
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
        else if (this.state.isTimeout && !this.state.isFromCache) {
            return (
                <SafeAreaView style={[globalStyles.safeviewStyle, this.state.themeStyle.mainRenderView]}>
                    <View style={[styles.watchlistFooterMain, { marginBottom: 44 }, this.state.themeStyle.mainRenderView]}>
                        <View style={styles.noInternetTextView}>
                            <Text style={[styles.trendingFooterText, this.state.themeStyle.trendingFooterText, { textAlign: 'center' }]}>{globals.timeoutMessage}
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
                        {(this.state.mainLoader)?<View style={[styles.trendingFooterMain, this.state.themeStyle.trendingFooterMain]}>
                    <ActivityIndicator size="large" color={(this.state.tredingStatus ? colors.blackThemeColor : colors.white)} />
                    </View>:
                        <View style={{ flex: 1, marginBottom: 50 }}>
                            {this.openModal()}
                            <FlatList
                                ref={"myFlatList"}
                                data={this.state.newsdata}
                                style={this.state.themeStyle.mainRenderView}
                                renderItem={({ item }) => this.renderRow(item)}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={this.separator}
                                ListFooterComponent={this.renderStockFooter}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={0.2}
                                extraData={this.state}

                            />
                        </View>
                         }
                    </View>
                </SafeAreaView>
            )
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
    getShowAndroidModal,
    getShowModalSelectBankAccount
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(StockNewsShowMore);
