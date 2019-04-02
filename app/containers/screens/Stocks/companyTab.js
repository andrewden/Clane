import React, { Component } from 'react';
import { View, SafeAreaView, AsyncStorage,TouchableOpacity,Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import { HeaderBackButton, NavigationEvents } from 'react-navigation';
import { changeTheme } from '../../../redux/actions/changeTheme';
import CompanyInfo from './companyInfo';
import MarketData from './marketData';
import styles from './style';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { checkMarketStatus } from '../../../redux/actions/checkMarketStatusModel';
import globalStyles from '../../../assets/styles/globalStyles';

var str_stockID = "";
var theme = "";

const initialLayout = {
  height: 0,
  width: globals.WINDOW.width,
};

class CompanyTabs extends Component {

  static navigationOptions = ({ navigation, screenProps, }) => {
    const { state } = navigation;
    return {
      tabBarOnPress({ navigation, defaultHandler }) {
        navigation.state.params.onTabFocus();
        defaultHandler();
      },
      header: <View
        style={[styles.headerStyle, { backgroundColor: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.bgColor : colors.white, height: (globals.iPhoneX) ? 88 : 64, }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <HeaderBackButton onPress={() => navigation.goBack(null)} title='' tintColor={(navigation.state.params.backIconColor != null) ? navigation.state.params.backIconColor : colors.backLight} />
        </TouchableOpacity>
        <View style={styles.headerTitleView}>
          <Text style={[styles.headertitleText, { color: (navigation.state.params.titleColor != null) ? navigation.state.params.titleColor : colors.blackColor }]}>{navigation.state.params.title}</Text>
          
        </View>
        <View style={{ flex: 0.2 }} />
      </View>,
      // title: navigation.state.params.title,
      // headerStyle: { backgroundColor: (navigation.state.params != undefined && navigation.state.params != null) ? navigation.state.params.bgColor : colors.blue, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
      // headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title='' tintColor='white' />
    }
  }

  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      onTabFocus: this.handleTabFocus
    });
    _this = this
  }

  handleTabFocus = () => {
    // perform your logic here
    //alert("Market Company focus")
  };

  componentWillReceiveProps(newProps) {

    this.setState({ modalVisible: newProps.searchbar_modal })
    if (newProps.theme != undefined) {
      this.setState({ themeStyle: newProps.theme })
    }
    if (newProps.marketStatus != undefined) {
      console.log("this.marketStatus " + this.marketStatus);
      console.log("newProps.marketStatus " + newProps.marketStatus);

      if (this.marketStatus !== newProps.marketStatus) {
        this.marketStatus = newProps.marketStatus
        console.log("newProps.marketStatus " + newProps.marketStatus);
        this.props.navigation.setParams({
          bgColor: (newProps.marketStatus) ? colors.white : colors.blackThemeColor, titleColor: (this.props.marketStatus) ? colors.blackThemeColor : colors.white,
          backIconColor: (this.props.marketStatus) ? colors.backLight : colors.white
        })
      }
    }
  }

  componentDidMount() {

    this.setState({ themeStyle: this.props.theme })
    str_stockID = this.props.navigation.state.params.str_stockID
    theme = this.props.navigation.state.params.theme
    console.log("PROPES IN COMAPNY TAB " + JSON.stringify(this.props.theme));
    console.log("PROPES IN COMAPNY TAB str_stockID " + JSON.stringify(this.props.navigation.state.params.str_stockID));
    this.props.navigation.setParams({
      bgColor: (this.props.marketStatus) ? colors.white : colors.blackThemeColor, titleColor: (this.props.marketStatus) ? colors.blackThemeColor : colors.white,
      backIconColor: (this.props.marketStatus) ? colors.backLight : colors.white
    })
  }


  state = {
    index: 0,
    themeStyle: null,
    routes: [{ key: 'marketdata', title: 'Market Data', str_stockID: this.props.navigation.state.params.str_stockID, theme: this.props.navigation.state.params.theme },
    { key: 'companyinfo', title: 'Company Info', str_stockID: this.props.navigation.state.params.str_stockID, theme: this.props.navigation.state.params.theme },],
  };

  _handleIndexChange = index =>
    this.setState({ index, });

  _renderHeader = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={(this.state.themeStyle != null) ? this.state.themeStyle.indicatorCompany : ""}
      style={(this.state.themeStyle != null) ? this.state.themeStyle.tabbar : ""}
      tabStyle={(this.state.themeStyle != null) ? this.state.themeStyle.tabCompany : ""}
      labelStyle={(this.state.themeStyle != null) ? this.state.themeStyle.label : ""}
    />
  );

  _renderScene = SceneMap({
    marketdata: MarketData,
    companyinfo: CompanyInfo,
  });

  render() {
    return (
      <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: this.props.theme.mainView.backgroundColor }]}>

        <View style={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
          <TabViewAnimated
            keyboardShouldPersistTaps='handled'
            style={styles.topBackgroundView}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderHeader={this._renderHeader}
            onIndexChange={this._handleIndexChange}
            initialLayout={initialLayout}
          />
        </View>
      </SafeAreaView>
    );
  }
}

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
  return {
    theme: state.changeTheme_red.theme,
    marketStatus: state.checkMarketStatus_red.marketStatus,
    screen_name: state.showModalSearchBar_red.screen_name,
  }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
  changeTheme,
  checkMarketStatus
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(CompanyTabs);