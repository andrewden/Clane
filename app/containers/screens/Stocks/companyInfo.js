import React, { Component } from 'react';
import {
    StatusBar,
    View,
    Text,
    Platform,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
    AsyncStorage,
    FlatList
} from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import globalStyles from '../../../assets/styles/globalStyles';
import { changeTheme } from '../../../redux/actions/changeTheme';
import { changeTabColor } from '../../../redux/actions/changeTabColorModel';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import { getshowLoader } from "../../../redux/actions/showLoaderModal";
import { getShowModalSearchBar } from '../../../redux/actions/showModalSearchBar';
import styles from './style';
import moment from 'moment';
import { API } from '../../../lib/api';
import Button from '../../../components/Button';

var _this = null;
var str_stockID = '';
var companyDataValue = [];

class CompanyInfo extends Component {

    static navigationOptions = ({ navigation, screenProps, }) => {
        const { state } = navigation;
        return {
            title: globals.screenTitle_companyInfo,
            headerStyle: { backgroundColor: state.params.theme.renderHeader.backgroundColor, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title='' tintColor='white' />
        }
    }

    constructor(props) {
        super(props);
        _this = this
        this.state = {
            listData: null,
            loading: false,
            isTimeout: false,
            themeStyle: this.props.theme,
            tempCompanyData: []
        };
    }

    fetchDataFromLocalCache(){
        AsyncStorage.getItem(globals.key_stockCompanyData + str_stockID, (err, result) => {
            if (result !== null) {
                var response = JSON.parse(result);
                console.log("responseData CompanyDataLOCAL " + JSON.stringify(response));

                this.setState({ loading: false, listData: response })
                companyDataValue = [];
                var count = Object.keys(response.sData).length;
                console.log("KEYVALUE Lenght " + count);
                for (let index = 0; index < count; index++) {
                    var key = Object.keys(response.sData)[index];
                    value = response.sData[key]
                    console.log("value KEY " + value);
                    if (value != null) {
                        value = response.sData[key]
                    } else {
                        value = 'N/A'
                    }
                    this.renderArrayListData(key, value);
                }
                companyDataValue.sort(this.compare);
                this.setState({ tempCompanyData: companyDataValue })


            } else {
                API.stockInfoWithCompanyInfo(this.responseStockInfoData, str_stockID, false);
            }
        });
    }

    

    componentDidMount() {
         
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(globals.globalVars.statusBarColor, true);
        }
        str_stockID = _this.props.route.str_stockID
        if (str_stockID != '' && str_stockID != undefined) {
               this.fetchDataFromLocalCache();
             
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.theme != undefined) {
            this.setState({
                themeStyle: newProps.theme
            })
        }
    }
    
    compare(a, b) {
        if (a.number < b.number)
            return -1;
        if (a.number > b.number)
            return 1;
        return 0;
    }

    /**
      * Method for get response of stock info API
      */
    responseStockInfoData = {
        success: (response) => {
            try {
                this.setState({ loading: false, listData: response })
                companyDataValue = [];
                var count = Object.keys(response.sData).length;
                console.log("KEYVALUE Lenght " + count);
                for (let index = 0; index < count; index++) {
                    var key = Object.keys(response.sData)[index];
                    value = response.sData[key]
                    console.log("value KEY " + value);
                    if (value != null) {
                        value = response.sData[key]
                    } else {
                        value = 'N/A'
                    }
                    this.renderArrayListData(key, value);
                }
                companyDataValue.sort(this.compare);
                this.setState({ tempCompanyData: companyDataValue })
            } catch (error) {
                this.setState({ loading: true })
            }
        },
        error: (err) => {
            // alert(err.sMessage);
            //this.fetchDataFromLocalCache();
            this.setState({ loading: false, isTimeout : true, tempCompanyData: [] })
        },
        complete: () => {
        }
    }

