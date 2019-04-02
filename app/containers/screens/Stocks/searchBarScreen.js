import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Platform,
    TextInput,
    FlatList,
    AsyncStorage,
    StatusBar,
    KeyboardAvoidingView,
    Image
} from 'react-native';
import styles from './style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getShowModalSearchBar } from '../../../redux/actions/showModalSearchBar';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import globalStyles from '../../../assets/styles/globalStyles';
import { API } from '../../../lib/api';
import Icon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { changeTheme } from '../../../redux/actions/changeTheme';
import News from './news';
import WatchList from './watchlist';
import StockTabs from './stockTab';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import LottieView from 'lottie-react-native';
let stringData = [];
var _this = null;
var timeoutForSearchApiCall = null;
var screenFrom = "";
let finalData = [];
class SearchBarScreen extends Component {

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
            loading:false,

        }
    }

    componentDidMount() {
        StatusBar.setBarStyle("light-content");
        StatusBar.setBackgroundColor(colors.blue, true);

        AsyncStorage.getItem("stockRecentSearch", (err, result) => {
            if (result != null && result != undefined) {
                _this.setState({ recentSearch: JSON.parse(result), data: JSON.parse(result), refresh: !this.state.refresh },()=>{
                    this.forceUpdate()
                })
                console.log("SAASASSA");

            }
        });
        screenFrom = this.props.screen_name;
        console.log("GET SEARCH PROPS: screen_name" + screenFrom);
    }

     
    /**
     * Method for get effect string
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

    getUnique(arr, comp) {

        const unique = arr
            .map(e => e[comp])

            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)

            // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);

        return unique;
    }

    /**
     * Method for rendr flatlist item
     */
    _renderItem = ({ item, index }) => {
        console.log("Search result " + item.symbol);

        return (
            <TouchableOpacity onPress={() => this.itemClickAction(item, index,this.state.query)}>
                <View style={styles.searchScreenItem}>
                    <View style={styles.searchScreenItemView}>
                        <View style={styles.searchScreenItemLeftView}>
                            {
                                (!this.state.isSearch) ?
                                    // <Text numberOfLines={1} style={styles.searchScreenItemTitleText}>{item.symbol}</Text>
                                    <Text numberOfLines={1} style={styles.searchScreenItemTitleText}>{item.symbol}</Text>
                                    :
                                    <Text numberOfLines={1}>{this.geteffectString(item.symbol, this.state.query.length, 16, '700')}</Text>
                            }
                        </View>
                        {(this.state.isSearch) ?
                            <View style={styles.searchScreenItemTopRightView}>
                                <Text numberOfLines={1} style={[styles.searchScreenItemTitleText,{color: (item.abs_change < 0) ? colors.redColor : (item.abs_change == 0) ? colors.blackColor : colors.greenColor, marginRight: 3}]}>{globals.checkForFloatAndRound(item.last_price)}</Text>
                            </View> : null}
                    </View>
                    <View style={styles.searchScreenItemView}>
                        <View style={styles.searchScreenItemLeftView}>
                            {
                                (!this.state.isSearch) ?
                                    null
                                    :
                                    <Text numberOfLines={1}>{this.geteffectString(item.company_name, this.state.query.length, 12, '400')}</Text>
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

    checkDuplicateValue(value, tempArray){
        let found = false;
            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i].symbol == value) {
                    found = true;
                    break;
                }
            }
            return found;
    }

    /**
     * Method for item click on flatlist
     */
    itemClickAction(object, index,value) {
        if (this.props.marketStatus) {
            StatusBar.setBarStyle("dark-content");
        }else {
            StatusBar.setBarStyle("light-content");

        }
        if (this.state.isSearch) {
            var tempArray = [];
            console.log("SEARCH FROM"+JSON.stringify(finalData));
                let isFound = this.checkDuplicateValue(value, finalData)
                if(!isFound)
                {
                    if (finalData.length == 0) {
                        tempArray.unshift({ symbol: value, stock_id: 0 })
                    }else {
                        tempArray =  this.state.recentSearch;
                        let unique = this.getUnique(tempArray, 'symbol')
                        console.log("unique---> " + JSON.stringify(unique));
                        tempArray = unique;
                        tempArray.unshift({ symbol: value, stock_id: 0 })
                    }
                    // tempArray.unshift(object)
                    this.setState({ recentSearch: tempArray, refresh: !this.state.refresh })
                    if (tempArray.length > 3) {
                        tempArray.pop()
                    }
                    finalData = tempArray;
                    AsyncStorage.setItem('stockRecentSearch', JSON.stringify(tempArray));
                }
                else {

                }
               
            // }
        } else {
            console.log("SEARCH FROM NOT");
            var tempArray = this.state.recentSearch;
            var tempObject = tempArray[index]
            tempArray.splice(index, 1)
            tempArray.unshift(tempObject)
            // this.setState({ recentSearch: tempArray, refresh: !this.state.refresh })
            this.setState({ recentSearch: tempArray,  })

            AsyncStorage.setItem('stockRecentSearch', JSON.stringify(tempArray));
        }
        

        console.log("Props-->" + JSON.stringify(this.props))

        if (object.stock_id === 0) {
            this.setState({  query: object.symbol },()=>{
                this.onChangeText(this.state.query)
            })
            this.setState({ query: object.symbol, loader: true,  }, () => {
                if (this.animation != undefined) {
                    this.animation.play();
                }
               
            })
            
        } else {
            if (this.props.screen_name == globals.screenTitle_market) {
                StockTabs._goToStockDetaill({ theme: this.state.themeStyle, stock_id: object.stock_id, symbol: object.symbol })
            } else if (this.props.screen_name == globals.screenTitle_notifications) {
                News._goToStockDetaill({ theme: this.state.themeStyle, stock_id: object.stock_id, symbol: object.symbol })
            } else if (this.props.screen_name == globals.screenTitle_watchlist) {
                WatchList._goToStockDetaill({ theme: this.state.themeStyle, stock_id: object.stock_id, symbol: object.symbol })
            }
            this.props.getShowModalSearchBar(false)
        }

        
    }

    /**
     * Method for check id is exist in list
     */
    checkIfIDExists(objID) {
        return this.state.recentSearch.some(function (el) {
            return el.stock_id === objID;
        });
    }

    /**
     * Method for recent serch Action
     */
    clearRecentSeacrchAction() {
        AsyncStorage.setItem('stockRecentSearch', JSON.stringify([]));
        this.setState({ data: [], recentSearch: [], refresh: !this.state.refresh })
    }

    /**
     * Method for clear text input in search
     */
    clearTextInputAction() {
        this.setState({ query: '', data: this.state.recentSearch, isSearch: false, refresh: !this.state.refresh })
    }

    /**
     * Method for on change text
     * @param {*} query 
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
        timeoutForSearchApiCall = setTimeout(() => {

          if (query.length > 0) {
            if (globals.isInternetConnected) {
              this.setState({ loading: true }, () => {
                this.animation.play();
              })
              API.marketSearch(this.responseSearchData, query, false);
            }
          }
          else {
          }
        }, 500);
    }

    /**
     * Method for render separator
     */
    renderSeparator() {
        return <View style={{ height: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1, marginHorizontal: 10, backgroundColor: '#E1E1E1' }}></View>
    }

    /**
     * Method for empty list item
     */
    ListEmptyComponent() {
        if (!globals.isInternetConnected) {
            if (_this.state.query.length > 1) {
                return (
                    <View style={styles.noRecordFoundView}>
                        <Image source={require("../../../assets/images/stock/noRecordFoundMarket.png")} style={{ width: 62.2, height: 50 }} resizeMode={"contain"} />
                        <Text style={styles.noRecordFoundText}>{"Apparently, you are offline.\n Please go online to get search results."}</Text>
                    </View>
                )
            }
            else {
                return null
            }
        }
        else {
            if (_this.state.query.length == 0 && _this.props.screen_name !== 'Watchlist' && _this.props.screen_name !== 'Markets') {
                    return <View style={styles.noRecordFoundView}>
                        <Image source={require("../../../assets/images/stock/noRecordFoundMarket.png")} style={{ width: 62.2, height: 50 }} resizeMode={"contain"} />
                        <Text style={styles.noRecordFoundText}>{"Search the company name you want to add to your watchlist"}</Text>
                    </View>

            }
            else {
                if (_this.state.query && _this.state.query != "" && !_this.state.isApiCall && _this.state.data && _this.state.data.length <= 0) {
                    return (
                        <View style={styles.noRecordFoundView}>
                            <Image source={require("../../../assets/images/stock/noRecordFoundMarket.png")} style={{ width: 62.2, height: 50 }} resizeMode={"contain"} />
                            <Text style={styles.noRecordFoundText}>{"Sorry, results related to \"" + _this.state.query + "\" could not be found"}</Text>
                        </View>
                    )
                }
                else {
                    console.log("ASASASASA" +_this.state.recentSearch.length );
                      
                    return null
                }
            }

        }

    }

    /**
      * Method for get response of market search API
      */
    responseSearchData = {
        success: (response) => {
          this.setState({loading: false})
            if (this.state.isSearch == false) {
                console.log("isSearch false");
                this.setState({ data: this.state.recentSearch, refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
            } else {
                if (response.sData != null && response.sData.length != 0) {
                    console.log("isSearch true 1");
                    this.setState({ data: response.sData.stock, refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
                } else {
                    console.log("isSearch true 2" + this.state.query.length);
                    this.setState({ data: [], refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
                }
            }
        },
        error: (err) => {
            this.setState({loading: false, data: [], refresh: !this.state.refresh, isApiCall: false }, () => { this.forceUpdate() })
        },
        complete: () => {
        }
    }

    /**
     * Method for close modal
     */
    closeMOdal() {
        this.refs.textInput.setNativeProps({ 'editable': false });
        if (this.props.marketStatus) {
            if (Platform.OS == 'ios') {
                StatusBar.setBarStyle("dark-content");
            }
            StatusBar.setBackgroundColor(colors.blue, true);
        } else {
            // StatusBar.setBarStyle("light-content");
            StatusBar.setBackgroundColor(colors.blackThemeColor, true);
        }
        this.props.getShowModalSearchBar(false)
    }

    componentDidUpdate() {
      if (this.state.loading) {
          if ( this.animation != undefined) {
            this.animation.play();
          }
       
      }
    }

    render() {
        return (
            <View style={globalStyles.mainViewSearchBar} removeClippedSubviews={false}>
                <View style={globalStyles.searchbarTopView}>
                    <View style={globalStyles.searchbarTopLeftView}>
                        <Ionicons name="md-search" size={Platform.OS === 'ios' ? 15 : 18} color={'gray'} />
                        <TextInput placeholder={"Search Symbol/Company"}
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
                        <TouchableOpacity onPress={() => this.closeMOdal()}>
                            <Text style={[globalStyles.cancelButton, { marginLeft: 5 }]}>{"Cancel"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.searchbarBottomView} removeClippedSubviews={false}>
                    {
                        (!this.state.isSearch && this.state.recentSearch.length > 0) ?
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
                            :
                            null
                    }
                    <KeyboardAvoidingView
                        removeClippedSubviews={false}
                        keyboardVerticalOffset={75}
                        behavior={Platform.OS === 'android' ? '' : 'padding'}
                        style={{ flex: 1 }}
                    >
                        {
                  (this.state.loading) ? <View style={{ flex: 1, justifyContent: 'center', }}><LottieView
                    style={[{ height: 80, width: 80, alignSelf: 'center' }]}
                    source={require('../../../animations/latestloader_blue.json')}
                    ref={animation => {
                      this.animation = animation;
                    }}
                    loop={true} />
                            </View> :
                            // (this.state.data.length > 0) ?
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
                            // :
                            // null
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
        searchbar_modal: state.showModalSearchBar_red.searchbar_modal,
        screen_name: state.showModalSearchBar_red.screen_name,
        theme: state.changeTheme_red.theme,
        marketStatus: state.checkMarketStatus_red.marketStatus,
    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    getShowModalSearchBar,
    changeTheme,
    checkMarketStatus,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarScreen);