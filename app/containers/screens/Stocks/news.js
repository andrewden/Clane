import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    AsyncStorage,
    Platform,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    ActivityIndicator,
    StyleSheet,
    Modal,
    PixelRatio,
    StatusBar,
    RefreshControl
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Countly from 'countly-sdk-react-native';
import styles from './style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeTheme } from '../../../redux/actions/changeTheme';
import globalStyles from '../../../assets/styles/globalStyles';
import * as colors from '../../../assets/styles/color';
import * as globals from '../../../lib/globals';
import { ScrollView } from 'react-native-gesture-handler';
const BOUNCE_MARGIN = globals.WINDOW.height
import moment from 'moment';
import { stock } from '../../../assets/images/map'
import SafariView from 'react-native-safari-view';
import Icon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getShowModalSearchBar } from '../../../redux/actions/showModalSearchBar';
import { getShowModalNewsSearchBar } from '../../../redux/actions/showModalNewsSearchBar';
import LottieView from 'lottie-react-native';

import { getshowLoader } from "../../../redux/actions/showLoaderModal";
import { changeTabColor } from '../../../redux/actions/changeTabColorModel';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import { Thumbnail } from './react-native-thumbnail-video/src';
import YouTube, { YouTubeStandaloneAndroid } from 'react-native-youtube';
import { API } from '../../../lib/api';
import Button from '../../../components/Button';
import BackgroundTimer from 'react-native-background-timer';
import imageCacheHoc from 'react-native-image-cache-hoc';
import DeviceInfo from 'react-native-device-info';
// import NewsAndroidWebview from './newsAndroidWebview';
import NewsArticleWebView from '../InitialStock/NewsArticleWebView';
 
import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import { getShowAndroidModal } from '../../../redux/actions/showAndroidWebViewModal';

import NewsData from './newsData';
import firebase from 'react-native-firebase';
import NewsSearchScreen from './NewsSearchScreen';
import FileSystem from '../../../../node_modules/react-native-image-cache-hoc/lib/FileSystem';
var dataArticleNewsLast = null;
var dataVideo = [];
let deviceName = DeviceInfo.getModel();
var timeoutForSearchApiCall = null;

let videoDataCounter = 0

var videoURL = null;
var data = [];
// var themeStyle = null;
var _this = null;
const contentProps = (props, bottom, top) => ({
    contentInset: { top: -BOUNCE_MARGIN },
    contentOffset: { y: BOUNCE_MARGIN },
})

let originalDataVideoArray = [];
let originalDataVideoTempArray = []

const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

const propOverridePlaceholderObject = {
    component: Image,
    props: {
        style: styles.topHeaderImage,
        source: stock.news_placeholder
    }
};

const propOverridePlaceholderObjectDark = {
    component: Image,
    props: {
        style: styles.topHeaderImage,
        source: stock.news_placeholder_dark
    }
};


const propOverridePlaceholderObjectTrendingNews = {
    component: Image,
    props: {
        style: styles.topTrendingHeaderPlaceHolderImage,
        source: stock.news_placeholder_trending_news
    }
};

const propOverridePlaceholderObjectTrendingNewsDark = {
    component: Image,
    props: {
        style: styles.topTrendingHeaderPlaceHolderImage,
        source: stock.news_placeholder_trending_news_dark
    }
};

const CacheableImage = imageCacheHoc(Image, {
    validProtocols: ['http', 'https'],
    defaultPlaceholder: propOverridePlaceholderObject
});

const CacheableImageDark = imageCacheHoc(Image, {
    validProtocols: ['http', 'https'],
    defaultPlaceholder: propOverridePlaceholderObjectDark
});

const CacheableTrendingImage = imageCacheHoc(Image, {
    validProtocols: ['http', 'https'],
    defaultPlaceholder: propOverridePlaceholderObjectTrendingNews
    
});

const CacheableTrendingImageDark = imageCacheHoc(Image, {
    validProtocols: ['http', 'https'],
    defaultPlaceholder: propOverridePlaceholderObjectTrendingNewsDark
    
});

let stringData = [];
let finalData = [];
class Notifications extends Component {

