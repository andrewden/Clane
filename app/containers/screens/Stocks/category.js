import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  AsyncStorage,
  TouchableOpacity,
  Platform,
  FlatList,
  TextInput, Modal, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback
} from 'react-native';
import styles from './style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeTheme } from '../../../redux/actions/changeTheme';
import globalStyles from '../../../assets/styles/globalStyles';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import { HeaderBackButton } from 'react-navigation';
import Icon from 'react-native-vector-icons/Entypo';
import NewsAndroidWebview from '../Stocks/newsAndroidWebview';
import NewsArticleWebView from '../InitialStock/NewsArticleWebView';
import SafariView from 'react-native-safari-view';
import { stock } from '../../../assets/images/map'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import NewsSearchScreen from './NewsSearchScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import DeviceInfo from 'react-native-device-info';
import CategoryData from './categoryData';
import { category } from '../../../assets/images/map'
import { API } from '../../../lib/api';
import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import { getShowAndroidModal } from '../../../redux/actions/showAndroidWebViewModal';
import Countly from 'countly-sdk-react-native';
import imageCacheHoc from 'react-native-image-cache-hoc';
import firebase from 'react-native-firebase';
import dashboardNewsRes from '../InitialStock/dashboardNewsRes';
import DashboardNewsArticleDetail from '../InitialStock/dashboardNewsArticleDetail';
import LottieView from 'lottie-react-native';

var _this = null;
var TAG = "Category"
var themeStyle = null;
var timeoutForSearchApiCall = null;

const propOverridePlaceholderObject = {
  component: Image,
  props: {
    style: styles.topicImage,
    source: stock.news_placeholder
  }
};

const CacheableImage = imageCacheHoc(Image, {
  validProtocols: ['http', 'https'],
  defaultPlaceholder: propOverridePlaceholderObject
});

const formatData  =(data, numColumns ) =>{
    const fullNumColumns =Math.floor(data.length / numColumns);
    let lastElementROw = data.length - (fullNumColumns * numColumns);
    while(lastElementROw !== numColumns && lastElementROw !==0){
      data.push({key :'blank-${lastElementROw}', empty: true});
    lastElementROw = lastElementROw +1; 
    }

     return data;
}

class Category extends Component {
  constructor(props) {
    super(props);
    _this = this;
    this.state = {
      categoryData: [],
      modalVisible: false,
      newsData: [],
      modalVisibleWebView: false,
      dashboardNewsDetailData: dashboardNewsRes.RESPONSE.data[0],
      loader:false,

    }
  }

  // static navigationOptions = ({ navigation, screenProps, }) => {
  //   const { state } = navigation;
  //   return {

  //     headerStyle: globalStyles.navigationHeaderStyle,
  //     headerLeft:<View style={{flexDirection:'row',flex:1}} ><HeaderBackButton onPress={() => navigation.goBack(null)} title='' tintColor='white' />
  //                 <Ionicons name="ios-settings" size={30} color={colors.white} style={{alignSelf:'center',marginLeft:-13}} />
  //               </View> ,

  //   }
  // }

  componentWillUnmount(){
    if (Platform.OS== 'android') {
      StatusBar.setHidden(false,'slide')
    }
  }
  componentDidUpdate() {
    if (this.state.loader) {
      this.animation.play();
    }
  }

  componentDidMount() {

    //through JSON data and save it tto async storage
    // this.setState({
    //   categoryData: CategoryData.data
    // },() => AsyncStorage.setItem(globals.categoryData,JSON.stringify(this.state.categoryData)))
    //---end of set json data code


    StatusBar.setHidden(false, 'slide')
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.blue, true);
    }

    //through api and save it tto async storage after getting response
    AsyncStorage.getItem(globals.categoryData, (err, result) => {
      if (result !== null) {
        console.log(TAG, "response from async : " + result);
        let data = JSON.parse(result);
        this.setState({ categoryData: data })
      }
    });
    // API.getAllCategories(this.responseDataCategories, false);
    // this.setState({categoryData: CategoryData.data})
    // AsyncStorage.setItem(globals.categoryData,JSON.stringify(CategoryData.data));
  }

 /**
  * api response of get all categories
  */
  responseDataCategories = {
    success: (response) => {
        console.log("response get all categories: " + JSON.stringify(response));
        try {
           this.setState({categoryData : response.data})
           AsyncStorage.setItem(globals.categoryData,JSON.stringify(response.data));

        } catch (error) {
          // AsyncStorage.setItem(globals.categoryData,JSON.stringify(this.state.categoryData))
        }
    },
    error: (err) => {
       
    },
    complete: () => {
    }
}

