import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    FlatList,
    TouchableOpacity,
    AsyncStorage,
    BackHandler,
    SafeAreaView, StatusBar, Platform, WebView, ActivityIndicator, Modal
} from 'react-native';
import Countly from 'countly-sdk-react-native';
import styles from './style';
import { connect } from 'react-redux';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import firebase from 'react-native-firebase';
import { bindActionCreators } from 'redux';
import { changeTheme } from '../../../redux/actions/changeTheme';
import globalStyles from '../../../assets/styles/globalStyles';
import * as colors from '../../../assets/styles/color';
import * as globals from '../../../lib/globals';
import { ScrollView } from 'react-native-gesture-handler';
import Share from 'react-native-share';
import { API } from '../../../lib/api';
const BOUNCE_MARGIN = globals.WINDOW.height
import moment from 'moment';
import { stock } from '../../../assets/images/map'
import SafariView from 'react-native-safari-view';
import Icon from 'react-native-vector-icons/dist/EvilIcons';
// import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import { getShowAndroidModal } from '../../../redux/actions/showAndroidWebViewModal';

import news from '../Stocks/news'
import stockDetails from '../Stocks/stockDetails';
import stockNewsLoadMore from '../Stocks/stockNewsLoadMore';
import StockNewsShowMore from '../Stocks/newsArticleShowMore';
import stockNewsArticleDetail from '../Stocks/stockNewsArticleDetail';
import DashboardNewsArticleDetail from "../InitialStock/dashboardNewsArticleDetail"
import CategoryNewsArticle from '../Stocks/categoryNewsArticle'
import newsStockSearchModal from '../InitialStock/newsStockSearchModal';
import NewsSearchDetail from '../InitialStock/newsSearchDetail'
import Category from '../Stocks/category'
import branch, { BranchEvent } from 'react-native-branch';

// var themeStyle = null;
var _this = null;
var shareOptionObj = {
    title: "Clane",
    subject: "Clane"
}

class NewsArticleWebView extends Component {

    constructor(props) {
        super(props);
        console.log("props NewsAndroidWebview" + (this.props.open_url) + "--->" + (this.props.navigation))
        _this = this;
        this.state = {
            // themeStyle: this.props.theme,
            marketStatus: this.props.marketStatus,
            visible: true,
            article_title: (this.props.navigation != undefined) ? this.props.navigation.state.params.title : this.props.article_title,
            article_url: (this.props.navigation != undefined) ? this.props.navigation.state.params.open_url : this.props.open_url,
            image_url:''
        }
    }