    static navigationOptions = ({ navigation, screenProps, }) => {
        return {

            title: "Market News",
            titleStyle: {
                fontFamily: globals.fontClaneLetteraTextTTExtraBold
            },
            headerStyle: { backgroundColor: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.bgColor : colors.blue, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            header: (navigation.state.params != null) ? navigation.state.params.header : null,
            headerRight:
                <TouchableOpacity onPress={() => _this.setState({modalVisible:true})}>
                    <Ionicons name="ios-search" size={30} color={colors.white} style={{ marginRight: 10 }} />
                </TouchableOpacity>,
        }
    }

    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            imageData: [],
            page: 1,
            isPaginationEnd: false,
            footerLoading: false,
            isFromCache: false,
            topNewsImageURLValid: true,
            newsdata: [],
            loader:true,
            topNews: [],
            themeStyle: this.props.theme,
            dataHeader: null,
            dataTopNews: null,
            dataTrendigNews: [],
            dataArticleNews: [],
            dataArticleNewsFirst: [],
            dataArticleNewsLast: [],
            dataVideo: [],
            modalVisible: false,
            modalVisibleWebView: false,
            newsDataList: [],
            data: [],
            isSearch: false,
            footerString: globals.networkNotAvailable,
            isInternetAvailable: true,
            headerImageHeight: 0,
            refreshing: false,
            isServerError: false,
            loading:false,
            recentNewsSearch:[],
            isRecentViewVisible: false,

        }
    }

    onRefresh = () => {

        data = [];
        originalDataVideoTempArray = []
        if (globals.isInternetConnected) {
            this.setState({ refreshing: true,loader:true, dataVideo: [],  }, () => {
                API.marketGeneralNewsFeed(this.responseNewsData, false);
                });
        }

    }

    UNSAFE_componentWillMount() {
        this.props.navigation.setParams({ bgColor: (this.props.marketStatus) ? colors.blue : colors.blackThemeColor, header: null })
    }
    componentDidMount() {

        AsyncStorage.getItem("newsStockRecentSearch", (err, result) => {
            if (result != null && result != undefined) {
                let temp = [];
                temp =JSON.parse(result);
                this.setState({ recentNewsSearch: temp,isRecentViewVisible : true },()=>{
                    console.log("recentNewsSearch NEWS "+JSON.stringify(this.state.recentNewsSearch));
                    this.forceUpdate()
                    // this.setState({tempRecentNewsSearch : this.state.recentNewsSearch})
                    // recentNews = this.state.recentNewsSearch;
                })
                // for (let index = 0; index < temp.length; index++) {
                //      if (temp[index].id != null ) {
                //         this.setState({ recentNewsSearch: JSON.parse(result),isRecentViewVisible : true },()=>{
                //             console.log("recentNewsSearch NEWS "+JSON.stringify(this.state.recentNewsSearch));
                            
                //             this.forceUpdate()
                //             // this.setState({tempRecentNewsSearch : this.state.recentNewsSearch})
                //             // recentNews = this.state.recentNewsSearch;
                //         })
                //      }
                    
                // }
            }
        });

        var event = { "key": globals.event_Generalnewspagenavigation, "count": 1 };
            event.segmentation = Object.assign({}, { EventDetails: "General news" }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_Generalnewspagenavigation, result=> ");

        firebase.analytics().logEvent(globals.event_Generalnewspagenavigation, 
            Object.assign({}, { EventDetails: 'General news'}, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

        if (Platform.OS == 'ios') {
            globals.setStatusBarForSafariView();
        }
        

        themeStyle = this.props.theme
 
        this.getTimeIntervalForStockGenerlNews();
        BackgroundTimer.runBackgroundTimer(() => {
            if (globals.isInternetConnected == true) {
                console.log("Internet available NEWSS");
                API.marketGeneralNewsFeed(this.responseNewsData, false);
            }
        }, 21600000);//900000 
        
    }

    static navigateStockNewsDetail(item) {
        _this.props.navigation.navigate("stockNewsArticleDetail", { articleData: item, theme: _this.props.theme });
    }

    componentDidUpdate() {
        if (this.state.loading) {
          this.animation.play();
        }
      }

    /**
    * Method for get time interval stock news
    */
    getTimeIntervalForStockGenerlNews() {
        AsyncStorage.getItem(globals.market_general_news_timeStamp, (err, result) => {
            if (result !== null) {
                console.log("newss result");
                this.setState({ isInternetAvailable: true, refreshing: false,isServerError:false, })
                AsyncStorage.getItem(globals.market_async_general_news, (err, result) => {
                    this.setState({loader: false})
                    if (result !== null) {
                        console.log("newss market_async_news");
                        var responseData = JSON.parse(result);
                         let total = responseData.articles.length;
                        console.log("total Local" + total);
                        dataVideo = responseData.playlist || [];

                        var data = []
                         
                        let tempData = responseData.topNews && responseData.trendingNews && [responseData.topNews, responseData.trendingNews] || []
                        // let tempData = [responseData.topNews,responseData.trendingNews];
                        
                        tempData.map((item) => {
                            // item.article.type = 0
                            data.push(item.article)
                        })

                        responseData.articles.map((item) => {
                            // item.type = 1
                            data.push(item)
                        })

                        this.setState({
                            dataHeader: responseData.caption, dataTopNews: responseData.topNews, dataTrendigNews: responseData.trendingNews,
                            dataArticleNews: responseData.articles, isServerError:false, dataArticleNewsFirst: 
                            responseData.articles.slice(0, total / 2), loader:false,dataArticleNewsLast: responseData.articles.slice(total / 2, total),
                            newsDataList: data
                        }, () => {
                            this.state.dataTopNews && this.state.dataTopNews.image && Image.getSize(this.state.dataTopNews.image, (width, height) => {
                                var imageHeight = (globals.iPhoneX) ? height * (globals.WINDOW.width / width) + 10 : height * (globals.WINDOW.width / width)
                                this.setState({ headerImageHeight: imageHeight })
                            })
                            if (this.state.dataTopNews != null) {
                                this.checkValidImageOrNot(this.state.dataTopNews.image, "topnews");
                            }
                            else{
                                this.checkValidImageOrNot("", "topnews");
                            }
                            
                        })



                        if (dataVideo.length > 0) {
                            originalDataVideoArray = dataVideo.map((a, i) => ({ id: a.split("=")[1].split('&')[0], index: i, url: a }));
                            for (let index = 0; index < dataVideo.length; index++) {
                                videoURL = dataVideo[index];
                                let videoId = dataVideo[index].split("=")
                                let vvi = videoId[1];

                                API.getYouTubeTitleSnippet(this.responseYouTube, vvi, false);
                            }
                        }
                    }
                });
                // }
            } else {
                if (globals.isInternetConnected && this.state.isServerError == false) {
                    this.setState({ isInternetAvailable: true, isFromCache: false, loader:true });
                    API.marketGeneralNewsFeed(this.responseNewsData, false);
                } else {
                    this.setState({
                        //dataSourceGainer: [],
                        loader:false,
                        footerString: globals.networkNotAvailable,
                        isInternetAvailable: false,
                    });
                    console.log("isInternetAvailable " + this.state.isInternetAvailable);
                }
            }
        });
    }


    /**
     * Method for get youtube data
     */
    responseYouTube = {
        success: (response) => {
            console.log("YOUTUBE RESPONSE originalDataVideoArray " + JSON.stringify(originalDataVideoArray));

            data.push({ url: "https://www.youtube.com/watch?v=" + response.items[0].id, title: response.items[0].snippet.title, publishDate: response.items[0].snippet.publishedAt });
            console.log("FINAL YOUTUB DATA ++++ " + JSON.stringify(data));

            let tempVideoDataArrayIndex = originalDataVideoArray.findIndex(obj => obj.id == response.items[0].id);
            console.log("------obj.id:: tempVideoDataArrayIndex:: " + JSON.stringify(tempVideoDataArrayIndex));

            // let tempVideoDataArray = this.state.dataVideo

            originalDataVideoTempArray.push({ url: "https://www.youtube.com/watch?v=" + response.items[0].id, title: response.items[0].snippet.title, publishDate: response.items[0].snippet.publishedAt, id: response.items[0].id });

            originalDataVideoArray[tempVideoDataArrayIndex] = { url: "https://www.youtube.com/watch?v=" + response.items[0].id, title: response.items[0].snippet.title, publishDate: response.items[0].snippet.publishedAt, id: response.items[0].id }

            if (originalDataVideoTempArray.length == originalDataVideoArray.length) {
                this.setState({ dataVideo: originalDataVideoArray })
            }

            console.log("------tempVideoDataArray originalDataVideoArray ++++ " + JSON.stringify(originalDataVideoArray));

        },
        error: (err) => {
            _this.setState({ footerLoading: false })
        },
        complete: () => {
            // _this.setState({ footerLoading: false })
        }
    }

    /**
     * Method for get response of general stock
     */
    responseNewsData = {
        success: (response) => {
            console.log("GENERAL NEWS RESPONSE --> " + JSON.stringify(response));

            let total = response.articles.length;
            console.log("total " + total);
            dataVideo = response.playlist || [];
            var data = []
            
            this.setState({
                dataHeader: response.caption, dataTopNews: response.topNews && response.topNews, dataTrendigNews: response.trendingNews,
                dataArticleNews: response.articles, dataArticleNewsFirst: response.articles.slice(0, total / 2), dataArticleNewsLast: response.articles.slice(total / 2, total), loader:false,
                newsDataList: data, refreshing: false, isServerError: false
            }, () => {
                this.state.dataTopNews && this.state.dataTopNews.image && this.checkValidImageOrNot(response.topNews.image,"topnews") && Image.getSize(this.state.dataTopNews.image, (width, height) => {
                    var imageHeight = (globals.iPhoneX) ? height * (globals.WINDOW.width / width) + 10 : height * (globals.WINDOW.width / width)
                    this.setState({ headerImageHeight: imageHeight })
                })
            })
            if (dataVideo.length > 0) {
                console.log("DATAVIDEO:: " + JSON.stringify(dataVideo));
                originalDataVideoArray = dataVideo.map((a, i) => ({ id: a.split("=")[1].split('&')[0], index: i, url: a }));

                for (let index = 0; index < dataVideo.length; index++) {
                    videoURL = dataVideo[index];
                    let videoId = dataVideo[index].split("=")
                    let vvi = videoId[1];

                    API.getYouTubeTitleSnippet(this.responseYouTube, vvi, false);
                }
            }

            try {
                AsyncStorage.setItem(globals.market_general_news_timeStamp, new Date());
                AsyncStorage.setItem(globals.market_async_general_news, JSON.stringify(response));
            } catch (error) {
            }

        },
        error: (err) => {
            
            _this.setState({ footerLoading: false, refreshing: false,isServerError:true },()=>this.getTimeIntervalForStockGenerlNews())

        },
        complete: () => {
            // _this.setState({ footerLoading: false })
        }
    }

    /**
     * Method for call article API 
     */
    callArticleAPI(id, link, title) {
        //var arid = id.replace(/[+]+/g, '%2B');

        var payload = {
            articleId: id,
        };
        API.marketSavePersonalizationData(this.responseRedirectData, payload, true);
        this._pressHandler(link, title)
    }

    /**
     * Method for get data of redirect API 
     */
    responseRedirectData = {
        success: (response) => {
        },
        error: (err) => {
        },
        complete: () => {
        }
    }

    /**
     * Method for render open link in safariview
     */
    _pressHandler(url = "https://www.google.com", title) {
        if (Platform.OS === 'android') {
            this.setState({ modalVisibleWebView: true })
            this.props.getShowAndroidModal(true, globals.screenTitle_notifications, url, title)
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


    /**
     * Methid for render row of news item
     * @param {*} item 
     */
    renderVideo(item) {

        var youtubeID = item.url && item.url.split("=")[1]
        console.log("Youtube url-->", youtubeID)
        return (
            // <TouchableOpacity >
            <View style={[{ padding: 10, width: globals.WINDOW.width * 0.7 }, this.state.themeStyle.mainView]}>
                {(Platform.OS == "android") ?
                    <Thumbnail url={item.url} imageHeight={140} isFrom ={'news'} />
                    :
                    <YouTube
                        videoId={youtubeID}   // The YouTube video ID
                        play={false}             // control playback of video with true/false
                        fullscreen={true}       // control whether the video should play in fullscreen or inline
                        modestbranding={false}
                        showinfo={false}
                        playsInline={true}
                        controls={1}
                        color={"White"}
                        origin={"https://www.youtube.com"}
                        onReady={e => this.setState({ isReady: true })}
                        onChangeState={e => this.youtubeChangeState(e, item)}
                        onChangeQuality={e => this.setState({ quality: e.quality })}
                        onError={e => console.log("Video Error-->", JSON.stringify(e))}
                        style={{ alignSelf: 'stretch', height: 120 }}
                    />}
                <Text numberOfLines={2} style={[styles.stockDetailRelatedGeneralNewsTitle, { minWidth: 100 }, this.state.themeStyle.stockRelatedNewsTitleColor]}>{item.title}</Text>
                <Text style={[styles.stockDetailRelatedNewsAgo, this.state.themeStyle.stockDetailRelatedNewsAgo]}>{"Youtube"} {moment(item.publishDate).fromNow()}
                </Text>
            </View>
            // </TouchableOpacity>
        )
    }

    youtubeChangeState(e, item) {
        this.setState({ status: e.state })
        if (e.state == 'playing') {

            var event = { "key": globals.event_Watchedastockvideo, "count": 1 };
            event.segmentation = Object.assign({}, { EventDetails: item.title }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_Watchedastockvideo, result=> ");

            firebase.analytics().logEvent(globals.event_Watchedastockvideo,Object.assign({}, { EventDetails: item.title }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
        }
    }

    renderDateTime(item) {
        // var dd = this.timeStamp(item.publishedDate);
        // console.log("Publish DAtess "+dd);
        var data = globals.checkTimeStamp(item.publishedDate)
        console.log("Publish DAtess " + data);
        if (data == '1') {
            return (
                <Text style={[styles.generalArticleSmall, this.state.themeStyle.generalArticleSmall]}>{item.source} - {'Today'} - {item.author}
                </Text>
            )
        }
        else if (data == '0') {
            <Text style={[styles.generalArticleSmall, this.state.themeStyle.generalArticleSmall]}>{item.source} - {'Yesterday'} - {item.author}
            </Text>
        }
        else {
            return (
                <Text style={[styles.generalArticleSmall, this.state.themeStyle.generalArticleSmall]}>{item.source} - {moment(item.publishedDate).format('MM/DD/YY')} - {item.author}
                </Text>
            )
        }

    }

    renderCacheTrendingImage(item){
        console.log("Trending Image status "+item.image);
        let sdsd = this.checkValidImageOrNot(item.image,"trending");

        if (sdsd == true) {
            return (<CacheableTrendingImage style={styles.trendingHeaderImage}  source={{ uri: encodeURI(item.image) }} permanent={true} />)
        }
        else{
            return (<Text>sdfsdfsd</Text>);
        }
    }

    navigateToStockNewsDetailScreen(item){
      firebase.analytics().logEvent(globals.event_TrendingNews, 
        Object.assign({}, { EventDetails: 'Trending news article details'}, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
  
      var event = { "key": globals.event_TrendingNews, "count": 1 };
      event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
      Countly.recordEvent(event);
      console.log("=====segmentation record event dashboardtopnews, result=> ");

      this.props.navigation.navigate("stockNewsArticleDetail", { articleData: item, theme: this.props.theme })
    }


    /**
     * Methid for render row of news item
     * @param {*} item 
     */
    renderImage(item) {
        if (this.props.marketStatus) {
            return (
                <TouchableWithoutFeedback onPress={() => this.navigateToStockNewsDetailScreen(item)}>
                    <View style={[{ marginLeft: 10,   }, this.state.themeStyle.mainView]}>
                        {/* <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }}></Image> */}
                        {/* {this.renderCacheTrendingImage(item)} */}
                        {item.image && <CacheableTrendingImage  style={styles.trendingHeaderImage} source={{ uri: encodeURI(item.image) }} permanent={true} />}
    
                    </View>
                </TouchableWithoutFeedback>
            )
        }else {
            return (
                <TouchableWithoutFeedback onPress={() => this.navigateToStockNewsDetailScreen(item)}>
                    <View style={[{ marginLeft: 10,   }, this.state.themeStyle.mainView]}>
                        {/* <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }}></Image> */}
                        {/* {this.renderCacheTrendingImage(item)} */}
                        {item.image && <CacheableTrendingImageDark  style={styles.trendingHeaderImage} source={{ uri: encodeURI(item.image) }} permanent={true} />}
    
                    </View>
                </TouchableWithoutFeedback>
            )
        }
        
    }

    /**
     * Method for render row of news item
     * @param {*} item 
     */
    renderRow(item) {
        return (
            <TouchableOpacity onPress={() => (item.tags && (item.tags[0] == "topnews" || item.tags[0] == "trendingnews")) ? this.setState({ modalVisible: false }, () => { this.props.navigation.navigate("stockNewsArticleDetail", { articleData: item, theme: this.props.theme }) }) : this.callArticleAPI(item.id, item.linkToArticle, item.title)}>
                <View style={[{ padding: 10 }, this.state.themeStyle.stockMainView]}>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={[styles.generalNewsArticleTitle, this.state.themeStyle.generalNewsArticleTitle]}>{item.title}</Text>
                        {this.renderDateTime(item)}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    /**
     * Method for render footer
     */

    renderFooter = () => {
        if (globals.isInternetConnected) {

            if (!this.state.isFromCache) {
                return (
                    (this.state.isPaginationEnd == false) ? <View style={[styles.loadmoreView, this.state.themeStyle.loadmoreView]}>
                        <Image source={stock.load_more} style={[styles.loadmore]} />
                        <Text style={[styles.loadmoreTextView, this.state.themeStyle.loadmoreTextView]}>{globals.swipeLoadMore}</Text>
                    </View> : null
                )
            }
            else {
                return (
                    <View></View>
                )
            }
        } else {
            return (
                <View></View>
            )
        }
    };

    /**
     * Method for render seprator
     */
    separator = () => {
        return (
            <View style={[styles.articleSeprator, this.state.themeStyle.articleSeprator]} />
        );
    };



    componentDidUpdate(prevProps, prevState) {
        StatusBar.setHidden(false)
    }

    componentWillReceiveProps(nextProps) {

        this.setState({ themeStyle: nextProps.theme })

        if (this.marketStatus !== nextProps.marketStatus) {
            this.marketStatus = nextProps.marketStatus
            console.log("nextProps.marketStatus " + nextProps.marketStatus);
            this.props.navigation.setParams({ bgColor: (nextProps.marketStatus) ? colors.blue : colors.blackThemeColor })
        }

    }


    static _goToStockDetaill(data) {
        _this.props.navigation.navigate('StockDetails', data)
    }

    /**this.sendDataToNewsSearchDetail(item, 'recent')
     * Method for render item 
     */
    _renderItem = ({ item, index }) => {

        if (item.stock_id !=null) {
            return (<Text>{'sds'}</Text>)
        } else {
            return (
                //   <TouchableOpacity onPress={() => this.setState({ modalVisible: false, query: '', data: [] }, () => { this.props.navigation.navigate("NewsSearchDetail", { artilceId: item.id, title : item.title, theme: this.props.theme }) })}>
                <TouchableOpacity onPress={()=>this.sendDataToNewsSearchDetail(item, 'normal',this.state.query)}>
                    
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
      
    }

    /**
     * Method for render clear text
     */
    clearTextInputAction() {
        this.setState({ query: '', data: [], isSearch: false })
    }


    /**
     * Method for render on change text
     */

    onChangeText(query) {
        
        clearTimeout(timeoutForSearchApiCall);
        // query = query.trim();
        this.setState({ query })
        if (query === '') {
            this.setState({ isSearch: false, data: this.state.recentSearch, refresh: !this.state.refresh });
        } else {
            if (!this.state.isSearch) {
                this.setState({ data: [], refresh: !this.state.refresh });
            }
            this.setState({ isSearch: true, refresh: !this.state.refresh, isApiCall: true });
        }
        if (query.length == 0) {
            if (this.state.recentNewsSearch.length > 0) {
                this.setState({isRecentViewVisible: true})
            }
        }
        timeoutForSearchApiCall = setTimeout(() => {
           // API.newsSearch(this.responseSearchData, query, false);
            if (query.length > 0) {
                if (globals.isInternetConnected) {
                    this.setState({ loading : true, isRecentViewVisible: false  },()=>{
                        this.animation.play();
                      })
                    API.getNewsSearchArticle(this.responseSearchDataNews, query, false);
                }
            }
            else{
                this.setState({loader: false})
                
            }
            
        }, 1000);
    }

   /**
     * method for get response of news search data api latest
     */
    responseSearchDataNews = {
      success: (response) => {
          this.setState({loading: false, isRecentViewVisible: false})
        if (this.state.isSearch == false) {
            this.setState({ data: this.state.recentSearch, refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
        } else {
            if (response != null && response.length != 0) {
                this.setState({ newsCount: response.data.length })
                this.setState({ data: response.data, refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
            } else {
                this.setState({ newsCount: response.data.length })
                this.setState({ data: [], refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
            }
        }
    },
    error: (err) => {
        this.setState({loading: false, isRecentViewVisible: false})
        this.setState({ data: [], refresh: !this.state.refresh, isApiCall: false, newsCount: 0 }, () => { this.forceUpdate() })
    },
    complete: () => {
    }
    }

    /**
      * Method for get response of market search API
      */
    responseSearchData = {
        success: (response) => {
            if (this.state.isSearch == false) {
                console.log("isSearch false");
                this.setState({ data: this.state.recentSearch, refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
            } else {
                if (response != null && response.length != 0) {
                    console.log("isSearch true 1");
                    this.setState({ data: response, refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
                } else {
                    console.log("isSearch true 2");
                    this.setState({ data: [], refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
                }
            }
        },
        error: (err) => {
            this.setState({ data: [], refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
        },
        complete: () => {
        }
    }

    /**
     * Method for render seprator
     */
    renderSeparator() {
        return <View style={{ height: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1, marginHorizontal: 10, backgroundColor: '#E1E1E1' }}></View>
    }

    /**
     * Method for get effect string from search text
     */
    geteffectString(value, index, fontSize, fontWeight) {
        var isMatch = false
        var isAdded = false
        var query = this.state.query.toLowerCase();
        var fIndex, lIndex;
        var re = new RegExp(query, 'g');
        if(value!=undefined){
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
     * Method for open modal
     */
    openModal() {
        return (
            <Modal animationType='slide' visible={this.state.modalVisibleWebView} onRequestClose={() => { Notifications.handleCloseModalWebview() }}>
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
     * Method for handle close modal
     */
    handleCloseModal() {
        this.refs.textInput.setNativeProps({ 'editable': false });
        //this.setState({ modalVisible: false, query: '', data: [], isSearch: false })
        _this.props.getShowModalNewsSearchBar(false)
        this.setState({ modalVisible: false })
        this.setState({ query: '', data: [], isSearch: false })
    }

    ListEmptyComponent() {

        if (!globals.isInternetConnected) {
            if (_this.state.query != null && _this.state.query.length > 1) {
                console.log("DSDSDSDS");

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
        if (_this.state.query && _this.state.query != "" && !_this.state.isApiCall && _this.state.data && _this.state.data.length <= 0) {
            return (
                <View style={styles.noRecordFoundView}>
                    <Image source={require("../../../assets/images/stock/noRecordFoundNews.png")} style={{ width: 54, height: 45 }} resizeMode={"contain"} />
                    <Text style={styles.noRecordFoundText}>{"Sorry, results related to  \"" + _this.state.query + "\" could not be found"}</Text>
                </View>
            )
        } else {
            return null
        }
    }
    clearRecentSeacrchAction(){
        AsyncStorage.setItem('newsStockRecentSearch', JSON.stringify([]));
        this.setState({ recentNewsSearch: [] })
        stringData = [];
        finalData = [];

    }
    checkIfNewsIDExists(objID) {
        return this.state.recentNewsSearch.some(function (el) {
            return el.id === objID;
        });
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

    sendDataToNewsSearchDetail(object, isfrom,value){
        if (isfrom=='normal'){
            var tempArray = this.state.recentNewsSearch;
            console.log("this.checkIfNewsIDExists(object.id) " +this.checkIfNewsIDExists(object.id) + " " + object.id);
                let isFound = this.checkDuplicateValue(value, finalData);
                if (!isFound) {
                    if (tempArray.length == 0) {
                        stringData.unshift({ title: value })
                        tempArray = stringData;
                    }
                    else {
                        let unique = this.getUnique(tempArray, 'title')
                        console.log("unique---> " + JSON.stringify(unique));
                        tempArray = unique;
                        tempArray.unshift({ title: value })
                    }
                    this.setState({ recentNewsSearch: tempArray,   })
                    if (tempArray.length > 2) {
                        tempArray.pop()
                    }
                     
                    finalData = tempArray;
                   AsyncStorage.setItem('newsStockRecentSearch', JSON.stringify(tempArray));
                   this.setState({ modalVisible: false, query: '', data: [] }, () => { this.props.navigation.navigate("NewsSearchDetail", { artilceId: object.id, title : object.title, theme: this.props.theme }) })
      
                }else {
                    this.setState({ modalVisible: false, query: '', data: [] }, () => { this.props.navigation.navigate("NewsSearchDetail", { artilceId: object.id, title : object.title, theme: this.props.theme }) })
                }
                           
        }
        else {
            this.setState({ modalVisible: false, query: '', data: [] }, () => { this.props.navigation.navigate("NewsSearchDetail", { artilceId: object.id, title : object.title, theme: this.props.theme }) })
        }
    }
        
        
    callSearchAPI(item){
        // alert(JSON.stringify(item))
        this.setState({query: item.title, isRecentViewVisible: false, },()=>{
            this.onChangeText(this.state.query)
        })
        this.setState({ loading : true, isRecentViewVisible: false  },()=>{
            this.animation.play();
          })
        // this.setState({ query: item.title, loader: true,  isRecentViewVisible: false }, () => {
        //     this.animation.play();
        // })
    }

    _renderRecentItem = ({ item, index }) => {
        // console.log("_renderRecentItem "+ item.title);
        
        return (
            <TouchableOpacity onPress={() => this.callSearchAPI(item)}>
                 
                 
                <View style={styles.searchScreenItem}>
                <Text numberOfLines={2} style={styles.searchScreenItemTitleText}>{item.title}</Text>
                    {/* <View style={styles.searchScreenItemView}>
                        <View style={styles.searchScreenItemLeftView}>
                        <Text numberOfLines={2} style={styles.searchScreenItemTitleText}>{item && item.title  }</Text>
                            
                        </View>
                    </View>
                    <View style={styles.searchScreenItemView}>
                        <View style={styles.searchScreenItemLeftView}>
                        <Text numberOfLines={1} style={styles.searchScreenItemSubtitleText}>{item && item.source }</Text>
                            
                        </View>
                    </View> */}
                </View>

            </TouchableOpacity>
        )
    }

    renderRecentView()
    {

        if (!this.state.loader) {
            if (this.state.recentNewsSearch.length > 0 && this.state.isRecentViewVisible) {
                return( 
                    <View style={{flex:1}}>
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
            }else{
                return null
            }
        }
        else{
            return null
        }
       
    }

    /**
     * Method for search modal open
     */
    searchModal() {
        return (
            <Modal animationType='fade' visible={this.state.modalVisible} onRequestClose={() => { this.handleCloseModal() }}>
                <View style={globalStyles.mainViewSearchBar} removeClippedSubviews={false}>
                    <View style={globalStyles.searchbarTopView}>
                        <View style={globalStyles.searchbarTopLeftView}>
                            <Ionicons name="md-search" size={Platform.OS === 'ios' ? 15 : 18} color={'gray'} />
                            <TextInput placeholder={"Search News"}
                                autoFocus={true}
                                autoCorrect={false}
                                returnKeyType='search'
                                ref={'textInput'}
                                underlineColorAndroid='transparent'
                                style={globalStyles.searchbarTextInputStyle}
                                onChangeText={(query) => this.onChangeText(query)}
                                value={this.state.query} />
                            <TouchableOpacity onPress={() => this.clearTextInputAction(false)}>
                                <Icon name="circle-with-cross" size={Platform.OS === 'ios' ? 15 : 18} color={'gray'} />
                            </TouchableOpacity>
                        </View>
                        <View style={globalStyles.cancelButtonSearchBarView}>
                            <TouchableOpacity onPress={() => this.handleCloseModal()}>
                                <Text style={[globalStyles.cancelButton, { marginLeft: 5 }]}>{"Cancel"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {this.renderRecentView()}
                    <View style={styles.searchbarBottomView} removeClippedSubviews={false}>

                        <KeyboardAvoidingView
                            removeClippedSubviews={false}
                            keyboardVerticalOffset={75}
                            behavior={Platform.OS === 'android' ? '' : 'padding'}
                            style={{ flex: 1 }}
                        >

                {(this.state.loading) ?  <View style={{flex:1, justifyContent:'center', }}><LottieView
                style={[{height: 80, width: 80,  alignSelf: 'center' }]}
                source={require('../../../animations/latestloader_blue.json')}
                ref={animation => {
                  this.animation = animation;
                }}
                loop={true} />
                </View> : <View style={{ paddingBottom: (globals.iPhoneX) ? 10 : 0, flex: 1 }}>
                                <FlatList
                                    alwaysBounceVertical={false}
                                    removeClippedSubviews={false}
                                    extraData={this.state}
                                    keyboardShouldPersistTaps='handled'
                                    style={styles.searchScreenflatList}
                                    data={this.state.data}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={this._renderItem}
                                    ItemSeparatorComponent={this.renderSeparator}
                                    ListEmptyComponent={this.ListEmptyComponent}
                                />
                            </View>
                }
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </Modal>
        )
    }

    static showStatusBar() {
        // if (Platform.OS == 'ios') {
        StatusBar.setHidden(false, 'none');

        // }

    }
    tryAgainButtonClick() {
        if (globals.isInternetConnected) {
            this.setState({ isInternetAvailable: true, isFromCache: false });
            API.marketGeneralNewsFeed(this.responseNewsData, false);
        }
        // this.getTimeIntervalForStockGenerlNews()
    }


    checkValidImageOrNot(imageName,portion) {
        console.log("checkValidImageOrNot: " + imageName);
        let returnValue = false;
        if (imageName!=null && imageName != undefined) {
            if (imageName.includes('.jpg') || imageName.includes('.jpeg') || imageName.includes('.png')) {
                returnValue = true;
                this.setState({ topNewsImageURLValid: true })
            }
            else {
                returnValue = false;
                this.setState({ topNewsImageURLValid: false })
            }
            if (portion == 'topnews') {
                this.props.navigation.setParams({ bgColor: (this.props.marketStatus) ? colors.blue : colors.blackThemeColor, header: (!returnValue) ? undefined : null })
            } 
        }else {
            if (portion == 'topnews') {
                this.props.navigation.setParams({ bgColor: (this.props.marketStatus) ? colors.blue : colors.blackThemeColor, header: (!returnValue) ? undefined : null })
            } 
            this.setState({ topNewsImageURLValid: false })
            returnValue = false;
        }
              
       

        return returnValue;
    }

    displayText(isError){
        if (isError) {
                return(
                    <Text style={[styles.incidesNotAbleToFetch, themeStyle.trendingFooterText, {textAlign: 'center'}]}>{globals.timeoutMessage}</Text>
                )
            
        }else{
            
            return(
                <Text></Text>
            )
        }
        
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

    navigateToTopNewsDetail(){
      firebase.analytics().logEvent(globals.event_TopNews,
        Object.assign({}, { EventDetails: 'Top news article details' }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));

      var event = { "key": globals.event_TopNews, "count": 1 };
      event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
      Countly.recordEvent(event);
      console.log("=====segmentation record event topnews, result=> ");

      this.props.navigation.navigate("stockNewsArticleDetail", { articleData: this.state.dataTopNews, theme: this.props.theme })
    }
    clickModal(){
        this.setState({ modalVisible: true },()=>{
            if (this.state.recentNewsSearch.length > 0) {
                this.setState({isRecentViewVisible: true})
            }else{
                this.setState({isRecentViewVisible: false})
            }
        })
    }

    render() {
        // alert(this.state.dataTopNews.image)
        if (!this.state.loader) {
            return (
                <SafeAreaView style={[globalStyles.safeviewStyle, this.state.themeStyle.mainView]}>
                    <NavigationEvents
                        onDidFocus={payload => {
                            // alert("News FOCUS")
                            AsyncStorage.setItem(globals.currentNavigator, "News");
                            globals.currentNavigatorValue = 'News';
                        }}
                    />
                    <View style={(Platform.OS == 'ios' && this.state.topNewsImageURLValid ) ? [styles.statusBarStyle] : [this.state.themeStyle.mainView]} />
                    {this.searchModal()}
                    {this.openModal()}
                    {(this.state.isServerError) ? <View style={[styles.indicesFetchNoAbleToFetchMain, themeStyle.trendingFooterMain,]}>
                    <Text style={[styles.incidesNotAbleToFetch, themeStyle.trendingFooterText, {textAlign: 'center'}]}>{globals.timeoutMessage}</Text>
                    </View> : <View style={[styles.searchScreenItemLeftView, this.state.themeStyle.mainView]}>
                            <View style={[styles.topHeaderTransparentView, this.state.themeStyle.trendingFooterMain]}>
                                {(this.state.isInternetAvailable) ?
                                    <ScrollView alwaysBounceVertical={false} refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                            tintColor={(this.props.marketStatus) ? colors.blackColor : colors.white}
                                        />
                                    }
                                        style={{ marginBottom: 50, marginTop: (this.state.dataTopNews == null) ? ((globals.iPhoneX) ? 44 : 10) : 0 }}>
                                        <View style={this.state.themeStyle.mainView}>
                                            {(this.state.dataTopNews != null && this.state.topNewsImageURLValid) ?
                                                <TouchableWithoutFeedback onPress={() => this.navigateToTopNewsDetail()}>
                                                    <View>
                                                        <View >
    
                                                            {(this.state.dataTopNews != null && this.state.dataTopNews != undefined) ? (this.state.dataTopNews.image != null && this.state.dataTopNews.image != undefined) ?(this.props.marketStatus) ? <CacheableImage style={[styles.topHeaderImage]} resizeMode='cover' source={{ uri: this.state.dataTopNews.image }} permanent={true} /> :<CacheableImageDark style={[styles.topHeaderImage]} resizeMode='cover' source={{ uri: this.state.dataTopNews.image }} permanent={true} /> : null : null  }
                                                            <View style={[styles.topHeaderTransparent,]}>
                                                                <View style={{ flex: 0.6, }}>
                                                                    <Text style={styles.marketNewsTitle}>Top News</Text>
                                                                </View>
                                                                <View style={styles.topSearch}>
                                                                    <TouchableOpacity onPress={()=>this.clickModal()}>
                                                                    {/* <TouchableOpacity onPress={() => this.props.getShowModalNewsSearchBar(true)}> */}
                                                                        <Ionicons name="ios-search" size={30} color={colors.white} style={{
                                                                            marginRight: 10,
                                                                            paddingLeft: 10,
                                                                            textShadowColor: 'rgba(0, 0, 0, 0.3)',
                                                                            textShadowOffset: { width: -1, height: 1 },
                                                                            textShadowRadius: 5
                                                                        }} />
                                                                    </TouchableOpacity>
                                                                </View>
    
                                                            </View>
                                                        </View>
                                                        <View style={[this.state.themeStyle.mainView, { padding: 10 }]}>
                                                            <Text style={[styles.topNewsTitle, this.state.themeStyle.topNewsTitleColor]}>{this.state.dataTopNews.title}</Text>
                                                            <Text style={[styles.topNewsHours, this.state.themeStyle.topNewsMetadata]}>{moment(this.state.dataTopNews.publishedDate).fromNow()}</Text>
                                                        </View>
                                                        <View style={[styles.horizontalSepratorGeneralNewsMain, this.state.themeStyle.relatedNewsSeparator]} />
                                                    </View>
                                                </TouchableWithoutFeedback> : null}
    
                                        </View>
    
                                        <View >
                                            {(this.state.dataTrendigNews != null && this.state.dataTrendigNews.length > 0) ?
                                                <View style={{  marginRight: 10, marginTop: (this.state.topNewsImageURLValid) ? 0 : 20 }}>
                                                    <View style={[{ paddingTop: 10,paddingLeft: 10, paddingRight: 10, marginBottom:10 }]}>
                                                        <Text style={[styles.topNewsHeaderText, this.state.themeStyle.topNewsTitleColor]}>{this.state.dataHeader && this.state.dataHeader.headlineTitle && this.state.dataHeader.headlineTitle}</Text>
                                                        <Text style={[styles.topCaption, this.state.themeStyle.topNewsTitleColor]}>{this.state.dataHeader && this.state.dataHeader.headlineCaption && this.state.dataHeader.headlineCaption}</Text>
                                                        <Text style={[styles.topNewsHours, this.state.themeStyle.topNewsMetadata]}>{moment(this.state.dataTrendigNews[0].publishedDate).fromNow()}</Text>
                                                    </View>
                                                    <FlatList
                                                        ref={"myFlatList"}
                                                        data={this.state.dataTrendigNews}
                                                        style={{ height: 80, marginBottom: 10 }}
                                                        renderItem={({ item }) => this.renderImage(item)}
                                                        keyExtractor={(item, index) => index.toString()}
                                                        horizontal={true}
                                                        showsHorizontalScrollIndicator={false}
                                                    />
    
                                                    <View style={[styles.horizontalSepratorGeneralNewsMain, this.state.themeStyle.relatedNewsSeparator]} /></View>
                                                : null}
                                        </View>
    
    
                                        {(this.state.dataArticleNewsFirst != null && this.state.dataArticleNewsFirst.length > 0) ? <FlatList
                                            ref={"myFlatList"}
                                            style={this.state.themeStyle.mainView}
                                            data={this.state.dataArticleNewsFirst}
                                            renderItem={({ item }) => this.renderRow(item)}
                                            keyExtractor={(item, index) => index.toString()}
                                            ItemSeparatorComponent={this.separator}
                                        /> : null}
    
                                        {(this.state.dataVideo != null && this.state.dataVideo.length > 0) ?
                                            <FlatList
                                                ref={"myFlatList"}
                                                data={this.state.dataVideo}
                                                style={this.state.themeStyle.mainView}
                                                renderItem={({ item }) => this.renderVideo(item)}
                                                keyExtractor={(item, index) => index.toString()}
                                                horizontal={true}
                                                refreshing={this.state.refreshing}
                                                showsHorizontalScrollIndicator={false}
                                            /> : null}
    
                                        <View style={[styles.horizontalSepratorGeneralNewsMain, this.state.themeStyle.relatedNewsSeparator]} />
    
                                        {(this.state.dataArticleNewsLast != null && this.state.dataArticleNewsLast.length > 0) ?
                                            <FlatList
                                                ref={"myFlatList"}
                                                data={this.state.dataArticleNewsLast}
                                                style={this.state.themeStyle.mainView}
                                                renderItem={({ item }) => this.renderRow(item)}
                                                keyExtractor={(item, index) => index.toString()}
                                                ItemSeparatorComponent={this.separator}
                                            /> : null}
    
    
                                        {(this.state.dataArticleNews != null && this.state.dataArticleNews.length > 0) ?
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('StockNewsShowMore')}>
                                                <View style={{ paddingVertical: 5, marginLeft: 10, marginTop: 10, marginBottom: 10 }}>
    
                                                    <Text style={[this.state.themeStyle.generalNewsFeedShowMore, styles.showMoreText]}>{"SHOW MORE"}</Text>
    
                                                </View>
                                            </TouchableOpacity> : null}
    
                                    </ScrollView> :
    
                                    <View style={[{ width: globals.WINDOW.width, height: globals.WINDOW.height, alignItems: 'center' }]}>
                                        <View style={styles.noInternetTextView}>
                                            <Text style={[styles.trendingFooterText, this.state.themeStyle.trendingFooterText, {textAlign: 'center'}]}>{this.state.footerString}
                                            </Text>
                                        </View> 
                                        <View style={{ height: (globals.iPhoneX) ? 160 : 126 }}>
                                            <Button
                                                onPress={() => this.tryAgainButtonClick()}
                                                textStyle={[styles.buttonText, this.state.themeStyle.buttonText]}
                                                buttonStyles={[styles.buttonStyles, this.state.themeStyle.buttonStyles]}
                                                text={globals.tryAgain}></Button>
                                        </View>
                                    </View>
                                }
                            </View>
                        </View>}
                </SafeAreaView>
            )
        }else{
            return (<SafeAreaView style={[globalStyles.safeviewStyle, this.state.themeStyle.mainRenderView]}>
                <NavigationEvents
                    onDidFocus={payload => {
                        // alert("News FOCUS")
                        AsyncStorage.setItem(globals.currentNavigator, "News");
                        globals.currentNavigatorValue = 'News';
                    }}
                />
                <View style={{flex:1, alignSelf:'center', justifyContent:'center'}}>
                <ActivityIndicator size="large" color={(this.props.marketStatus ? colors.blackColor : colors.white)} />
                </View>
            </SafeAreaView>)
           
        }
        
    }
}

// ********************** Model mapping method **********************
const mapStateToProps = (state, ownProps) => {
    return {
        loader: state.claneLoader_red.loader,
        theme: state.changeTheme_red.theme,
        color: state.changeTabColor_red.color,
        searchbar_modal: state.showModalNewsSearchBar_red.searchbar_modal,
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
    getShowModalSearchBar,
    getShowModalNewsSearchBar,
    getShowAndroidModal,
    getShowModalSelectBankAccount
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);