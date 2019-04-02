import React, { Component } from 'react';
import { SafeAreaView, Text, AsyncStorage, StyleSheet, FlatList, Image, TouchableOpacity, View, ImageBackground, TouchableWithoutFeedback, Platform, StatusBar, Dimensions, TextInput, Modal } from 'react-native';
import globalStyles from '../../../assets/styles/globalStyles';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import SplashScreen from 'react-native-splash-screen'
import * as globals from '../../../lib/globals';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SafariView from 'react-native-safari-view';
import NewsArticleWebView from '../InitialStock/NewsArticleWebView';
import { getshowModal } from '../../../redux/actions/showModal';
import { getshowLoader } from "../../../redux/actions/showLoaderModal";
import LottieView from 'lottie-react-native';

import Icon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { dashboard, stock, register, bvn_verification } from '../../../assets/images/map'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { changeTheme } from '../../../redux/actions/changeTheme';
import { changeTabColor } from '../../../redux/actions/changeTabColorModel';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import { getShowAndroidModal } from '../../../redux/actions/showAndroidWebViewModal';
import * as colors from '../../../assets/styles/color';
import { API } from '../../../lib/api';
import Dashboard from './dashboard'
import Category from '../Stocks/category';
import styles from './style';
var TAG = "NewsStockSearchModal"
var data = [];
var timeoutForSearchApiCall = null;
var timeoutForStockSearchApiCall = null;

var _this = null;

const propOverridePlaceholderObject = {
    component: Image,
    props: {
        style: styles.topHeaderImage,
        source: stock.news_placeholder
    }
};
let stringData = [];


class NewsStockSearchModal extends Component {

