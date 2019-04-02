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
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Switch,
  Alert
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
import { stock } from '../../../assets/images/map'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import DeviceInfo from 'react-native-device-info';
import CategoryData from './categoryData';
import { category } from '../../../assets/images/map';
import { TagSelect } from './react-native-tag-select';
import Countly from 'countly-sdk-react-native';
import { API } from '../../../lib/api';
import DashboardNewsArticleDetail from '../InitialStock/dashboardNewsArticleDetail';
var _this = null
var themeStyle = null;
var TAG = "news preference : "
const data = [
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Entertainment' },
  { id: 3, name: 'Lifestyle' },
  { id: 4, name: 'Politics' },
  { id: 5, name: 'Sports' },
  { id: 6, name: 'Gaming' },
  { id: 7, name: 'Finance' },
  { id: 8, name: 'Start Ups' },
  { id: 9, name: 'Fashion' },

];

// var selData=[];

class NewsPreferences extends Component {

  static navigationOptions = ({ navigation, screenProps, }) => {
    const { state } = navigation;
    return {

      headerStyle: globalStyles.navigationHeaderStyle,
      headerLeft: <View style={{ flexDirection: 'row', flex: 1 }} ><HeaderBackButton onPress={() => navigation.goBack(null)} title='' tintColor='white' />
        <Ionicons name="ios-settings" size={30} color={colors.white} style={{ alignSelf: 'center', marginLeft: -13 }} />
      </View>,

    }
  }

  constructor(props) {
    super(props);

    _this = this
    this.state = {
      switchValue: false,
      isEditClick: false,
      allCategoryData: null,
      isUserPrefAvailabel: false,
      isUserLogin: false, 
      newsPreferenceData: [],
      postNewsPreferenceData: [],
      loading: false,
      isUpdateTag:false,
      isDoneClick: false,
     
    }
  }

  toggleSwitch = (value) => {
    if (globals.globalVars.userIdTemp_Global == null) {
      globals.globalVars.dashboardTitle = globals.screenTitle_newsPreference
      this.props.navigation.navigate("ModalNavigator")
    }
    else {
      this.setState({ switchValue: value })
      console.log('Switch   is: ' + value)
      API.setNotificationToggle(this.responsePutNotificationStatus, globals.globalVars.userIdTemp_Global, true);
    }


  }

  /**
   * api method response of put notification status
   */
  responsePutNotificationStatus = {
    success: (response) => {
      console.log("response put notification status " + JSON.stringify(response));
      try {
        // this.setState({switchValue : response.data.status})

      } catch (error) {
      }
    },
    error: (err) => {
      console.log("error put notification status" + JSON.stringify(err))
    },
    complete: () => {
    }
  }



  componentDidMount() {
    AsyncStorage.getItem(globals.categoryData, (err, result) => {
      if (result !== null) {
        console.log(TAG, "response from async : " + result);
        this.setState({ allCategoryData: result }, () => this.forceUpdate())
      }
    });

    AsyncStorage.getItem(globals.newsPrefData, (err, result) => {
      if (result !== null) {
        this.setState({isUserPrefAvailabel : true})
        console.log(TAG, "response from news pref : " + result);
        this.setState({ newsPreferenceData: JSON.parse(result),isUpdateTag:!this.state.isUpdateTag }, () => {
         // this.forceUpdate()
        })
      }
    }, ()=> this.forceUpdate());

    if(globals.isInternetConnected){
      if (globals.globalVars.userIdTemp_Global != null) {
        globals.globalVars.dashboardTitle = globals.screenTitle_newsPreference
        // NewsPreferences.callApi()
        _this.setState({ loading: true, isUserLogin: true })
        API.getNewRefreshedToken(_this.refreshTokenResponseData);
        // this.setState({isUserLogin: true})
      }
      else{
        this.setState({isUserLogin: false})
      }
    }
    
  

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.blue, true);
    }
  }

  static callApi() {
    _this.setState({ loading: true, isUserLogin: true, isCallTopFeed: true })
    API.getNewRefreshedToken(_this.refreshTokenResponseData);
   
  }

  responseTagWiseArticle = {
    success: (response) => {
      console.log("TOPFEED RESPONSE ==> "+JSON.stringify(response));
      
      // this.setState({ categoryNewsDetail: response.data, loading: false })
      for (let index = 0; index < response.data.length; index++) {
        response.data[index].isLiked = false;
        response.data[index].isBookmarked = false;
      }
      console.log(TAG, "CATE ARTICLE S" + JSON.stringify(response));
      AsyncStorage.setItem(globals.article_tagwise_timeStamp + 'topfeeds', new Date());
      AsyncStorage.setItem(globals.article_tagwise_async + 'topfeeds', JSON.stringify(response.data));

    },
    error: (err) => {
      this.setState({ loading: false, isSeverError: true });
    },
    complete: () => {

    }
  }

  /** 
     * Method to handle response of refresh token method
    */
   refreshTokenResponseData = {
    success: () => {
        try {
          API.getNotificationStatus(_this.responseGetNotificationStatus, globals.globalVars.userIdTemp_Global, true);
          API.getUserNewsPreference(_this.responseGetNewsPreferences, globals.globalVars.userIdTemp_Global, true);
          if (this.state.isCallTopFeed) {
            // API.getArticalTagWise(_this.responseTagWiseArticle, 'topfeeds', globals.globalVars.userIdTemp_Global, true);
            
          }
        } catch (error) {
            console.log('refreshTokenResponseData catch error ' + JSON.stringify(error));
        }
    },
    error: (err) => {
        console.log('refreshTokenResponseData error ' + JSON.stringify(err));
    },
    complete: () => {
    }
}