    handleBackPress = () => {
        this.goBack(); // works best when the goBack is async
        return true;
      }
    componentWillUnmount(){
        // this.backHandler.remove();
        console.log("UNMOOUNT WEBVIEW");
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    /**
     * method for hide loader
     */
    hideSpinner() {
        this.setState({ visible: false });
    }

    /**
     * componentWillReceiveProps
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {

        // this.setState({ themeStyle: nextProps.theme })
        // console.log("NEXTPRORP: " + JSON.stringify(nextProps));

        // if (this.marketStatus !== nextProps.marketStatus) {
        //     // this.marketStatus = nextProps.marketStatus
        //     this.setState({ marketStatus: nextProps.marketStatus })
        // }
    }

    componentDidMount() {
        console.log("AndroidWebVIew Propers "+JSON.stringify(this.props));
        this.setState({image_url : this.props.imagePath})
       BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      }

    async shareMsg() {

        if (globals.isInternetConnected) {
            var customlink = ((_this.state.open_url ? _this.state.open_url : _this.state.open_url))
            console.log('====================================')
            console.log('customlink stocknewsarticledetail : ' + customlink)
            console.log('====================================')

            if(this.state.image_url != null && this.state.image_url != undefined && this.state.image_url != ''){
            let branchUniversalObject = await branch.createBranchUniversalObject('news', {
                locallyIndex: true,
                title: _this.state.article_title,
                contentDescription: _this.state.article_title,
                contentImageUrl: this.state.image_url,
                // contentMetadata: {
                //     ratingAverage: 4.2,
                //     customMetadata: {
                //         prop1: 'test',
                //         prop2: 'abc'
                //     }
                // }
            })

            let shareOptions = { messageHeader: '', messageBody: _this.state.article_title + "\n\n" + "- via Clane App:" + "\n" }
            let linkProperties = { feature: 'share', channel: 'ClaneApp' }
            let controlParams = { $desktop_url: customlink, $ios_url: customlink, $android_url: customlink }
            console.log("controlParams-------->" + JSON.stringify(controlParams))
            let { channel, completed, error } = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)

            var event = { "key": globals.event_Sharedanewsarticle, "count": 1 };
            event.segmentation = Object.assign({}, { EventDetails: article_title }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
            Countly.recordEvent(event);
            console.log("=====segmentation record event globals.event_Sharedanewsarticle, result=> ");
          }
          else{
            let branchUniversalObject = await branch.createBranchUniversalObject('news', {
              locallyIndex: true,
              title: _this.state.article_title,
              contentDescription: _this.state.article_title,
              // contentMetadata: {
              //     ratingAverage: 4.2,
              //     customMetadata: {
              //         prop1: 'test',
              //         prop2: 'abc'
              //     }
              // }
          })

          let shareOptions = { messageHeader: '', messageBody: _this.state.article_title + "\n\n" + "- via Clane App:" + "\n" }
          let linkProperties = { feature: 'share', channel: 'ClaneApp' }
          let controlParams = { $desktop_url: customlink, $ios_url: customlink, $android_url: customlink }
          console.log("controlParams-------->" + JSON.stringify(controlParams))
          let { channel, completed, error } = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)

          var event = { "key": globals.event_Sharedanewsarticle, "count": 1 };
          event.segmentation = Object.assign({}, { EventDetails: article_title }, globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));
          Countly.recordEvent(event);
          console.log("=====segmentation record event globals.event_Sharedanewsarticle, result=> ");
          }
            firebase.analytics().logEvent(globals.event_Sharedanewsarticle,
                Object.assign({}, { EventDetails: article_title }, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)));
        }
        else {
            Alert.alert(globals.APP_NAME, globals.networkNotAvailable)
        }


    }
    // shareMsg() {
    //     // if (this.props.article_title != null && this.props.open_url != null) {
    //     //     shareOptionObj['message'] = (this.props.article_title)
    //     //         + "\nPlease check this article: " + (this.props.open_url)
    //     // }
    //     // var tempObj = Object.assign({}, shareOptionObj)
    //     // Share.open(tempObj).catch(err => console.log(err))

    // }


    closeWebView() {
        if (this.props.navigation != undefined) {
            this.props.navigation.goBack(null);
        }
        else {
            if (this.props.screen_name == globals.screenTitle_notifications) {
                news.handleCloseModalWebview();
            }
            else if (this.props.screen_name == globals.screenTitle_stockdetail) {
                stockDetails.handleCloseModalWebview();
            }
            else if (this.props.screen_name == globals.screenTitle_news_load_more) {
                stockNewsLoadMore.handleCloseModalWebview();
            }
            else if (this.props.screen_name == globals.screenTitle_news_show_more) {
                StockNewsShowMore.handleCloseModalWebview();
            }
            else if (this.props.screen_name == globals.screenTitle_stock_news_article_detail) {
                stockNewsArticleDetail.handleCloseModalWebview();
            }
            else if (this.props.screen_name == globals.screenTitle_dashboardNewsArticleDetail) {
                DashboardNewsArticleDetail.handleCloseModalWebview();
            }
            else if (this.props.screen_name == globals.screenTitle_NewsStockSearchModal) {
                newsStockSearchModal.handleCloseModalWebview();
            }
            else if (this.props.screen_name == globals.screenTitle_Category) {
                Category.handleCloseModalWebview();
            }
            else if (this.props.screen_name == globals.screenTitle_CategoryNewsArticle) {
                CategoryNewsArticle.handleCloseModalWebview();
            }
            else if (this.props.screen_name == globals.screenTitle_newsSearchDetail) {
              NewsSearchDetail.handleCloseModalWebview();
          }
        }

    }
    render() {
      if(globals.isInternetConnected){
        return (
            <View style={[globalStyles.safeviewStyle, { flex: 1, backgroundColor: colors.white }]}>
                <View style={{  backgroundColor: colors.blue, flexDirection:'row' }}>
                    <TouchableOpacity onPress={() => this.closeWebView()}>
                        <View style={{ alignSelf: 'flex-start', padding: 10}}>
                            <Icon name="close" size={30} color={colors.white} />
                        </View>
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => { WebViewRef && WebViewRef.reload(); }}>
                            <View style={{ padding: 10 }}>
                                <Icon name="refresh" size={30} color={colors.white} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.shareMsg()}>
                            <View style={{ padding: 10 }}>
                                <Icon name="share-google" size={30} color={colors.white} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 0.9, overflow: 'hidden'  }}>
                <WebView
                            onLoad={() => this.hideSpinner()}
                            ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}
                            source={{ uri: (this.props.navigation != undefined) ? this.props.navigation.state.params.open_url : this.props.open_url}}
                            style={{ marginTop: 0 }}
                            scalesPageToFit={true}
                        />
                </View>
                {this.state.visible && (
                    <ActivityIndicator
                        color={'gray'}
                        style={{ position: "absolute", top: globals.WINDOW.height /2, left: globals.WINDOW.width / 2.150 }}
                        size="large"
                    />
                )}


                {/* <View style={{ position:'absolute',flexDirection: 'row', backgroundColor: colors.blue, flex:0.1   }}>
                    <TouchableOpacity onPress={() => this.closeWebView()}>
                        <View style={{ alignSelf: 'flex-start', padding: 10 }}>
                            <Icon name="close" size={30} color={colors.white} />
                        </View>
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => { WebViewRef && WebViewRef.reload(); }}>
                            <View style={{ padding: 10 }}>
                                <Icon name="refresh" size={30} color={colors.white} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.shareMsg()}>
                            <View style={{ padding: 10 }}>
                                <Icon name="share-google" size={30} color={colors.white} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                <View style={{ overflow:'hidden', flex:0.9}}>
                    <WebView
                            onLoad={() => this.hideSpinner()}
                            ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}
                            source={{ uri: (this.props.navigation != undefined) ? this.props.navigation.state.params.open_url : this.props.open_url}}
                            style={{ marginTop: 0 }}
                            scalesPageToFit={true}
                        />
                    </View>
                    {this.state.visible && (
                    <ActivityIndicator
                        color={'gray'}
                        style={{ position: "absolute", top: globals.WINDOW.height /2, left: globals.WINDOW.width / 2.150 }}
                        size="large"
                    />
                )} */}
               