    /**
     * Method for render arraylist data
     */
    renderArrayListData(lable, value) {
        switch (lable) {
            case 'symbol':
                companyDataValue.push({ number: 1, lable: "Symbol", value: value })
                break;

            case 'company_name':
                companyDataValue.push({ number: 2, lable: "Company Name", value: value })
                break;

            case 'asset':
                companyDataValue.push({ number: 3, lable: "Asset", value: value })
                break;

            case 'stock_index':
                companyDataValue.push({ number: 4, lable: "Index", value: value })
                break;

            case 'sector':
                companyDataValue.push({ number: 5, lable: "Sector", value: value })
                break;

            case 'telephone':
                companyDataValue.push({ number: 6, lable: "Telephone", value: value })
                break;

            case 'email':
                companyDataValue.push({ number: 7, lable: "E-Mail", value: value })
                break;

            case 'auditor':
                companyDataValue.push({ number: 8, lable: "Auditor", value: value })
                break;

            case 'registrar':
                companyDataValue.push({ number: 9, lable: "Registrar", value: value })
                break;

            case 'company_secretary':
                companyDataValue.push({ number: 10, lable: "Company Secretary", value: value })
                break;

            case 'date_of_incorporation':
                var date_of_incorporation = moment.unix(value).format('D MMM YYYY')
                companyDataValue.push({ number: 11, lable: "Date of incorporation", value: date_of_incorporation })
                break;

            case 'website':
                companyDataValue.push({ number: 12, lable: "Website", value: value })
                break;

            case 'board_of_directors':
                companyDataValue.push({ number: 13, lable: "Board of directors", value: value })
                break;

            case 'corporate_bio':
                companyDataValue.push({ number: 14, lable: "Corporate bio", value: value })
                break;

            case 'compliance_status':
                companyDataValue.push({ number: 15, lable: "Compliance status", value: value })
                break;
            default:
                break;
        }
    }

    /**
    * Method for render Stock list item 
    * @param {*} data 
    * @param {*} index  
    */
    renderCompnayInfoData(resData, index) {
        var data = resData.item;
        return (
            <View style={styles.companyInfoViewText}>
                <Text style={[styles.companyInfoHeadingText, this.state.themeStyle.companyInfoHeadingText]}>{data.lable}</Text>
                <Text style={[styles.companyInfoSubtitleText, this.state.themeStyle.companyInfoSubtitleText]}>{(data.value != '' && data.value != null) ? data.value : 'N/A'}</Text>
                <View style={[styles.horizontalSepratorCompanyInfo, this.state.themeStyle.relatedNewsSeparator]} />
            </View>
        )
    }

    /**
     * Method for try againg button 
     */
    tryAgainButtonClick(){
        API.stockInfoWithCompanyInfo(this.responseStockInfoData, str_stockID, false);
    }

    render() {
        if (  this.state.tempCompanyData.length == 0 && this.state.isTimeout ) {
            return (<SafeAreaView style={globalStyles.safeviewStyle}>
                <View style={styles.noInternetTextView}>
                    <Text style={[styles.trendingFooterText, {textAlign:'center'}, this.state.themeStyle.trendingFooterText]}>{globals.timeoutMessage}
                    </Text>
                    
                </View>
            </SafeAreaView>)
        }
        else if (globals.isInternetConnected == false && this.state.tempCompanyData == null ) {
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
        else if(globals.isInternetConnected  && this.state.tempCompanyData == null){
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
                     
                        <View style={[styles.mainRenderView, this.state.themeStyle.mainRenderView,]}>
                            {
                                (_this.state.listData != null) ?
                                    <ScrollView style={{ marginBottom: globals.bottomTabbarHeight }}>
                                        <View>
                                            <FlatList
                                                ref={"companyInfoListView"}
                                                renderItem={(rowData, rowID) => this.renderCompnayInfoData(rowData, rowID)}
                                                data={this.state.tempCompanyData}
                                                keyExtractor={(item, index) => index.toString()}
                                                extraData={this.state}
                                            />
                                        </View>
                                    </ScrollView> : null
                            }
                        </View>
                    </SafeAreaView>
                )
            }
        }

    }
}
// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
    return {
        loader: state.claneLoader_red.loader,
        theme: state.changeTheme_red.theme,
        color: state.changeTabColor_red.color,
        marketStatus: state.checkMarketStatus_red.marketStatus
    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    getshowLoader,
    changeTheme,
    checkMarketStatus,
    changeTabColor,
    getShowModalSearchBar,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(CompanyInfo);
