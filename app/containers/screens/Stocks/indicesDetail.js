import React, { Component } from 'react';
import {
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Platform,
  FlatList,
  ActivityIndicator,
  Animated,
  StyleSheet,
  SafeAreaView,
  AsyncStorage,
} from 'react-native';
import Button from '../../../components/Button';
import Countly from 'countly-sdk-react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import globalStyles from '../../../assets/styles/globalStyles';
import { changeTheme } from '../../../redux/actions/changeTheme';
import { changeTabColor } from '../../../redux/actions/changeTabColorModel';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import styles from './style';
import { API } from '../../../lib/api';
import moment from 'moment';
import StockTabs from './stockTab';
import { HeaderBackButton } from 'react-navigation';
import firebase from 'react-native-firebase';

var themeStyle = null;
var dataRender = null;
var isMounted = false

class IndicesDetail extends Component {

  static navigationOptions = ({ navigation, screenProps, }) => {
    const { state } = navigation
    return {
      headerTitle: 'Indices',
      headerTitleStyle: [globalStyles.headerTitleStyle, { color: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.titleColor : colors.blackColor }],
      headerLeft: <HeaderBackButton style={{marginLeft: 10,}} onPress={() => navigation.goBack(null)} title='' tintColor={(navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.iconColor : colors.backLight} />,
      headerStyle: { backgroundColor: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.bgColor : colors.white, elevation: 0, shadowOpacity: 0, borderBottomWidth: 2, borderBottomColor: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.bottomSeprator : colors.categorySepViewLight, tintColor: colors.blackColor },
    }
  }

  constructor(props) {
    super(props);
    themeStyle = this.props.theme;
    console.log("This props " + JSON.stringify(this.props));

    this.state = {
      tabId: 1,
      data: null,
      tredingStatus: null,
      dataSourceGainer: [],
      loading: false,
      fadeAnim: new Animated.Value(0),
      tabBarColor: props.color,
      isServerError: false,
      isTimeout: false,
      sortingTypeCompany: 0,  // 0 - descending , 1 - accending
      sortingTypePrice: 0, // 0 - descending , 1 - accending
      sortingTypeChange: 0, // 0 - descending , 1 - accending
      sortingTypePercentange: 0 // 0 - descending, 1 - accending
    };
  }

  componentDidMount() {

    var event = { "key": globals.event_IndicesDetails, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
    Countly.recordEvent(event);
    console.log("=====segmentation record event globals.event_IndicesDetails, result=> ");
    firebase.analytics().logEvent(globals.event_IndicesDetails, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(globals.globalVars.statusBarColor, true);
    }

    this.getIndicesDetail();
    // alert("Detail")
  }

  componentWillUnmount() {
    isMounted = false
  }

  componentWillReceiveProps(newProps) {
    if (newProps.color != undefined) {
      this.setState({ tabBarColor: newProps.color })
    }
    themeStyle = this.props.theme;
    if (newProps.marketStatus != undefined) {
      console.log("Indices details this.marketStatus " + this.marketStatus);
      console.log("Indices details newProps.marketStatus " + newProps.marketStatus);

      if (this.marketStatus !== newProps.marketStatus) {
        this.marketStatus = newProps.marketStatus
        console.log("Indices details newProps.marketStatus " + newProps.marketStatus);
        this.props.navigation.setParams({ bgColor: (this.props.marketStatus) ? colors.white : colors.blackThemeColor, titleColor: (this.props.marketStatus) ? colors.blackColor : colors.white, iconColor: (this.props.marketStatus) ? colors.blue : colors.white,bottomSeprator:(this.props.marketStatus) ? colors.categorySepViewLight : colors.darkThemeHeaderSeprator })
      }
    }
  }

  /**
   * Method for get indices detail 
   */
  getIndicesDetail() {

    isMounted = true
    this.props.navigation.setParams({ bgColor: (this.props.marketStatus) ? colors.white : colors.blackThemeColor, titleColor: (this.props.marketStatus) ? colors.blackColor : colors.white, iconColor: (this.props.marketStatus) ? colors.blue : colors.white, bottomSeprator:(this.props.marketStatus) ? colors.categorySepViewLight : colors.darkThemeHeaderSeprator})
    this.setState({ loading: true });

    AsyncStorage.getItem(globals.indices_detail_timestamp + globals.current_timestamp + this.props.navigation.state.params.indices_name, (err, result) => {
      if (result !== null) {
        var diffMins = globals.getTimeDifference(result);
        if (diffMins >= 15 && globals.isInternetConnected && !this.state.isTimeout) {
          this.setState({ loading: true });
          API.indicesDetail(this.responseDataIndicesDetail, this.props.navigation.state.params.indices_name, false);
        } else {
          AsyncStorage.getItem(globals.indices_detail_dataSource + this.props.navigation.state.params.indices_name, (err, result) => {

            this.setState({ loading: false });
            if (result !== null) {
              dataRender = JSON.parse(result);
              Animated.timing(this.state.fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }).start();
              this.setListData(dataRender.sData.members);
            }
            if (this.state.isTimeout) {
              this.setState({ isServerError: true })
            }
          });
        }
      } else {
        if (globals.isInternetConnected && !this.state.isTimeout) {
          this.setState({ isInternetAvailable: true, loading: true, dataSourceGainer: [], });
          API.indicesDetail(this.responseDataIndicesDetail, this.props.navigation.state.params.indices_name, false);
        } else if (globals.isInternetConnected && this.state.isTimeout) {
          this.setState({ isServerError: true })
        } else {
          this.setState({
            dataSourceGainer: [],
            footerString: globals.networkNotAvailable,
            isInternetAvailable: false,
            loading: false
          });
        }
      }
    });
  }

  /**
  * Method for get response of indices detail API
  */
  responseDataIndicesDetail = {
    success: (response) => {
      if (isMounted) {
        this.setState({ loading: false })
        console.log("response Indices Detail: " + JSON.stringify(response));
        if (response.sData != null) {
          this.setState({ isServerError: false })
          AsyncStorage.setItem(globals.indices_detail_timestamp + globals.current_timestamp + this.props.navigation.state.params.indices_name, new Date());
          AsyncStorage.setItem(globals.indices_detail_dataSource + this.props.navigation.state.params.indices_name, JSON.stringify(response));

          dataRender = response;
          Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
          this.setListData(dataRender.sData.members);
        }
        else {
          this.setState({ isServerError: true })
        }


      }
    },
    error: (err) => {
      if (isMounted) {
        this.setState({ loading: false, isTimeout: true, }, () => { this.getIndicesDetail() })
      }
    },
    complete: () => {
      if (isMounted) {
        this.setState({ loading: false })
      }
    }
  }

  setListData(data) {
    var TempArray = []
    for (let i = 0; i < data.length; i++) {
      TempArray.push(data[i])
    }
    if (isMounted) {
      this.setState({ dataSourceGainer: TempArray }, () => console.log("indices detail data :--->  " + JSON.stringify(this.state.dataSourceGainer)))
    }
  }

  /**
 * Method for render footer 
 */
  renderIndicesFooter = () => {
    console.log("renderIndicesFooter " + this.props.marketStatus);

    if (this.state.loading == true) {
      return (
        <View style={[styles.indicesFooterDetailMain, themeStyle.trendingFooterMain,]}>
          <ActivityIndicator size="large" color={((this.props.marketStatus == false) ? colors.white : colors.blackThemeColor)} />
        </View>
      )
    } else if (this.state.dataSourceGainer.length == 0) {

      return (
        <View style={[styles.indicesFooterDetailMain, themeStyle.trendingFooterMain]}>
          <View style={{ height: '70%', alignItems: 'center', justifyContent: 'center', }}>
            <Text style={[styles.trendingFooterText, themeStyle.trendingFooterText, { textAlign: 'center' }]}>{this.state.footerString}
            </Text>
          </View>
          {
            (this.state.isInternetAvailable == false) ?
              <Button
                onPress={() => this.getIndicesDetail()}
                textStyle={[styles.buttonText, themeStyle.buttonText]}
                buttonStyles={[styles.buttonStyles, themeStyle.buttonStyles]}
                text={globals.tryAgain}></Button>
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


  renderRateValue(data) {
    if (this.props.marketStatus) {
      return ( <View style={[styles.stockListPercentageBlockGreen, {
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
      </View>)
    } else {
      return ( <View style={[styles.stockListPercentageBlockGreen, {
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
      </View>)
    }
  }

  /**
  * Method for render Stock list item 
  * @param {*} data 
  * @param {*} index  
  */
  renderStockList(resData, index) {
    var data = resData.item;
    let { fadeAnim } = this.state;
    return (

      <Animated.View style={[styles.stockListMain, themeStyle.stockListMain, { opacity: 1 }]}>
        <TouchableOpacity onPress={() => { StockTabs._goToStockDetaill({ theme: themeStyle, stock_id: data.stock_id, symbol: data.symbol }) }}>
          <View style={[styles.listItemMainView, themeStyle.listItemMainView]}>
            <View style={styles.stockListNameMainBlock}>
              <View style={styles.column}>
                <View style={styles.stockListNameMainBlockOrientationChild}>
                  <Text numberOfLines={1} style={[styles.listItemTitle, themeStyle.listItemTitle]}>{data.symbol}</Text>
                </View>
                <Text numberOfLines={1} style={[styles.listItemSmallText, themeStyle.listItemSmallText]}>{data.company_name}</Text>
              </View>
            </View>
            <View style={styles.stockListPriceBlock}>
              <Text style={[styles.listItemPrice, themeStyle.listItemPrice, {marginRight:10}]}>{globals.checkForFloatAndRound(data.last)}</Text>
            </View>
            {/* <View style={styles.stockListChangeBlock}>
              <Text style={[styles.listItemPriceRatePercentage, {
                color: (data.change < 0) ? colors.redColor :
                  (data.change == 0) ? ((this.props.marketStatus == false) ? colors.white : colors.blackColor) : colors.greenColor
              }]}>{globals.checkForFloatAndRound(data.change)}</Text>
            </View> */}
            {/* <View style={styles.stockListPercentageBlock}>
              <Text style={[styles.listItemPriceRatePercentage, {
                color: (data.per_change < 0) ? colors.redColor : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.white : colors.blackColor) : colors.greenColor
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
        </TouchableOpacity>
        <View style={[styles.horizontalSepratorListItem, themeStyle.horizontalSepratorListItem, styles.listItemSeprator]} />
      </Animated.View >
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
        this.state.dataSourceGainer.sort((a, b) => b.symbol.localeCompare(a.symbol))
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
      else {
        this.state.dataSourceGainer.sort((a, b) => a.symbol.localeCompare(b.symbol))
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
    }
    else if (id == '2') {
      if (this.state.sortingTypePrice == 0) {
        this.state.dataSourceGainer.sort((a, b) => b.last - a.last);
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
      else {
        this.state.dataSourceGainer.sort((a, b) => a.last - b.last);
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
    }
    else if (id == '3') {
      if (this.state.sortingTypeChange == 0) {
        this.state.dataSourceGainer.sort((a, b) => b.change - a.change)
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
      else {
        this.state.dataSourceGainer.sort((a, b) => a.change - b.change)
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
    }
    else if (id == '4') {
      if (this.state.sortingTypePercentange == 0) {
        this.state.dataSourceGainer.sort((a, b) => b.per_change - a.per_change)
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
      else {
        this.state.dataSourceGainer.sort((a, b) => a.per_change - b.per_change)
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
    }
    else { }
  }

  render() {
    return (
      <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: this.state.tabBarColor }]}>
        <View style={[styles.searchScreenItemLeftView, themeStyle.mainView]}>
          <View style={[styles.headingContainer, themeStyle.trendingSection, { flexWrap: 'wrap' }]}>
            <View style={[styles.headingContainer, { padding: 0 }]}>
              <Text numberOfLines={1} style={[styles.trendingTitle, themeStyle.trendingTitle, { flex: 1 }]}>{this.props.navigation.state.params.indices_name}</Text>
              <Text style={[styles.trendingTitle, themeStyle.trendingTitle, { fontWeight: '300' }]}>{globals.checkForFloatAndRound(this.props.navigation.state.params.indices_value)}</Text>
            </View>
            <View style={[styles.headingContainer, { padding: 0 }]}>
              <Text style={[styles.trendingSubTitle, themeStyle.listItemSmallText, { flex: 1 }]}>{this.props.navigation.state.params.indices_description}</Text>
              <Text style={[styles.trendingSubTitle, themeStyle.listItemSmallText, { fontSize: 10 }]}>{moment.unix(this.props.navigation.state.params.indices_timestamp).format('D MMM, h:mm A')}</Text>
            </View>
          </View>

          <View style={[styles.stockListMain, { height: 25 }, themeStyle.trendingSection]}>
          <View style={[styles.listItemMainView, { paddingTop: 0, paddingBottom: 0 }]}>
            <TouchableOpacity style={[styles.stockListNameMainBlock, { alignItems: 'flex-start' }]} onPress={() => this.sortData('1')}>
              <View style={[styles.stockListNameMainBlock, { alignItems: 'flex-start' }]}>
                <Text numberOfLines={1} style={[styles.listHeaderTagText, themeStyle.listHeaderTagText]}>Company</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.sortData('2')}>
              <View style={[styles.stockListPriceBlock, { flex: 1, marginTop: 0, }]}>
                <Text numberOfLines={1} style={[styles.listHeaderTagText, themeStyle.listHeaderTagText,]}>Price</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.stockListPercentageBlockGreenHeader, { backgroundColor: colors.transparent, margingHorizontal: 0, padding: 0 }]} onPress={() => this.sortData('4')}>
              <View style={[styles.stockListPercentageBlockGreenHeader, { backgroundColor: colors.transparent, marginLeft :10 ,flex: 1, margingHorizontal: 0, }]}>
                <Text numberOfLines={1} style={[styles.listHeaderTagText, themeStyle.listHeaderTagText]}>Rate %</Text>
              </View>
            </TouchableOpacity>
          </View>
            {/* <View style={[styles.listItemMainView, { paddingTop: 0, paddingBottom: 0 }]}>
              <TouchableOpacity style={[styles.stockListNameMainBlock, { alignItems: 'flex-start' }]} onPress={() => this.sortData('1')}>
                <View style={[styles.stockListNameMainBlock, { alignItems: 'flex-start' }]}>
                  <Text numberOfLines={1} style={[styles.listHeaderTagText, themeStyle.listHeaderTagText]}>Company</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.stockListPriceBlock,{marginTop: 0}]} onPress={() => this.sortData('2')}>
                <View style={[styles.stockListPriceBlock,{marginTop: 0}]}>
                  <Text numberOfLines={1} style={[styles.listHeaderTagText, themeStyle.listHeaderTagText]}>Price</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.stockListPercentageBlockGreen, { backgroundColor: colors.transparent, margingHorizontal: 0, padding: 0 }]} onPress={() => this.sortData('4')}>
                <View style={[styles.stockListPercentageBlockGreen, { backgroundColor: colors.transparent, flex: 1, margingHorizontal: 0, marginTop: -4 }]}>
                  <Text numberOfLines={1} style={[styles.listHeaderTagText, themeStyle.listHeaderTagText]}>Rate %</Text>
                </View>
              </TouchableOpacity>
            </View> */}
          </View>

          <View style={[styles.horizontalSeprator, themeStyle.horizontalSeprator]} />
          {(this.state.isServerError && this.state.dataSourceGainer.length == 0) ? <View style={[styles.indicesFetchNoAbleToFetchMain, themeStyle.trendingFooterMain,]}>
            <Text style={[styles.incidesNotAbleToFetch, themeStyle.trendingFooterText, { textAlign: 'center' }]}>{globals.timeoutMessage}</Text>
          </View> : <FlatList
              style={styles.indicesDetailFlatlistView}
              ref={"indicesListView"}
              renderItem={(rowData, rowID) => this.renderStockList(rowData, rowID)}
              data={this.state.dataSourceGainer}
              ListFooterComponent={this.renderIndicesFooter}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state}
              ItemSeparatorComponent={this.renderSeparator}
            />}
        </View >
      </SafeAreaView>
    )
  }
}
// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
  return {
    theme: state.changeTheme_red.theme,
    color: state.changeTabColor_red.color,
    marketStatus: state.checkMarketStatus_red.marketStatus
  }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
  changeTheme,
  checkMarketStatus,
  changeTabColor
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(IndicesDetail);