setUserPreferenceData(newsPrefData){
  this.forceUpdate()
  AsyncStorage.setItem(globals.newsPrefData,JSON.stringify(newsPrefData),()=> this.forceUpdate());
}

async removeUserStorage() {
  try {
    await AsyncStorage.removeItem(globals.globals.user_article_async);
    // this._appendMessage('Selection removed from disk.');
  } catch (error) {
    // this._appendMessage('AsyncStorage error: ' + error.message);
  }
}

async removeUserStorageTime() {
  try {
    await AsyncStorage.removeItem(globals.globals.article_user_timeStamp);
    // this._appendMessage('Selection removed from disk.');
  } catch (error) {
    // this._appendMessage('AsyncStorage error: ' + error.message);
  }
}

  /**
     * api method response of get news preferences
     */
  responseGetNewsPreferences = {
    success: (response) => {
      console.log("response get news preferences: " + JSON.stringify(response));
      // console.log("ARRA "+JSON.parse(response.data));

      this.setState({ loading: false, });
      try {
        //  this.setState({ newsPreferenceData: response.data, isUserPrefAvailabel: true },() => this.forceUpdate())
        if (response.data.length > 0) {
          console.log("CALLL RE");
          // selData = response.data;
          console.log("response.data : " + response.data);
          this.setState({ isUserPrefAvailabel: true, newsPreferenceData: response.data }, () => this.setUserPreferenceData(this.state.newsPreferenceData))
          if (this.state.isDoneClick) {
            this.removeUserStorage();
            this.removeUserStorageTime();
            
            this.props.navigation.navigate("DashboardNewsArticleDetail", { title: 'Top News', dashboardNewsDetailData: globals.globalVars.sortedTopNewsData, theme: this.props.theme })
            DashboardNewsArticleDetail.callUserArticleList();
            

          }
          // this.props.navigation.navigate("DashboardNewsArticleDetail", { title: 'Top News', dashboardNewsDetailData: globals.globalVars.sortedTopNewsData, theme: this.props.theme })
        }
        else {
          this.setState({ isUserPrefAvailabel: true})
        }
      } catch (error) {
        this.setState({ loading: false });

      }
    },
    error: (err) => {
      this.setState({ loading: false });
      console.log(JSON.stringify(err))
    },
    complete: () => {
      this.setState({ loading: false });
    }
  }
  /**
   * api method response of get notification status
   */
  responseGetNotificationStatus = {
    success: (response) => {
      console.log("response get notification status " + JSON.stringify(response));
      this.setState({ loading: false });
      try {
        this.setState({ switchValue: response.data.status })

      } catch (error) {
        this.setState({ loading: false });

      }
    },
    error: (err) => {
      console.log(JSON.stringify(err))
      this.setState({ loading: false });

    },
    complete: () => {
      this.setState({ loading: false });
    }
  }

  renderPrefTitle(isEdit) {
    if (isEdit) {

      return (
        <Text style={styles.selectPrefView} >Select Your preference</Text>
      )
    } else {
      return (
        <Text style={styles.selectPrefView} >Set Your Preferences</Text>
      )
    }
  }

  doneEditClick(isEdit) {

    if (!isEdit) {

      let event = { "key": globals.event_NewsPreferenaceDone, "count": 1 };
      event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
      Countly.recordEvent(event);

      return (
        <View style={styles.row}>
          <Text style={styles.prefEditView}>Edit</Text>
          <Image source={stock.pencil_writing} style={styles.editIcon} tintColor={colors.blue} resizeMode={'contain'} />
        </View>
      )
    }
    else {

      let event = { "key": globals.event_NewsPreferenaceDone, "count": 1 };
      event.segmentation = globals.getAnalyticBasicDataCountly(globals.carrierNetworkStr, globals.carrierNetworkTypeStr, globals.globalVars.userId_Global);
      Countly.recordEvent(event);

      return (
        <TouchableOpacity onPress={() => this.getAllPreferences()}>
          <Text style={styles.prefDoneView}>Done</Text>
        </TouchableOpacity>
      )
    }
  }
  changeButtonStatus() {
    if (this.state.isEditClick) {
      this.setState({ isEditClick: false })
    }
    else {
      this.setState({ isEditClick: true })
    }
  }

  /**
   * method of set selected preference data which have to post for api
   */
  getAllPreferences() {
    if (this.tag.itemsSelected != undefined && this.tag.itemsSelected != null) {
      this.setState({isDoneClick : true})
      let sendNewsPrefData = this.tag.itemsSelected
      this.setState({ postNewsPreferenceData: sendNewsPrefData }, () => this.sendNewsPrefItems())

    }
  }

  checkLogin() {
    this.props.navigation.navigate("ModalNavigator")
  }
  /**
   * Api call send for news preference data
   */
  sendNewsPrefItems() {
    var categoriesData = {
      categories: this.state.postNewsPreferenceData
    };
    // alert(JSON.stringify(categoriesData))
    if (globals.isLoggedIn == 'false') {
      this.checkLogin();
      globals.globalVars.dashboardTitle = globals.screenTitle_newsPreference

    }
    else {
      if(globals.isInternetConnected){
        API.setUserNewsPreference(this.responseSetUserNewsPreference, categoriesData, globals.globalVars.userIdTemp_Global, categoriesData, true);
      }
      else{
        alert(globals.networkNotAvailable);
      }

    }
  }

  /**
   * api method response of put notification status
   */
  responseSetUserNewsPreference = {
    success: (response) => {
      console.log("response of post SetUserNewsPreference " + JSON.stringify(response));
      try {
        // Alert.alert(globals.APP_NAME, response.message);
        this.setState({isEditClick: false})
        API.getUserNewsPreference(this.responseGetNewsPreferences, globals.globalVars.userIdTemp_Global, true);
      } catch (error) {
      }
    },
    error: (err) => {
      console.log("error SetUserNewsPreference" + JSON.stringify(err))
    },
    complete: () => {
    }
  }

  // renderSelectedTag(){
  //   console.log("== renderSelectedTag")
  //   // var array = JSON.parse("[" + this.state.newsPreferenceData + "]");
  //   // console.log("RENDER SELECTED "+ array);
  //   // let arr = array.split(',');
  //   console.log("RENDER SELECTED:"+  (this.state.newsPreferenceData));
  //   let arrValue = null;
  //   let getValue = this.state.newsPreferenceData;
  //   let nArr = [4,1];

  //   //console.log(" == arrValue : " + getValue)
  //   //console.log(" == typeof : "+ typeof getValue);       
  //   //console.log(" == Array.from : "+ nArr);   

  //   return(
  //     <TagSelect
  //       ref={(tag) => {
  //         this.tag = tag;
  //       }}
  //       isEdit={this.state.isEditClick}
  //       navigate={this.props.navigation.navigate}
  //       // value={selData}
  //       value={nArr}
  //       data={(this.state.allCategoryData != null) ? JSON.parse(this.state.allCategoryData) : null}
  //       viewIcon={this.state.isEditClick}
  //       itemStyle={styles.roundedTagView}
  //       itemLabelStyle={styles.tagLableView}
  //       itemStyleSelected={styles.tagItemSelected}
  //       itemLabelStyleSelected={styles.tagLabelSelected}
  //     /> 
  //   )
  // }
  renderAllTag() {
    console.log("== renderAllTag");
    let getValue = JSON.parse(JSON.stringify(this.state.newsPreferenceData));
    console.log('get value : ' + getValue)
    //if (globals.isLoggedIn == 'false') {
      return (
        <TagSelect
          key={this.state.isUpdateTag}
          ref={(tag) => {
            this.tag = tag;
          }}
          isEdit={this.state.isEditClick}
          navigate={this.props.navigation.navigate}
          value={(globals.isLoggedIn == 'false')?[]:(getValue.length == 0) ? getValue : getValue}
          data={(this.state.allCategoryData != null) ? JSON.parse(this.state.allCategoryData) : JSON.parse(this.state.allCategoryData)}
          viewIcon={this.state.isEditClick}
          itemStyle={styles.roundedTagView}
          itemLabelStyle={styles.tagLableView}
          itemStyleSelected={styles.tagItemSelected}
          itemLabelStyleSelected={styles.tagLabelSelected}
        />
      )
    //}     
    // else{
    //   console.log("length getValue : " + getValue.length)
    //   return (
    //     <TagSelect
    //     ref={(tag) => {
    //       this.tag = tag;
    //     }}
    //     isEdit={this.state.isEditClick}
    //     navigate={this.props.navigation.navigate}
    //     value={(getValue.length == 0) ? getValue : getValue} 
    //     data={(this.state.allCategoryData != null) ? JSON.parse(this.state.allCategoryData) : JSON.parse(this.state.allCategoryData)}
    //     viewIcon={this.state.isEditClick}
    //     itemStyle={styles.roundedTagView}
    //     itemLabelStyle={styles.tagLableView}
    //     itemStyleSelected={styles.tagItemSelected}
    //     itemLabelStyleSelected={styles.tagLabelSelected}
    //   />

    //   // <View></View>
    //   )
    // }
    // else {
    //   console.log("length 0--no")
    //   console.log("getvalue length : " +getValue.length)
    //     return (
    //       <TagSelect
    //         ref={(tag) => {
    //           this.tag = tag;
    //         }}
    //         isEdit={this.state.isEditClick}
    //         navigate={this.props.navigation.navigate}
    //         value={getValue}
    //         data={(this.state.allCategoryData != null) ? JSON.parse(this.state.allCategoryData) : JSON.parse(this.state.allCategoryData)}
    //         viewIcon={this.state.isEditClick}
    //         itemStyle={styles.roundedTagView}
    //         itemLabelStyle={styles.tagLableView}
    //         itemStyleSelected={styles.tagItemSelected}
    //         itemLabelStyleSelected={styles.tagLabelSelected}
    //       />
    //     )
      
     
    // }


  }

  render() {
    console.log("-------------------> " + (this.state.allCategoryData))
    console.log("news preference data---------->" + (this.state.newsPreferenceData))
    console.log("== this.state.isUserPrefAvailabel :  " + this.state.isUserPrefAvailabel)

    // if (this.state.loading) {
    //   return (<View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}><ActivityIndicator size="large" color={colors.blackColor} /></View>)
    // } else {
      return (
        // <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: colors.blue }]}>
        <View style={globalStyles.mainViewSearchBar} removeClippedSubviews={false}>
          <View style={globalStyles.categorySearchbarTopView}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Ionicons name="ios-arrow-back" size={30} color={colors.white} />
            </TouchableOpacity>
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Text style={{ color: colors.white, marginLeft: globals.screenWidth * 0.03, fontSize: globals.font_17, fontFamily: globals.fontSFProTextRegular }}>Back</Text>
              </TouchableOpacity>
              <Text style={{ color: colors.white, marginLeft: globals.screenWidth * 0.15, fontSize: globals.font_17, fontFamily: globals.fontSFProTextSemibold }}>Preferences</Text>
            </View>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.gray }} >
            <View style={styles.notificationMainView} >
              <Text style={styles.notificationText}>Notifications</Text>
              <Switch style={styles.switchView}
                onValueChange={this.toggleSwitch}
                value={this.state.switchValue} >
              </Switch>
            </View>
            <View style={styles.preferenceSecondView} >
              <View style={{ flexDirection: 'row', justifyContent: "space-between" }} >
                {this.renderPrefTitle(this.state.isEditClick)}
                <TouchableOpacity onPress={() => this.changeButtonStatus()}>
                  {this.doneEditClick(this.state.isEditClick)}
                </TouchableOpacity>
              </View>

              
              <View style={styles.tagMainView} >
                
                {
                  //  (this.state.loading) ? <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}><ActivityIndicator size="large" color={colors.blackColor} /></View> : (!this.state.isUserLogin) ? this.renderAllTag()  : ( this.state.isUserPrefAvailabel  ) ? this.renderAllTag() : null 
                  (this.state.loading) ? <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}><ActivityIndicator size="large" color={colors.blackColor} /></View> : (!this.state.isUserLogin) ? this.renderAllTag()  : ( this.state.isUserPrefAvailabel  ) ? this.renderAllTag() : null
                }
              </View>

            </View>
          </View>

        </View>


        // </SafeAreaView>
      )
    // }

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

export default connect(mapStateToProps, mapDispatchToProps)(NewsPreferences);