    static navigationOptions = ({ navigation, screenProps, }) => {
        const { state } = navigation;
        return {
            header: null,

        }
    }

    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            tabOption: 1,
            query: "",
            data: [],
            stockData: [],
            isSearch: false,
            isSearchStock: false,
            refreshing: false,
            newsCount: 0,
            newsCountStock: 0,
            isFrom: props.isFrom,
            modalVisibleWebView: false,
            recentSearch: [],
            recentNewsSearch: [],
            tempRecentNewsSearch: [],
            loader: false,
            isResponseCome: false,
            isNewsCountCome: false,
            isStockCountCome: false,
            isRecentViewVisible: false,

        }
    }

    componentDidUpdate() {
        if (this.state.loader) {
            this.animation.play();
        }

    }

    componentDidMount() {
        // this.props.getshowLoader(true)

        AsyncStorage.getItem("stockRecentSearch", (err, result) => {
            if (result != null && result != undefined) {
                _this.setState({ recentSearch: JSON.parse(result) }, () => {
                    console.log("stockRecentSearch " + JSON.stringify(this.state.recentSearch));

                })

            }
        });

        AsyncStorage.getItem("newsRecentSearch", (err, result) => {
            if (result != null && result != undefined) {
                this.setState({ recentNewsSearch: JSON.parse(result) }, () => {
                    this.setState({ isRecentViewVisible: true })
                    console.log("recentNewsSearch " + JSON.stringify(this.state.recentNewsSearch));
                    // this.setState({tempRecentNewsSearch : this.state.recentNewsSearch})
                    // recentNews = this.state.recentNewsSearch;
                })

            }
        });

        if (Platform.OS == 'ios') {
            globals.setStatusBarForSafariView();
        } else {
            if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor(colors.blue, true);
            }
        }

    }

    checkIfIDExists(objID) {
        // return this.state.recentSearch.some(function (el) {
        //     return el.stock_id === objID;
        // });
        return this.state.recentNewsSearch.some(function (el) {
            return el.stock_id === objID;
        });
    }
    checkIfNewsIDExists(objID) {
        return this.state.recentNewsSearch.some(function (el) {
            return el.id === objID;
        });
    }

    checkIfTitleExists(objID) {
        return stringData.some(function (el) {
            return el.title === objID;
        });
    }

    itemClickAction(object, index, value) {
        // var tempArray = this.state.recentSearch;
        var tempArray = this.state.recentNewsSearch;
        console.log("Rearch Term " + value);

        let isFound = this.checkDuplicateValue(value,stringData);
        if (!isFound) {
            let unique = this.getUnique(tempArray, 'title')
        console.log("tempArray before---> " + JSON.stringify(unique));
        tempArray = unique;
        tempArray.unshift({ title: value })
        console.log("tempArray after---> " + JSON.stringify(tempArray));
        if (tempArray.length > 2) {
            tempArray.pop()
        }
        console.log("tempArray after pop---> " + JSON.stringify(tempArray));

        AsyncStorage.setItem('newsRecentSearch', JSON.stringify(tempArray));

        stringData = tempArray;

        console.log("Stock Navigation-->" + object.stock_id + "" + object.symbol)
        NewsStockSearchModal._goToStockDetaill({ theme: this.state.themeStyle, stock_id: object.stock_id, symbol: object.symbol })
        }
        else {
            NewsStockSearchModal._goToStockDetaill({ theme: this.state.themeStyle, stock_id: object.stock_id, symbol: object.symbol })
        }

        

    }


    onCancelPress() {
        this.props.navigation.goBack();
        // if (this.state.isFrom =='Category') {
        //     Category.handleCloseModal()
        // }else{
        //     Dashboard.handleCloseModal()
        // }

    }

    onClearPress() {
        this.setState({ query: '', data: [], stockData: [], isSearch: false, newsCountStock: 0, newsCount: 0, isResponseCome: false, }, () => {
            if (this.state.recentNewsSearch.length > 0) {
                this.setState({ isRecentViewVisible: true })
            }
        })
    }
    /**
     * Method for render on change text
     */

    onChangeText(query) {
        console.log(TAG, "onChangeText" + query.length)

        // query = query.trim();
        this.setState({ query })
        clearTimeout(timeoutForSearchApiCall);
        if (query === '') {
            this.setState({ isSearch: false, data: this.state.recentSearch, refresh: !this.state.refresh, newsCount: 0, newsCountStock: 0, isResponseCome: false });
        } else {
            if (!this.state.isSearch) {
                this.setState({ data: [], stockData: [], refresh: !this.state.refresh, refreshStock: !this.state.refreshStock });
            }
            this.setState({ isSearch: true, refresh: !this.state.refresh, refreshStock: !this.state.refreshStock, isApiCall: true });
        }
        if (query.length == 0) {
            if (this.state.recentNewsSearch.length > 0) {
                this.setState({ isRecentViewVisible: true, data: [], stockData: [] })
            }
        }
        timeoutForSearchApiCall = setTimeout(() => {
            // API.newsSearch(this.responseSearchData, query, false);
            if (query.length > 0) {
                if (globals.isInternetConnected) {
                    this.setState({ loader: true, isResponseCome: false, isNewsCountCome: false, isRecentViewVisible: false }, () => {
                        this.animation.play();
                    })
                }

            }
            else {
                this.setState({ loader: false })
            }
            // this.setState({isResponseCome: false})
            if (query.length > 0) {
                API.getNewsSearchArticle(this.responseSearchDataNews, query, false);
                // API.marketSearch(this.responseSearchStockMarketData, query, false);
            }


        }, 1000);

    }
    /**
    * Method for get response of news data api
    */
    // responseSearchData = {
    //     success: (response) => {
    //         if (this.state.isSearch == false) {
    //             console.log("isSearch false");
    //             this.setState({ data: this.state.recentSearch, refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
    //         } else {
    //             if (response != null && response.length != 0) {
    //                 this.setState({ newsCount: response.length })
    //                 console.log("isSearch true 1");
    //                 this.setState({ data: response, refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
    //             } else {
    //                 this.setState({ newsCount: response.length })
    //                 console.log("isSearch true 2");
    //                 this.setState({ data: [], refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
    //             }
    //         }
    //     },
    //     error: (err) => {
    //         this.setState({ data: [], refresh: !this.state.refresh, isApiCall: false, newsCount: 0 }, () => { this.forceUpdate() })
    //     },
    //     complete: () => {
    //     }
    // }

    /**
     * method for get response of news search data api latest
     */
    responseSearchDataNews = {
        success: (response) => {
            API.marketSearch(this.responseSearchStockMarketData, this.state.query, false);

            if (this.state.isSearch == false) {
                console.log("isSearch false");
                this.setState({ data: this.state.recentSearch, refresh: !this.state.refresh, isApiCall: false }, () => {
                    this.forceUpdate()
                    setTimeout(() => { this.setState({ loader: false }) }, 1000)
                })
            } else {
                if (response != null && response.data.length > 0) {
                    this.setState({ newsCount: response.data.length, isNewsCountCome: true })
                    console.log("isSearch true 1");
                    this.setState({ data: response.data, refresh: !this.state.refresh, isApiCall: false }, () => {
                        this.forceUpdate()
                        setTimeout(() => { this.setState({ loader: false }) }, 1000)
                    })
                } else {
                    this.setState({ newsCount: response.data.length, isNewsCountCome: true })
                    console.log("isSearch true 2");
                    this.setState({ data: [], refresh: !this.state.refresh, isApiCall: false, loader: false }, () => {
                        this.forceUpdate()
                        setTimeout(() => { this.setState({ loader: false }) }, 1000)
                    })
                }
            }
        },
        error: (err) => {
            API.marketSearch(this.responseSearchStockMarketData, this.state.query, false);
            this.setState({ data: [], refresh: !this.state.refresh, isApiCall: false, newsCount: 0, isNewsCountCome: false }, () => { this.forceUpdate() })
        },
        complete: () => {
        }
    }


    /**
     * response for search of stock market data
     */
    responseSearchStockMarketData = {
        success: (responseStock) => {
            console.log(TAG, "responseSearchStockMarketData" + (JSON.stringify(responseStock.sData.stock)))
            var responseStockData = responseStock.sData.stock
            this.setState({ isResponseCome: true })
            if (this.state.isSearch == false) {
                console.log("isSearch false");
                this.setState({ stockData: [], refreshStock: !this.state.refreshStock, isApiCall: false }, () => { this.forceUpdate() })
            } else {
                if (responseStockData != null && responseStockData.length != 0) {
                    this.setState({ newsCountStock: responseStockData.length, isStockCountCome: true })
                    console.log("isSearch true 1");
                    this.setState({ stockData: responseStockData, refreshStock: !this.state.refreshStock, isApiCall: false }, () => { this.forceUpdate() })
                } else {
                    this.setState({ newsCountStock: responseStockData.length, isStockCountCome: true })
                    console.log("isSearch true 2");
                    this.setState({ stockData: [], refreshStock: !this.state.refreshStock, isApiCall: false }, () => { this.forceUpdate() })
                }
            }
        },
        error: (err) => {
            this.setState({ isResponseCome: true, isStockCountCome: false, loader: false })
            this.setState({ stockData: [], refreshStock: !this.state.refreshStock, isApiCall: false, newsCountStock: 0 }, () => { this.forceUpdate() })
        },
        complete: () => {
        }
    }


    /**
         * Method for get effect string from search text for --- news
         */
    geteffectString(value, index, fontSize, fontWeight) {
        var isMatch = false
        var isAdded = false
        var query = this.state.query.toLowerCase();
        var fIndex, lIndex;
        var re = new RegExp(query, 'g');
        if (value != undefined) {
            var str = value.toLowerCase();
            while (((match = re.exec(str)) != null) && !isAdded) {
                fIndex = match.index
                lIndex = re.lastIndex
                isMatch = true
                isAdded = true
            }
            if (isMatch) {
                isMatch = false
                return (<Text style={{ fontSize: fontSize, color: colors.darkGray, fontWeight: fontWeight }}>{value.substring(0, fIndex)}
                    <Text style={{ fontSize: fontSize, color: colors.blackColor }}>{value.substring(fIndex, lIndex)}</Text>{value.substring(lIndex)}</Text>)
            } else {
                return (<Text style={{ fontSize: fontSize, color: colors.darkGray, fontWeight: fontWeight }}>{value}</Text>)
            }
        }
    }

    /**
     * Method for get effect string from search text for --- stocks
     * @param {*} value 
     * @param {*} index 
     * @param {*} fontSize 
     * @param {*} fontWeight 
     */
    geteffectStringStock(value, index, fontSize, fontWeight) {
        console.log(TAG, "geteffectStringStock::::::" + value)
        var isMatch = false
        var isAdded = false
        var query = this.state.query.toLowerCase();
        var fIndex, lIndex;
        var re = new RegExp(query, 'g');
        if (value != undefined) {
            var str = value.toLowerCase();
            while (((match = re.exec(str)) != null) && !isAdded) {
                fIndex = match.index
                lIndex = re.lastIndex
                isMatch = true
                isAdded = true
            }
            if (isMatch) {
                isMatch = false
                return (<Text style={{ fontSize: fontSize, color: colors.darkGray, fontWeight: fontWeight }}>{value.substring(0, fIndex)}
                    <Text style={{ fontSize: fontSize, color: colors.blackColor }}>{value.substring(fIndex, lIndex)}</Text>{value.substring(lIndex)}</Text>)
            } else {
                return (<Text style={{ fontSize: fontSize, color: colors.darkGray, fontWeight: fontWeight }}>{value}</Text>)
            }
        }
    }

    callArticleAPI(id, link, title) {
        //var arid = id.replace(/[+]+/g, '%2B');

        var payload = {
            articleId: id,
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

    /**
    * Method for open modal
    */
    openModal() {
        console.log("openModal : " + this.state.modalVisibleWebView)
        return (
            <Modal animationType='slide' visible={this.state.modalVisibleWebView} onRequestClose={() => { NewsStockSearchModal.handleCloseModalWebview() }} >
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
            modalVisibleWebView: false
        })
    }

    /**
     * Method for render open link in safariview
     */
    _pressHandler(url = "https://www.google.com", title) {
        if (Platform.OS === 'android') {
            this.setState({ modalVisibleWebView: true })
            this.props.getShowAndroidModal(true, globals.screenTitle_NewsStockSearchModal, url, title)
        }
        else {
            SafariView.isAvailable()
                .then(SafariView.show({
                    url: url,
                    barTintColor: colors.white,
                    readerMode: true,
                }))
                .catch(error => {
                    // Fallback WebView code for iOS 8 and earlier
                });
        }
    }

    goToStockDetaill(data) {
        globals.currentNavigatorValue = "Market";
        // AsyncStorage.setItem(globals.currentNavigator, "Market");
        _this.props.navigation.navigate('StockDetailSearch', data)
    }

    callSearchAPI(item) {
        // alert(JSON.stringify(item))
        this.setState({ query: item.title, isRecentViewVisible: false, }, () => {
            this.onChangeText(this.state.query)
        })
        this.setState({ query: item.title, loader: true, isResponseCome: false, isNewsCountCome: false, isRecentViewVisible: false }, () => {
            this.animation.play();
        })
    }
    _renderRecentItem = ({ item, index }) => {

        return (
            <TouchableOpacity onPress={() => this.callSearchAPI(item)}>
                <Text numberOfLines={1} style={[styles.searchScreenItemTitleText, { margin: 10 }]}>{item.title}</Text>
            </TouchableOpacity>
        )

        // if (item.stock_id && item.stock_id != undefined) {
        //     return (
        //             <TouchableOpacity onPress={()=>this.goToStockDetaill({theme: this.state.themeStyle, stock_id: item.stock_id, symbol: item.symbol})}>
        //             <Text numberOfLines={1} style={[styles.searchScreenItemTitleText, {   margin:10 }]}>{item.symbol}</Text>
        //             </TouchableOpacity>
        //     )
        // } else {
        //     return (

        //             <TouchableOpacity onPress={() => this.sendDataToNewsSearchDetail(item, index, 'recent',this.state.query)}>
        //             <View style={styles.searchScreenItem}>
        //                 <View style={styles.searchScreenItemView}>
        //                     <View style={styles.searchScreenItemLeftView}>
        //                         <Text numberOfLines={2} style={styles.searchScreenItemTitleText}>{item && item.title}</Text>
        //                     </View>
        //                 </View>
        //                 <View style={styles.searchScreenItemView}>
        //                     <View style={styles.searchScreenItemLeftView}>
        //                         <Text numberOfLines={1} style={styles.searchScreenItemSubtitleText}>{item && item.source}</Text>
        //                     </View>
        //                 </View>
        //             </View>
        //             </TouchableOpacity>

        //     )
        // }

        // return (
        //     <TouchableOpacity onPress={() => this.sendDataToNewsSearchDetail(item, index, 'recent')}>
        //          {/* <Text numberOfLines={2} style={styles.searchScreenItemTitleText}>{item.title}</Text> */}
        //         <View style={styles.searchScreenItem}>
        //             <View style={styles.searchScreenItemView}>
        //                 <View style={styles.searchScreenItemLeftView}>
        //                 <Text numberOfLines={2} style={styles.searchScreenItemTitleText}>{item && item.title  }</Text>
        //                 </View>
        //             </View>
        //             <View style={styles.searchScreenItemView}>
        //                 <View style={styles.searchScreenItemLeftView}>
        //                 <Text numberOfLines={1} style={styles.searchScreenItemSubtitleText}>{item && item.source }</Text>
        //                 </View>
        //             </View>
        //         </View>
        //     </TouchableOpacity>
        // )
    }
    /**
     * Method for render item for news
     */
    _renderItem = ({ item, index }) => {
        console.log("_renderItem : this.props : " + JSON.stringify(this.props))
        return (
            <TouchableOpacity onPress={() => this.sendDataToNewsSearchDetail(item, index, 'normal', this.state.query)}>
                {/* <TouchableOpacity onPress={() => (item.tags && (item.tags[0] == "topnews" || item.tags[0] == "trendingnews")) ? this.setState({ modalVisible: false, query: '', data: [] }, () => { this.props.navigation.navigate("stockNewsArticleDetail", { articleData: item, theme: this.props.theme }) }) : this.callArticleAPI(item.id, item.linkToArticle, item.title)}> */}
                <View style={styles.searchScreenItem}>
                    <View style={styles.searchScreenItemView}>
                        <View style={styles.searchScreenItemLeftView}>
                            {
                                (!this.state.isSearch) ?
                                    <Text numberOfLines={2} style={styles.searchScreenItemTitleText}>{item.title}</Text>
                                    :
                                    <Text numberOfLines={2}>{this.geteffectString(item.title, this.state.query.length, 16, '700')}</Text>
                            }
                        </View>
                    </View>
                    <View style={styles.searchScreenItemView}>
                        <View style={styles.searchScreenItemLeftView}>
                            {
                                (!this.state.isSearch) ?
                                    <Text numberOfLines={1} style={styles.searchScreenItemSubtitleText}>{item.source}</Text>
                                    :
                                    <Text numberOfLines={1}>{this.geteffectString(item.source, this.state.query.length, 12, '400')}</Text>
                            }
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    /**
     * static method of go to stock detail screen from item
     * @param {} data 
     */
    static _goToStockDetaill(data) {
        //NewsStockSearchModal.navigateToStockDetails()
        //alert("data" + JSON.stringify(_this.props))
        // _this.props.navigation.navigate('StockDetails', data)
        console.log('CLICKC DATA ' + JSON.stringify(data));

        Dashboard.handleCloseModalNavigateStockDetail(data);
    }

    getUnique(arr, comp) {

        const unique = arr
            .map(e => e[comp])

            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)

            // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);

        return unique;
    }

    checkDuplicateValue(value, tempArray){
        let found = false;
            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i].title == value) {
                    found = true;
                    break;
                }
            }
            return found;
    }

    sendDataToNewsSearchDetail(object, index, isFrom, value) {
        if (isFrom == 'recent') {
            NewsStockSearchModal._goToNewsSearchDetail({ artilceId: object.id, title: object.title, theme: this.props.theme })
        }
        else {
            let tempArray = this.state.recentNewsSearch;
            console.log("Rearch Term " + value);
            // stringData.push({ title: value })
             let isFound = this.checkDuplicateValue(value, stringData)
            if (!isFound) {
                let unique = this.getUnique(tempArray, 'title')
                console.log("tempArray before---> " + JSON.stringify(unique));
                tempArray = unique;
                tempArray.unshift({ title: value })
                console.log("tempArray after---> " + JSON.stringify(tempArray));
    
                // recentNews = tempArray;
                this.setState({ recentNewsSearch: tempArray, })
                if (tempArray.length > 2) {
                    tempArray.pop()
                }
                console.log("tempArray after pop---> " + JSON.stringify(tempArray));
                stringData = tempArray;
                AsyncStorage.setItem('newsRecentSearch', JSON.stringify(tempArray));
                NewsStockSearchModal._goToNewsSearchDetail({ artilceId: object.id, title: object.title, theme: this.props.theme })
            }else {
                AsyncStorage.setItem('newsRecentSearch', JSON.stringify(tempArray));
                NewsStockSearchModal._goToNewsSearchDetail({ artilceId: object.id, title: object.title, theme: this.props.theme })
            }
        }



    }


    /**
     * go to news search detail screen from perticular news
     * @param {*} data 
     */
    static _goToNewsSearchDetail(data, index) {
        Dashboard.handleCloseModalNavigateNewsSearchDetail(data);
    }


    /**
     * render item for stock
     */
    _renderItemStock = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.itemClickAction(item, index, this.state.query)} >
                <View style={styles.searchScreenItem}>
                    <View style={styles.searchScreenItemView}>
                        <View style={styles.searchScreenItemLeftView}>
                            {
                                (!this.state.isSearch) ?
                                    <Text numberOfLines={1} style={styles.searchScreenItemTitleText}>{item.symbol}</Text>
                                    :
                                    <Text numberOfLines={1}>{this.geteffectStringStock(item.symbol, this.state.query.length, 16, '700')}</Text>
                            }
                        </View>
                        {(this.state.isSearch) ?
                            <View style={styles.searchScreenItemTopRightView}>
                                <Text numberOfLines={1} style={styles.searchScreenItemTitleText}>{globals.checkForFloatAndRound(item.last_price)}</Text>
                            </View> : null}
                    </View>
                    <View style={styles.searchScreenItemView}>
                        <View style={styles.searchScreenItemLeftView}>
                            {
                                (!this.state.isSearch) ?
                                    <Text numberOfLines={1} style={styles.searchScreenItemSubtitleText}>{item.company_name}</Text>
                                    :
                                    <Text numberOfLines={1}>{this.geteffectStringStock(item.company_name, this.state.query.length, 12, '400')}</Text>
                            }
                        </View>
                        {(this.state.isSearch) ?
                            <View style={styles.searchScreemItemBottomRightView}>
                                <Text numberOfLines={1} style={[styles.searchScreenItemSubtitleText, {
                                    color: (item.abs_change < 0) ? colors.redColor : (item.abs_change == 0) ? colors.blackColor : colors.greenColor, marginRight: 3
                                }]}>{globals.checkForFloatAndRound(item.abs_change)}</Text>
                                <Text numberOfLines={1} style={[styles.searchScreenItemSubtitleText, {
                                    color: (item.perc_change < 0) ? colors.redColor : (item.perc_change == 0) ? colors.blackColor : colors.greenColor
                                }]}>{globals.checkForFloatAndRound(item.perc_change) ? '(' + globals.checkForFloatAndRound(item.perc_change) + '%)' : ''}</Text>
                            </View> : null}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    /**
   * Method for render seprator
   */
    renderSeparator() {
        return <View style={{ height: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1, marginHorizontal: 10, backgroundColor: '#E1E1E1' }}></View>
    }

    /**
     * Method for ListEmptyComponent for ---news
     */
    ListEmptyComponent() {

        if (!globals.isInternetConnected) {
            if (_this.state.query != null && _this.state.query.length > 1) {
                return (
                    <View style={styles.noRecordFoundView}>
                        <Image source={require("../../../assets/images/stock/noRecordFoundNews.png")} style={{ width: 54, height: 45 }} resizeMode={"contain"} />
                        <Text style={styles.noRecordFoundText}>{"Apparently, you are offline.\n Please go online to get search results."}</Text>
                    </View>
                )
            }
            else {
                return null
            }
        }
        // i?f (!this.state.loader) {
        if (_this.state.query && _this.state.query != "" && !_this.state.isApiCall && _this.state.data && _this.state.data.length <= 0) {
            return (
                <View style={[styles.noRecordFoundView,]}>
                    <Image source={require("../../../assets/images/stock/noRecordFoundNews.png")} style={{ width: 54, height: 45 }} resizeMode={"contain"} />
                    <Text style={styles.noRecordFoundText}>{"Sorry, results related to  \"" + _this.state.query + "\" could not be found"}</Text>
                </View>
            )
        } else {
            return null
        }
        // }

    }

    /**
     * Method for ListEmptyComponent for ---stock
     */
    ListEmptyComponentStock() {

        if (!globals.isInternetConnected) {
            if (_this.state.query != null && _this.state.query.length > 1) {
                return (
                    <View style={styles.noRecordFoundView}>
                        <Image source={require("../../../assets/images/stock/noRecordFoundMarket.png")} style={{ width: 54, height: 45 }} resizeMode={"contain"} />
                        <Text style={styles.noRecordFoundText}>{"Apparently, you are offline.\n Please go online to get search results."}</Text>
                    </View>
                )
            }
            else {
                return (
                    null
                )
            }
        }

        if (_this.state.query && _this.state.query != "" && !_this.state.isApiCall && _this.state.stockData && _this.state.stockData.length == 0) {
            return (
                <View style={[styles.noRecordFoundView,]}>
                    <Image source={require("../../../assets/images/stock/noRecordFoundMarket.png")} style={{ width: 54, height: 45 }} resizeMode={"contain"} />
                    <Text style={styles.noRecordFoundText}>{"Sorry, results related to  \"" + _this.state.query + "\" could not be found"}</Text>
                </View>
            )
        } else {
            return (
                null
            )
        }
    }


    /**
   * Method for render indicator visible invisible
   * @param {*} tabOption 
   */
    renderIndicatorAndListData(tabOption) {
        this.setState({ tabOption: tabOption }, () => this.forceUpdate(), this.changeStateAfterChangeTab(this.state.tabOption));
    }

    changeStateAfterChangeTab(tabOption) {
        // clearTimeout(timeoutForSearchApiCall);
        // if (this.state.query === '') {
        //     this.setState({ isSearch: false, data: this.state.recentSearch, refresh: !this.state.refresh, newsCount: 0, newsCountStock : 0});
        // } else {
        //     if (!this.state.isSearch) {
        //         this.setState({ data: [],stockData :[], refresh: !this.state.refresh,refreshStock : !this.state.refreshStock });
        //     }
        //     this.setState({ isSearch: true, refresh: !this.state.refresh,refreshStock : !this.state.refreshStock, isApiCall: true });
        // }

        // timeoutForSearchApiCall = setTimeout(() => {
        //     API.newsSearch(this.responseSearchData, this.state.query, false);
        //     API.marketSearch(this.responseSearchStockMarketData, this.state.query, false);

        // }, 500);

    }

    clearRecentSeacrchAction() {
        AsyncStorage.setItem('newsRecentSearch', JSON.stringify([]));
        this.setState({ recentNewsSearch: [] })
    }
    renderRecentView() {

        if (!this.state.loader) {
            // if (this.state.recentNewsSearch.length>0 && !this.state.isResponseCome && !this.state.isNewsCountCome && this.state.recentNewsSearch != null) 
            if (this.state.recentNewsSearch.length > 0 && this.state.isRecentViewVisible) {
                return (
                    <View style={{ flex: 1 }}>
                        <View style={styles.recentSearchMainView}>
                            <View style={styles.rescentSeachTextView}>
                                <Text style={styles.recentSearchText}>RECENT SEARCHES</Text>
                            </View>
                            <View style={styles.clearTextView}>
                                <TouchableOpacity onPress={() => this.clearRecentSeacrchAction()}>
                                    <Text style={styles.clearText}>CLEAR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <FlatList
                            //alwaysBounceVertical={false}
                            removeClippedSubviews={false}
                            extraData={this.state}
                            keyboardShouldPersistTaps='handled'
                            style={{ flex: 1 }}
                            data={this.state.recentNewsSearch}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this._renderRecentItem}
                            ItemSeparatorComponent={this.renderSeparator}
                        // ListEmptyComponent={this.ListEmptyComponent}
                        />
                    </View>
                )
            } else {
                return null
            }
        } else {
            return null
        }

    }
    render() {
        console.log(TAG, "render:: news data" + JSON.stringify(this.state.data))
        console.log(TAG, "render:: stock data" + JSON.stringify(this.state.stockData))

        return (
            <View style={globalStyles.mainViewSearchBar} removeClippedSubviews={false}>
                {this.openModal()}

                <View style={globalStyles.newsStocksearchHeaderWrapper}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={globalStyles.searchbarTopLeftView}>
                            <Ionicons name="md-search" size={Platform.OS === 'ios' ? 15 : 18} color={'gray'} />
                            <TextInput placeholder={'Search'}
                                autoFocus={true}
                                autoCorrect={false}
                                returnKeyType='search'
                                ref={'textInput'}
                                underlineColorAndroid='transparent'
                                style={globalStyles.searchbarTextInputStyle}
                                onChangeText={(query) => this.onChangeText(query)}
                                value={this.state.query} />
                            <TouchableOpacity onPress={() => this.onClearPress()}>
                                <Icon name="circle-with-cross" size={Platform.OS === 'ios' ? 15 : 18} color={'gray'} />
                            </TouchableOpacity>
                        </View>
                        <View style={globalStyles.cancelButtonSearchBarView}>
                            <TouchableOpacity onPress={() => this.onCancelPress()}>
                                <Text style={[globalStyles.cancelButton, { marginLeft: 5 }]}>{"Cancel"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                </View>
                {this.renderRecentView()}
                {(this.state.isResponseCome && (this.state.isNewsCountCome || this.state.isStockCountCome)) ?
                    <View style={{ flexDirection: 'column', alignSelf: 'flex-start', width: '100%', backgroundColor: colors.blue }}>
                        <View style={[styles.row]}>
                            <TouchableOpacity style={styles.tabContainer} onPress={() => this.renderIndicatorAndListData(1)}>
                                <View style={styles.tabView}>
                                    <Text style={[styles.tabOptionTextStyle]}>{'News'}</Text>
                                </View>
                                {(this.state.newsCount == 0) ? null : <View style={[styles.badgeView]}>
                                    <Text style={styles.badgeTextStyle}>{this.state.newsCount}</Text>
                                </View>}
                            </TouchableOpacity>


                            <TouchableOpacity style={[styles.tabContainer, { marginLeft: 15 }]} onPress={() => this.renderIndicatorAndListData(2)}>
                                <View style={styles.tabView}>
                                    <Text style={[styles.tabOptionTextStyle]}>{'Stocks'}</Text>
                                </View>
                                {(this.state.newsCountStock == 0) ? null : <View style={[styles.badgeView]}>
                                    <Text style={styles.badgeTextStyle}>{this.state.newsCountStock}</Text>
                                </View>}

                            </TouchableOpacity>

                        </View>
                        {/* <View style={[styles.row, { borderColor: 'red', borderWidth: 2 }]}> */}
                        <View style={styles.row}>
                            <View style={{ width: 80 }}>
                                {
                                    (this.state.tabOption == 1) ? <View style={[styles.indicatorLine, { marginLeft: -15 }]} />
                                        : null
                                }
                            </View>
                            <View style={{ width: 80 }}>
                                {
                                    (this.state.tabOption == 2) ? <View style={[styles.indicatorLine, { marginLeft: 5, width: 92 }]} />
                                        : null
                                }
                            </View>
                        </View>
                        {/* </View> */}
                    </View> : null}




                {(this.state.loader) ?
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}><LottieView
                        style={[{ height: 80, width: 80, alignSelf: 'center' }]}
                        source={require('../../../animations/latestloader_blue.json')}
                        ref={animation => {
                            this.animation = animation;
                        }}
                        loop={true} />
                    </View> : (this.state.isResponseCome && (this.state.isNewsCountCome || this.state.isStockCountCome)) ? (this.state.tabOption == 1) ?
                        <FlatList
                            //alwaysBounceVertical={false}
                            removeClippedSubviews={false}
                            extraData={this.state}
                            keyboardShouldPersistTaps='handled'
                            style={{ flex: 1 }}
                            data={this.state.data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this._renderItem}
                            ItemSeparatorComponent={this.renderSeparator}
                            ListEmptyComponent={this.ListEmptyComponent}
                        />
                        :
                        <FlatList
                            //alwaysBounceVertical={false}
                            removeClippedSubviews={false}
                            extraData={this.state}
                            keyboardShouldPersistTaps='handled'
                            style={{ flex: 1 }}
                            data={this.state.stockData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this._renderItemStock}
                            ItemSeparatorComponent={this.renderSeparator}
                            ListEmptyComponent={this.ListEmptyComponentStock}
                        /> : null}
            </View >
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
    checkMarketStatus,
    getShowModalSelectBankAccount,
    getShowAndroidModal

}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(NewsStockSearchModal);

