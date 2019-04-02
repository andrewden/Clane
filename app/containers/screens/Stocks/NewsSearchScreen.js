import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Platform,
    TextInput,
    FlatList,
    StatusBar,
    KeyboardAvoidingView,
    Image,
    AsyncStorage
} from 'react-native';
import styles from './style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getShowModalSearchBar } from '../../../redux/actions/showModalSearchBar';
import { getShowModalNewsSearchBar } from '../../../redux/actions/showModalNewsSearchBar';
import SafariView from 'react-native-safari-view';
import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import Category from './category'
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import globalStyles from '../../../assets/styles/globalStyles';
import { API } from '../../../lib/api';
import Icon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { changeTheme } from '../../../redux/actions/changeTheme';
import News from './news';
import LottieView from 'lottie-react-native';

var _this = null;
let stringData =[];
var timeoutForSearchApiCall = null;
class NewsSearchScreen extends Component {

    constructor(props) {
        super(props);
        _this = this;
        this._renderItem = this._renderItem.bind(this);
        this.state = {
            themeStyle: this.props.theme,
            query: "",
            isSearch: false,
            data: [],
            recentSearch: [],
            refresh: false,
            isApiCall: false,
            loader: false,
            recentNewsSearch: [],
            isResponseCome: false,
            isRecentViewVisible: false,
        }
    }

    componentDidUpdate() {
        if (this.state.loader) {
            this.animation.play();
        }
    }


    componentDidMount() {
        // alert('sd') 
        AsyncStorage.getItem("categoryNewsRecentSearch", (err, result) => {
            if (result != null && result != undefined) {
                this.setState({ recentNewsSearch: JSON.parse(result) },()=>{
                    this.setState({isRecentViewVisible: true})
                    // this.setState({tempRecentNewsSearch : this.state.recentNewsSearch})
                    // recentNews = this.state.recentNewsSearch;
                })

            }
        });

    }

    handleCloseModal() {
        this.refs.textInput.setNativeProps({ 'editable': false });
        if (this.props.marketStatus) {

            StatusBar.setBackgroundColor(colors.blue, true);
        } else {
            StatusBar.setBackgroundColor(colors.blackThemeColor, true);
        }
        this.props.getShowModalNewsSearchBar(false);
    }

    clearTextInputAction() {
        this.setState({ query: '', data: [], isSearch: false },()=>{
            if (this.state.recentNewsSearch.length > 0) {
                this.setState({isRecentViewVisible: true})
            }
        })
    }

    /**
     * Method for render on change text
     */

    onChangeText(query) {
        clearTimeout(timeoutForSearchApiCall);
        query = query.trim();
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
            if (query.length > 0) {
                if (globals.isInternetConnected) {
                    this.setState({ loader: true, isResponseCome: false, isRecentViewVisible: false }, () => {
                        this.animation.play();
                    })
                }

            }
            else {
                this.setState({ loader: false })
            }
            // this.setState({isResponseCome: false})
            if (query.length > 0 ) {
                API.getNewsSearchArticle(this.responseSearchDataNews, query, false);
            }

          
        }, 1000);
    }

    /**
      * Method for get response of market search API
      */
