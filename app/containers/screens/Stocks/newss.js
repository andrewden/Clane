import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    FlatList,
    TouchableOpacity,
    AsyncStorage,
    SafeAreaView, StatusBar,Platform
} from 'react-native';
import styles from './style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeTheme } from '../../../redux/actions/changeTheme';
import globalStyles from '../../../assets/styles/globalStyles';
import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import { getShowAndroidModal } from '../../../redux/actions/showAndroidWebViewModal';

import ImageData from './imageData';
import * as colors from '../../../assets/styles/color';
import * as globals from '../../../lib/globals';
import { ScrollView } from 'react-native-gesture-handler';
import { API } from '../../../lib/api';
const BOUNCE_MARGIN = globals.WINDOW.height
import moment from 'moment';
import { stock } from '../../../assets/images/map'
import SafariView from 'react-native-safari-view';
// import NewsAndroidWebview from './newsAndroidWebview';
import NewsArticleWebView from '../InitialStock/NewsArticleWebView';

// var themeStyle = null;
var _this = null;
const contentProps = (props, bottom, top) => ({
    // contentContainerStyle: mergeProp(!!top, props.contentContainerStyle),
    contentInset: { top: -BOUNCE_MARGIN },
    contentOffset: { y: BOUNCE_MARGIN },
})

class News extends Component {

    constructor(props) {
        super(props);
        _this = this;


        this.state = {
            imageData: [],
            page: 1,
            isPaginationEnd: false,
            footerLoading: false,
            isFromCache: false,
            newsdata: [],
            themeStyle: this.props.theme,
            modalVisible: false,

        }
    }

    componentDidMount() {
        // var dataRender = ImageData.RESPONSE;
        // this.setState({ imageData: dataRender.sData.banks }, () => console.log("IMAGES " + JSON.stringify(this.state.imageData)))
        if (Platform.OS == 'ios') {
            globals.setStatusBarForSafariView();   
        }
        this.getTimeIntervalForStockGenerlNews();

        // var query = "?count=5";
        // API.marketGeneralNews(this.responseNewsData, query, this.state.page, false);
    }

    /**
     * Method for load more data 
     */
    handleLoadMore = () => {
        console.log("Data Length : " + this.state.page);
        setTimeout(() => {
            if (_this.state.isPaginationEnd == false) {
                var query = "?count=5"
                this.setState({
                    page: this.state.page + 1,
                }, () => API.marketGeneralNews(this.responseNewsData, query, this.state.page, false));
            }
        }, 500);

    };

    /**
     * Method for call general stock API
     */
    stockNews() {
        var query = "?count=5";
        API.marketGeneralNews(this.responseNewsData, query, this.state.page, false);
    }

