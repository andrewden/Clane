import React, { Component } from 'react';
import { View, SafeAreaView, Text, Platform, StatusBar, WebView, ActivityIndicator } from 'react-native';
import mainStyles from '../../../assets/styles/app'
import globalStyles from '../../../assets/styles/globalStyles';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import { API } from '../../../lib/api';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import styles from './style';
import Button from '../../../components/Button';

class StockNewsArticle extends Component {

    static navigationOptions = ({ navigation, screenProps, }) => {
        const { state } = navigation;
        return {
            headerStyle: {elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
            headerLeft: <View style={{paddingHorizontal:20}}>
                    <Text style={{fontSize:17,color:colors.headerTextColor}}>{"Done"}</Text>
            </View>,
            headerRight : <View style={{paddingHorizontal:20}}>
                <Ionicons name={"ios-refresh"} color={colors.headerTextColor} size={32} />
            </View>,
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            HtmlCode: '',
            isWebViewAvailable: false,
            loading: false,
            marketStatus: false
        }

    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(globals.globalVars.statusBarColor, true);
        }
        console.log("Article ID " + this.props.navigation.state.params.articleId);
        this.callArticleAPI();    
        
    }

    /**
     * Method for call Article API
     */
    callArticleAPI(){
        var arid = this.props.navigation.state.params.articleId 

        var query = "?symbol=" + this.props.navigation.state.params.symbol + "&articleId=" + arid
        if (globals.globalVars.userId_Global == null) {
            globals.globalVars.userId_Global = "";
        }
        this.setState({ loading: true, marketStatus: this.props.navigation.state.params.marketStatus })
        var payload = {
            articleId: arid,
            symbol: this.props.navigation.state.params.symbol
          };
        API.marketSavePersonalizationData(this.responseRedirectData, payload, true);
    }

    /**
     * Method for get API get of redirect end point
     */
    responseRedirectData = {
        success: (response) => {
            console.log("ARTICLE RESPONSE " + JSON.stringify(response));
            var ss = response.replace(/[\n\t]+/g, '');
            this.setState({ HtmlCode: ss, loading: false })
        },
        error: (err) => {
            this.setState({ isWebViewAvailable: true, loading: false  })
        },
        complete: () => {
            this.setState({ loading: false })
        }
    }

    render() {
        return (
            <SafeAreaView style={[globalStyles.safeviewStyle, this.props.navigation.state.params.theme.mainView]}>
                <View style={[mainStyles.view]}>
                    {(this.state.isWebViewAvailable == true) ? 
                    <View style={styles.articleViewMain}>
                        <Text style={[styles.articleText, this.props.navigation.state.params.theme.articleText]}>Unable to find articles for stock symbol - {this.props.navigation.state.params.symbol}</Text>
                        </View>
                        :
                        (globals.isInternetConnected) ? 
                        <WebView
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            source={{ html: this.state.HtmlCode }}
                        /> :
                         <SafeAreaView style={[globalStyles.safeviewStyle, this.props.navigation.state.params.theme.mainRenderView]}>
                        <View style={[styles.watchlistFooterMain, { marginBottom: 44 }, this.props.navigation.state.params.theme.mainRenderView]}>
                            <View style={styles.noInternetTextView}>
                                <Text style={[styles.trendingFooterText, this.props.navigation.state.params.theme.trendingFooterText]}>{globals.networkNotAvailable}
                                </Text>
                            </View>
                            <View style={styles.tryAgainButtonView}>
                                <Button
                                    onPress={() => this.callArticleAPI()}
                                    textStyle={[styles.buttonText, this.props.navigation.state.params.theme.buttonText]}
                                    buttonStyles={[styles.buttonStyles, this.props.navigation.state.params.theme.buttonStyles]}
                                    text={globals.tryAgain}></Button>
                            </View>
                        </View>
                    </SafeAreaView>  }
                    
                    {(this.state.loading == true && globals.isInternetConnected) ?
                    <View style={styles.activityLoaderCiew}>
                     <ActivityIndicator size="large"  color={((this.state.marketStatus ? colors.blue : colors.blackThemeColor))} /> </View>
                     : null}

                </View>
                <View style={{flexDirection:'row',paddingVertical:10}}>
                    <View style={{flex:1,alignItems:'center'}}>
                        <Feather name={"chevron-left"} size={30} color={colors.gray} />
                    </View>

                    <View style={{flex:1,alignItems:'center'}}>
                        <Feather name={"chevron-right"} size={30} color={colors.gray} />
                    </View>

                    <View style={{flex:1,alignItems:'center'}}>
                        <EvilIcons name={"share-apple"} size={38} color={colors.headerTextColor} />
                    </View>

                    <View style={{flex:1,alignItems:'center'}}>
                        <MaterialCommunityIcons name={"apple-safari"} size={30} color={colors.headerTextColor} />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

export default StockNewsArticle;