            </View>
        )
    }
    else{
      return(
        <View style={[globalStyles.safeviewStyle, { flex: 1, backgroundColor: colors.white }]}>
          <View style={{ backgroundColor: colors.blue, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.closeWebView()}>
              <View style={{ alignSelf: 'flex-start', padding: 10 }}>
                <Icon name="close" size={30} color={colors.white} />
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => { WebViewRef && WebViewRef.reload(); }}>
                <View style={{ padding: 10 }}>
                  <Icon name="refresh" size={30} color={colors.white} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.shareMsg()}>
                <View style={{ padding: 10 }}>
                  <Icon name="share-google" size={30} color={colors.white} />
                </View>
              </TouchableOpacity>
            </View>
           
          </View>
          <View style={styles.noInternetView}>
              <Text style={styles.noInternetText}>{globals.networkNotAvailable}</Text>
            </View>
        </View>
      )
    }
  }
}

// ********************** Model mapping method **********************
const mapStateToProps = (state, ownProps) => {
    return {
        // theme: state.changeTheme_red.theme,
        android_modal: state.showAndroidWebViewModal_red.android_modal,
        screen_name: state.showAndroidWebViewModal_red.screen_name,
        // marketStatus: state.checkMarketStatus_red.marketStatus,
        open_url: state.showAndroidWebViewModal_red.open_url,
        article_title: state.showAndroidWebViewModal_red.article_title
    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    // changeTheme,
    // getShowModalSelectBankAccount,
    // checkMarketStatus,
    getShowAndroidModal
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(NewsArticleWebView);