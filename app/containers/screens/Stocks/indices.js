import React, { Component } from 'react';
import {
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import Countly from 'countly-sdk-react-native';
import Button from '../../../components/Button';
import styles from './style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as colors from '../../../assets/styles/color';
import * as globals from '../../../lib/globals';
import globalStyles from '../../../assets/styles/globalStyles';
import { API } from '../../../lib/api';
import { getshowLoader } from '../../../redux/actions/showLoaderModal';
import { changeTheme } from '../../../redux/actions/changeTheme';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import dark_theme from './darkTheme';
import light_theme from './lightTheme';
import StockTabs from './stockTab';
import moment from 'moment';
import BackgroundTimer from 'react-native-background-timer';
import firebase from 'react-native-firebase';

var themeStyle = null;
var isMounted = true

class Indices extends Component {

  constructor(props) {
    super(props);
    themeStyle = this.props.theme;
    _this = this
    this.state = {
      dataSourceGainer: [],
      footerString: '',
      tredingStatus: true,
      loading: false,
      isInternetAvailable: true,
      last_update: '',
      sortingTypeCompany: 0,  // 0 - descending , 1 - accending
      sortingTypePrice: 0, // 0 - descending , 1 - accending
      sortingTypeChange: 0, // 0 - descending , 1 - accending
      sortingTypePercentange: 0 // 0 - descending, 1 - accending
    };
  }

  componentDidMount() {

    var event = { "key": globals.event_Indices, "count": 1 };
    event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
    Countly.recordEvent(event);
    console.log("=====segmentation record event globals.event_Indices, result=> ");

    firebase.analytics().logEvent(globals.event_Indices, globals.getAnalyticBasicData(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global));

    this.setState({ tredingStatus: this.props.marketStatus })
    if (!globals.isInternetConnected) {
      var bools = globals.checkThemeInOfflineMode();
      this.setState({ tredingStatus: bools });
      if (bools) {
        globals.globalVars.statusBarColor = colors.blue
      } else {
        globals.globalVars.statusBarColor = colors.blackThemeColor
      }
    }
    this.getTimeIntervalForIndices();
    BackgroundTimer.runBackgroundTimer(() => {
      if (globals.isInternetConnected == true) {
        console.log("Internet available NEWSS");
        this.callWSToGetIndices();
      }
    }, 21600000);//900000 
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tredingStatus: nextProps.marketStatus })
    themeStyle = this.props.theme;
  }

  /**
   * Method for get time interval indices
   */
  getTimeIntervalForIndices() {
    AsyncStorage.getItem(globals.market_indices_timeStamp, (err, result) => {
      if (result !== null) {
        var diffMins = globals.getTimeDifference(result);
        if (diffMins >= 15 && globals.isInternetConnected) {
          this.callWSToGetIndices();
        } else {
          AsyncStorage.getItem(globals.market_async_indices, (err, result) => {
            if (result !== null) {
              var responseData = JSON.parse(result);
              if (responseData.sStatus == 1) {
                if (!globals.isInternetConnected) {
                  this.setState({ tredingStatus: globals.checkThemeInOfflineMode() });
                }
                this.formatListArrayData(responseData);
                this.setTheme();
              }
            }
          });
        }
      } else {
        if (globals.isInternetConnected) {
          this.setState({ isInternetAvailable: true, });
          this.callWSToGetIndices();
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
  * Method for scrolling list to top on tap press
  */
  scrollListToTop() {
    setTimeout(() => {
      this.refs.indicesListView.scrollToOffset({ animated: false, viewOffset: 100 })
    }, 100);
  }

  /**
   * Method for render footer 
   */
  renderIndicesFooter = () => {
    if (this.state.loading == true) {
      return (
        <View style={[styles.indicesFooterMain, themeStyle.trendingFooterMain]}>
          <ActivityIndicator size="large" color={(this.state.tredingStatus == globals.marketStatusClose ? colors.white : colors.blackThemeColor)} />
        </View>
      )
    } else if (this.state.dataSourceGainer.length == 0) {
      return (
        <View style={[styles.indicesFooterMain, themeStyle.trendingFooterMain]}>
          <View style={styles.noInternetTextView}>
            <Text style={[styles.trendingFooterText, themeStyle.trendingFooterText, { marginTop: 45, textAlign: 'center' }]}>{this.state.footerString}
            </Text>
          </View>
          {
            (this.state.isInternetAvailable == false) ?
              <View style={styles.tryAgainButtonView}>
                <Button
                  onPress={() => this.getTimeIntervalForIndices()}
                  textStyle={[styles.buttonText, themeStyle.buttonText]}
                  buttonStyles={[styles.buttonStyles, themeStyle.buttonStyles]}
                  text={globals.tryAgain}></Button>
              </View>
              : null
          }
        </View>
      )
    } else {
      return (
        null
      )
    }
  }

  /**
   * Method for set Theme 
   */
  setTheme() {
    console.log("tredingStatus Indices " + this.state.tredingStatus);
    if (this.state.tredingStatus) {
      this.props.changeTheme(light_theme)
      this.props.checkMarketStatus(true)
      globals.globalVars.statusBarColor = colors.blue
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(globals.globalVars.statusBarColor, true);
      }
    } else {
      this.props.changeTheme(dark_theme)
      this.props.checkMarketStatus(false)
      globals.globalVars.statusBarColor = colors.blackThemeColor
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(globals.globalVars.statusBarColor, true);
      }
    }
    themeStyle = this.props.theme
  }

  /**
   * Method for get indices
   */
  callWSToGetIndices() {
    this.props.getshowLoader(false);
    isMounted = true
    API.indices(this.responseData, false);
  }

  /**
  * Method for get response of market status API
  */
  responseData = {
    success: (response) => {
      console.log("response Indices: " + JSON.stringify(response));
      this.props.getshowLoader(false);
      try {
        AsyncStorage.setItem(globals.market_indices_timeStamp, new Date());
        AsyncStorage.setItem(globals.market_async_indices, JSON.stringify(response));
        this.formatListArrayData(response);
      } catch (error) {
        this.props.getshowLoader(false);
      }
    },
    error: (err) => {
      this.props.getshowLoader(false);
      AsyncStorage.getItem(globals.market_async_indices, (error, result) => {
        if (result !== null) {
          var responseData = JSON.parse(result);
          if (responseData.sStatus == 1) {
            if (!globals.isInternetConnected) {
              this.setState({ tredingStatus: globals.checkThemeInOfflineMode() });
            }
            this.formatListArrayData(responseData);
            this.setTheme();
          }
        } else {
          this.setState({
            dataSourceGainer: [],
            loading: false,
            last_update: '',
            footerString: globals.timeoutMessage
          });
        }
      });
      //this.formatListArrayData(err);
    },
    complete: () => {
      this.props.getshowLoader(false);
    }
  }

  /**
   * Method for render data in listing
   * @param {*} responseData 
   */
  formatListArrayData(responseData) {
    if (isMounted) {
      if (responseData.sStatus == 1) {
        var sectionArray = [...responseData.sData.indices_data]
        this.setState({
          dataSourceGainer: sectionArray,
          loading: false,
          footerString: '',
          last_update: responseData.sData.date
        })
      } else if (responseData.sStatus == 0) {
        this.setState({
          dataSourceGainer: [...responseData.sData.indices_data],
          loading: false,
          last_update: responseData.sData.date
        });
      }
    }
    console.log("Indices data :--->  " + JSON.stringify(this.state.dataSourceGainer))
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
        this.state.dataSourceGainer.sort((a, b) => b.value - a.value);
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
      else {
        this.state.dataSourceGainer.sort((a, b) => a.value - b.value);
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
    }
    else if (id == '3') {
      if (this.state.sortingTypeChange == 0) {
        this.state.dataSourceGainer.sort((a, b) => b.absolute_change - a.absolute_change)
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
      else {
        this.state.dataSourceGainer.sort((a, b) => a.absolute_change - b.absolute_change)
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
    }
    else if (id == '4') {
      if (this.state.sortingTypePercentange == 0) {
        this.state.dataSourceGainer.sort((a, b) => b.percentage_change - a.percentage_change)
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
      else {
        this.state.dataSourceGainer.sort((a, b) => a.percentage_change - b.percentage_change)
        this.setState({ dataSourceGainer: this.state.dataSourceGainer }, () => this.forceUpdate())
      }
    }
    else { }
  }

  render() {
    let lastUpdate = <Text />;
    if (this.state.last_update != null) {
      lastUpdate = <Text style={[styles.lastUpdated, themeStyle.lastUpdated]}>Last updated:{"\n"}{moment.unix(this.state.last_update).format('D MMM, h:mm A')}</Text>
    }
    return (
      <View style={[styles.searchScreenItemLeftView, themeStyle.mainView]}>
        <View style={[styles.headingContainer, themeStyle.trendingSection]}>
          <Text style={[styles.trendingTitle, themeStyle.trendingTitle]}>Indices</Text>
          {lastUpdate}
        </View>
        <View style={[styles.stockListMain, { height: 25 }, themeStyle.trendingSection]}>
          <View style={[styles.listItemMainView, { paddingTop: 0, paddingBottom: 0 }]}>
            <TouchableOpacity style={[styles.stockListNameMainBlock, { flex: 1.5,alignItems: 'flex-start' }]} onPress={() => this.sortData('1')}>
              <View style={[styles.stockListNameMainBlock, { alignItems: 'flex-start' }]}>
                <Text numberOfLines={1} style={[styles.listHeaderTagText, themeStyle.listHeaderTagText]}>Company</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.sortData('2')}>
              <View style={[styles.stockListPriceBlock, { flex: 0.7, marginTop: 0,}]}>
                <Text numberOfLines={1} style={[styles.listHeaderTagText, themeStyle.listHeaderTagText,{marginRight:0}]}>Price</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.stockListPercentageBlockGreenHeader, { backgroundColor: colors.transparent, margingHorizontal: 0, padding: 0 }]} onPress={() => this.sortData('4')}>
              <View style={[styles.stockListPercentageBlockGreenHeader, { backgroundColor: colors.transparent, marginLeft :10, flex: 1, margingHorizontal: 0, marginRight:-5 }]}>
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
              <View style={[styles.stockListPercentageBlockGreen, { backgroundColor: colors.transparent, flex: 1, margingHorizontal: 0, }]}>
                <Text numberOfLines={1} style={[styles.listHeaderTagText, themeStyle.listHeaderTagText]}>Rate %</Text>
              </View>
            </TouchableOpacity>
          </View> */}
        </View>
        <View style={[styles.horizontalSeprator, themeStyle.horizontalSeprator]} />
        <View style={{ flex: 1 }}>
          <FlatList
            style={styles.indicesFlatlistView}
            ref={"indicesListView"}
            renderItem={(rowData, rowID) => this.renderIndicesList(rowData, rowID)}
            data={this.state.dataSourceGainer}
            ListFooterComponent={this.renderIndicesFooter}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
      </View>
    )
  }

  /**
   * Method for render seprator
   */
  renderSeparator() {
    return <View style={[{ height: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1, marginHorizontal: 15 }, themeStyle.horizontalSepratorListItem]}></View>
  }


  renderRateValue(data) {
    if (this.props.marketStatus) {
      return (<View style={[styles.stockListPercentageBlockGreen, {
      }]}>
        <View style={{
          width: '85%', flex: 1, justifyContent: 'center', alignItems: 'center',
          backgroundColor: (data.per_change < 0) ? colors.lightRed : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.transparent : colors.transparent) : colors.lightGreen, marginHorizontal: 5,
        }}>
          <Text style={[styles.listItemPriceRatePercentage, {
            color: (data.per_change < 0) ? colors.redColor : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.white : colors.blackColor) : colors.greenColor,
            // backgroundColor: (data.per_change < 0) ? colors.lightRed : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.transparent : colors.transparent) : colors.lightGreen, marginHorizontal: 5,
          }]}>{globals.checkForFloatAndRound(data.percentage_change) ? '' + globals.checkForFloatAndRound(data.percentage_change) + '%' : ''}</Text>
        </View>
      </View>)
    } else {
      return (<View style={[styles.stockListPercentageBlockGreen, {
      }]}>
        <View style={{
          width: '85%', flex: 1, justifyContent: 'center', alignItems: 'center',
          backgroundColor: (data.per_change < 0) ? colors.darkRed : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.transparent : colors.transparent) : colors.darkGreen, marginHorizontal: 5,
        }}>
          <Text style={[styles.listItemPriceRatePercentage, {
            color: (data.per_change < 0) ? colors.darkDownStockTextColor : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.white : colors.blackColor) : colors.darkUpStockTextColor,
            // backgroundColor: (data.per_change < 0) ? colors.lightRed : (data.per_change == 0) ? ((this.props.marketStatus == false) ? colors.transparent : colors.transparent) : colors.lightGreen, marginHorizontal: 5,
          }]}>{globals.checkForFloatAndRound(data.percentage_change) ? '' + globals.checkForFloatAndRound(data.percentage_change) + '%' : ''}</Text>
        </View>
      </View>)
    }
  }

  /**
   * Method for render indices list
   * @param {*} resData 
   * @param {*} index 
   */
  renderIndicesList(resData, index) {
    var data = resData.item;
    return (
      <SafeAreaView style={globalStyles.safeviewStyle}>
        <View style={[styles.stockListMain, themeStyle.stockListMain]}>
          <TouchableOpacity onPress={() => StockTabs._goToIndicesDetail({ theme: themeStyle, indices_name: data.symbol, indices_value: data.value, indices_description: data.description, indices_timestamp: this.state.last_update })}>
            <View style={[styles.listItemMainView, themeStyle.listItemMainView]}>
              <View style={styles.stockListNameMainBlock}>
                <View style={styles.column}>
                  <View style={styles.stockListNameMainBlockOrientationChild}>
                    <Text numberOfLines={1} style={[styles.listItemTitle, themeStyle.listItemTitle]}>{data.symbol}</Text>
                  </View>
                  <Text numberOfLines={1} style={[styles.listItemSmallText, themeStyle.listItemSmallText]}>{data.description}</Text>
                </View>
              </View>
              <View style={styles.stockListPriceBlock}>
                <Text numberOfLines={1} style={[styles.listItemPrice, themeStyle.listItemPrice,{paddingRight:10}]}>{globals.checkForFloatAndRound(data.value)}</Text>
              </View>
              {/* <View style={styles.stockListChangeBlock}>
                <Text style={[styles.listItemPriceRatePercentage, {
                  color: (data.absolute_change < 0) ? colors.redColor :
                    (data.absolute_change == 0) ? ((this.state.tredingStatus == false) ? colors.white : colors.blackColor) : colors.greenColor
                }]}>{globals.checkForFloatAndRound(data.absolute_change)} </Text>
              </View> */}
              {/* <View style={styles.stockListPercentageBlock}>
                <Text style={[styles.listItemPriceRatePercentage, {
                  color: (data.percentage_change < 0) ? colors.redColor : (data.percentage_change == 0) ? ((this.state.tredingStatus == false) ? colors.white : colors.blackColor) : colors.greenColor
                }]}>{globals.checkForFloatAndRound(data.percentage_change) ? '(' + globals.checkForFloatAndRound(data.percentage_change) + '%)' : ''}</Text>
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
                  }]}>{globals.checkForFloatAndRound(data.percentage_change) ? '' + globals.checkForFloatAndRound(data.percentage_change) + '%' : ''}</Text>
                </View>
              </View> */}
            </View>
          </TouchableOpacity>
          {/* <View style={[styles.horizontalSepratorListItem, themeStyle.horizontalSepratorListItem, styles.listItemSeprator]} /> */}
        </View>
      </SafeAreaView>
    )
  }
}

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
  return {
    loader: state.claneLoader_red.loader,
    theme: state.changeTheme_red.theme,
    marketStatus: state.checkMarketStatus_red.marketStatus
  }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
  getshowLoader,
  changeTheme,
  checkMarketStatus
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Indices);