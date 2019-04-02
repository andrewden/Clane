import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../../assets/fonts/fontello/config.json';
import { createBottomTabNavigator } from 'react-navigation';
import { BottomTabBar } from 'react-navigation-tabs';
import DiscoverNav from './_DiscoverNavigator';
import LocateNav from './_LocateNavigator';
import ScanNav from './_ScanNavigator';
import FriendsNav from './_FriendsNavigator';
import MeNavigator from './_MeNavigator';
import { blue, darkGray, grayPlaceHolder } from '../../assets/styles/color';

const iconHeight = 20;
const IconFontello = createIconSetFromFontello(fontelloConfig);

const TabNav = createBottomTabNavigator({
    Discover: {
        screen: DiscoverNav,
        navigationOptions: {
            borderBottomWidth: 0,
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ tintColor }) => (
                <View style={[styles.tabViewBox]}>
                    <IconFontello name="tab-dashboard-dashboard" style={[styles.tabIcon]} size={iconHeight} color={tintColor} />
                    <Text style={[styles.tabText, { color: tintColor }]}>Dashboard</Text>
                </View>
            )
        }
    },

    Locator: {
        screen: LocateNav,
        navigationOptions: {
            tabBarLabel: 'Discover',
            tabBarIcon: ({ tintColor }) => (
                <View style={[styles.tabViewBox]}>
                    <IconFontello name="tab-dashboard-discover" style={[styles.tabIcon]} size={iconHeight} color={tintColor} />
                    <Text style={[styles.tabText, { color: tintColor }]}>Discover</Text>
                </View>
            )
        }
    },
    Scan: {
        screen: ScanNav,
        navigationOptions: {
            tabBarLabel: 'Scan',
            tabBarIcon: ({ tintColor }) => (
                <View style={[styles.tabViewBox]}>
                    <IconFontello name="tab-dashboard-scan" style={[styles.tabIcon]} size={iconHeight} color={tintColor} />
                    <Text style={[styles.tabText, { color: tintColor }]}>Scan</Text>
                </View>
            )
        }
    },
    Friends: {
        screen: FriendsNav,
        navigationOptions: {
            tabBarLabel: 'Friends',
            tabBarIcon: ({ tintColor }) => (
                <View style={[styles.tabViewBox]}>
                    <IconFontello name="tab-dashboard-friends" style={[styles.tabIcon]} size={iconHeight} color={tintColor} />
                    <Text style={[styles.tabText, { color: tintColor }]}>Friends</Text>
                </View>

            )
        }
    },
    Me: {
        screen: MeNavigator,
        navigationOptions: {
            tabBarLabel: 'Me',
            tabBarIcon: ({ tintColor }) => (
                <View style={[styles.tabViewBox]}>
                    <IconFontello name="tab-dashboard-me" style={[styles.tabIcon]} size={iconHeight} color={tintColor} />
                    <Text style={[styles.tabText, { color: tintColor }]}>Me</Text>
                </View>
            )
        }
    }
}, {
        tabBarOptions: {
            activeTintColor: blue,
            inactiveTintColor: darkGray,
            style: {
                backgroundColor: '#FFF',
                height: 49,
                borderTopColor: 'transparent',
                borderTopWidth: 1,
                paddingRight: 10,
                paddingLeft: 10,
                borderTopWidth: 1,
                borderTopColor: grayPlaceHolder
            },
            showLabel: false,
            showIcon : true,
        },
        tabBarComponent : BottomTabBar,
        initialRouteName: 'Discover',
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: false
    }, []);

var styles = StyleSheet.create({
    tabText: {
        fontSize: 10,
        fontWeight: "600",
        flex: 4,
    },
    tabViewBox: {
        flex: 1,
        alignItems: "center",
    },
    tabIcon: {
        flex: 5,
        alignSelf: "center",
        marginTop: 7,
        marginBottom: 5
    },
});

export default TabNav;