    /**
    * Method for get time interval stock news
    */
    getTimeIntervalForStockGenerlNews() {
        AsyncStorage.getItem(globals.market_general_news_timeStamp, (err, result) => {
            if (result !== null) {
                console.log("newss result");

                var diffMins = globals.getTimeDifference(result);
                if (diffMins >= 15 && globals.isInternetConnected) {
                    _this.stockNews();
                    this.setState({ isFromCache: false })
                    console.log("newss >15");

                } else {
                    this.setState({ isFromCache: true })
                    AsyncStorage.getItem(globals.market_async_general_news, (err, result) => {
                        if (result !== null) {
                            console.log("newss market_async_news");
                            var responseData = JSON.parse(result);
                            console.log("responseData NewsLOCAL " + JSON.stringify(responseData));

                            var allData = responseData;
                            console.log("responseData allData " + allData);
                            this.setState({ newsdata: allData, })
                        }
                    });
                }
            } else {
                if (globals.isInternetConnected) {
                    this.setState({ isInternetAvailable: true, isFromCache: false });
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

    /**
     * Method for get response of general stock
     */
    responseNewsData = {
        success: (response) => {
            console.log("NEWS RESPONSE " + JSON.stringify(response));
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
                AsyncStorage.setItem(globals.market_general_news_timeStamp, new Date());
                AsyncStorage.setItem(globals.market_async_general_news, JSON.stringify(allData));
            } catch (error) {
            }


        },
        error: (err) => {
            _this.setState({ footerLoading: false })

        },
        complete: () => {
            // _this.setState({ footerLoading: false })
        }
    }

    callArticleAPI(id,  link, title) {
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

    _pressHandler(url = "https://www.google.com",title) {
        if(Platform.OS === 'android'){
            this.setState({modalVisible: true})
           this.props.getShowAndroidModal(true, '', url,title)
        }
        else{
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
    // _pressHandler(url = "https://www.google.com") {
    //     SafariView.isAvailable()
    //         .then(SafariView.show({
    //             url: url,
    //             barTintColor: colors.white,
    //             readerMode: true,
    //         }))
    //         .catch(error => {
    //             // Fallback WebView code for iOS 8 and earlier
    //         });
    // }


    /**
     * Methid for render row of news item
     * @param {*} item 
     */
    renderRow(item) {
        return (
            <TouchableOpacity onPress={() => this.callArticleAPI(item.id,item.linkToArticle,item.title)}>
                <View style={[{ padding: 10 }, this.state.themeStyle.mainView]}>

                    <View style={{ marginBottom: 5 }}>
                        <Text style={[styles.stockDetailRelatedGeneralNewsTitle, this.state.themeStyle.stockRelatedNewsTitleColor]}>{item.title}</Text>
                        <Text style={[styles.stockDetailRelatedNewsAgo, this.state.themeStyle.stockDetailRelatedNewsAgo]}>{item.source} {moment(item.publishedDate).format('DD/MM/YYYY, h:mm A')} {item.author}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    componentWillReceiveProps(newProps) {
        if (newProps.theme != undefined) {
            this.setState({
                themeStyle: newProps.theme
            })
        }
        // if(newProps.marketStatus != undefined){
        //     console.log("this.marketStatus " + this.marketStatus);
        //     console.log("newProps.marketStatus " + newProps.marketStatus);

        //     if (this.marketStatus !== newProps.marketStatus) {
        //       this.marketStatus = newProps.marketStatus
        //       console.log("newProps.marketStatus "+newProps.marketStatus);
        //       this.props.navigation.setParams({ bgColor: (newProps.marketStatus) ? colors.blue : colors.blackThemeColor })
        //     }
        //   }
    }

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

    separator = () => {
        return (
            <View style={[styles.horizontalSepratorGeneralNewsMain, this.state.themeStyle.relatedNewsSeparator]} />
        );
    };

    /**
     * Method for open modal
     */
    openModal(){
        return(
            <Modal animationType='slide' visible={this.state.modalVisible} onRequestClose={() => { News.handleCloseModalWebview() }}>
                <NewsArticleWebView setParentState = { newState => this.setState(newState)}/>
            </Modal>
        )
    }

    /**
     * Method for handle close modal webview
     */
   static handleCloseModalWebview() {
    _this.props.getShowAndroidModal(false)
    _this.setState({
        modalVisible : false
    })
}

    render() {
        return (
            <SafeAreaView style={[globalStyles.safeviewStyle, this.state.themeStyle.mainView]}>
                <View style={[styles.searchScreenItemLeftView, this.state.themeStyle.mainView]}>
                {this.openModal()}
                    <View style={{ flex: 1, marginLeft: 5, marginRight: 5, marginBottom: 50 }}>
                        <FlatList
                            ref={"myFlatList"}
                            data={this.state.newsdata}
                            style={{}}
                            renderItem={({ item }) => this.renderRow(item)}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={this.separator}
                            // onScrollBeginDrag={() => this.startFlatListDrag()}
                            //onScrollEndDrag={() => this.startFlatListDrag()}
                            onEndReached={this.handleLoadMore}
                            onEndReachedThreshold={0.5}
                            // extraData={this.state}
                            // {...contentProps()}
                            // ListHeaderComponent={this.renderHeader}
                            ListFooterComponent={this.renderFooter}
                        />
                    </View>

                    {/* <View style={this.state.themeStyle.headerBG}>
                            <FlatList
                                style={{ height: 60, borderColor: 'red', borderRadius: 2 }}
                                data={this.state.imageData}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                renderItem={(rowItem, index) => this.renderImage(rowItem)}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                            <Text style={[styles.stockGeneralNewsTitle, this.state.themeStyle.stockGeneralNewsTitleColor]}>Your  Thursday Briefing</Text>
                            <Text style={[styles.stockDetailRelatedNewsSubTitle, this.state.themeStyle.stockRelatedNewsTitleColor]}>Get your day started with these news updates</Text>
                            <Text style={[styles.stockDetailRelatedNewsAgo, this.state.themeStyle.stockDetailRelatedNewsAgo]}>{globals.stockDetailRelatedNewsAddress}
                            </Text>
                        </View> */}
                    {/* <View style={[styles.horizontalSepratorGeneralNewsMain, this.state.themeStyle.relatedNewsSeparator]} />
                        <View style={{ paddingLeft: 10, marginTop: 10, paddingRight: 10 }}>
                            <Text style={[styles.stockDetailRelatedGeneralNewsTitle, this.state.themeStyle.stockRelatedNewsTitleColor]}>Lafarge Africa Plc Opts for Rights Issue amidst
debt restructuring</Text>

                            <Text style={[styles.stockDetailRelatedNewsAgo, this.state.themeStyle.stockDetailRelatedNewsAgo]}>WAPCO - 06:35PM - Bloomberg
                            </Text>
                        </View> */}
                    {/* <View style={{ paddingLeft: 10, marginTop: 10, paddingRight: 10 }}>
                            <View style={[styles.horizontalSepratorGeneralNews, this.state.themeStyle.relatedNewsSeparator]} />
                            <Text style={[styles.stockDetailRelatedGeneralNewsTitle, this.state.themeStyle.stockRelatedNewsTitleColor]}>Dangote Cement Announces N300 Reduction
In Cement Price</Text>
                            <Text style={[styles.stockDetailRelatedNewsSubTitle, this.state.themeStyle.stockRelatedNewsTitleColor]}>Get your day started with these news updates</Text>
                            <Text style={[styles.stockDetailRelatedNewsAgo, this.state.themeStyle.stockDetailRelatedNewsAgo]}>{globals.stockDetailRelatedNewsAddress}
                            </Text>
                        </View> */}
                    {/* <View style={{ paddingLeft: 10, marginTop: 10, paddingRight: 10 }}>
                            <View style={[styles.horizontalSepratorGeneralNews, this.state.themeStyle.relatedNewsSeparator]} />
                            <Text style={[styles.stockDetailRelatedGeneralNewsTitle, this.state.themeStyle.stockRelatedNewsTitleColor]}>Fitch Affirms First Bank's B- Rating with 
Negative Outlook</Text>
                             
                            <Text style={[styles.stockDetailRelatedNewsAgo, this.state.themeStyle.stockDetailRelatedNewsAgo]}>WAPCO - 06:35PM - Bloomberg
                            </Text>
                        </View> */}

                    {/* <View style={{ paddingLeft: 10, marginTop: 10, paddingRight: 10 }}>
                            <View style={[styles.horizontalSepratorGeneralNews, this.state.themeStyle.relatedNewsSeparator]} />
                            <Text style={[styles.stockDetailRelatedGeneralNewsTitle, this.state.themeStyle.stockRelatedNewsTitleColor]}>Fitch Affirms First Bank's B- Rating with 
Negative Outlook</Text>
                             
                            <Text style={[styles.stockDetailRelatedNewsAgo, this.state.themeStyle.stockDetailRelatedNewsAgo]}>WAPCO - 06:35PM - Bloomberg
                            </Text>
                        </View> */}

                    {/* <View style={[ {marginTop: 10, padding: 10}, this.state.themeStyle.advertizmentBG   ]}>
                            <View style={{flex:1,flexDirection:'row'}}>
                            <Text style={[styles.stockGeneralNewsADVTitle, this.state.themeStyle.stockRelatedNewsTitleColor]}>Get checked today</Text>
                            <Text style={[styles.stockGeneralNewsADVName, this.state.themeStyle.stockGeneralNewsADVName]}>Advertisement</Text>
                            </View>
                            
                            <Text style={[styles.stockGeneralAdvDmall, this.state.themeStyle.stockDetailRelatedNewsAdvertizmnetSmall]}>International Online Pharmacy Online: Buy Prescription
Drugs, Cheap Generic Drugs, Best Prescription Diet Pills
Online at discounted prices.</Text>
                            <View style={[styles.learnMoreView,this.state.themeStyle.learnMoreView ]}>
                                <Text style={[styles.learnMoreText,this.state.themeStyle.learnMoreText ]}>LEARN MORE</Text>
                            </View>
                            
                        </View> */}
                    {/* <View style={{ paddingLeft: 10, marginTop: 10, paddingRight: 10 }}>
                            <View style={[styles.horizontalSepratorGeneralNews, this.state.themeStyle.relatedNewsSeparator]} />
                            <Text style={[styles.stockDetailRelatedGeneralNewsTitle, this.state.themeStyle.stockRelatedNewsTitleColor]}>Fitch Affirms First Bank's B- Rating with 
Negative Outlook</Text>
                             
                            <Text style={[styles.stockDetailRelatedNewsAgo, this.state.themeStyle.stockDetailRelatedNewsAgo]}>WAPCO - 06:35PM - Bloomberg
                            </Text>
                        </View> */}
                </View>
            </SafeAreaView>
        )
    }
}

// ********************** Model mapping method **********************
const mapStateToProps = (state, ownProps) => {
    return {
        theme: state.changeTheme_red.theme,
        selectBankAccount_modal: state.showModalSelectBankAccount_red.selectBankAccount_modal,
        screen_name: state.showModalSelectBankAccount_red.screen_name,
    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    changeTheme,
    getShowAndroidModal
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(News);