checkLogin() {
  this.props.navigation.navigate("ModalNavigator")
}

  goToCategoryNewsArticleDetailScreen(name, id, value) {
    firebase.analytics().logEvent(globals.event_Categories, 
      Object.assign({}, { EventDetails: name}, globals.getAnalyticBasicDataCategoryType(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global,name)));

    var event = { "key": globals.event_Categories, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global)
    Countly.recordEvent(event);
    console.log("=====segmentation record event category wise detail, result=> ");
    // this.props.navigation.goBack()
    
    if (id==0) {
      if (name == 'Bookmarks') {
        if (globals.isLoggedIn == 'false'){
          this.checkLogin();
          globals.globalVars.dashboardTitle = globals.screenTitle_Category
        }else{
          this.props.navigation.navigate('CategoryNewsArticle', { tagValue: value, title: name, categoryNewsDetail: this.state.dashboardNewsDetailData, theme: this.props.theme, isFrom: 'tags' })
        }
      }
      else
      {
        this.props.navigation.navigate('CategoryNewsArticle', { tagValue: value, title: name, categoryNewsDetail: this.state.dashboardNewsDetailData, theme: this.props.theme, isFrom: 'tags' })
      }
    }
    else{
      this.props.navigation.navigate('CategoryNewsArticle', { isFrom: 'category', title: name, categoryNewsDetail: dashboardNewsRes.RESPONSE.data, theme: this.props.theme, cat_id:id })
    }
  }

  renderRow = ({ item, index }) => {
      console.log("SASAAD" + JSON.stringify(item));
      
      return (
        <TouchableOpacity style={styles.topicImageMainView} onPress={() => this.goToCategoryNewsArticleDetailScreen(item.name, item.id)}>
          {/* <Image source={this.getImage(item.name.toLowerCase())} style={styles.topicImage} resizeMode={"cover"} /> */}
          {(item.url != null) ? 
          <CacheableImage style={[styles.topicImage,]} source={{ uri: encodeURI(item.url) }} permanent={true} resizeMode={"stretch"}/> :
          //  <Image style={[styles.topicImage  ]} resizeMode={"center"} source={{ uri: (item.url) }}  /> :
                              <Image style={[styles.topicImage ]} resizeMode={"contain"} source={ stock.news_placeholder}  />
                            }
             {(item.url != null) ? <Text style={styles.topicImageText} >{item.name}</Text>
             :
             <Text style={[styles.topicImageText, {color: 'black'}]} >{item.name}</Text>}               
          
        </TouchableOpacity>
      )
  }

  getImage = (image) => {

    switch (image) {
      case "entertainment":
        return require("../../../assets/images/topics/entertainment.png")
        break;
      case "fashion":
        return require("../../../assets/images/topics/fashion.png")
        break;
      case "finance":
        return require("../../../assets/images/topics/finance.png")
        break;
      case "gaming":
        return require("../../../assets/images/topics/gaming.png")
        break;
      case "lifestyle":
        return require("../../../assets/images/topics/lifestyle.png")
        break;
      case "politics":
        return require("../../../assets/images/topics/politics.png")
        break;
      case "sports":
        return require("../../../assets/images/topics/sports.png")
        break;
      case "start_ups":
        return require("../../../assets/images/topics/start_ups.png")
        break;
      case "tech":
        return require("../../../assets/images/topics/tech.png")
        break;

      default:
        return require("../../../assets/images/topics/tech.png")
        break;
    }
  }

  /**
    * Method for on focus 
    */
  onFocus() {
    // alert('dfd')
    // this.props.getShowModalSelectBankAccount(true, '', '', '')
    let event = { "key": globals.event_DashboardSearch, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
    Countly.recordEvent(event);
    this.setState({ modalVisible: true })
    this.props.getShowModalSelectBankAccount(true, '', '', '')
    this.props.navigation.navigate('NewsSearchScreen')

  }


  /**
     * Method for render on change text
     */

  onChangeText(query) {
    
    clearTimeout(timeoutForSearchApiCall);
    // query = query.trim();
    this.setState({ query })
    if (query === '') {
      this.setState({ isSearch: false, newsData: this.state.recentSearch, refresh: !this.state.refresh });
    } else {
      if (!this.state.isSearch) {
        this.setState({ newsData: [], refresh: !this.state.refresh });
      }
      this.setState({ isSearch: true, refresh: !this.state.refresh, isApiCall: true });
    }
    timeoutForSearchApiCall = setTimeout(() => {
      //API.newsSearch(this.responseSearchData, query, false);
      if (query.length > 0) {
          if (globals.isInternetConnected) {
            this.setState({ loader : true },()=>{
              this.animation.play();
            })
          }
      }else {
        this.setState({loader: false})
      }
      API.getNewsSearchArticle(this.responseSearchDataNews, query, false);
    }, 500);
  }

  responseSearchDataNews = {
    success: (response) => {
      this.setState({loader: false})
      if (this.state.isSearch == false) {
        console.log("isSearch false");
        this.setState({ newsData: this.state.recentSearch, refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
      } else {
        console.log("category news search response :----> " + JSON.stringify(response))
        if (response.data != null && response.data.length != 0) {
          this.setState({ newsCount: response.data.length })
          console.log("isSearch true 1");
          this.setState({ newsData: response.data, refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
        } else {
          this.setState({ newsCount: response.data.length })
          console.log("isSearch true 2");
          this.setState({ newsData: [], refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
        }
      }
    },
    error: (err) => {
      this.setState({loader: false})
      this.setState({ newsData: [], refresh: !this.state.refresh, isApiCall: false, newsCount: 0 }, () => { this.forceUpdate() })
    },
    complete: () => {
    }
  }

  /**
   * Method for get response of news data api
   */
  responseSearchData = {
    success: (response) => {
      if (this.state.isSearch == false) {
        console.log("isSearch false");
        this.setState({ newsData: this.state.recentSearch, refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
      } else {
        if (response != null && response.length != 0) {
          this.setState({ newsCount: response.length })
          console.log("isSearch true 1");
          this.setState({ newsData: response, refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
        } else {
          this.setState({ newsCount: response.length })
          console.log("isSearch true 2");
          this.setState({ newsData: [], refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
        }
      }
    },
    error: (err) => {
      this.setState({ newsData: [], refresh: !this.state.refresh, isApiCall: false, newsCount: 0 }, () => { this.forceUpdate() })
    },
    complete: () => {
    }
  }


  /**
   * method for clear press in news data search
   */
  onClearPress() {
    this.setState({ query: '', newsData: [], isSearch: false, newsCount: 0 })
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
   * callArticleAPI
   * @param {*} id 
   * @param {*} link 
   * @param {*} title 
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
       * Method for render open link in safariview
       */
  _pressHandler(url = "https://www.google.com", title) {
    if (Platform.OS === 'android') {
      this.setState({ modalVisibleWebView: true })
      this.props.getShowAndroidModal(true, globals.screenTitle_Category, url, title)
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
   * responseRedirectData from  article api
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
    * Method for render item 
    */
  _renderItemNews = ({ item, index }) => {

    return (
      <TouchableOpacity onPress={() => this.setState({ modalVisible: false, query: '', newsData: [] }, () => { this.props.navigation.navigate("NewsSearchDetail", { artilceId: item.id, title : item.title, theme: this.props.theme }) })}>
      {/* <TouchableOpacity onPress={() => (item.tags && (item.tags[0] == "topnews" || item.tags[0] == "trendingnews")) ? this.setState({ modalVisible: false, query: '', newsData: [] }, () => { this.props.navigation.navigate("stockNewsArticleDetail", { articleData: item, theme: this.props.theme }) }) : this.callArticleAPI(item.id, item.linkToArticle, item.title)}> */}
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

    if (_this.state.query && _this.state.query != "" && !_this.state.isApiCall && _this.state.newsData && _this.state.newsData.length <= 0) {
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

  /**
  * Method for render seprator
  */
  renderSeparator() {
    return <View style={{ height: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1, marginHorizontal: 10, backgroundColor: '#E1E1E1' }}></View>
  }

  /**
   * Method for open modal
   */
  openModal() {
    console.log("openModal : " + this.state.modalVisibleWebView)
    return (
      <Modal animationType='slide' visible={this.state.modalVisibleWebView} onRequestClose={() => { Category.handleCloseModalWebview() }} >
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

  /**navigae to NewsSearchDetail from newssearch screen */
  static handleCloseModalNavigateNewsSearchDetail(data){
    _this.props.getShowModalSelectBankAccount(false)
    _this.setState({
      modalVisible: false
    }, () => _this.props.navigation.navigate('NewsSearchDetail', data)
    )
  }

  // searchModal(){
  //   return (
  //     <Modal animationType='slide' visible={this.state.modalVisible} onRequestClose={() => {  Category.handleCloseModal('Category') }}>
  //       <NewsSearchScreen isFrom='Category' setParentState={newState => this.setState(newState)} />
  //     </Modal>
  //   )
  // }


  /**
       * Method for search modal open
       */
  // searchModal() {
  //   return (
  //     <Modal animationType='fade' visible={this.state.modalVisible} onRequestClose={() => { Category.handleCloseModal() }}>
  //       <View style={globalStyles.mainViewSearchBar} removeClippedSubviews={false}>
  //         <View style={globalStyles.searchbarTopView}>
  //           <View style={globalStyles.searchbarTopLeftView}>
  //             <Ionicons name="md-search" size={Platform.OS === 'ios' ? 15 : 18} color={'gray'} />
  //             <TextInput placeholder={"Search Market News"}
  //               autoFocus={true}
  //               autoCorrect={false}
  //               returnKeyType='search'
  //               ref={'textInput'}
  //               underlineColorAndroid='transparent'
  //               style={globalStyles.searchbarTextInputStyle}
  //               onChangeText={(query) => this.onChangeText(query)}
  //               value={this.state.query} />
  //             <TouchableOpacity onPress={() => this.onClearPress(false)}>
  //               <Icon name="circle-with-cross" size={Platform.OS === 'ios' ? 15 : 18} color={'gray'} />
  //             </TouchableOpacity>
  //           </View>
  //           <View style={globalStyles.cancelButtonSearchBarView}>
  //             <TouchableOpacity onPress={() => Category.handleCloseModal()}>
  //               <Text style={[globalStyles.cancelButton, { marginLeft: 5 }]}>{"Cancel"}</Text>
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //         <View style={styles.searchbarBottomView} removeClippedSubviews={false}>

  //           <KeyboardAvoidingView
  //             removeClippedSubviews={false}
  //             keyboardVerticalOffset={75}
  //             behavior={Platform.OS === 'android' ? '' : 'padding'}
  //             style={{ flex: 1 }}
  //           >

  //             {(this.state.loader)?  <View style={{flex:1, justifyContent:'center', }}><LottieView
  //               style={[{   height: 75, width: 75,  alignSelf: 'center' }]}
  //               source={require('../../../animations/clane-circle-loader-blue.json')}
  //               ref={animation => {
  //                 this.animation = animation;
  //               }}
  //               loop={true} />
  //               </View> : <View style={{ paddingBottom: (globals.iPhoneX) ? 10 : 0, flex: 1 }}>
  //               <FlatList
  //                 alwaysBounceVertical={false}
  //                 removeClippedSubviews={false}
  //                 extraData={this.state}
  //                 keyboardShouldPersistTaps='handled'
  //                 style={{ flex: 1 }}
  //                 data={this.state.newsData}
  //                 keyExtractor={(item, index) => index.toString()}
  //                 renderItem={this._renderItemNews}
  //                 ItemSeparatorComponent={this.renderSeparator}
  //                 ListEmptyComponent={this.ListEmptyComponent}
  //               />
  //             </View>}
              

  //           </KeyboardAvoidingView>
  //         </View>
  //       </View>
  //     </Modal>
  //   )
  // }

  /**
    * Method for handle close modal webview
    */
  static handleCloseModal() {
    _this.props.getShowAndroidModal(false)
    _this.setState({
      modalVisible: false
    })
  }
  gotoBack(){
    this.props.navigation.goBack()
    DashboardNewsArticleDetail.hideStatusBar()

  }

  goToNewsPreference(){
    let event = { "key": globals.event_NewsPreferenace, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
    Countly.recordEvent(event);
    this.props.navigation.navigate('NewsPreferences')
  }
  render() {
    return (
      // <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: colors.gray }]}>
      <View style={globalStyles.mainViewSearchBar} removeClippedSubviews={false}>
        {this.openModal()}
        {/* {this.searchModal()} */}
        <View style={globalStyles.categorySearchbarTopView}>
          <TouchableOpacity onPress={() => this.gotoBack()}>
            <Ionicons name="ios-arrow-back" size={30} color={colors.white} style={{marginLeft: 10, marginRight:10 }} />
          </TouchableOpacity>
          
          <TouchableWithoutFeedback style={[globalStyles.searchbarTopLeftViewCategory]} onPress={() => this.onFocus()}>
            <View style={[globalStyles.searchbarTopLeftViewCategory, { marginRight: globals.screenWidth * 0.020 }]}>
              <Ionicons name="md-search" size={Platform.OS === 'ios' ? 15 : 18} color={'gray'} />
              <Text style={{ marginHorizontal: 5, color: colors.newsGNTitle }}>Search News</Text>
              <View style={globalStyles.searchbarTextInputStyle} >
                {/* <TextInput placeholder={"Lafarge Afri"}
                // autoFocus={true}
                style={{flex : 1}}
                //editable={false}
                autoCorrect={false}
                returnKeyType='search'
                ref={'textInput'}
                underlineColorAndroid='transparent'
                // onChangeText={(query) => this.onChangeText(query)}
                value={this.state.query} /> */}
              </View>
              {/* <TouchableOpacity onPress={() => this.onFocus()}> */}
              {/* <Icon name="circle-with-cross" size={Platform.OS === 'ios' ? 15 : 18} color={'gray'} /> */}
              {/* </TouchableOpacity> */}
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity onPress={() => this.goToNewsPreference()}>
            <Ionicons name="ios-settings" size={30} color={colors.white} style={{ alignSelf: 'center', marginLeft: 10, marginRight: 10 }} />
          </TouchableOpacity>
        </View>
        <View style={[styles.categorySepView, { backgroundColor: colors.categorySepViewLight, height :5 }]} ></View>

        <View style={styles.categoryScreenMainView}>

          {/* <Text style={styles.categoryText} >Categories</Text> */}

          <View style={[styles.categoryIconView]} >
            <View style={[styles.iconView, { marginTop:10 }]} >
              <TouchableOpacity style={styles.touchableView} onPress={() => this.goToCategoryNewsArticleDetailScreen('Top Feeds',0,'topfeeds')} >
                <Image resizeMode='contain' source={category.topfeed} style={styles.iconSize} />
                <Text style={styles.iconText} >Top Feeds</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.iconView, { marginTop:10 }]} >
                <TouchableOpacity style={styles.touchableView} onPress={() => this.goToCategoryNewsArticleDetailScreen('Trending',0,'trending')}>
                <Image resizeMode='contain' source={category.trending} style={styles.iconSize} />
                <Text style={styles.iconText} >Trending</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.iconView, { marginTop:10 }]} >
               <TouchableOpacity style={styles.touchableView} onPress={() => this.goToCategoryNewsArticleDetailScreen('All News',0,'allnews')} >
                <Image resizeMode='contain' source={category.news} style={styles.iconSize} />
                <Text style={styles.iconText} >All News</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.iconView, { marginTop:10 }]} >
                <TouchableOpacity style={styles.touchableView} onPress={() => this.goToCategoryNewsArticleDetailScreen('Bookmarks',0,'bookmarks')}>
                <Image resizeMode='contain' source={category.bookmark} style={styles.iconSize} />
                <Text style={styles.iconText} >Bookmarks</Text>
              </TouchableOpacity>
            </View>

          </View>
          <View style={[styles.categorySepView, { backgroundColor: colors.categorySepViewLight }]} ></View>
        </View>

        <View style={[styles.topicView]} >
          <Text style={styles.topicText} >Categories</Text>
          <FlatList
            style={styles.flatlistStyle}
            data={this.state.categoryData}
            // renderItem={this.renderRow()}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderRow}
            // keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            numColumns={3}
            extraData={this.state}
            scrollEnabled={false}
          />
        </View>
      </View>


      // </SafeAreaView>
    )
  }
  
}

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
  return {
    theme: state.changeTheme_red.theme,
    selectBankAccount_modal: state.showModalSelectBankAccount_red.selectBankAccount_modal,
  }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
  changeTheme,
  getShowModalSelectBankAccount,
  getShowAndroidModal
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Category);