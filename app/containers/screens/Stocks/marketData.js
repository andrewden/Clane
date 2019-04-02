
import React, { Component } from 'react';
import {
    View,
    Text,
    ListView,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import styles from './style';

import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeTheme } from '../../../redux/actions/changeTheme';
import globalStyles from '../../../assets/styles/globalStyles';
import { API } from '../../../lib/api';
import Button from '../../../components/Button';

// var this.state.themeStyle = null;
var _this = null;
var str_stockID = '';
var marketDataValue = [];

class MarketData extends Component {

    constructor(props) {
        super(props);
        _this = this;
        // themeStyle = this.props.theme;
        this.state = {
            listData: null,
            loading: false,
            themeStyle: this.props.theme,
            tempMarketData: [],
            isTimeout: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        };
    }

    componentDidMount() {
         
        this.setState({ loading: true })
        str_stockID = _this.props.route.str_stockID;
        if (str_stockID != '' && str_stockID != undefined) {
            
            AsyncStorage.getItem(globals.key_stockMarketData + str_stockID, (err, result) => {
                if (result !== null) {
                    var response = JSON.parse(result);
                    console.log("responseData MarketDataLOCAL " + JSON.stringify(response));
                    
                    marketDataValue = [];
                    this.setState({ loading: false, listData: response })
                    var count = Object.keys(response.sData).length;
                    console.log("KEYVALUE Lenght " + count);
                    for (let index = 0; index < count; index++) {
                        var key = Object.keys(response.sData)[index];
                        value = response.sData[key]
                        console.log("value KEY " + value);
                        if (value != null) {
                            if (value > 1000000000) {
                                value = (value / 1000000000).toFixed(2) + "B";
                            } else if (value > 1000000) {
                                value = (value / 1000000).toFixed(2) + "M";
                            } else {
                                value = response.sData[key]
                            }
                        } else {
                            value = 0
                        }
                        this.renderArrayListData(key, value);
                    }
                    marketDataValue.sort(this.compare);
                    this.setState({ tempMarketData: marketDataValue })
                } else {
                    if (globals.isInternetConnected) {
                        API.stockInfoWithMarketData(this.responseMarketData, str_stockID, false);
                    }
                    
                }
            });
        }
    }

    /**
    * Method for get response of stock market data API
    */
    responseMarketData = {
        success: (response) => {
            console.log("RESPONSE Market DATA " + JSON.stringify(response));
            try {

                AsyncStorage.setItem(globals.market_stock_marketdata_timeStamp + str_stockID ,new Date());
                AsyncStorage.setItem(globals.key_stockMarketData + str_stockID, JSON.stringify(response));

                marketDataValue = [];
                this.setState({ loading: false, listData: response })
                var count = Object.keys(response.sData).length;
                console.log("KEYVALUE Lenght " + count);
                for (let index = 0; index < count; index++) {
                    var key = Object.keys(response.sData)[index];
                    value = response.sData[key]
                    console.log("value KEY " + value);
                    if (value != null) {
                        if (value > 1000000000) {
                            value = (value / 1000000000).toFixed(2) + "B";
                        } else if (value > 1000000) {
                            value = (value / 1000000).toFixed(2) + "M";
                        } else {
                            value = response.sData[key]
                        }
                    } else {
                        value = 0
                    }
                    this.renderArrayListData(key, value);
                }
                marketDataValue.sort(this.compare);
                this.setState({ tempMarketData: marketDataValue })
            } catch (error) {
                this.setState({ loading: true })
            }
        },
        error: (err) => {
            this.setState({isTimeout : true, tempMarketData: []})
            //alert(err.sMessage);
        },
        complete: () => {
        }
    }

    /**
     * Method for sort array data
     * @param {*} a 
     * @param {*} b 
     */
    compare(a, b) {
        if (a.number < b.number)
            return -1;
        if (a.number > b.number)
            return 1;
        return 0;
    }

    /**
     * Method for render data in arraylist position wise
     * @param {*} lable 
     * @param {*} value 
     */
    renderArrayListData(lable, value) {
        switch (lable) {
            case 'open':
                marketDataValue.push({ number: 1, lable: "Open", value: value })
                break;

            case 'close':
                marketDataValue.push({ number: 2, lable: "Close", value: value })
                break;

            case 'high':
                marketDataValue.push({ number: 3, lable: "High", value: value })
                break;

            case 'volume':
                marketDataValue.push({ number: 4, lable: "Volume", value: value })
                break;

            case 'low':
                marketDataValue.push({ number: 5, lable: "Low", value: value })
                break;

            case 'market_cap':
                marketDataValue.push({ number: 6, lable: "Mkt Cap", value: value })
                break;

            case 'high_52_wk':
                marketDataValue.push({ number: 7, lable: "52W High", value: value })
                break;

            case 'yield':
                marketDataValue.push({ number: 8, lable: "Yield", value: value })
                break;

            case 'low_52_wk':
                marketDataValue.push({ number: 9, lable: "52W Low", value: value })
                break;

            case 'trades':
                marketDataValue.push({ number: 10, lable: "Trades", value: value })
                break;

            default:
                break;
        }
    }