responseSearchDataNews = {
        success: (response) => {
            this.setState({ isResponseCome: true })
            if (this.state.isSearch == false) {
                console.log("isSearch false");
                this.setState({ data: this.state.recentSearch, refresh: !this.state.refresh, isApiCall: false, loader:false   }, () => { this.forceUpdate() })
            } else {
                if (response != null && response.length != 0) {
                    console.log("isSearch true 1");
                    this.setState({ data: response.data, refresh: !this.state.refresh, isApiCall: false, loader: false }, () => { this.forceUpdate() })
                } else {
                    console.log("isSearch true 2");
                    this.setState({ data: [], refresh: !this.state.refresh, isApiCall: false , loader: false}, () => { this.forceUpdate() })
                }
            }
        },
        error: (err) => {
             
            this.setState({ data: [], refresh: !this.state.refresh, isApiCall: false, loader:false, isResponseCome: true }, () => { this.forceUpdate() })
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
     * Method for call article API
     */
    callArticleAPI(id, link, title) {

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
     * Method for press handler safaro and android webview
     */
    _pressHandler(url = "https://www.google.com", title) {
        if (Platform.OS === 'android') {
            this.setState({ modalVisibleWebView: true })
            this.props.getShowModalSelectBankAccount(true, globals.screenTitle_notifications, url, title)
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

    closeModal(item) {
        if (item.tags && (item.tags[0] == "topnews" || item.tags[0] == "trendingnews")) {
            this.setState({  query: '', data: [] });
            this.props.getShowModalNewsSearchBar(false);
            News.navigateStockNewsDetail(item);
        }
        else{
            this.callArticleAPI(item.id, item.linkToArticle, item.title);
        }
     }

     checkIfNewsIDExists(objID) {
        return this.state.recentNewsSearch.some(function (el) {
            return el.id === objID;
        });
    }

     sendDataToNewsSearchDetail(object, isfrom, value){
        if(isfrom == 'normal'){
            var tempArray = this.state.recentNewsSearch;
            console.log("this.checkIfNewsIDExists(object.id) " +this.checkIfNewsIDExists(object.id) + " " + object.id);
            
            // if (!this.checkIfNewsIDExists(object.id)) {
                console.log("!this.checkIfNewsIDExists(object.id) ONE");
                
                stringData.push({ title: value })
                stringData.unshift({ title: value })
                console.log("stringData---> " + JSON.stringify(stringData));
                let unique = this.getUnique(stringData, 'title')
                console.log("unique---> " + JSON.stringify(unique));
                tempArray = unique;

                // tempArray.unshift(object)
                recentNews = tempArray;
                this.setState({ recentNewsSearch: tempArray,   })
                if (tempArray.length > 2) {
                    tempArray.pop()
                }
               AsyncStorage.setItem('categoryNewsRecentSearch', JSON.stringify(tempArray));
               NewsSearchScreen._goToNewsSearchDetail({ artilceId: object.id, title: object.title, theme: this.props.theme })
            // }
            // else
            //  {
            //     NewsSearchScreen._goToNewsSearchDetail({ artilceId: object.id, title: object.title, theme: this.props.theme })
            // }
        } 
        else
        {
            NewsSearchScreen._goToNewsSearchDetail({ artilceId: object.id, title: object.title, theme: this.props.theme })
        }
     }

    static _goToNewsSearchDetail(data ){
            Category.handleCloseModalNavigateNewsSearchDetail(data);
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

    _renderItem = ({ item, index }) => {

        return (
            // <TouchableOpacity onPress={() => this.closeModal(item)}>
            <TouchableOpacity onPress={() => this.sendDataToNewsSearchDetail(item, 'normal',this.state.query)}>
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
        * Method for get effect string from search text
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
     * Method for list emapty component for flatlist no data found
     */
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

    onCancelPress(){
      this.props.navigation.goBack();
    }


    callSearchAPI(item){
        // alert(JSON.stringify(item))
        this.setState({query: item.title, isRecentViewVisible: false, },()=>{
            this.onChangeText(this.state.query)
        })
        this.setState({ query: item.title, loader: true,  isRecentViewVisible: false }, () => {
            this.animation.play();
        })
    }

    _renderRecentItem = ({ item, index }) => {
        // console.log("_renderRecentItem "+ item.title);
        
        return (
            <TouchableOpacity onPress={() => this.callSearchAPI(item)}>
                 <View style={styles.searchScreenItem}>
                    <Text numberOfLines={2} style={styles.searchScreenItemTitleText}>{item.title}</Text>
                 </View>
                {/* <View style={styles.searchScreenItem}>
                    <View style={styles.searchScreenItemView}>
                        <View style={styles.searchScreenItemLeftView}>
                        <Text numberOfLines={2} style={styles.searchScreenItemTitleText}>{item && item.title  }</Text>
                            
                        </View>
                    </View>
                    <View style={styles.searchScreenItemView}>
                        <View style={styles.searchScreenItemLeftView}>
                        <Text numberOfLines={1} style={styles.searchScreenItemSubtitleText}>{item && item.source }</Text>
                            
                        </View>
                    </View>
                </View> */}

            </TouchableOpacity>
        )
    }

    clearRecentSeacrchAction(){
        AsyncStorage.setItem('categoryNewsRecentSearch', JSON.stringify([]));
        this.setState({ recentNewsSearch: [] })
    }

    renderRecentView()
    {

        if (!this.state.loader) {
            if (this.state.recentNewsSearch.length > 0 && this.state.isRecentViewVisible) 
             {
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

    render() {
        return (
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
                        <TouchableOpacity  onPress={() => this.onCancelPress()}>
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

                    {(this.state.loader) ?
                    <View style={{ flex: 1, justifyContent: 'center',}}><LottieView
                    style={[{height: 80, width: 80,  alignSelf: 'center' }]}
                    source={require('../../../animations/latestloader_blue.json')}
                        ref={animation => {
                            this.animation = animation;
                        }}
                        loop={true} />
                    </View>:
                        <View style={{ paddingBottom: (globals.iPhoneX) ? 10 : 0, flex: 1 }}>
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
        )
    }
}

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
    return {
        searchbar_modal: state.showModalNewsSearchBar_red.searchbar_modal,
        screen_name: state.showModalSearchBar_red.screen_name,
        theme: state.changeTheme_red.theme,
        selectBankAccount_modal: state.showModalSelectBankAccount_red.selectBankAccount_modal,


    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    getShowModalSearchBar,
    getShowModalNewsSearchBar,
    changeTheme,
    getShowModalSelectBankAccount

}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(NewsSearchScreen);