import React from 'react';
import { View, Image, Text, StyleSheet, AsyncStorage } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import StockMarketsNav from './_StockMarketsNavigator';
import StockWatchlistNav from './_StockWatchListNavigator';
import StockNotificationNav from './_StockNotificationsNavigator';
import { blue, darkGray, grayPlaceHolder, white } from '../../assets/styles/color';
import TabBar from '../../components/TabBar';
import { stock } from '../../assets/images/map'
import * as globals from '../../lib/globals';

 
const StocksTabNav = createBottomTabNavigator({

    
    Markets: {
        screen: StockMarketsNav,
        navigationOptions: {
            tabBarLabel: 'Markets',
             

            tabBarIcon: ({ tintColor }) => (
                <View style={[styles.tabViewBox]}>
                    <Image source={stock.market} style={[styles.tabIcon, {tintColor: tintColor, }]} />
                     
                    <Text style={[styles.tabText, { color: tintColor }]}>Markets</Text>
                </View>
            )
        }
    },
    Watchlist: {
        screen: StockWatchlistNav,
         
        navigationOptions: {
            tabBarLabel: 'Portfolio',
            tabBarIcon: ({ tintColor }) => (
                <View style={[styles.tabViewBox]}>
                     
                    <Image source={stock.watchlist} style={[styles.tabIcon, {tintColor: tintColor}]} />

                    <Text style={[styles.tabText, { color: tintColor }]}>Portfolio</Text>
                </View>
            )
        }
    },
    Notification: {
        screen: StockNotificationNav,
        
        navigationOptions: {
            tabBarLabel: 'News',
            tabBarIcon: ({ tintColor }) => (
                <View style={[styles.tabViewBox]}>
                    <Image source={stock.news} style={[styles.tabIcon, {tintColor: tintColor}]} />
                    <Text style={[styles.tabText, { color: tintColor }]}>News</Text>
                </View>
            )
        }
    },
}, {
        tabBarOptions: {
            activeTintColor: blue,
            inactiveTintColor: darkGray,
            lazy: false,
            style: {
                backgroundColor: white,
                height: 49,
                borderTopWidth: 1,
                paddingRight: 10,
                paddingLeft: 10,
                borderTopWidth: 1,
                borderTopColor: grayPlaceHolder
            },
            showLabel: false,
            showIcon: true,
        },
        navigationOptions: {
            tabBarOnPress: ({ navigation, defaultHandler }) => {
                globals.currentNavigatorValue = navigation.state.key
                AsyncStorage.setItem(globals.currentNavigator,navigation.state.key);
                defaultHandler();
            }
        },
        tabBarComponent: props => <TabBar {...props}  />,
        initialRouteName: 'Markets',
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: false
    }, []);

var styles = StyleSheet.create({
    tabText: {
        fontSize: 10,
        // fontWeight: "600",
        flex: 4,
        fontFamily: globals.fontSFProTextRegular
    },
    tabViewBox: {
        flex: 1,
        alignItems: "center",
    },
    tabIcon: {
        flex: 5,
        alignSelf: "center",
        marginTop: 7,
        marginBottom: 5,
        height: 25,
        resizeMode:'contain',
        width: 25
        
    },
});
export default StocksTabNav;