    componentWillReceiveProps(newProps) {
         
        if (newProps.theme != undefined) {
            this.setState({
                themeStyle: newProps.theme
            })
        }
         
    }

    

    /**
   * Method for render market data list item 
   * @param {*} data 
   * @param {*} index  
   */
    renderMarketData(resData, index) {
        var data = resData.item;
        return (
            <View style={[styles.column, { flex: 1 }]}>
                <View style={[styles.marketMainView, this.state.themeStyle.marketDataSepratorNew]}>
                    <Text style={[styles.marketLableView, this.state.themeStyle.companyInfoHeadingText]}>{data.lable}</Text>
                    <Text style={[styles.marketValueView, this.state.themeStyle.companyInfoSubtitleText]} >{data.value}</Text>
                </View>
            </View>
        )
    }

    tryAgainButtonClick (){
        API.stockInfoWithMarketData(this.responseMarketData, str_stockID, false);
    }

    render() {
        if (  this.state.tempMarketData.length == 0 && this.state.isTimeout ) {
            return (<SafeAreaView style={globalStyles.safeviewStyle}>
                <View style={styles.noInternetTextView}>
                    <Text style={[styles.trendingFooterText, {textAlign:'center'},this.state.themeStyle.trendingFooterText]}>{globals.timeoutMessage}
                    </Text>
                     
                </View>
            </SafeAreaView>)
        }

        else if (globals.isInternetConnected == false && this.state.tempMarketData == null ) {
            return (<SafeAreaView style={globalStyles.safeviewStyle}>
                <View style={styles.noInternetTextView}>
                    <Text style={[styles.trendingFooterText, this.state.themeStyle.trendingFooterText]}>{globals.networkNotAvailable}
                    </Text>
                    <View style={{ marginTop: 20 }}>
                        <Button
                            onPress={() => this.tryAgainButtonClick()}
                            textStyle={[styles.buttonText, this.state.themeStyle.buttonText]}
                            buttonStyles={[styles.buttonStyles, this.state.themeStyle.buttonStyles]}
                            text={globals.tryAgain}></Button>
                    </View>
                </View>
            </SafeAreaView>)
        }
        else if (globals.isInternetConnected  && this.state.tempMarketData == null ) {
            return (<SafeAreaView style={globalStyles.safeviewStyle}>
                <View style={styles.noInternetTextView}>
                    <Text style={[styles.trendingFooterText, this.state.themeStyle.trendingFooterText]}>{globals.unableToFetchData}
                    </Text>
                    <View style={{ marginTop: 20 }}>
                        <Button
                            onPress={() => this.tryAgainButtonClick()}
                            textStyle={[styles.buttonText, this.state.themeStyle.buttonText]}
                            buttonStyles={[styles.buttonStyles, this.state.themeStyle.buttonStyles]}
                            text={globals.tryAgain}></Button>
                    </View>
                </View>
            </SafeAreaView>)
        }
        else {
            if (this.state.loading == true) {
                return (
                    <SafeAreaView style={globalStyles.safeviewStyle}>
                        <View style={[this.state.themeStyle.mainRenderView, { alignItems: 'center', height: globals.WINDOW.height - globals.bottomTabbarHeight, justifyContent: 'center', }]}>
                            <ActivityIndicator size="large" color={((this.props.marketStatus ? colors.blackThemeColor : colors.white))} />
                        </View>
                    </SafeAreaView>
                )
            } else {
                return (
                    <SafeAreaView style={globalStyles.safeviewStyle}>
                      
                        {/* <View style={[this.state.themeStyle.mainRenderView, { flex: 1, backgroundColor: 'red' }]}> */}
                            <FlatList
                                ref={"marketDataListView"}
                                renderItem={(rowData, rowID) => this.renderMarketData(rowData, rowID)}
                                data={this.state.tempMarketData}
                                numColumns={2}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}
                            />
                        {/* </View> */}
                    </SafeAreaView>
                )
            }
        }

    }
}

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
    return {
        theme: state.changeTheme_red.theme,
    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    changeTheme,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(MarketData);